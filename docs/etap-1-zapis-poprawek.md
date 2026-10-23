# Etap 1 — „Zapisz poprawki”: Twoja część implementacji

## Przygotowany szkielet

- `src/app/ReviewSavePanel.tsx` — gotowy JSX, przycisk, informacja o szkicu,
  wygląd zapisywania, sukcesu i błędu. Komponent przyjmuje `state` i `onSave`.
- `ReviewSaveState` — typ stanu: `idle`, `saving`, `success` lub `error` z `message`.
- `src/app/ExtractButton.tsx` — panel pod polami edycji i miejsca oznaczone
  `TODO(etap-1)`. Komponent otrzymuje już `inquiryId`.
- `src/app/page.tsx` — przekazuje identyfikator właściwego zapytania.
- `src/app/uiStyles.ts` — style panelu w `reviewSaveStyles`.

Przycisk jest nieaktywny, dopóki nie przekażesz `onSave`. Nie ma nowego endpointu,
zapisu do bazy ani symulowanego sukcesu. Dotychczasowa ekstrakcja i edycja nadal
działają. Ten fragment obejmuje wyłącznie etap 1.

## 1. Dodaj miejsce w bazie

Plik: `prisma/schema.prisma`, model `Inquiry`.

Dodaj opcjonalne pole JSON o nazwie `reviewData` i typie `Json?`.
Brak wartości oznacza, że to zapytanie nie ma jeszcze zapisanego review.
W środku przechowuj sam obiekt zgodny z `RFQData`, bez dodatkowego opakowania.

Następnie samodzielnie wykonaj migrację i wygeneruj klienta:

```powershell
npx prisma migrate dev --name add_inquiry_review_data
npx prisma generate
```

Zapis szkicu nie ma ustawiać `APPROVED`. W tym etapie pozostaw `Inquiry.status`
bez zmian — kompletność jest już obliczana z danych przez istniejącą funkcję.

## 2. Napisz endpoint zapisu

Utwórz plik: `src/app/api/inquiries/[id]/review/route.ts`.

Proponowany kontrakt:

| Element | Ustalenie |
| --- | --- |
| Metoda i adres | `PATCH /api/inquiries/{id}/review` |
| Body | `{ data: RFQData }` |
| Sukces, HTTP 200 | `{ ok: true, data: RFQData }` |
| Błąd | `{ ok: false, error: string }` |

Do napisania wewnątrz handlera `PATCH`:

1. Odczytaj `id` z parametrów ścieżki. W używanym Next.js `params` jest Promise,
   więc najpierw poczekaj na jego wynik.
2. Odczytaj body jako `unknown`. Niepoprawny JSON zwróć jako HTTP 400.
3. Sprawdź, czy body jest obiektem i zawiera `data`.
4. Zweryfikuj `data` przez istniejący `rfqSchema.safeParse` z `src/lib/rfq/schema.ts`.
5. Jeśli walidacja nie przeszła, zwróć HTTP 400 z czytelną wiadomością.
6. Zaktualizuj `reviewData` w rekordzie `Inquiry` wskazanym przez `id`.
   Zapisuj wynik parsowania Zod, a nie surowe body.
7. Obsłuż brak rekordu jako HTTP 404; przy `prisma.inquiry.update` taki przypadek
   rozpoznasz po błędzie Prisma `P2025`.
8. Zwróć HTTP 200 dopiero po zakończonym zapisie. Awarię bazy obsłuż jako HTTP 500
   z wiadomością dla użytkownika; szczegóły techniczne zostaw w logu serwera.

**Rozdziel poprawny format od kompletności.** Obecny schemat wymaga całej struktury
obiektu, ale pozwala na `null` w polach, a także na pustą tablicę `items`.
Taki szkic można zapisać. `checkRFQCompleteness` nie może blokować zapisu.
Nie potrzebujesz `.partial()` ani zmiany schematu Zod.

Ilość nadal musi być liczbą całkowitą albo `null`. Ułamek jest błędem formatu;
brak ilości wyrażony przez `null` jest poprawnym szkicem. Wartości całkowite
takie jak `0` przechodzą obecny Zod, ale są oznaczane przez kompletność jako
wymagające poprawy — nie dodawaj tu wymogu gotowości do przeglądu.

## 3. Napisz obsługę w komponencie

Plik: `src/app/ExtractButton.tsx`.

Zaimportuj typ `ReviewSaveState` z `ReviewSavePanel.tsx`, a następnie:

1. Dodaj stan `saveState`, początkowo `{ status: 'idle' }`.
2. Napisz `async function handleSaveReview()`.
3. Zakończ handler bez żądania, jeśli nie ma `data` albo zapis już trwa.
4. Ustaw stan `saving` i wyślij `PATCH` pod adres z aktualnym `inquiryId`.
   Body ma zawierać bieżące `data` z edycji; ustaw nagłówek JSON.
5. Sprawdź `response.ok`. Błąd HTTP nie trafia automatycznie do `catch`.
6. Przy błędzie serwera odczytaj jego `error`; gdy odpowiedź nie jest JSON-em,
   użyj własnego komunikatu. Błąd sieci także ma dać stan `error` z `message`.
7. Ustaw `success` wyłącznie po potwierdzeniu udanego zapisu.
8. Przekaż do istniejącego panelu `state={saveState}` oraz `onSave={handleSaveReview}`.

Panel sam dobierze komunikaty, spinner i blokadę przycisku podczas zapisu.
Nie przekazujesz do niego kompletności: brakujące pola nie wyłączają zapisu.
Osobny stan zapisu pozwala zachować dotychczasowy błąd ekstrakcji niezależnie.

Zadbaj też o dwa szczegóły:

- Po kolejnej edycji w `updateItem` albo `updateDelivery` oraz po rozpoczęciu
  nowej ekstrakcji wróć ze stanem zapisu do `idle`. Sukces nie może opisywać
  nowszych, niezapisanych poprawek.
- Na czas zapisu najprościej zablokuj pola edycji oraz ponowną ekstrakcję.
  Inaczej użytkownik może zmienić dane w trakcie żądania, a komunikat sukcesu
  dotyczyć starszej wersji. Blokadę zdejmuj po sukcesie i po błędzie.

Nie czyść edytowanych danych po błędzie. Użytkownik ma móc spróbować ponownie.
Nie zeruj bezwarunkowo stanu do `idle` w `finally`, bo ukryjesz sukces lub błąd.

Po podłączeniu prawdziwego zapisu popraw obecną informację nad formularzem,
która mówi, że wszystkie poprawki są lokalne. Np.: „Porównaj pola z oryginalnym
RFQ. Niezapisane poprawki znikną po odświeżeniu strony lub ponownej ekstrakcji”.
Na razie dotychczasowy komunikat jest zgodny z działaniem szkieletu.

## 4. Sprawdź ręcznie

- Zmień specyfikację w jednym z dwóch różnych zapytań i zapisz. W bazie zmienia
  się `reviewData` wyłącznie przy właściwym `id`.
- Wyczyść termin lub ilość. Nadal da się zapisać szkic z `null`, mimo komunikatu
  „Wymaga uzupełnienia”.
- Wyślij do endpointu błędną strukturę albo ilość będącą tekstem. Oczekuj HTTP 400
  i braku zmiany zapisanych danych.
- Wyślij poprawne body pod nieistniejący identyfikator. Oczekuj HTTP 404.
- Sprawdź sukces, błąd sieci i ponowienie po błędzie. Dane w polach mają pozostać.
- Po udanym zapisie zmień jeszcze jedno pole. Poprzedni komunikat sukcesu znika.
- Sprawdź, że zapis nie zmienia statusu na `APPROVED`.

Gotowe, gdy poprawki są w bazie przy właściwym zapytaniu, niekompletny szkic
można zapisać, a UI pokazuje prawdziwy sukces lub czytelny błąd.
Trwałość w tym etapie sprawdź w bazie, np. przez `npx prisma studio`.

**NEXT:** zacznij od pola `reviewData` i migracji, potem napisz endpoint,
a na końcu podłącz `handleSaveReview` do przygotowanego panelu.
