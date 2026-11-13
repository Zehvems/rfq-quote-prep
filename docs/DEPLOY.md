# Wdrożenie: Vercel + Neon (ok. 20 minut)

## 0. Najpierw bezpieczeństwo (obowiązkowe)

W historii gita (commit `4365711`, pliki `.next/cache/...`) znajduje się connection string do Neona z hasłem. Repo jest publiczne, więc to hasło trzeba uznać za ujawnione.

1. Neon → projekt → **Roles** → rola, której używasz → **Reset password**. Stare hasło przestaje działać.
2. W **Connect** skopiuj nowe adresy: z włączonym **Pooled connection** (`DATABASE_URL`) i bez niego (`DIRECT_URL`).
3. Wklej oba do lokalnego `.env` (plik jest w `.gitignore`).
4. W OpenAI → **Settings → Limits** ustaw miesięczny limit wydatków (np. 5–10 USD). To najważniejsze zabezpieczenie publicznego dema.
5. Jeśli klucz OpenAI kiedykolwiek wklejałeś do czatu, issue lub commita, wygeneruj nowy i usuń stary.

## 1. Posprzątaj repo i wypchnij zmiany

```bash
git rm --cached tsconfig.tsbuildinfo      # plik build info nie powinien być w repo
git add -A
git commit -m "Redesign UI, add README and deploy docs"
git push
```

Opcjonalnie: `src/lib/rfq/extract.old.ts` to archiwum. Jeśli nie jest potrzebne, usuń je, bo wygląda jak martwy kod.

## 2. Migracje bazy (lokalnie, raz)

```bash
npm install
npx prisma migrate deploy
```

Polecenie używa `DIRECT_URL` z `.env`. Powinno zastosować 3 migracje.

## 3. Projekt na Vercelu

1. vercel.com → **Add New → Project** → zaimportuj repo `rfq-quote-prep`.
2. Framework: **Next.js** (wykryje się sam). Build command zostaw domyślny. `prisma generate` uruchamia się w `postinstall`.
3. **Environment Variables** — dodaj trzy zmienne dla *Production* i *Preview*:
   - `DATABASE_URL` (pooled)
   - `DIRECT_URL` (direct)
   - `OPENAI_API_KEY`
   
   Nie dodawaj `APP_URL`. Strona czyta bazę bezpośrednio.
4. **Deploy**.

## 4. Test po wdrożeniu

- [ ] Strona się ładuje (nie ma błędu bazy).
- [ ] Dodaj zapytanie przez przykład „kompletne” → **Wyodrębnij dane** → wynik się pojawia.
- [ ] Zapisz poprawki, odśwież stronę, dane zostają.
- [ ] **Zatwierdź do wyceny** → status zmienia się na „Zatwierdzone”.
- [ ] Przykład „z brakami” → przycisk zatwierdzania jest zablokowany.
- [ ] Widok telefonu (DevTools → 390 px): bez poziomego przewijania.

## 5. Dane w publicznym demie

Każdy, kto zna adres, widzi wszystkie zapytania i może dodawać nowe. Dlatego:

- nie wpisuj prawdziwych danych klientów ani prawdziwych firm; używaj przykładów z formularza,
- usuń testowe wpisy z bazy (Neon → **SQL Editor**: `DELETE FROM "Inquiry";`) i zostaw 3–4 dobrze dobrane przykłady (kompletny, z brakami, zatwierdzony),
- limit wydatków w OpenAI (krok 0.4) chroni przed nadużyciem endpointu `/api/extract`.

## 6. Po wdrożeniu

- Wstaw prawdziwy adres w `README.md` (linia **Demo**).
- Zrób screenshoty (wytyczne ujęć w `docs/DEMO.md`) do `docs/screenshots/`.
- W GitHubie: **About → Website** = adres dema, dodaj opis i tematy (`nextjs`, `typescript`, `prisma`, `openai`, `rfq`).
- Przypnij repo na swoim profilu GitHub.

## Rozwiązywanie problemów

| Objaw | Przyczyna |
| --- | --- |
| Build: `Cannot find module '../../generated/prisma/client'` | Brak `postinstall: prisma generate` w `package.json` (jest w tej wersji). |
| Build: błąd o braku `DIRECT_URL` | Dodaj zmienną w Vercelu. `prisma.config.ts` odczytuje `DIRECT_URL`, więc najbezpieczniej mieć ją ustawioną także na etapie builda. |
| Strona: błąd po stronie serwera | Zły lub niezresetowany `DATABASE_URL`, albo brak `?sslmode=require`. |
| Ekstrakcja: 504 | Odpowiedź OpenAI trwa dłużej niż 20 s (limit w `extract.ts`). Spróbuj ponownie. |
| Ekstrakcja: 403 | Konto OpenAI nie ma dostępu do modelu użytego w `extract.ts`. |
