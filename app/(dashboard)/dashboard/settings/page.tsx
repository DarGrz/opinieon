import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ManageBillingButton } from './components/ManageBillingButton'
import { DeleteAccountButton } from './components/DeleteAccountButton'
import Stripe from 'stripe'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const profileData = profile as any

  // Fetch active subscription (including trial)
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing'])
    .single()

  const subscriptionData = subscription as any

  // Calculate plan display
  let planDisplay = 'Brak aktywnego planu'
  let trialDaysLeft = null
  
  if (subscriptionData) {
    // Map plan enum to Polish names
    const planNames: Record<string, string> = {
      'START': 'Start',
      'PRO': 'Pro',
      'BIZNES': 'Biznes'
    }
    planDisplay = planNames[subscriptionData.plan] || subscriptionData.plan
    
    // Check if in trial
    if (subscriptionData.trial_end) {
      const trialEnd = new Date(subscriptionData.trial_end)
      const now = new Date()
      if (trialEnd > now) {
        trialDaysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        planDisplay = `${planDisplay} (Trial - ${trialDaysLeft} dni pozostało)`
      }
    }
  }

  // Fetch invoices
  let invoices: any[] = []
  if (subscriptionData?.stripe_customer_id) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-12-15.clover',
      })
      
      const stripeInvoices = await stripe.invoices.list({
        customer: subscriptionData.stripe_customer_id,
        limit: 20,
      })
      invoices = stripeInvoices.data
    } catch (error) {
      console.error('Error fetching invoices:', error)
    }
  }

  const isActive = subscriptionData?.status === 'active' || subscriptionData?.status === 'trialing'

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Account Info */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informacje o koncie</h2>
        <div className="space-y-3">
          <div>
            <span className="text-gray-600">Email:</span>
            <span className="ml-2 font-medium text-gray-900">{user.email}</span>
          </div>
          <div>
            <span className="text-gray-600">Plan:</span>
            <span className="ml-2 font-medium text-gray-900">{planDisplay}</span>
          </div>
          <div>
            <span className="text-gray-600">Status subskrypcji:</span>
            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
              isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {isActive ? 'Aktywna' : 'Nieaktywna'}
            </span>
          </div>
          {subscriptionData?.current_period_end && (
            <div>
              <span className="text-gray-600">Data odnowienia:</span>
              <span className="ml-2 font-medium text-gray-900">
                {new Date(subscriptionData.current_period_end).toLocaleDateString('pl-PL')}
              </span>
            </div>
          )}
          {subscriptionData?.cancel_at_period_end && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
              <p className="text-sm text-yellow-800">
                <strong>Uwaga:</strong> Twoja subskrypcja zostanie anulowana {new Date(subscriptionData.current_period_end).toLocaleDateString('pl-PL')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Billing Info */}
      {(profileData?.billing_name || profileData?.billing_address_line1) && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dane fakturowe</h2>
          <div className="space-y-2 text-gray-700">
            {profileData.billing_name && <div><strong>Nazwa:</strong> {profileData.billing_name}</div>}
            {profileData.billing_address_line1 && <div>{profileData.billing_address_line1}</div>}
            {profileData.billing_address_line2 && <div>{profileData.billing_address_line2}</div>}
            {(profileData.billing_postal_code || profileData.billing_city) && (
              <div>{profileData.billing_postal_code} {profileData.billing_city}</div>
            )}
            {profileData.billing_country && <div>{profileData.billing_country}</div>}
            {profileData.billing_tax_id && <div><strong>NIP:</strong> {profileData.billing_tax_id}</div>}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Możesz zaktualizować te dane klikając "Zarządzaj danymi płatności" poniżej.
          </p>
        </div>
      )}

      {/* Subscription Management */}
      {isActive && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Zarządzanie subskrypcją</h2>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Dane płatności i faktury</h3>
            <p className="text-gray-600 mb-3">
              Możesz zaktualizować swoją kartę kredytową, adres rozliczeniowy, zmienić na dane firmowe (NIP) oraz zarządzać fakturami i subskrypcją w portalu Stripe.
            </p>
            <ManageBillingButton />
          </div>
        </div>
      )}

      {/* Invoices */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Faktury</h2>
        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Data</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Kwota</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">PDF</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice: any) => (
                  <tr key={invoice.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">
                      {new Date(invoice.created * 1000).toLocaleDateString('pl-PL')}
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {(invoice.amount_paid / 100).toFixed(2)} {invoice.currency.toUpperCase()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status === 'paid' ? 'Opłacona' : invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {invoice.invoice_pdf && (
                        <a
                          href={invoice.invoice_pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800"
                        >
                          Pobierz
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Brak faktur</p>
        )}
      </div>

      {/* Danger Zone - Delete Account */}
      <div className="bg-white rounded-lg shadow border border-red-200 p-6 mt-6">
        <h2 className="text-xl font-semibold text-red-900 mb-2">Strefa niebezpieczna</h2>
        <p className="text-gray-600 mb-4">
          Usunięcie konta spowoduje trwałą utratę wszystkich danych. Ta operacja jest nieodwracalna.
        </p>
        <DeleteAccountButton />
      </div>
    </div>
  )
}
