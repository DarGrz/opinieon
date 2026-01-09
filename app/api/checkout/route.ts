import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe'

interface CompanyData {
  name: string
  nip?: string
  address?: string
  city?: string
  postalCode?: string
  email?: string
  phone?: string
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan, companyId, companyData } = await request.json() as {
      plan: string
      companyId: string
      companyData?: CompanyData
    }

    if (!plan || !companyId) {
      return NextResponse.json({ error: 'Missing plan or companyId' }, { status: 400 })
    }

    const session = await createCheckoutSession({
      userId: user.id,
      companyId,
      plan: plan as 'START' | 'PRO' | 'BIZNES',
      email: user.email!,
      companyData,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
