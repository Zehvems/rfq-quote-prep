import { rfqSchema, type RFQData } from "./schema";

export function extractRFQ(rawText: string): RFQData {
  const productType =
    rawText.match(/\bagregat(?:y|ów)\s+chłodnicz(?:e|ych)\b/i)?.[0] ?? null;

  const quantityMatch = rawText.match(
    /\b(\d+)\s+agregat(?:y|ów)\s+chłodnicz(?:e|ych)\b/i,
  );
  const quantity = quantityMatch ? Number(quantityMatch[1]) : null;

  const power = rawText.match(/\bmocy\s+\d+(?:[,.]\d+)?\s*kW\b/i)?.[0];
  const supply = rawText.match(/\bzasilanie\s+\d+\s*V\b/i)?.[0];
  const specification = [power, supply].filter(Boolean).join("; ") || null;

  const deadline =
    rawText.match(/Termin dostawy:[ \t]*([^\r\n.]+)/i)?.[1].trim() || null;
  const deliveryLocation =
    rawText.match(/Miejsce dostawy:[ \t]*([^\r\n.]+)/i)?.[1].trim() || null;

  const result = rfqSchema.safeParse({
    productType,
    quantity,
    specification,
    deadline,
    deliveryLocation,
  });

  if (!result.success) {
    throw new Error(`Nieprawidłowy wynik ekstrakcji RFQ: ${result.error.message}`);
  }

  return result.data;
}
