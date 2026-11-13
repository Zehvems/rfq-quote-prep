// Pełne nazwy klas Tailwind trzymamy tutaj, żeby JSX był czytelny.
// Wszystkie klasy muszą być zapisane w całości (bez sklejania), inaczej Tailwind ich nie wykryje.

export const pageStyles = {
  topbar:
    'sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80',
  topbarInner:
    'mx-auto flex h-14 max-w-[1360px] items-center justify-between gap-4 px-4 sm:px-8 lg:px-10',
  brand: 'inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight text-slate-950',
  brandMark:
    'flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm ring-1 ring-slate-900/10',
  brandSecondary: 'font-normal text-slate-400',
  demoBadge:
    'rounded-md border border-slate-200 bg-slate-100/80 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600',
  newInquiryLink:
    'inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-sm ring-1 ring-inset ring-slate-950 transition-all hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900',

  main: 'mx-auto max-w-[1360px] px-4 pb-16 sm:px-8 lg:px-10',
  header: 'flex flex-col gap-1.5 pb-6 pt-8',
  title: 'text-2xl font-bold tracking-tight text-slate-950 sm:text-[26px]',
  description: 'max-w-2xl text-sm leading-6 text-slate-600',

  // Przegląd procesu: AI → człowiek → decyzja (liczby z aktualnych danych)
  overview: 'mb-8 grid gap-3.5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch',
  stage:
    'relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03),0_1px_2px_-1px_rgba(15,23,42,0.03)] transition-shadow hover:shadow-md',
  stageTop:
    'flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500',
  stageNumber:
    'flex size-5 items-center justify-center rounded-md bg-slate-900 font-mono text-[11px] font-semibold text-white',
  stageValue:
    'mt-3.5 font-mono text-3xl font-bold tabular-nums leading-none tracking-tight text-slate-950',
  stageCaption: 'mt-1.5 text-xs font-medium text-slate-500',
  stageChip:
    'mt-3.5 inline-flex items-center gap-1.5 rounded-md bg-amber-50/90 px-2.5 py-1 text-xs font-semibold text-amber-900 ring-1 ring-inset ring-amber-300/80',
  stageChipIdle:
    'mt-3.5 inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200/90',
  connector: 'hidden items-center justify-center text-slate-300 md:flex',

  layout: 'grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_360px]',
  listColumn: 'min-w-0 lg:col-start-1 lg:row-start-1',
  sectionHeader: 'mb-3.5 flex min-h-8 items-center justify-between gap-4',
  sectionTitle: 'flex items-center gap-2 text-base font-semibold tracking-tight text-slate-950',
  count:
    'inline-flex min-w-6 items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-slate-700 shadow-2xs',
  orderLabel: 'font-mono text-[11px] uppercase tracking-wider text-slate-400',
  list: 'space-y-3',

  emptyState:
    'flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-sm leading-6 text-slate-600',
  emptyIcon:
    'mb-4 flex size-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 shadow-2xs',
  emptyTitle: 'mb-1.5 text-base font-semibold text-slate-950',
  emptyLink:
    'mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900',

  formPanel:
    'min-w-0 scroll-mt-20 rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] lg:sticky lg:top-[4.5rem] lg:col-start-2 lg:row-start-1',
  formIntro: 'flex items-center gap-2.5',
  formIcon:
    'flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-800 shadow-2xs',
  formDescription: 'mb-5 mt-2.5 text-xs leading-5 text-slate-500',
  formTip: 'mt-5 border-t border-slate-100 pt-4 text-[11px] leading-5 text-slate-400',

  footer:
    'mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 py-6 text-xs leading-5 text-slate-500',
};

// Karta zapytania: wiersz (summary) + rozwijany panel ze szczegółami
export const cardStyles = {
  card: 'group overflow-hidden rounded-xl border border-l-4 border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all hover:border-slate-300 open:border-slate-300 open:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08)]',
  summary:
    'flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 transition-colors outline-offset-[-2px] hover:bg-slate-50/80 focus-visible:outline-2 focus-visible:outline-slate-900 sm:px-5 [&::-webkit-details-marker]:hidden',
  chevron:
    'size-4 shrink-0 -rotate-90 text-slate-400 transition-transform duration-150 group-open:rotate-0 group-open:text-slate-700 motion-reduce:transition-none',
  titleBlock: 'min-w-0 flex-1 basis-56',
  titleRow: 'flex items-baseline gap-2.5',
  index: 'font-mono text-xs font-medium tabular-nums text-slate-400',
  company: 'truncate text-sm font-semibold tracking-tight text-slate-950',
  meta: 'mt-1 flex min-w-0 items-center gap-2 text-xs text-slate-500',
  metaDate: 'shrink-0 font-mono text-[11px] tabular-nums text-slate-400',
  metaSnippet: 'truncate text-slate-500',
  summaryRight: 'ml-auto flex items-center gap-4',
  body: 'border-t border-slate-200/80 bg-slate-50/60',
  bodyGrid: 'grid gap-5 p-4 sm:p-5 lg:grid-cols-[18rem_minmax(0,1fr)]',
  source:
    'overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-2xs lg:sticky lg:top-[4.5rem] lg:self-start',
  sourceHeader:
    'flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-3.5 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500',
  sourceText:
    'max-h-80 overflow-y-auto whitespace-pre-wrap break-words bg-white px-3.5 py-3 font-mono text-xs leading-relaxed text-slate-700',
  main: 'min-w-0 space-y-3.5',
};

export const statusStyles = {
  badge:
    'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
  dot: 'size-1.5 rounded-full',
};

export const pipelineStyles = {
  list: 'flex items-center',
  item: 'flex items-center',
  stepWrap: 'flex items-center gap-1.5',
  dotBase:
    'flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold tabular-nums transition-all',
  dot: {
    done: 'bg-emerald-600 text-white shadow-2xs',
    current: 'bg-slate-900 text-white ring-4 ring-slate-200/80',
    attention: 'bg-amber-500 text-white ring-4 ring-amber-100',
    upcoming: 'border border-slate-300 bg-white text-slate-400',
  },
  label: {
    done: 'text-xs font-medium text-slate-600',
    current: 'text-xs font-semibold text-slate-950',
    attention: 'text-xs font-semibold text-amber-900',
    upcoming: 'text-xs font-medium text-slate-400',
  },
  labelVisibility: 'hidden xl:inline',
  line: {
    done: 'mx-2 h-px w-4 bg-emerald-500/80 xl:w-5',
    todo: 'mx-2 h-px w-4 bg-slate-200 xl:w-5',
  },
};

export const extractStyles = {
  // Sekcja kroku (1 Ekstrakcja AI, 2 Przegląd człowieka, 3 Decyzja)
  step: 'overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs',
  stepHeader: 'flex items-center gap-3 bg-slate-50/40 px-4 py-3',
  stepHeaderLocked: 'opacity-55',
  stepBody: 'space-y-4 border-t border-slate-100 px-4 py-4 sm:px-5',
  stepNumber: {
    done: 'flex size-6 shrink-0 items-center justify-center rounded-md bg-emerald-600 font-mono text-xs font-semibold text-white',
    current:
      'flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-900 font-mono text-xs font-semibold text-white',
    attention:
      'flex size-6 shrink-0 items-center justify-center rounded-md bg-amber-500 font-mono text-xs font-semibold text-white',
    locked:
      'flex size-6 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 font-mono text-xs font-semibold text-slate-400',
  },
  stepTitle: 'text-sm font-semibold tracking-tight text-slate-950',
  stepSubtitle: 'text-xs text-slate-500',
  chip: {
    neutral:
      'ml-auto shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200',
    info: 'ml-auto shrink-0 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-800 ring-1 ring-inset ring-blue-200',
    success:
      'ml-auto shrink-0 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200',
    warning:
      'ml-auto shrink-0 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900 ring-1 ring-inset ring-amber-300/80',
  },

  extractionRow: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4',
  stageHint: 'text-sm leading-6 text-slate-700',
  repeatHint: 'mt-1 text-xs leading-5 text-slate-500',
  primaryButton:
    'inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-wait disabled:bg-slate-200 disabled:text-slate-500 sm:w-auto',
  secondaryButton:
    'inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-wait disabled:opacity-60 sm:w-auto',
  spinner:
    'size-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 motion-reduce:animate-none',
  spinnerOnPrimary:
    'size-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none',
  error:
    'break-words rounded-lg border border-red-200 bg-red-50/90 px-4 py-3 text-xs font-medium leading-5 text-red-900',

  // Przegląd
  reviewTop: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
  reviewStats: 'flex shrink-0 gap-2',
  statTile: 'rounded-lg border border-slate-200/80 bg-slate-50/70 px-3 py-1.5',
  statLabel: 'text-[10px] font-semibold uppercase tracking-wider text-slate-500',
  statValue: 'font-mono text-base font-bold tabular-nums leading-6 text-slate-950',
  statMissing: 'font-mono text-base font-bold tabular-nums leading-6 text-amber-700',
  hint: 'text-xs leading-5 text-slate-600',
  localNote: 'text-[11px] leading-5 text-slate-400',
  statusMissing:
    'flex gap-3 rounded-lg border border-amber-300/80 bg-amber-50/80 px-4 py-3 text-amber-950',
  statusReady:
    'flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-emerald-950',
  statusIconMissing: 'mt-0.5 size-5 shrink-0 text-amber-600',
  statusIconReady: 'mt-0.5 size-5 shrink-0 text-emerald-600',
  statusTitle: 'text-xs font-semibold uppercase tracking-wide',
  statusText: 'mt-0.5 text-xs leading-5',
  missingList: 'mt-2 list-disc space-y-1 break-words pl-5 text-xs font-medium leading-5',
  missingLink:
    'rounded-sm underline decoration-amber-900/40 underline-offset-4 hover:decoration-amber-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800',

  itemCard: 'min-w-0 rounded-lg border border-slate-200/90 bg-slate-50/50 px-4 pb-4 pt-2.5 sm:px-5',
  legend: 'px-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500',
  itemGrid: 'grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_9rem]',
  deliveryGrid: 'grid min-w-0 gap-4 sm:grid-cols-2',
  fullWidth: 'min-w-0 sm:col-span-2',
  label: 'mb-1.5 block text-xs font-semibold text-slate-700',
  field:
    'block w-full min-w-0 scroll-mt-24 rounded-lg border px-3 text-sm leading-6 text-slate-950 shadow-2xs outline-none transition-all placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-wait disabled:opacity-60',
  inputSize: 'h-9 py-1.5',
  textarea: 'min-h-20 resize-y py-2',
  inputDefault: 'border-slate-200 bg-white hover:border-slate-300',
  inputMissing: 'border-amber-400 bg-amber-50/40 focus:border-amber-600 focus:ring-amber-500/20',
  fieldError: 'mt-1.5 break-words text-[11px] font-medium leading-4 text-amber-800',
};

export const reviewSaveStyles = {
  panel:
    'flex flex-col gap-3 rounded-lg border border-slate-200/90 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between',
  description: 'min-w-0',
  headingRow: 'flex items-center gap-2',
  heading: 'text-xs font-semibold uppercase tracking-wide text-slate-900',
  hint: 'mt-1 max-w-md text-xs leading-5 text-slate-500',
  badge:
    'shrink-0 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600',
  actions: 'flex shrink-0 flex-col items-stretch gap-2 sm:items-end',
  button:
    'inline-flex min-h-9 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-800 shadow-2xs transition-colors hover:bg-slate-50 hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60 aria-busy:cursor-wait sm:w-auto',
  spinner:
    'size-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 motion-reduce:animate-none',
  note: 'text-[11px] leading-4 text-slate-400',
  success:
    'break-words rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium leading-5 text-emerald-900',
  error:
    'break-words rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium leading-5 text-red-800',
};

export const reviewDecisionStyles = {
  panel: 'space-y-3',
  hint: 'text-xs leading-5 text-slate-600',
  actions: 'flex flex-col gap-2.5 sm:flex-row',
  approveButton:
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400',
  infoButton:
    'inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 shadow-2xs transition-colors hover:bg-slate-50 hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60',
};

export const formStyles = {
  form: 'space-y-4',
  labelRow: 'mb-1.5 flex items-center justify-between gap-2',
  label: 'block text-xs font-semibold text-slate-800',
  optional: 'font-normal text-slate-400',
  counter: 'font-mono text-[11px] tabular-nums text-slate-400',
  input:
    'block min-h-9 w-full rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-1.5 text-sm text-slate-950 shadow-2xs outline-none transition-all placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10',
  textarea:
    'block min-h-40 w-full resize-y rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2 font-mono text-xs leading-relaxed text-slate-900 shadow-2xs outline-none transition-all placeholder:font-sans placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10',
  sampleRow: 'mb-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500',
  sampleButton:
    'rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900',
  button:
    'inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-wait disabled:bg-slate-200 disabled:text-slate-500',
  spinner:
    'size-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none',
  error:
    'break-words rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium leading-5 text-red-800',
};

export const feedbackStyles = {
  wrap: 'mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-3 px-6 text-center',
  title: 'text-lg font-semibold text-slate-950',
  text: 'text-sm leading-6 text-slate-600',
  button:
    'mt-2 inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900',
  skeletonPage: 'mx-auto max-w-[1360px] px-4 pt-8 sm:px-8 lg:px-10',
  skeletonBlock: 'animate-pulse rounded-xl bg-slate-200/70 motion-reduce:animate-none',
};
