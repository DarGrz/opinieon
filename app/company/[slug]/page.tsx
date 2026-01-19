
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { StarRating } from '@/components/StarRating'
import { HomeHeader } from '@/components/HomeHeader'
import { HomeFooter } from '@/components/HomeFooter'
import { ReviewForm } from '@/components/ReviewForm'
import { MapPin, Globe, Phone, Mail, Calendar, CheckCircle2, Building2, Share2, Flag, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 3600 // Revalidate every hour

async function getCompanyData(slug: string) {
    const supabase = createClient()

    // 1. Get Portal ID for 'opinieon'
    const { data: portal } = await (await supabase).from('portals')
        .select('id')
        .eq('slug', 'opinieon')
        .single()

    if (!portal) return null

    // 2. Get Company
    const { data: company } = await (await supabase).from('companies')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!company) return null

    // 3. Get Reviews
    const { data: allReviews } = await (await supabase).from('reviews')
        .select('*')
        .eq('company_id', company.id)
        .eq('portal_id', portal.id)
        .order('created_at', { ascending: false })
    const reviews = (allReviews || []).filter((r: any) => !r.status || r.status === 'published')

    // Calculate Aggregates
    const reviewCount = reviews.length
    const avgRating = reviewCount > 0
        ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount
        : 0

    return {
        company,
        reviews: reviews || [],
        stats: {
            reviewCount,
            avgRating: Number(avgRating.toFixed(1))
        },
        portalId: portal.id
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const data = await getCompanyData(slug)
    if (!data) return {}

    const { company, stats } = data

    return {
        title: `${company.name} - Opinie, Kontakt, Dane Firmy | OpinieOn`,
        description: `Sprawdź ${stats.reviewCount} autentycznych opinii o ${company.name}. Ocena: ${stats.avgRating}/5. Zobacz dane kontaktowe, ofertę i zdjęcia.`,
        openGraph: {
            title: `${company.name} - Opinie i informacje`,
            description: `Sprawdź autentyczne opinie o ${company.name} na OpinieOn.`,
            images: company.logo_url ? [company.logo_url] : [],
        }
    }
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const data = await getCompanyData(slug)

    if (!data) {
        notFound()
    }

    const { company, reviews, stats, portalId } = data

    // Check auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": company.name,
        "image": company.logo_url,
        "description": company.description,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": company.address,
            "addressLocality": company.city,
            "postalCode": company.postal_code,
            "addressCountry": "PL"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": stats.avgRating,
            "reviewCount": stats.reviewCount || 1, // Avoid 0 for schema if possible or omit
            "bestRating": "5",
            "worstRating": "1"
        }
    }

    return (
        <>
            <HomeHeader />
            <div className="min-h-screen bg-gray-50 pb-12">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                {/* Header / Cover */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="lg:flex lg:items-start lg:justify-between gap-8">
                            <div className="flex items-start gap-6">
                                <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-none rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
                                    {company.logo_url ? (
                                        <Image
                                            src={company.logo_url}
                                            alt={company.name}
                                            className="h-full w-full object-contain rounded-xl"
                                            width={128}
                                            height={128}
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-xl">
                                            <Building2 className="h-10 w-10 text-gray-300" />
                                        </div>
                                    )}
                                </div>

                                <div className="pt-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                                            {company.name}
                                        </h1>
                                        {/* Verified Badge - assuming logic based on GMB link or verified flag */}
                                        {company.gmb_link && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Zweryfikowana
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
                                        <div className="flex items-center gap-1.5 font-medium text-gray-900">
                                            <span className="text-xl font-bold text-gray-900">{stats.avgRating}</span>
                                            <StarRating rating={stats.avgRating} size="sm" />
                                            <span className="text-gray-500 font-normal ml-1">({stats.reviewCount} opinii)</span>
                                        </div>
                                        <span className="text-gray-300">|</span>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            {company.city}
                                        </div>
                                        {company.postal_code && <span className="text-gray-400 text-xs text-gray-500">({company.postal_code})</span>}
                                    </div>

                                    <div className="flex gap-3">
                                        <a href="#add-review" className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                                            Dodaj opinię
                                        </a>
                                        <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                            Obserwuj
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50">
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Claim Box */}
                            <div className="mt-6 lg:mt-0 flex flex-col gap-3 min-w-[300px] bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                    <Flag className="w-4 h-4" />
                                    To Twoja firma?
                                </h3>
                                <p className="text-xs text-blue-700">
                                    Zarządzaj wizytówką, odpowiadaj na opinie i zdobywaj klientów.
                                </p>
                                <Link href="/register" className="text-xs font-semibold text-blue-700 hover:underline">
                                    Przejmij profil za darmo &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs (Fake for now) */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                        <div className="flex gap-8 border-b border-gray-200">
                            <a href="#overview" className="border-b-2 border-green-600 py-4 text-sm font-medium text-green-600">Przegląd</a>
                            <a href="#reviews" className="border-b-2 border-transparent py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">Opinie ({stats.reviewCount})</a>
                            <a href="#photos" className="border-b-2 border-transparent py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">Zdjęcia</a>
                            <a href="#about" className="border-b-2 border-transparent py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">O firmie</a>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Reviews */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About Section (Short) */}
                        {company.description && (
                            <div id="overview" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">O firmie {company.name}</h2>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {company.description}
                                </p>
                            </div>
                        )}

                        {/* Reviews Section */}
                        <div id="reviews" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Opinie klientów</h2>
                                <div className="text-sm text-gray-500">
                                    Sortuj wg: <span className="font-medium text-gray-900">Najnowsze</span>
                                </div>
                            </div>

                            {reviews.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h3 className="text-gray-900 font-medium mb-1">Brak opinii</h3>
                                    <p className="text-gray-500 text-sm mb-4">Bądź pierwszą osobą, która oceni tę firmę.</p>
                                    <a href="#add-review" className="text-green-600 font-semibold hover:underline">Dodaj opinię</a>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {reviews.map((review: any) => (
                                        <div key={review.id} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-green-100 to-green-50 flex items-center justify-center text-green-700 font-bold text-sm">
                                                        {review.author_name?.[0]?.toUpperCase() || 'A'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 text-sm">{review.author_name}</div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                                            {/* Date formatting */}
                                                            {new Date(review.created_at).toLocaleDateString('pl-PL')}
                                                        </div>
                                                    </div>
                                                </div>
                                                {review.is_verified && (
                                                    <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                                                        <CheckCircle2 className="w-3 h-3" /> Zweryfikowany
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mb-2">
                                                <StarRating rating={review.rating} size="sm" />
                                            </div>
                                            {review.title && <h3 className="font-semibold text-gray-900 mb-2 text-sm">{review.title}</h3>}
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {review.content}
                                            </p>
                                            {(review.pros || review.cons) && (
                                                <div className="mt-4 flex gap-4 text-xs">
                                                    {review.pros && (
                                                        <div className="flex gap-2 text-green-700">
                                                            <span className="font-bold">Plusy:</span> {review.pros}
                                                        </div>
                                                    )}
                                                    {review.cons && (
                                                        <div className="flex gap-2 text-red-700">
                                                            <span className="font-bold">Minusy:</span> {review.cons}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Add Review Form */}
                        <div id="add-review" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 scroll-mt-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-2">Podziel się swoją opinią</h2>
                            <p className="text-gray-500 text-sm mb-6">Twoja opinia pomoże innym w podjęciu dobrej decyzji.</p>
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                {user ? (
                                    <ReviewForm
                                        companyId={company.id}
                                        portalId={portalId}
                                        companyName={company.name}
                                    />
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-gray-600 mb-4">Aby dodać opinię, musisz być zalogowany.</p>
                                        <div className="flex justify-center gap-4">
                                            <Link href={`/login?next=/company/${company.slug}`} className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-500 transition-colors shadow-sm">
                                                Zaloguj się
                                            </Link>
                                            <Link href="/register" className="bg-white text-gray-900 px-6 py-2.5 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
                                                Załóż konto
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-semibold text-gray-900 mb-4">Dane kontaktowe</h3>
                            <ul className="space-y-4">
                                {company.website && (
                                    <li className="flex items-start gap-3 text-sm">
                                        <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline break-all">
                                            {company.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </li>
                                )}
                                {company.phone && (
                                    <li className="flex items-center gap-3 text-sm">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <a href={`tel:${company.phone}`} className="text-gray-900 hover:text-green-600">{company.phone}</a>
                                    </li>
                                )}
                                {company.email && (
                                    <li className="flex items-center gap-3 text-sm">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <a href={`mailto:${company.email}`} className="text-gray-900 hover:text-green-600">{company.email}</a>
                                    </li>
                                )}
                                <li className="flex items-start gap-3 text-sm">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <span className="text-gray-600">
                                        {company.address}<br />
                                        {company.postal_code} {company.city}
                                    </span>
                                </li>
                            </ul>

                            <hr className="my-6 border-gray-100" />

                            <h3 className="font-semibold text-gray-900 mb-4">Godziny otwarcia</h3>
                            <div className="flex items-start gap-3 text-sm text-gray-600">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="flex justify-between w-full min-w-[150px] mb-1">
                                        <span>Pon - Pt:</span>
                                        <span className="font-medium text-gray-900">08:00 - 17:00</span>
                                    </p>
                                    <p className="flex justify-between w-full min-w-[150px]">
                                        <span>Sobota:</span>
                                        <span className="font-medium text-gray-900">Nieczynne</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <HomeFooter />
        </>
    )
}
