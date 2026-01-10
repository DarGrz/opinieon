# Arena Biznesu - Wytyczne Brandingowe

## Paleta Kolorów

### Kolory Główne
- **Biel**: `#FFFFFF`
- **Czarny**: `#000000`, `#1A1A1A` (soft black)
- **Bordowy Główny**: `#8B1538`
- **Bordowy Ciemny**: `#5D0E26`

### Gradienty Bordowe
```css
/* Gradient główny - poziomy */
background: linear-gradient(to right, #8B1538, #5D0E26);

/* Gradient hero - ukośny */
background: linear-gradient(135deg, #8B1538 0%, #5D0E26 100%);

/* Gradient subtelny - dla hover states */
background: linear-gradient(to right, #9B1F42, #6D1430);

/* Gradient z overlay dla obrazów */
background: linear-gradient(rgba(139, 21, 56, 0.8), rgba(93, 14, 38, 0.9));
```

### Kolory Pomocnicze
- **Bordowy Jasny**: `#A82E54` (dla hover states)
- **Bordowy Bardzo Jasny**: `#C44669` (dla akcenty)
- **Szary Jasny**: `#F5F5F5` (tła sekcji)
- **Szary Średni**: `#E0E0E0` (obramowania)
- **Szary Ciemny**: `#4A4A4A` (teksty drugorzędne)

### Kolory Statusów
- **Sukces**: `#2D5016` (ciemna zieleń)
- **Ostrzeżenie**: `#8B6914` (ciemny złoty)
- **Błąd**: `#8B1538` (bordowy główny)
- **Info**: `#1A3A5D` (ciemny niebieski)

## Typografia

### Czcionki
```css
/* Nagłówki - eleganckie, silne */
font-family: 'Playfair Display', 'Georgia', serif;

/* Tekst podstawowy - czytelny, profesjonalny */
font-family: 'Inter', 'Helvetica Neue', 'Arial', sans-serif;

/* Alternatywnie dla nagłówków */
font-family: 'Montserrat', 'Arial', sans-serif;
```

### Hierarchia Nagłówków
```css
/* H1 - Tytuł główny */
font-size: 3.5rem; /* 56px */
font-weight: 700;
line-height: 1.2;
color: #1A1A1A;
font-family: 'Playfair Display', serif;

/* H2 - Sekcje */
font-size: 2.5rem; /* 40px */
font-weight: 600;
line-height: 1.3;
color: #1A1A1A;

/* H3 - Podsekcje */
font-size: 1.875rem; /* 30px */
font-weight: 600;
line-height: 1.4;
color: #1A1A1A;

/* H4 */
font-size: 1.5rem; /* 24px */
font-weight: 500;
line-height: 1.5;
color: #4A4A4A;

/* Body */
font-size: 1rem; /* 16px */
font-weight: 400;
line-height: 1.6;
color: #1A1A1A;

/* Small */
font-size: 0.875rem; /* 14px */
color: #4A4A4A;
```

## Komponenty UI

### Przyciski

#### Przycisk Główny (Primary)
```css
background: linear-gradient(to right, #8B1538, #5D0E26);
color: #FFFFFF;
padding: 12px 32px;
border-radius: 6px;
font-weight: 600;
border: none;
transition: all 0.3s ease;

/* Hover */
background: linear-gradient(to right, #9B1F42, #6D1430);
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(139, 21, 56, 0.3);
```

#### Przycisk Drugorzędny (Secondary)
```css
background: #FFFFFF;
color: #8B1538;
padding: 12px 32px;
border: 2px solid #8B1538;
border-radius: 6px;
font-weight: 600;
transition: all 0.3s ease;

/* Hover */
background: #8B1538;
color: #FFFFFF;
```

#### Przycisk Outline
```css
background: transparent;
color: #1A1A1A;
padding: 10px 28px;
border: 1px solid #E0E0E0;
border-radius: 6px;
font-weight: 500;

/* Hover */
border-color: #8B1538;
color: #8B1538;
```

### Karty (Cards)

```css
background: #FFFFFF;
border-radius: 12px;
padding: 24px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
border: 1px solid #E0E0E0;
transition: all 0.3s ease;

/* Hover */
box-shadow: 0 8px 24px rgba(139, 21, 56, 0.12);
transform: translateY(-4px);
border-color: #8B1538;
```

### Oceny Gwiazdkowe

```css
/* Gwiazdka wypełniona */
color: #8B1538;
fill: #8B1538;

/* Gwiazdka pusta */
color: #E0E0E0;
```

### Formularze

```css
/* Input */
background: #FFFFFF;
border: 2px solid #E0E0E0;
border-radius: 6px;
padding: 12px 16px;
font-size: 1rem;
color: #1A1A1A;
transition: all 0.2s ease;

/* Focus */
border-color: #8B1538;
outline: none;
box-shadow: 0 0 0 3px rgba(139, 21, 56, 0.1);

/* Error */
border-color: #8B1538;

/* Label */
color: #4A4A4A;
font-weight: 500;
font-size: 0.875rem;
margin-bottom: 6px;
```

### Odznaki (Badges)

```css
/* Status zatwierdzona */
background: rgba(45, 80, 22, 0.1);
color: #2D5016;
padding: 4px 12px;
border-radius: 12px;
font-size: 0.75rem;
font-weight: 600;

/* Status oczekuje */
background: rgba(139, 105, 20, 0.1);
color: #8B6914;

/* Portal badge */
background: rgba(139, 21, 56, 0.1);
color: #8B1538;
```

## Layout

### Szerokości Kontenerów
```css
/* Container główny */
max-width: 1200px;
margin: 0 auto;
padding: 0 24px;

/* Container wąski (formularze) */
max-width: 600px;

/* Container szeroki (landing) */
max-width: 1400px;
```

### Spacing System
```css
/* 4px base unit */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
--spacing-4xl: 96px;
```

### Grid System
```css
/* 12-kolumnowy grid */
display: grid;
grid-template-columns: repeat(12, 1fr);
gap: 24px;

/* Responsive */
@media (max-width: 768px) {
  grid-template-columns: 1fr;
}
```

## Sekcje Landing Page

### Hero Section
```css
background: linear-gradient(135deg, #8B1538 0%, #5D0E26 100%);
color: #FFFFFF;
padding: 96px 24px;
text-align: center;

/* Overlay dla obrazu tła (opcjonalnie) */
background: 
  linear-gradient(rgba(139, 21, 56, 0.85), rgba(93, 14, 38, 0.95)),
  url('hero-image.jpg');
background-size: cover;
background-position: center;
```

### Sekcja Opinie
```css
background: #F5F5F5;
padding: 64px 24px;
```

### Sekcja Statystyk
```css
background: #FFFFFF;
padding: 64px 24px;

/* Liczby */
font-size: 3rem;
font-weight: 700;
background: linear-gradient(to right, #8B1538, #5D0E26);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Footer
```css
background: #1A1A1A;
color: #FFFFFF;
padding: 48px 24px 24px;

/* Linki */
color: #E0E0E0;
transition: color 0.2s ease;

/* Linki hover */
color: #A82E54;
```

## Elementy Interaktywne

### Hover Effects
```css
/* Łagodne przejścia */
transition: all 0.3s ease;

/* Podniesienie */
transform: translateY(-4px);

/* Cień */
box-shadow: 0 8px 24px rgba(139, 21, 56, 0.15);
```

### Loading States
```css
/* Spinner */
border: 3px solid #E0E0E0;
border-top-color: #8B1538;
border-radius: 50%;
animation: spin 1s linear infinite;
```

### Animacje
```css
/* Fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide in */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

## Ikony

- Styl: Outline (konturowe)
- Szerokość linii: 2px
- Kolor domyślny: `#1A1A1A`
- Kolor akcentowany: `#8B1538`
- Rozmiary: 16px, 20px, 24px, 32px

## Responsywność

### Breakpoints
```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

### Mobile-First Approach
```css
/* Bazowe style dla mobile */
font-size: 1rem;
padding: 16px;

/* Tablet i większe */
@media (min-width: 768px) {
  font-size: 1.125rem;
  padding: 24px;
}
```

## Dostępność

### Kontrast
- Tekst główny na białym: ratio 16:1 ✓
- Tekst na bordowym: tylko biały (#FFFFFF) ✓
- Przyciski: kontrast minimum 4.5:1 ✓

### Focus States
```css
/* Wszystkie interaktywne elementy */
:focus-visible {
  outline: 3px solid #8B1538;
  outline-offset: 2px;
}
```

## Przykłady Zastosowania

### Nagłówek Portalu
```jsx
<header className="bg-white border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8B1538] to-[#5D0E26] bg-clip-text text-transparent">
        Arena Biznesu
      </h1>
      <button className="px-6 py-2 bg-gradient-to-r from-[#8B1538] to-[#5D0E26] text-white rounded-md font-semibold hover:from-[#9B1F42] hover:to-[#6D1430] transition-all">
        Dodaj opinię
      </button>
    </div>
  </div>
</header>
```

### Karta Opinii
```jsx
<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#8B1538] transition-all">
  <div className="flex items-center gap-1 mb-2">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i}
        className={i < rating ? "text-[#8B1538] fill-[#8B1538]" : "text-gray-300"}
      />
    ))}
  </div>
  <p className="text-gray-900 leading-relaxed">{content}</p>
  <p className="text-sm text-gray-600 mt-4">{authorName}</p>
</div>
```

### Hero Section
```jsx
<section className="bg-gradient-to-br from-[#8B1538] to-[#5D0E26] text-white py-24">
  <div className="max-w-4xl mx-auto text-center px-4">
    <h1 className="text-5xl font-bold mb-6">
      Twoje opinie budują zaufanie
    </h1>
    <p className="text-xl mb-8 text-white/90">
      Poznaj doświadczenia innych klientów i podejmuj świadome decyzje biznesowe
    </p>
    <button className="bg-white text-[#8B1538] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all">
      Zobacz opinie
    </button>
  </div>
</section>
```

## Best Practices

1. **Konsekwencja**: Używaj zdefiniowanych kolorów i odstępów w całym portalu
2. **Czytelność**: Zawsze dbaj o odpowiedni kontrast tekstu
3. **Elegancja**: Bordowy + biel + czarny = klasyczna, elegancka kombinacja
4. **Umiar**: Nie przesadzaj z gradientami - używaj ich strategicznie
5. **Przestrzeń**: Daj elementom oddychać - używaj odpowiednich marginów
6. **Spójność**: Wszystkie interaktywne elementy powinny reagować podobnie

## Kolory do Skopiowania (Tailwind)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'arena': {
          'burgundy': {
            50: '#f8f3f4',
            100: '#f0e5e8',
            200: '#e0cbd0',
            300: '#c44669',
            400: '#a82e54',
            500: '#8b1538', // główny
            600: '#6d1430',
            700: '#5d0e26', // ciemny
          }
        }
      }
    }
  }
}
```

---

# Integracja z Bazą Opinieon

## Architektura Portalu

Portal **Arena Biznesu** to **OSOBNA APLIKACJA Next.js** - publiczny portal opinii zintegrowany z platformą Opinieon przez API.

### Kluczowe Informacje

- 🌐 **Osobna domena**: arena-biznesu.pl (np. Vercel, Netlify)
- 📦 **Osobny projekt**: Całkowicie niezależny od opinieon
- 🔌 **Komunikacja**: Tylko przez publiczne API endpointy
- 🎨 **Własny branding**: Bordowy gradient + biel + czarny
- 👥 **Bez dashboardu**: Tylko widok publiczny dla użytkowników

### Struktura Projektów

```
📁 Twoje repozytoria/
├── 📁 opinieon/                    ← Istniejący projekt (dashboard)
│   ├── app/(dashboard)/
│   ├── app/api/public/            ← API dla portali zewnętrznych
│   └── ...
│
└── 📁 arena-biznesu/               ← NOWY osobny projekt!
    ├── app/
    │   ├── page.tsx
    │   ├── firma/[slug]/
    │   └── components/
    ├── package.json
    ├── .env.local
    └── next.config.ts
```

### Co może robić użytkownik portalu:
- Przeglądać firmy
- Czytać opinie
- Dodawać nowe opinie
- Wyszukiwać firmy

## Konfiguracja Portalu

### Pełny Skrypt SQL - Utworzenie Portalu Arena Biznesu

**SKOPIUJ I WKLEJ W KONSOLI SUPABASE SQL EDITOR:**

```sql
-- ============================================
-- Generowanie klucza API dla portalu arena-biznesu
-- ============================================

-- KROK 1: Wygeneruj klucz i WYŚWIETL GO
WITH new_key_data AS (
  SELECT 
    'pk_' || encode(gen_random_bytes(32), 'hex') as raw_key,
    (SELECT id FROM portals WHERE slug = 'arena-biznesu') as portal_id
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

-- KROK 2: Sprawdź czy klucz został zapisany
SELECT 
  pk.id,
  pk.name,
  p.slug as portal,
  pk.active,
  pk.key_hash as hash_w_bazie,
  pk.created_at
FROM portal_keys pk
JOIN portals p ON p.id = pk.portal_id
WHERE p.slug = 'arena-biznesu'
ORDER BY pk.created_at DESC
LIMIT 1;

-- ============================================
-- SKOPIUJ KLUCZ Z KOLUMNY "🔑 KLUCZ_DO_ENV_LOCAL"
-- I WKLEJ DO .env.local:
-- NEXT_PUBLIC_ARENA_BIZNESU_KEY="pk_..."
-- ============================================
```

### Przypisanie Wszystkich Firm do Portalu (Opcjonalne)

Jeśli chcesz, aby wszystkie firmy były dostępne w portalu Arena Biznesu:

```sql
-- Przypisz wszystkie istniejące firmy do portalu arena-biznesu
INSERT INTO portal_companies (portal_id, company_id)
SELECT 
  (SELECT id FROM portals WHERE slug = 'arena-biznesu'),
  id
FROM companies
ON CONFLICT (portal_id, company_id) DO NOTHING;

-- Sprawdź ile firm zostało przypisanych
SELECT 
  p.name as portal_name,
  COUNT(pc.company_id) as liczba_firm
FROM portals p
LEFT JOIN portal_companies pc ON p.id = pc.portal_id
WHERE p.slug = 'arena-biznesu'
GROUP BY p.name;
```

### Przypisanie Wybranych Firm do Portalu

Jeśli chcesz przypisać tylko wybrane firmy:

```sql
-- Przypisz konkretne firmy po nazwie
INSERT INTO portal_companies (portal_id, company_id)
SELECT 
  (SELECT id FROM portals WHERE slug = 'arena-biznesu'),
  id
FROM companies
WHERE name IN ('Firma A', 'Firma B', 'Firma C')
ON CONFLICT (portal_id, company_id) DO NOTHING;

-- Lub przypisz firmy po slug
INSERT INTO portal_companies (portal_id, company_id)
SELECT 
  (SELECT id FROM portals WHERE slug = 'arena-biznesu'),
  id
FROM companies
WHERE slug IN ('firma-a', 'firma-b', 'firma-c')
ON CONFLICT (portal_id, company_id) DO NOTHING;
```

### Regeneracja Klucza API (jeśli potrzeba)

```sql
-- Wygeneruj nowy klucz API dla portalu
UPDATE portals 
SET portal_key = gen_random_uuid()::text,
    updated_at = NOW()
WHERE slug = 'arena-biznesu'
RETURNING id, name, slug, portal_key;
```

### Sprawdzenie Konfiguracji

```sql
-- Sprawdź pełną konfigurację portalu
SELECT 
  p.id,
  p.name,
  p.slug,
  p.portal_key,
  p.primary_color,
  p.secondary_color,
  COUNT(pc.company_id) as liczba_przypisanych_firm,
  COUNT(r.id) as liczba_opinii
FROM portals p
LEFT JOIN portal_companies pc ON p.id = pc.portal_id
LEFT JOIN reviews r ON r.portal_id = p.id AND r.status = 'approved'
WHERE p.slug = 'arena-biznesu'
GROUP BY p.id, p.name, p.slug, p.portal_key, p.primary_color, p.secondary_color;
```

## Endpointy API

### Wyszukiwanie Firm

**Endpoint**: `GET /api/public/companies/search`

**Query params**:
- `portalKey` (required) - klucz portalu
- `query` (required) - fraza wyszukiwania
- `limit` (optional) - max liczba wyników (domyślnie 10)

**Przykład użycia**:

```typescript
// app/(portal)/arena-biznesu/components/CompanySearch.tsx
'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

const PORTAL_KEY = process.env.NEXT_PUBLIC_ARENA_BIZNESU_KEY!
const API_URL = process.env.NEXT_PUBLIC_OPINIEON_API_URL!

interface Company {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  avg_rating: number
  review_count: number
}

export function CompanySearch() {
  const [query, setQuery] = useState('')
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setCompanies([])
      return
    }

    setLoading(true)
    try {
      const res = await fetch(
        `${API_URL}/api/public/companies/search?portalKey=${PORTAL_KEY}&query=${encodeURIComponent(searchQuery)}&limit=10`
      )
      
      if (res.ok) {
        const data = await res.json()
        setCompanies(data.companies || [])
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            handleSearch(e.target.value)
          }}
          placeholder="Wyszukaj firmę..."
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg focus:border-[#8B1538] focus:ring-2 focus:ring-[#8B1538]/20 outline-none transition-all"
        />
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#8B1538]" />
        </div>
      )}

      {companies.length > 0 && (
        <div className="mt-4 space-y-2">
          {companies.map(company => (
            <a
              key={company.id}
              href={`/arena-biznesu/firma/${company.slug}`}
              className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-[#8B1538] hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                {company.logo_url && (
                  <img 
                    src={company.logo_url} 
                    alt={company.name}
                    className="w-12 h-12 object-contain rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{company.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      <span className="text-[#8B1538] font-bold">
                        {company.avg_rating?.toFixed(1) || '-'}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">★</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      ({company.review_count} {company.review_count === 1 ? 'opinia' : 'opinii'})
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Pobieranie Szczegółów Firmy

**Endpoint**: `GET /api/public/companies/[slug]`

**Query params**:
- `portalKey` (required) - klucz portalu

**Przykład użycia**:

```typescript
// app/(portal)/arena-biznesu/firma/[slug]/page.tsx
import { notFound } from 'next/navigation'

const PORTAL_KEY = process.env.NEXT_PUBLIC_ARENA_BIZNESU_KEY!

async function getCompany(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/public/companies/${slug}?portalKey=${PORTAL_KEY}`,
    { next: { revalidate: 60 } } // Cache 1 min
  )
  
  if (!res.ok) return null
  const data = await res.json()
  return data.company
}

export default async function CompanyPage({ params }: { params: { slug: string } }) {
  const company = await getCompany(params.slug)
  
  if (!company) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        {/* Logo i nazwa */}
        <div className="flex items-start gap-6 mb-6">
          {company.logo_url && (
            <img 
              src={company.logo_url} 
              alt={company.name}
              className="w-24 h-24 object-contain rounded-lg"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {company.name}
            </h1>
            {company.description && (
              <p className="text-gray-600">{company.description}</p>
            )}
          </div>
        </div>

        {/* Statystyki */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-r from-[#8B1538] to-[#5D0E26] rounded-lg p-6 text-white">
            <div className="text-5xl font-bold mb-2">
              {company.avg_rating?.toFixed(1) || '-'}
            </div>
            <div className="text-white/80">Średnia ocena</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {company.review_count}
            </div>
            <div className="text-gray-600">Opinii</div>
          </div>
        </div>

        {/* Przycisk dodaj opinię */}
        <a
          href={`/arena-biznesu/firma/${company.slug}/dodaj-opinie`}
          className="inline-block w-full text-center bg-gradient-to-r from-[#8B1538] to-[#5D0E26] text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-[#9B1F42] hover:to-[#6D1430] transition-all"
        >
          Dodaj opinię
        </a>
      </div>
    </div>
  )
}
```

### Pobieranie Opinii dla Firmy

**Endpoint**: `GET /api/public/companies/[slug]/reviews`

**Query params**:
- `portalKey` (required) - klucz portalu
- `page` (optional) - numer strony (domyślnie 1)
- `limit` (optional) - liczba opinii na stronę (domyślnie 20)

**Przykład użycia**:

```typescript
// app/(portal)/arena-biznesu/firma/[slug]/components/ReviewsList.tsx
'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

const PORTAL_KEY = process.env.NEXT_PUBLIC_ARENA_BIZNESU_KEY!

interface Review {
  id: string
  rating: number
  title: string | null
  content: string
  author_name: string
  review_date: string
}

export function ReviewsList({ companySlug }: { companySlug: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function loadReviews() {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/public/companies/${companySlug}/reviews?portalKey=${PORTAL_KEY}&page=${page}&limit=20`
        )
        
        if (res.ok) {
          const data = await res.json()
          setReviews(data.reviews || [])
        }
      } catch (error) {
        console.error('Error loading reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [companySlug, page])

  if (loading) {
    return <div className="text-center py-12">Ładowanie opinii...</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Brak opinii. Dodaj pierwszą!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <div 
          key={review.id}
          className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#8B1538] transition-all"
        >
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < review.rating
                    ? 'text-[#8B1538] fill-[#8B1538]'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Tytuł */}
          {review.title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {review.title}
            </h3>
          )}

          {/* Treść */}
          <p className="text-gray-700 leading-relaxed mb-4">
            {review.content}
          </p>

          {/* Autor i data */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="font-medium">{review.author_name}</span>
            <span>{new Date(review.review_date).toLocaleDateString('pl-PL')}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Dodawanie Opinii

**Endpoint**: `POST /api/public/reviews`

**Headers**:
- `Content-Type: application/json`

**Body**:
```json
{
  "portalKey": "klucz-portalu",
  "companySlug": "slug-firmy",
  "rating": 5,
  "title": "Tytuł opinii (opcjonalny)",
  "content": "Treść opinii",
  "authorName": "Jan Kowalski",
  "authorEmail": "jan@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "review": {
    "id": "uuid",
    "status": "pending"
  }
}
```

**Przykład formularza**:

```typescript
// app/(portal)/arena-biznesu/firma/[slug]/dodaj-opinie/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'

const PORTAL_KEY = process.env.NEXT_PUBLIC_ARENA_BIZNESU_KEY!

export default function AddReviewPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    rating: 5,
    title: '',
    content: '',
    authorName: '',
    authorEmail: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/public/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portalKey: PORTAL_KEY,
          companySlug: params.slug,
          rating: form.rating,
          title: form.title || null,
          content: form.content,
          authorName: form.authorName,
          authorEmail: form.authorEmail
        })
      })

      if (res.ok) {
        alert('Dziękujemy! Twoja opinia czeka na moderację.')
        router.push(`/arena-biznesu/firma/${params.slug}`)
      } else {
        const error = await res.json()
        alert(error.error || 'Wystąpił błąd')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Wystąpił błąd podczas wysyłania opinii')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Dodaj opinię
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Ocena *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setForm({ ...form, rating })}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 ${
                      rating <= form.rating
                        ? 'text-[#8B1538] fill-[#8B1538]'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-lg font-semibold text-gray-700">
                {form.rating}/5
              </span>
            </div>
          </div>

          {/* Tytuł */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tytuł (opcjonalny)
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="np. Świetna obsługa"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#8B1538] focus:ring-2 focus:ring-[#8B1538]/20 outline-none transition-all"
            />
          </div>

          {/* Treść */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Treść opinii *
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              rows={6}
              placeholder="Opisz swoje doświadczenia..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#8B1538] focus:ring-2 focus:ring-[#8B1538]/20 outline-none transition-all resize-none"
            />
          </div>

          {/* Imię i nazwisko */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Imię i nazwisko *
            </label>
            <input
              type="text"
              value={form.authorName}
              onChange={(e) => setForm({ ...form, authorName: e.target.value })}
              required
              placeholder="Jan Kowalski"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#8B1538] focus:ring-2 focus:ring-[#8B1538]/20 outline-none transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={form.authorEmail}
              onChange={(e) => setForm({ ...form, authorEmail: e.target.value })}
              required
              placeholder="jan@example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#8B1538] focus:ring-2 focus:ring-[#8B1538]/20 outline-none transition-all"
            />
            <p className="text-sm text-gray-500 mt-1">
              Email nie będzie publikowany
            </p>
          </div>

          {/* Przycisk submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#8B1538] to-[#5D0E26] text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-[#9B1F42] hover:to-[#6D1430] disabled:opacity-50 transition-all"
          >
            {loading ? 'Wysyłanie...' : 'Wyślij opinię'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

## Struktura Katalogów Portalu

**UWAGA**: To jest OSOBNY projekt Next.js, NIE folder w opinieon!

```
arena-biznesu/                    ← Nowy projekt (osobne repo)
├── app/
│   ├── layout.tsx               # Root layout z czcionkami, metadata
│   ├── page.tsx                 # Strona główna portalu
│   ├── globals.css              # Tailwind + custom style
│   ├── firma/
│   │   └── [slug]/
│   │       ├── page.tsx         # Szczegóły firmy
│   │       └── dodaj-opinie/
│   │           └── page.tsx     # Formularz dodawania opinii
│   └── components/
│       ├── CompanySearch.tsx    # Wyszukiwarka firm
│       ├── Navigation.tsx       # Nawigacja portalu
│       ├── Footer.tsx           # Stopka portalu
│       └── ReviewCard.tsx       # Karta opinii
├── lib/
│   └── api.ts                   # Client do API opinieon.pl
├── public/
│   └── logo.svg
├── .env.local                   # NEXT_PUBLIC_ARENA_BIZNESU_KEY
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

## Zmienne Środowiskowe

Dodaj do `.env.local` w projekcie **arena-biznesu**:

```bash
# API Key dla portalu
NEXT_PUBLIC_ARENA_BIZNESU_KEY="pk_...klucz-z-sql"

# URL do API Opinieon (WAŻNE!)
NEXT_PUBLIC_OPINIEON_API_URL="https://opinieon.pl"  # Produkcja
# NEXT_PUBLIC_OPINIEON_API_URL="http://localhost:3000"  # Development
```

### Deployment

**Vercel (zalecane)**:
1. Push projektu arena-biznesu na GitHub
2. Połącz z Vercel
3. Dodaj zmienne środowiskowe w Settings
4. Ustaw domenę: arena-biznesu.pl

**Netlify**:
1. Deploy folder arena-biznesu
2. Environment Variables: dodaj NEXT_PUBLIC_*
3. Custom domain: arena-biznesu.pl

## Uruchomienie Projektu Lokalnie

### 1. Utwórz nowy projekt

```bash
# Utwórz nowy projekt Next.js
npx create-next-app@latest arena-biznesu
cd arena-biznesu

# Zainstaluj zależności
npm install lucide-react
```

### 2. Skonfiguruj .env.local

```bash
NEXT_PUBLIC_ARENA_BIZNESU_KEY="klucz-z-sql"
NEXT_PUBLIC_OPINIEON_API_URL="http://localhost:3000"
```

### 3. Skopiuj komponenty z wytycznych

Skopiuj gotowe komponenty z tego dokumentu do odpowiednich plików.

### 4. Uruchom

```bash
npm run dev
# Arena Biznesu: http://localhost:3001
```

**WAŻNE**: Opinieon musi działać na localhost:3000, żeby API działało!

## Moderacja Opinii

Wszystkie opinie dodawane przez użytkowników mają domyślnie status `pending` i wymagają zatwierdzenia przez administratora w dashboardzie opinieon `/dashboard/reviews`.

Po zatwierdzeniu (w opinieon), opinia automatycznie pojawia się w portalu arena-biznesu.

## Bezpieczeństwo

1. **Portal Key**: Klucz portalu może być publiczny (NEXT_PUBLIC_), ponieważ służy tylko do identyfikacji portalu, nie do zapisu
2. **Rate Limiting**: API powinno mieć rate limiting dla publicznych endpointów
3. **Walidacja**: Wszystkie dane wejściowe są walidowane po stronie serwera
4. **CAPTCHA**: Rozważ dodanie reCAPTCHA do formularza dodawania opinii
5. **Content Moderation**: Wszystkie opinie przechodzą moderację

## SEO i Performance

### Metadata dla Stron Firm

```typescript
// app/(portal)/arena-biznesu/firma/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const company = await getCompany(params.slug)
  
  if (!company) return {}

  return {
    title: `${company.name} - Opinie | Arena Biznesu`,
    description: `Przeczytaj opinie o ${company.name}. Średnia ocena: ${company.avg_rating?.toFixed(1)} ⭐ na podstawie ${company.review_count} opinii.`,
    openGraph: {
      title: `${company.name} - Opinie`,
      description: company.description || `Opinie o ${company.name}`,
      images: company.logo_url ? [company.logo_url] : [],
    }
  }
}
```

### Cache Strategy

```typescript
// ISR (Incremental Static Regeneration)
export const revalidate = 60 // Rewalidacja co 60 sekund

// Lub dynamiczne cache
const res = await fetch(url, {
  next: { revalidate: 60 }
})
```

## Monitoring i Analytics

```typescript
// Śledzenie dodawania opinii
gtag('event', 'review_submitted', {
  company_slug: params.slug,
  rating: form.rating
})

// Śledzenie wyszukiwań
gtag('event', 'search', {
  search_term: query
})
```
