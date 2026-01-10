'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Star, MessageSquare, Plus, Check, Clock, Edit, Trash2, Archive, Filter, X } from 'lucide-react'

interface Review {
  id: string
  rating: number
  title: string
  content: string
  author_name: string
  review_date: string
  status: string
  company?: { name: string }
  portal?: { name: string; slug: string }
}

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  const [reviewsData, setReviewsData] = useState(reviews)
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedPortal, setSelectedPortal] = useState<string>('all')
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    rating: 5,
    authorName: '',
    authorEmail: ''
  })

  // Pobierz unikalne portale
  const portals = useMemo(() => {
    const unique = new Map<string, { name: string; slug: string }>()
    reviewsData.forEach(r => {
      if (r.portal?.slug) {
        unique.set(r.portal.slug, { name: r.portal.name, slug: r.portal.slug })
      }
    })
    return Array.from(unique.values())
  }, [reviewsData])

  // Filtruj opinie po wybranym portalu
  const filteredReviews = useMemo(() => {
    if (selectedPortal === 'all') return reviewsData
    return reviewsData.filter(r => r.portal?.slug === selectedPortal)
  }, [reviewsData, selectedPortal])

  const handleApprove = async (reviewId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setLoading(reviewId)
    try {
      const res = await fetch(`/api/reviews/${reviewId}/approve`, {
        method: 'POST',
      })
      
      if (res.ok) {
        setReviewsData(prev => prev.map(r => 
          r.id === reviewId ? { ...r, status: 'approved' } : r
        ))
      }
    } catch (error) {
      console.error('Error approving review:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleArchive = async (reviewId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm('Czy na pewno chcesz zarchiwizować tę opinię? Nie będzie widoczna w portalach.')) return
    
    setLoading(reviewId)
    try {
      const res = await fetch(`/api/reviews/${reviewId}/archive`, {
        method: 'POST',
      })
      
      if (res.ok) {
        setReviewsData(prev => prev.filter(r => r.id !== reviewId))
      }
    } catch (error) {
      console.error('Error archiving review:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (reviewId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm('Czy na pewno chcesz usunąć tę opinię? Ta akcja jest nieodwracalna.')) return
    
    setLoading(reviewId)
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        setReviewsData(prev => prev.filter(r => r.id !== reviewId))
      }
    } catch (error) {
      console.error('Error deleting review:', error)
    } finally {
      setLoading(null)
    }
  }

  const openEditModal = (review: Review, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingReview(review)
    setEditForm({
      title: review.title || '',
      content: review.content || '',
      rating: review.rating || 5,
      authorName: review.author_name || '',
      authorEmail: ''
    })
  }

  const closeEditModal = () => {
    setEditingReview(null)
    setEditForm({
      title: '',
      content: '',
      rating: 5,
      authorName: '',
      authorEmail: ''
    })
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingReview) return

    setLoading(editingReview.id)
    try {
      const res = await fetch(`/api/reviews/${editingReview.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      if (res.ok) {
        setReviewsData(prev => prev.map(r => 
          r.id === editingReview.id 
            ? { 
                ...r, 
                title: editForm.title,
                content: editForm.content,
                rating: editForm.rating,
                author_name: editForm.authorName
              } 
            : r
        ))
        closeEditModal()
      }
    } catch (error) {
      console.error('Error updating review:', error)
      alert('Wystąpił błąd podczas aktualizacji opinii')
    } finally {
      setLoading(null)
    }
  }

  if (filteredReviews.length === 0 && reviewsData.length > 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setSelectedPortal('all')}
              className={`${
                selectedPortal === 'all'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Wszystkie ({reviewsData.length})
            </button>
            {portals.map(portal => (
              <button
                key={portal.slug}
                onClick={() => setSelectedPortal(portal.slug)}
                className={`${
                  selectedPortal === portal.slug
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                {portal.name} ({reviewsData.filter(r => r.portal?.slug === portal.slug).length})
              </button>
            ))}
          </nav>
        </div>
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Brak opinii w tym portalu</h3>
          <p className="mt-1 text-sm text-gray-500">
            Zmień filtr aby zobaczyć inne opinie
          </p>
        </div>
      </div>
    )
  }

  if (reviewsData.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Brak opinii</h3>
          <p className="mt-1 text-sm text-gray-500">
            Dodaj pierwszą opinię aby zacząć
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/reviews/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(to right, #4ab144, #0d833f)' }}
            >
              <Plus className="mr-2 h-5 w-5" />
              Dodaj opinię
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {portals.length > 0 && (
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setSelectedPortal('all')}
              className={`${
                selectedPortal === 'all'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Wszystkie ({reviewsData.length})
            </button>
            {portals.map(portal => (
              <button
                key={portal.slug}
                onClick={() => setSelectedPortal(portal.slug)}
                className={`${
                  selectedPortal === portal.slug
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                {portal.name} ({reviewsData.filter(r => r.portal?.slug === portal.slug).length})
              </button>
            ))}
          </nav>
        </div>
      )}
      <ul className="divide-y divide-gray-200">
        {filteredReviews.map((review) => (
          <li key={review.id}>
            <div className="block hover:bg-gray-50 p-6">
              <div className="flex items-center justify-between">
                <Link href={`/dashboard/reviews/${review.id}`} className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-green-600 truncate">
                      {review.company?.name}
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-green-800">
                      {review.portal?.name}
                    </span>
                    {review.status === 'pending' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Oczekuje
                      </span>
                    )}
                    {review.status === 'approved' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Zatwierdzona
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {review.author_name}
                    </span>
                  </div>
                  {review.content && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {review.content}
                    </p>
                  )}
                </Link>
                <div className="ml-5 flex-shrink-0 flex flex-col items-end gap-2">
                  <span className="text-sm text-gray-500">
                    {new Date(review.review_date).toLocaleDateString('pl-PL')}
                  </span>
                  <div className="flex gap-2">
                    {review.status === 'pending' && (
                      <button
                        onClick={(e) => handleApprove(review.id, e)}
                        disabled={loading === review.id}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        title="Zatwierdź"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {loading === review.id ? '...' : 'Zatwierdź'}
                      </button>
                    )}
                    <button
                      onClick={(e) => openEditModal(review, e)}
                      disabled={loading === review.id}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      title="Edytuj"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleArchive(review.id, e)}
                      disabled={loading === review.id}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      title="Archiwizuj"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(review.id, e)}
                      disabled={loading === review.id}
                      className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                      title="Usuń"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal edycji */}
      {editingReview && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Edytuj opinię</h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tytuł
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treść opinii *
                </label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  required
                  rows={6}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ocena *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, rating })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          rating <= editForm.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {editForm.rating}/5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imię i nazwisko autora *
                </label>
                <input
                  type="text"
                  value={editForm.authorName}
                  onChange={(e) => setEditForm({ ...editForm, authorName: e.target.value })}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email autora
                </label>
                <input
                  type="email"
                  value={editForm.authorEmail}
                  onChange={(e) => setEditForm({ ...editForm, authorEmail: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={loading === editingReview.id}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {loading === editingReview.id ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
