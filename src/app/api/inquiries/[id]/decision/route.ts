import { NextResponse } from 'next/server';
import { Prisma } from '../../../../../../generated/prisma/client';
import { prisma } from '../../../../../lib/prisma';
import { checkRFQCompleteness } from '../../../../../lib/rfq/completeness';
import { rfqSchema } from '../../../../../lib/rfq/schema';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Nieprawidłowy JSON.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || !('action' in body) || !('data' in body)) {
    return NextResponse.json({ ok: false, error: 'Wymagane są pola action i data.' }, { status: 400 });
  }
  const action = body.action;
  if (action !== 'APPROVE' && action !== 'REQUEST_INFO') {
    return NextResponse.json({ ok: false, error: 'Nieznana decyzja.' }, { status: 400 });
  }
  const parsed = rfqSchema.safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Dane nie są zgodne ze schematem RFQ.' }, { status: 400 });
  }
  const completeness = checkRFQCompleteness(parsed.data);
  if (action === 'APPROVE' && completeness.missingFields.length) {
    return NextResponse.json({ ok: false, error: 'Uzupełnij wymagane pola przed zatwierdzeniem.', missingFields: completeness.missingFields }, { status: 422 });
  }
  const status = action === 'APPROVE' ? 'APPROVED' : 'NEEDS_INFO';
  try {
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { reviewData: parsed.data as Prisma.InputJsonValue, status },
      select: { id: true, status: true, reviewData: true },
    });
    return NextResponse.json({ ok: true, data: inquiry });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ ok: false, error: 'Nie znaleziono zapytania.' }, { status: 404 });
    }
    console.error('Nie udało się zapisać decyzji RFQ:', error);
    return NextResponse.json({ ok: false, error: 'Nie udało się zapisać decyzji.' }, { status: 500 });
  }
}
