import { CompanyCard } from '@/components/CompanyCard'
import { Search, MapPin, Filter } from 'lucide-react'
import Link from 'next/link'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { HomeHeader } from '@/components/HomeHeader'
import { HomeFooter } from '@/components/HomeFooter'

export const dynamic = 'force-dynamic'

async function getCompanies(searchParams: { q?: string; city?: string }) {
    try {
        console.log('🔍 Search params:', searchParams)

        const supabase = createServiceRoleClient()

        // Znajdź ID portalu opinieon
        const { data: portal } = await supabase
            .from('portals')
            .select('id')
            .eq('slug', 'opinieon')
            .single()

        if (!portal) {
            console.error('❌ Portal opinieon not found')
            return []
        }

        console.log('✅ Portal ID:', portal.id)

        // Pobierz IDs firm przypisanych do tego portalu
        const { data: portalProfiles } = await supabase
            .from('company_portal_profiles')
            .select('company_id')
            .eq('portal_id', portal.id)
            .eq('is_active', true)

        const companyIds = (portalProfiles || []).map((p: any) => p.company_id)
        console.log(`📋 Found ${companyIds.length} companies in portal`)

        if (companyIds.length === 0) {
            return []
        }

        // Pobierz firmy
        let dbQuery = supabase
            .from('companies')
            .select('id, name, slug, description, logo_url, website, city')
            .in('id', companyIds)

        // Wyszukiwanie po nazwie lub mieście
        if (searchParams.q) {
            console.log('🔤 Searching:', searchParams.q)
            dbQuery = dbQuery.or(`name.ilike.%${searchParams.q}%,city.ilike.%${searchParams.q}%`)
        }

        const { data: companies, error } = await dbQuery.order('name', { ascending: true })

        if (error) {
            console.error('❌ Database error:', error)
            return []
        }

        console.log(`✅ Found ${companies?.length || 0} companies matching criteria`)

        // Dla każdej firmy pobierz statystyki z reviews
        const companiesWithStats = await Promise.all(
            (companies || []).map(async (company: any) => {
                const { data: reviews } = await supabase
                    .from('reviews')
                    .select('rating')
                    .eq('company_id', company.id)
                    .eq('portal_id', portal.id)
                    .eq('status', 'published' as any)

                const reviewCount = reviews?.length || 0
                const avgRating = reviewCount > 0
                    ? reviews!.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewCount
                    : 0

                return {
                    ...company,
                    review_count: reviewCount,
                    avg_rating: avgRating,
                }
            })
        )

        return companiesWithStats

    } catch (error) {
        console.error('❌ Error fetching companies:', error)
        return []
    }
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; city?: string; category?: string }>
}) {
    const params = await searchParams
    const companies = await getCompanies(params)

    return (
        <>
            <HomeHeader />
            <div className="min-h-screen bg-gray-50">
                {/* Search Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="q"
                                    defaultValue={params.q}
                                    placeholder="Szukaj firmy (np. hydraulik)..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div className="relative w-full sm:w-64">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="city"
                                    defaultValue={params.city}
                                    placeholder="Miasto..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <button type="submit" className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-green-500 transition-colors">
                                Szukaj
                            </button>
                        </form>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <div className="w-full lg:w-64 flex-none space-y-6">
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                                    <Filter className="w-4 h-4" />
                                    Filtry
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-2">Ocena</label>
                                        <div className="space-y-2">
                                            {[5, 4, 3].map((star) => (
                                                <label key={star} className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 border-gray-300" />
                                                    <span className="text-sm text-gray-600 flex items-center">
                                                        {star} gwiazdek i więcej
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-2">Kategoria</label>
                                        <div className="space-y-2">
                                            {['Budownictwo', 'Motoryzacja', 'Usługi', 'Zdrowie'].map((cat) => (
                                                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 border-gray-300" />
                                                    <span className="text-sm text-gray-600">{cat}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results List */}
                        <div className="flex-1">
                            <div className="mb-4 flex items-center justify-between">
                                <h1 className="text-xl font-bold text-gray-900">
                                    {companies.length > 0
                                        ? `Znaleziono ${companies.length} firm`
                                        : 'Brak wyników wyszukiwania'
                                    }
                                    {params.q && <span className="text-gray-500 font-normal"> dla "{params.q}"</span>}
                                    {params.city && <span className="text-gray-500 font-normal"> w "{params.city}"</span>}
                                </h1>
                            </div>

                            {companies.length > 0 ? (
                                <div className="space-y-4">
                                    {companies.map((company: any) => (
                                        <CompanyCard key={company.id} company={company} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white p-12 rounded-xl text-center border border-gray-200">
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                                        <Search className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Nie znaleźliśmy firm spełniających kryteria</h3>
                                    <p className="mt-2 text-gray-500">Spróbuj zmienić słowa kluczowe lub lokalizację.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <HomeFooter />
        </>
    )
}
