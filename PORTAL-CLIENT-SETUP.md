# Jak połączyć dobre-firmy.pl z API opinieon.pl

## 1. Konfiguracja środowiska (.env.local)

W projekcie **dobre-firmy.pl** utwórz plik `.env.local`:

```bash
# API opinieon.pl
NEXT_PUBLIC_OPINIEON_API_URL=https://opinieon.pl/api/public
OPINIEON_PORTAL_KEY=pk_xxxxxxxxxxxxxxxxxxxxxxxxx  # Klucz z Supabase
NEXT_PUBLIC_PORTAL_SLUG=dobre-firmy
```

## 2. Klient API (lib/opinieon-client.ts)

```typescript
class OpinieonClient {
  private baseUrl: string
  private portalKey: string
  private portalSlug: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_OPINIEON_API_URL!
    this.portalKey = process.env.OPINIEON_PORTAL_KEY!
    this.portalSlug = process.env.NEXT_PUBLIC_PORTAL_SLUG!
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Portal-Key': this.portalKey,
        'X-Portal-Slug': this.portalSlug,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || error.error || 'API Error')
    }

    return response.json()
  }

  // Wyszukiwanie firm
  async searchCompanies(query: string = '', page: number = 1, limit: number = 20) {
    return this.fetch(
      `/companies/search?portal=${this.portalSlug}&q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    )
  }

  // Szczegóły firmy
  async getCompany(slug: string) {
    return this.fetch(`/companies/${slug}?portal=${this.portalSlug}`)
  }

  // Opinie firmy
  async getCompanyReviews(companyId: string, page: number = 1, limit: number = 10) {
    return this.fetch(
      `/companies/${companyId}/reviews?portal=${this.portalSlug}&page=${page}&limit=${limit}`
    )
  }

  // Dodaj opinię
  async createReview(data: {
    companyId: string
    rating: number
    title: string
    content: string
    pros?: string
    cons?: string
    authorName: string
    authorEmail: string
  }) {
    return this.fetch('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const opinieonClient = new OpinieonClient()
```

## 3. Przykłady użycia

### Lista firm (app/firmy/page.tsx)

```typescript
import { opinieonClient } from '@/lib/opinieon-client'

export default async function FirmyPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string }
}) {
  const query = searchParams.q || ''
  const page = parseInt(searchParams.page || '1')

  const data = await opinieonClient.searchCompanies(query, page, 20)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Firmy na Dobre-firmy.pl</h1>
      
      {/* Wyszukiwarka */}
      <form action="/firmy" method="GET" className="mb-8">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Szukaj firmy..."
          className="w-full px-4 py-2 border rounded"
        />
      </form>

      {/* Lista firm */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.companies.map((company: any) => (
          <a
            key={company.id}
            href={`/firma/${company.slug}`}
            className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            {company.logo_url && (
              <img
                src={company.logo_url}
                alt={company.name}
                className="w-16 h-16 rounded mb-4"
              />
            )}
            <h3 className="font-bold text-lg mb-2">{company.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{company.city}</p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">★</span>
              <span className="font-semibold">{company.stats.avg_rating}</span>
              <span className="text-gray-500 text-sm">
                ({company.stats.review_count} opinii)
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Paginacja */}
      <div className="mt-8 flex justify-center gap-2">
        {page > 1 && (
          <a
            href={`/firmy?q=${query}&page=${page - 1}`}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Poprzednia
          </a>
        )}
        {data.total > page * 20 && (
          <a
            href={`/firmy?q=${query}&page=${page + 1}`}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Następna
          </a>
        )}
      </div>
    </div>
  )
}
```

### Profil firmy (app/firma/[slug]/page.tsx)

```typescript
import { opinieonClient } from '@/lib/opinieon-client'
import { ReviewForm } from '@/components/ReviewForm'
import { notFound } from 'next/navigation'

export default async function FirmaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let company
  try {
    company = await opinieonClient.getCompany(slug)
  } catch {
    notFound()
  }

  const reviews = await opinieonClient.getCompanyReviews(company.id)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header firmy */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{company.name}</h1>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-2xl text-yellow-400">★</span>
          <span className="text-xl font-semibold">
            {company.stats.avg_rating}
          </span>
          <span className="text-gray-600">
            ({company.stats.review_count} opinii)
          </span>
        </div>
        <p className="text-gray-700">{company.description}</p>
      </div>

      {/* Opinie */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Opinie</h2>
        {reviews.reviews.map((review: any) => (
          <div key={review.id} className="border-b pb-4 mb-4 last:border-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{review.author_name}</span>
              <span className="text-yellow-400">
                {'★'.repeat(review.rating)}
              </span>
            </div>
            <h3 className="font-bold mb-2">{review.title}</h3>
            <p className="text-gray-700">{review.content}</p>
          </div>
        ))}
      </div>

      {/* Formularz opinii */}
      {reviews.reviews_enabled && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Dodaj opinię</h2>
          <ReviewForm companyId={company.id} />
        </div>
      )}
    </div>
  )
}
```

### Komponent formularza opinii (components/ReviewForm.tsx)

```typescript
'use client'

import { useState } from 'react'
import { opinieonClient } from '@/lib/opinieon-client'

export function ReviewForm({ companyId }: { companyId: string }) {
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await opinieonClient.createReview({
        companyId,
        rating,
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        pros: formData.get('pros') as string,
        cons: formData.get('cons') as string,
        authorName: formData.get('name') as string,
        authorEmail: formData.get('email') as string,
      })

      setSubmitted(true)
    } catch (error) {
      alert('Błąd: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded p-6 text-center">
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Dziękujemy za opinię!
        </h3>
        <p className="text-green-700">
          Wysłaliśmy link weryfikacyjny na Twój email.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-2">Ocena</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block font-medium mb-2">
          Tytuł
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="content" className="block font-medium mb-2">
          Treść opinii
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={5}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="pros" className="block font-medium mb-2">
            Plusy
          </label>
          <textarea
            id="pros"
            name="pros"
            rows={3}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="cons" className="block font-medium mb-2">
            Minusy
          </label>
          <textarea
            id="cons"
            name="cons"
            rows={3}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block font-medium mb-2">
            Twoje imię
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white font-semibold py-3 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Wysyłanie...' : 'Dodaj opinię'}
      </button>
    </form>
  )
}
```

## 4. Jak wygenerować klucz API

W Supabase SQL Editor (opinieon.pl):

```sql
-- 1. Znajdź portal_id
SELECT id FROM portals WHERE slug = 'dobre-firmy';

-- 2. Wygeneruj klucz
SELECT generate_portal_api_key();
-- Zwróci: pk_abc123...

-- 3. Zapisz hash w bazie
INSERT INTO portal_keys (portal_id, key_hash, name, active)
VALUES (
  (SELECT id FROM portals WHERE slug = 'dobre-firmy'),
  encode(digest('pk_abc123...', 'sha256'), 'hex'),
  'Dobre Firmy Production Key',
  true
);
```

**WAŻNE:** Zapisz klucz `pk_abc123...` w `.env.local` - nie da się go odzyskać!

## 5. Testowanie

```bash
# W projekcie dobre-firmy.pl
npm install
npm run dev

# Sprawdź:
# http://localhost:3000/firmy - lista firm
# http://localhost:3000/firma/[slug] - profil firmy
```

## 6. Deploy

1. Deploy dobre-firmy.pl na Vercel
2. Dodaj zmienne środowiskowe w Vercel Dashboard:
   - `NEXT_PUBLIC_OPINIEON_API_URL`
   - `OPINIEON_PORTAL_KEY`
   - `NEXT_PUBLIC_PORTAL_SLUG`
3. Redeploy

## Troubleshooting

### Error: Unauthorized
- Sprawdź czy `OPINIEON_PORTAL_KEY` jest poprawny
- Sprawdź czy w bazie `portal_keys` klucz jest `active = true`
- Sprawdź czy `NEXT_PUBLIC_PORTAL_SLUG` = 'dobre-firmy'

### Error: Portal not found
- Uruchom migrację `20260109_add_portal_features.sql` w Supabase
- Sprawdź czy portal 'dobre-firmy' istnieje w tabeli `portals`

### Brak danych
- Sprawdź czy firma ma profil na portalu w `company_portal_profiles`
- Sprawdź czy `is_active = true` dla profilu
