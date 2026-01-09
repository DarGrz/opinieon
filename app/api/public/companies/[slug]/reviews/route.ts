import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { verifyPortalKey } from '@/lib/portal-auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const portalKey = request.headers.get('x-portal-key')
    const { searchParams } = new URL(request.url)
    const portalSlug = searchParams.get('portal')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Weryfikacja portal key
    const portalId = await verifyPortalKey(portalKey, portalSlug)
    if (!portalId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceRoleClient()

    // Pobierz firmę po slug
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('slug', slug)
      .single()

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const companyData = company as any
    const companyId = companyData.id

    // Sprawdź czy firma ma włączone opinie na tym portalu
    const { data: profile } = await supabase
      .from('company_portal_profiles')
      .select('reviews_enabled')
      .eq('company_id', companyId)
      .eq('portal_id', portalId)
      .maybeSingle()

    const profileData = profile as any
    const reviewsEnabled = profileData?.reviews_enabled !== false

    // Pobierz opinie dla tego portalu
    const offset = (page - 1) * limit

    const { data: reviews, error, count } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId)
      .eq('portal_id', portalId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      reviews: reviews || [],
      total: count || 0,
      page,
      limit,
      reviews_enabled: reviewsEnabled,
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
