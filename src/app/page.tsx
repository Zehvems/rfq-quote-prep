import NewInqForm from './newInqForm';
import InquiryCard from './InquiryCard';
import AppIcon from './AppIcon';
import { prisma } from '../lib/prisma';
import { pageStyles } from './uiStyles';

// Dane zawsze świeże; strona czyta bazę bezpośrednio (bez wewnętrznego fetcha do własnego API,
// który na Vercelu wymagałby ustawienia APP_URL).
export const dynamic = 'force-dynamic';

const dateFormatter = new Intl.DateTimeFormat('pl-PL', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Warsaw',
});

export default async function HomePage() {
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } });

  const total = inquiries.length;
  const waiting = inquiries.filter((i) => i.status === 'RECEIVED').length;
  const extracted = total - waiting;
  const needsInfo = inquiries.filter((i) => i.status === 'NEEDS_INFO').length;
  const toReview = inquiries.filter((i) => i.status === 'EXTRACTED' || i.status === 'NEEDS_INFO').length;
  const approved = inquiries.filter((i) => i.status === 'APPROVED').length;

  return (
    <>
      <nav aria-label="Nagłówek aplikacji" className={pageStyles.topbar}>
        <div className={pageStyles.topbarInner}>
          <a href="/" className={pageStyles.brand} aria-label="RFQ Quote Prep — strona główna">
            <span className={pageStyles.brandMark}>
              <AppIcon name="document" className="size-4" />
            </span>
            <span>
              RFQ<span className={pageStyles.brandSecondary}> / Quote Prep</span>
            </span>
            <span className={pageStyles.demoBadge}>Demo</span>
          </a>
          <a href="#new-inquiry-heading" className={pageStyles.newInquiryLink}>
            <AppIcon name="plus" className="size-4" />
            <span>Nowe zapytanie</span>
          </a>
        </div>
      </nav>

      <main className={pageStyles.main}>
        <header className={pageStyles.header}>
          <h1 className={pageStyles.title}>Przygotowanie zapytań ofertowych</h1>
          <p className={pageStyles.description}>
            AI wyodrębnia dane z wiadomości klienta, człowiek je weryfikuje i zatwierdza — dopiero
            potem zapytanie trafia do wyceny.
          </p>
        </header>

        <section aria-label="Podsumowanie procesu" className={pageStyles.overview}>
          <div className={pageStyles.stage}>
            <p className={pageStyles.stageTop}>
              <span className={pageStyles.stageNumber}>1</span> Ekstrakcja AI
            </p>
            <p className={pageStyles.stageValue}>{extracted}</p>
            <p className={pageStyles.stageCaption}>
              przetworzonych z {total} {total === 1 ? 'zapytania' : 'zapytań'}
            </p>
            <p className={waiting > 0 ? pageStyles.stageChip : pageStyles.stageChipIdle}>
              {waiting > 0 ? `${waiting} czeka na ekstrakcję` : 'Nic nie czeka'}
            </p>
          </div>
          <div aria-hidden="true" className={pageStyles.connector}>
            <AppIcon name="arrow" className="size-5" />
          </div>
          <div className={pageStyles.stage}>
            <p className={pageStyles.stageTop}>
              <span className={pageStyles.stageNumber}>2</span> Przegląd człowieka
            </p>
            <p className={pageStyles.stageValue}>{toReview}</p>
            <p className={pageStyles.stageCaption}>do sprawdzenia przez człowieka</p>
            <p className={needsInfo > 0 ? pageStyles.stageChip : pageStyles.stageChipIdle}>
              {needsInfo > 0 ? `${needsInfo} wymaga uzupełnienia` : 'Brak zaległości'}
            </p>
          </div>
          <div aria-hidden="true" className={pageStyles.connector}>
            <AppIcon name="arrow" className="size-5" />
          </div>
          <div className={pageStyles.stage}>
            <p className={pageStyles.stageTop}>
              <span className={pageStyles.stageNumber}>3</span> Decyzja
            </p>
            <p className={pageStyles.stageValue}>{approved}</p>
            <p className={pageStyles.stageCaption}>zatwierdzonych do wyceny</p>
            <p className={pageStyles.stageChipIdle}>Zatwierdza człowiek</p>
          </div>
        </section>

        <div className={pageStyles.layout}>
          <section className={pageStyles.formPanel} aria-labelledby="new-inquiry-heading">
            <div className={pageStyles.formIntro}>
              <span className={pageStyles.formIcon}>
                <AppIcon name="plus" className="size-4" />
              </span>
              <h2 id="new-inquiry-heading" tabIndex={-1} className={pageStyles.sectionTitle}>
                Nowe zapytanie
              </h2>
            </div>
            <p className={pageStyles.formDescription}>
              Wklej wiadomość klienta. Dane wyodrębnisz w następnym kroku.
            </p>
            <NewInqForm />
            <p className={pageStyles.formTip}>
              Wyniki AI zawsze podlegają przeglądowi. Zatwierdzenie jest możliwe dopiero po
              uzupełnieniu wymaganych pól.
            </p>
          </section>

          <section className={pageStyles.listColumn} aria-labelledby="inquiries-heading">
            <div className={pageStyles.sectionHeader}>
              <h2 id="inquiries-heading" className={pageStyles.sectionTitle}>
                Zapytania <span className={pageStyles.count}>{total}</span>
              </h2>
              <span className={pageStyles.orderLabel}>Od najnowszych</span>
            </div>
            {total === 0 && (
              <div className={pageStyles.emptyState}>
                <span className={pageStyles.emptyIcon}>
                  <AppIcon name="inbox" className="size-6" />
                </span>
                <h3 className={pageStyles.emptyTitle}>Nie ma jeszcze zapytań</h3>
                <p>
                  Dodaj pierwszą wiadomość w formularzu.
                  <br />
                  Możesz wstawić przykład jednym kliknięciem.
                </p>
                <a href="#new-inquiry-heading" className={pageStyles.emptyLink}>
                  Dodaj zapytanie <AppIcon name="arrow" className="size-4" />
                </a>
              </div>
            )}
            <ul className={pageStyles.list}>
              {inquiries.map((inquiry, index) => (
                <li key={inquiry.id}>
                  <InquiryCard
                    inquiryId={inquiry.id}
                    index={index}
                    company={inquiry.company}
                    rawText={inquiry.rawText}
                    initialData={inquiry.reviewData ?? inquiry.extractionData}
                    initialStatus={inquiry.status}
                    createdLabel={dateFormatter.format(inquiry.createdAt)}
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer className={pageStyles.footer}>
          <span className="font-mono text-[11px] tracking-tight text-slate-400">RFQ Quote Prep · Next.js App Router + OpenAI Structured Outputs + Zod + Neon Postgres</span>
          <span>Dane sprawdza człowiek przed przygotowaniem wyceny.</span>
        </footer>
      </main>
    </>
  );
}
