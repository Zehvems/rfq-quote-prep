'use client';

import { useEffect } from 'react';
import { feedbackStyles } from './uiStyles';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className={feedbackStyles.wrap}>
      <h1 className={feedbackStyles.title}>Nie udało się wczytać zapytań</h1>
      <p className={feedbackStyles.text}>
        Wystąpił problem z połączeniem z bazą danych. Spróbuj ponownie za chwilę.
      </p>
      <button type="button" onClick={reset} className={feedbackStyles.button}>
        Spróbuj ponownie
      </button>
    </div>
  );
}
