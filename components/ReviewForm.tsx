'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StarRating } from '@/components/StarRating'
import { Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ReviewFormProps {
    companyId: string
    portalId: string
    companyName: string
    onSuccess?: () => void
}

export function ReviewForm({ companyId, portalId, companyName, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) {
            setError('Proszę wybrać ocenę (gwiazdki).')
            return
        }
        if (content.length < 10) {
            setError('Opinia musi mieć co najmniej 10 znaków.')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setError('Musisz być zalogowany, aby dodać opinię.')
                setIsSubmitting(false)
                return
            }

            const { error: submitError } = await supabase
                .from('reviews')
                .insert({
                    company_id: companyId,
                    portal_id: portalId,
                    user_id: user.id,
                    author_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonim',
                    author_email: user.email,
                    rating,
                    content,
                    title: title || undefined,
                    status: 'published' as any // Use explicit cast for enum
                })

            if (submitError) throw submitError

            setSuccess(true)
            setContent('')
            setRating(0)
            setTitle('')
            if (onSuccess) onSuccess()
            router.refresh()
        } catch (err: any) {
            console.error('Error submitting review:', err)
            setError(err.message || 'Wystąpił błąd podczas dodawania opinii.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-fadeIn">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-green-600 fill-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-2">Dziękujemy za Twoją opinię!</h3>
                <p className="text-green-700">Twoja ocena firmy {companyName} została opublikowana.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 text-green-600 font-semibold hover:underline"
                >
                    Dodaj kolejną opinię
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">
                    Twoja ocena
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`p-1 transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                        >
                            <Star className={`w-10 h-10 ${star <= rating ? 'fill-yellow-400' : ''}`} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
                    Tytuł opinii (opcjonalnie)
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="W kilku słowach o Twoim doświadczeniu"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-semibold text-gray-900">
                    Twoja opinia
                </label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Opisz swoją współpracę z tą firmą. Co Ci się podobało, a co można poprawić?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none h-40 text-sm leading-relaxed"
                ></textarea>
                <p className="text-xs text-gray-500 text-right">
                    Minimum 10 znaków.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-100">
                    {error}
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                        bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all
                        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500 hover:shadow-green-500/20 active:scale-95'}
                    `}
                >
                    {isSubmitting ? 'Wysyłanie...' : 'Opublikuj opinię'}
                </button>
            </div>
        </form>
    )
}
