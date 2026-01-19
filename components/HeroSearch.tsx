"use client"

import { Search, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function HeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (city) params.set('city', city)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden">
      {/* Background gradients */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
          Poznaj prawdę o firmach <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
            zanim kupisz
          </span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 mb-10 max-w-2xl mx-auto">
          Przeszukaj tysiące wiarygodnych opinii i znajdź najlepszych specjalistów w Twojej okolicy.
          Dołącz do społeczności świadomych konsumentów.
        </p>

        <form onSubmit={handleSearch} className="max-w-3xl mx-auto backdrop-blur-md bg-white/70 p-2 rounded-2xl shadow-xl border border-white/50 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
            </div>
            <input
              type="text"
              name="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border-none rounded-xl bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 sm:text-sm sm:leading-6"
              placeholder="Czego szukasz? (np. hydraulik, fryzjer)"
            />
          </div>
          
          <div className="hidden sm:block w-px bg-gray-200 my-2"></div>
          
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
            </div>
            <input
              type="text"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border-none rounded-xl bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 sm:text-sm sm:leading-6"
              placeholder="Cała Polska"
            />
          </div>

          <button
            type="submit"
            className="flex-none bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-green-200"
          >
            Szukaj
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-x-6 text-sm">
          <span className="text-gray-500">Popularne:</span>
          <button onClick={() => setQuery('Hydraulik')} className="text-gray-600 hover:text-green-600 font-medium">Hydraulik</button>
          <button onClick={() => setQuery('Mechanik')} className="text-gray-600 hover:text-green-600 font-medium">Mechanik</button>
          <button onClick={() => setQuery('Fryzjer')} className="text-gray-600 hover:text-green-600 font-medium">Fryzjer</button>
        </div>
      </div>

      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  )
}
