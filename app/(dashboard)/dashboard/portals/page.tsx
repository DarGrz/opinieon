import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, ExternalLink, Star, MessageSquare, RefreshCw } from 'lucide-react'

type Portal = 'Dobre Firmy' | 'Arena Biznesu' | 'Panteon Firm'

const PORTALS: Portal[] = ['Dobre Firmy', 'Arena Biznesu', 'Panteon Firm']

const PORTAL_URLS = {
  'Dobre Firmy': 'https://dobre-firmy.pl',
  'Arena Biznesu': 'https://arena-biznesu.pl',
  'Panteon Firm': 'https://panteonfirm.pl',
}

export default async function PortalsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Pobierz firmy użytkownika
  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)

  const company = companies?.[0]
  const companiesData = (companies || []) as any[]

  // Pobierz statystyki opinii dla firm użytkownika
  const { data: reviews } = await supabase
    .from('reviews')
    .select('portal_id, rating, portals(name, slug)')
    .in('company_id', companiesData.map(c => c.id))

  console.log('Reviews with portals:', reviews)

  // Pobierz wszystkie portale z bazy (bez Google Reviews i duplikatów)
  const { data: portalsFromDb } = await supabase
    .from('portals')
    .select('*')
    .eq('is_active', true)
    .neq('slug', 'google-reviews')
    .neq('name', 'Google Reviews')

  const portalsDbData = (portalsFromDb || []) as any[]
  
  // Usuń duplikaty po nazwie i odfiltruj Google (na wszelki wypadek)
  const uniquePortals = portalsDbData
    .filter((portal: any) => !portal.name?.toLowerCase().includes('google'))
    .reduce((acc: any[], portal: any) => {
      if (!acc.find(p => p.name === portal.name)) {
        acc.push(portal)
      }
      return acc
    }, [])

  console.log('Unique portals:', uniquePortals.map(p => ({ name: p.name, slug: p.slug, id: p.id })))
  console.log('Total reviews:', reviews?.length)

  // Oblicz statystyki dla każdego portalu
  const portalStats = uniquePortals.map((portal) => {
    const portalReviews = (reviews as any)?.filter((r: any) => r.portal_id === portal.id) || []
    console.log(`Portal ${portal.name} (${portal.id}): ${portalReviews.length} reviews`)
    const avgRating = portalReviews.length > 0
      ? (portalReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / portalReviews.length).toFixed(1)
      : '0.0'
    
    return {
      id: portal.id,
      name: portal.name,
      slug: portal.slug,
      reviewCount: portalReviews.length,
      avgRating,
      status: portalReviews.length > 0 ? 'active' : 'inactive',
      lastSync: portalReviews.length > 0 ? new Date().toLocaleDateString('pl-PL') : null,
      url: portal.url || `https://${portal.slug}.pl`,
    }
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Profile w portalach</h1>
          <p className="mt-2 text-sm text-gray-700">
            Zarządzaj swoimi profilami w Dobre Firmy, Arena Biznesu i Panteon Firm
          </p>
        </div>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(to right, #4ab144, #0d833f)' }}
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Synchronizuj wszystkie
        </button>
      </div>

      {!company && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            Nie masz jeszcze dodanej firmy. Dodaj firmę, aby móc zarządzać profilami w portalach.
          </p>
          <Link
            href="/onboarding/company"
            className="mt-3 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
          >
            Dodaj firmę →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {portalStats.map((portal) => (
          <div
            key={portal.name}
            className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 hover:border-green-300 transition-colors"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{portal.name}</h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    portal.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {portal.status === 'active' ? 'Aktywny' : 'Nieaktywny'}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    <span className="text-sm">Opinie</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{portal.reviewCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <Star className="h-5 w-5 mr-2" />
                    <span className="text-sm">Średnia ocena</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-semibold text-gray-900">{portal.avgRating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>

                {portal.lastSync && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Ostatnia synchronizacja: {portal.lastSync}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Otwórz portal
                </a>
                <button
                  className="flex items-center justify-center w-full px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(to right, #4ab144, #0d833f)' }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Synchronizuj
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Szczegółowe informacje */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Jak to działa?</h2>
        </div>
        <div className="p-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600">
              opinieOn automatycznie synchronizuje Twoje profile ze wszystkich trzech portali opinii.
              Możesz zarządzać wszystkimi opiniami w jednym miejscu, odpowiadać na nie oraz analizować statystyki.
            </p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>✓ Automatyczna synchronizacja nowych opinii</li>
              <li>✓ Powiadomienia o nowych recenzjach</li>
              <li>✓ Możliwość odpowiadania na opinie bezpośrednio z panelu</li>
              <li>✓ Analiza trendów i statystyk</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
