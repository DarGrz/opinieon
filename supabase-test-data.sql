-- ============================================
-- DANE TESTOWE (OPCJONALNE)
-- ============================================
-- Ten plik zawiera przykładowe dane do testowania aplikacji.
-- UWAGA: To są dane demonstracyjne - NIE uruchamiaj tego w produkcji!
-- Najpierw musisz mieć utworzone konto użytkownika w aplikacji.

-- ============================================
-- JAK UŻYWAĆ:
-- ============================================
-- 1. Zarejestruj się w aplikacji (np. test@example.com)
-- 2. Zaloguj się do Supabase → Authentication → Users
-- 3. Skopiuj ID swojego użytkownika (UUID)
-- 4. Zamień 'TWOJ_USER_ID' poniżej na skopiowane ID
-- 5. Uruchom ten SQL w Supabase SQL Editor

-- ============================================
-- AUTOMATYCZNE WYKRYWANIE UŻYTKOWNIKA
-- ============================================
DO $$
DECLARE
  v_user_id UUID;
  v_company_id UUID;
  v_portal_dobre_firmy UUID;
  v_portal_arena UUID;
  v_portal_panteon UUID;
BEGIN
  -- Pobierz pierwszego użytkownika z auth.users
  SELECT id INTO v_user_id 
  FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 1;

  -- Sprawdź czy znaleziono użytkownika
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Nie znaleziono żadnego użytkownika! Zarejestruj się najpierw w aplikacji.';
  END IF;

  RAISE NOTICE 'Używam użytkownika: %', v_user_id;

  -- Pobierz ID portali
  SELECT id INTO v_portal_dobre_firmy FROM portals WHERE slug = 'dobre-firmy';
  SELECT id INTO v_portal_arena FROM portals WHERE slug = 'arena-biznesu';
  SELECT id INTO v_portal_panteon FROM portals WHERE slug = 'panteonfirm';

  -- 1. Dodaj dane użytkownika
  INSERT INTO users (id, first_name, last_name, phone)
  VALUES (v_user_id, 'Jan', 'Kowalski', '+48 123 456 789')
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone;

  -- 2. Dodaj przykładową firmę
  INSERT INTO companies (user_id, name, nip, address, city, postal_code, phone, website, email, description)
  VALUES (
    v_user_id,
    'Super Pizza Kraków',
    '1234567890',
    'ul. Floriańska 15',
    'Kraków',
    '31-019',
    '+48 12 345 6789',
    'https://superpizza.pl',
    'kontakt@superpizza.pl',
    'Najlepsza pizza w Krakowie! Świeże składniki, tradycyjna receptura.'
  )
  RETURNING id INTO v_company_id;

  -- 3. Dodaj subskrypcję (plan PRO, status trialing - trial)
  INSERT INTO subscriptions (
    user_id, 
    company_id, 
    plan, 
    status, 
    stripe_customer_id,
    stripe_subscription_id,
    trial_end,
    current_period_start,
    current_period_end
  )
  VALUES (
    v_user_id,
    v_company_id,
    'PRO',
    'trialing',
    'cus_test_123456789',
    'sub_test_123456789',
    NOW() + INTERVAL '14 days',
    NOW(),
    NOW() + INTERVAL '1 month'
  )
  ON CONFLICT (user_id, company_id) DO UPDATE SET
    plan = EXCLUDED.plan,
    status = EXCLUDED.status;

  -- 4. Dodaj profile firmy na portalach
  INSERT INTO company_portal_profiles (company_id, portal_id, is_active)
  VALUES 
    (v_company_id, v_portal_dobre_firmy, true),
    (v_company_id, v_portal_arena, true),
    (v_company_id, v_portal_panteon, true)
  ON CONFLICT (company_id, portal_id) DO NOTHING;

  -- 5. Dodaj przykładowe opinie
  -- Opinia 1: 5 gwiazdek na dobre-firmy
  INSERT INTO reviews (
    company_id, 
    portal_id, 
    author_name, 
    rating, 
    title, 
    content, 
    review_date,
    is_verified
  )
  VALUES (
    v_company_id,
    v_portal_dobre_firmy,
    'Maria Nowak',
    5,
    'Wyśmienita pizza!',
    'Zamówiłam pizzę Margherita i jestem zachwycona! Ciasto puszyste, sos pomidorowy świeży, a mozzarella rozpływa się w ustach. Dostawa szybka, pizza ciepła. Polecam!',
    CURRENT_DATE - INTERVAL '2 days',
    true
  );

  -- Opinia 2: 4 gwiazdki na arena-biznesu
  INSERT INTO reviews (
    company_id, 
    portal_id, 
    author_name, 
    author_email,
    rating, 
    title, 
    content, 
    review_date
  )
  VALUES (
    v_company_id,
    v_portal_arena,
    'Piotr Wiśniewski',
    'piotr.w@example.com',
    4,
    'Bardzo dobra, ale czekałem długo',
    'Pizza smaczna, składniki świeże. Jedyny minus to czas oczekiwania - zamiast 30 minut czekałem 50. Ale warto było poczekać!',
    CURRENT_DATE - INTERVAL '5 days'
  );

  -- Opinia 3: 5 gwiazdek na panteonfirm
  INSERT INTO reviews (
    company_id, 
    portal_id, 
    author_name, 
    rating, 
    content, 
    review_date,
    is_verified
  )
  VALUES (
    v_company_id,
    v_portal_panteon,
    'Anna Kowalczyk',
    5,
    'Najlepsza pizza w mieście! Zawsze zamawiam u nich. Obsługa miła, pizza pyszna, ceny uczciwe. Nic dodać, nic ująć!',
    CURRENT_DATE - INTERVAL '1 week',
    true
  );

  -- Opinia 4: 5 gwiazdek na dobre-firmy
  INSERT INTO reviews (
    company_id, 
    portal_id, 
    author_name, 
    rating, 
    title, 
    content, 
    review_date
  )
  VALUES (
    v_company_id,
    v_portal_dobre_firmy,
    'Tomasz Zieliński',
    5,
    'Polecam!',
    'Rewelacyjna pizza, szybka dostawa, świetny kontakt telefoniczny. Na pewno wrócę!',
    CURRENT_DATE - INTERVAL '10 days'
  );

  -- Opinia 5: 3 gwiazdki na arena-biznesu
  INSERT INTO reviews (
    company_id, 
    portal_id, 
    author_name, 
    rating, 
    title, 
    content, 
    review_date
  )
  VALUES (
    v_company_id,
    v_portal_arena,
    'Ewa Mazur',
    3,
    'OK, ale nic specjalnego',
    'Pizza w porządku, ale spodziewałam się czegoś bardziej wyjątkowego. Smak przeciętny.',
    CURRENT_DATE - INTERVAL '3 days'
  );

  -- Opinia 6: 5 gwiazdek na dobre-firmy (najnowsza)
  INSERT INTO reviews (
    company_id, 
    portal_id, 
    author_name, 
    rating, 
    title, 
    content, 
    review_date,
    is_verified
  )
  VALUES (
    v_company_id,
    v_portal_dobre_firmy,
    'Michał Lewandowski',
    5,
    'Pizza jak z Włoch!',
    'Jestem Włochem i mogę potwierdzić - to najlepsza pizza jaką jadłem poza Italią! Autentyczny smak, świeże składniki. Brawo!',
    CURRENT_DATE,
    true
  );

  RAISE NOTICE 'Dane testowe zostały dodane pomyślnie!';
  RAISE NOTICE 'Firma: Super Pizza Kraków (ID: %)', v_company_id;
  RAISE NOTICE 'Plan: PRO (14-dniowy trial)';
  RAISE NOTICE 'Dodano 6 opinii (średnia: 4.5/5)';
END $$;

-- ============================================
-- GOTOWE!
-- ============================================
-- Możesz teraz:
-- 1. Zalogować się do aplikacji
-- 2. Zobaczyć firmę "Super Pizza Kraków"
-- 3. Zobaczyć 6 przykładowych opinii
-- 4. Przetestować wszystkie funkcje
