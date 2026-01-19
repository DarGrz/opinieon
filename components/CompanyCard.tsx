import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Building2, CheckCircle2 } from 'lucide-react'
import { StarRating } from './StarRating'

interface CompanyCardProps {
    company: {
        name: string
        slug: string
        logo_url?: string | null
        city?: string | null
        description?: string | null
        avg_rating?: number // Assuming we might calculate this or fetch it
        review_count?: number
        verified?: boolean
    }
}

export function CompanyCard({ company }: CompanyCardProps) {
    const rating = company.avg_rating || 0
    const count = company.review_count || 0

    return (
        <div className="group relative flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-green-100">
            {/* Logo */}
            <div className="flex-none">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {company.logo_url ? (
                        <Image
                            src={company.logo_url}
                            alt={company.name}
                            fill
                            className="object-contain p-2"
                        />
                    ) : (
                        <Building2 className="h-8 w-8 text-gray-300" />
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors truncate pr-4">
                            <Link href={`/company/${company.slug}`}>
                                {company.name}
                            </Link>
                        </h3>
                        {company.verified && (
                            <div className="flex items-center gap-1 text-xs text-green-700 mt-1 mb-2">
                                <CheckCircle2 className="w-3 h-3" /> Zweryfikowana
                            </div>
                        )}
                        <div className="flex items-center gap-2 mt-1 mb-3">
                            <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
                            <StarRating rating={rating} size="sm" />
                            <span className="text-sm text-gray-500">({count} opinii)</span>
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <Link
                            href={`/company/${company.slug}`}
                            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Zobacz profil
                        </Link>
                    </div>
                </div>

                {company.city && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {company.city}
                    </div>
                )}

                {company.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {company.description}
                    </p>
                )}
            </div>
            <div className="sm:hidden mt-4">
                <Link
                    href={`/company/${company.slug}`}
                    className="block w-full text-center rounded-lg bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                >
                    Zobacz profil
                </Link>
            </div>
        </div>
    )
}
