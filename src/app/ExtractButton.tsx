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
};

type RFQItem = RFQData['items'][number];

export default function ExtractButton({ inquiryId, rawText }: ExtractButtonProps) {
  const id = useId();
  const [data, setData] = useState<RFQData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<ReviewSaveState>({
    status: 'idle',
  });
  const savingRef = useRef(false);
  const isSaving = saveState.status === 'saving';

  async function handleSaveReview() {
    if (!data || savingRef.current || isLoading) return;
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
    if (savingRef.current || isLoading) return;
    setSaveState({ status: 'idle' });
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });

      if (!response.ok) {
        setError('Wystąpił błąd podczas wyodrębniania danych.');
        return;
      }
      const extracted = await response.json();
      setData(extracted.data);
    } catch {
      setError('Nie udało się odczytać danych. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  }
  function updateItem<K extends keyof RFQItem>(index: number, field: K, value: RFQItem[K]) {
    if (savingRef.current) return;
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
    if (savingRef.current) return;
    setSaveState({ status: 'idle' });
    setData((previous) =>
      previous ? { ...previous, [field]: value === '' ? null : value } : previous,
    );
  }

  const completeness = data ? checkRFQCompleteness(data) : null;
  const missingPaths = new Set(completeness?.missingFields.map((field) => field.path));
  const needsInfo = completeness?.status === 'NEEDS_INFO';
  const inputClass = (path: string) =>
    `${extractStyles.input} ${missingPaths.has(path) ? extractStyles.inputMissing : extractStyles.inputDefault}`;
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
  return (
    <>
      <div className={extractStyles.extractionBar}>
        <div>
          <p className={extractStyles.stageLabel}>Dane z wiadomości</p>
          <p className={extractStyles.stageHint}>
            {data
              ? 'Wynik dostępny do przeglądu'
              : isLoading
                ? 'Odczytywanie wymagań klienta…'
                : 'Rozpocznij od wyodrębnienia wymagań.'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleExtract}
          disabled={isLoading || isSaving}
          aria-busy={isLoading}
          aria-label={
            isLoading ? 'Wyodrębnianie danych' : data ? 'Wyodrębnij ponownie' : 'Wyodrębnij dane'
          }
          className={data ? extractStyles.repeatButton : extractStyles.button}
        >
          {isLoading && <span aria-hidden="true" className={extractStyles.spinner} />}
          {!isLoading && <AppIcon name="sparkles" className="size-4" />}
          <span role="status">
            {isLoading ? 'Wyodrębnianie...' : data ? 'Wyodrębnij ponownie' : 'Wyodrębnij dane'}
          </span>
        </button>
      </div>
      {data && (
        <p className={extractStyles.repeatHint}>
          Ponowna ekstrakcja zastąpi bieżące poprawki w formularzu.
        </p>
      )}
      {error && (
        <p role="alert" className={extractStyles.error}>
          {error}
        </p>
      )}
      {data && completeness && (
        <section
          aria-label="Przegląd danych RFQ"
          data-inquiry-id={inquiryId}
          className={extractStyles.review}
        >
          <header className={extractStyles.reviewHeader}>
            <div>
              <p className={extractStyles.stageLabel}>Przegląd człowieka</p>
              <h4 className={extractStyles.heading}>Sprawdź i uzupełnij dane</h4>
            </div>
            <dl className={extractStyles.reviewStats}>
              <div>
                <dt className={extractStyles.statLabel}>Pozycje</dt>
                <dd className={extractStyles.statValue}>{data.items.length}</dd>
              </div>
              <div>
                <dt className={extractStyles.statLabel}>Brakujące pola</dt>
                <dd className={needsInfo ? extractStyles.statMissing : extractStyles.statValue}>
                  {completeness.missingFields.length}
                </dd>
              </div>
            </dl>
          </header>
          <div className={extractStyles.localNote}>
            <p className={extractStyles.hint}>
              Porównaj pola z oryginalnym RFQ. Niezapisane poprawki znikną po odświeżeniu strony lub
              ponownej ekstrakcji.
            </p>
          </div>

          <div className={needsInfo ? extractStyles.statusMissing : extractStyles.statusReady}>
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
              <p className={extractStyles.hint}>
                Wymagane pola są uzupełnione. Potwierdź poprawność danych z treścią RFQ przed
                przygotowaniem wyceny.
              </p>
            )}
          </div>

          {data.items.length === 0 && (
            <p id={fieldId('items')} tabIndex={-1} className={extractStyles.hint}>
              Nie rozpoznano żadnej pozycji. Sprawdź treść zapytania przed ponowną ekstrakcją.
            </p>
          )}
          {data.items.map((item, index) => {
            const path = `items[${index}]`;
            return (
              <fieldset key={index} disabled={isSaving} className={extractStyles.itemCard}>
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
                      className={`${inputClass(`${path}.specification`)} ${extractStyles.textarea}`}
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

          <fieldset disabled={isSaving} className={extractStyles.itemCard}>
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
          <ReviewDecisionPanel isComplete={!needsInfo} />
        </section>
      )}
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
