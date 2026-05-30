'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Plus, Trash2, CheckCircle2, Clock, AlertCircle, Save, BookmarkPlus } from 'lucide-react'

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

interface PresetTemplate {
  id: string
  name: string
  prompt: string
  keywords: string
  count: number
  ratingDistribution: string
}

interface QueueItem {
  id: string
  author_name: string
  rating: number
  content: string
  review_date: string
  status: string
  portal_id: string
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
  const [ratingDistribution, setRatingDistribution] = useState('excellent')
  
  const [presets, setPresets] = useState<PresetTemplate[]>([])
  const [showPresetDialog, setShowPresetDialog] = useState(false)
  const [presetName, setPresetName] = useState('')
  
  const [generatedReviews, setGeneratedReviews] = useState<GeneratedReview[]>([])
  const [queueItems, setQueueItems] = useState<QueueItem[]>([])
  const [queueCount, setQueueCount] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadData()
    loadPresets()
    loadLastUsed()
    loadQueueItems()
  }, [])

  function loadPresets() {
    const saved = localStorage.getItem('ai-generator-presets')
    if (saved) {
      setPresets(JSON.parse(saved))
    }
  }

  function loadLastUsed() {
    const saved = localStorage.getItem('ai-generator-last-used')
    if (saved) {
      const { prompt: p, keywords: k, count: c, ratingDistribution: r } = JSON.parse(saved)
      if (p) setPrompt(p)
      if (k) setKeywords(k)
      if (c) setCount(c)
      if (r) setRatingDistribution(r)
    }
  }

  function saveLastUsed() {
    localStorage.setItem('ai-generator-last-used', JSON.stringify({
      prompt,
      keywords,
      count,
      ratingDistribution
    }))
  }

  function savePreset() {
    if (!presetName.trim()) {
      setMessage({ type: 'error', text: 'Podaj nazwę szablonu' })
      return
    }

    const newPreset: PresetTemplate = {
      id: Date.now().toString(),
      name: presetName,
      prompt,
      keywords,
      count,
      ratingDistribution
    }

    const updated = [...presets, newPreset]
    setPresets(updated)
    localStorage.setItem('ai-generator-presets', JSON.stringify(updated))
    
    setShowPresetDialog(false)
    setPresetName('')
    setMessage({ type: 'success', text: 'Szablon zapisany' })
  }

  function loadPreset(preset: PresetTemplate) {
    setPrompt(preset.prompt)
    setKeywords(preset.keywords)
    setCount(preset.count)
    setRatingDistribution(preset.ratingDistribution || 'excellent')
    setMessage({ type: 'success', text: `Wczytano szablon: ${preset.name}` })
  }

  function deletePreset(id: string) {
    const updated = presets.filter(p => p.id !== id)
    setPresets(updated)
    localStorage.setItem('ai-generator-presets', JSON.stringify(updated))
    setMessage({ type: 'success', text: 'Szablon usunięty' })
  }

  async function loadQueueItems() {
    try {
      const response = await fetch('/api/ai/queue')
      if (response.ok) {
        const data = await response.json()
        setQueueItems(data.queue || [])
        setQueueCount(data.count || 0)
      }
    } catch (error) {
      console.error('Error loading queue:', error)
    }
  }

  async function deleteQueueItem(id: string) {
    try {
      const response = await fetch(`/api/ai/queue/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Opinia usunięta z kolejki' })
        loadQueueItems() // Reload queue
      } else {
        throw new Error('Nie udało się usunąć opinii')
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

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

      // Load queue count via API (bypasses RLS)
      const queueResponse = await fetch('/api/ai/queue')
      if (queueResponse.ok) {
        const queueData = await queueResponse.json()
        setQueueCount(queueData.count || 0)
      }
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

    // Save last used parameters
    saveLastUsed()

    try {
      const response = await fetch('/api/ai/generate-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portal_id: selectedPortal,
          company_id: companyId,
          prompt,
          keywords,
          count,
          ratingDistribution
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
      loadQueueItems() // Reload queue to show new items
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

          {/* Saved presets */}
          {presets.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zapisane szablony
              </label>
              <div className="space-y-2">
                {presets.map(preset => (
                  <div key={preset.id} className="flex items-center gap-2">
                    <button
                      onClick={() => loadPreset(preset)}
                      className="flex-1 text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    >
                      {preset.name}
                    </button>
                    <button
                      onClick={() => deletePreset(preset.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                Rozkład ocen
              </label>
              <select
                value={ratingDistribution}
                onChange={(e) => setRatingDistribution(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="excellent">Doskonałe (tylko 5★)</option>
                <option value="very-good">Bardzo dobre (90% 5★, 10% 4★)</option>
                <option value="good">Dobre (60% 5★, 30% 4★, 10% 3★)</option>
                <option value="mixed">Mieszane (różne oceny)</option>
              </select>
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

            <button
              onClick={() => setShowPresetDialog(true)}
              disabled={!prompt && !keywords}
              className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <BookmarkPlus className="w-4 h-4" />
              Zapisz jako szablon
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

      {/* Queue list */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Kolejka oczekujących ({queueCount})
        </h2>

        {queueItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Brak opinii w kolejce</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {queueItems.map(item => {
              const reviewDate = new Date(item.review_date)
              const isPublishable = reviewDate <= new Date()
              const portal = portals.find(p => p.id === item.portal_id)
              
              return (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{item.author_name}</span>
                        <span className="text-xs text-gray-500">• {portal?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={i < item.rating ? 'text-yellow-400' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          isPublishable 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {isPublishable ? '✓ Gotowa do publikacji' : `📅 ${reviewDate.toLocaleDateString('pl-PL')}`}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                    </div>
                    <button
                      onClick={() => deleteQueueItem(item.id)}
                      className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Usuń z kolejki"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
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

      {/* Save preset dialog */}
      {showPresetDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Zapisz szablon
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nazwa szablonu
              </label>
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Np. Pozytywne opinie o instalacjach"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
              />
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
              <p><strong>Wytyczne:</strong> {prompt || '(brak)'}</p>
              <p><strong>Słowa kluczowe:</strong> {keywords || '(brak)'}</p>
              <p><strong>Rozkład ocen:</strong> {
                ratingDistribution === 'excellent' ? 'Doskonałe (tylko 5★)' :
                ratingDistribution === 'very-good' ? 'Bardzo dobre (90% 5★, 10% 4★)' :
                ratingDistribution === 'good' ? 'Dobre (60% 5★, 30% 4★, 10% 3★)' :
                'Mieszane (różne oceny)'
              }</p>
              <p><strong>Liczba opinii:</strong> {count}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPresetDialog(false)
                  setPresetName('')
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={savePreset}
                disabled={!presetName.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
