# [ARCHIWUM] Etap 1 — „Zapisz poprawki” (notatka robocza z implementacji)

> **Uwaga:** Dokument roboczy opisujący zadanie implementacji zapisu szkicu poprawek.
> Funkcjonalność została w pełni wdrożona w `src/app/ExtractButton.tsx` oraz `src/app/api/extract/[id]/review/route.ts`.

## Przygotowany szkielet
- `src/app/ReviewSavePanel.tsx` — gotowy JSX, przycisk, informacja o szkicu.
- `ReviewSaveState` — typ stanu: `idle`, `saving`, `success` lub `error`.
- Zapis do bazy w polu `reviewData` (model `Inquiry`).
