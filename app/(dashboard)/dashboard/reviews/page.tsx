import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Star, MessageSquare, Plus } from 'lucide-react'

export default async function ReviewsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Pobierz firmy użytkownika
  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)

  const companiesData = (companies || []) as any[]

  // Pobierz wszystkie portale
  const { data: portals } = await supabase
    .from('portals')
    .select('*')
    .eq('is_active', true)

  // Pobierz opinie
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      company:companies(name),
      portal:portals(name, slug)
    `)
    .in('company_id', companiesData.map(c => c.id))
    .order('review_date', { ascending: false })

  const reviewsData = (reviews || []) as any[]

  if (companiesData.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Brak firm</h3>
        <p className="mt-1 text-sm text-gray-500">
          Dodaj firmę aby zarządzać opiniami
        </p>
        <div className="mt-6">
          <Link
            href="/onboarding/pricing"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(to right, #EB5B1E, #E89D1B, #F7B621)' }}
          >
            <Plus className="mr-2 h-5 w-5" />
            Dodaj firmę
          </Link>
        </div>
      </div>
    )
  }

  const averageRating = reviewsData.length > 0
    ? (reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length).toFixed(1)
    : '0.0'

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Opinie</h1>
          <p className="mt-2 text-sm text-gray-700">
            Zarządzaj opiniami dla swoich firm we wszystkich portalach
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
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

      {/* Statystyki */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md" style={{ background: 'linear-gradient(to right, #EB5B1E, #E89D1B, #F7B621)' }}>
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Wszystkie opinie
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {reviewsData.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Średnia ocena
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {averageRating} / 5.0
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Oceny 5★
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {reviewsData.filter(r => r.rating === 5).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista opinii */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {reviewsData.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Brak opinii</h3>
            <p className="mt-1 text-sm text-gray-500">
              Dodaj pierwszą opinię aby zacząć
            </p>
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
        ) : (
          <ul className="divide-y divide-gray-200">
            {reviewsData.map((review) => (
              <li key={review.id}>
                <Link
                  href={`/dashboard/reviews/${review.id}`}
                  className="block hover:bg-gray-50 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-orange-600 truncate">
                          {review.company?.name}
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {review.portal?.name}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {review.author_name}
                        </span>
                      </div>
                      {review.content && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {review.content}
                        </p>
                      )}
                    </div>
                    <div className="ml-5 flex-shrink-0 text-sm text-gray-500">
                      {new Date(review.review_date).toLocaleDateString('pl-PL')}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
