import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Pobierz opinię
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select('id, company_id, status')
      .eq('id', id)
      .single()

    if (reviewError || !review) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Sprawdź czy firma należy do użytkownika
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, user_id')
      .eq('id', review.company_id)
      .single()

    if (companyError || !company || company.user_id !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Zatwierdź opinię
    const { error: updateError } = await supabase
      .from('reviews')
      .update({ status: 'approved' })
      .eq('id', id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error approving review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
