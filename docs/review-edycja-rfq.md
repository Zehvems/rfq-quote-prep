# Review bloku: edycja danych RFQ

## Co jest gotowe

Wszystkie istniejące pozycje mają edytowalną nazwę, ilość i specyfikację.
Termin i miejsce dostawy są edytowalne wspólnie dla całego RFQ.
Status oraz lista braków przeliczają się po każdej zmianie.

## `src/app/ExtractButton.tsx`

- Zamiast tekstu: kontrolowane inputy i textarea dla długiej specyfikacji.
- `value` pochodzi ze stanu, a `onChange` aktualizuje stan. Wcześniejsze
  `defaultValue` ustawiało tylko wartość początkową pola, bez aktualizacji danych.
- `updateItem` tworzy nowy obiekt danych i nową tablicę produktów.
  Zmienia tylko produkt o wskazanym indeksie, bez mutowania pozostałych.
- `updateDelivery` aktualizuje wspólny termin lub miejsce dostawy.
- Puste pola zapisują `null`. Dla ilości `null` wyświetla pusty input
  z podpowiedzią „Brak danych”; wpisany tekst jest konwertowany na liczbę.
- Ilości zerowe, ujemne i ułamkowe nadal powodują brak gotowości do przeglądu.
  Samo `min` i `step` nie zastępuje kontroli przez funkcję kompletności.
- `checkRFQCompleteness(data)` działa przy renderowaniu, bez osobnego stanu statusu.
- `useId` łączy etykiety z polami i zapobiega kolizjom między kartami zapytań.
- Status ma polską etykietę i pozostaje tylko do odczytu.
- Poprawki istnieją lokalnie w React. Odświeżenie strony lub ponowna ekstrakcja
  usuwa je; informacja o tym jest widoczna przy formularzu.

## `src/app/uiStyles.ts`

- Osobne sekcje z numerami pozycji oraz wspólnymi warunkami dostawy.
- Widoczne ramki inputów, większe pole specyfikacji i styl aktywnego pola.
- Na małym ekranie jedna kolumna; na większym nazwa i ilość obok siebie.
- Brakujące pola są wyróżnione bursztynowym kolorem i `aria-invalid`.
- Panel statusu zmienia kolor wraz z oceną kompletności.

## `docs/review-edycja-rfq.md`

Ten plik jest raportem zmian i punktem powrotu do nauki.

## Sprawdzenia i granice zakresu

Wykonano lokalne sprawdzenie TypeScript komponentu i importowanych modułów
oraz krótkie sprawdzenia handlerów z podstawionym stanem Reacta:
edycja wszystkich pól, izolacja produktów, czyszczenie ilości, ilości
niepoprawne i przejście między statusami. Nie wykonywano testu w przeglądarce.
Bez nowych plików testowych i bez wywołań OpenAI API.

Schemat Zod, funkcja kompletności, prompt, endpoint i baza pozostały bez zmian.
Nie wykonywano commita ani pusha. Wcześniejszych usunięć plików nie ruszano.

## Następny fragment dla Ciebie

Prześledź `updateItem`: dlaczego potrzebne są kopia obiektu, `map()` i kopia
zmienianego produktu? Kolejny osobny blok może dotyczyć dodawania lub usuwania
pozycji przez człowieka; tej funkcji jeszcze nie ma.
