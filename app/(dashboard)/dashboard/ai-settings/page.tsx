'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Key, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function AISettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadApiKey()
  }, [])

  async function loadApiKey() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data } = await supabase
        .from('user_profiles')
        .select('claude_api_key')
        .eq('id', user.id)
        .single()

      if (data?.claude_api_key) {
        setApiKey(data.claude_api_key)
      }
    } catch (error) {
      console.error('Error loading API key:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveApiKey() {
    setSaving(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Nie jesteś zalogowany')

      const { error } = await supabase
        .from('user_profiles')
        .update({ claude_api_key: apiKey })
        .eq('id', user.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Klucz API został zapisany pomyślnie' })
    } catch (error) {
      console.error('Error saving API key:', error)
      setMessage({ type: 'error', text: 'Błąd podczas zapisywania klucza API' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ustawienia AI</h1>
        <p className="text-gray-600">
          Skonfiguruj klucz API Claude do generowania opinii
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-3 mb-6">
          <Key className="w-5 h-5 text-gray-400 mt-1" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Klucz API Claude
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Aby korzystać z funkcji generowania opinii przez AI, musisz podać swój klucz API Claude.
              Możesz go uzyskać na stronie <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Anthropic Console</a>.
            </p>

            <div className="mb-4">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                Klucz API
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-api..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Twój klucz API jest przechowywany bezpiecznie i używany tylko do generowania opinii.
              </p>
            </div>

            {message && (
              <div className={`flex items-center gap-2 p-4 rounded-lg mb-4 ${
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

            <button
              onClick={saveApiKey}
              disabled={saving || !apiKey}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Zapisywanie...' : 'Zapisz klucz API'}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Bezpieczeństwo
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Klucz API jest szyfrowany w bazie danych</li>
            <li>• Używany tylko do generowania opinii dla Twoich portali</li>
            <li>• Nie jest udostępniany innym użytkownikom</li>
            <li>• Możesz go zmienić lub usunąć w każdej chwili</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
