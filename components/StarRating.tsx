import { Star } from 'lucide-react'

export function StarRating({ rating, size = "md" }: { rating: number, size?: "sm" | "md" | "lg" }) {
    const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'

    return (
        <div className="flex gap-1" aria-label={`Ocena: ${rating} na 5`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${iconSize} ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                />
            ))}
        </div>
    )
}
