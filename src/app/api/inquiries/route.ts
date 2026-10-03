import { NextResponse } from "next/server";

import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Nieprawidłowe dane zapytania." },
        { status: 400 },
      );
    }

    const { rawText, company } = body as {
      rawText?: unknown;
      company?: unknown;
    };

    if (typeof rawText !== "string" || rawText.trim() === "") {
      return NextResponse.json(
        { error: "Pole rawText jest wymagane." },
        { status: 400 },
      );
    }

    if (
      company !== undefined &&
      company !== null &&
      typeof company !== "string"
    ) {
      return NextResponse.json(
        { error: "Pole company musi być tekstem." },
        { status: 400 },
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        rawText: rawText.trim(),
        company: typeof company === "string" ? company.trim() || null : null,
      },
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Nieprawidłowy format JSON." },
        { status: 400 },
      );
    }

    console.error("Nie udało się zapisać zapytania:", error);

    return NextResponse.json(
      { error: "Nie udało się zapisać zapytania." },
      { status: 500 },
    );
  }
}

export async function GET() {

    const inquires = await prisma.inquiry.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });


    return NextResponse.json(inquires, { status: 200 });

}