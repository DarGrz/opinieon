import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CompanyForm } from './components/CompanyForm'

export default async function CompanyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's company
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const companyData = company as any

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Moja Firma</h1>
        <p className="text-gray-600 mt-2">
          Zarządzaj danymi swojej firmy i informacjami widocznymi na portalach opinii.
        </p>
      </div>

      {companyData ? (
        <CompanyForm company={companyData} />
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">
            Brak firmy
          </h2>
          <p className="text-yellow-800 mb-4">
            Nie masz jeszcze dodanej firmy. Dodaj swoją firmę, aby rozpocząć zbieranie opinii.
          </p>
          <a
            href="/onboarding/company"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white"
            style={{ background: 'linear-gradient(to right, #4ab144, #0d833f)' }}
          >
            Dodaj firmę
          </a>
        </div>
      )}
    </div>
  )
}
