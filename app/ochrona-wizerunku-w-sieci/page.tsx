import Link from 'next/link'
import { Shield, Trash2, Star, TrendingUp, MessageCircle, Search, CheckCircle } from 'lucide-react'
import { HomeHeader } from '@/components/HomeHeader'
import { HomeFooter } from '@/components/HomeFooter'

export const metadata = {
  title: 'Jak chronić wizerunek firmy w internecie? | OpinieOn',
  description: 'Dowiedz się, jak skutecznie dbać o reputację swojej firmy w sieci. Poznaj sprawdzone metody zarządzania opiniami online, w tym możliwości usuwania negatywnych opinii z Google.',
}

export default function OchronaWizerunkuPage() {
  return (
    <div className="bg-white min-h-screen">
      <HomeHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-50 to-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Jak skutecznie chronić wizerunek firmy w internecie?
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              W erze cyfrowej reputacja online to klucz do sukcesu. Dowiedz się, jak profesjonalnie zarządzać 
              opinią o Twojej firmie w sieci.
            </p>
          </div>
        </div>
      </div>

      {/* Main Article Content */}
      <article className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            W dzisiejszych czasach opinie w internecie mają ogromny wpływ na decyzje zakupowe klientów. 
            Badania pokazują, że <strong>ponad 90% konsumentów czyta opinie online przed podjęciem decyzji o zakupie</strong>. 
            Dlatego profesjonalne zarządzanie reputacją w sieci stało się niezbędnym elementem prowadzenia biznesu.
          </p>

          {/* Section 1: Dlaczego wizerunek online jest ważny */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <Shield className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Dlaczego wizerunek online jest tak istotny?
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Pierwsze wrażenie</strong> – większość klientów poznaje Twoją firmę przez internet, zanim podejmie kontakt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Budowanie zaufania</strong> – pozytywne opinie przekładają się bezpośrednio na wzrost sprzedaży</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Przewaga konkurencyjna</strong> – dobra reputacja wyróżnia Cię na tle konkurencji</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Pozycjonowanie w Google</strong> – opinie wpływają na widoczność Twojej firmy w wyszukiwarce</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Jak zarządzać opinami */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            Skuteczne zarządzanie opiniami online
          </h2>
          
          <p className="text-gray-700 leading-relaxed mb-8">
            Profesjonalne podejście do zarządzania reputacją wymaga systematyczności i odpowiednich narzędzi. 
            Oto sprawdzone metody:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-500 transition-colors">
              <Star className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Monitoring opinii</h3>
              <p className="text-gray-600">
                Regularnie sprawdzaj, co mówią o Twojej firmie w Google, Facebooku i branżowych portalach. 
                Szybka reakcja na komentarze pokazuje profesjonalizm.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-500 transition-colors">
              <MessageCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Odpowiadanie na opinie</h3>
              <p className="text-gray-600">
                Dziękuj za pozytywne komentarze i profesjonalnie odpowiadaj na negatywne. 
                To pokazuje, że zależy Ci na klientach.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-500 transition-colors">
              <TrendingUp className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Zachęcanie do opinii</h3>
              <p className="text-gray-600">
                Proś zadowolonych klientów o zostawienie recenzji. Im więcej pozytywnych opinii, 
                tym mniejszy wpływ ewentualnych negatywnych.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-500 transition-colors">
              <Search className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analiza trendów</h3>
              <p className="text-gray-600">
                Śledź, jakie tematy pojawiają się w opiniach. To cenne źródło informacji 
                o tym, co wymaga poprawy w Twojej firmie.
              </p>
            </div>
          </div>

          {/* Section 3: Usuwanie negatywnych opinii */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 mb-12 border border-red-100">
            <div className="flex items-start gap-4">
              <Trash2 className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Usuwanie opinii z Google – kiedy jest to możliwe?
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Nie każdą negatywną opinię można usunąć, ale istnieją sytuacje, w których Google pozwala 
                  na zgłoszenie i usunięcie nieprawidłowych recenzji:
                </p>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✓</span>
                    <span><strong>Fałszywe opinie</strong> – recenzje od osób, które nigdy nie były klientami</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✓</span>
                    <span><strong>Spam i treści reklamowe</strong> – opinie zawierające linki promocyjne lub spam</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✓</span>
                    <span><strong>Wulgarne treści</strong> – opinie zawierające obraźliwy język lub groźby</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✓</span>
                    <span><strong>Konflikt interesów</strong> – opinie od konkurencji mające na celu zaszkodzenie</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✓</span>
                    <span><strong>Dane osobowe</strong> – opinie zawierające informacje poufne lub prywatne</span>
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Proces usuwania opinii z Google wymaga odpowiedniej procedury i dokumentacji. 
                  Warto skorzystać z pomocy specjalistów, którzy znają się na politykach Google i potrafią 
                  skutecznie zgłosić naruszenie regulaminu.
                </p>
                <div className="text-center">
                  <a
                    href="https://wizaro.pl/usuwanie-opinii-google"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl"
                  >
                    Usuń negatywne opinie z Google →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Profesjonalna pomoc */}
          <div className="bg-green-50 rounded-2xl p-8 mb-12 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Profesjonalna pomoc w ochronie wizerunku
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Jeśli zarządzanie reputacją online przekracza Twoje możliwości czasowe lub wymaga specjalistycznej 
              wiedzy, warto skorzystać z profesjonalnych usług. <strong>Wizaro.pl</strong> oferuje kompleksowe 
              wsparcie w zakresie:
            </p>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Usuwania negatywnych i fałszywych opinii</strong> z Google i innych platform</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Monitoringu reputacji</strong> – ciągłe śledzenie wzmianek o Twojej firmie</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Budowania pozytywnego wizerunku</strong> poprzez strategię content marketingu</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Zarządzania kryzysowego</strong> w sytuacjach zagrożenia reputacji</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Poprawy pozycjonowania</strong> przez optymalizację obecności online</span>
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              Zespół ekspertów Wizaro dysponuje wiedzą i doświadczeniem w skutecznym usuwaniu nieuczciwych opinii, 
              przestrzegając przy tym wszystkich wytycznych platform i przepisów prawnych.
            </p>
            <div className="text-center flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wizaro.pl/usuwanie-opinii-google"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl"
              >
                Usuń opinie z Google →
              </a>
              <a
                href="https://wizaro.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white hover:bg-gray-50 text-green-600 border-2 border-green-600 font-bold px-8 py-4 rounded-full transition-all"
              >
                Zobacz pełną ofertę
              </a>
            </div>
          </div>

          {/* Section 5: Podsumowanie */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            Podsumowanie
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Ochrona wizerunku firmy w internecie to proces ciągły, wymagający systematyczności i uwagi. 
            Kluczowe elementy to:
          </p>
          <ul className="space-y-2 text-gray-700 mb-8 list-disc list-inside">
            <li>Regularne monitorowanie opinii na wszystkich platformach</li>
            <li>Profesjonalne i szybkie odpowiadanie na komentarze</li>
            <li>Aktywne zachęcanie zadowolonych klientów do zostawiania recenzji</li>
            <li>Reagowanie na fałszywe i naruszające regulamin opinie</li>
            <li>Korzystanie z pomocy specjalistów w trudnych sytuacjach</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Pamiętaj, że pozytywna reputacja online to inwestycja w przyszłość Twojej firmy. 
            Im lepiej dbasz o swój wizerunek w sieci, tym większe zaufanie klientów i wyższa sprzedaż.
          </p>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gray-900 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Zadbaj o reputację swojej firmy już dziś
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Dołącz do tysięcy przedsiębiorców, którzy aktywnie zarządzają swoim wizerunkiem online 
            i budują zaufanie klientów.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg"
            >
              Załóż konto w OpinieOn
            </Link>
            <a
              href="https://wizaro.pl/usuwanie-opinii-google"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold px-8 py-4 rounded-full transition-all"
            >
              Usuń negatywne opinie
            </a>
          </div>
        </div>
      </article>

      <HomeFooter />
    </div>
  )
}
