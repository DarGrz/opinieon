import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyPortalKey } from '@/lib/portal-auth'

export async function GET(request: Request) {
  try {
    const portalKey = request.headers.get('x-portal-key')
    const { searchParams } = new URL(request.url)
    const portalSlug = searchParams.get('portal')
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Weryfikacja portal key
    const portalId = await verifyPortalKey(portalKey, portalSlug)
    if (!portalId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const offset = (page - 1) * limit

    let dbQuery = supabase
      .from('companies')
      .select('id, name, slug, description, logo_url, website, city, verified', { count: 'exact' })

    // Filtruj tylko firmy aktywne na tym portalu
    if (portalId) {
      dbQuery = dbQuery.eq('company_portal_profiles.portal_id', portalId)
        .eq('company_portal_profiles.is_active', true)
    }

    // Wyszukiwanie po nazwie lub mieście
    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,city.ilike.%${query}%`)
    }

    const { data: companies, error, count } = await dbQuery
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    // Dla każdej firmy pobierz statystyki z tego portalu
    const companiesWithStats = await Promise.all(
      (companies || []).map(async (company) => {
        const companyData = company as any
        const { data: stats } = await supabase
          .from('company_portal_stats')
          .select('review_count, avg_rating')
          .eq('company_id', companyData.id)
          .eq('portal_id', portalId)
          .maybeSingle()

        const statsData = stats as any

        return {
          ...companyData,
          stats: {
            review_count: statsData?.review_count || 0,
            avg_rating: statsData?.avg_rating || 0,
          },
        }
      })
    )

    return NextResponse.json({
      companies: companiesWithStats,
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error('Error searching companies:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
