-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "company" TEXT,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "rawText" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);
