/**
 * seed-demo.ts — Realistyczne dane demonstracyjne B2B (sektor produkcyjno-przemysłowy).
 *
 * Uruchom: npx tsx scripts/seed-demo.ts
 *
 * Skrypt czyści tabelę Inquiry i wstawia 6 zapytań ofertowych w różnych stanach procesu,
 * tak aby dashboard od razu prezentował żywy, wiarygodny widok pipeline'u.
 */

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

import type { Prisma } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ Brak zmiennej środowiskowej DATABASE_URL.');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Dane seedowe
// ---------------------------------------------------------------------------

const now = new Date();
const d = (daysAgo: number, hoursAgo = 0) =>
  new Date(now.getTime() - daysAgo * 86_400_000 - hoursAgo * 3_600_000);

interface SeedInquiry {
  company: string;
  rawText: string;
  status: string;
  extractionData?: Prisma.InputJsonValue;
  reviewData?: Prisma.InputJsonValue;
  createdAt: Date;
}

const inquiries: SeedInquiry[] = [
  // ─── 1. APPROVED — Lumel S.A. ──────────────────────────────────────────────
  {
    company: 'Lumel S.A.',
    rawText: `Dzień dobry,

w nawiązaniu do rozmowy telefonicznej z dnia 28.10 proszę o przygotowanie oferty na poniższe pozycje:

1. Wałki napędowe ze stali nierdzewnej AISI 316L, wymiar ø40×280 mm,
   toczenie CNC zgodnie z rysunkiem technicznym WN-2026/04 (w załączeniu) — 250 szt.
2. Tuleje dystansowe EN AW-6061 T6, ø60×ø42×35 mm,
   tolerancja otworu H7 — 500 szt.

Termin dostawy: do 15 grudnia 2026.
Miejsce dostawy: Lumel S.A., ul. Sulechowska 1, 65-022 Zielona Góra (magazyn główny, rampa nr 3).

Proszę o podanie ceny jednostkowej netto, warunków płatności i czasu realizacji.

Z poważaniem,
Tomasz Kaczmarek
Specjalista ds. Zaopatrzenia | Dział Utrzymania Ruchu
Lumel S.A.
tel. +48 68 329 51 00
t.kaczmarek@lumel.com.pl`,
    status: 'APPROVED',
    extractionData: {
      items: [
        { productType: 'Wałki napędowe AISI 316L ø40×280 mm', quantity: 250, specification: 'Toczenie CNC wg rysunku WN-2026/04, stal nierdzewna AISI 316L' },
        { productType: 'Tuleje dystansowe EN AW-6061 T6', quantity: 500, specification: 'ø60×ø42×35 mm, tolerancja otworu H7, aluminium EN AW-6061 T6' },
      ],
      deadline: '15 grudnia 2026',
      deliveryLocation: 'Lumel S.A., ul. Sulechowska 1, 65-022 Zielona Góra',
    },
    reviewData: {
      items: [
        { productType: 'Wałki napędowe AISI 316L ø40×280 mm', quantity: 250, specification: 'Toczenie CNC wg rysunku WN-2026/04, stal nierdzewna AISI 316L' },
        { productType: 'Tuleje dystansowe EN AW-6061 T6', quantity: 500, specification: 'ø60×ø42×35 mm, tolerancja otworu H7, aluminium EN AW-6061 T6' },
      ],
      deadline: '15 grudnia 2026',
      deliveryLocation: 'Lumel S.A., ul. Sulechowska 1, 65-022 Zielona Góra (magazyn główny, rampa nr 3)',
    },
    createdAt: d(5, 9),
  },

  // ─── 2. APPROVED — Bolarus S.A. ────────────────────────────────────────────
  {
    company: 'Bolarus S.A.',
    rawText: `Dzień dobry,

proszę o wycenę następujących urządzeń chłodniczych do naszego nowego centrum logistycznego:

1. Parowniki sufitowe chłodnicze model ECO MTE 354E4 — 8 szt.
   Parametry: moc chłodnicza 35,4 kW przy DT1=8K, zasilanie 400V/3ph/50Hz,
   rozstaw przyłączy: 12/16 mm, odszranianie elektryczne.
2. Agregaty skraplające typu Bitzer LH135/4FES-5Y-40S — 4 szt.
   Czynnik R449A, wydajność 28,1 kW przy temp. parowania -8°C / skraplania +40°C.

Termin dostawy: do 10 stycznia 2027.
Miejsce dostawy: Bolarus S.A., ul. Jutrzenki 94, 02-230 Warszawa.

Prosimy o ofertę z ceną netto, warunkami gwarancji i czasem realizacji.
W przypadku braku dostępności oryginalnych modeli ECO prosimy o zamienniki o zbliżonych parametrach.

Z poważaniem,
Marek Jankowski
Kierownik Projektu | Dział Inwestycji
Bolarus S.A.
tel. +48 22 846 22 33
m.jankowski@bolarus.pl`,
    status: 'APPROVED',
    extractionData: {
      items: [
        { productType: 'Parowniki sufitowe ECO MTE 354E4', quantity: 8, specification: 'Moc 35,4 kW DT1=8K, 400V/3ph/50Hz, przyłącza 12/16 mm, odszranianie elektryczne' },
        { productType: 'Agregaty skraplające Bitzer LH135/4FES-5Y-40S', quantity: 4, specification: 'R449A, 28,1 kW, temp. parowania -8°C / skraplania +40°C' },
      ],
      deadline: '10 stycznia 2027',
      deliveryLocation: 'Bolarus S.A., ul. Jutrzenki 94, 02-230 Warszawa',
    },
    reviewData: {
      items: [
        { productType: 'Parowniki sufitowe ECO MTE 354E4', quantity: 8, specification: 'Moc 35,4 kW DT1=8K, 400V/3ph/50Hz, przyłącza 12/16 mm, odszranianie elektryczne' },
        { productType: 'Agregaty skraplające Bitzer LH135/4FES-5Y-40S', quantity: 4, specification: 'R449A, 28,1 kW, temp. parowania -8°C / skraplania +40°C' },
      ],
      deadline: '10 stycznia 2027',
      deliveryLocation: 'Bolarus S.A., ul. Jutrzenki 94, 02-230 Warszawa',
    },
    createdAt: d(4, 14),
  },

  // ─── 3. EXTRACTED — Metal-Fach Technika Grzewcza ───────────────────────────
  {
    company: 'Metal-Fach Technika Grzewcza',
    rawText: `Dzień dobry,

w związku z realizacją zamówienia na kotły centralnego ogrzewania serii SDG proszę o pilną wycenę:

1. Cięcie laserowe blach kotłowych P265GH, grubość 6 mm,
   wymiary arkusza wg pliku DXF (w załączniku) — 80 kompletów.
2. Gięcie CNC wyciętych elementów na prasie krawędziowej
   (promień gięcia R8, kąt 90°, tolerancja ±0,5°) — te same 80 kompletów.

Materiał dostarczamy my lub prosimy o ofertę z materiałem — proszę podać obie opcje cenowe.
Termin realizacji: do 20 grudnia 2026.

Proszę o potwierdzenie przyjęcia zapytania i orientacyjny czas odpowiedzi.

Z poważaniem,
Krzysztof Nowakowski
Technolog | Dział Produkcji
Metal-Fach Technika Grzewcza Sp. z o.o.
ul. Żywiecka 90, 34-300 Żywiec
tel. +48 33 860 71 00
k.nowakowski@metalfach.com.pl`,
    status: 'EXTRACTED',
    extractionData: {
      items: [
        { productType: 'Cięcie laserowe blach P265GH gr. 6 mm', quantity: 80, specification: 'Blacha kotłowa P265GH, grubość 6 mm, wymiary wg pliku DXF' },
        { productType: 'Gięcie CNC elementów', quantity: 80, specification: 'Prasa krawędziowa, promień R8, kąt 90°, tolerancja ±0,5°' },
      ],
      deadline: '20 grudnia 2026',
      deliveryLocation: null,
    },
    reviewData: undefined,
    createdAt: d(2, 6),
  },

  // ─── 4. NEEDS_INFO — Kospel S.A. ──────────────────────────────────────────
  {
    company: 'Kospel S.A.',
    rawText: `Dzień dobry,

piszę w sprawie króćców przyłączeniowych mosiężnych DN15 i DN20 do naszych podgrzewaczy przepływowych serii PPH2. Potrzebujemy kilkadziesiąt sztuk na przyszły miesiąc — dokładną ilość potwierdzimy po zakończeniu inwentaryzacji w magazynie komponentów (przewidujemy ok. 60-80 szt., ale proszę jeszcze nie traktować tego jako zamówienia).

Proszę o orientacyjną wycenę jednostkową i czas realizacji.
Materiał: mosiądz CW617N (CuZn40Pb2), gwint zewnętrzny G¾"/G1".

Pozdrawiam,
Anna Witkowska
Dział Zakupów Komponentów
Kospel S.A., ul. Olsztyńska 1, 75-221 Koszalin
tel. +48 94 346 38 08
a.witkowska@kospel.pl`,
    status: 'NEEDS_INFO',
    extractionData: {
      items: [
        { productType: 'Króćce przyłączeniowe mosiężne DN15/DN20', quantity: null, specification: 'Mosiądz CW617N (CuZn40Pb2), gwint zewnętrzny G¾"/G1", do podgrzewaczy PPH2' },
      ],
      deadline: null,
      deliveryLocation: 'Kospel S.A., ul. Olsztyńska 1, 75-221 Koszalin',
    },
    reviewData: {
      items: [
        { productType: 'Króćce przyłączeniowe mosiężne DN15/DN20', quantity: null, specification: 'Mosiądz CW617N (CuZn40Pb2), gwint zewnętrzny G¾"/G1", do podgrzewaczy PPH2' },
      ],
      deadline: null,
      deliveryLocation: 'Kospel S.A., ul. Olsztyńska 1, 75-221 Koszalin',
    },
    createdAt: d(1, 11),
  },

  // ─── 5. RECEIVED — Pesa Bydgoszcz S.A. (kompletne) ────────────────────────
  {
    company: 'Pesa Bydgoszcz S.A.',
    rawText: `Dzień dobry,

w ramach projektu modernizacji tramwajów Twist proszę o ofertę na:

1. Uchwyty montażowe spawane ze stali konstrukcyjnej S355J2+N — 400 szt.
   Wymiary: wg rysunku UMT-2026-117 (przekazanego mailowo 03.11),
   tolerancja montażowa ±0,3 mm, otwory ø12H7 w rozstawie 85 mm.
2. Malowanie proszkowe RAL 7016 (antracytowy szary),
   grubość powłoki 60-80 µm, odporność na mgłę solną ≥720h wg ISO 9227.

Termin dostawy: do 5 grudnia 2026.
Miejsce dostawy: Pesa Bydgoszcz S.A., ul. Zygmunta Augusta 11, 85-082 Bydgoszcz
(hala montażowa H2, wjazd od ul. Toruńskiej, awizacja 48h przed dostawą).

Wymagamy certyfikatu materiałowego 3.1 wg EN 10204 dla stali
oraz protokołu pomiaru grubości powłoki dla każdej partii.

Proszę o ofertę w ciągu 5 dni roboczych.

Z poważaniem,
inż. Paweł Zieliński
Starszy Konstruktor | Biuro Techniczne
Pesa Bydgoszcz S.A.
tel. +48 52 339 22 00
p.zielinski@pesa.pl`,
    status: 'RECEIVED',
    extractionData: undefined,
    reviewData: undefined,
    createdAt: d(0, 5),
  },

  // ─── 6. RECEIVED — Techmatik S.A. (niekompletne) ──────────────────────────
  {
    company: 'Techmatik S.A.',
    rawText: `Witam,

jesteśmy zainteresowani wyceną form stalowych do naszych wibropras do
produkcji kostki brukowej. Chodzi o formy na kostkę typu Holland 20×10×8 cm
i Behaton 19,8×16,3×8 cm.

Materiał form: stal narzędziowa (proszę zaproponować gatunek),
wymagana twardość — do ustalenia, zależy od żywotności jaką Państwo gwarantują.

Ilości i pozostałe szczegóły przekażę po konsultacji z technologiem,
na ten moment potrzebuję orientacyjnej ceny za 1 komplet formy.

Pozdrawiam,
Rafał Dąbrowski
Techmatik S.A.
r.dabrowski@techmatik.pl`,
    status: 'RECEIVED',
    extractionData: undefined,
    reviewData: undefined,
    createdAt: d(0, 2),
  },
];

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function main() {
  console.log('🗑  Czyszczenie tabeli Inquiry…');
  await prisma.inquiry.deleteMany();

  console.log('🌱 Wstawianie 6 realistycznych zapytań B2B…');
  for (const inq of inquiries) {
    await prisma.inquiry.create({
      data: {
        company: inq.company,
        rawText: inq.rawText,
        status: inq.status,
        extractionData: inq.extractionData ?? undefined,
        reviewData: inq.reviewData ?? undefined,
        createdAt: inq.createdAt,
      },
    });
  }

  const count = await prisma.inquiry.count();
  console.log(`✅ Gotowe — wstawiono ${count} zapytań.`);
}

main()
  .catch((err) => {
    console.error('❌ Błąd seedowania:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
