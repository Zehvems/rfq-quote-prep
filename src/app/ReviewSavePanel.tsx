'use client';

import { useId } from 'react';
import { reviewSaveStyles } from './uiStyles';

export type ReviewSaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'success' }
  | { status: 'error'; message: string };

type ReviewSavePanelProps = {
  state?: ReviewSaveState;
  onSave?: () => void;
};

// Sam widok. Stan i funkcję zapisu podłącz w ExtractButton.
export default function ReviewSavePanel({
  state = { status: 'idle' },
  onSave,
}: ReviewSavePanelProps) {
  const hintId = useId();
  const isSaving = state.status === 'saving';

  return (
    <section aria-label="Zapis poprawek" className={reviewSaveStyles.panel}>
      <div className={reviewSaveStyles.header}>
        <div className={reviewSaveStyles.description}>
          <h4 className={reviewSaveStyles.heading}>Zapisz postęp przeglądu</h4>
          <p id={hintId} className={reviewSaveStyles.hint}>
            Możesz zapisać także niekompletny szkic. Zapis nie oznacza zatwierdzenia zapytania.
          </p>
        </div>
        <span className={reviewSaveStyles.badge}>Szkic</span>
      </div>

      <div className={reviewSaveStyles.actions}>
        <button
          type="button"
          onClick={onSave}
          disabled={!onSave || isSaving}
          aria-busy={isSaving}
          aria-describedby={hintId}
          className={reviewSaveStyles.button}
        >
          {isSaving && <span aria-hidden="true" className={reviewSaveStyles.spinner} />}
          {isSaving ? 'Zapisywanie…' : 'Zapisz poprawki'}
        </button>
        {state.status === 'idle' && (
          <p className={reviewSaveStyles.note}>
            {onSave
              ? 'Poprawki nie zostały jeszcze zapisane.'
              : 'Zapis jest jeszcze niedostępny. Poprawki pozostają tylko w tej sesji.'}
          </p>
        )}
      </div>

      <div role="status" aria-live="polite" aria-atomic="true">
        {isSaving && <p className={reviewSaveStyles.note}>Trwa zapisywanie poprawek.</p>}
        {state.status === 'success' && (
          <p className={reviewSaveStyles.success}>Poprawki zostały zapisane.</p>
        )}
      </div>
      {state.status === 'error' && (
        <p role="alert" className={reviewSaveStyles.error}>{state.message}</p>
      )}
    </section>
  );
}
