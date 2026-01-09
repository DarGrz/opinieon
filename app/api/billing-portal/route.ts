import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-12-15.clover',
    })
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get active subscription with customer ID (including trial)
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, status')
      .eq('user_id', user.id)
      .or('status.eq.active,status.eq.trialing')
      .maybeSingle()

    console.log('[BILLING-PORTAL] Subscription query:', { subscription, subError })

    const subscriptionData = subscription as any

    if (!subscriptionData?.stripe_customer_id) {
      console.error('[BILLING-PORTAL] No customer ID found:', { subscription })
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    console.log('[BILLING-PORTAL] Creating session for customer:', subscriptionData.stripe_customer_id)

    // Create billing portal session
    const returnUrl = process.env.NEXT_PUBLIC_APP_URL?.startsWith('http') 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`
      : `https://${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`
    
    const session = await stripe.billingPortal.sessions.create({
      customer: subscriptionData.stripe_customer_id,
      return_url: returnUrl,
      configuration: process.env.STRIPE_BILLING_PORTAL_CONFIGURATION_ID,
    })

    console.log('[BILLING-PORTAL] Session created:', session.url)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
