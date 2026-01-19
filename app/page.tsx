"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Check, Star, MessageSquare, BarChart3, Wrench, Scissors, Car, Home as HomeIcon, ShoppingBag, Stethoscope, Briefcase } from 'lucide-react'
import { PLAN_CONFIG } from '@/types/plans'
import type { SubscriptionPlan } from '@/types/database'
import { HeroSearch } from '@/components/HeroSearch'
import { HomeHeader } from '@/components/HomeHeader'
import { HomeFooter } from '@/components/HomeFooter'

// Mock Data for Categories
const CATEGORIES = [
  { name: 'Budownictwo', icon: HomeIcon, count: '12k+' },
  { name: 'Motoryzacja', icon: Car, count: '8.5k' },
  { name: 'Usługi', icon: Wrench, count: '5k+' },
  { name: 'Zdrowie', icon: Stethoscope, count: '4.2k' },
  { name: 'Uroda', icon: Scissors, count: '3k+' },
  { name: 'Prawo', icon: Briefcase, count: '1.5k' },
  { name: 'Sklepy', icon: ShoppingBag, count: '20k+' },
  { name: 'Inne', icon: Star, count: '10k+' },
]

export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <HomeHeader />

      {/* Hero Section */}
      <HeroSearch />

      {/* Categories Grid */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Popularne kategorie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                href={`/search?category=${cat.name}`}
                key={cat.name}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 hover:bg-green-50 hover:shadow-md transition-all group border border-gray-100"
              >
                <cat.icon className="w-8 h-8 text-gray-400 group-hover:text-green-600 mb-3 transition-colors" />
                <span className="font-semibold text-gray-900 group-hover:text-green-700">{cat.name}</span>
                <span className="text-xs text-gray-500 mt-1">{cat.count} firm</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Business Section Splitter */}
      <div id="business" className="bg-gray-900 py-24 sm:py-32 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-green-500 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500 blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-base font-semibold leading-7 text-green-400">Dla Właścicieli Firm</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Przejmij kontrolę nad swoim wizerunkiem
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
            OpinieOn to nie tylko katalog. To kompletne narzędzie do zarządzania reputacją.
            Odpowiadaj na opinie, analizuj trendy i zdobywaj nowych klientów.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="rounded-full px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-green-500/20 transition-all bg-green-600 hover:bg-green-500"
            >
              Załóż konto firmowe
            </Link>
            <Link href="#pricing" className="text-sm font-semibold leading-6 text-white hover:text-green-400">
              Zobacz pakiety <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Existing Business Features */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-green-600">Wszystko w jednym miejscu</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Narzędzia, które budują zaufanie
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <MessageSquare className="h-5 w-5 flex-none text-green-600" />
                  Centralizacja Opinii
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Agregujemy opinie z Dobre Firmy, Arena Biznesu i Panteon Firm. Wszystko w jednym kokpicie.</p>
                </dd>
              </div>
              <div className="flex flex-col bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <BarChart3 className="h-5 w-5 flex-none text-green-600" />
                  Analityka AI
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Zrozum sentyment klientów dzięki zaawansowanym wykresom i raportom generowanym przez AI.</p>
                </dd>
              </div>
              <div className="flex flex-col bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Star className="h-5 w-5 flex-none text-green-600" />
                  Widgety na stronę
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Pochwal się ocenami na swojej stronie www używając naszych gotowych widgetów.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-24 sm:py-32 bg-white" id="pricing">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Cennik dla firm</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Wybierz plan dopasowany do Twoich potrzeb.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
            {(Object.keys(PLAN_CONFIG) as SubscriptionPlan[]).map((planKey, index) => {
              const plan = PLAN_CONFIG[planKey]
              const isPopular = planKey === 'PRO'

              return (
                <div
                  key={planKey}
                  className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 ${isPopular ? 'lg:z-10 lg:rounded-b-none lg:-mt-4 lg:mb-[-1rem] bg-gray-50 ring-2 ring-green-600 shadow-2xl relative' : index === 0 ? 'lg:rounded-r-none' : 'lg:rounded-l-none'
                    }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 inset-x-0 -mt-3 text-center">
                      <span className="inline-flex items-center rounded-full bg-green-600 px-4 py-1 text-xs font-bold text-white uppercase tracking-wide">
                        Polecany
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-x-4">
                      <h3 className={`text-lg font-semibold leading-8 ${isPopular ? 'text-green-600' : 'text-gray-900'}`}>{plan.name}</h3>
                    </div>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price} zł</span>
                      <span className="text-sm font-semibold leading-6 text-gray-600">/miesiąc</span>
                    </p>
                    <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <Check className={`h-6 w-5 flex-none ${isPopular ? 'text-green-600' : 'text-gray-500'}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href="/register"
                    className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${isPopular
                      ? 'text-white hover:opacity-90 transition-opacity focus-visible:outline-green-600 shadow-md'
                      : 'text-green-600 ring-1 ring-inset ring-green-200 hover:ring-green-300 hover:bg-green-50'
                      }`}
                    style={isPopular ? { background: 'linear-gradient(to right, #4ab144, #0d833f)' } : undefined}
                  >
                    Wybierz {plan.name}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <HomeFooter />
    </div>
  )
}
