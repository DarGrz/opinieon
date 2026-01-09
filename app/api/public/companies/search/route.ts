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

    // Pobierz firmy przypisane do tego portalu
    let dbQuery = supabase
      .from('company_portal_profiles')
      .select(`
        company_id,
        is_active,
        companies!inner(
          id,
          name,
          slug,
          description,
          logo_url,
          website,
          city,
          verified
        )
      `, { count: 'exact' })
      .eq('portal_id', portalId)
      .eq('is_active', true)

    // Wyszukiwanie po nazwie lub mieście
    if (query) {
      dbQuery = dbQuery.or(`companies.name.ilike.%${query}%,companies.city.ilike.%${query}%`)
    }

    const { data: profiles, error, count } = await dbQuery
      .order('companies.name', { ascending: true, foreignTable: 'companies' })
      .range(offset, offset + limit - 1)

    console.log('[SEARCH-API] Companies fetched:', { count: profiles?.length, error: error?.message })

    if (error) {
      console.error('[SEARCH-API] Database error:', error)
      throw error
    }

    // Dla każdej firmy pobierz statystyki
    const companiesWithStats = await Promise.all(
      (profiles || []).map(async (profile) => {
        const companyData = (profile as any).companies
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
