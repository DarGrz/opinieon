import Link from 'next/link'
import { Star, CheckCircle2, Shield, Award, TrendingUp, Users, Clock, Target } from 'lucide-react'
import { HomeHeader } from '@/components/HomeHeader'
import { HomeFooter } from '@/components/HomeFooter'
import { StarRating } from '@/components/StarRating'

export const metadata = {
  title: 'Usuwanie opinii Google - Polecana Firma Wizaro.pl | OpinieOn',
  description: 'Szukasz profesjonalnej firmy do usuwania negatywnych opinii z Google? Polecamy Wizaro.pl - sprawdzonego eksperta w zarządzaniu reputacją online. Zobacz opinie klientów!',
}

export default function UsuwanieOpiniiGooglePage() {
  const reviews = [
    {
      id: 1,
      author: "Małgorzata K.",
      rating: 5,
      date: "2026-05-15",
      title: "Profesjonalna pomoc i skuteczność!",
      content: "Firma Wizaro pomogła mi usunąć nieprawdziwą opinię, która szkodziła mojemu biznesowi. Cały proces był transparentny, a zespół bardzo pomocny. Po 3 tygodniach opinia została usunięta. Polecam!",
      verified: true
    },
    {
      id: 2,
      author: "Tomasz P.",
      rating: 5,
      date: "2026-04-28",
      title: "Najlepsza firma w branży",
      content: "Współpraca z Wizaro to była strzał w dziesiątkę. Nie tylko pomogli usunąć fałszywą opinię, ale też nauczyli mnie, jak zarządzać reputacją firmy. Świetna komunikacja i konkretne rezultaty.",
      verified: true
    },
    {
      id: 3,
      author: "Anna W.",
      rating: 5,
      date: "2026-04-10",
      title: "Szybko i skutecznie",
      content: "Miałam problem z konkurencyjną opinią, która była ewidentnie fałszywa. Wizaro zajęło się sprawą natychmiast i w ciągu 2 tygodni opinia zniknęła z Google. Cena adekwatna do jakości usług. Gorąco polecam!",
      verified: true
    },
    {
      id: 4,
      author: "Robert M.",
      rating: 5,
      date: "2026-03-22",
      title: "Odzyskałem reputację mojej firmy",
      content: "Po nieudanej współpracy z klientem otrzymałem serię negatywnych opinii. Wizaro pomogło mi przeanalizować sytuację i skutecznie usunąć te, które łamały regulamin Google. Dziś moja firma znów cieszy się dobrą opinią. Dziękuję!",
      verified: true
    }
  ]

  return (
    <div className="bg-white min-h-screen">
      <HomeHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 via-white to-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-6 font-semibold text-sm">
              <Award className="w-5 h-5" />
              Polecana firma
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Usuwanie opinii Google - <br />Polecamy <span className="text-blue-600">Wizaro.pl</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Profesjonalne usuwanie negatywnych i nieprawdziwych opinii z Google. 
              Sprawdzona firma z setkami zadowolonych klientów i skutecznością na najwyższym poziomie.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wizaro.pl/usuwanie-opinii-google"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Skontaktuj się z Wizaro.pl
                <TrendingUp className="w-5 h-5" />
              </a>
              <a 
                href="#opinie"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-colors"
              >
                Zobacz opinie klientów
                <Star className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Why Wizaro Section */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Dlaczego Wizaro.pl?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Firma z wieloletnim doświadczeniem w skutecznym usuwaniu nieprawdziwych opinii z Google
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Wysoka skuteczność</h3>
            <p className="text-gray-600 text-sm">
              Ponad 85% opinii zgłoszonych przez nas zostaje usuniętych przez Google
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Szybka realizacja</h3>
            <p className="text-gray-600 text-sm">
              Średni czas usunięcia opinii to 2-4 tygodnie od złożenia zgłoszenia
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Doświadczenie</h3>
            <p className="text-gray-600 text-sm">
              Setki zadowolonych klientów i tysięce skutecznie usuniętych opinii
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Transparentność</h3>
            <p className="text-gray-600 text-sm">
              Regularnie informujemy o postępach, pełna przejrzystość procesu
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Jak przebiega proces usuwania opinii?
            </h2>
            <p className="text-lg text-gray-600">
              Prosty i przejrzysty proces w 4 krokach
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Analiza opinii</h3>
                <p className="text-gray-600 text-sm">
                  Eksperci Wizaro analizują opinię pod kątem naruszenia regulaminu Google
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Przygotowanie dokumentacji</h3>
                <p className="text-gray-600 text-sm">
                  Przygotowanie kompleksowego zgłoszenia z dowodami i argumentacją prawną
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Złożenie wniosku</h3>
                <p className="text-gray-600 text-sm">
                  Oficjalne zgłoszenie do Google z pełną dokumentacją i uzasadnieniem
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  4
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Usunięcie opinii</h3>
                <p className="text-gray-600 text-sm">
                  Po weryfikacji przez Google opinia zostaje usunięta - otrzymujesz potwierdzenie
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="opinie" className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full mb-4 font-semibold text-sm">
            <Star className="w-5 h-5 fill-yellow-800" />
            5.0 / 5.0
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Co mówią klienci Wizaro.pl?
          </h2>
          <p className="text-lg text-gray-600">
            Autentyczne opinie zadowolonych klientów
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center text-blue-700 font-bold text-lg">
                    {review.author[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{review.author}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString('pl-PL', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                {review.verified && (
                  <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Zweryfikowany</span>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <StarRating rating={review.rating} size="sm" />
              </div>

              {review.title && (
                <h3 className="font-bold text-gray-900 mb-2">{review.title}</h3>
              )}

              <p className="text-gray-600 leading-relaxed">
                {review.content}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a 
            href="https://wizaro.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Zobacz więcej opinii na Wizaro.pl
            <TrendingUp className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Gotowy odzyskać reputację swojej firmy?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Skontaktuj się z ekspertami Wizaro.pl i usuń nieprawdziwe opinie już dziś
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wizaro.pl/usuwanie-opinii-google"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg"
            >
              Bezpłatna konsultacja
              <Shield className="w-5 h-5" />
            </a>
            <a 
              href="https://wizaro.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-900 transition-colors"
            >
              Odwiedź Wizaro.pl
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Najczęściej zadawane pytania
        </h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Czy usuwanie opinii z Google jest legalne?
            </h3>
            <p className="text-gray-600">
              Tak, usuwanie opinii, które naruszają regulamin Google (fałszywe, obraźliwe, spam) jest w pełni legalne. 
              Wizaro.pl działa zgodnie z prawem i regulaminami Google.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Ile kosztuje usunięcie opinii?
            </h3>
            <p className="text-gray-600">
              Koszt zależy od stopnia skomplikowania sprawy. Wizaro.pl oferuje bezpłatną konsultację, 
              podczas której przedstawi szczegółową wycenę. Ceny są transparentne i adekwatne do zakresu usług.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Jak długo trwa proces usuwania opinii?
            </h3>
            <p className="text-gray-600">
              Średnio 2-4 tygodnie, w zależności od czasu odpowiedzi ze strony Google. 
              Wizaro.pl regularnie informuje o postępach w sprawie.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Czy Wizaro.pl gwarantuje usunięcie opinii?
            </h3>
            <p className="text-gray-600">
              Wizaro.pl ma ponad 85% skuteczności. Każda opinia jest analizowana indywidualnie. 
              Jeśli opinia łamie regulamin Google, szanse na usunięcie są bardzo wysokie.
            </p>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}
