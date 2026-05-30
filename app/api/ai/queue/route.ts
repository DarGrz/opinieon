import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use service role to bypass RLS
    const supabaseAdmin = createServiceRoleClient()
    
    const { data: queue, error } = await supabaseAdmin
      .from('review_queue')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('review_date', { ascending: true })

    if (error) {
      console.error('Error fetching queue:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ queue, count: queue?.length || 0 })

  } catch (error: any) {
    console.error('Error in queue API:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch queue' },
      { status: 500 }
    )
  }
}
