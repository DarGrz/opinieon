import Link from 'next/link'
import { HomeHeader } from '@/components/HomeHeader'
import { HomeFooter } from '@/components/HomeFooter'
import { Check, QrCode, Mail, MessageSquare, Smartphone, Globe, TrendingUp, Shield, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Zbieraj opinie kiedy chcesz, jak chcesz | opinieOn',
    description: 'Automatyzuj zbieranie opinii od klientów. QR kody, SMS, email, widget na stronie. Zwiększ swoją widoczność online dzięki autentycznym opiniom.',
}

export default function ZbierajOpinieePage() {
    return (
        <>
            <HomeHeader />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
                {/* Animated gradient orbs */}
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-20 left-20 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-40">
                    <div className="text-center">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                            Zbieraj opinie
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                                kiedy chcesz, jak chcesz
                            </span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
                            Automatyzuj proces zbierania opinii od klientów. QR kody, SMS, email, widget na stronie WWW.
                            Buduj wiarygodność i zwiększaj konwersję.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-10 py-5 text-lg font-bold text-white shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
                            >
                                <span className="relative z-10">Zacznij za darmo</span>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                            <Link
                                href="#jak-to-dziala"
                                className="inline-flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm px-10 py-5 text-lg font-bold text-gray-900 shadow-xl ring-2 ring-inset ring-green-200 hover:bg-white hover:ring-green-400 transition-all duration-300 transform hover:scale-105"
                            >
                                Zobacz jak to działa
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative bg-gray-900 py-16">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="group">
                            <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">3x</div>
                            <div className="text-gray-300 text-lg">Więcej opinii miesięcznie</div>
                        </div>
                        <div className="group">
                            <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">95%</div>
                            <div className="text-gray-300 text-lg">Automatyzacji procesu</div>
                        </div>
                        <div className="group">
                            <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">24/7</div>
                            <div className="text-gray-300 text-lg">Zbieranie bez przerw</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Methods Section */}
            <section id="jak-to-dziala" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Zbieraj opinie na wiele sposobów
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Wybierz najlepszą metodę dla Twojego biznesu lub używaj wszystkich jednocześnie
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* QR Codes */}
                        <div className="relative group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                <QrCode className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Kody QR</h3>
                            <p className="text-gray-600 mb-4">
                                Wydrukuj i umieść w lokalu, na paragonach, wizytówkach. Klient skanuje i od razu zostawia opinię.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-none" />
                                    Generowanie nieograniczonej liczby kodów
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-none" />
                                    Personalizowane wzory i kolory
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-none" />
                                    Śledzenie skuteczności każdego kodu
                                </li>
                            </ul>
                        </div>

                        {/* Email & SMS */}
                        <div className="relative group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 hover:shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                <Mail className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Email & SMS</h3>
                            <p className="text-gray-600 mb-4">
                                Automatyczne zaproszenia po zakupie lub wizycie. Przypomnienia dla niezdecydowanych.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-none" />
                                    Automatyczne wysyłanie po transakcji
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-none" />
                                    Personalizowane szablony wiadomości
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-none" />
                                    Śledzenie otwarć i kliknięć
                                </li>
                            </ul>
                        </div>

                        {/* Widget */}
                        <div className="relative group bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl p-8 border border-teal-100 hover:shadow-2xl hover:shadow-teal-200/50 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-600 to-green-600 text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                <Globe className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Widget na stronie</h3>
                            <p className="text-gray-600 mb-4">
                                Gotowy widget do wklejenia na stronę WWW. Wyświetlaj opinie i zbieraj nowe jednocześnie.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-teal-600 mt-0.5 flex-none" />
                                    Jeden kod do wklejenia
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-teal-600 mt-0.5 flex-none" />
                                    Pełna personalizacja wyglądu
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-teal-600 mt-0.5 flex-none" />
                                    Responsywny i szybki
                                </li>
                            </ul>
                        </div>

                        {/* Social Media */}
                        <div className="relative group bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 border border-green-100 hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-teal-600 text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Social Media</h3>
                            <p className="text-gray-600 mb-4">
                                Linki do udostępnienia na Facebook, Instagram, LinkedIn. Zbieraj opinie prosto z mediów społecznościowych.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-none" />
                                    Gotowe posty do udostępnienia
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-none" />
                                    Tracking z mediów społecznościowych
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-none" />
                                    Zwiększanie zasięgu
                                </li>
                            </ul>
                        </div>

                        {/* Tablet/Terminal */}
                        <div className="relative group bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-100 hover:shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                <Smartphone className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Tablet/Terminal</h3>
                            <p className="text-gray-600 mb-4">
                                Postaw tablet przy kasie lub recepcji. Klienci zostawiają opinie na miejscu, zanim wyjdą.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-none" />
                                    Tryb kiosku (fullscreen)
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-none" />
                                    Prosta obsługa dla klientów
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-none" />
                                    Maksymalna skuteczność
                                </li>
                            </ul>
                        </div>

                        {/* API Integration */}
                        <div className="relative group bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-100 hover:shadow-2xl hover:shadow-teal-200/50 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Integracja API</h3>
                            <p className="text-gray-600 mb-4">
                                Połącz z CRM, e-commerce, kastą fiskalną. Automatyczne zaproszenia po każdej transakcji.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-teal-600 mt-0.5 flex-none" />
                                    REST API dokumentacja
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-teal-600 mt-0.5 flex-none" />
                                    Webhooks dla powiadomień
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-teal-600 mt-0.5 flex-none" />
                                    Wsparcie techniczne
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Dlaczego warto zbierać opinie z opinieOn?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 text-white mb-4 shadow-lg">
                                <Shield className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Weryfikacja i bezpieczeństwo</h3>
                            <p className="text-gray-600">
                                Automatyczna weryfikacja opinii, ochrona przed spamem i fake reviews. Tylko prawdziwe opinie od prawdziwych klientów.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white mb-4 shadow-lg">
                                <TrendingUp className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Zwiększ widoczność</h3>
                            <p className="text-gray-600">
                                Opinie zwiększają Twoją pozycję w Google, budują zaufanie i poprawiają konwersję nawet o 270%.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-600 to-green-600 text-white mb-4 shadow-lg">
                                <Clock className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Oszczędność czasu</h3>
                            <p className="text-gray-600">
                                Automatyzacja pozwala zaoszczędzić do 10 godzin tygodniowo. Skup się na biznesie, nie na zbieraniu opinii.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 py-24">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Zacznij zbierać opinie już dziś
                    </h2>
                    <p className="text-xl sm:text-2xl text-green-100 mb-10">
                        Darmowy start. Bez karty kredytowej. Anuluj kiedy chcesz.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center rounded-full bg-white px-10 py-5 text-lg font-bold text-green-600 shadow-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                        >
                            Wypróbuj za darmo
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center rounded-full bg-green-700 px-10 py-5 text-lg font-bold text-white hover:bg-green-800 transition-all duration-300 transform hover:scale-105 ring-2 ring-white/20"
                        >
                            Mam już konto
                        </Link>
                    </div>
                </div>
            </section>

            <HomeFooter />
        </>
    )
}
