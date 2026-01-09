-- ============================================
-- MIGRATION: Portal Features
-- Date: 2026-01-09
-- Description: Dodanie funkcjonalności dla zewnętrznych portali opinii
-- ============================================

-- 1. Tabela kluczy API dla portali
CREATE TABLE IF NOT EXISTS portal_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portal_id UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE,
  key_hash TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  rate_limit INTEGER DEFAULT 1000, -- requests per hour
  active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portal_keys_hash ON portal_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_portal_keys_portal ON portal_keys(portal_id);

-- 2. Rozszerzenie company_portal_profiles o ustawienia funkcji
ALTER TABLE company_portal_profiles 
ADD COLUMN IF NOT EXISTS reviews_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS discussions_enabled BOOLEAN DEFAULT false;

COMMENT ON COLUMN company_portal_profiles.reviews_enabled IS 'Czy firma pozwala na dodawanie opinii na tym portalu';
COMMENT ON COLUMN company_portal_profiles.discussions_enabled IS 'Czy firma pozwala na dyskusje pod opiniami na tym portalu';

-- 3. Rozszerzenie reviews o dodatkowe pola
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS pros TEXT,
ADD COLUMN IF NOT EXISTS cons TEXT,
ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));

COMMENT ON COLUMN reviews.pros IS 'Zalety firmy (opcjonalne)';
COMMENT ON COLUMN reviews.cons IS 'Wady firmy (opcjonalne)';
COMMENT ON COLUMN reviews.helpful_count IS 'Liczba głosów "pomocne"';
COMMENT ON COLUMN reviews.status IS 'Status moderacji: pending, approved, rejected';

CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);

-- 4. Seed data - 3 główne portale
INSERT INTO portals (name, domain, slug, settings) VALUES
(
  'Dobre Opinie', 
  'dobre-opinie.pl', 
  'dobre-opinie',
  '{
    "allow_replies": true,
    "show_rankings": true,
    "custom_fields": {}
  }'::jsonb
),
(
  'Arena Biznesu', 
  'arena-biznesu.pl', 
  'arena-biznesu',
  '{
    "allow_replies": true,
    "show_rankings": true,
    "custom_fields": {}
  }'::jsonb
),
(
  'Panteon Firm', 
  'panteon-firm.pl', 
  'panteon-firm',
  '{
    "allow_replies": true,
    "show_rankings": true,
    "custom_fields": {}
  }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- 5. Dodaj portal "Google Reviews" dla scrapowanych opinii
INSERT INTO portals (name, domain, slug, settings) VALUES
(
  'Google Reviews', 
  'google.com', 
  'google',
  '{
    "allow_replies": false,
    "show_rankings": false,
    "custom_fields": {"external": true}
  }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- 6. RLS Policy dla portal_keys (tylko service role ma dostęp)
ALTER TABLE portal_keys ENABLE ROW LEVEL SECURITY;

-- Admin może zarządzać kluczami
CREATE POLICY "Service role can manage portal keys"
  ON portal_keys FOR ALL
  USING (auth.role() = 'service_role');

-- 7. Public read dla portals (API musi widzieć dostępne portale)
DROP POLICY IF EXISTS "Portals are publicly readable" ON portals;
CREATE POLICY "Portals are publicly readable"
  ON portals FOR SELECT
  USING (is_active = true);

-- 8. Funkcja do generowania API key hash
CREATE OR REPLACE FUNCTION generate_portal_api_key()
RETURNS TEXT AS $$
DECLARE
  api_key TEXT;
BEGIN
  -- Generuj losowy klucz (prefix + 64 hex znaki)
  api_key := 'pk_' || encode(gen_random_bytes(32), 'hex');
  RETURN api_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Funkcja do weryfikacji API key
CREATE OR REPLACE FUNCTION verify_portal_api_key(api_key TEXT)
RETURNS TABLE(portal_id UUID, rate_limit INTEGER, is_valid BOOLEAN) AS $$
DECLARE
  key_hash TEXT;
BEGIN
  -- Hash klucza
  key_hash := encode(digest(api_key, 'sha256'), 'hex');
  
  RETURN QUERY
  SELECT 
    pk.portal_id,
    pk.rate_limit,
    (pk.active AND p.is_active) as is_valid
  FROM portal_keys pk
  JOIN portals p ON p.id = pk.portal_id
  WHERE pk.key_hash = key_hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Trigger do aktualizacji last_used_at
CREATE OR REPLACE FUNCTION update_portal_key_last_used()
RETURNS TRIGGER AS $$
BEGIN
  -- Ta funkcja będzie wywoływana przez API przy każdym użyciu klucza
  -- (implementacja w aplikacji)
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. View z agregacją opinii per portal
CREATE OR REPLACE VIEW company_portal_stats AS
SELECT 
  cpp.company_id,
  cpp.portal_id,
  p.slug as portal_slug,
  p.name as portal_name,
  COUNT(r.id) as review_count,
  ROUND(AVG(r.rating)::numeric, 1) as avg_rating,
  COUNT(CASE WHEN r.rating = 5 THEN 1 END) as five_star_count,
  COUNT(CASE WHEN r.rating = 4 THEN 1 END) as four_star_count,
  COUNT(CASE WHEN r.rating = 3 THEN 1 END) as three_star_count,
  COUNT(CASE WHEN r.rating = 2 THEN 1 END) as two_star_count,
  COUNT(CASE WHEN r.rating = 1 THEN 1 END) as one_star_count,
  cpp.reviews_enabled,
  cpp.discussions_enabled,
  cpp.is_active
FROM company_portal_profiles cpp
JOIN portals p ON p.id = cpp.portal_id
LEFT JOIN reviews r ON r.company_id = cpp.company_id 
  AND r.portal_id = cpp.portal_id 
  AND r.status = 'approved'
GROUP BY cpp.company_id, cpp.portal_id, p.slug, p.name, 
  cpp.reviews_enabled, cpp.discussions_enabled, cpp.is_active;

-- 12. Grant permissions na view
GRANT SELECT ON company_portal_stats TO authenticated;
GRANT SELECT ON company_portal_stats TO anon;

-- ============================================
-- ROLLBACK (jeśli potrzebne)
-- ============================================
-- DROP VIEW IF EXISTS company_portal_stats;
-- DROP FUNCTION IF EXISTS verify_portal_api_key(TEXT);
-- DROP FUNCTION IF EXISTS generate_portal_api_key();
-- DROP FUNCTION IF EXISTS update_portal_key_last_used();
-- DROP POLICY IF EXISTS "Service role can manage portal keys" ON portal_keys;
-- DROP POLICY IF EXISTS "Portals are publicly readable" ON portals;
-- DROP TABLE IF EXISTS portal_keys;
-- ALTER TABLE reviews DROP COLUMN IF EXISTS status, DROP COLUMN IF EXISTS helpful_count, DROP COLUMN IF EXISTS cons, DROP COLUMN IF EXISTS pros;
-- ALTER TABLE company_portal_profiles DROP COLUMN IF EXISTS discussions_enabled, DROP COLUMN IF EXISTS reviews_enabled;
-- DELETE FROM portals WHERE slug IN ('dobre-opinie', 'arena-biznesu', 'panteon-firm', 'google');
