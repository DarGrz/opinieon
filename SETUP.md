# 🚀 Instrukcja uruchomienia OpinioOn

## ✅ Status projektu

Wszystkie błędy zostały naprawione! Aplikacja jest gotowa do uruchomienia.

## 📝 Krok 1: Uruchom SQL w Supabase

**To jest NAJWAŻNIEJSZY krok!**

### Jak to zrobić:

1. Otwórz panel Supabase: https://supabase.com/dashboard
2. Wybierz swój projekt (lub utwórz nowy)
3. Z lewego menu wybierz **SQL Editor**
4. Kliknij **New query**
5. Otwórz plik `supabase-setup.sql` w tym projekcie
6. **Zaznacz całą zawartość** (Ctrl/Cmd + A) i skopiuj (Ctrl/Cmd + C)
7. Wklej do edytora SQL w Supabase
8. Kliknij **Run** (lub naciśnij Ctrl/Cmd + Enter)

### Co zostanie utworzone:

✅ 10 tabel (portals, users, companies, subscriptions, reviews, itp.)  
✅ Row Level Security (RLS) - zabezpieczenia  
✅ Funkcje pomocnicze  
✅ 3 portale: Dobre Firmy, Arena Biznesu, Panteon Firm  
✅ Konfiguracja dostępu do portali dla każdego planu

**Komunikat sukcesu:** Na końcu zobaczysz "GOTOWE!" w wynikach SQL.

---

## 🔧 Krok 2: Sprawdź zmienne środowiskowe

Plik `.env.local` jest już skonfigurowany. Sprawdź czy wszystkie wartości są poprawne:

```bash
# Otwórz plik
code .env.local
```

Upewnij się że masz:
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ STRIPE_SECRET_KEY
- ✅ STRIPE_PUBLISHABLE_KEY
- ✅ STRIPE_PRICE_START
- ✅ STRIPE_PRICE_PRO
- ✅ STRIPE_PRICE_BIZNES
- ✅ STRIPE_WEBHOOK_SECRET

---

## 🎯 Krok 3: Uruchom aplikację

```bash
npm run dev
```

Aplikacja będzie dostępna na: **http://localhost:3000**

---

## 🧪 Krok 4: Przetestuj aplikację

### Test 1: Rejestracja ✅
1. Otwórz http://localhost:3000
2. Kliknij "Rozpocznij za darmo" lub "Zarejestruj się"
3. Wpisz email i hasło (min. 6 znaków)
4. Kliknij "Zarejestruj się"
5. ✅ Powinieneś być przekierowany do dashboard

### Test 2: Dodanie firmy ✅
1. W dashboard kliknij "Dodaj firmę" (przycisk w sidebar lub na środku)
2. Wybierz plan (Start/Pro/Biznes)
3. Wypełnij formularz:
   - Dane osobowe: imię, nazwisko, telefon
   - Dane firmy: nazwa, NIP, adres, itp.
4. Kliknij "Przejdź do płatności"
5. Zostaniesz przekierowany do Stripe Checkout
6. Użyj testowej karty: **4242 4242 4242 4242**
   - Data ważności: dowolna przyszła (np. 12/34)
   - CVC: dowolne 3 cyfry (np. 123)
7. ✅ Po płatności wrócisz do dashboard

### Test 3: Dodanie opinii ✅
1. Z sidebar wybierz "Opinie"
2. Kliknij "Dodaj opinię"
3. Wypełnij formularz:
   - Wybierz firmę i portal
   - Wpisz autora opinii
   - Wybierz ocenę (1-5 gwiazdek)
   - (Opcjonalnie) dodaj tytuł i treść
4. Kliknij "Dodaj opinię"
5. ✅ Opinia pojawi się na liście

---

## 🔍 Krok 5: Weryfikacja w Supabase

### Sprawdź czy dane zostały zapisane:

1. Otwórz Supabase → **Table Editor**
2. Kliknij na tabelę **portals** → powinieneś widzieć 3 portale
3. Kliknij na tabelę **users** → twój profil
4. Kliknij na tabelę **companies** → twoja firma
5. Kliknij na tabelę **subscriptions** → aktywna subskrypcja
6. Kliknij na tabelę **reviews** → dodane opinie

---

## 💳 Stripe Webhook (opcjonalnie)

### Dla testów lokalnych (zalecane):

```bash
# Zainstaluj Stripe CLI
brew install stripe/stripe-cli/stripe

# Zaloguj się
stripe login

# Przekieruj webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Skopiuj `webhook signing secret` i wklej do `.env.local` jako `STRIPE_WEBHOOK_SECRET`

### Dla produkcji:

1. Wejdź na https://dashboard.stripe.com
2. Developers → Webhooks → Add endpoint
3. URL: `https://twoja-domena.com/api/webhooks/stripe`
4. Wybierz eventy:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_failed

---

## 🐛 Rozwiązywanie problemów

### ❌ Błąd: "relation does not exist"
**Rozwiązanie:** Nie wykonałeś SQL w Supabase. Wróć do Kroku 1.

### ❌ Błąd: "Invalid API key"  
**Rozwiązanie:** Sprawdź `.env.local` - upewnij się że klucze są poprawne

### ❌ Stripe: "No such price"
**Rozwiązanie:** W Stripe utwórz produkty i ceny, a ich ID wklej do `.env.local`

### ❌ Webhook nie działa
**Rozwiązanie:** Uruchom `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### ❌ Błędy TypeScript
**Rozwiązanie:** Zostały naprawione! Jeśli nadal występują, uruchom `npm install`

---

## 📚 Następne kroki (funkcje do dodania)

Po przetestowaniu podstawowych funkcji możesz rozbudować aplikację:

- [ ] Edycja i usuwanie opinii
- [ ] Szczegóły opinii (/dashboard/reviews/[id])
- [ ] Zarządzanie firmami (/dashboard/companies)
- [ ] Analityka z wykresami (recharts) dla Pro/Biznes
- [ ] Odpowiedzi na opinie
- [ ] Billing portal (zarządzanie subskrypcją)
- [ ] Email notifications
- [ ] Export do CSV/PDF
- [ ] Landing page z większą ilością treści

---

## 🎉 Gotowe!

Jeśli wszystko zadziałało:
- ✅ Możesz się rejestrować i logować
- ✅ Możesz dodawać firmy przez Stripe Checkout
- ✅ Możesz zarządzać opiniami
- ✅ Dashboard wyświetla statystyki
- ✅ Brak błędów w konsoli

**Gratulacje! 🎊 Twoja aplikacja OpinioOn działa!**

---

## 🎲 BONUS: Dane testowe (opcjonalnie)

Jeśli chcesz szybko zobaczyć jak działa aplikacja z przykładowymi danymi:

### Jak dodać dane testowe:

1. Zarejestruj się w aplikacji (np. `test@example.com`)
2. Otwórz Supabase → **Authentication** → **Users**
3. Skopiuj swoje **User ID** (UUID)
4. Otwórz plik `supabase-test-data.sql`
5. Zamień `'TWOJ_USER_ID'` na skopiowane ID
6. Skopiuj cały plik i uruchom w Supabase SQL Editor

### Co zostanie dodane:

- ✅ Firma "Super Pizza Kraków"
- ✅ Plan PRO z 14-dniowym trialem
- ✅ 6 przykładowych opinii (średnia: 4.5/5)
- ✅ Profile na wszystkich 3 portalach

---

## 📞 Pliki pomocnicze

- **supabase-setup.sql** - gotowy SQL do wklejenia w Supabase
- **README.md** - ogólny opis projektu
- **.env.local** - zmienne środowiskowe

---

**Utworzone:** 8 stycznia 2026  
**Status:** ✅ Gotowe do użycia

1. ✅ Zainstalowane dependencies
2. ✅ Skonfigurowane zmienne środowiskowe (.env.local)
3. ✅ Utworzona struktura projektu
4. ✅ Zaimplementowane:
   - Autentykacja (login/register)
   - Dashboard z sidebar
   - Wybór planu subskrypcji
   - Formularz dodawania firmy
   - Stripe Checkout
   - Stripe Webhooks
   - Zarządzanie opiniami (lista + dodawanie)
   - Landing page

## 🔧 Co musisz zrobić:

### 1. Uruchom SQL w Supabase

**WAŻNE:** To jest kluczowy krok!

1. Otwórz panel Supabase: https://supabase.com/dashboard
2. Wybierz swój projekt
3. Z lewego menu wybierz **SQL Editor**
4. Kliknij **New query**
5. Skopiuj całą zawartość pliku `supabase/schema.sql`
6. Wklej do edytora SQL
7. Kliknij **Run** (lub Ctrl/Cmd + Enter)

To utworzy:
- Wszystkie tabele (portals, users, companies, reviews, subscriptions, etc.)
- Row Level Security policies
- Funkcje pomocnicze
- 3 portale: Dobre Firmy, Arena Biznesu, Panteon Firm

### 2. Skonfiguruj Stripe Webhook (dla testów lokalnych)

Opcja A: **Stripe CLI (zalecane dla testów)**
```bash
# Zainstaluj Stripe CLI jeśli nie masz:
brew install stripe/stripe-cli/stripe

# Zaloguj się:
stripe login

# Przekieruj webhooks:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Opcja B: **Dashboard Stripe (dla produkcji)**
1. Wejdź na https://dashboard.stripe.com
2. Developers → Webhooks → Add endpoint
3. URL: `https://twoja-domena.com/api/webhooks/stripe`
4. Wybierz eventy:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_failed

### 3. Uruchom aplikację

```bash
npm run dev
```

Otwórz: http://localhost:3000

## 🧪 Jak przetestować:

### Test 1: Rejestracja i logowanie
1. Otwórz http://localhost:3000
2. Kliknij "Rozpocznij za darmo"
3. Zarejestruj się (email + hasło)
4. Zostaniesz przekierowany do dashboard

### Test 2: Dodawanie firmy i subskrypcja
1. W dashboard kliknij "Dodaj firmę"
2. Wybierz plan (Start/Pro/Biznes)
3. Wypełnij formularz (dane osobowe + firma)
4. Kliknij "Przejdź do płatności"
5. W Stripe Checkout użyj testowej karty: `4242 4242 4242 4242`
6. Po płatności wrócisz do dashboard

### Test 3: Dodawanie opinii
1. Z sidebar wybierz "Opinie"
2. Kliknij "Dodaj opinię"
3. Wybierz firmę i portal
4. Uzupełnij dane opinii
5. Kliknij "Dodaj opinię"

## 🔍 Weryfikacja

### Sprawdź w Supabase:
1. **Table Editor** → `portals` - powinieneś widzieć 3 portale
2. **Table Editor** → `users` - twój profil użytkownika
3. **Table Editor** → `companies` - twoja firma
4. **Table Editor** → `subscriptions` - aktywna subskrypcja
5. **Table Editor** → `reviews` - dodane opinie

### Sprawdź w Stripe:
1. **Customers** - nowy klient
2. **Subscriptions** - aktywna subskrypcja z 14-dniowym trialem
3. **Events** - webhook events

## 🐛 Rozwiązywanie problemów

### Błąd: "relation does not exist"
→ Nie wykonałeś SQL w Supabase. Wróć do kroku 1.

### Błąd: "Invalid API key"
→ Sprawdź `.env.local` - upewnij się że klucze Supabase/Stripe są poprawne

### Błąd Stripe: "No such price"
→ Upewnij się że w Stripe masz utworzone produkty i ceny:
- STRIPE_PRICE_START
- STRIPE_PRICE_PRO
- STRIPE_PRICE_BIZNES

### Webhook nie działa
→ Uruchom `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

## 📚 Następne kroki (opcjonalne)

1. **Edycja/usuwanie opinii** - strona szczegółów opinii
2. **Zarządzanie firmami** - lista i edycja firm
3. **Analityka** - wykresy dla Pro/Biznes (recharts)
4. **Billing portal** - zarządzanie subskrypcją przez Stripe
5. **Email notifications** - powiadomienia o nowych opiniach

## 🎉 Gotowe!

Jeśli wszystko działa:
- ✅ Możesz się rejestrować i logować
- ✅ Możesz dodawać firmy i subskrypcje
- ✅ Możesz zarządzać opiniami
- ✅ Dashboard wyświetla się poprawnie

Powodzenia! 🚀
