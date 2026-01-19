import Link from 'next/link'
import Image from 'next/image'

export function HomeFooter() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <Image
                            src="/opinieon-logo-sq-new-green.png"
                            alt="opinieOn Logo"
                            width={120}
                            height={32}
                            className="h-8 w-auto mb-4"
                        />
                        <p className="text-gray-400 text-sm">Twój przewodnik po wiarygodnych firmach. Sprawdzaj, oceniaj, decyduj.</p>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Portal</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/search" className="hover:text-green-400">Przeglądaj firmy</Link></li>
                            <li><Link href="/rankings" className="hover:text-green-400">Rankingi</Link></li>
                            <li><Link href="/categories" className="hover:text-green-400">Kategorie</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Dla Firm</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/register" className="hover:text-green-400">Dodaj firmę</Link></li>
                            <li><Link href="/login" className="hover:text-green-400">Logowanie</Link></li>
                            <li><Link href="#pricing" className="hover:text-green-400">Cennik</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Pomoc</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/contact" className="hover:text-green-400">Kontakt</Link></li>
                            <li><Link href="/faq" className="hover:text-green-400">FAQ</Link></li>
                            <li><Link href="/privacy" className="hover:text-green-400">Polityka prywatności</Link></li>
                        </ul>
                    </div>
                </div>
                <p className="text-center text-sm leading-5 text-gray-500 border-t border-gray-800 pt-8">
                    &copy; {new Date().getFullYear()} opinieOn. Wszystkie prawa zastrzeżone.
                </p>
            </div>
        </footer>
    )
}
