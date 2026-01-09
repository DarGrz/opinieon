import Link from 'next/link'
import Image from 'next/image'
import { Check, Star, MessageSquare, BarChart3 } from 'lucide-react'
import { PLAN_CONFIG } from '@/types/plans'
import type { SubscriptionPlan } from '@/types/database'

export default function Home() {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50 bg-gray-900">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <Image 
                src="/opinieon-logo-sq-new-green.png" 
                alt="opinieOn Logo" 
                width={150} 
                height={40}
                priority
              />
            </Link>
          </div>
          <div className="flex gap-x-4">
            <Link
              href="/login"
              className="text-sm font-semibold leading-6 text-white hover:text-green-400"
            >
              Zaloguj się
            </Link>
            <Link
              href="/register"
              className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(to right, #4ab144, #0d833f)' }}
            >
              Rozpocznij za darmo
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Zbieraj opinie kiedy chcesz, jak chcesz.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              OpinieOn to narzędzie do zarządzania opiniami klientów, które pomaga firmom budować zaufanie i zwiększać widoczność online.
              Pokaż swoją firmę z najlepszej strony dzięki opiniom od zadowolonych klientów. 

            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/register"
                className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(to right, #4ab144, #0d833f)' }}
              >
                Rozpocznij 14-dniowy trial
              </Link>
              <Link href="#pricing" className="text-sm font-semibold leading-6 text-gray-900">
                Zobacz ceny <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-green-600">Wszystko czego potrzebujesz</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Funkcje które ułatwią Ci zarządzanie opiniami
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <MessageSquare className="h-5 w-5 flex-none text-green-600" />
                  Zarządzanie opiniami
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Dodawaj, edytuj i usuwaj opinie dla swoich firm we wszystkich 3 portalach z jednego miejsca.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <BarChart3 className="h-5 w-5 flex-none text-green-600" />
                  Analityka i statystyki
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Pełne raporty, wykresy i analiza trendów dla planów Pro i Biznes.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Star className="h-5 w-5 flex-none text-green-600" />
                  Odpowiedzi na opinie
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Odpowiadaj na opinie klientów bezpośrednio z panelu opinieOn.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-24 sm:py-32" id="pricing">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Proste, przejrzyste ceny</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              14 dni bezpłatnego okresu próbnego. Bez zobowiązań, anuluj w każdej chwili.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
            {(Object.keys(PLAN_CONFIG) as SubscriptionPlan[]).map((planKey, index) => {
              const plan = PLAN_CONFIG[planKey]
              const isPopular = planKey === 'PRO'
              
              return (
                <div
                  key={planKey}
                  className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 ${
                    isPopular ? 'lg:z-10 lg:rounded-b-none' : index === 0 ? 'lg:rounded-r-none' : 'lg:rounded-l-none'
                  } ${isPopular ? 'shadow-2xl' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-x-4">
                      <h3 className="text-lg font-semibold leading-8 text-gray-900">{plan.name}</h3>
                      {isPopular && (
                        <p className="rounded-full bg-green-600 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                          Najpopularniejszy
                        </p>
                      )}
                    </div>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price} zł</span>
                      <span className="text-sm font-semibold leading-6 text-gray-600">/miesiąc</span>
                    </p>
                    <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <Check className="h-6 w-5 flex-none text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href="/register"
                    className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isPopular
                        ? 'text-white hover:opacity-90 transition-opacity focus-visible:outline-green-600'
                        : 'text-green-600 ring-1 ring-inset ring-green-200 hover:ring-green-300'
                    }`}
                    style={isPopular ? { background: 'linear-gradient(to right, #4ab144, #0d833f)' } : undefined}
                  >
                    Wybierz plan {plan.name}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-center text-sm leading-5 text-gray-400">
            &copy; {new Date().getFullYear()} opinieOn. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  )
}

