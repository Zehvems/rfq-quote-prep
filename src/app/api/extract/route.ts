import { extractRFQ, RFQExtractionError } from "../../../lib/rfq/extract";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Nieprawidłowy JSON zapytania." }, { status: 400 });
  }
  const rawText = body?.rawText;
  if (typeof rawText !== "string" || !rawText.trim()) {
    return NextResponse.json({ ok: false, error: "Brak tekstu zapytania." }, { status: 400 });
  }
  try {
    const data = await extractRFQ(rawText);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    if (error instanceof RFQExtractionError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    console.error("Nieoczekiwany błąd ekstrakcji RFQ:", error);
    return NextResponse.json({ ok: false, error: "Nieoczekiwany błąd serwera podczas ekstrakcji RFQ." }, { status: 500 });
  }
}
