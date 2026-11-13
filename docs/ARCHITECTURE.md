# Architektura RFQ Quote Prep

Dokument opisuje rzeczywistą architekturę techniczną aplikacji na podstawie kodu źródłowego (`src/`, `prisma/`).

## 1. Diagram przepływu danych

```mermaid
flowchart TD
    subgraph Browser ["Przeglądarka (Klient)"]
        UI_Home["Strona główna (SSR + Hydratacja)"]
        UI_Form["Formularz nowego RFQ"]
        UI_Extract["Panel 3 kroków (Ekstrakcja -> Przegląd -> Decyzja)"]
    end

    subgraph NextServer ["Next.js App Router (Serwer)"]
        Page["src/app/page.tsx (Server Component)"]
        API_Inq["API: /api/inquiries (GET, POST)"]
        API_Ext["API: /api/extract (POST)"]
        API_Rev["API: /api/extract/[id]/review (PATCH)"]
        API_Dec["API: /api/inquiries/[id]/decision (PATCH)"]
        Domain["src/lib/rfq (schema, completeness, extract)"]
    end

    subgraph External ["Usługi zewnętrzne"]
        NeonDB[("Neon PostgreSQL<br/>(Prisma Client + Adapter Pg)")]
        OpenAI["OpenAI Responses API<br/>(Model: gpt-6-luna)"]
    end

    UI_Home -->|Renderowanie strony| Page
    Page -->|Odczyt zapytań (findMany)| NeonDB

    UI_Form -->|POST /api/inquiries| API_Inq
    API_Inq -->|Zapis zapytania (create)| NeonDB

    UI_Extract -->|1. Krok: POST /api/extract| API_Ext
    API_Ext -->|Wywołanie modelu z rfqSchema| OpenAI
    API_Ext -->|Zapis extractionData i status EXTRACTED| NeonDB

    UI_Extract -->|2. Krok: PATCH /api/extract/[id]/review| API_Rev
    API_Rev -->|Walidacja rfqSchema i zapis reviewData| NeonDB

    UI_Extract -->|3. Krok: PATCH /api/inquiries/[id]/decision| API_Dec
    API_Dec -->|Walidacja reguł kompletności checkRFQCompleteness| Domain
    API_Dec -->|Aktualizacja statusu APPROVED / NEEDS_INFO| NeonDB
```

---

## 2. Opis warstw aplikacji

### `src/app` (Warstwa Prezentacji — React Server & Client Components)
- **`page.tsx`**: Główna strona aplikacji działająca jako Server Component (`dynamic = 'force-dynamic'`). Odpytuje bezpośrednio bazę danych za pomocą instancji `prisma` (brak narzutu wewnętrznego fetch HTTP, brak konieczności konfiguracji `APP_URL`), wylicza metryki paska procesu (`total`, `waiting`, `extracted`, `needsInfo`, `toReview`, `approved`) i renderuje podsumowanie oraz listę kart zapytań.
- **`newInqForm.tsx`**: Interaktywny formularz dodawania zapytania z licznikiem znaków (maks. 8000), wklejaniem gotowych próbek („kompletne”, „z brakami”) oraz obsługą stanów walidacji.
- **`InquiryCard.tsx`**: Zwijana karta zapytania w liście (akordeon). Prezentuje nazwę klienta, datę, fragment treści, plakietkę statusu (`StatusBadge`) i wskaźnik procesu (`Pipeline`). Po rozwinięciu dzieli widok na oryginalną treść po lewej stronie oraz panel 3 kroków po prawej.
- **`ExtractButton.tsx`**: Kluczowy komponent zarządzający stanem 3-krokowego przepływu:
  1. *Ekstrakcja AI* (`POST /api/extract`),
  2. *Przegląd człowieka* (dynamiczna edycja pozycji i warunków dostawy, kalkulacja braków na żywo, zapis szkicu przez `ReviewSavePanel`),
  3. *Decyzja* (`ReviewDecisionPanel` blokujący zatwierdzenie w przypadku braków).
- **`uiStyles.ts`**: Skonsolidowany moduł ze statycznymi nazwami klas Tailwind CSS (zapobiega dynamicznemu generowaniu klas, gwarantując ich detekcję przez kompilator).

### `src/app/api` (Warstwa HTTP API)
Handlery API Next.js obsługujące komunikację z klientem i bazą danych. Wszystkie mutacje danych podlegają walidacji schematem Zod oraz limitom wielkości żądania (8000 znaków tekstu wejściowego).

### `src/lib/rfq` oraz `src/lib/prisma.ts` (Warstwa Logiki Domenowej i Infrastruktury)
- **`schema.ts`**: Definicja schematu `rfqSchema` w bibliotece Zod (`items`: `productType`, `quantity`, `specification` oraz globalne `deadline`, `deliveryLocation`).
- **`completeness.ts`**: Deterministyczna funkcja `checkRFQCompleteness()` weryfikująca kompletność pól RFQ. Nie używa AI — bada wymagane pola tekstowe i dodatnie całkowite wartości liczbowe ilości.
- **`extract.ts`**: Integracja z OpenAI Responses API (`gpt-6-luna`), wykorzystująca format JSON Schema generowany automatycznie z `rfqSchema` (`strict: true`). Zawiera mapowanie błędów, obsługę odmowy (`refusal`) i 20-sekundowy timeout.
- **`prisma.ts`**: Singleton `PrismaClient` z adapterem `@prisma/adapter-pg`, wykorzystujący connection pooler Neon.

---

## 3. Tabela endpointów API

| Metoda | Ścieżka | Rola i zachowanie | Kody statusu i błędy |
| --- | --- | --- | --- |
| `GET` | `/api/inquiries` | Pobiera listę wszystkich zapytań posortowanych malejąco po dacie (`createdAt desc`). | **200**: Lista obiektów `Inquiry`<br/>**500**: Błąd bazy danych |
| `POST` | `/api/inquiries` | Tworzy nowe zapytanie ofertowe na podstawie pól `rawText` oraz opcjonalnego `company`. Ustawia status początkowy `RECEIVED`. | **201**: Utworzone zapytanie<br/>**400**: Brak `rawText`, niepoprawny JSON lub błędny typ `company`<br/>**413**: Tekst przekracza limit 8000 znaków<br/>**500**: Błąd zapisu do bazy danych |
| `POST` | `/api/extract` | Wywołuje model OpenAI ze schematem strukturyzowanym. Jeśli przekazano `inquiryId`, zapisuje wynik w `extractionData` i aktualizuje status z `RECEIVED` na `EXTRACTED`. Timeout 20 s. | **200**: Obiekt `{ ok: true, data: RFQData }`<br/>**400**: Brak tekstu lub błędny JSON<br/>**404**: Nie znaleziono zapytania o podanym `inquiryId`<br/>**413**: Tekst przekracza 8000 znaków<br/>**422**: Model OpenAI odmówił analizy treści (`refusal`)<br/>**429**: Przekroczony limit zapytań lub brak środków w OpenAI<br/>**500**: Brak `OPENAI_API_KEY` lub odrzucony klucz (401)<br/>**502**: Błąd odpowiedzi OpenAI lub niezgodność ze schematem RFQ<br/>**503**: Model `gpt-6-luna` niedostępny dla konta<br/>**504**: Przekroczono limit czasu ekstrakcji (20 s) |
| `PATCH` | `/api/extract/[id]/review` | Zapisuje edytowany przez człowieka szkic danych w polu `reviewData`. Waliduje format przez `rfqSchema`, ale pozwala na zapis niekompletnych danych (pola `null`). Nie modyfikuje statusu rekordu. | **200**: Obiekt `{ ok: true, data: RFQData }`<br/>**400**: Błędny JSON, brak pola `data` lub niezgodność ze schematem Zod<br/>**404**: Zapytanie o podanym `id` nie istnieje<br/>**500**: Błąd zapisu do bazy danych |
| `PATCH` | `/api/inquiries/[id]/decision` | Zapisuje ostateczną decyzję użytkownika (`action: 'APPROVE'` lub `'REQUEST_INFO'`) oraz aktualizuje `reviewData`. Dla `APPROVE` serwer bezwzględnie weryfikuje brak brakujących pól funkcją `checkRFQCompleteness`. Ustawia status `APPROVED` lub `NEEDS_INFO`. | **200**: Obiekt `{ ok: true, data: Inquiry }`<br/>**400**: Niepoprawny JSON, brak pól `action`/`data`, nieznana akcja lub błąd schematu Zod<br/>**404**: Zapytanie o wskazanym `id` nie istnieje<br/>**422**: Próba zatwierdzenia `APPROVE` zapytania z brakującymi polami<br/>**500**: Błąd zapisu do bazy danych |
