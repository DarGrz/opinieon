"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function HomeHeader() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <nav className="flex items-center justify-between p-4 sm:p-6 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
                <div className="flex flex-1 items-center">
                    <Link href="/" className="-m-1.5 p-1.5 flex items-center">
                        <Image
                            src="/opinieon-logo-sq-new-green.png"
                            alt="opinieOn Logo"
                            width={120}
                            height={32}
                            priority
                            className="h-8 w-auto"
                        />
                    </Link>
                </div>
                {/* Desktop menu */}
                <div className="hidden sm:flex gap-x-8 items-center">
                    <Link href="/search" className="text-sm font-semibold leading-6 text-gray-900 hover:text-green-600">
                        Przeglądaj firmy
                    </Link>
                    <Link href="#business" className="text-sm font-semibold leading-6 text-gray-900 hover:text-green-600">
                        Oferta dla firm
                    </Link>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <Link
                        href="/login"
                        className="text-sm font-semibold leading-6 text-gray-900 hover:text-green-600"
                    >
                        Zaloguj się
                    </Link>
                    <Link
                        href="/register"
                        className="rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(to right, #4ab144, #0d833f)' }}
                    >
                        Dla Firm: Dołącz teraz
                    </Link>
                </div>
                {/* Hamburger for mobile */}
                <button
                    className="sm:hidden p-2 text-gray-900 hover:text-green-600 focus:outline-none"
                    aria-label="Otwórz menu"
                    onClick={() => setMenuOpen(true)}
                >
                    <Menu size={28} />
                </button>
            </nav>
            {/* Offcanvas mobile menu */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex">
                    <div className="bg-white w-4/5 max-w-xs h-full shadow-lg flex flex-col p-6 animate-slideInLeft relative">
                        <button
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900"
                            aria-label="Zamknij menu"
                            onClick={() => setMenuOpen(false)}
                        >
                            <X size={28} />
                        </button>

                        <div className="flex items-center mb-8 mt-2">
                            <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
                                <Image
                                    src="/opinieon-logo-sq-new-green.png"
                                    alt="opinieOn Logo"
                                    width={100}
                                    height={28}
                                    className="h-7 w-auto"
                                />
                            </Link>
                        </div>

                        <nav className="flex flex-col gap-4 mt-4">
                            <Link
                                href="/search"
                                className="text-base font-semibold text-gray-900 hover:text-green-600 py-2 border-b border-gray-100"
                                onClick={() => setMenuOpen(false)}
                            >
                                Przeglądaj firmy
                            </Link>
                            <Link
                                href="#business"
                                className="text-base font-semibold text-gray-900 hover:text-green-600 py-2 border-b border-gray-100"
                                onClick={() => setMenuOpen(false)}
                            >
                                Oferta dla firm
                            </Link>
                            <Link
                                href="/login"
                                className="text-base font-semibold text-gray-900 hover:text-green-600 py-2"
                                onClick={() => setMenuOpen(false)}
                            >
                                Zaloguj się
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-md px-3.5 py-2.5 text-base font-semibold text-white shadow-sm hover:opacity-90 transition-opacity mt-4 text-center"
                                style={{ background: 'linear-gradient(to right, #4ab144, #0d833f)' }}
                                onClick={() => setMenuOpen(false)}
                            >
                                Dla Firm: Dołącz
                            </Link>
                        </nav>
                    </div>
                    {/* Click outside to close */}
                    <div className="flex-1" onClick={() => setMenuOpen(false)} />
                </div>
            )}
        </header>
    )
}
