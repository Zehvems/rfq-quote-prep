# [ARCHIWUM] Ekstrakcja RFQ — MVP (notatki historyczne)

> **Uwaga:** Ten dokument to notatka robocza z wczesnego etapu projektu. 
> Aktualna dokumentacja architektury znajduje się w [`../ARCHITECTURE.md`](../ARCHITECTURE.md).

Formularz → `POST /api/extract` → `extractRFQ()` → OpenAI Responses API → walidacja `rfqSchema` → widok pól.

- Model: `gpt-6-luna`, potwierdzony w oficjalnej dokumentacji OpenAI.
- Instrukcje ekstrakcji i pojedyncze wywołanie są w `src/lib/rfq/extract.ts`. Braki i niejednoznaczne wartości mają być `null`.
- Schemat JSON dla Structured Outputs powstaje ze schematu Zod; wynik jest ponownie walidowany przez ten sam schemat.
- Timeout: 20 sekund.
- `extract.old.ts` to dawna implementacja heurystyczna (archiwalna).
