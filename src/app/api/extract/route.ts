import { extractRFQ } from "../../../lib/rfq/extract";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const rawText = body.rawText;
    if (!rawText) {
        return NextResponse.json({ ok: false, error: "Brak tekstu zapytania." }, { status: 400 });
    }
    try {
    const data = await extractRFQ(rawText); // This will throw an error if the extraction fails
    return NextResponse.json({ ok: true, data });
    } catch (error) {
        return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
    }
}
