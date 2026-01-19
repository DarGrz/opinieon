-- ============================================
-- Dodanie kolumny slug do tabeli companies
-- ============================================

-- 1. Dodaj kolumnę slug jeśli nie istnieje
ALTER TABLE companies ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Stwórz funkcję do generowania sluga
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT, record_id UUID)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Konwertuj na małe litery, zamień polskie znaki, usuń znaki specjalne
  base_slug := lower(input_text);
  base_slug := translate(base_slug, 'ąćęłńóśźż', 'acelnoszz');
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Sprawdź unikalność, jeśli istnieje dodaj licznik
  WHILE EXISTS (SELECT 1 FROM companies WHERE slug = final_slug AND id != record_id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- 3. Wygeneruj slugi dla istniejących firm (które nie mają sluga)
UPDATE companies 
SET slug = generate_slug(name, id)
WHERE slug IS NULL OR slug = '';

-- 4. Ustaw kolumnę slug jako NOT NULL i UNIQUE
ALTER TABLE companies ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);

-- 5. Stwórz trigger który automatycznie generuje slug przy dodawaniu nowej firmy
CREATE OR REPLACE FUNCTION auto_generate_company_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_slug_on_company_insert ON companies;
CREATE TRIGGER auto_slug_on_company_insert
  BEFORE INSERT ON companies
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_company_slug();

-- 6. Trigger dla aktualizacji nazwy (opcjonalnie możesz to wyłączyć jeśli nie chcesz auto-update sluga)
DROP TRIGGER IF EXISTS auto_slug_on_company_update ON companies;
CREATE TRIGGER auto_slug_on_company_update
  BEFORE UPDATE OF name ON companies
  FOR EACH ROW
  WHEN (OLD.name IS DISTINCT FROM NEW.name)
  EXECUTE FUNCTION auto_generate_company_slug();
