# Ekstrakcja RFQ — MVP

Formularz → `POST /api/extract` → `extractRFQ()` → OpenAI Responses API → walidacja `rfqSchema` → obecny widok pięciu pól.

- Model: `gpt-6-luna`, potwierdzony w [oficjalnej dokumentacji OpenAI](https://developers.openai.com/api/docs/models/gpt-6-luna) 10.10.2026. Dostęp na konkretnym koncie zależy od jego uprawnień i rozliczeń API.
- Instrukcje ekstrakcji i pojedyncze wywołanie są w `src/lib/rfq/extract.ts`. Braki i niejednoznaczne wartości mają być `null`.
- Schemat JSON dla Structured Outputs powstaje z obecnego Zod; wynik jest ponownie walidowany przez ten sam schemat. Zgodność typów nie gwarantuje poprawności informacji — wynik należy porównać z tekstem.
- Timeout: 20 sekund. Błąd API, odmowa lub niekompletna odpowiedź kończą ekstrakcję błędem, bez automatycznych powtórek.
- `extract.old.ts` i jego testy to archiwum. Aplikacja nie używa starego parsera.

## Konfiguracja lokalna

W `.env.local` w katalogu projektu dodaj swój klucz API:

```dotenv
OPENAI_API_KEY=twoj_klucz_api
```

Plik jest ignorowany przez Git. Nie używaj prefiksu `NEXT_PUBLIC_`. Uruchom ponownie serwer Next.js po dodaniu klucza. Kliknięcie „Wyodrębnij dane” wykona jedno płatne wywołanie OpenAI API.

## Sprawdzenie bez kosztów

```sh
node --test src/lib/rfq/extract.test.cjs src/lib/rfq/extract.old.test.cjs
node node_modules/typescript/bin/tsc --noEmit --incremental false
```

Nowe testy mockują sieć i sprawdzają integrację, schemat oraz błędy. Dziesięć dawnych scenariuszy pozostaje w testach archiwum; nie dowodzi to skuteczności AI. Test 10–15 rzeczywistych zapytań z modelem wymaga klucza API i zgody na koszt.
