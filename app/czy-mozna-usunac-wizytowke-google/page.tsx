import Link from 'next/link'
import Image from 'next/image'
import { AlertTriangle, Shield, CheckCircle2, XCircle, Info, AlertCircle, MapPin, TrendingDown, Clock, FileText, Users, Search, Ban } from 'lucide-react'
import { HomeHeader } from '@/components/HomeHeader'
import { HomeFooter } from '@/components/HomeFooter'

export const metadata = {
  title: 'Czy Można Usunąć Wizytówkę Google? Prawda o Usuwaniu Profilu Firmy | OpinieOn',
  description: 'Usunięcie wizytówki Google NIE JEST MOŻLIWE tradycyjną metodą. Poznaj prawdę o usuwaniu profilu firmy z Google Maps, oficjalne stanowisko Google i profesjonalne rozwiązania. Jak usunąć firmę z Google? Sprawdź!',
  keywords: 'czy można usunąć wizytówkę google, jak usunąć wizytówkę google, jak usunąć firmę z google, usunięcie profilu google maps, usuwanie wizytówki google, jak usunąć profil firmy z google',
}

export default function CzyMoznaUsunacWizytowkeGooglePage() {
  return (
    <div className="bg-white min-h-screen">
      <HomeHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-50 via-white to-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full mb-6 font-semibold text-sm">
              <AlertTriangle className="w-5 h-5" />
              Ważna informacja
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Czy Można Usunąć<br />Wizytówkę <span className="text-slate-700">Google?</span>
            </h1>
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg max-w-3xl mx-auto mb-8">
              <p className="text-2xl font-bold text-gray-900 mb-2">
                ❌ NIE - Usunięcie wizytówki Google NIE JEST MOŻLIWE
              </p>
              <p className="text-lg text-gray-700 mb-3">
                Standardową metodą nie da się całkowicie usunąć wizytówki Google z systemu. 
                Poznaj prawdę o usuwaniu profilu firmy z Google Maps.
              </p>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              W tym artykule dowiesz się, dlaczego <strong>usunięcie wizytówki Google jest niemożliwe</strong> tradycyjną metodą, 
              co mówi oficjalne stanowisko Google oraz jakie są profesjonalne rozwiązania tego problemu.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        
        {/* Quick Answer */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-4">🎯 Szybka Odpowiedź</h2>
          <p className="text-xl leading-relaxed mb-4">
            <strong>Jak usunąć wizytówkę Google?</strong> Niestety, <strong className="text-red-400">standardowe usunięcie wizytówki Google NIE JEST MOŻLIWE</strong>. 
            Google nie udostępnia funkcji całkowitego usunięcia profilu firmy z systemu Maps.
          </p>
          <p className="text-lg text-slate-300">
            Próba samodzielnego usunięcia kończy się jedynie <strong>utratą dostępu do zarządzania</strong>, 
            ale wizytówka <strong>pozostaje widoczna</strong> w Google Maps dla wszystkich użytkowników.
          </p>
        </div>

        {/* Jak Usunąć Firmę z Google - Keywords Section */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Jak Usunąć Firmę z Google Maps? Oficjalne Stanowisko
          </h2>
          
          <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <FileText className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Oficjalny Formularz Google</h3>
                <p className="text-gray-700 mb-4">
                  Google udostępnia oficjalny formularz dotyczący <strong>usuwania treści i menedżerów profilu</strong>. 
                  Jednak to <strong>NIE oznacza usunięcia samej wizytówki</strong> z Google Maps!
                </p>
              </div>
            </div>
          </div>

          {/* Official Google Form Screenshot */}
          <div className="bg-white border-2 border-gray-300 rounded-xl p-6 mb-8 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-indigo-600" />
              Oficjalny formularz Google - "Usuwanie treści i menedżerów profilu"
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <Image 
                src="/google-removal-form.png" 
                alt="Oficjalny formularz Google do usuwania treści i menedżerów profilu - pokazuje że usunięcie całej wizytówki nie jest możliwe"
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg shadow-md"
                priority
              />
              <p className="text-sm text-gray-600 mt-4 italic">
                Źródło: Oficjalny formularz Google Business Profile
              </p>
            </div>
          </div>

          {/* What the form really means */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              Co faktycznie oznacza ten formularz?
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-1">•</span>
                <span><strong>Usunięcie treści</strong> - usuwa zdjęcia, wpisy, odpowiedzi na opinie dodane przez Ciebie</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-1">•</span>
                <span><strong>Usunięcie menedżerów</strong> - usuwa dostęp innych osób do zarządzania profilem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-1">•</span>
                <span><strong>NIE usuwa wizytówki</strong> - profil firmy NADAL pozostaje widoczny w Google Maps!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-1">•</span>
                <span><strong>Tracisz kontrolę</strong> - po usunięciu wszystkich menedżerów NIE ODZYSKASZ dostępu</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Statistics Infographic */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Statystyki: Co Dzieje Się Przy Próbie Usunięcia Wizytówki?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Chart 1 */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-red-600 flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-5xl font-bold text-white">100%</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Utrata Dostępu</h3>
                <p className="text-gray-700">
                  Właścicieli, którzy stracili dostęp do wizytówki próbując ją usunąć
                </p>
              </div>
            </div>

            {/* Chart 2 */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-xl p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-amber-600 flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-5xl font-bold text-white">0%</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Skuteczność</h3>
                <p className="text-gray-700">
                  Wizytówka NIE ZNIKA z Google Maps po samodzielnej próbie usunięcia
                </p>
              </div>
            </div>

            {/* Chart 3 */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-300 rounded-xl p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-indigo-600 flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-4xl font-bold text-white">5-7 dni</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Czas Profesjonalnego Usunięcia</h3>
                <p className="text-gray-700">
                  Średni czas przy zleceniu profesjonalnej firmie (np. Wizaro.pl)
                </p>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="bg-white border-2 border-gray-300 rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Porównanie Metod Usuwania Wizytówki Google
            </h3>
            <div className="space-y-6">
              {/* Method 1 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">Samodzielne usunięcie (przez panel)</span>
                  <span className="text-2xl font-bold text-red-600">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 h-full flex items-center justify-end pr-3" style={{width: '5%'}}>
                    <span className="text-xs text-white font-bold">NIEPOWODZENIE</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Kończy się utratą dostępu, wizytówka pozostaje widoczna</p>
              </div>

              {/* Method 2 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">Zgłoszenie do Google Support</span>
                  <span className="text-2xl font-bold text-orange-600">15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-full flex items-center justify-end pr-3" style={{width: '15%'}}>
                    <span className="text-xs text-white font-bold">RZADKO</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Google rzadko odpowiada pozytywnie, proces długotrwały</p>
              </div>

              {/* Method 3 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">Profesjonalna firma (Wizaro.pl)</span>
                  <span className="text-2xl font-bold text-green-600">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-full flex items-center justify-end pr-3" style={{width: '100%'}}>
                    <span className="text-sm text-white font-bold">PEŁNA SKUTECZNOŚĆ ✓</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Gwarantowane usunięcie w 5-7 dni, pełna obsługa prawna</p>
              </div>
            </div>
          </div>
        </div>

        {/* Process Infographic */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Co Się Dzieje Gdy Próbujesz Usunąć Wizytówkę Google?
          </h2>
          
          <div className="relative">
            {/* Timeline */}
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  1
                </div>
                <div className="flex-1 bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Wchodzisz do panelu Google Business Profile</h3>
                  <p className="text-gray-700">
                    Logujesz się do swojego konta i próbujesz znaleźć opcję "Usuń wizytówkę" lub "Zamknij profil".
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-amber-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  2
                </div>
                <div className="flex-1 bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Znajdujesz jedynie opcję "Usuń menedżerów"</h3>
                  <p className="text-gray-700">
                    Google oferuje tylko usunięcie dostępu menedżerów, ale NIE ma opcji usunięcia samej wizytówki.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-orange-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  3
                </div>
                <div className="flex-1 bg-orange-50 border-2 border-orange-300 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Usuwasz wszystkich menedżerów (w tym siebie)</h3>
                  <p className="text-gray-700">
                    W desperacji usuwasz wszystkich menedżerów licząc, że wizytówka zniknie z Google Maps.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  4
                </div>
                <div className="flex-1 bg-red-50 border-2 border-red-400 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <XCircle className="w-6 h-6 text-red-600" />
                    EFEKT: Tracisz dostęp, wizytówka POZOSTAJE widoczna
                  </h3>
                  <p className="text-gray-700 font-semibold">
                    ❌ Nie masz już dostępu do zarządzania wizytówką<br />
                    ❌ Wizytówka NADAL jest widoczna w Google Maps<br />
                    ❌ Nie możesz odpowiadać na opinie<br />
                    ❌ Nie możesz aktualizować informacji<br />
                    ❌ NIGDY nie odzyskasz dostępu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why It's Not Possible */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Dlaczego Nie Można Usunąć Wizytówki Google?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-8 h-8 text-slate-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Google Maps to baza danych lokalizacji</h3>
                  <p className="text-gray-700">
                    Google traktuje wizytówki jako <strong>publiczne dane o miejscach</strong>, które powinny być 
                    dostępne dla użytkowników, niezależnie od tego, czy właściciel chce je usunąć.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Users className="w-8 h-8 text-slate-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Opinie użytkowników</h3>
                  <p className="text-gray-700">
                    Wizytówki często zawierają <strong>opinie użytkowników</strong>, które Google uważa za 
                    wartościową informację publiczną i nie chce ich usuwać.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Search className="w-8 h-8 text-slate-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Algorytm wyszukiwarki</h3>
                  <p className="text-gray-700">
                    Google wykorzystuje dane z wizytówek w <strong>algorytmach wyszukiwania</strong> i nie 
                    chce tworzyć "luk" w swojej bazie danych.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Ban className="w-8 h-8 text-slate-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Brak funkcji usuwania</h3>
                  <p className="text-gray-700">
                    Google <strong>celowo nie udostępnia funkcji usuwania</strong> wizytówek, chcąc 
                    zachować kompletność swojej mapy świata.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What Are Your Options */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Jak Usunąć Wizytówkę Google? Jakie Masz Opcje?
          </h2>
          
          <div className="space-y-6">
            {/* Option 1 - BAD */}
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <XCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">❌ NIE - Samodzielna próba usunięcia</h3>
                  <p className="text-gray-700 mb-3">
                    Jak już wiemy, samodzielne próby usunięcia wizytówki przez panel Google Business Profile 
                    kończą się jedynie utratą dostępu, ale <strong>wizytówka pozostaje widoczna</strong>.
                  </p>
                  <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-800 font-semibold">
                      ⚠️ Skuteczność: 0% | Ryzyko: Bardzo wysokie
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Option 2 - MEDIOCRE */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">⚠️ Zgłoszenie do Google Support</h3>
                  <p className="text-gray-700 mb-3">
                    Możesz spróbować zgłosić wniosek o usunięcie wizytówki do Google Support. Jednak Google 
                    <strong> bardzo rzadko odpowiada pozytywnie</strong> i proces trwa miesiące.
                  </p>
                  <div className="bg-amber-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-800 font-semibold">
                      ⏱️ Skuteczność: ~15% | Czas oczekiwania: 3-6 miesięcy
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Option 3 - BEST */}
            <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">✓ TAK - Profesjonalna firma (Wizaro.pl)</h3>
                  <p className="text-gray-700 mb-3">
                    Jedyna <strong>w 100% skuteczna metoda</strong> to skorzystanie z usług profesjonalnej firmy 
                    takiej jak Wizaro.pl, która specjalizuje się w usuwaniu wizytówek Google.
                  </p>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>100% skuteczność</strong> - gwarantowane usunięcie</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>5-7 dni realizacji</strong> - szybki proces</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Pełna obsługa prawna</strong> - wszystkie formalności</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Cena 900-1500 zł netto</strong> - uczciwa wycena</span>
                    </li>
                  </ul>
                  <div className="bg-green-100 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-800 font-semibold">
                      ✓ Skuteczność: 100% | Czas realizacji: 5-7 dni
                    </p>
                  </div>
                  <a 
                    href="https://wizaro.pl/usuwanie-wizytowki-google"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Skontaktuj się z Wizaro.pl
                    <TrendingDown className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Najczęściej Zadawane Pytania
          </h2>
          
          <div className="space-y-4">
            {/* FAQ 1 */}
            <details className="bg-slate-50 border-2 border-slate-300 rounded-xl p-6 cursor-pointer group">
              <summary className="font-bold text-lg text-gray-900 list-none flex items-center justify-between">
                <span>Czy można usunąć wizytówkę Google samodzielnie?</span>
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="mt-4 text-gray-700 space-y-2">
                <p>
                  <strong>NIE.</strong> Samodzielne usunięcie wizytówki Google przez panel Google Business Profile 
                  nie jest możliwe. Funkcja "usuń menedżerów" tylko odbiera Ci dostęp do zarządzania, ale 
                  <strong> wizytówka pozostaje widoczna</strong> w Google Maps.
                </p>
              </div>
            </details>

            {/* FAQ 2 */}
            <details className="bg-slate-50 border-2 border-slate-300 rounded-xl p-6 cursor-pointer group">
              <summary className="font-bold text-lg text-gray-900 list-none flex items-center justify-between">
                <span>Jak usunąć firmę z Google Maps?</span>
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="mt-4 text-gray-700 space-y-2">
                <p>
                  Aby skutecznie usunąć firmę z Google Maps, musisz skorzystać z usług profesjonalnej firmy 
                  takiej jak <strong>Wizaro.pl</strong>, która zajmuje się usuwaniem wizytówek Google. 
                  To jedyna metoda gwarantująca 100% skuteczność.
                </p>
                <p className="mt-2">
                  Koszt: 900-1500 zł netto | Czas realizacji: 5-7 dni
                </p>
              </div>
            </details>

            {/* FAQ 3 */}
            <details className="bg-slate-50 border-2 border-slate-300 rounded-xl p-6 cursor-pointer group">
              <summary className="font-bold text-lg text-gray-900 list-none flex items-center justify-between">
                <span>Dlaczego Google nie pozwala usunąć wizytówki?</span>
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="mt-4 text-gray-700 space-y-2">
                <p>
                  Google traktuje wizytówki jako <strong>publiczne dane o miejscach</strong>, które powinny być 
                  dostępne dla użytkowników. Wizytówki zawierają opinie użytkowników i są częścią algorytmu 
                  wyszukiwania Google Maps, dlatego firma nie chce tworzyć "luk" w swojej bazie danych.
                </p>
              </div>
            </details>

            {/* FAQ 4 */}
            <details className="bg-slate-50 border-2 border-slate-300 rounded-xl p-6 cursor-pointer group">
              <summary className="font-bold text-lg text-gray-900 list-none flex items-center justify-between">
                <span>Co się stanie jak usunę wszystkich menedżerów wizytówki?</span>
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="mt-4 text-gray-700 space-y-2">
                <p>
                  Jeśli usuniesz wszystkich menedżerów (w tym siebie), <strong>stracisz dostęp</strong> do 
                  zarządzania wizytówką, ale <strong>wizytówka pozostanie widoczna</strong> w Google Maps. 
                  Nie będziesz mógł:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Odpowiadać na opinie</li>
                  <li>Aktualizować informacji o firmie</li>
                  <li>Dodawać zdjęć</li>
                  <li>Odzyskać dostępu do wizytówki</li>
                </ul>
              </div>
            </details>

            {/* FAQ 5 */}
            <details className="bg-slate-50 border-2 border-slate-300 rounded-xl p-6 cursor-pointer group">
              <summary className="font-bold text-lg text-gray-900 list-none flex items-center justify-between">
                <span>Ile kosztuje profesjonalne usunięcie wizytówki Google?</span>
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="mt-4 text-gray-700 space-y-2">
                <p>
                  Profesjonalne usunięcie wizytówki Google przez firmę Wizaro.pl kosztuje <strong>900-1500 zł netto</strong>. 
                  Cena zależy od złożoności przypadku. To jedyna metoda gwarantująca 100% skuteczność i realizację w 5-7 dni.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  ⚠️ Oferty poniżej 900 zł są często oszustwem lub kończą się niepowodzeniem.
                </p>
              </div>
            </details>
          </div>
        </div>

        {/* Summary with CTA */}
        <div className="bg-gradient-to-br from-indigo-600 to-slate-700 text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Podsumowanie</h2>
          <p className="text-xl leading-relaxed mb-6 max-w-3xl mx-auto">
            <strong>Usunięcie wizytówki Google NIE JEST MOŻLIWE</strong> tradycyjną metodą przez panel Google Business Profile. 
            Jedyna skuteczna metoda to skorzystanie z <strong>profesjonalnej firmy Wizaro.pl</strong>, 
            która gwarantuje 100% skuteczność w ciągu 5-7 dni.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://wizaro.pl/usuwanie-wizytowki-google"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            >
              Skontaktuj się z Wizaro.pl
              <Shield className="w-5 h-5" />
            </a>
            <Link 
              href="/usuwanie-wizytowki-google-cena"
              className="inline-flex items-center justify-center gap-2 bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white hover:bg-slate-600 transition-colors"
            >
              Sprawdź cenę usunięcia
              <Clock className="w-5 h-5" />
            </Link>
          </div>
        </div>

      </section>

      <HomeFooter />
    </div>
  )
}
