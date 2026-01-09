import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

interface CompanyData {
  name: string
  nip?: string
  address?: string
  city?: string
  postalCode?: string
  email?: string
  phone?: string
}

export async function createCheckoutSession({
  userId,
  companyId,
  plan,
  email,
  companyData,
}: {
  userId: string
  companyId: string
  plan: 'START' | 'PRO' | 'BIZNES'
  email: string
  companyData?: CompanyData
}) {
  // Debug: log all Stripe price IDs
  console.log('Stripe Price IDs from env:', {
    START: process.env.STRIPE_PRICE_START,
    PRO: process.env.STRIPE_PRICE_PRO,
    BIZNES: process.env.STRIPE_PRICE_BIZNES,
  })

  const priceIds = {
    START: process.env.STRIPE_PRICE_START!,
    PRO: process.env.STRIPE_PRICE_PRO!,
    BIZNES: process.env.STRIPE_PRICE_BIZNES!,
  }

  const priceId = priceIds[plan]
  
  if (!priceId) {
    throw new Error(`Missing Stripe Price ID for plan: ${plan}. Check your .env.local file.`)
  }

  console.log(`Creating checkout session for plan ${plan} with price ID: ${priceId}`)

  // Utwórz klienta Stripe z danymi firmy
  let customerId: string | undefined

  if (companyData) {
    console.log('Company data received:', companyData)
    
    const customerAddress: Stripe.AddressParam = {
      line1: companyData.address || undefined,
      city: companyData.city || undefined,
      postal_code: companyData.postalCode || undefined,
      country: 'PL',
    }

    console.log('Customer address being sent to Stripe:', customerAddress)

    // Sprawdź czy klient już istnieje
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      // Zaktualizuj istniejącego klienta
      console.log('Updating existing customer:', existingCustomers.data[0].id)
      const customer = await stripe.customers.update(existingCustomers.data[0].id, {
        name: companyData.name,
        email: companyData.email || email,
        phone: companyData.phone || undefined,
        address: customerAddress,
        invoice_settings: {
          custom_fields: [],
        },
        metadata: {
          user_id: userId,
          company_id: companyId,
        },
      })
      console.log('Customer updated:', customer.id, 'Address:', customer.address)
      customerId = customer.id

      // Dodaj NIP jako Tax ID jeśli podany
      if (companyData.nip) {
        // Usuń stare Tax IDs
        const existingTaxIds = await stripe.customers.listTaxIds(customer.id)
        for (const taxId of existingTaxIds.data) {
          await stripe.customers.deleteTaxId(customer.id, taxId.id)
        }
        // Dodaj nowy NIP
        try {
          await stripe.customers.createTaxId(customer.id, {
            type: 'eu_vat',
            value: `PL${companyData.nip.replace(/[^0-9]/g, '')}`,
          })
        } catch (taxError) {
          console.error('Error adding tax ID:', taxError)
        }
      }
    } else {
      // Utwórz nowego klienta
      console.log('Creating new customer with address:', customerAddress)
      const customer = await stripe.customers.create({
        name: companyData.name,
        email: companyData.email || email,
        phone: companyData.phone || undefined,
        address: customerAddress,
        invoice_settings: {
          custom_fields: [],
        },
        metadata: {
          user_id: userId,
          company_id: companyId,
        },
      })
      console.log('Customer created:', customer.id, 'Address:', customer.address)
      customerId = customer.id

      // Dodaj NIP jako Tax ID jeśli podany
      if (companyData.nip) {
        try {
          await stripe.customers.createTaxId(customer.id, {
            type: 'eu_vat',
            value: `PL${companyData.nip.replace(/[^0-9]/g, '')}`,
          })
        } catch (taxError) {
          console.error('Error adding tax ID:', taxError)
        }
      }
    }
  }

  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    line_items: [
      {
        price: priceId,
        quantity: 1,
        tax_rates: process.env.STRIPE_TAX_RATE_ID ? [process.env.STRIPE_TAX_RATE_ID] : [],
      },
    ],
    mode: 'subscription',
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        user_id: userId,
        company_id: companyId,
        plan: plan,
      },
      default_tax_rates: process.env.STRIPE_TAX_RATE_ID ? [process.env.STRIPE_TAX_RATE_ID] : [],
    },
    metadata: {
      user_id: userId,
      company_id: companyId,
      plan: plan,
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/onboarding/pricing?canceled=true`,
    allow_promotion_codes: true,
    tax_id_collection: {
      enabled: false,
    },
  }

  // Użyj istniejącego klienta lub email dla nowego
  if (customerId) {
    sessionConfig.customer = customerId
    sessionConfig.customer_update = {
      // Don't let Checkout overwrite the address we already set on the Customer.
      // Otherwise Stripe may replace it with PaymentMethod billing details
      // (which can be country-only), and invoices end up without street.
      address: 'never',
      name: 'never',
    }
  } else {
    sessionConfig.customer_email = email
    sessionConfig.customer_creation = 'always'
  }

  const session = await stripe.checkout.sessions.create(sessionConfig)

  return session
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings`,
  })

  return session
}
