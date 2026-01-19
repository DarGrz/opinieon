
WITH new_key_data AS (
  SELECT 
    'pk_' || encode(gen_random_bytes(32), 'hex') as raw_key,
    (SELECT id FROM portals WHERE slug = 'panteonfirm') as portal_id
),
key_with_hash AS (
  SELECT 
    raw_key,
    portal_id,
    encode(digest(raw_key, 'sha256'), 'hex') as key_hash
  FROM new_key_data
),
deleted AS (
  DELETE FROM portal_keys 
  WHERE portal_id = (SELECT portal_id FROM key_with_hash)
  RETURNING id
),
inserted AS (
  INSERT INTO portal_keys (portal_id, key_hash, name, active)
  SELECT 
    portal_id,
    key_hash,
    'API Key ' || to_char(NOW(), 'YYYY-MM-DD HH24:MI'),
    true
  FROM key_with_hash
  RETURNING id, key_hash
)
SELECT 
  '⚠️ SKOPIUJ TEN KLUCZ (NIE ZOBACZYSZ GO PONOWNIE!)' as uwaga,
  kwh.raw_key as "🔑 KLUCZ_DO_ENV_LOCAL",
  kwh.key_hash as "Hash w bazie (do weryfikacji)",
  i.id as "ID w bazie"
FROM key_with_hash kwh
JOIN inserted i ON i.key_hash = kwh.key_hash;
