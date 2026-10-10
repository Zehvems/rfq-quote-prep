// Run with: node --test src/lib/rfq/extract.test.cjs (Node 22.15+).
// Use the project's TypeScript compiler; no test framework or build files needed.
const { registerHooks } = require('node:module');
const { readFileSync, existsSync } = require('node:fs');
const { fileURLToPath } = require('node:url');
const ts = require('typescript');
const { test } = require('node:test');
const assert = require('node:assert/strict');

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('.') && context.parentURL?.endsWith('.ts')) {
      const url = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(url)) return { url: url.href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith('file:') && url.endsWith('.ts')) {
      return {
        format: 'commonjs', shortCircuit: true,
        source: ts.transpileModule(readFileSync(fileURLToPath(url), 'utf8'), {
          compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
        }).outputText,
      };
    }
    return nextLoad(url, context);
  },
});

const { extractRFQ } = require('./extract.ts');
const { rfqSchema } = require('./schema.ts');
const { completeRFQ, incompleteRFQ } = require('./samples.ts');
const empty = { productType: null, quantity: null, specification: null, deadline: null, deliveryLocation: null };
const scenarios = [
  ['standardowe zapytanie', `Dzień dobry,
Prosimy o wycenę 3 agregatów chłodniczych o mocy 12 kW,
zasilanie 400 V.
Termin dostawy: 20.11.2026
Miejsce dostawy: Poznań.`, ['agregaty chłodnicze', 3, '12 kW, 400 V', '20.11.2026', 'Poznań']],
  ['pojedynczy produkt', `Potrzebujemy jeden agregat chłodniczy o mocy 7,5 kW.
Zasilanie 230V.
Proszę dostarczyć do Gniezna przed 30 listopada 2026.`, ['agregat chłodniczy', 1, '7,5 kW, 230 V', 'przed 30 listopada 2026', 'Gniezno']],
  ['klimatyzacja', `Dzień dobry,
Chciałbym zamówić 5 klimatyzatorów ściennych,
każdy o mocy 3,5 kW.
Kolor biały, montaż naścienny.
Dostawa do Warszawy najpóźniej 15 grudnia 2026.`, ['klimatyzatory ścienne', 5, '3,5 kW, biały, montaż naścienny', '15 grudnia 2026', 'Warszawa']],
  ['formularz', `ZAPYTANIE RFQ/14/2026

Produkt: Pompa obiegowa
Ilość: 2 szt.
Parametry: 230 V, wydajność 4 m3/h
Termin realizacji: 02.12.2026
Adres dostawy: Łódź`, ['pompa obiegowa', 2, '230 V, 4 m3/h', '02.12.2026', 'Łódź']],
  ['brakujące dane', `Proszę o wycenę 12 regałów magazynowych.
Materiał: stal ocynkowana.
Wysokość 250 cm.
Termin jeszcze ustalimy.
Odbiór własny.`, ['regały magazynowe', 12, 'stal ocynkowana, 250 cm', null, null]],
  ['nieformalny e-mail', `Hej,
potrzebujemy na szybko 8 wentylatorów przemysłowych,
wydajność minimum 1500 m3/h, zasilanie 230V.
Dacie radę ogarnąć dostawę do Krakowa do piątku?
Pozdrawiam.`, ['wentylatory przemysłowe', 8, 'minimum 1500 m3/h, 230 V', 'do piątku', 'Kraków']],
  ['inna branża', `Proszę o ofertę na 50 szt. śrub M8 ze stali nierdzewnej A2.
Długość 40 mm.
Dostawa: Wrocław.
Termin: w ciągu dwóch tygodni.`, ['śruby M8', 50, 'stal nierdzewna A2, długość 40 mm', 'w ciągu dwóch tygodni', 'Wrocław']],
  ['tekst i stopka', `Dzień dobry,

Proszę o wycenę 4 czujników temperatury,
zakres pomiarowy -20 do +80°C,
dokładność ±0,5°C.

Towar proszę wysłać do magazynu w Poznaniu.
Potrzebujemy go do 18.12.2026.

Pozdrawiam,
Jan Kowalski
Dział zakupów
Firma ABC
Siedziba: Wrocław
Telefon: +48 600 123 456`, ['czujniki temperatury', 4, '-20 do +80°C, ±0,5°C', '18.12.2026', 'Poznań']],
  ['tekst z PDF', `ZAPYTANIE OFERTOWE

Nazwa produktu:
Szafa sterownicza

Wymagana liczba:
6 sztuk

Parametry techniczne:
Stopień ochrony IP65
Materiał: stal nierdzewna
Wymiary: 800 x 600 x 300 mm

Data wymaganej dostawy:
10.01.2027

Lokalizacja:
Katowice`, ['szafa sterownicza', 6, 'IP65, stal nierdzewna, 800 x 600 x 300 mm', '10.01.2027', 'Katowice']],
  ['numery niezwiązane z ilością', `Zapytanie nr 4821/2026.

Prosimy o ofertę na 6 pomp ciepła,
moc grzewcza 9 kW każda.
Dostawa do Katowic.
Termin dostawy nie został jeszcze ustalony.

Kontakt: +48 600 123 456.`, ['pompy ciepła', 6, 'moc grzewcza 9 kW', null, 'Katowice']],
];

for (const [index, [name, text, values]] of scenarios.entries()) {
  test(`scenariusz ${index + 1}: ${name}`, () => {
    const expected = Object.fromEntries(Object.keys(empty).map((key, i) => [key, values[i]]));
    assert.deepEqual(extractRFQ(text), expected);
    assert.equal(rfqSchema.safeParse(extractRFQ(text)).success, true);
  });
}

test('dotychczasowe próbki nadal zawierają kompletne i niekompletne dane', () => {
  assert.deepEqual(extractRFQ(completeRFQ), {
    productType: 'agregaty chłodnicze', quantity: 4, specification: '12 kW, 400 V',
    deadline: '20 października 2026', deliveryLocation: 'Poznań',
  });
  assert.deepEqual(extractRFQ(incompleteRFQ), {
    ...empty, productType: 'agregaty chłodnicze', specification: '8 kW',
  });
});

test('brak produktu: numer zapytania, telefon i adres firmy nie tworzą danych', () => {
  assert.deepEqual(extractRFQ('Zapytanie nr 4821/2026.\nKontakt: +48 600 123 456.\nSiedziba: Wrocław'), empty);
  assert.deepEqual(extractRFQ(''), empty);
  assert.deepEqual(extractRFQ('Proszę o ofertę. Ilość: 5 szt.'), { ...empty, quantity: 5 });
});

test('brak ilości: parametry i modele nie są liczbą sztuk', () => {
  assert.deepEqual(extractRFQ('Produkt: śruba M8\nParametry: długość 40 mm'), {
    ...empty, productType: 'śruba M8', specification: 'długość 40 mm',
  });
});

test('sprzeczne wartości i wiele produktów pozostają niejednoznaczne', () => {
  const result = extractRFQ('Produkt: Pompa obiegowa\nIlość: 2\nIlość: 3\nTermin: 02.12.2026\nTermin: 03.12.2026\nMiejsce dostawy: Łódź\nMiejsce dostawy: Poznań');
  assert.deepEqual(result, { ...empty, productType: 'pompa obiegowa' });
  const multiple = extractRFQ('Proszę o ofertę na 2 pompy obiegowe i 3 wentylatory przemysłowe.');
  assert.equal(multiple.productType, null);
  assert.equal(multiple.quantity, null);
});

test('inne sformułowania, produkt spoza słownika i wielowierszowe pola', () => {
  assert.deepEqual(extractRFQ('Prosimy o zakup trzech agregatów chłodniczych o mocy 15kW.\nDostarczyć do Warszawy do poniedziałku.'), {
    productType: 'agregaty chłodnicze', quantity: 3, specification: '15 kW', deadline: 'do poniedziałku', deliveryLocation: 'Warszawa',
  });
  assert.deepEqual(extractRFQ('Produkt:\nFiltr hydrauliczny HX-42\nIlość:\n24 sztuki\nParametry:\nciśnienie 10 bar\nAdres dostawy:\nLublin, ul. Przemysłowa 8\nTermin realizacji:\n05.02.2027'), {
    productType: 'filtr hydrauliczny HX-42', quantity: 24, specification: 'ciśnienie 10 bar', deadline: '05.02.2027', deliveryLocation: 'Lublin, ul. Przemysłowa 8',
  });
});

test('nieznane terminy, odbiór własny i liczby poza zakresem', () => {
  const result = extractRFQ('Produkt: Pompa obiegowa\nIlość: 9007199254740993\nTermin: do ustalenia\nAdres dostawy: odbiór własny');
  assert.deepEqual(result, { ...empty, productType: 'pompa obiegowa' });
  assert.equal(extractRFQ('Termin dostawy: 31.02.2027').deadline, null);
  assert.equal(extractRFQ('Produkt: pompa obiegowa\nIlość: 2 lub 3 sztuki').quantity, null);
});

test('puste etykiety PDF i jawnie nieznane wartości nie tworzą danych', () => {
  assert.deepEqual(extractRFQ('Produkt:\nIlość:\nParametry:\nTermin:\nAdres dostawy:'), empty);
  assert.deepEqual(extractRFQ('Produkt: brak danych\nIlość: nie podano\nParametry: brak\nTermin: nieznany\nAdres dostawy: do ustalenia'), empty);
});

test('alternatywne terminy, lokalizacje i liczby w zdaniu wymagają wyjaśnienia', () => {
  assert.equal(extractRFQ('Termin: 20.11.2026 lub 21.11.2026').deadline, null);
  assert.equal(extractRFQ('Dostawa do Warszawy lub Łodzi.').deliveryLocation, null);
  assert.equal(extractRFQ('Potrzebujemy 2 lub 3 pompy obiegowe.').quantity, null);
  assert.equal(extractRFQ('Potrzebujemy około 3 pompy obiegowe.').quantity, null);
});

test('dostawa pod pełny adres i ilość produktu spoza słownika', () => {
  assert.deepEqual(extractRFQ('Proszę o ofertę na 20 szt. zaworów kulowych.\nParametry: ciśnienie 16 bar\nDostawa do Lublina, ul. Przemysłowa 8 do 05.02.2027.'), {
    productType: 'zaworów kulowych', quantity: 20, specification: 'ciśnienie 16 bar',
    deadline: '05.02.2027', deliveryLocation: 'Lublina, ul. Przemysłowa 8',
  });
});

test('sprzeczna ilość w etykiecie i treści nie jest rozstrzygana automatycznie', () => {
  assert.equal(extractRFQ('Ilość: 2\nProszę o ofertę na 3 pompy obiegowe.').quantity, null);
});

test('istniejący endpoint zachowuje odpowiedź i walidację braku tekstu', async () => {
  const { POST } = require('../../app/api/extract/route.ts');
  const request = (body) => new Request('http://localhost/api/extract', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const response = await POST(request({ rawText: scenarios[0][1] }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, data: extractRFQ(scenarios[0][1]) });
  const missing = await POST(request({}));
  assert.equal(missing.status, 400);
  assert.deepEqual(await missing.json(), { ok: false, error: 'Brak tekstu zapytania.' });
});
