# Generator Opinii AI - Dokumentacja

## Przegląd

System generowania opinii AI wykorzystuje API Claude (Anthropic) do automatycznego tworzenia autentycznych opinii klientów dla Twoich portali. Opinie są dodawane do kolejki i publikowane automatycznie w rozłożeniu czasowym.

## Konfiguracja

### 1. Uzyskaj klucz API Claude

1. Przejdź do [Anthropic Console](https://console.anthropic.com/)
2. Załóż konto lub zaloguj się
3. Stwórz nowy klucz API
4. Skopiuj klucz (zaczyna się od `sk-ant-api...`)

### 2. Skonfiguruj klucz API w aplikacji

1. Przejdź do **Dashboard** → **Ustawienia AI**
2. Wklej swój klucz API Claude
3. Kliknij **Zapisz klucz API**

## Użycie

### Generowanie opinii

1. Przejdź do **Dashboard** → **Generator AI**
2. Wybierz portal, dla którego chcesz generować opinie
3. Wprowadź wytyczne lub tekst bazowy:
   - Opisz jakie opinie chcesz wygenerować
   - Np. "Pozytywne opinie o usługach instalacyjnych, szybka realizacja"
4. (Opcjonalnie) Dodaj słowa kluczowe
5. Ustaw liczbę opinii do wygenerowania (1-20)
6. Kliknij **Generuj opinie**

### Zatwierdzanie i kolejka

1. Po wygenerowaniu opinii, przejrzyj je
2. Odznacz te, których nie chcesz publikować (kliknij na kartę opinii)
3. Kliknij **Dodaj do kolejki**
4. Opinie zostaną dodane do kolejki z automatycznym harmonogramem

## Harmonogram publikacji

- **Częstotliwość**: Cron uruchamia się raz dziennie o godzinie 9:00
- **Limit**: Publikowane max 2 opinie dziennie
- **Data opinii**: Każda opinia ma unikalny dzień z przeszłości (max 2 opinie na dzień)
- **Logika generowania dat**: 
  - Opinie 0,1: 1-2 dni temu
  - Opinie 2,3: 3-4 dni temu
  - Opinie 4,5: 5-6 dni temu
  - itd.
- **Proces**: Automatyczny, dzięki Vercel Cron

### Dlaczego taka logika?

1. **Bezpieczeństwo**: Nigdy nie opublikujemy opinii z przyszłą datą
2. **Realizm**: Max 2 opinie dziennie wyglądają naturalnie
3. **Unikalność**: Każda opinia ma własny dzień (lub max 2 na dzień)
4. **Stopniowość**: 2 opinie dziennie zapewnia naturalne tempo publikacji
5. **Kolejność**: Najstarsze opinie publikowane pierwsze

## Struktura bazy danych

### Tabela `review_queue`

```sql
- id: UUID (klucz główny)
- user_id: UUID (odniesienie do użytkownika)
- company_id: UUID (odniesienie do firmy)
- portal_id: UUID (odniesienie do portalu)
- author_name: TEXT (imię autora opinii)
- rating: INTEGER (1-5)
- content: TEXT (treść opinii)
- review_date: TIMESTAMPTZ (data opinii - z przeszłości, nie może być > created_at)
- status: TEXT ('pending', 'published', 'failed')
- generation_prompt: TEXT (użyty prompt)
- created_at: TIMESTAMPTZ (kiedy dodano do kolejki)
- published_at: TIMESTAMPTZ (kiedy opublikowano)
- error_message: TEXT
- CONSTRAINT: review_date <= created_at (zapewnia, że data opinii nie jest z przyszłości)
```

### Dodane pole w `user_profiles`

```sql
- claude_api_key: TEXT (klucz API Claude)
```

## API Endpoints

### POST `/api/ai/generate-reviews`

Generuje opinie używając Claude API.

**Body:**
```json
{
  "portal_id": "uuid",
  "company_id": "uuid",
  "prompt": "Tekst wytycznych",
  "keywords": "słowa, kluczowe",
  "count": 5
}
```

**Response:**
```json
{
  "reviews": [
    {
      "author_name": "Jan Kowalski",
      "rating": 5,
      "content": "Treść opinii..."
    }
  ],
  "count": 5
}
```

### POST `/api/ai/add-to-queue`

Dodaje wygenerowane opinie do kolejki.

**Body:**
```json
{
  "reviews": [
    {
      "company_id": "uuid",
      "portal_id": "uuid",
      "author_name": "Jan Kowalski",
      "rating": 5,
      "content": "Treść opinii...",
      "generation_prompt": "Użyty prompt"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "items": [...]
}
```

### GET `/api/ai/process-queue`

Przetwarza kolejkę i publikuje opinie (wywoływane przez cron raz dziennie o 9:00).

**Logika:**
- Wybiera opinie z `status = 'pending'` i `review_date <= now()`
- Publikuje maksymalnie 2 opinie
- Sortuje po `review_date` (najstarsze pierwsze)

**Headers:**
```
Authorization: Bearer {CRON_SECRET}
```

**Response:**
```json
{
  "success": true,
  "processed": 2,
  "published": 2,
  "failed": 0,
  "errors": []
}
```

## Zmienne środowiskowe

Dodaj do `.env.local`:

```env
CRON_SECRET=your-secret-key-here
```

## Vercel Cron

Konfiguracja w `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/ai/process-queue",
      "schedule": "0 * * * *"
    }
  ]
}
```

Cron uruchamia się co godzinę (`0 * * * *`).

## Bezpieczeństwo

- Klucz API jest przechowywany w bazie danych (możesz dodać szyfrowanie)
- Tylko właściciel może używać swojego klucza API
- Endpoint cron wymaga autoryzacji przez `CRON_SECRET`
- RLS (Row Level Security) zapewnia izolację danych użytkowników

## Migracja bazy danych

Uruchom migrację:

```bash
# Lokalnie
supabase migration up

# Lub bezpośrednio w Supabase Dashboard
# SQL Editor → wklej zawartość pliku:
# supabase/migrations/add_ai_review_generation.sql
```

## Rozwiązywanie problemów

### Opinie nie są generowane

1. Sprawdź czy klucz API jest poprawny
2. Sprawdź logi w konsoli deweloperskiej
3. Upewnij się, że masz saldo w koncie Anthropic

### Opinie nie są publikowane

1. Sprawdź czy Vercel Cron jest aktywny
2. Sprawdź logi w Vercel Dashboard → Functions
3. Upewnij się, że `CRON_SECRET` jest ustawiony

### Błędy w kolejce

1. Sprawdź tabelę `review_queue` dla `status = 'failed'`
2. Zobacz `error_message` dla szczegółów
3. Możesz ręcznie zmienić status na `pending` i spróbować ponownie

## Przyszłe usprawnienia

- [ ] Dodanie więcej modeli AI (GPT-4, etc.)
- [ ] Możliwość edycji opinii przed dodaniem do kolejki
- [ ] Statystyki użycia API
- [ ] Własne harmonogramy publikacji
- [ ] Szablony promptów
- [ ] Historia wygenerowanych opinii
