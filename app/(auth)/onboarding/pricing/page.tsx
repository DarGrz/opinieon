'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { PLAN_CONFIG } from '@/types/plans'
import type { SubscriptionPlan } from '@/types/database'

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const router = useRouter()

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    // Przekieruj do formularza z wybranym planem
    router.push(`/onboarding/company?plan=${plan}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Wybierz plan dla swojej firmy
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            14 dni bezpłatnego okresu próbnego. Anuluj w każdej chwili.
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-7xl lg:mx-auto">
          {(Object.keys(PLAN_CONFIG) as SubscriptionPlan[]).map((planKey) => {
            const plan = PLAN_CONFIG[planKey]
            const isPopular = planKey === 'PRO'

            return (
              <div
                key={planKey}
                className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                  isPopular ? 'border-2 border-green-500 relative' : 'border border-gray-200'
                } bg-white`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-0">
                    <span className="inline-flex rounded-full px-4 py-1 text-xs font-semibold text-white" style={{ background: 'linear-gradient(to right, #4ab144, #0d833f)' }}>
                      Najpopularniejszy
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                  <p className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price} zł</span>
                    <span className="text-base font-medium text-gray-500">/miesiąc</span>
                  </p>
                  <button
                    onClick={() => handleSelectPlan(planKey)}
                    className={`mt-8 block w-full rounded-md px-6 py-3 text-center text-sm font-semibold ${
                      isPopular
                        ? 'text-white hover:opacity-90 transition-opacity'
                        : 'bg-orange-50 text-green-700 hover:bg-orange-100'
                    }`}
                    style={isPopular ? { background: 'linear-gradient(to right, #4ab144, #0d833f)' } : undefined}
                  >
                    Wybierz {plan.name}
                  </button>
                </div>
                <div className="px-6 pt-6 pb-8">
                  <h4 className="text-sm font-medium text-gray-900 tracking-wide">
                    Co jest wliczone:
                  </h4>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex space-x-3">
                        <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="text-sm text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Wszystkie plany zawierają 14-dniowy okres próbny bez obciążenia karty kredytowej.
          </p>
        </div>
      </div>
    </div>
  )
}
