import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Sprawdź czy opinia należy do firmy użytkownika
    const { data: review } = await supabase
      .from('reviews')
      .select('*, companies!inner(user_id)')
      .eq('id', id)
      .single()

    if (!review || (review.companies as any).user_id !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Aktualizuj opinię
    const { error } = await supabase
      .from('reviews')
      .update({
        title: body.title || 'Opinia',
        content: body.content,
        rating: body.rating,
        author_name: body.authorName,
        author_email: body.authorEmail || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Sprawdź czy opinia należy do firmy użytkownika
    const { data: review } = await supabase
      .from('reviews')
      .select('*, companies!inner(user_id)')
      .eq('id', id)
      .single()

    if (!review || (review.companies as any).user_id !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Usuń opinię
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
