import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Building2, Plus, Star, TrendingUp, MessageSquare } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Sprawdź czy użytkownik ma firmy
  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)

  // Pobierz ostatnie opinie
  const { data: recentReviews } = await supabase
    .from('reviews')
    .select('*, companies(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Sprawdź czy użytkownik ma aktywną subskrypcję
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing'])
    .order('created_at', { ascending: false })
    .limit(1)

  const subscriptionData = subscriptions?.[0] as any

  // Jeśli użytkownik ma firmy ale nie ma aktywnej subskrypcji
  if (companies && companies.length > 0 && !subscriptionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="max-w-md text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Dokończ zakup subskrypcji</h3>
          <p className="text-sm text-gray-600 mb-6">
            Twoje dane zostały zapisane, ale nie dokończyłeś procesu zakupu subskrypcji. Aby korzystać z pełnej funkcjonalności, dokończ płatność.
          </p>
          <div className="space-y-3">
            <Link
              href="/onboarding/pricing"
              className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Dokończ zakup subskrypcji
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!companies || companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Brak firm</h3>
          <p className="mt-1 text-sm text-gray-500">
            Dodaj pierwszą firmę aby zacząć zarządzać opiniami
          </p>
          <div className="mt-6">
            <Link
              href="/onboarding/pricing"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="mr-2 h-5 w-5" />
              Dodaj firmę
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Witaj ponownie! Zarządzaj swoimi opiniami w jednym miejscu.
        </p>
      </div>

      {subscriptionData && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Twój plan</h2>
          <p className="text-3xl font-bold text-blue-600">{subscriptionData.plan}</p>
          <p className="text-sm text-gray-500 mt-1">
            Status: <span className="font-medium">{subscriptionData.status}</span>
          </p>
          {subscriptionData.trial_end && new Date(subscriptionData.trial_end) > new Date() && (
            <p className="text-sm text-gray-500">
              Trial kończy się: {new Date(subscriptionData.trial_end).toLocaleDateString('pl-PL')}
            </p>
          )}
        </div>
      )}

      {/* Statystyki */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md" style={{ background: 'linear-gradient(to right, #EB5B1E, #E89D1B, #F7B621)' }}>
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Profile w portalach</dt>
                  <dd className="text-lg font-semibold text-gray-900">{companies.length * 3}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link href="/dashboard/portals" className="text-sm text-orange-600 hover:text-orange-700">
              Zarządzaj profilami →
            </Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Wszystkie opinie</dt>
                  <dd className="text-lg font-semibold text-gray-900">{recentReviews?.length || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link href="/dashboard/reviews" className="text-sm text-orange-600 hover:text-orange-700">
              Zobacz opinie →
            </Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Średnia ocena</dt>
                  <dd className="text-lg font-semibold text-gray-900">4.8</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link href="/dashboard/analytics" className="text-sm text-orange-600 hover:text-orange-700">
              Analityka →
            </Link>
          </div>
        </div>
      </div>

      {/* Najnowsze opinie */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Najnowsze opinie</h2>
          <Link href="/dashboard/reviews" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            Zobacz wszystkie →
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentReviews && recentReviews.length > 0 ? (
            recentReviews.map((review: any) => (
              <div key={review.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">{review.companies?.name || 'Firma'}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{review.portal}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{review.content}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Brak opinii</h3>
              <p className="mt-1 text-sm text-gray-500">Dodaj pierwszą opinię aby zobaczyć ją tutaj</p>
              <div className="mt-6">
                <Link
                  href="/dashboard/reviews/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(to right, #EB5B1E, #E89D1B, #F7B621)' }}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Dodaj opinię
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile w portalach */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Profile w portalach</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {['Dobre Firmy', 'Arena Biznesu', 'Panteon Firm'].map((portal) => (
              <div key={portal} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{portal}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Aktywny
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Opinie:</span>
                    <span className="font-medium">{Math.floor(Math.random() * 20) + 5}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Średnia:</span>
                    <span className="font-medium flex items-center gap-1">
                      {(Math.random() * 0.5 + 4.5).toFixed(1)}
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
