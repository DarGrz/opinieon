import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { companyId, ...updateData } = body

    // Verify company belongs to user
    const { data: company } = await supabase
      .from('companies')
      .select('user_id')
      .eq('id', companyId)
      .single()

    if (!company || (company as any).user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update company
    const { error } = await (supabase as any)
      .from('companies')
      .update({
        name: updateData.name,
        nip: updateData.nip,
        address: updateData.address,
        city: updateData.city,
        postal_code: updateData.postal_code,
        phone: updateData.phone,
        website: updateData.website,
        email: updateData.email,
        description: updateData.description,
        gmb_link: updateData.gmb_link,
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId)

    if (error) {
      console.error('Error updating company:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
