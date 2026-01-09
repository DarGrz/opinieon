# Migracje bazy danych

## Jak uruchomić migracje

### Opcja 1: Przez Supabase Dashboard (easiest)
1. Wejdź na https://supabase.com/dashboard
2. Wybierz swój projekt
3. SQL Editor → New Query
4. Skopiuj zawartość `20260109_add_portal_features.sql`
5. Run

### Opcja 2: Przez Supabase CLI
```bash
# Zaloguj się
npx supabase login

# Link do projektu
npx supabase link --project-ref your-project-ref

# Push migracji
npx supabase db push
```

### Opcja 3: Ręcznie przez psql
```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" < supabase/migrations/20260109_add_portal_features.sql
```

## Kolejność migracji

1. `schema.sql` - podstawowy schemat (już wykonany)
2. `20260109_add_portal_features.sql` - **←  URUCHOM TO TERAZ**

## Sprawdzenie czy migracja się wykonała

```sql
-- Sprawdź czy tabele istnieją
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('portal_keys', 'portals', 'company_portal_profiles');

-- Sprawdź portale
SELECT * FROM portals;

-- Sprawdź nowe kolumny w reviews
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'reviews' 
AND column_name IN ('pros', 'cons', 'status', 'helpful_count');
```

Powinno zwrócić:
- 4 portale: dobre-opinie, arena-biznesu, panteon-firm, google
- 4 nowe kolumny w reviews
- Tabelę portal_keys

## Po migracji - wygeneruj API key dla portalu

```sql
-- 1. Znajdź portal_id dla dobre-opinie.pl
SELECT id FROM portals WHERE slug = 'dobre-opinie';

-- 2. Wygeneruj klucz
SELECT generate_portal_api_key();
-- Zwraca np: pk_a1b2c3d4e5f6...

-- 3. Zapisz hash klucza do bazy
INSERT INTO portal_keys (portal_id, key_hash, name)
VALUES (
  (SELECT id FROM portals WHERE slug = 'dobre-opinie'),
  encode(digest('pk_a1b2c3d4e5f6...', 'sha256'), 'hex'),
  'Dobre Opinie Production Key'
);

-- WAŻNE: Zapisz klucz pk_a1b2c3d4e5f6... w .env portalu!
-- Nie będzie go można odzyskać później.
```

## Rollback

Jeśli coś poszło nie tak:
```sql
-- Uruchom sekcję ROLLBACK z pliku migracji
-- (skopiuj linie zaczynające się od DROP...)
```
