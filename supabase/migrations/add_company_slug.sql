-- ============================================
-- Dodanie brakujących kolumn do companies
-- ============================================

-- 1. Dodaj kolumny slug i verified
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- 2. Funkcja do generowania slug z nazwy
CREATE OR REPLACE FUNCTION generate_slug(name TEXT) 
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  -- Konwertuj na lowercase, usuń polskie znaki, zamień spacje na myślniki
  slug := lower(name);
  slug := translate(slug, 'ąćęłńóśźż', 'acelnoszz');
  slug := regexp_replace(slug, '[^a-z0-9]+', '-', 'g');
  slug := regexp_replace(slug, '^-+|-+$', '', 'g');
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Wygeneruj slug dla wszystkich istniejących firm
UPDATE companies 
SET slug = generate_slug(name) || '-' || substr(id::text, 1, 8)
WHERE slug IS NULL;

-- 4. Dodaj NOT NULL constraint
ALTER TABLE companies 
ALTER COLUMN slug SET NOT NULL;

-- 5. Dodaj unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);

-- 6. Trigger do automatycznego generowania slug
CREATE OR REPLACE FUNCTION auto_generate_company_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  IF NEW.slug IS NULL THEN
    base_slug := generate_slug(NEW.name);
    final_slug := base_slug;
    
    -- Jeśli slug już istnieje, dodaj numer
    WHILE EXISTS (SELECT 1 FROM companies WHERE slug = final_slug AND id != NEW.id) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.slug := final_slug;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Usuń stary trigger jeśli istnieje
DROP TRIGGER IF EXISTS trigger_auto_generate_company_slug ON companies;

-- Utwórz trigger
CREATE TRIGGER trigger_auto_generate_company_slug
  BEFORE INSERT OR UPDATE OF name ON companies
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_company_slug();

-- 7. Sprawdzenie
SELECT 
  id,
  name,
  slug,
  created_at
FROM companies
ORDER BY created_at DESC
LIMIT 5;
