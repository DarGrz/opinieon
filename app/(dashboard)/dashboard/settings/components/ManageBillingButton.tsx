'use client'

import { useState } from 'react'

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/billing-portal', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Nie udało się otworzyć portalu płatności')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Wystąpił błąd')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:opacity-90 transition-opacity disabled:opacity-50"
      style={{ background: 'linear-gradient(to right, #4ab144, #0d833f)' }}
    >
      {loading ? 'Ładowanie...' : 'Zarządzaj danymi płatności'}
    </button>
  )
}
