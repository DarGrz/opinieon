import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { portal_id, profile_id, company_id, enabled } = await request.json()

    if (!portal_id || !company_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify company belongs to user
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('id', company_id)
      .eq('user_id', user.id)
      .single()

    if (!company) {
      return NextResponse.json({ error: 'Company not found or unauthorized' }, { status: 403 })
    }

    // If profile exists, update it
    if (profile_id) {
      const { error } = await supabase
        .from('company_portal_profiles')
        .update({ review_form_enabled: enabled, updated_at: new Date().toISOString() })
        .eq('id', profile_id)
        .eq('company_id', company_id)

      if (error) {
        console.error('Error updating profile:', error)
        throw error
      }
    } else {
      // Create new profile
      const { error } = await supabase
        .from('company_portal_profiles')
        .insert({
          company_id,
          portal_id,
          review_form_enabled: enabled,
          is_active: true
        })

      if (error) {
        console.error('Error creating profile:', error)
        throw error
      }
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Error toggling review form:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to toggle review form' },
      { status: 500 }
    )
  }
}
