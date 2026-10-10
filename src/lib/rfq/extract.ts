import { rfqSchema, type RFQData } from "./schema";

type Field = { kind: keyof RFQData; value: string; index: number };
type Product = { name: string; index: number; quantity: number | null };

const fieldLabels: Record<keyof RFQData, string> = {
  productType: "(?:nazwa (?:produktu|towaru)|produkt|towar)",
  quantity: "(?:ilość|liczba(?: sztuk)?|wymagana liczba)",
  specification: "(?:specyfikacja(?: techniczna)?|parametry(?: techniczne)?|materiał|kolor|wymiary)",
  deadline: "(?:termin(?: dostawy| realizacji)?|data(?: wymaganej)? dostawy)",
  deliveryLocation: "(?:miejsce dostawy|adres dostawy|lokalizacja|dostawa)",
};
const quantityWords: Record<string, number> = {
  jeden: 1, jedna: 1, jedno: 1, jedną: 1, dwa: 2, dwie: 2, dwóch: 2,
  trzy: 3, trzech: 3, cztery: 4, czterech: 4, pięć: 5, pięciu: 5,
  sześć: 6, sześciu: 6, siedem: 7, siedmiu: 7, osiem: 8, ośmiu: 8,
  dziewięć: 9, dziewięciu: 9, dziesięć: 10, dziesięciu: 10,
};
const quantityToken = `(?:\\d+|${Object.keys(quantityWords).join("|")})`;
// This dictionary normalizes inflections; it does not restrict accepted products.
// Unknown names are preserved from labeled fields or purchase phrases.
const productForms = [
  ["agregat chłodniczy", "agregat(?:u)? chłodnicz(?:y|ego)"],
  ["agregaty chłodnicze", "agregat(?:y|ów) chłodnicz(?:e|ych)"],
  ["klimatyzator ścienny", "klimatyzator(?:a)? ścienn(?:y|ego)"],
  ["klimatyzatory ścienne", "klimatyzator(?:y|ów) ścienn(?:e|ych)"],
  ["pompa obiegowa", "pomp(?:a|ę|y) obiegow(?:a|ą|ej)"],
  ["pompy obiegowe", "pomp(?:y)? obiegow(?:e|ych)"],
  ["pompa ciepła", "pomp(?:a|ę) ciepła"],
  ["pompy ciepła", "pomp(?:y)? ciepła"],
  ["regał magazynowy", "regał(?:u)? magazynow(?:y|ego)"],
  ["regały magazynowe", "regał(?:y|ów) magazynow(?:e|ych)"],
  ["wentylator przemysłowy", "wentylator(?:a)? przemysłow(?:y|ego)"],
  ["wentylatory przemysłowe", "wentylator(?:y|ów) przemysłow(?:e|ych)"],
  ["śruba", "śrub(?:a|ę)"], ["śruby", "śrub(?:y)?"],
  ["czujnik temperatury", "czujnik(?:a)? temperatury"],
  ["czujniki temperatury", "czujnik(?:i|ów) temperatury"],
  ["szafa sterownicza", "szaf(?:a|ę|y) sterownicz(?:a|ą|ej)"],
  ["szafy sterownicze", "szaf(?:y)? sterownicz(?:e|ych)"],
];

function clean(value: string): string {
  return value.replace(/\s+/g, " ").trim().replace(/[.;!?]+$/, "").trim();
}

function isUnknown(value: string): boolean {
  return !value || /^(?:brak(?: danych)?|nie podano|nieznan\p{L}*|do ustalenia|jeszcze nie ustalon\p{L}*|[-–?])$/iu.test(clean(value));
}

function unique<T>(values: T[]): T | null {
  const distinct = [...new Set(values)];
  return distinct.length === 1 ? distinct[0] : null;
}

function prepareText(rawText: string): string {
  return rawText.normalize("NFC").replace(/\r\n?/g, "\n").replace(/\u00a0/g, " ")
    .split(/\n\s*(?:pozdrawiam|z poważaniem|serdecznie pozdrawiam|--)(?=[,!.\s]|$)/i)[0];
}

function readFields(text: string): Field[] {
  const entries = Object.entries(fieldLabels) as [keyof RFQData, string][];
  const labels = entries.map(([, label]) => label).join("|");
  const pattern = new RegExp(`(?:^|[\\n;]|[.!?]\\s+)[ \\t]*(${labels})[ \\t]*:[ \\t]*`, "gi");
  const matches = [...text.matchAll(pattern)];
  return matches.map((match, index) => {
    const kind = entries.find(([, label]) => new RegExp(`^${label}$`, "i").test(match[1]))![0];
    const start = match.index! + match[0].length;
    const remainder = text.slice(start, matches[index + 1]?.index ?? text.length).trimStart();
    // Scalar fields read the first nonempty line, including PDF label/value pairs.
    const block = /^(?:specyfikacja|parametry)/i.test(match[1]);
    const value = block ? remainder.split(/\n\s*(?:termin|dostaw\p{L}*|odbiór|kontakt|telefon|siedziba)\b/iu)[0].trim() : remainder.split("\n")[0];
    return { kind, value: block ? value : clean(value), index: start + text.slice(start).indexOf(remainder) };
  });
}

function parseQuantity(value: string): number | null {
  const match = clean(value).match(new RegExp(`^(${quantityToken})(?:\\s*(?:szt\\.?|sztuk(?:i)?))?$`, "i"));
  if (!match) return null;
  const number = quantityWords[match[1].toLowerCase()] ?? Number(match[1]);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
}

function precedingQuantity(text: string, index: number): number | null {
  const prefix = text.slice(0, index);
  const match = prefix.match(new RegExp(`(?:^|\\s)(${quantityToken}\\s*(?:szt\\.?|sztuk(?:i)?)?)\\s*$`, "i"));
  if (!match) return null;
  const before = prefix.slice(0, match.index).trim();
  if (/(?:\d+\s*(?:lub|albo|[-–])|około|minimum|maksimum|co najmniej)\s*$/i.test(before)) return null;
  return parseQuantity(match[1]);
}

function normalizeProduct(value: string): string {
  for (const [name, form] of productForms) {
    const match = value.match(new RegExp(`^${form}(?=$|[^\\p{L}])`, "iu"));
    if (match) return name + value.slice(match[0].length);
  }
  return value.replace(/\p{L}+/gu, (word, offset) => {
    const token = value.slice(offset).split(/\s/)[0];
    return /\d/.test(token) ? word : word.toLowerCase();
  });
}

function findProducts(text: string, fields: Field[]): Product[] {
  const labeled = fields.filter((field) => field.kind === "productType");
  if (labeled.length) return labeled.filter(({ value }) => !isUnknown(value)).map(({ value }) => ({
    name: normalizeProduct(value), index: 0, quantity: null,
  }));
  const products: Product[] = [];
  for (const [name, form] of productForms) {
    const pattern = new RegExp(`(?<![\\p{L}\\d])${form}(?!\\p{L})(?:\\s+M\\d+(?:[x×]\\d+)?)?`, "giu");
    for (const match of text.matchAll(pattern)) {
      if (products.some((product) => product.index === match.index)) continue;
      const suffix = match[0].match(/\s+M\d+(?:[x×]\d+)?$/i)?.[0] ?? "";
      products.push({ name: name + suffix, index: match.index!, quantity: precedingQuantity(text, match.index!) });
    }
  }
  if (products.length) return products;
  const purchase = /(?:wycenę|ofertę na|zamówić|zakup(?:em)?|potrzebujemy)\s+((?:szt\.|[^\n,.;!?])+)/gi;
  for (const match of text.matchAll(purchase)) {
    let value = match[1].replace(new RegExp(`^${quantityToken}\\s+(?:(?:szt\\.?|sztuk(?:i)?)\\s+)?`, "i"), "");
    value = clean(value.split(/\s+(?:o mocy|ze? |zasilanie|do |na |przed )/i)[0]);
    if (isUnknown(value) || /^(?:go|oferty|wyceny|informacji|na szybko|do|na|przed|\d)\b/i.test(value)) continue;
    const index = match.index! + match[0].indexOf(match[1]) + match[1].indexOf(value);
    products.push({ name: normalizeProduct(value), index, quantity: precedingQuantity(text, index) });
  }
  return products;
}

function normalizeSpecification(value: string): string {
  return clean(value).replace(/^stali\s+nierdzewnej/i, "stal nierdzewna")
    .replace(/^stali\s+ocynkowanej/i, "stal ocynkowana")
    .replace(/^stali\b/i, "stal")
    .replace(/(\d)\s*[x×]\s*(?=\d)/g, "$1 x ")
    .replace(/(\d)\s*(kW|kVA|V|mm|cm|m3\/h|m³\/h|bar|Pa|Hz)\b/gi, "$1 $2")
    .replace(/\s*°\s*C/gi, "°C");
}

function extractSpecification(text: string, fields: Field[]): string | null {
  // Keep offsets while masking dates, addresses, references and phone numbers.
  const technicalText = text.split("\n").map((line) => /^\s*(?:kontakt|telefon|siedziba|zapytanie|termin|data|dostawa|adres|miejsce|lokalizacja|ilość|liczba|produkt|nazwa produktu)\b/i.test(line) ? " ".repeat(line.length) : line).join("\n");
  const parts: { index: number; value: string }[] = [];
  const number = "[+-]?\\d+(?:[,.]\\d+)?";
  const magnitude = `(?:${number}\\s*(?:x|×)\\s*${number}(?:\\s*(?:x|×)\\s*${number})?|${number}\\s*(?:do|[-–])\\s*${number}|±\\s*${number}|${number})`;
  const units = "(?:m[3³]/h|kW|kVA|V|mm|cm|°\\s*C|bar|Pa|Hz|kg|l/min)";
  const measurement = new RegExp(`(?<![\\p{L}\\d])(?:moc grzewcza\\s+|długość\\s*:?\\s*|ciśnienie\\s*:?\\s*)?(?:(?:minimum|maksimum|min\\.|max\\.|co najmniej)\\s+)?${magnitude}\\s*${units}(?![\\p{L}\\d])`, "giu");
  for (const match of technicalText.matchAll(measurement)) {
    const value = match[0].toLowerCase().replace(/kw\b/g, "kW").replace(/v\b/g, "V").replace(/pa\b/g, "Pa").replace(/hz\b/g, "Hz").replace(/kva\b/g, "kVA");
    parts.push({ index: match.index!, value: normalizeSpecification(value) });
  }
  const textual = [
    /(?:materiał\s*:\s*|\bze?\s+)(stal(?:i)?\s+[^\n,.;]+|aluminium|mosiądz|tworzywo[^\n,.;]*)/gi,
    /kolor\s*:?\s*([^\n,.;]+)/gi,
    /(montaż\s+[^\n,.;]+)/gi,
    /(?<!\p{L})(IP\s*\d{2})(?!\d)/giu,
  ];
  for (const pattern of textual) {
    for (const match of technicalText.matchAll(pattern)) {
      parts.push({ index: match.index!, value: normalizeSpecification(match[1]) });
    }
  }
  // Labeled specs also preserve parameters outside the recognized unit list.
  for (const field of fields.filter(({ kind }) => kind === "specification")) {
    for (const chunk of field.value.split(/\n|;|,(?!\d)/)) {
      const value = normalizeSpecification(chunk.replace(/^(?:parametry(?: techniczne)?|stopień ochrony|materiał|kolor|wymiary|wydajność|zasilanie|wysokość|zakres pomiarowy|dokładność)\s*:?\s*/i, ""));
      if (!isUnknown(value) && !parts.some((part) => value.includes(part.value))) {
        parts.push({ index: field.index + field.value.indexOf(chunk), value });
      }
    }
  }
  return [...new Set(parts.sort((a, b) => a.index - b.index).map(({ value }) => value))].join(", ") || null;
}

const months = "stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|października|listopada|grudnia";
const dateToken = `(?:\\d{1,2}[./-]\\d{1,2}[./-]\\d{4}|\\d{1,2}\\s+(?:${months})\\s+\\d{4})`;
const relativeToken = "(?:do (?:poniedziałku|wtorku|środy|czwartku|piątku|soboty|niedzieli|końca [\\p{L}]+)|w ciągu (?:\\d+|[\\p{L}]+) (?:dni|tygodni(?:a)?|miesięcy|miesiąca))";

function validDate(value: string): boolean {
  const numeric = value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  const written = value.match(new RegExp(`^(\\d{1,2})\\s+(${months})\\s+(\\d{4})$`, "i"));
  if (!numeric && !written) return false;
  const day = Number((numeric ?? written)![1]);
  const month = numeric ? Number(numeric[2]) : months.split("|").indexOf(written![2].toLowerCase()) + 1;
  const year = Number((numeric ?? written)![3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function extractDeadline(text: string, fields: Field[]): string | null {
  const candidates: string[] = [];
  const add = (value: string) => {
    for (const match of value.matchAll(new RegExp(`${dateToken}|${relativeToken}`, "giu"))) {
      const token = match[0];
      if (!new RegExp(`^${relativeToken}$`, "iu").test(token) && !validDate(token)) continue;
      const before = value.slice(0, match.index);
      candidates.push(/\bprzed\s+$/i.test(before) ? `przed ${token}` : token);
    }
  };
  for (const field of fields.filter(({ kind }) => kind === "deadline")) add(field.value);
  const context = new RegExp(`(?:przed|do|najpóźniej)\\s+${dateToken}|${relativeToken}`, "giu");
  for (const match of text.matchAll(context)) add(match[0]);
  return unique(candidates);
}

// For other cities and full addresses, keep the source form instead of guessing.
const cities = [
  ["Poznań", "Poznań", "Poznania", "Poznaniu"],
  ["Gniezno", "Gniezno", "Gniezna", "Gnieźnie"],
  ["Warszawa", "Warszawa", "Warszawy", "Warszawie"],
  ["Łódź", "Łódź", "Łodzi"], ["Kraków", "Kraków", "Krakowa", "Krakowie"],
  ["Wrocław", "Wrocław", "Wrocławia", "Wrocławiu"],
  ["Katowice", "Katowice", "Katowic", "Katowicach"],
];

function normalizeLocation(value: string): string | null {
  const location = clean(value);
  if (isUnknown(location) || /(?:odbiór własny|nie ustalon|\s(?:lub|albo|oraz)\s)/i.test(location)) return null;
  return cities.find((forms) => forms.some((form) => form.toLowerCase() === location.toLowerCase()))?.[0] ?? location;
}

function extractLocation(text: string, fields: Field[]): string | null {
  const candidates = fields.filter(({ kind }) => kind === "deliveryLocation").map(({ value }) => normalizeLocation(value));
  const delivery = /(?:dostaw[ayę]|dostarczyć|wysłać|wysyłka)\s+do\s+(?:magazynu\s+w\s+)?([^\n!?]+)/gi;
  for (const match of text.matchAll(delivery)) {
    const value = match[1].split(/\s+(?:do|przed|najpóźniej|w ciągu)\s+|\.\s*(?:termin|potrzebujemy|prosimy)\b/i)[0];
    candidates.push(normalizeLocation(value));
  }
  return unique(candidates.filter((value): value is string => value !== null));
}

export function extractRFQ(rawText: string): RFQData {
  const text = prepareText(rawText);
  const fields = readFields(text);
  const products = findProducts(text, fields);
  const productType = unique(products.map(({ name }) => name));
  const quantityFields = fields.filter(({ kind }) => kind === "quantity");
  const quantities = quantityFields.length
    ? [...quantityFields.map(({ value }) => parseQuantity(value)), ...products.flatMap(({ quantity }) => quantity === null ? [] : [quantity])]
    : products.map(({ quantity }) => quantity);
  const multipleProducts = new Set(products.map(({ name }) => name)).size > 1;
  const result = rfqSchema.safeParse({
    productType,
    quantity: multipleProducts ? null : unique(quantities),
    specification: multipleProducts ? null : extractSpecification(text, fields),
    deadline: extractDeadline(text, fields),
    deliveryLocation: extractLocation(text, fields),
  });
  if (!result.success) {
    throw new Error(`Nieprawidłowy wynik ekstrakcji RFQ: ${result.error.message}`);
  }
  return result.data;
}
