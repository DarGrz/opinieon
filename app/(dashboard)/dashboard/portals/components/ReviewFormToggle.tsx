'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface ReviewFormToggleProps {
  portalId: string
  profileId: string | undefined
  companyId: string
  enabled: boolean
  portalName: string
}

export function ReviewFormToggle({ portalId, profileId, companyId, enabled, portalName }: ReviewFormToggleProps) {
  const [isEnabled, setIsEnabled] = useState(enabled)
  const [loading, setLoading] = useState(false)

  async function toggleReviewForm() {
    setLoading(true)
    try {
      const response = await fetch('/api/portals/toggle-review-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portal_id: portalId,
          profile_id: profileId,
          company_id: companyId,
          enabled: !isEnabled
        })
      })

      if (response.ok) {
        setIsEnabled(!isEnabled)
      } else {
        alert('Błąd podczas zmiany ustawienia')
      }
    } catch (error) {
      console.error('Error toggling review form:', error)
      alert('Błąd podczas zmiany ustawienia')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggleReviewForm}
      disabled={loading}
      className={`flex items-center justify-center w-full px-4 py-2 border shadow-sm text-sm font-medium rounded-md transition-colors ${
        isEnabled
          ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
          : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isEnabled ? 'Kliknij aby ukryć formularz opinii' : 'Kliknij aby pokazać formularz opinii'}
    >
      {isEnabled ? (
        <>
          <Eye className="mr-2 h-4 w-4" />
          Formularz widoczny
        </>
      ) : (
        <>
          <EyeOff className="mr-2 h-4 w-4" />
          Formularz ukryty
        </>
      )}
    </button>
  )
}
