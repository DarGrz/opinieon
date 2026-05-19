import Link from 'next/link'
import { AlertCircle, CheckCircle2, MessageSquare, Trash2, Shield, TrendingUp, Search, FileText } from 'lucide-react'
import { HomeHeader } from '@/components/HomeHeader'
import { HomeFooter } from '@/components/HomeFooter'

export const metadata = {
  title: 'Co robić gdy firma ma złą opinię w internecie? | OpinieOn',
  description: 'Praktyczny przewodnik jak reagować na negatywne opinie i odbudować reputację firmy w sieci. Dowiedz się, jak odpowiadać na złe recenzje i kiedy można je usunąć.',
}

export default function ZlaOpiniaPage() {
  return (
    <div className="bg-white min-h-screen">
      <HomeHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-red-50 to-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full mb-6 font-semibold text-sm">
              <AlertCircle className="w-5 h-5" />
              Zarządzanie kryzysowe
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Co robić, gdy firma ma złą opinię w internecie?
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Negatywna recenzja to nie koniec świata. Dowiedz się, jak profesjonalnie reagować 
              na złe opinie i odbudować reputację swojej firmy.
            </p>
          </div>
        </div>
      </div>

      {/* Main Article Content */}
      <article className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Każdy właściciel firmy prędzej czy później spotka się z negatywną opinią w internecie. 
            To naturalna część prowadzenia biznesu. <strong>Najważniejsze to odpowiednia reakcja</strong> – 
            profesjonalne podejście do krytyki może zamienić niezadowolonego klienta w lojalnego ambasadora 
            marki, podczas gdy zła reakcja pogłębi kryzys.
          </p>

          {/* Section 1: Skala problemu */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 mb-12 border border-red-100">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Jak złe opinie wpływają na Twój biznes?
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Badania pokazują skalę wpływu negatywnych opinii na decyzje zakupowe:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-3xl font-bold text-red-600 mb-2">94%</div>
                    <p className="text-sm text-gray-600">klientów unikało firmy z powodu złych opinii</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-3xl font-bold text-red-600 mb-2">86%</div>
                    <p className="text-sm text-gray-600">konsumentów ma wątpliwości przy ocenie poniżej 3 gwiazdek</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-3xl font-bold text-red-600 mb-2">-22%</div>
                    <p className="text-sm text-gray-600">spadek sprzedaży po jednej negatywnej opinii</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-3xl font-bold text-red-600 mb-2">60%</div>
                    <p className="text-sm text-gray-600">klientów sprawdza opinie przed każdym zakupem</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pierwsze kroki */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            Pierwsze kroki po otrzymaniu złej opinii
          </h2>
          
          <p className="text-gray-700 leading-relaxed mb-8">
            Twoja reakcja w pierwszych godzinach jest kluczowa. Oto sprawdzona procedura:
          </p>

          <div className="space-y-6 mb-12">
            <div className="flex gap-4 bg-gray-50 rounded-xl p-6 border-l-4 border-green-600">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Zachowaj spokój</h3>
                <p className="text-gray-600">
                  Nie odpowiadaj w emocjach. Odczekaj przynajmniej 2 godziny, żeby ochłonąć. 
                  Emocjonalna odpowiedź może zaszkodzić bardziej niż sama negatywna opinia.
                </p>
              </div>
            </div>

            <div className="flex gap-4 bg-gray-50 rounded-xl p-6 border-l-4 border-green-600">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Oceń sytuację obiektywnie</h3>
                <p className="text-gray-600">
                  Czy krytyka jest uzasadniona? Sprawdź fakty, porozmawiaj z zespołem. 
                  Jeśli opinia jest prawdziwa, to sygnał do poprawy procesów.
                </p>
              </div>
            </div>

            <div className="flex gap-4 bg-gray-50 rounded-xl p-6 border-l-4 border-green-600">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sprawdź autentyczność</h3>
                <p className="text-gray-600">
                  Czy autor był rzeczywiście Twoim klientem? Czy data opinii pokrywa się z faktyczną transakcją? 
                  Fałszywe opinie można zgłosić do usunięcia.
                </p>
              </div>
            </div>

            <div className="flex gap-4 bg-gray-50 rounded-xl p-6 border-l-4 border-green-600">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Odpowiedz szybko</h3>
                <p className="text-gray-600">
                  Najlepiej w ciągu 24-48 godzin. Szybka reakcja pokazuje, że zależy Ci na klientach 
                  i traktujesz feedback poważnie.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Jak odpowiadać */}
          <div className="bg-green-50 rounded-2xl p-8 mb-12 border border-green-200">
            <div className="flex items-start gap-4 mb-6">
              <MessageSquare className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Jak profesjonalnie odpowiadać na negatywne opinie?
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div className="bg-white rounded-lg p-4 border-l-4 border-green-600">
                    <strong className="text-green-700">✓ ROB TO:</strong>
                    <ul className="mt-2 space-y-2 list-disc list-inside">
                      <li>Dziękuj za feedback i przeproś za niedogodności</li>
                      <li>Wyjaśnij sytuację spokojnie i rzeczowo</li>
                      <li>Zaproponuj konkretne rozwiązanie</li>
                      <li>Przenieś rozmowę do kontaktu prywatnego (email/telefon)</li>
                      <li>Pokaż, że wyciągasz wnioski i wprowadzasz zmiany</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-red-600">
                    <strong className="text-red-700">✗ NIE RÓB TEGO:</strong>
                    <ul className="mt-2 space-y-2 list-disc list-inside">
                      <li>Nie atakuj klienta ani nie kwestionuj jego uczuć</li>
                      <li>Nie podawaj wymówek ani nie zrzucaj winy na innych</li>
                      <li>Nie ignoruj opinii w nadziei, że "sama przejdzie"</li>
                      <li>Nie używaj szablonowych, bezosobowych odpowiedzi</li>
                      <li>Nie wdawaj się w długie publiczne dyskusje</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Przykład dobrej odpowiedzi */}
            <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
              <div className="text-sm font-semibold text-gray-500 mb-3">PRZYKŁAD DOBREJ ODPOWIEDZI:</div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  "Dzień dobry Panie Janie,<br/><br/>
                  Dziękujemy za podzielenie się opinią. Bardzo przepraszamy za sytuację, która miała miejsce. 
                  Rozumiem Pana frustrację - sam bym się tak czuł w podobnej sytuacji.<br/><br/>
                  Sprawdziliśmy szczegóły zamówienia. Rzeczywiście opóźnienie wynikło z problemu 
                  z naszym dostawcą, co nie powinno mieć wpływu na Pana jako klienta. To nasza odpowiedzialność.<br/><br/>
                  Chciałbym osobiście załatwić tę sprawę. Proszę o kontakt na [email] lub [telefon], 
                  zaproponuję rekompensatę i zapewnię, że taka sytuacja się nie powtórzy.<br/><br/>
                  Z wyrazami szacunku,<br/>
                  Jan Kowalski, Właściciel"
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Kiedy można usunąć opinię */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 border border-blue-200">
            <div className="flex items-start gap-4">
              <Trash2 className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Kiedy warto usunąć negatywną opinię?
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Nie każda zła opinia powinna pozostać w sieci. W określonych sytuacjach możesz 
                  skutecznie zgłosić recenzję do usunięcia:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900">Fałszywa opinia</strong>
                        <p className="text-sm text-gray-600 mt-1">Od osoby, która nigdy nie była Twoim klientem</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900">Opinia od konkurencji</strong>
                        <p className="text-sm text-gray-600 mt-1">Celowe działanie mające zaszkodzić firmie</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900">Treści obraźliwe</strong>
                        <p className="text-sm text-gray-600 mt-1">Wulgaryzmy, groźby lub nieetyczne treści</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900">Spam i reklama</strong>
                        <p className="text-sm text-gray-600 mt-1">Linki promocyjne lub treści niezwiązane z firmą</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900">Dane osobowe</strong>
                        <p className="text-sm text-gray-600 mt-1">Opinie zawierające prywatne informacje</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900">Manipulacja</strong>
                        <p className="text-sm text-gray-600 mt-1">Próby wymuszenia korzyści lub szantaż</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-100 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-900">
                    <strong>Uwaga:</strong> Proces usuwania opinii z Google, Facebook czy innych platform wymaga 
                    znajomości procedur i odpowiedniej dokumentacji. Samodzielne zgłoszenia są często odrzucane.
                  </p>
                </div>
                <div className="text-center">
                  <a
                    href="https://wizaro.pl/usuwanie-opinii-google"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl"
                  >
                    Profesjonalne usuwanie opinii →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Budowanie pozytywnej reputacji */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            Budowanie pozytywnej reputacji po kryzysie
          </h2>
          
          <p className="text-gray-700 leading-relaxed mb-8">
            Najlepszym sposobem na zneutralizowanie negatywnej opinii jest zbudowanie przewagi pozytywnych recenzji:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-500 transition-colors">
              <TrendingUp className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Proś o opinie</h3>
              <p className="text-gray-600">
                Systematycznie zachęcaj zadowolonych klientów do zostawiania opinii. 
                Wysyłaj automatyczne przypomnienia po zakupie z bezpośrednim linkiem.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-500 transition-colors">
              <Shield className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Popraw obsługę</h3>
              <p className="text-gray-600">
                Wprowadź zmiany na podstawie feedbacku. Pokaż klientom, że ich opinie 
                mają realny wpływ na jakość Twoich usług.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-500 transition-colors">
              <Search className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Monitoruj regularnie</h3>
              <p className="text-gray-600">
                Codziennie sprawdzaj nowe opinie na Google, Facebooku i branżowych portalach. 
                Szybka reakcja buduje zaufanie.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-500 transition-colors">
              <FileText className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Twórz case studies</h3>
              <p className="text-gray-600">
                Publikuj historie zadowolonych klientów na stronie i w social media. 
                Pozytywne przykłady równoważą negatywne doświadczenia.
              </p>
            </div>
          </div>

          {/* Section 6: Pomoc specjalisty */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 mb-12 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Kiedy potrzebna jest pomoc specjalisty?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Niektóre sytuacje wymagają profesjonalnego wsparcia. Warto skorzystać z pomocy ekspertów gdy:
            </p>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Masz wiele negatywnych opinii, które drastycznie wpływają na sprzedaż</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Podejrzewasz zorganizowaną kampanię ze strony konkurencji</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Próby samodzielnego usunięcia fałszywych opinii były bezskuteczne</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Negatywna opinia pojawia się wysoko w wynikach wyszukiwania Google</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Potrzebujesz kompleksowej strategii odbudowy reputacji online</span>
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Wizaro.pl</strong> specjalizuje się w zarządzaniu reputacją online i skutecznym 
              usuwaniu nieuczciwych opinii. Zespół ekspertów zna procedury wszystkich głównych platform 
              i potrafi efektywnie negocjować usunięcie naruszających regulamin treści.
            </p>
            <div className="text-center flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wizaro.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl"
              >
                Skonsultuj swoją sytuację
              </a>
              <a
                href="https://wizaro.pl/usuwanie-opinii-google"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white hover:bg-gray-50 text-green-600 border-2 border-green-600 font-bold px-8 py-4 rounded-full transition-all"
              >
                Usuń negatywne opinie
              </a>
            </div>
          </div>

          {/* Section 7: Podsumowanie */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
            Podsumowanie
          </h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              Zła opinia w internecie to nie katastrofa, jeśli odpowiednio zareagujesz:
            </p>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li><strong>Zachowaj spokój</strong> i oceń sytuację obiektywnie</li>
              <li><strong>Odpowiedz szybko</strong> (24-48h) i profesjonalnie</li>
              <li><strong>Zaproponuj rozwiązanie</strong> i przenieś rozmowę do kontaktu prywatnego</li>
              <li><strong>Wyciągnij wnioski</strong> i wprowadź ulepszenia</li>
              <li><strong>Zbieraj pozytywne opinie</strong> od zadowolonych klientów</li>
              <li><strong>Usuń fałszywe i naruszające regulamin</strong> opinie</li>
              <li><strong>Skorzystaj z pomocy ekspertów</strong> w trudnych przypadkach</li>
            </ol>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Pamiętaj: sposób w jaki reagujesz na krytykę często mówi o Twojej firmie więcej niż sama 
            negatywna opinia. Profesjonalne podejście może przekształcić kryzys w szansę na pokazanie 
            troski o klienta i budowanie zaufania.
          </p>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gray-900 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Potrzebujesz pomocy z negatywnymi opiniami?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Nie pozwól, by złe opinie niszczyły reputację Twojej firmy. 
            Profesjonalne wsparcie w odbudowie wizerunku online jest na wyciągnięcie ręki.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg"
            >
              Załóż konto w OpinieOn
            </Link>
            <a
              href="https://wizaro.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold px-8 py-4 rounded-full transition-all"
            >
              Pomoc eksperta Wizaro
            </a>
          </div>
        </div>
      </article>

      <HomeFooter />
    </div>
  )
}
