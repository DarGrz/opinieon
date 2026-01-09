import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TrendingUp, Star, MessageSquare, Calendar, ArrowUp, ArrowDown } from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Sprawdź plan użytkownika
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing'])
    .order('created_at', { ascending: false })
    .limit(1)

  const userPlan = (subscriptions as any)?.[0]?.plan || 'FREE'

  // Jeśli plan FREE, pokaż komunikat o upgrade
  if (userPlan === 'FREE') {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Analityka</h1>
        
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4" style={{ background: 'linear-gradient(to right, #EB5B1E, #E89D1B, #F7B621)' }}>
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analityka dostępna w planie PRO i BIZNES</h3>
          <p className="text-gray-600 mb-6">
            Uaktualnij swój plan, aby uzyskać dostęp do zaawansowanych wykresów, raportów i analiz trendów.
          </p>
          <a
            href="/onboarding/pricing"
            className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(to right, #EB5B1E, #E89D1B, #F7B621)' }}
          >
            Uaktualnij plan
          </a>
        </div>
      </div>
    )
  }

  // Pobierz opinie
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Oblicz statystyki
  const totalReviews = (reviews as any)?.length || 0
  const avgRating = reviews && reviews.length > 0
    ? ((reviews as any).reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  // Statystyki według portalu
  const portalStats = ['Dobre Firmy', 'Arena Biznesu', 'Panteon Firm'].map((portal) => {
    const portalReviews = (reviews as any)?.filter((r: any) => r.portal === portal) || []
    const portalAvg = portalReviews.length > 0
      ? (portalReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / portalReviews.length).toFixed(1)
      : '0.0'
    
    return {
      name: portal,
      count: portalReviews.length,
      avg: portalAvg,
    }
  })

  // Opinie w ostatnim miesiącu
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  const recentReviews = (reviews as any)?.filter((r: any) => new Date(r.created_at) > lastMonth) || []
  const recentCount = recentReviews.length

  // Trend (prosty wzrost/spadek)
  const prevMonth = new Date()
  prevMonth.setMonth(prevMonth.getMonth() - 2)
  const prevMonthReviews = (reviews as any)?.filter((r: any) => {
    const date = new Date(r.created_at)
    return date > prevMonth && date <= lastMonth
  }) || []
  const trend = recentCount - prevMonthReviews.length

  // Rozkład ocen
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = (reviews as any)?.filter((r: any) => r.rating === rating).length || 0
    const percentage = totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(0) : '0'
    return { rating, count, percentage }
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Analityka</h1>
        <p className="mt-2 text-sm text-gray-700">
          Szczegółowe statystyki i analizy Twoich opinii
        </p>
      </div>

      {/* Główne metryki */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md" style={{ background: 'linear-gradient(to right, #EB5B1E, #E89D1B, #F7B621)' }}>
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Wszystkie opinie</dt>
                  <dd className="text-2xl font-bold text-gray-900">{totalReviews}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Średnia ocena</dt>
                  <dd className="text-2xl font-bold text-gray-900">{avgRating}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Ten miesiąc</dt>
                  <dd className="text-2xl font-bold text-gray-900">{recentCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-md ${trend >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {trend >= 0 ? (
                  <ArrowUp className="h-6 w-6 text-green-600" />
                ) : (
                  <ArrowDown className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Trend</dt>
                  <dd className={`text-2xl font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend >= 0 ? '+' : ''}{trend}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Statystyki według portalu */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Statystyki według portalu</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {portalStats.map((portal) => (
                <div key={portal.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{portal.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{portal.count} opinii</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-gray-900">{portal.avg}</span>
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${totalReviews > 0 ? (portal.count / totalReviews) * 100 : 0}%`,
                        background: 'linear-gradient(to right, #EB5B1E, #E89D1B, #F7B621)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rozkład ocen */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Rozkład ocen</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className="h-6 rounded-full flex items-center justify-end pr-2"
                        style={{
                          width: `${item.percentage}%`,
                          background: 'linear-gradient(to right, #EB5B1E, #E89D1B, #F7B621)',
                        }}
                      >
                        <span className="text-xs font-medium text-white">{item.count}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 w-12 text-right">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
