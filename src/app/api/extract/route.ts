import { extractRFQ } from "../../../lib/rfq/extract";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawText = body?.rawText;
    if (typeof rawText !== "string" || !rawText.trim()) {
      return NextResponse.json({ ok: false, error: "Brak tekstu zapytania." }, { status: 400 });
    }
    const data = await extractRFQ(rawText);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Błąd ekstrakcji RFQ." }, { status: 400 });
  }
}
