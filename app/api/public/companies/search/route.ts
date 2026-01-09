import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyPortalKey } from '@/lib/portal-auth'

export async function GET(request: Request) {
  try {
    console.log('[SEARCH-API] Request received')
    const portalKey = request.headers.get('x-portal-key')
    const { searchParams } = new URL(request.url)
    const portalSlug = searchParams.get('portal')
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    console.log('[SEARCH-API] Params:', { portalSlug, query, page, limit, hasKey: !!portalKey })

    // Weryfikacja portal key
    const portalId = await verifyPortalKey(portalKey, portalSlug)
    console.log('[SEARCH-API] Portal ID:', portalId)
    if (!portalId) {
      console.error('[SEARCH-API] Unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const offset = (page - 1) * limit

    console.log('[SEARCH-API] Fetching companies...')

    // Pobierz IDs firm przypisanych do tego portalu
    const { data: portalProfiles } = await supabase
      .from('company_portal_profiles')
      .select('company_id')
      .eq('portal_id', portalId)
      .eq('is_active', true)

    const companyIds = (portalProfiles || []).map((p: any) => p.company_id)
    console.log('[SEARCH-API] Portal company IDs:', companyIds.length)

    if (companyIds.length === 0) {
      return NextResponse.json({
        companies: [],
        total: 0,
        page,
        limit,
      })
    }

    // Pobierz firmy
    let dbQuery = supabase
      .from('companies')
      .select('id, name, slug, description, logo_url, website, city, verified', { count: 'exact' })
      .in('id', companyIds)

    // Wyszukiwanie po nazwie lub mieście
    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,city.ilike.%${query}%`)
    }

    const { data: companies, error, count } = await dbQuery
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1)

    console.log('[SEARCH-API] Companies fetched:', { count: companies?.length, total: count, error: error?.message })

    if (error) {
      console.error('[SEARCH-API] Database error:', error)
      throw error
    }

    // Dla każdej firmy pobierz statystyki
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
  } catch (error: any) {
    console.error('[SEARCH-API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
