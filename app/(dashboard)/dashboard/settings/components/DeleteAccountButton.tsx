'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function DeleteAccountButton() {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)
    try {
      // Tutaj dodaj logikę usuwania konta
      // Na razie tylko wylogowanie
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error:', error)
      alert('Wystąpił błąd podczas usuwania konta')
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-red-900">
          Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Usuwanie...' : 'Tak, usuń konto'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Anuluj
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
    >
      Usuń konto
    </button>
  )
}
