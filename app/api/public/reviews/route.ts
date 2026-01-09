import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyPortalKey } from '@/lib/portal-auth'

export async function POST(request: Request) {
  try {
    const portalKey = request.headers.get('x-portal-key')
    const portalSlug = request.headers.get('x-portal-slug')

    // Weryfikacja portal key
    const portalId = await verifyPortalKey(portalKey, portalSlug)
    if (!portalId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      companyId,
      rating,
      title,
      content,
      pros,
      cons,
      authorName,
      authorEmail,
    } = body

    // Walidacja
    if (!companyId || !rating || !title || !content || !authorName || !authorEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Sprawdź czy firma ma włączone opinie na tym portalu
    const { data: profile } = await supabase
      .from('company_portal_profiles')
      .select('reviews_enabled, is_active')
      .eq('company_id', companyId)
      .eq('portal_id', portalId)
      .maybeSingle()

    const profileData = profile as any

    if (profileData && (profileData.reviews_enabled === false || profileData.is_active === false)) {
      return NextResponse.json(
        { error: 'Reviews are disabled for this company on this portal' },
        { status: 403 }
      )
    }

    // Dodaj opinię do bazy
    const { data: review, error } = await (supabase as any)
      .from('reviews')
      .insert({
        company_id: companyId,
        portal_id: portalId,
        rating,
        title,
        content,
        pros: pros || null,
        cons: cons || null,
        author_name: authorName,
        author_email: authorEmail,
        status: 'pending', // Wymaga weryfikacji email
        verified: false,
        helpful_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating review:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const reviewData = review as any

    // TODO: Wyślij email weryfikacyjny
    // await sendVerificationEmail(reviewData.id, authorEmail)

    return NextResponse.json({
      success: true,
      review_id: reviewData.id,
      message: 'Review submitted. Please check your email to verify.',
    })
  } catch (error) {
    console.error('Error in POST /api/public/reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
