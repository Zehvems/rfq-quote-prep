'use client';
import { checkRFQCompleteness } from '../lib/rfq/completeness';
import type { ReviewSaveState } from './ReviewSavePanel';

import { useId, useRef, useState } from 'react';
import { rfqSchema, type RFQData } from '../lib/rfq/schema';
import { extractStyles } from './uiStyles';
import ReviewSavePanel from './ReviewSavePanel';
import ReviewDecisionPanel from './ReviewDecisionPanel';
import AppIcon from './AppIcon';

type ExtractButtonProps = {
  inquiryId: string;
  rawText: string;
  initialData: unknown;
  status: string;
  onStatusChange: (status: string) => void;
};

type RFQItem = RFQData['items'][number];

export default function ExtractButton({
  inquiryId,
  rawText,
  initialData,
  status,
  onStatusChange,
}: ExtractButtonProps) {
  const id = useId();
  const initial = rfqSchema.safeParse(initialData);
  const [data, setData] = useState<RFQData | null>(initial.success ? initial.data : null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<ReviewSaveState>({
    status: 'idle',
  });
  const savingRef = useRef(false);
  const isSaving = saveState.status === 'saving';
  const [decisionState, setDecisionState] = useState<{
    pending: boolean;
    error: string | null;
  }>({ pending: false, error: null });

  async function handleDecision(action: 'APPROVE' | 'REQUEST_INFO') {
    if (!data || decisionState.pending || savingRef.current || isLoading) return;
    setDecisionState({ pending: true, error: null });
    try {
      const response = await fetch(`/api/inquiries/${encodeURIComponent(inquiryId)}/decision`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data }),
      });
      const result: unknown = await response.json().catch(() => null);
      if (
        !response.ok ||
        !result ||
        typeof result !== 'object' ||
        !('ok' in result) ||
        result.ok !== true ||
        !('data' in result)
      ) {
        const message =
          result && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
            ? result.error
            : 'Nie udało się zapisać decyzji.';
        setDecisionState({ pending: false, error: message });
        return;
      }
      const saved = result.data as { status?: unknown; reviewData?: unknown };
      if (typeof saved.status !== 'string') throw new Error('Nieprawidłowe potwierdzenie decyzji.');
      onStatusChange(saved.status);
      const savedData = rfqSchema.safeParse(saved.reviewData);
      if (savedData.success) setData(savedData.data);
      setDecisionState({ pending: false, error: null });
    } catch (cause) {
      setDecisionState({ pending: false, error: cause instanceof Error ? cause.message : 'Błąd połączenia.' });
    }
  }

  async function handleSaveReview() {
    if (!data || savingRef.current || decisionState.pending || isLoading) return;
    savingRef.current = true;
    setSaveState({ status: 'saving' });
    try {
      const response = await fetch(`/api/extract/${encodeURIComponent(inquiryId)}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
        signal: AbortSignal.timeout(30000),
      });
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          result &&
          typeof result === 'object' &&
          'error' in result &&
          typeof result.error === 'string'
            ? result.error
            : 'Nie udało się zapisać poprawek. Spróbuj ponownie.';
        setSaveState({ status: 'error', message });
        return;
      }
      if (
        !result ||
        typeof result !== 'object' ||
        !('ok' in result) ||
        result.ok !== true ||
        !('data' in result) ||
        !rfqSchema.safeParse(result.data).success
      ) {
        setSaveState({
          status: 'error',
          message: 'Nie otrzymano poprawnego potwierdzenia zapisu. Spróbuj ponownie.',
        });
        return;
      }
      setSaveState({ status: 'success' });
    } catch {
      setSaveState({
        status: 'error',
        message: 'Nie otrzymano potwierdzenia zapisu. Sprawdź połączenie i spróbuj ponownie.',
      });
    } finally {
      savingRef.current = false;
    }
  }

  async function handleExtract() {
    if (savingRef.current || decisionState.pending || isLoading) return;
    setSaveState({ status: 'idle' });
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, inquiryId }),
      });

      if (!response.ok) {
        setError('Wystąpił błąd podczas wyodrębniania danych.');
        return;
      }
      const extracted: unknown = await response.json();
      if (!extracted || typeof extracted !== 'object' || !('ok' in extracted) || extracted.ok !== true || !('data' in extracted)) {
        setError('Nie otrzymano poprawnego wyniku ekstrakcji.');
        return;
      }
      const parsed = rfqSchema.safeParse(extracted.data);
      if (!parsed.success) { setError('Wynik ekstrakcji nie jest zgodny ze schematem.'); return; }
      setData((current) => current ?? parsed.data);
      if (status === 'RECEIVED') onStatusChange('EXTRACTED');
    } catch {
      setError('Nie udało się odczytać danych. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  }
  function updateItem<K extends keyof RFQItem>(index: number, field: K, value: RFQItem[K]) {
    if (savingRef.current || decisionState.pending) return;
    setSaveState({ status: 'idle' });
    setData((previous) =>
      previous
        ? {
            ...previous,
            items: previous.items.map((item, itemIndex) =>
              itemIndex === index ? { ...item, [field]: value } : item,
            ),
          }
        : previous,
    );
  }

  function updateDelivery(field: 'deadline' | 'deliveryLocation', value: string) {
    if (savingRef.current || decisionState.pending) return;
    setSaveState({ status: 'idle' });
    setData((previous) =>
      previous ? { ...previous, [field]: value === '' ? null : value } : previous,
    );
  }

  const completeness = data ? checkRFQCompleteness(data) : null;
  const missingPaths = new Set(completeness?.missingFields.map((field) => field.path));
  const needsInfo = completeness?.status === 'NEEDS_INFO';
  const stateClass = (path: string) =>
    missingPaths.has(path) ? extractStyles.inputMissing : extractStyles.inputDefault;
  const inputClass = (path: string) =>
    `${extractStyles.field} ${extractStyles.inputSize} ${stateClass(path)}`;
  const textareaClass = (path: string) =>
    `${extractStyles.field} ${extractStyles.textarea} ${stateClass(path)}`;
  const fieldId = (path: string) => `${id}-${path}`;
  const fieldError = (path: string) => {
    if (!missingPaths.has(path)) return undefined;
    if (path.endsWith('.productType')) return 'Wpisz nazwę produktu lub usługi.';
    if (path.endsWith('.quantity')) return 'Podaj potwierdzoną ilość: dodatnią liczbę całkowitą.';
    if (path.endsWith('.specification')) return 'Uzupełnij wymagania dla tej pozycji.';
    if (path === 'deadline') return 'Uzupełnij wspólny termin dostawy lub realizacji.';
    if (path === 'deliveryLocation') return 'Wpisz potwierdzone miejsce dostawy.';
    return undefined;
  };
  const approved = status === 'APPROVED';
  const step1State = data ? 'done' : 'current';
  const step2State = !data ? 'locked' : approved ? 'done' : needsInfo ? 'attention' : 'current';
  const step3State = !data ? 'locked' : approved ? 'done' : needsInfo ? 'locked' : 'current';
  const numberClass = (state: 'done' | 'current' | 'attention' | 'locked') =>
    extractStyles.stepNumber[state];
  const stepMark = (state: 'done' | 'current' | 'attention' | 'locked', n: number) =>
    state === 'done' ? (
      <AppIcon name="check" className="size-3.5" />
    ) : state === 'attention' ? (
      <AppIcon name="alert" className="size-3.5" />
    ) : (
      n
    );

  return (
    <>
      {/* Krok 1 — Ekstrakcja AI */}
      <section aria-label="Ekstrakcja AI" className={extractStyles.step}>
        <div className={extractStyles.stepHeader}>
          <span className={numberClass(step1State)}>{stepMark(step1State, 1)}</span>
          <div className="min-w-0">
            <h4 className={extractStyles.stepTitle}>Ekstrakcja AI</h4>
            <p className={extractStyles.stepSubtitle}>Dane odczytane z wiadomości klienta</p>
          </div>
          <span className={data ? extractStyles.chip.success : extractStyles.chip.neutral}>
            {data ? 'Wykonana' : isLoading ? 'W trakcie…' : 'Do wykonania'}
          </span>
        </div>
        <div className={extractStyles.stepBody}>
          <div className={extractStyles.extractionRow}>
            <div>
              <p className={extractStyles.stageHint}>
                {data
                  ? 'Wynik dostępny do przeglądu.'
                  : isLoading
                    ? 'Odczytywanie wymagań klienta…'
                    : 'Rozpocznij od wyodrębnienia wymagań z wiadomości.'}
              </p>
              {data && (
                <p className={extractStyles.repeatHint}>
                  Ponowna ekstrakcja odświeży wynik AI. Zapisany szkic użytkownika pozostaje w
                  formularzu.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleExtract}
              disabled={isLoading || isSaving || decisionState.pending}
              aria-busy={isLoading}
              aria-label={
                isLoading ? 'Wyodrębnianie danych' : data ? 'Wyodrębnij ponownie' : 'Wyodrębnij dane'
              }
              className={data ? extractStyles.secondaryButton : extractStyles.primaryButton}
            >
              {isLoading && (
                <span
                  aria-hidden="true"
                  className={data ? extractStyles.spinner : extractStyles.spinnerOnPrimary}
                />
              )}
              {!isLoading && <AppIcon name={data ? 'refresh' : 'sparkles'} className="size-4" />}
              <span role="status">
                {isLoading ? 'Wyodrębnianie…' : data ? 'Wyodrębnij ponownie' : 'Wyodrębnij dane'}
              </span>
            </button>
          </div>
          {error && (
            <p role="alert" className={extractStyles.error}>
              {error}
            </p>
          )}
        </div>
      </section>

      {/* Krok 2 — Przegląd człowieka */}
      <section
        aria-label="Przegląd danych RFQ"
        data-inquiry-id={inquiryId}
        className={extractStyles.step}
      >
        <div className={`${extractStyles.stepHeader} ${data ? '' : extractStyles.stepHeaderLocked}`}>
          <span className={numberClass(step2State)}>{stepMark(step2State, 2)}</span>
          <div className="min-w-0">
            <h4 className={extractStyles.stepTitle}>Przegląd człowieka</h4>
            <p className={extractStyles.stepSubtitle}>
              {data ? 'Sprawdź i uzupełnij dane' : 'Dostępny po ekstrakcji'}
            </p>
          </div>
          {data && completeness && (
            <span className={needsInfo ? extractStyles.chip.warning : extractStyles.chip.success}>
              {needsInfo
                ? `Braki: ${completeness.missingFields.length}`
                : approved
                  ? 'Sprawdzone'
                  : 'Kompletne'}
            </span>
          )}
        </div>

        {data && completeness && (
          <div className={extractStyles.stepBody}>
            <div className={extractStyles.reviewTop}>
              <p className={extractStyles.localNote}>
                Porównaj pola z oryginalnym RFQ. Niezapisane poprawki znikną po odświeżeniu strony
                lub ponownej ekstrakcji.
              </p>
              <dl className={extractStyles.reviewStats}>
                <div className={extractStyles.statTile}>
                  <dt className={extractStyles.statLabel}>Pozycje</dt>
                  <dd className={extractStyles.statValue}>{data.items.length}</dd>
                </div>
                <div className={extractStyles.statTile}>
                  <dt className={extractStyles.statLabel}>Brakujące pola</dt>
                  <dd className={needsInfo ? extractStyles.statMissing : extractStyles.statValue}>
                    {completeness.missingFields.length}
                  </dd>
                </div>
              </dl>
            </div>

            <div className={needsInfo ? extractStyles.statusMissing : extractStyles.statusReady}>
              <AppIcon
                name={needsInfo ? 'alert' : 'check'}
                className={needsInfo ? extractStyles.statusIconMissing : extractStyles.statusIconReady}
              />
              <div className="min-w-0">
                <p role="status" className={extractStyles.statusTitle}>
                  {needsInfo ? 'Wymaga uzupełnienia' : 'Gotowe do przeglądu'}
                </p>
                {needsInfo ? (
                  <ul className={extractStyles.missingList}>
                    {completeness.missingFields.map((field) => (
                      <li key={field.path}>
                        <a href={`#${fieldId(field.path)}`} className={extractStyles.missingLink}>
                          {field.message}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={extractStyles.statusText}>
                    Wymagane pola są uzupełnione. Potwierdź poprawność danych z treścią RFQ przed
                    przygotowaniem wyceny.
                  </p>
                )}
              </div>
            </div>

            {data.items.length === 0 && (
              <p id={fieldId('items')} tabIndex={-1} className={extractStyles.hint}>
                Nie rozpoznano żadnej pozycji. Sprawdź treść zapytania przed ponowną ekstrakcją.
              </p>
            )}
            {data.items.map((item, index) => {
              const path = `items[${index}]`;
              return (
                <fieldset
                  key={index}
                  disabled={isSaving || decisionState.pending}
                  className={extractStyles.itemCard}
                >
                  <legend className={extractStyles.legend}>Pozycja {index + 1}</legend>
                  <div className={extractStyles.itemGrid}>
                    <div>
                      <label htmlFor={fieldId(`${path}.productType`)} className={extractStyles.label}>
                        Produkt lub usługa
                      </label>
                      <input
                        id={fieldId(`${path}.productType`)}
                        type="text"
                        value={item.productType ?? ''}
                        placeholder="Brak danych — wpisz nazwę"
                        aria-describedby={
                          missingPaths.has(`${path}.productType`)
                            ? `${fieldId(`${path}.productType`)}-error`
                            : undefined
                        }
                        aria-invalid={missingPaths.has(`${path}.productType`)}
                        className={inputClass(`${path}.productType`)}
                        onChange={(event) =>
                          updateItem(
                            index,
                            'productType',
                            event.target.value === '' ? null : event.target.value,
                          )
                        }
                      />
                      <FieldError
                        id={`${fieldId(`${path}.productType`)}-error`}
                        message={fieldError(`${path}.productType`)}
                      />
                    </div>
                    <div>
                      <label htmlFor={fieldId(`${path}.quantity`)} className={extractStyles.label}>
                        Ilość
                      </label>
                      <input
                        id={fieldId(`${path}.quantity`)}
                        type="number"
                        min={1}
                        step={1}
                        value={item.quantity ?? ''}
                        placeholder="Brak danych"
                        aria-describedby={
                          missingPaths.has(`${path}.quantity`)
                            ? `${fieldId(`${path}.quantity`)}-error`
                            : undefined
                        }
                        aria-invalid={missingPaths.has(`${path}.quantity`)}
                        className={inputClass(`${path}.quantity`)}
                        onChange={(event) => {
                          const value = event.target.value;
                          const quantity = value === '' ? null : Number(value);
                          if (
                            value !== `` &&
                            (!Number.isFinite(quantity) || quantity < 1 || !Number.isInteger(quantity))
                          ) {
                            return;
                          }

                          updateItem(index, 'quantity', quantity);
                        }}
                      />
                      <FieldError
                        id={`${fieldId(`${path}.quantity`)}-error`}
                        message={fieldError(`${path}.quantity`)}
                      />
                    </div>
                    <div className={extractStyles.fullWidth}>
                      <label
                        htmlFor={fieldId(`${path}.specification`)}
                        className={extractStyles.label}
                      >
                        Specyfikacja
                      </label>
                      <textarea
                        id={fieldId(`${path}.specification`)}
                        rows={3}
                        value={item.specification ?? ''}
                        placeholder="Brak danych — uzupełnij wymagania"
                        aria-describedby={
                          missingPaths.has(`${path}.specification`)
                            ? `${fieldId(`${path}.specification`)}-error`
                            : undefined
                        }
                        aria-invalid={missingPaths.has(`${path}.specification`)}
                        className={textareaClass(`${path}.specification`)}
                        onChange={(event) =>
                          updateItem(
                            index,
                            'specification',
                            event.target.value === '' ? null : event.target.value,
                          )
                        }
                      />
                      <FieldError
                        id={`${fieldId(`${path}.specification`)}-error`}
                        message={fieldError(`${path}.specification`)}
                      />
                    </div>
                  </div>
                </fieldset>
              );
            })}

            <fieldset
              disabled={isSaving || decisionState.pending}
              className={extractStyles.itemCard}
            >
              <legend className={extractStyles.legend}>Wspólne warunki dostawy</legend>
              <div className={extractStyles.deliveryGrid}>
                <div>
                  <label htmlFor={fieldId('deadline')} className={extractStyles.label}>
                    Termin dostawy lub realizacji
                  </label>
                  <input
                    id={fieldId('deadline')}
                    type="text"
                    value={data.deadline ?? ''}
                    placeholder="Np. do piątku lub do 30 października"
                    aria-describedby={
                      missingPaths.has('deadline') ? `${fieldId('deadline')}-error` : undefined
                    }
                    aria-invalid={missingPaths.has('deadline')}
                    className={inputClass('deadline')}
                    onChange={(event) => updateDelivery('deadline', event.target.value)}
                  />
                  <FieldError id={`${fieldId('deadline')}-error`} message={fieldError('deadline')} />
                </div>
                <div>
                  <label htmlFor={fieldId('deliveryLocation')} className={extractStyles.label}>
                    Miejsce dostawy
                  </label>
                  <input
                    id={fieldId('deliveryLocation')}
                    type="text"
                    value={data.deliveryLocation ?? ''}
                    placeholder="Brak danych — wpisz miejsce dostawy"
                    aria-describedby={
                      missingPaths.has('deliveryLocation')
                        ? `${fieldId('deliveryLocation')}-error`
                        : undefined
                    }
                    aria-invalid={missingPaths.has('deliveryLocation')}
                    className={inputClass('deliveryLocation')}
                    onChange={(event) => updateDelivery('deliveryLocation', event.target.value)}
                  />
                  <FieldError
                    id={`${fieldId('deliveryLocation')}-error`}
                    message={fieldError('deliveryLocation')}
                  />
                </div>
              </div>
            </fieldset>

            <ReviewSavePanel state={saveState} onSave={handleSaveReview} />
          </div>
        )}
      </section>

      {/* Krok 3 — Decyzja */}
      <section aria-label="Decyzja" className={extractStyles.step}>
        <div className={`${extractStyles.stepHeader} ${data ? '' : extractStyles.stepHeaderLocked}`}>
          <span className={numberClass(step3State)}>{stepMark(step3State, 3)}</span>
          <div className="min-w-0">
            <h4 className={extractStyles.stepTitle}>Decyzja</h4>
            <p className={extractStyles.stepSubtitle}>
              {data ? 'Zatwierdza człowiek, nie AI' : 'Dostępna po przeglądzie'}
            </p>
          </div>
          {data && (
            <span
              className={
                approved
                  ? extractStyles.chip.success
                  : status === 'NEEDS_INFO'
                    ? extractStyles.chip.warning
                    : extractStyles.chip.info
              }
            >
              {approved
                ? 'Zatwierdzone do wyceny'
                : status === 'NEEDS_INFO'
                  ? 'Oznaczone do uzupełnienia'
                  : 'Oczekuje na decyzję'}
            </span>
          )}
        </div>
        {data && (
          <div className={extractStyles.stepBody}>
            <ReviewDecisionPanel
              isComplete={!needsInfo}
              onApprove={() => handleDecision('APPROVE')}
              onRequestInfo={() => handleDecision('REQUEST_INFO')}
              isPending={decisionState.pending}
            />
            {decisionState.error && (
              <p role="alert" className={extractStyles.error}>
                {decisionState.error}
              </p>
            )}
          </div>
        )}
      </section>
    </>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className={extractStyles.fieldError}>
      {message}
    </p>
  ) : null;
}
