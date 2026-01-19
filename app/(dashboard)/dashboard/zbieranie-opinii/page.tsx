'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Star, Link as LinkIcon, QrCode, Copy, Check, ExternalLink } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export default function ZbieranieOpiniiPage() {
    const [company, setCompany] = useState<any>(null)
    const [copied, setCopied] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchCompanyData()
    }, [])

    const fetchCompanyData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('companies')
            .select('*')
            .eq('user_id', user.id)
            .single()

        setCompany(data)
    }

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        setCopied(label)
        setTimeout(() => setCopied(null), 2000)
    }

    const downloadQR = (portalName: string) => {
        const canvas = document.getElementById(`qr-${portalName}`)?.querySelector('canvas')
        if (!canvas) return

        const link = document.createElement('a')
        link.download = `QR-${portalName}-${company?.slug || 'opinie'}.png`
        link.href = canvas.toDataURL()
        link.click()
    }

    if (!company) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        )
    }

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

    // Helper to get direct GMB review link
    const getGmbLink = () => {
        if (!company.gmb_link) return ''

        // If it's already a direct link, return it
        if (company.gmb_link.includes('writereview') || company.gmb_link.includes('g.page')) {
            return company.gmb_link
        }

        // Attempt to transform standard Maps link to direct review link if possible
        // For now, we return what's in the DB, but we'll add a helper below
        return company.gmb_link
    }

    const gmbLink = getGmbLink()

    const links = [
        {
            name: 'opinieOn',
            url: `${baseUrl}/company/${company.slug}#add-review`,
            color: 'green',
            description: 'Link do dodania opinii na opinieOn.pl'
        },
        {
            name: 'Google My Business',
            url: gmbLink || `https://search.google.com/local/writereview?placeid=Twój_Place_ID`,
            color: 'blue',
            description: 'Link bezpośrednio otwierający okno opinii w Google',
            external: true,
            needsSetup: !gmbLink
        }
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Zbieranie opinii</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Linki i kody QR do zbierania opin

                    ii od klientów
                </p>
            </div>

            {/* Linki bezpośrednie */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-green-600" />
                    Linki bezpośrednie
                </h2>
                <div className="space-y-4">
                    {links.map((link) => (
                        <div key={link.name} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        {link.name}
                                        {link.external && <ExternalLink className="w-4 h-4 text-gray-400" />}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                                <input
                                    type="text"
                                    value={link.url}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                                />
                                <button
                                    onClick={() => copyToClipboard(link.url, link.name)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
                                >
                                    {copied === link.name ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Skopiowano
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Kopiuj
                                        </>
                                    )}
                                </button>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                                >
                                    Otwórz
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Kody QR */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-green-600" />
                    Kody QR
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Wydrukuj i umieść w widocznym miejscu, na wizytówkach lub paragonach.
                    Klienci mogą zeskanować kodem i od razu zostawić opinię.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {links.map((link) => (
                        <div key={link.name} className="border border-gray-200 rounded-lg p-6 text-center group hover:border-green-200 transition-colors">
                            <h3 className="font-semibold text-gray-900 mb-4">{link.name}</h3>
                            <div id={`qr-${link.name}`} className="flex justify-center mb-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <QRCodeSVG
                                    value={link.url}
                                    size={180}
                                    level="H"
                                    includeMargin
                                    imageSettings={{
                                        src: '/opinieon-logo-sq-new-green.png',
                                        height: 36,
                                        width: 36,
                                        excavate: true,
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => downloadQR(link.name)}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium shadow-sm active:scale-95 transition-transform"
                            >
                                Pobierz PNG
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* GMB Helper */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="G" className="w-5 h-5" />
                    Jak uzyskać krótki link do opinii (g.page)?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="text-sm text-gray-600 space-y-3">
                        <p>Najlepszym formatem jest krótki link, który wygląda tak:</p>
                        <div className="bg-gray-800 text-gray-200 p-3 rounded-md font-mono text-xs break-all border-l-4 border-blue-500">
                            https://g.page/r/UNIKALNY_KOD/review
                        </div>
                        <h4 className="font-bold text-gray-900 mt-4">Gdzie go znaleźć?</h4>
                        <ol className="list-decimal list-inside space-y-2 mt-2 ml-2">
                            <li>Zaloguj się do swojego <strong>Profilu Firmy w Google</strong></li>
                            <li>Kliknij przycisk <strong>"Poproś o opinie"</strong> (ikona gwiazdki)</li>
                            <li>Skopiuj wyświetlony tam krótki link (zaczyna się od g.page)</li>
                            <li>Wklej go w <strong>Ustawieniach Firmy</strong> w naszym panelu</li>
                        </ol>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 flex flex-col justify-center items-center text-center">
                        <div className="bg-white p-3 rounded-2xl shadow-sm mb-4">
                            <ExternalLink className="w-8 h-8 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-blue-900 mb-1">Zaleta formatu g.page</h4>
                        <p className="text-xs text-blue-700">Ten link automatycznie dopasowuje się do urządzenia klienta i zawsze otwiera formularz opinii w aplikacji Mapy Google lub przeglądarce.</p>
                    </div>
                </div>
            </div>

            {/* Instrukcje */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">💡 Jak używać?</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 mt-0.5 flex-none" />
                        <span><strong>Linki:</strong> Wysyłaj emailem, SMS-em lub umieszczaj na swojej stronie/social media</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 mt-0.5 flex-none" />
                        <span><strong>Kody QR:</strong> Wydrukuj i umieść w widocznym miejscu (przy kasie, na wizytówkach, na paragonach)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 mt-0.5 flex-none" />
                        <span><strong>Google:</strong> Upewnij się, że link GMB jest poprawny - uzupełnij w Ustawieniach firmy</span>
                    </li>
                </ul>
            </div>

            {/* Statystyki (placeholder) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Statystyki (wkrótce)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">-</div>
                        <div className="text-sm text-gray-600 mt-1">Kliknięcia w linki</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">-</div>
                        <div className="text-sm text-gray-600 mt-1">Skany QR kodów</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">-</div>
                        <div className="text-sm text-gray-600 mt-1">Nowe opinie</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
