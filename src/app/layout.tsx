import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "RFQ Quote Prep",
  description: "Przygotowanie ofert na zapytania RFQ.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pl">
      <body className="bg-[#F8FAFC] text-slate-900 antialiased selection:bg-slate-900 selection:text-white">{children}</body>
    </html>
  );
}
