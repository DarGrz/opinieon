-- ============================================
-- Dodanie prefiksu "opinie-" do slugów firm
-- ============================================

-- 1. Zaktualizuj funkcję generate_slug aby dodawała prefix "opinie-"
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
  
  -- Dodaj prefix "opinie-"
  slug := 'opinie-' || slug;
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Zaktualizuj wszystkie istniejące slugi (dodaj prefix jeśli go nie ma)
UPDATE companies 
SET slug = 'opinie-' || slug
WHERE slug NOT LIKE 'opinie-%';

-- 3. Zaktualizuj trigger (już istnieje, ale upewniamy się że używa nowej funkcji)
CREATE OR REPLACE FUNCTION auto_generate_company_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  IF NEW.slug IS NULL OR (TG_OP = 'UPDATE' AND OLD.name != NEW.name) THEN
    base_slug := generate_slug(NEW.name);
    final_slug := base_slug;
    
    -- Jeśli slug już istnieje, dodaj numer
    WHILE EXISTS (SELECT 1 FROM companies WHERE slug = final_slug AND id != NEW.id) LOOP
      counter := counter + 1;
      -- Dodaj numer przed ostatnim segmentem (np. opinie-firma-1)
      final_slug := regexp_replace(base_slug, '(-[0-9a-f]{8})?$', '-' || counter || '\1');
    END LOOP;
    
    NEW.slug := final_slug;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Upewnij się że trigger istnieje
DROP TRIGGER IF EXISTS trigger_auto_generate_company_slug ON companies;

CREATE TRIGGER trigger_auto_generate_company_slug
  BEFORE INSERT OR UPDATE OF name ON companies
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_company_slug();

-- 4. Sprawdzenie wyniku
SELECT 
  id,
  name,
  slug,
  created_at
FROM companies
ORDER BY created_at DESC
LIMIT 10;
