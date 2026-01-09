'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'
import type { Database } from '@/types/database'

type Portal = Database['public']['Tables']['portals']['Row']
type Company = Database['public']['Tables']['companies']['Row']

export default function NewReviewPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [portals, setPortals] = useState<Portal[]>([])
  const [hoveredRating, setHoveredRating] = useState(0)

  const [formData, setFormData] = useState({
    companyId: '',
    portalId: '',
    authorName: '',
    authorEmail: '',
    rating: 5,
    title: '',
    content: '',
    reviewDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: companiesData } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)

    const { data: portalsData } = await supabase
      .from('portals')
      .select('*')
      .eq('is_active', true)

    if (companiesData) setCompanies(companiesData)
    if (portalsData) setPortals(portalsData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: insertError } = await supabase
        .from('reviews')
        .insert({
          company_id: formData.companyId,
          portal_id: formData.portalId,
          author_name: formData.authorName,
          author_email: formData.authorEmail || null,
          rating: formData.rating,
          title: formData.title || null,
          content: formData.content || null,
          review_date: formData.reviewDate,
        } as any)

      if (insertError) throw insertError

      router.push('/dashboard/reviews')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas dodawania opinii')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/dashboard/reviews"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Powrót do opinii
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dodaj nową opinię</h1>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">
                Firma *
              </label>
              <select
                id="companyId"
                name="companyId"
                required
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border px-3 py-2"
              >
                <option value="">Wybierz firmę</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="portalId" className="block text-sm font-medium text-gray-700">
                Portal *
              </label>
              <select
                id="portalId"
                name="portalId"
                required
                value={formData.portalId}
                onChange={(e) => setFormData({ ...formData, portalId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border px-3 py-2"
              >
                <option value="">Wybierz portal</option>
                {portals.map((portal) => (
                  <option key={portal.id} value={portal.id}>
                    {portal.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">
                Autor opinii *
              </label>
              <input
                type="text"
                id="authorName"
                name="authorName"
                required
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border px-3 py-2"
                placeholder="Jan Kowalski"
              />
            </div>

            <div>
              <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-700">
                Email autora (opcjonalnie)
              </label>
              <input
                type="email"
                id="authorEmail"
                name="authorEmail"
                value={formData.authorEmail}
                onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border px-3 py-2"
                placeholder="jan@example.com"
              />
            </div>

            <div>
              <label htmlFor="reviewDate" className="block text-sm font-medium text-gray-700">
                Data opinii *
              </label>
              <input
                type="date"
                id="reviewDate"
                name="reviewDate"
                required
                value={formData.reviewDate}
                onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ocena *
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || formData.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {formData.rating} / 5
                </span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Tytuł opinii (opcjonalnie)
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border px-3 py-2"
              placeholder="Świetna obsługa!"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Treść opinii (opcjonalnie)
            </label>
            <textarea
              id="content"
              name="content"
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border px-3 py-2"
              placeholder="Opisz doświadczenie..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link
              href="/dashboard/reviews"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Anuluj
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white border border-transparent rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              style={{ background: 'linear-gradient(to right, #4ab144, #0d833f)' }}
            >
              {loading ? 'Dodawanie...' : 'Dodaj opinię'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
