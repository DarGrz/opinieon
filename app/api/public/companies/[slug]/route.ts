import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyPortalKey } from '@/lib/portal-auth'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const portalKey = request.headers.get('x-portal-key')
    const { searchParams } = new URL(request.url)
    const portalSlug = searchParams.get('portal')

    // Weryfikacja portal key
    const portalId = await verifyPortalKey(portalKey, portalSlug)
    if (!portalId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Pobierz firmę
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (companyError || !company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const companyData = company as any

    // Pobierz ustawienia dla tego portalu
    const { data: portalProfile } = await supabase
      .from('company_portal_profiles')
      .select('reviews_enabled, discussions_enabled, is_active')
      .eq('company_id', companyData.id)
      .eq('portal_id', portalId)
      .maybeSingle()

    // Pobierz statystyki opinii dla tego portalu
    const { data: stats } = await supabase
      .from('company_portal_stats')
      .select('review_count, avg_rating')
      .eq('company_id', companyData.id)
      .eq('portal_id', portalId)
      .maybeSingle()

    const statsData = stats as any

    return NextResponse.json({
      ...companyData,
      portal_settings: portalProfile || {
        reviews_enabled: true,
        discussions_enabled: false,
        is_active: true,
      },
      stats: {
        review_count: statsData?.review_count || 0,
        avg_rating: statsData?.avg_rating || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
