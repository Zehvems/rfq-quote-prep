'use client';

import { useState } from 'react';
import type { RFQData } from '../lib/rfq/schema';
import { extractStyles } from './uiStyles';

type ExtractButtonProps = {
  rawText: string;
};

export default function ExtractButton({ rawText }: ExtractButtonProps) {
  const [data, setData] = useState<RFQData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExtract() {
    setIsLoading(true);
    setError(null);
    setData(null);
    try{
    const response = await fetch('/api/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rawText }),
    });

    if (!response.ok) {
      setError('Wystąpił błąd podczas wyodrębniania danych.');
      setIsLoading(false);
      return;
    }
    const extracted = await response.json()
    setData(extracted.data);
    console.log('Extracted data:', extracted);
  } catch(e) {
    setError(`Wystąpił błąd podczas wyodrębniania danych. ${e} `);
  } finally {
    setIsLoading(false);
  }
  }

  return (
    <>
      <button type="button" onClick={handleExtract} disabled={isLoading} aria-busy={isLoading} className={extractStyles.button}>
        {isLoading && <span aria-hidden="true" className={extractStyles.spinner} />}
        <span role="status">{isLoading ? 'Wyodrębnianie...' : 'Wyodrębnij dane'}</span>
      </button>
      {error && <p role="alert" className={extractStyles.error}>{error}</p>}
      {data && (
        <dl aria-label="Wyodrębnione dane" className={extractStyles.fields}>
          <div className={extractStyles.field}>
            <dt className={extractStyles.label}>Typ produktu</dt>
            <dd className={extractStyles.value}>{data.productType ?? 'Brak danych'}</dd>
          </div>
          <div className={extractStyles.field}>
            <dt className={extractStyles.label}>Ilość</dt>
            <dd className={extractStyles.value}>{data.quantity ?? 'Brak danych'}</dd>
          </div>
          <div className={extractStyles.specificationField}>
            <dt className={extractStyles.label}>Specyfikacja</dt>
            <dd className={extractStyles.specificationValue}>{data.specification ?? 'Brak danych'}</dd>
          </div>
          <div className={extractStyles.field}>
            <dt className={extractStyles.label}>Termin dostawy</dt>
            <dd className={extractStyles.value}>{data.deadline ?? 'Brak danych'}</dd>
          </div>
          <div className={extractStyles.field}>
            <dt className={extractStyles.label}>Miejsce dostawy</dt>
            <dd className={extractStyles.value}>{data.deliveryLocation ?? 'Brak danych'}</dd>
          </div>
        </dl>
      )}
    </>
  );
}
