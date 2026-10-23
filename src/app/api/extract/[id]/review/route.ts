import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { rfqSchema } from '../../../../../lib/rfq/schema';
import { Prisma } from '../../../../../../generated/prisma/client';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Nieprawidłowy JSON zapytania.' },
        { status: 400 },
      );
    }
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json(
        { ok: false, error: 'Nieprawidłowy JSON zapytania.' },
        { status: 400 },
      );
    }
    if (!('data' in body)) {
      return NextResponse.json({ ok: false, error: 'Brak pola data.' }, { status: 400 });
    }
    const parsed = rfqSchema.safeParse(body.data);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Dane nie są zgodne ze schematem RFQ.' },
        { status: 400 },
      );
    }
    // Zapis szkicu nie wymaga kompletności i nie zmienia statusu zapytania.
    const saved = await prisma.inquiry.update({
      where: { id },
      data: {
        reviewData: parsed.data,
      },
      select: {
        id: true,
        reviewData: true,
      },
    });

    return NextResponse.json({
      ok: true,
      data: saved.reviewData,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return NextResponse.json({ ok: false, error: 'Nie znaleziono zapytania.' }, { status: 404 });
    }
    console.error('Nie udało się zapisać przeglądu RFQ.', e);
    return NextResponse.json(
      { ok: false, error: 'Nie udało się zapisać poprawek. Spróbuj ponownie.' },
      { status: 500 },
    );
  }
}
