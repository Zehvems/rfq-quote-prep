# Scenariusz prezentacji demo (60–90 sekund)

Ten dokument zawiera gotowy scenariusz demonstracji na żywo dla rekrutera lub potencjalnego klienta, pokazujący realną wartość biznesową i architekturę aplikacji: **AI proponuje dane ze swobodnego maila, człowiek je weryfikuje, a reguły domenowe gwarantują kompletność przed wyceną**.

---

## 1. Przebieg prezentacji krok po kroku

### [0:00 – 0:15] Wprowadzenie i kontekst biznesowy
- **Co pokazać na ekranie:** Otwarta strona główna aplikacji z listą zapytań i podsumowaniem procesu na górze (pasek metryk: *Ekstrakcja AI → Przegląd człowieka → Decyzja*).
- **Co powiedzieć:**
  > „Aplikacja rozwiązuje problem firm B2B, które otrzymują zapytania ofertowe w formie chaotycznych wiadomości e-mail. Zamiast ręcznie przepisywać pozycje do Excela czy CRM, system wykorzystuje AI ze Structured Outputs do wyodrębnienia pozycji i parametrów, ale zachowuje człowieka w pętli decyzyjnej przed skierowaniem RFQ do wyceny.”

### [0:15 – 0:45] Scenariusz 1: Zapytanie niekompletne (detekcja braków i blokada)
- **Co kliknąć:**
  1. W formularzu po prawej stronie kliknij przycisk **„Przykład: z brakami”** (wklei się treść zapytania z brakującą ilością lub lokalizacją).
  2. Kliknij **„Dodaj zapytanie”** (zapytanie pojawi się na liście ze statusem `RECEIVED`).
  3. Rozwiń nowo dodane zapytanie i kliknij **„Wyodrębnij dane”** (Krok 1).
- **Co powiedzieć:**
  > „Wklejamy zapytanie, w którym klient podał parametry techniczne i termin, ale pominął ilość lub adres dostawy. Model OpenAI analizuje tekst i zamiast zgadywać brakujące dane (np. dopisywać domyślną 1 sztukę), wstawia `null`. Silnik reguł biznesowych natychmiast wykrywa brak i oznacza pole na żółto. Proszę zwrócić uwagę: przycisk »Zatwierdź do wyceny« jest nieaktywny, a walidacja jest wymuszana również po stronie serwera (kod HTTP 422).”
- **Działanie w UI:**
  - Kliknij **„Oznacz: wymaga uzupełnienia”** (Krok 3). Status zmienia się na `NEEDS_INFO` — handlowiec wie, że należy dopytać klienta.

### [0:45 – 1:15] Scenariusz 2: Zapytanie kompletne i zatwierdzenie
- **Co kliknąć:**
  1. W formularzu kliknij **„Przykład: kompletne”** i kliknij **„Dodaj zapytanie”**.
  2. Rozwiń zapytanie i kliknij **„Wyodrębnij dane”**.
  3. Pokaż wyodrębnioną tabelę pozycji: produkt, ilość, specyfikację, termin i miejsce dostawy.
  4. (Opcjonalnie) Zmień jedno pole w specyfikacji i kliknij **„Zapisz poprawki”** (Krok 2).
  5. Kliknij **„Zatwierdź do wyceny”** (Krok 3).
- **Co powiedzieć:**
  > „W przypadku kompletnego zapytania model wyciąga wszystkie pozycje, termin i adres. Po lewej stronie użytkownik ma zawsze podgląd oryginalnej wiadomości, by w 5 sekund porównać dane. Użytkownik może nanieść korekty i zapisać szkic — dane AI i dane człowieka trafiają do osobnych pól w bazie, więc ponowna ekstrakcja niczego nie nadpisze. Gdy wszystkie wymagane pola są wypełnione, przycisk zatwierdzenia staje się aktywny. Klikam »Zatwierdź do wyceny«, a status przechodzi w `APPROVED`.”

### [1:15 – 1:30] Podsumowanie techniczne
- **Co powiedzieć:**
  > „Projekt powstał w oparciu o Next.js App Router, TypeScript, PostgreSQL na Neon z adapterem połączeń, Zod oraz OpenAI Responses API. Całość jest w pełni dostępna z klawiatury i gotowa pod kątem integracji z dalszymi systemami wycen.”

---

## 2. Pytania od klienta / rekrutera i uczciwe odpowiedzi

### Pytanie 1: Co się dzieje, gdy OpenAI zwróci błąd, ma awarię lub odpowiedź trwa zbyt długo?
**Odpowiedź na podstawie kodu (`src/lib/rfq/extract.ts`):**
> „Aplikacja ma ustawiony sztywny timeout 20 sekund (`AbortSignal.timeout(20_000)`). Jeśli OpenAI nie odpowie w tym czasie, zapytanie jest przerywane z błędem HTTP 504 i czytelnym komunikatem w UI. Obsługujemy jawnie kody błędów OpenAI: 401 (problem z kluczem), 429 (przekroczenie limitów), odmowę modelu (`refusal` traktowane jako 422) oraz sytuację, gdy odpowiedź nie pasuje do schematu JSON (502). Co najważniejsze: w przypadku błędu AI surowa treść RFQ pozostaje bezpiecznie zapisana w bazie (`Inquiry.rawText`), więc użytkownik niczego nie traci i może ponowić ekstrakcję lub przepisać dane ręcznie.”

### Pytanie 2: Dlaczego to człowiek musi zatwierdzać zapytanie, zamiast w pełni zautomatyzować proces?
**Odpowiedź na podstawie architektury:**
> „W zapytaniach technicznych i przetargach B2B błąd w ilości lub specyfikacji materiałowej może kosztować firmę dziesiątki tysięcy złotych przy ofertowaniu. Zgodność odpowiedzi modelu ze schematem Zod gwarantuje jedynie poprawny format danych (typy), ale nie gwarantuje prawdy materialnej. Rolą AI jest zaoszczędzenie 90% czasu na rutynowym parsowaniu i przepisywaniu tekstu, a rolą człowieka — odpowiedzialna weryfikacja biznesowa. Dopiero zatwierdzenie `APPROVED` przez człowieka kwalifikuje zapytanie do etapu kalkulacji kosztów.”

### Pytanie 3: Gdzie dokładnie leży granica odpowiedzialności modelu AI, a gdzie kodu aplikacji?
**Odpowiedź na podstawie podziału odpowiedzialności:**
> „Model AI odpowiada wyłącznie za ekstrakcję semantyczną: mapuje nieustrukturyzowany tekst na strukturę zdefiniowaną schematem `rfqSchema` i decyduje, które informacje są pewne, a które niejednoznaczne (zwracając `null`). 
> Cała reszta logiki to deterministyczny kod TypeScript:
> 1. Walidacja formatu przed zapisem do bazy (`rfqSchema.safeParse`),
> 2. Reguły kompletności biznesowej (`checkRFQCompleteness` — sprawdzające m.in. czy ilości są dodatnimi liczbami całkowitymi),
> 3. Blokada zatwierdzenia po stronie serwera (`/api/inquiries/[id]/decision` zwraca 422 przy próbie zatwierdzenia braków).
> Model AI nie podejmuje żadnych decyzji biznesowych ani nie zmienia statusów w bazie danych.”
