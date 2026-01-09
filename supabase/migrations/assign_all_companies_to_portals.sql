-- ============================================
-- Przypisanie wszystkich firm do wszystkich portali
-- ============================================

-- 1. Przypisz wszystkie istniejące firmy do wszystkich portali
INSERT INTO company_portal_profiles (company_id, portal_id, reviews_enabled, discussions_enabled, is_active)
SELECT 
  c.id as company_id,
  p.id as portal_id,
  true as reviews_enabled,
  false as discussions_enabled,
  true as is_active
FROM companies c
CROSS JOIN portals p
WHERE p.is_active = true
ON CONFLICT (company_id, portal_id) DO UPDATE
SET 
  is_active = EXCLUDED.is_active,
  reviews_enabled = EXCLUDED.reviews_enabled;

-- 2. Trigger: Automatyczne przypisanie nowej firmy do wszystkich portali
CREATE OR REPLACE FUNCTION auto_assign_company_to_portals()
RETURNS TRIGGER AS $$
BEGIN
  -- Przypisz nową firmę do wszystkich aktywnych portali
  INSERT INTO company_portal_profiles (company_id, portal_id, reviews_enabled, discussions_enabled, is_active)
  SELECT 
    NEW.id,
    p.id,
    true,
    false,
    true
  FROM portals p
  WHERE p.is_active = true
  ON CONFLICT (company_id, portal_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Usuń stary trigger jeśli istnieje
DROP TRIGGER IF EXISTS trigger_auto_assign_company_to_portals ON companies;

-- Utwórz trigger
CREATE TRIGGER trigger_auto_assign_company_to_portals
  AFTER INSERT ON companies
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_company_to_portals();

-- 3. Sprawdzenie wyniku
SELECT 
  p.name as portal_name,
  COUNT(cpp.id) as companies_count
FROM portals p
LEFT JOIN company_portal_profiles cpp ON cpp.portal_id = p.id
GROUP BY p.id, p.name
ORDER BY p.name;

-- Powinno zwrócić liczbę firm dla każdego portalu
