-- Create review_queue table
CREATE TABLE IF NOT EXISTS review_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  portal_id UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE,
  
  -- Review content
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  
  -- Review date (from past, must be <= created_at)
  review_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed')),
  
  -- Metadata
  generation_prompt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  error_message TEXT,
  
  -- Ensure review_date is not in the future relative to creation
  CONSTRAINT review_date_not_future CHECK (review_date <= created_at),
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id),
  CONSTRAINT fk_portal FOREIGN KEY (portal_id) REFERENCES portals(id)
);

-- Add index for efficient querying
CREATE INDEX IF NOT EXISTS idx_review_queue_review_date ON review_queue(review_date, status);
CREATE INDEX IF NOT EXISTS idx_review_queue_user ON review_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_review_queue_status ON review_queue(status);

-- Enable RLS
ALTER TABLE review_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own queue items"
  ON review_queue FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own queue items"
  ON review_queue FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own queue items"
  ON review_queue FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own queue items"
  ON review_queue FOR DELETE
  USING (auth.uid() = user_id);
