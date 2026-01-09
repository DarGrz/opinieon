-- 1. Sprawdź czy są klucze API
SELECT 
  pk.id,
  pk.name,
  p.slug as portal_slug,
  pk.active,
  pk.key_hash,
  pk.created_at
FROM portal_keys pk
JOIN portals p ON p.id = pk.portal_id
WHERE p.slug = 'dobre-firmy';

-- 2. Sprawdź czy hash się zgadza (PODSTAW swój klucz API):
-- SELECT encode(digest('pk_TUTAJ_TWÓJ_KLUCZ', 'sha256'), 'hex') AS calculated_hash;

-- 3. Jeśli pusta tabela portal_keys, to:
-- Wygeneruj nowy klucz:
-- SELECT 'pk_' || encode(gen_random_bytes(32), 'hex') AS new_portal_key;

-- 4. Zapisz hash tego klucza (PODSTAW klucz z kroku 3):
-- INSERT INTO portal_keys (portal_id, key_hash, name, active)
-- SELECT 
--   id,
--   encode(digest('pk_TUTAJ_WKLEJ_KLUCZ_Z_KROKU_3', 'sha256'), 'hex'),
--   'Main API Key',
--   true
-- FROM portals 
-- WHERE slug = 'dobre-firmy';

-- 5. Weryfikacja - porównaj hash z bazy z hashem obliczonym z klucza:
-- SELECT 
--   'Hash z bazy:' as label,
--   key_hash 
-- FROM portal_keys pk
-- JOIN portals p ON p.id = pk.portal_id
-- WHERE p.slug = 'dobre-firmy'
-- UNION ALL
-- SELECT 
--   'Hash obliczony:' as label,
--   encode(digest('pk_TUTAJ_TWÓJ_KLUCZ', 'sha256'), 'hex') as key_hash;

