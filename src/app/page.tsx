import NewInqForm from "./newInqForm";
import ExtractButton from "./ExtractButton";
import { pageStyles } from './uiStyles';

export default async function HomePage() {
  const response = await fetch(
    new URL("/api/inquiries", process.env.APP_URL ?? "http://localhost:3000"),
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Nie udało się pobrać zapytań: ${response.status}`);
  }

  const inquiries: { id: string; company: string | null; rawText: string }[] =
    await response.json();

  return (
    <main className={pageStyles.main}>
      <header className={pageStyles.header}>
        <p className={pageStyles.eyebrow}>Przygotowanie ofert B2B</p>
        <h1 className={pageStyles.title}>RFQ Quote Prep</h1>
        <p className={pageStyles.description}>Zbierz zapytania i wyodrębnij kluczowe dane potrzebne do przygotowania oferty.</p>
      </header>
      <div className={pageStyles.layout}>
        <section className={pageStyles.inquiries} aria-labelledby="inquiries-heading">
          <div className={pageStyles.sectionHeader}>
            <h2 id="inquiries-heading" className={pageStyles.sectionTitle}>Zapytania ofertowe</h2>
            <span className={pageStyles.count}>{inquiries.length} zapytań</span>
          </div>
          {inquiries.length === 0 && (
            <p className={pageStyles.emptyState}>Brak zapytań. Dodaj pierwsze zapytanie, aby przygotować dane do oferty.</p>
          )}
          <ul className={pageStyles.list}>
            {inquiries.map((inquiry) => (
              <li key={inquiry.id} className={pageStyles.card}>
                <h3 className={pageStyles.company}>{inquiry.company ?? "Nieznana firma"}</h3>
                <p className={pageStyles.inquiryText}>{inquiry.rawText}</p>
                <ExtractButton rawText={inquiry.rawText} />
              </li>
            ))}
          </ul>
        </section>
        <section className={pageStyles.formPanel} aria-labelledby="new-inquiry-heading">
          <h2 id="new-inquiry-heading" className={pageStyles.sectionTitle}>Nowe zapytanie</h2>
          <p className={pageStyles.formDescription}>Wklej treść zapytania od klienta.</p>
          <NewInqForm />
        </section>
      </div>
    </main>
  );
}
