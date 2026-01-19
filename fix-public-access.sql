-- ============================================
-- FIX: Publiczny dostęp do firm i opinii
-- ============================================
-- Ten skrypt dodaje publiczny dostęp do odczytu firm i opinii

-- Dodaj publiczną policy dla firm (każdy może czytać aktywne firmy)
DROP POLICY IF EXISTS "Anyone can view active companies" ON companies;
CREATE POLICY "Anyone can view active companies" ON companies 
  FOR SELECT 
  USING (is_active = true);

-- Dodaj publiczną policy dla opinii (każdy może czytać opublikowane opinie)
DROP POLICY IF EXISTS "Anyone can view published reviews" ON reviews;
CREATE POLICY "Anyone can view published reviews" ON reviews 
  FOR SELECT 
  USING (status = 'published');

-- Dodaj publiczną policy dla odpowiedzi na opinie
DROP POLICY IF EXISTS "Anyone can view review replies" ON review_replies;
CREATE POLICY "Anyone can view review replies" ON review_replies 
  FOR SELECT 
  USING (true);

-- Dodaj publiczną policy dla dodawania opinii (każdy może dodać opinię)
DROP POLICY IF EXISTS "Anyone can create reviews" ON reviews;
CREATE POLICY "Anyone can create reviews" ON reviews 
  FOR INSERT 
  WITH CHECK (true);
