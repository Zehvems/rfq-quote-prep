'use client';

import { useId } from 'react';
import { reviewDecisionStyles } from './uiStyles';

export type ReviewDecisionPanelProps = {
  isComplete: boolean;
  onApprove?: () => void;
  onRequestInfo?: () => void;
  isPending?: boolean;
};

// Presentational V1 extension point. Persistence and decisions belong in the parent/server.
export default function ReviewDecisionPanel({
  isComplete,
  onApprove,
  onRequestInfo,
  isPending = false,
}: ReviewDecisionPanelProps) {
  const hintId = useId();
  const isConnected = Boolean(onApprove || onRequestInfo);

  return (
    <details className={reviewDecisionStyles.panel}>
      <summary className={reviewDecisionStyles.summary}>
        <span className={reviewDecisionStyles.title}>
          <span aria-hidden="true" className={reviewDecisionStyles.toggle}>+</span>
          Decyzja po przeglądzie
        </span>
        <span className={reviewDecisionStyles.badge}>{isConnected ? 'Decyzja człowieka' : 'Kolejny etap'}</span>
      </summary>
      <div className={reviewDecisionStyles.body}>
        <p id={hintId} className={reviewDecisionStyles.hint}>
          {isConnected
            ? 'Potwierdź dane do przygotowania wyceny albo oznacz zapytanie do uzupełnienia informacji.'
            : 'Zapis decyzji nie jest jeszcze dostępny. Obecnie możesz przeglądać i poprawiać dane zapytania.'}
        </p>
        <div className={reviewDecisionStyles.actions}>
          <button type="button" onClick={onApprove} disabled={!onApprove || !isComplete || isPending}
            aria-describedby={hintId} aria-busy={isPending} className={reviewDecisionStyles.approveButton}>
            {isPending ? 'Zapisywanie decyzji…' : 'Zatwierdź do wyceny'}
          </button>
          <button type="button" onClick={onRequestInfo} disabled={!onRequestInfo || isPending}
            aria-describedby={hintId} aria-busy={isPending} className={reviewDecisionStyles.infoButton}>
            Oznacz do uzupełnienia
          </button>
        </div>
        {!isComplete && <p className={reviewDecisionStyles.hint}>Przed zatwierdzeniem uzupełnij wymagane pola. Zapis szkicu może zawierać braki.</p>}
      </div>
    </details>
  );
}
