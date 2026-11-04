import { extractRFQ, RFQExtractionError } from "../../../lib/rfq/extract";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { Prisma } from "../../../../generated/prisma/client";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Nieprawidłowy JSON zapytania." }, { status: 400 });
  }
  const rawText = body && typeof body === 'object' && 'rawText' in body ? body.rawText : undefined;
  const inquiryId = body && typeof body === 'object' && 'inquiryId' in body ? body.inquiryId : undefined;
  if (typeof rawText !== "string" || !rawText.trim()) {
    return NextResponse.json({ ok: false, error: "Brak tekstu zapytania." }, { status: 400 });
  }
  try {
    const data = await extractRFQ(rawText);
    if (typeof inquiryId === 'string') {
      await prisma.$transaction(async (tx) => {
        const inquiry = await tx.inquiry.findUnique({ where: { id: inquiryId }, select: { status: true } });
        if (!inquiry) throw new Error('INQUIRY_NOT_FOUND');
        await tx.inquiry.update({
          where: { id: inquiryId },
          data: {
            extractionData: data as Prisma.InputJsonValue,
            ...(inquiry.status === 'RECEIVED' ? { status: 'EXTRACTED' } : {}),
          },
        });
      });
    }
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    if (error instanceof Error && error.message === 'INQUIRY_NOT_FOUND') {
      return NextResponse.json({ ok: false, error: 'Nie znaleziono zapytania.' }, { status: 404 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ ok: false, error: 'Nie znaleziono zapytania.' }, { status: 404 });
    }
    if (error instanceof RFQExtractionError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    console.error("Nieoczekiwany błąd ekstrakcji RFQ:", error);
    return NextResponse.json({ ok: false, error: "Nieoczekiwany błąd serwera podczas ekstrakcji RFQ." }, { status: 500 });
  }
}
