'use client';

import { useState } from 'react';
import AppIcon from './AppIcon';
import ExtractButton from './ExtractButton';
import Pipeline from './Pipeline';
import StatusBadge, { getStatusMeta } from './StatusBadge';
import { cardStyles } from './uiStyles';

type InquiryCardProps = {
  inquiryId: string;
  index: number;
  company: string | null;
  rawText: string;
  initialData: unknown;
  initialStatus: string;
  createdLabel: string;
};

// Zwarty wiersz z postępem i statusem; szczegóły rozwijają się dopiero po kliknięciu.
// Status trzymamy tutaj, żeby wiersz aktualizował się od razu po ekstrakcji lub decyzji.
export default function InquiryCard({
  inquiryId,
  index,
  company,
  rawText,
  initialData,
  initialStatus,
  createdLabel,
}: InquiryCardProps) {
  const [status, setStatus] = useState(initialStatus);
  const name = company ?? 'Nieznana firma';
  const snippet = rawText.replace(/\s+/g, ' ').trim();

  return (
    <details className={`${cardStyles.card} ${getStatusMeta(status).rail}`}>
      <summary className={cardStyles.summary} aria-label={`${name} — ${getStatusMeta(status).label}`}>
        <AppIcon name="chevron" className={cardStyles.chevron} />
        <div className={cardStyles.titleBlock}>
          <div className={cardStyles.titleRow}>
            <span className={cardStyles.index}>{String(index + 1).padStart(2, '0')}</span>
            <span className={cardStyles.company}>{name}</span>
          </div>
          <p className={cardStyles.meta}>
            <span className={cardStyles.metaDate}>{createdLabel}</span>
            <span aria-hidden="true">·</span>
            <span className={cardStyles.metaSnippet}>{snippet}</span>
          </p>
        </div>
        <div className={cardStyles.summaryRight}>
          <Pipeline status={status} />
          <StatusBadge status={status} />
        </div>
      </summary>

      <div className={cardStyles.body}>
        <div className={cardStyles.bodyGrid}>
          <aside className={cardStyles.source} aria-label={`Treść źródłowa — ${name}`}>
            <h4 className={cardStyles.sourceHeader}>
              <span>Wiadomość klienta</span>
              <span className="flex items-center gap-2">
                <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-slate-400">RAW EMAIL</span>
                <span className="font-mono text-[10px] tabular-nums text-slate-400">{rawText.length} zn.</span>
              </span>
            </h4>
            <p className={cardStyles.sourceText}>{rawText}</p>
          </aside>
          <div className={cardStyles.main}>
            <ExtractButton
              inquiryId={inquiryId}
              rawText={rawText}
              initialData={initialData}
              status={status}
              onStatusChange={setStatus}
            />
          </div>
        </div>
      </div>
    </details>
  );
}
