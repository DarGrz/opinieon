-- review-automation.sql
-- Run this in Supabase SQL Editor

-- 1. Table for review campaigns
CREATE TABLE IF NOT EXISTS review_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT DEFAULT 'api', -- 'api', 'manual', 'webhook'
  portals JSONB DEFAULT '["opinieon"]', -- e.g. ["opinieon", "google"]
  email_subject TEXT DEFAULT 'Jak oceniasz swój ostatni zakup?',
  email_body TEXT,
  auto_send_delay_hours INTEGER DEFAULT 24,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table for customers (people who made a purchase)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  metadata JSONB DEFAULT '{}', -- Store order_id, product_name, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table for invitations sent
CREATE TABLE IF NOT EXISTS review_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES review_campaigns(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'opened', 'clicked', 'converted'
  sent_via TEXT, -- 'email', 'sms'
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE review_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_invitations ENABLE ROW LEVEL SECURITY;

-- 5. Policies (Only companies can see their own data)
CREATE POLICY "Companies can manage their own campaigns" ON review_campaigns
    FOR ALL USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

CREATE POLICY "Companies can manage their own customers" ON customers
    FOR ALL USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

CREATE POLICY "Companies can manage their own invitations" ON review_invitations
    FOR ALL USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

-- Specific policy for public to "open" invitations by token (simplified for now)
CREATE POLICY "Public can view invitation by token" ON review_invitations
    FOR SELECT USING (true);
