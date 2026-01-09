-- ============================================
-- opinieOn - DATABASE SCHEMA
-- ============================================
-- System zarządzania opiniami dla 3 portali
-- Plany: Start (1 firma, 1 portal), Pro (1 firma, 3 portale + analityka), Biznes (3 firmy, 3 portale + analityka)

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE subscription_plan AS ENUM ('START', 'PRO', 'BIZNES');
CREATE TYPE subscription_status AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid');

-- ============================================
-- TABLES
-- ============================================

-- Portale z opiniami (3 główne portale)
CREATE TABLE portals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  settings JSONB DEFAULT '{
    "allow_replies": true,
    "show_rankings": true,
    "custom_fields": {}
  }'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rozszerzone dane użytkownika (uzupełnienie auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Firmy użytkowników
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nip TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  phone TEXT,
  website TEXT,
  email TEXT,
  gmb_link TEXT,
  description TEXT,
  geolocation JSONB, -- {lat: number, lng: number}
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subskrypcje Stripe
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  plan subscription_plan NOT NULL,
  status subscription_status NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_active_subscription UNIQUE (user_id, company_id)
);

-- Profile firm na portalach (firma może być aktywna na różnych portalach)
CREATE TABLE company_portal_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  portal_id UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  profile_url TEXT,
  custom_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, portal_id)
);

-- Opinie
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  portal_id UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_verified BOOLEAN DEFAULT false,
  response_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Odpowiedzi na opinie
CREATE TABLE review_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dostęp do portali dla planów (konfiguracja)
CREATE TABLE plan_portal_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan subscription_plan NOT NULL,
  portal_id UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plan, portal_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_reviews_company_id ON reviews(company_id);
CREATE INDEX idx_reviews_portal_id ON reviews(portal_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_date ON reviews(review_date);
CREATE INDEX idx_review_replies_review_id ON review_replies(review_id);
CREATE INDEX idx_company_portal_profiles_company ON company_portal_profiles(company_id);
CREATE INDEX idx_company_portal_profiles_portal ON company_portal_profiles(portal_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_portal_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_replies ENABLE ROW LEVEL SECURITY;

-- Users: każdy widzi tylko swoje dane
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Companies: użytkownik widzi tylko swoje firmy
CREATE POLICY "Users can view own companies"
  ON companies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own companies"
  ON companies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own companies"
  ON companies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own companies"
  ON companies FOR DELETE
  USING (auth.uid() = user_id);

-- Subscriptions: użytkownik widzi tylko swoje subskrypcje
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Company Portal Profiles: dostęp tylko do profili swoich firm
CREATE POLICY "Users can view profiles of own companies"
  ON company_portal_profiles FOR SELECT
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage profiles of own companies"
  ON company_portal_profiles FOR ALL
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Reviews: użytkownik widzi opinie tylko swoich firm
CREATE POLICY "Users can view reviews of own companies"
  ON reviews FOR SELECT
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create reviews for own companies"
  ON reviews FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update reviews of own companies"
  ON reviews FOR UPDATE
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete reviews of own companies"
  ON reviews FOR DELETE
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Review Replies: użytkownik widzi i dodaje odpowiedzi tylko do opinii swoich firm
CREATE POLICY "Users can view replies to own company reviews"
  ON review_replies FOR SELECT
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create replies for own companies"
  ON review_replies FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own replies"
  ON review_replies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own replies"
  ON review_replies FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Funkcja do sprawdzania dostępu do portalu na podstawie planu
CREATE OR REPLACE FUNCTION has_portal_access(p_user_id UUID, p_portal_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan subscription_plan;
  has_access BOOLEAN;
BEGIN
  -- Pobierz aktualny plan użytkownika
  SELECT s.plan INTO user_plan
  FROM subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status IN ('active', 'trialing')
  ORDER BY s.created_at DESC
  LIMIT 1;

  -- Jeśli brak aktywnej subskrypcji, brak dostępu
  IF user_plan IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Sprawdź czy plan ma dostęp do portalu
  SELECT EXISTS(
    SELECT 1
    FROM plan_portal_access ppa
    WHERE ppa.plan = user_plan
      AND ppa.portal_id = p_portal_id
  ) INTO has_access;

  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funkcja do aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggery dla updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portals_updated_at BEFORE UPDATE ON portals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_replies_updated_at BEFORE UPDATE ON review_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA - 3 główne portale
-- ============================================
INSERT INTO portals (name, domain, slug, settings) VALUES
  ('Dobre Firmy', 'dobre-firmy.pl', 'dobre-firmy', 
   '{"allow_replies": true, "show_rankings": true, "custom_fields": {}}'::jsonb),
  ('Arena Biznesu', 'arena-biznesu.pl', 'arena-biznesu', 
   '{"allow_replies": true, "show_rankings": true, "custom_fields": {}}'::jsonb),
  ('Panteon Firm', 'panteonfirm.pl', 'panteonfirm', 
   '{"allow_replies": true, "show_rankings": false, "custom_fields": {}}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Konfiguracja dostępu do portali dla każdego planu
DO $$
DECLARE
  portal_dobre_firmy UUID;
  portal_arena UUID;
  portal_panteon UUID;
BEGIN
  -- Pobierz ID portali
  SELECT id INTO portal_dobre_firmy FROM portals WHERE slug = 'dobre-firmy';
  SELECT id INTO portal_arena FROM portals WHERE slug = 'arena-biznesu';
  SELECT id INTO portal_panteon FROM portals WHERE slug = 'panteonfirm';

  -- START: tylko dobre-firmy
  INSERT INTO plan_portal_access (plan, portal_id) 
  VALUES ('START', portal_dobre_firmy)
  ON CONFLICT DO NOTHING;

  -- PRO: wszystkie 3 portale
  INSERT INTO plan_portal_access (plan, portal_id) 
  VALUES 
    ('PRO', portal_dobre_firmy),
    ('PRO', portal_arena),
    ('PRO', portal_panteon)
  ON CONFLICT DO NOTHING;

  -- BIZNES: wszystkie 3 portale
  INSERT INTO plan_portal_access (plan, portal_id) 
  VALUES 
    ('BIZNES', portal_dobre_firmy),
    ('BIZNES', portal_arena),
    ('BIZNES', portal_panteon)
  ON CONFLICT DO NOTHING;
END $$;
