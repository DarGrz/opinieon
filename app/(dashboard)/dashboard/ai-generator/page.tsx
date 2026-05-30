'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Plus, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface GeneratedReview {
  id: string
  author_name: string
  rating: number
  content: string
  selected: boolean
}

interface Portal {
  id: string
  name: string
  slug: string
}

export default function AIGeneratorPage() {
  const [portals, setPortals] = useState<Portal[]>([])
  const [selectedPortal, setSelectedPortal] = useState<string>('')
  const [companyId, setCompanyId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [addingToQueue, setAddingToQueue] = useState(false)
  
  const [prompt, setPrompt] = useState('')
  const [keywords, setKeywords] = useState('')
  const [count, setCount] = useState(5)
  
  const [generatedReviews, setGeneratedReviews] = useState<GeneratedReview[]>([])
  const [queueCount, setQueueCount] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      // Load company
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (company) {
        setCompanyId(company.id)
      }

      // Load portals
      const { data: portalsData } = await supabase
        .from('portals')
        .select('id, name, slug')
        .order('name')

      if (portalsData) {
        setPortals(portalsData)
        if (portalsData.length > 0) {
          setSelectedPortal(portalsData[0].id)
        }
      }

      // Load queue count
      const { count: qCount } = await supabase
        .from('review_queue')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'pending')

      setQueueCount(qCount || 0)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function generateReviews() {
    if (!selectedPortal || !companyId) {
      setMessage({ type: 'error', text: 'Brak wybranego portalu lub firmy' })
      return
    }

    setGenerating(true)
    setMessage(null)

    try {
      const response = await fetch('/api/ai/generate-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portal_id: selectedPortal,
          company_id: companyId,
          prompt,
          keywords,
          count
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Błąd podczas generowania opinii')
      }

      setGeneratedReviews(data.reviews.map((r: any, i: number) => ({
        id: `temp-${i}`,
        ...r,
        selected: true
      })))

      setMessage({ type: 'success', text: `Wygenerowano ${data.reviews.length} opinii` })
    } catch (error: any) {
      console.error('Error generating reviews:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setGenerating(false)
    }
  }

  async function addToQueue() {
    const selectedReviews = generatedReviews.filter(r => r.selected)
    
    if (selectedReviews.length === 0) {
      setMessage({ type: 'error', text: 'Wybierz przynajmniej jedną opinię' })
      return
    }

    setAddingToQueue(true)
    setMessage(null)

    try {
      const response = await fetch('/api/ai/add-to-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviews: selectedReviews.map(r => ({
            portal_id: selectedPortal,
            company_id: companyId,
            author_name: r.author_name,
            rating: r.rating,
            content: r.content,
            generation_prompt: prompt || keywords
          }))
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Błąd podczas dodawania do kolejki')
      }

      setMessage({ type: 'success', text: `Dodano ${selectedReviews.length} opinii do kolejki` })
      setGeneratedReviews([])
      setQueueCount(prev => prev + selectedReviews.length)
    } catch (error: any) {
      console.error('Error adding to queue:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setAddingToQueue(false)
    }
  }

  function toggleReview(id: string) {
    setGeneratedReviews(prev =>
      prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r)
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generator opinii AI</h1>
          <p className="text-gray-600">
            Generuj autentyczne opinie za pomocą sztucznej inteligencji
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            W kolejce: <strong>{queueCount}</strong> opinii
          </span>
        </div>
      </div>

      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-lg mb-6 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generator form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-600" />
            Parametry generowania
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portal
              </label>
              <select
                value={selectedPortal}
                onChange={(e) => setSelectedPortal(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {portals.map(portal => (
                  <option key={portal.id} value={portal.id}>
                    {portal.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wytyczne / Tekst bazowy
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Np. Pozytywne opinie o usługach instalacyjnych, profesjonalne podejście..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Słowa kluczowe (opcjonalnie)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Np. szybko, profesjonalnie, tanio"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Liczba opinii: {count}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={generateReviews}
              disabled={generating || !selectedPortal}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generowanie...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generuj opinie
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated reviews preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Wygenerowane opinie ({generatedReviews.length})
            </h2>
            {generatedReviews.length > 0 && (
              <button
                onClick={addToQueue}
                disabled={addingToQueue || generatedReviews.filter(r => r.selected).length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm flex items-center gap-2"
              >
                {addingToQueue ? (
                  <>Dodawanie...</>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Dodaj do kolejki ({generatedReviews.filter(r => r.selected).length})
                  </>
                )}
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {generatedReviews.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Tutaj pojawią się wygenerowane opinie</p>
              </div>
            ) : (
              generatedReviews.map(review => (
                <div
                  key={review.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    review.selected
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => toggleReview(review.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">{review.author_name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {review.selected && (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{review.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Queue info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          ℹ️ Jak działa kolejka?
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Każda opinia ma unikalną datę z przeszłości (max 2 opinie na dzień)</li>
          <li>• System publikuje automatycznie 2 opinie dziennie o godzinie 9:00</li>
          <li>• Publikowane są tylko opinie, których data już minęła</li>
          <li>• Dzięki temu opinie pojawiają się stopniowo i naturalnie</li>
        </ul>
      </div>
    </div>
  )
}
