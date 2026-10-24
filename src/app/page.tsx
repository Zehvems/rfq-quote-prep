import NewInqForm from './newInqForm';
import ExtractButton from './ExtractButton';
import AppIcon from './AppIcon';
import { pageStyles } from './uiStyles';

export default async function HomePage() {
  const response = await fetch(
    new URL('/api/inquiries', process.env.APP_URL ?? 'http://localhost:3000'),
    { cache: 'no-store' },
  );

  if (!response.ok) {
    throw new Error(`Nie udało się pobrać zapytań: ${response.status}`);
  }

  const inquiries: {
    id: string;
    company: string | null;
    rawText: string;
    reviewData: Record<string, unknown> | null;
  }[] = await response.json();

  return (
    <main className={pageStyles.main}>
      <nav aria-label="Nagłówek aplikacji" className={pageStyles.topbar}>
        <a href="/" className={pageStyles.brand} aria-label="RFQ Quote Prep — strona główna">
          <span className={pageStyles.brandMark}>
            <AppIcon name="document" className="size-5" />
          </span>
          <span>
            RFQ<span className={pageStyles.brandSecondary}> / Quote Prep</span>
          </span>
        </a>
        <a href="#new-inquiry-heading" className={pageStyles.newInquiryLink}>
          <AppIcon name="plus" className="size-4" />
          <span>Nowe zapytanie</span>
        </a>
      </nav>
      <header className={pageStyles.header}>
        <div>
          <h1 className={pageStyles.title}>Przygotowanie zapytań</h1>
          <p className={pageStyles.description}>
            Zbierz wymagania klienta i sprawdź dane przed wyceną.
          </p>
        </div>
        <ol className={pageStyles.workflow} aria-label="Jak przygotować zapytanie">
          <li className={pageStyles.workflowStep}>
            <span className={pageStyles.stepNumber}>1</span>
            <span>Dodaj treść</span>
          </li>
          <li className={pageStyles.workflowStep}>
            <span className={pageStyles.stepNumber}>2</span>
            <span>Wyodrębnij dane</span>
          </li>
          <li className={pageStyles.workflowStep}>
            <span className={pageStyles.stepNumber}>3</span>
            <span>Sprawdź szczegóły</span>
          </li>
        </ol>
      </header>
      <div className={pageStyles.layout}>
        <section className={pageStyles.formPanel} aria-labelledby="new-inquiry-heading">
          <div className={pageStyles.formIntro}>
            <span className={pageStyles.formIcon}>
              <AppIcon name="plus" className="size-5" />
            </span>
            <h2 id="new-inquiry-heading" tabIndex={-1} className={pageStyles.sectionTitle}>
              Nowe zapytanie
            </h2>
          </div>
          <p className={pageStyles.formDescription}>
            Wklej wiadomość klienta, aby rozpocząć przygotowanie danych.
          </p>
          <NewInqForm />
          <p className={pageStyles.formTip}>
            Po dodaniu zapytania wyodrębnij dane, a następnie sprawdź je i uzupełnij brakujące
            informacje.
          </p>
        </section>
        <section className={pageStyles.inquiries} aria-labelledby="inquiries-heading">
          <div className={pageStyles.sectionHeader}>
            <h2 id="inquiries-heading" className={pageStyles.sectionTitle}>
              Zapytania <span className={pageStyles.count}>{inquiries.length}</span>
            </h2>
            <span className={pageStyles.orderLabel}>Od najnowszych</span>
          </div>
          {inquiries.length === 0 && (
            <div className={pageStyles.emptyState}>
              <span className={pageStyles.emptyIcon}>
                <AppIcon name="inbox" className="size-7" />
              </span>
              <h3 className={pageStyles.emptyTitle}>Nie ma jeszcze zapytań</h3>
              <p>
                Dodaj pierwszą wiadomość w formularzu.
                <br />
                Tutaj pojawią się wymagania do przeglądu.
              </p>
              <a href="#new-inquiry-heading" className={pageStyles.emptyLink}>
                Dodaj zapytanie <AppIcon name="arrow" className="size-4" />
              </a>
            </div>
          )}
          <ul className={pageStyles.list}>
            {inquiries.map((inquiry, index) => (
              <li key={inquiry.id} className={pageStyles.card}>
                <div className={pageStyles.cardHeader}>
                  <div className={pageStyles.companyGroup}>
                    <span className={pageStyles.companyIcon}>
                      <AppIcon name="document" className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className={pageStyles.cardEyebrow}>
                        Zapytanie {String(index + 1).padStart(2, '0')}
                      </p>
                      <h3 className={pageStyles.company}>{inquiry.company ?? 'Nieznana firma'}</h3>
                    </div>
                  </div>
                </div>
                <details className={pageStyles.sourcePanel}>
                  <summary
                    aria-label={`Treść źródłowa — ${inquiry.company ?? 'Nieznana firma'}`}
                    className={pageStyles.sourceSummary}
                  >
                    <span className={pageStyles.sourceLabel}>
                      Wiadomość klienta{' '}
                      <span aria-hidden="true" className={pageStyles.sourceToggle}>
                        +
                      </span>
                    </span>
                    <span className={pageStyles.sourcePreview}>{inquiry.rawText}</span>
                    <span className={pageStyles.sourcePrompt}>
                      <span className="group-open:hidden">Rozwiń wiadomość</span>
                      <span className="hidden group-open:inline">Zwiń wiadomość</span>
                    </span>
                  </summary>
                  <p className={pageStyles.inquiryText}>{inquiry.rawText}</p>
                </details>
                <ExtractButton inquiryId={inquiry.id} rawText={inquiry.rawText} />
              </li>
            ))}
          </ul>
        </section>
      </div>
      <footer className={pageStyles.footer}>
        <span>RFQ / Quote Prep</span>
        <span>Dane sprawdza człowiek przed przygotowaniem wyceny.</span>
      </footer>
    </main>
  );
}
