# Lista i wytyczne screenshotów portfolio

Poniższe 4 ujęcia są wykorzystywane w `README.md` oraz prezentacjach projektu. Wszystkie ujęcia powinny zostać wykonane w przeglądarce (np. Chrome DevTools) przy użyciu fikcyjnych, realistycznych danych.

---

## 1. Wykaz wymaganych ujęć

| Plik | Rozdzielczość | Stan widoku | Co musi być widoczne |
| --- | --- | --- | --- |
| `docs/screenshots/01-dashboard.png` | **1440 x 900 px** | Widok główny (zwinięte karty) | Pasek metryk na górze (*Ekstrakcja AI → Przegląd człowieka → Decyzja*), formularz po prawej, lista minimum 4 zapytań z różnymi plakietkami statusów: `APPROVED`, `NEEDS_INFO`, `EXTRACTED`, `RECEIVED`. |
| `docs/screenshots/02-review.png` | **1440 x 900 px** | Rozwinięte zapytanie z brakami | Rozwinięta karta zapytania w stanie `NEEDS_INFO`: po lewej oryginalna wiadomość z brakami, po prawej krok 2 z podświetlonymi na żółto brakującymi polami oraz zablokowany przycisk zatwierdzenia w kroku 3. |
| `docs/screenshots/03-approved.png` | **1440 x 900 px** | Rozwinięte zapytanie zatwierdzone | Rozwinięta karta w stanie `APPROVED`: kompletna tabela pozycji (zielone znaczniki), wypełniony termin i miejsce dostawy, zielona plakietka statusu `Zatwierdzone`. |
| `docs/screenshots/04-mobile.png` | **390 x 844 px** (iPhone 14/15) | Widok mobilny (RWD) | Układ jednokolumnowy bez przewijania poziomego: nagłówek, licznik procesu, karta zapytania i formularz poniżej. |

---

## 2. Fikcyjne dane do wstawienia do bazy

Aby przygotować spójne ujęcia, wklej poniższe 4 fikcyjne zapytania przez formularz w aplikacji:

### Rekord 1 (do ujęcia 03-approved — stan `APPROVED`):
- **Firma:** `Apex Metalworks Sp. z o.o.`
- **Treść RFQ:**
  ```text
  Dzień dobry, proszę o wycenę zamówienia na 150 szt. profili stalowych zamkniętych 40x40x3 mm (gatunek S235JR, długość 6000 mm) oraz 80 szt. kątowników zimnogiętych 50x50x4 mm (długość 3000 mm). Wymagany atest 3.1. Dostawa najpóźniej do 15 grudnia 2026 na adres magazynu: ul. Fabryczna 12, 40-001 Katowice. Pozdrawiam, Marek Nowicki
  ```
- **Kroki:** Kliknij *Wyodrębnij dane* → sprawdź kompletność → kliknij *Zatwierdź do wyceny*.

### Rekord 2 (do ujęcia 02-review — stan `NEEDS_INFO`):
- **Firma:** `Nordic HVAC Solutions`
- **Treść RFQ:**
  ```text
  Cześć, potrzebujemy wentylatorów promieniowych chemoodpornych z silnikiem przeciwwybuchowym ATEX (strefa 1). Wydajność min. 2500 m3/h przy sprężu 800 Pa. Potrzebne na budowę w Gdańsku na początek stycznia 2027. Nie mamy jeszcze ostatecznej ilości od inwestora (prawdopodobnie 4 lub 6 sztuk). Dajcie znać o dostępności.
  ```
- **Kroki:** Kliknij *Wyodrębnij dane* → model ustawi ilość jako `null` (alternatywa 4 lub 6) → brak dokładnego adresu → kliknij *Oznacz: wymaga uzupełnienia*.

### Rekord 3 (do widoku listy — stan `EXTRACTED`):
- **Firma:** `ProAutomation Systemy`
- **Treść RFQ:**
  ```text
  Zwracamy się z zapytaniem o dostawę 12 szt. serwonapędów 1.5 kW z enkoderem absolutnym oraz 12 szt. przekładni planetarnych 1:10. Termin realizacji do końca listopada 2026 r., dostawa do zakładu w Poznaniu, ul. Przemysłowa 8.
  ```
- **Kroki:** Kliknij *Wyodrębnij dane* (pozostaw w stanie oczekiwania na weryfikację).

### Rekord 4 (do widoku listy — stan `RECEIVED`):
- **Firma:** `Eko-Bud Invest`
- **Treść RFQ:**
  ```text
  Dzień dobry, potrzebujemy wyceny na prefabrykaty betonowe typu L oraz płyty drogowe na inwestycję w Łodzi. Proszę o kontakt w sprawie szczegółów technicznych.
  ```
- **Kroki:** Tylko dodaj zapytanie (bez klikania ekstrakcji).
