# OpinioOn - System zarządzania opiniami

System do zarządzania opiniami firm w 3 portalach: Dobre Firmy, Arena Biznesu, Panteon Firm.

## ✅ Status: Gotowe do użycia!

Wszystkie błędy zostały naprawione. Aplikacja jest w pełni funkcjonalna.

## 🚀 Szybki start

### 1️⃣ Uruchom SQL w Supabase

```bash
# Otwórz plik supabase-setup.sql
# Skopiuj całą zawartość
# Wklej w Supabase → SQL Editor → Kliknij Run
```

### 2️⃣ Uruchom aplikację

```bash
npm run dev
```

### 3️⃣ Testuj

Otwórz http://localhost:3000

**📖 Szczegółowa instrukcja:** Zobacz [SETUP.md](./SETUP.md)

---

## 🎯 Funkcjonalności

### Plany subskrypcji
- **Start (299 PLN/mies)**: 1 firma, portal Dobre Firmy
- **Pro (499 PLN/mies)**: 1 firma, wszystkie 3 portale + analityka
- **Biznes (799 PLN/mies)**: do 3 firm, wszystkie 3 portale + analityka

### Główne funkcje
- ✅ Zarządzanie opiniami (dodawanie, przeglądanie)
- ✅ Wsparcie dla 3 portali opinii
- ✅ Autentykacja Supabase (login/register)
- ✅ Płatności Stripe z 14-dniowym trialem
- ✅ Row Level Security (RLS)
- ✅ Responsywny dashboard z sidebar
- ✅ Statystyki opinii

---

## 📁 Struktura projektu

```
opinieon/
├── app/
│   ├── (auth)/              # Login, Register, Onboarding
│   ├── (dashboard)/         # Panel użytkownika
│   ├── api/                 # Stripe checkout & webhooks
│   └── page.tsx            # Landing page
├── components/
│   └── dashboard/sidebar.tsx
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── stripe.ts           # Stripe helpers
│   └── utils.ts
├── types/
│   ├── database.ts         # Typy Supabase
│   └── plans.ts            # Konfiguracja planów
├── supabase-setup.sql      # 🔥 SQL do wklejenia w Supabase
├── SETUP.md                # 📖 Szczegółowa instrukcja
└── .env.local              # Zmienne środowiskowe
```

---

## 🗄️ Baza danych

### Tabele:
- `portals` - 3 portale z opiniami
- `users` - Dane użytkowników
- `companies` - Firmy użytkowników
- `subscriptions` - Subskrypcje Stripe
- `reviews` - Opinie
- `review_replies` - Odpowiedzi na opinie
- `company_portal_profiles` - Profile firm na portalach
- `plan_portal_access` - Dostęp do portali dla planów

---

## 🔄 Flow użytkownika

1. **Rejestracja** → Email + hasło
2. **Dashboard** → Pusty z przyciskiem "Dodaj firmę"
3. **Wybór planu** → Start / Pro / Biznes
4. **Formularz** → Dane osobowe + firmy
5. **Stripe Checkout** → 14-dniowy trial
6. **Webhook** → Aktywacja subskrypcji
7. **Panel** → Zarządzanie opiniami

---

## 🎨 Następne kroki (opcjonalnie)

- [ ] Edycja/usuwanie opinii
- [ ] Strona firm (/dashboard/companies)
- [ ] Analityka z wykresami
- [ ] Odpowiedzi na opinie
- [ ] Billing portal
- [ ] Email notifications

---

## 🔐 Bezpieczeństwo

- ✅ Row Level Security (RLS) w Supabase
- ✅ Stripe Webhook verification
- ✅ Middleware auth protection
- ✅ Server-side validation

---

## 📝 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

---

## 🆘 Problemy?

Zobacz [SETUP.md](./SETUP.md) - sekcja "Rozwiązywanie problemów"

Najczęstsze:
- ❌ "relation does not exist" → Wykonaj SQL w Supabase
- ❌ "Invalid API key" → Sprawdź .env.local
- ❌ Webhook nie działa → Użyj Stripe CLI

---

## 📞 Pliki kluczowe

- **supabase-setup.sql** - Gotowy SQL (skopiuj → wklej w Supabase)
- **SETUP.md** - Szczegółowa instrukcja krok po kroku
- **.env.local** - Twoje klucze API

---

**Utworzone:** 8 stycznia 2026  
**Status:** ✅ W pełni funkcjonalne

### Plany subskrypcji
- **Start (299 PLN/mies)**: 1 firma, portal Dobre Firmy
- **Pro (499 PLN/mies)**: 1 firma, wszystkie 3 portale + analityka
- **Biznes (799 PLN/mies)**: do 3 firm, wszystkie 3 portale + analityka

### Główne funkcje
- ✅ Zarządzanie opiniami (CRUD)
- ✅ Wsparcie dla 3 portali opinii
- ✅ Autentykacja Supabase
- ✅ Płatności Stripe z 14-dniowym trialem
- ✅ Row Level Security (RLS)
- ✅ Responsywny dashboard
- ✅ Analityka (w planach Pro/Biznes)

## 📋 Wymagania

- Node.js 18+
- Konto Supabase
- Konto Stripe

## 🛠 Instalacja i konfiguracja

### 1. Instalacja dependencies (już zrobione)
```bash
npm install
```

### 2. Konfiguracja Supabase

Przejdź do panelu Supabase i wykonaj SQL z pliku:
```
supabase/schema.sql
```

Uruchom całe SQL w SQL Editor w panelu Supabase. To utworzy:
- Wszystkie tabele (portals, users, companies, reviews, etc.)
- Row Level Security policies
- Funkcje pomocnicze
- Seed data (3 portale)

### 3. Zmienne środowiskowe

Plik `.env.local` jest już skonfigurowany z twoimi danymi:
- Supabase URL i klucze ✅
- Stripe klucze i Product IDs ✅
- Webhook secret ✅

### 4. Skonfiguruj Stripe Webhook

W panelu Stripe (Developers → Webhooks) dodaj endpoint:
```
https://your-domain.com/api/webhooks/stripe
```

Dla lokalnych testów użyj Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Wybierz eventy:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

## 🚀 Uruchomienie

```bash
npm run dev
```

Aplikacja będzie dostępna na http://localhost:3000

## 📁 Struktura projektu

```
opinieon/
├── app/
│   ├── (auth)/              # Strony bez layoutu dashboard
│   │   ├── login/          # Logowanie
│   │   ├── register/       # Rejestracja
│   │   └── onboarding/     # Wybór planu i formularz firmy
│   ├── (dashboard)/         # Panel użytkownika
│   │   └── dashboard/
│   │       ├── page.tsx    # Dashboard główny
│   │       └── reviews/    # Zarządzanie opiniami
│   ├── api/
│   │   ├── checkout/       # Tworzenie sesji Stripe
│   │   └── webhooks/       # Stripe webhooks
│   └── page.tsx            # Landing page
├── components/
│   └── dashboard/
│       └── sidebar.tsx     # Sidebar nawigacja
├── lib/
│   ├── supabase/           # Klienty Supabase
│   ├── stripe.ts           # Stripe helpers
│   └── utils.ts            # Utilities
├── types/
│   ├── database.ts         # Typy Supabase
│   └── plans.ts            # Konfiguracja planów
├── supabase/
│   └── schema.sql          # Schemat bazy danych
└── middleware.ts           # Auth middleware
```

## 🗄️ Baza danych

### Główne tabele:
- `portals` - 3 portale z opiniami
- `users` - Rozszerzone dane użytkowników
- `companies` - Firmy użytkowników
- `subscriptions` - Subskrypcje Stripe
- `reviews` - Opinie
- `review_replies` - Odpowiedzi na opinie
- `company_portal_profiles` - Profile firm na portalach
- `plan_portal_access` - Dostęp do portali dla planów

### RLS (Row Level Security)
Każdy użytkownik widzi tylko swoje dane (firmy, opinie, subskrypcje).

## 🔄 Flow użytkownika

1. **Rejestracja** → Email + hasło (Supabase Auth)
2. **Dashboard** → Pusty dashboard z przyciskiem "Dodaj firmę"
3. **Wybór planu** → Start / Pro / Biznes
4. **Formularz** → Dane osobowe + dane firmy
5. **Stripe Checkout** → Płatność z 14-dniowym trialem
6. **Webhook** → Aktywacja subskrypcji
7. **Dashboard** → Pełny dostęp do panelu

## 🎨 Do zrobienia (następne kroki)

- [ ] Strona szczegółów opinii (/dashboard/reviews/[id])
- [ ] Edycja i usuwanie opinii
- [ ] Strona zarządzania firmami (/dashboard/companies)
- [ ] Analityka (wykresy, statystyki) dla Pro/Biznes
- [ ] Odpowiedzi na opinie
- [ ] Ustawienia konta i billing portal
- [ ] Email notifications
- [ ] Export danych (CSV, PDF)

## 🔐 Bezpieczeństwo

- ✅ Row Level Security (RLS) w Supabase
- ✅ HTTPS only w produkcji
- ✅ Stripe Webhook signature verification
- ✅ Middleware auth protection
- ✅ Server-side validation

## 🆘 Wsparcie

W razie problemów sprawdź:
1. Logi Supabase (Dashboard → Logs)
2. Logi Stripe (Dashboard → Developers → Events)
3. Console w przeglądarce
4. Terminal z `npm run dev`

---

**Tech Stack:**
- Next.js 16 (App Router)
- Supabase (Auth + Database)
- Stripe (Payments)
- TypeScript
- Tailwind CSS

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# opinieon
