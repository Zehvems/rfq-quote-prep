import { statusStyles } from './uiStyles';

type StatusMeta = {
  label: string;
  badge: string;
  dot: string;
  rail: string;
};

// Pełne nazwy klas w literałach, żeby Tailwind je wykrył.
const STATUS_META: Record<string, StatusMeta> = {
  RECEIVED: {
    label: 'Nowe',
    badge: 'bg-slate-100 text-slate-700 ring-slate-300/70',
    dot: 'bg-slate-400',
    rail: 'border-l-slate-300',
  },
  EXTRACTED: {
    label: 'Do przeglądu',
    badge: 'bg-blue-50 text-blue-800 ring-blue-200',
    dot: 'bg-blue-600',
    rail: 'border-l-blue-600',
  },
  NEEDS_INFO: {
    label: 'Do uzupełnienia',
    badge: 'bg-amber-50 text-amber-900 ring-amber-200',
    dot: 'bg-amber-500',
    rail: 'border-l-amber-500',
  },
  APPROVED: {
    label: 'Zatwierdzone',
    badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    dot: 'bg-emerald-600',
    rail: 'border-l-emerald-500',
  },
};

const FALLBACK_META: StatusMeta = STATUS_META.RECEIVED;

export function getStatusMeta(status: string): StatusMeta {
  return STATUS_META[status] ?? { ...FALLBACK_META, label: status };
}

export default function StatusBadge({ status }: { status: string }) {
  const meta = getStatusMeta(status);
  return (
    <span className={`${statusStyles.badge} ${meta.badge}`}>
      <span aria-hidden="true" className={`${statusStyles.dot} ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
