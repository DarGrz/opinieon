'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { PLAN_CONFIG } from '@/types/plans'
import type { SubscriptionPlan } from '@/types/database'

// Prosty klient Supabase bez generycznych typów
function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

interface CompanyRow {
  id: string
  name: string
  nip: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  phone: string | null
  website: string | null
  email: string | null
  description: string | null
}

interface UserRow {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
}

function CompanyFormContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = getSupabase()
  
  const planParam = searchParams.get('plan') as SubscriptionPlan
  const [plan] = useState<SubscriptionPlan>(planParam || 'START')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    nip: '',
    address: '',
    city: '',
    postalCode: '',
    companyPhone: '',
    website: '',
    email: '',
    description: '',
  })

  useEffect(() => {
    if (!planParam) {
      router.push('/onboarding/pricing')
    }
  }, [planParam, router])

  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        const { data: companyData } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .limit(1)
          .single()

        const userRecord = userData as UserRow | null
        const companyRecord = companyData as CompanyRow | null

        if (userRecord || companyRecord) {
          setFormData({
            firstName: userRecord?.first_name || '',
            lastName: userRecord?.last_name || '',
            phone: userRecord?.phone || '',
            companyName: companyRecord?.name || '',
            nip: companyRecord?.nip || '',
            address: companyRecord?.address || '',
            city: companyRecord?.city || '',
            postalCode: companyRecord?.postal_code || '',
            companyPhone: companyRecord?.phone || '',
            website: companyRecord?.website || '',
            email: companyRecord?.email || '',
            description: companyRecord?.description || '',
          })
        }
      } catch (err) {
        console.error('Error loading existing data:', err)
      } finally {
        setInitialLoading(false)
      }
    }

    loadExistingData()
  }, [supabase, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Aktualizuj profil użytkownika
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
        })

      if (userError) throw userError

      // Sprawdź czy firma już istnieje
      const { data: existingCompanies } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      let companyId: string

      const companyPayload = {
        name: formData.companyName,
        nip: formData.nip || null,
        address: formData.address || null,
        city: formData.city || null,
        postal_code: formData.postalCode || null,
        phone: formData.companyPhone || null,
        website: formData.website || null,
        email: formData.email || null,
        description: formData.description || null,
      }

      if (existingCompanies && existingCompanies.length > 0) {
        const existingCompany = existingCompanies[0] as { id: string }
        const { data: updatedCompany, error: updateError } = await supabase
          .from('companies')
          .update(companyPayload)
          .eq('id', existingCompany.id)
          .select()
          .single()

        if (updateError) throw updateError
        companyId = (updatedCompany as CompanyRow).id
      } else {
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .insert({
            user_id: user.id,
            ...companyPayload,
          })
          .select()
          .single()

        if (companyError) throw companyError
        companyId = (company as CompanyRow).id
      }

      // Przekieruj do checkout Stripe
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          companyId,
          companyData: {
            name: formData.companyName,
            nip: formData.nip,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            email: formData.email || undefined,
            phone: formData.companyPhone || undefined,
          },
        }),
      })

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Wystąpił błąd podczas tworzenia firmy'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const selectedPlan = PLAN_CONFIG[plan]

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie danych...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Uzupełnij dane
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Wybrany plan: <span className="font-semibold text-orange-600">{selectedPlan.name}</span> ({selectedPlan.price} zł/miesiąc)
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dane osobowe</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Imię *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Nazwisko *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dane firmy</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Nazwa firmy *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="nip" className="block text-sm font-medium text-gray-700">
                    NIP
                  </label>
                  <input
                    type="text"
                    name="nip"
                    id="nip"
                    value={formData.nip}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700">
                    Telefon firmowy
                  </label>
                  <input
                    type="tel"
                    name="companyPhone"
                    id="companyPhone"
                    value={formData.companyPhone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border px-3 py-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Adres
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Miasto
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                    Kod pocztowy
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email firmowy
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Strona WWW
                  </label>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border px-3 py-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Opis firmy
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => router.push('/onboarding/pricing')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Wstecz
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-sm font-medium text-white border border-transparent rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                style={{ background: 'linear-gradient(to right, #EB5B1E, #E89D1B, #F7B621)' }}
              >
                {loading ? 'Przetwarzanie...' : 'Przejdź do płatności'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function CompanyPage() {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <CompanyFormContent />
    </Suspense>
  )
}
