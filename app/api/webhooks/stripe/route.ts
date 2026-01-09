// @ts-nocheck
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createServiceRoleClient } from '@/lib/supabase/server'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  const supabase = createServiceRoleClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          const userId = session.metadata?.user_id
          const companyId = session.metadata?.company_id
          const plan = session.metadata?.plan as 'START' | 'PRO' | 'BIZNES'

          if (!userId || !companyId || !plan) {
            console.error('Missing metadata in checkout session', { userId, companyId, plan })
            break
          }

          console.log('Creating subscription for:', { userId, companyId, plan, subscriptionId: subscription.id })

          // Utwórz subskrypcję w bazie
          const currentPeriodStart = subscription.items.data[0]?.current_period_start 
            || subscription.current_period_start
          const currentPeriodEnd = subscription.items.data[0]?.current_period_end 
            || subscription.current_period_end

          const { data: insertedSub, error: insertError } = await supabase.from('subscriptions').insert({
            user_id: userId,
            company_id: companyId,
            plan: plan,
            status: subscription.status as any,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            stripe_price_id: subscription.items.data[0].price.id,
            trial_end: subscription.trial_end 
              ? new Date(subscription.trial_end * 1000).toISOString() 
              : null,
            current_period_start: currentPeriodStart 
              ? new Date(currentPeriodStart * 1000).toISOString() 
              : null,
            current_period_end: currentPeriodEnd 
              ? new Date(currentPeriodEnd * 1000).toISOString() 
              : null,
          } as any)

          if (insertError) {
            console.error('Error inserting subscription:', insertError)
            throw insertError
          }

          console.log('Subscription created successfully:', insertedSub)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        const currentPeriodStart = subscription.items.data[0]?.current_period_start 
          || subscription.current_period_start
        const currentPeriodEnd = subscription.items.data[0]?.current_period_end 
          || subscription.current_period_end

        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status as any,
            current_period_start: currentPeriodStart 
              ? new Date(currentPeriodStart * 1000).toISOString() 
              : null,
            current_period_end: currentPeriodEnd 
              ? new Date(currentPeriodEnd * 1000).toISOString() 
              : null,
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at 
              ? new Date(subscription.canceled_at * 1000).toISOString() 
              : null,
          } as any)
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
          } as any)
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        if ((invoice as any).subscription) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
            } as any)
            .eq('stripe_subscription_id', (invoice as any).subscription as string)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
