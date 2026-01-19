-- ============================================
-- opinieOn - SCHEMAT BAZY DANYCH
-- ============================================
-- Skopiuj całą zawartość tego pliku i wklej w Supabase SQL Editor
-- Następnie kliknij "Run" aby wykonać

-- ============================================
-- 1. EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. ENUMS
-- ============================================
DO $$ BEGIN
  CREATE TYPE subscription_plan AS ENUM ('START', 'PRO', 'BIZNES');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 3. TABELE
-- ============================================

-- Portale z opiniami
CREATE TABLE IF NOT EXISTS portals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  settings JSONB DEFAULT '{"allow_replies": true, "show_rankings": true, "custom_fields": {}}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rozszerzone dane użytkownika
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Firmy
CREATE TABLE IF NOT EXISTS companies (
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
  category TEXT,
  geolocation JSONB,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subskrypcje
CREATE TABLE IF NOT EXISTS subscriptions (
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

-- Profile firm na portalach
CREATE TABLE IF NOT EXISTS company_portal_profiles (
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
CREATE TABLE IF NOT EXISTS reviews (
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
  status TEXT DEFAULT 'published',
  response_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Odpowiedzi na opinie
CREATE TABLE IF NOT EXISTS review_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dostęp do portali dla planów
CREATE TABLE IF NOT EXISTS plan_portal_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan subscription_plan NOT NULL,
  portal_id UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plan, portal_id)
);

-- ============================================
-- 4. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_company_id ON reviews(company_id);
CREATE INDEX IF NOT EXISTS idx_reviews_portal_id ON reviews(portal_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews(review_date);
CREATE INDEX IF NOT EXISTS idx_review_replies_review_id ON review_replies(review_id);
CREATE INDEX IF NOT EXISTS idx_company_portal_profiles_company ON company_portal_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_company_portal_profiles_portal ON company_portal_profiles(portal_id);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_portal_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_replies ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can view own companies" ON companies;
DROP POLICY IF EXISTS "Users can create own companies" ON companies;
DROP POLICY IF EXISTS "Users can update own companies" ON companies;
DROP POLICY IF EXISTS "Users can delete own companies" ON companies;

CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can create own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;

CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can view profiles of own companies" ON company_portal_profiles;
DROP POLICY IF EXISTS "Users can manage profiles of own companies" ON company_portal_profiles;


-- Companies policies
CREATE POLICY "Users can view own companies" ON companies FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can view reviews of own companies" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews for own companies" ON reviews;
DROP POLICY IF EXISTS "Users can update reviews of own companies" ON reviews;
DROP POLICY IF EXISTS "Users can delete reviews of own companies" ON reviews;

CREATE POLICY "Users can create own companies" ON companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own companies" ON companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own companies" ON companies FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions policies
DROP POLICY IF EXISTS "Users can view replies to own company reviews" ON review_replies;
DROP POLICY IF EXISTS "Users can create replies for own companies" ON review_replies;
DROP POLICY IF EXISTS "Users can update own replies" ON review_replies;
DROP POLICY IF EXISTS "Users can delete own replies" ON review_replies;

CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Company Portal Profiles policies
CREATE POLICY "Users can view profiles of own companies" ON company_portal_profiles FOR SELECT 
  USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage profiles of own companies" ON company_portal_profiles FOR ALL 
  USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

-- Reviews policies
CREATE POLICY "Users can view reviews of own companies" ON reviews FOR SELECT 
  USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));
CREATE POLICY "Users can create reviews for own companies" ON reviews FOR INSERT 
  WITH CHECK (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));
CREATE POLICY "Users can update reviews of own companies" ON reviews FOR UPDATE 
  USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete reviews of own companies" ON reviews FOR DELETE 
  USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

-- Review Replies policies
CREATE POLICY "Users can view replies to own company reviews" ON review_replies FOR SELECT 
  USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));
CREATE POLICY "Users can create replies for own companies" ON review_replies FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own replies" ON review_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON review_replies FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 6. FUNCTIONS
-- ============================================

-- Funkcja sprawdzająca dostęp do portalu
CREATE OR REPLACE FUNCTION has_portal_access(p_user_id UUID, p_portal_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan subscription_plan;
  has_access BOOLEAN;
BEGIN
  SELECT s.plan INTO user_plan
  FROM subscriptions s
  WHERE s.user_id = p_user_id AND s.status IN ('active', 'trialing')
  ORDER BY s.created_at DESC LIMIT 1;

  IF user_plan IS NULL THEN RETURN FALSE; END IF;

  SELECT EXISTS(
    SELECT 1 FROM plan_portal_access ppa
    WHERE ppa.plan = user_plan AND ppa.portal_id = p_portal_id
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

-- Funkcja automatycznego tworzenia profilu użytkownika po rejestracji
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger automatycznego tworzenia profilu użytkownika
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Triggery dla updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
DROP TRIGGER IF EXISTS update_portals_updated_at ON portals;
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
DROP TRIGGER IF EXISTS update_review_replies_updated_at ON review_replies;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portals_updated_at BEFORE UPDATE ON portals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_review_replies_updated_at BEFORE UPDATE ON review_replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. SEED DATA
-- ============================================

-- Dodaj 3 portale
INSERT INTO portals (name, domain, slug, settings) VALUES
  ('Dobre Firmy', 'dobre-firmy.pl', 'dobre-firmy', '{"allow_replies": true, "show_rankings": true, "custom_fields": {}}'::jsonb),
  ('Arena Biznesu', 'arena-biznesu.pl', 'arena-biznesu', '{"allow_replies": true, "show_rankings": true, "custom_fields": {}}'::jsonb),
  ('Panteon Firm', 'panteonfirm.pl', 'panteonfirm', '{"allow_replies": true, "show_rankings": false, "custom_fields": {}}'::jsonb),
  ('OpinieOn', 'opinieon.pl', 'opinieon', '{"allow_replies": true, "show_rankings": true, "custom_fields": {}}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Konfiguracja dostępu do portali
DO $$
DECLARE
  portal_dobre_firmy UUID;
  portal_arena UUID;
  portal_panteon UUID;
BEGIN
  SELECT id INTO portal_dobre_firmy FROM portals WHERE slug = 'dobre-firmy';
  SELECT id INTO portal_arena FROM portals WHERE slug = 'arena-biznesu';
  SELECT id INTO portal_panteon FROM portals WHERE slug = 'panteonfirm';

  -- START: tylko dobre-firmy
  INSERT INTO plan_portal_access (plan, portal_id) VALUES ('START', portal_dobre_firmy) ON CONFLICT DO NOTHING;

  -- PRO: wszystkie 3 portale
  INSERT INTO plan_portal_access (plan, portal_id) VALUES 
    ('PRO', portal_dobre_firmy),
    ('PRO', portal_arena),
    ('PRO', portal_panteon)
  ON CONFLICT DO NOTHING;

  -- BIZNES: wszystkie 3 portale
  INSERT INTO plan_portal_access (plan, portal_id) VALUES 
    ('BIZNES', portal_dobre_firmy),
    ('BIZNES', portal_arena),
    ('BIZNES', portal_panteon)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- GOTOWE! 
-- ============================================
-- Baza danych została utworzona pomyślnie.
-- Możesz teraz użyć aplikacji opinieOn.
