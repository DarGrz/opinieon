"use client"

import { HomeHeader } from '@/components/HomeHeader'
import { HomeFooter } from '@/components/HomeFooter'
import { Check, Star, MessageSquare, BarChart3, Shield, Zap, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { PLAN_CONFIG } from '@/types/plans'
import type { SubscriptionPlan } from '@/types/database'

const BENEFITS = [
    {
        title: 'Wszystkie opinie w jednym miejscu',
        description: 'Zarządzaj opiniami z Dobre Firmy, Arena Biznesu i Panteon Firm z poziomu jednego, intuicyjnego panelu.',
        icon: MessageSquare,
    },
    {
        title: 'Analityka oparta o AI',
        description: 'Automatyczna analiza sentymentu i trendów, która pomoże Ci zrozumieć potrzeby Twoich klientów.',
        icon: BarChart3,
    },
    {
        title: 'Buduj realne zaufanie',
        description: 'Pokazuj zweryfikowane opinie na swojej stronie dzięki naszym gotowym widgetom.',
        icon: Shield,
    },
    {
        title: 'Szybkie odpowiedzi',
        description: 'Odpowiadaj na feedback klientów błyskawicznie, budując profesjonalny wizerunek firmy.',
        icon: Zap,
    },
    {
        title: 'Wzrost widoczności',
        description: 'Zoptymalizowany profil firmy na naszych portalach przyciąga więcej realnych klientów.',
        icon: TrendingUp,
    },
    {
        title: 'Zarządzanie wieloma firmami',
        description: 'Idealne rozwiązanie dla właścicieli wielu biznesów lub agencji marketingowych.',
        icon: Users,
    },
]

const FAQ = [
    {
        question: 'Jak OpinieOn pomaga mojej firmie?',
        answer: 'OpinieOn agreguje opinie z kilku kluczowych portali branżowych, umożliwiając Ci szybką reakcję na feedback, analizę zadowolenia klientów i budowanie wiarygodnego wizerunku w sieci.'
    },
    {
        question: 'Czy mogę odpowiadać na opinie?',
        answer: 'Tak, w pakietach Pro i Biznes masz możliwość bezpośredniego odpowiadania na opinie wystawione na naszych portalach partnerskich.'
    },
    {
        question: 'Ile trwa konfiguracja konta?',
        answer: 'Konto jest gotowe do użycia natychmiast po rejestracji. Podpięcie Twoich istniejących wizytówek zajmuje zazwyczaj mniej niż 5 minut.'
    },
    {
        question: 'Czy mogę zmienić plan w dowolnym momencie?',
        answer: 'Oczywiście. Możesz przejść na wyższy plan lub zrezygnować z subskrypcji w dowolnym momencie bez żadnych ukrytych kosztów.'
    }
]

export default function BusinessOfferPage() {
    return (
        <div className="bg-white min-h-screen">
            <HomeHeader />

            <main>
                {/* Hero Section */}
                <section className="relative py-24 overflow-hidden bg-gray-900 border-b border-gray-800">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full blur-[120px]"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
                            Rozwijaj swój biznes dzięki <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                                potędze opinii
                            </span>
                        </h1>
                        <p className="mt-6 text-xl leading-8 text-gray-300 max-w-2xl mx-auto">
                            Zautomatyzuj zbieranie recenzji, analizuj feedback z pomocą AI i buduj markę, której klienci ufają bezgranicznie.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/register"
                                className="rounded-full bg-green-600 px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-green-500 hover:scale-105 transition-all"
                            >
                                Załóż darmowe konto
                            </Link>
                            <Link href="#pricing" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white">
                                Zobacz cennik <span aria-hidden="true">↓</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Benefits Grid */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-base font-semibold text-green-600 uppercase tracking-wide">Dlaczego OpinieOn?</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Narzędzia zaprojektowane dla nowoczesnych firm
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {BENEFITS.map((benefit, idx) => (
                                <div key={idx} className="p-8 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-xl hover:border-green-100 transition-all group">
                                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                                        <benefit.icon className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {benefit.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats / Proof Section */}
                <section className="py-20 bg-green-600">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white">
                            <div>
                                <div className="text-5xl font-extrabold mb-2">93%</div>
                                <div className="text-green-100">Klientów czyta opinie przed zakupem</div>
                            </div>
                            <div>
                                <div className="text-5xl font-extrabold mb-2">+40%</div>
                                <div className="text-green-100">Średni wzrost zaufania do marki</div>
                            </div>
                            <div>
                                <div className="text-5xl font-extrabold mb-2">24/7</div>
                                <div className="text-green-100">Monitoring opinii w Twojej firmie</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-24 bg-gray-50" id="pricing">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Wybierz plan dla swojej firmy</h2>
                            <p className="mt-4 text-lg text-gray-600">Proste zasady, bez ukrytych opłat.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {(Object.keys(PLAN_CONFIG) as SubscriptionPlan[]).map((planKey) => {
                                const plan = PLAN_CONFIG[planKey]
                                const isPopular = planKey === 'PRO'

                                return (
                                    <div
                                        key={planKey}
                                        className={`relative flex flex-col p-8 bg-white rounded-3xl shadow-sm border ${isPopular ? 'border-green-600 ring-2 ring-green-600 lg:scale-105 z-10' : 'border-gray-200'}`}
                                    >
                                        {isPopular && (
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                                                Najpopularniejszy
                                            </div>
                                        )}
                                        <div className="mb-8">
                                            <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                                            <div className="mt-4 flex items-baseline">
                                                <span className="text-4xl font-extrabold tracking-tight text-gray-900">{plan.price} zł</span>
                                                <span className="ml-1 text-sm font-semibold text-gray-500">/mc</span>
                                            </div>
                                        </div>
                                        <ul className="flex-1 space-y-4 mb-8">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                                    <Check className="w-5 h-5 text-green-600 flex-none" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href="/register"
                                            className={`w-full py-3 px-6 rounded-xl text-center font-bold transition-all ${isPopular ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                                        >
                                            Wybierz {plan.name}
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 bg-white">
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center mb-16">Często zadawane pytania</h2>
                        <div className="space-y-8">
                            {FAQ.map((item, idx) => (
                                <div key={idx}>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">{item.question}</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="bg-gray-900 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold text-white mb-6">Gotowy na budowanie wiarygodności?</h2>
                                <p className="text-gray-400 mb-10 max-w-xl mx-auto">
                                    Dołącz do tysięcy firm, które już dziś zarządzają swoją reputacją z OpinieOn.
                                </p>
                                <Link
                                    href="/register"
                                    className="inline-block bg-white text-gray-900 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    Zacznij teraz za darmo
                                </Link>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 blur-3xl -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 blur-3xl -ml-32 -mb-32"></div>
                        </div>
                    </div>
                </section>
            </main>

            <HomeFooter />
        </div>
    )
}
