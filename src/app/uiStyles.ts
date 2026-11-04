// Keep complete Tailwind class names here so styling stays separate from JSX.

export const pageStyles = {
  main:
    "mx-auto max-w-[1360px] px-4 antialiased sm:px-8 lg:px-10",
  topbar:
    "flex min-h-[72px] items-center justify-between gap-4 border-b border-slate-300/80",
  brand:
    "inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight text-slate-900",
  brandMark:
    "flex size-9 shrink-0 items-center justify-center rounded-lg border border-teal-900/20 bg-[#f5f8f5] text-teal-900 shadow-[0_2px_5px_rgba(20,48,42,0.08)]",
  brandSecondary:
    "font-normal text-slate-500",
  workspaceLabel:
    "hidden items-center gap-3 text-xs font-medium text-slate-500 sm:inline-flex",
  workspaceDot:
    "size-1.5 rounded-full bg-teal-600",
  newInquiryLink:
    "inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-300/70 bg-white/70 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700",
  header:
    "flex flex-col gap-5 border-b border-slate-300/70 py-7 lg:flex-row lg:items-end lg:justify-between lg:gap-8 lg:py-8",
  eyebrow:
    "mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-800 sm:text-[11px]",
  title:
    "text-[1.7rem] font-semibold leading-tight tracking-[-0.035em] text-[#18353a] sm:text-[2rem]",
  titleAccent:
    "text-teal-600",
  description:
    "mt-2 max-w-lg text-sm leading-6 text-slate-700",
  workflow:
    "grid grid-cols-3 gap-2 rounded-xl border border-slate-300/80 bg-[#e3eae5] p-2 sm:flex sm:flex-wrap sm:gap-2",
  workflowStep:
    "flex flex-col items-start gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium leading-5 text-slate-700 sm:flex-row sm:items-center sm:gap-2 sm:px-2.5",
  stepNumber:
    "flex size-6 shrink-0 items-center justify-center rounded-full border border-teal-900/20 bg-[#f8faf7] text-[11px] font-semibold tabular-nums text-teal-900",
  stepTitle:
    "text-sm font-semibold text-slate-800",
  stepDescription:
    "mt-1 text-xs leading-5 text-slate-500",
  layout:
    "grid items-start gap-6 pt-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6",
  inquiries:
    "min-w-0 lg:col-start-1 lg:row-start-1",
  sectionHeader:
    "mb-4 flex min-h-9 items-center justify-between gap-4",
  sectionEyebrow:
    "mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500",
  sectionTitle:
    "flex items-center gap-2.5 text-base font-semibold tracking-tight text-[#19383b]",
  count:
    "inline-flex min-w-6 items-center justify-center rounded-md border border-slate-300/70 bg-[#e5ebe7] px-1.5 py-0.5 text-xs font-semibold tabular-nums text-slate-700",
  orderLabel:
    "text-xs text-slate-500",
  emptyState:
    "flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 px-5 py-10 text-center text-sm leading-6 text-slate-600",
  emptyIcon:
    "mb-4 flex size-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500",
  emptyTitle:
    "mb-2 text-base font-semibold text-slate-800",
  emptyLink:
    "mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-teal-800",
  list:
    "space-y-5",
  card:
    "min-w-0 rounded-xl border border-slate-300/90 border-l-[3px] border-l-teal-800/70 bg-[#f9fbf8] p-4 shadow-[0_8px_24px_rgba(30,52,45,0.07)] sm:p-6",
  cardHeader:
    "mb-4 flex items-start justify-between gap-4",
  companyGroup:
    "flex min-w-0 items-center gap-3",
  companyIcon:
    "flex size-10 shrink-0 items-center justify-center rounded-lg border border-teal-900/15 bg-[#eaf0eb] text-teal-900",
  cardEyebrow:
    "mb-1 text-[11px] font-medium tracking-wide text-slate-500",
  company:
    "break-words text-base font-semibold tracking-tight text-[#18353a]",
  cardTag:
    "rounded-md border border-teal-700/15 bg-teal-50 px-2 py-1 font-mono text-[10px] text-teal-800",
  sourcePanel:
    "group mb-4 rounded-lg border border-slate-300/90 bg-[#edf1ee] p-4",
  sourceSummary:
    "cursor-pointer list-none rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-teal-600 [&::-webkit-details-marker]:hidden",
  sourceLabel:
    "mb-2 flex items-center justify-between gap-4 text-xs font-semibold text-slate-700",
  sourceToggle:
    "flex size-6 items-center justify-center rounded text-lg font-light leading-none text-slate-500 transition-transform group-open:rotate-45 motion-reduce:transition-none",
  sourcePreview:
    "mb-2 line-clamp-2 break-words text-sm leading-6 text-slate-800 group-open:hidden",
  sourcePrompt:
    "text-xs font-medium text-slate-600 underline decoration-slate-300 underline-offset-4",
  inquiryText:
    "mt-4 whitespace-pre-wrap break-words border-t border-slate-200/70 pt-4 text-sm leading-7 text-slate-700",
  formPanel:
    "min-w-0 rounded-xl border border-slate-300/90 bg-[#f6f9f5] p-5 shadow-[0_8px_24px_rgba(30,52,45,0.07)] sm:p-6 lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1",
  formIntro:
    "flex items-center gap-2.5",
  formIcon:
    "flex size-8 items-center justify-center rounded-lg border border-teal-900/15 bg-[#e7efea] text-teal-900",
  formDescription:
    "mb-5 mt-3 text-sm leading-6 text-slate-600",
  formTip:
    "mt-5 border-t border-slate-300/80 pt-4 text-xs leading-6 text-slate-600",
  footer:
    "mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 py-6 text-xs leading-5 text-slate-500",
};

export const extractStyles = {
  extractionBar:
    "flex flex-col gap-3 rounded-lg border border-slate-300/80 bg-[#eef3ef] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
  stageLabel:
    "text-xs font-semibold tracking-wide text-teal-900",
  stageHint:
    "mt-1 text-sm leading-6 text-slate-800",
  repeatHint:
    "mt-2 text-xs leading-5 text-slate-600",
  repeatButton:
    "inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-teal-900/25 bg-[#f8faf7] px-3 py-2 text-xs font-semibold text-teal-950 transition-colors hover:border-teal-800/50 hover:bg-[#e4ede7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-wait disabled:opacity-60 sm:w-auto",
  reviewHeader:
    "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
  reviewStats:
    "flex shrink-0 gap-6 rounded-lg border border-slate-300/90 bg-[#eef2ee] px-4 py-2.5",
  statLabel:
    "text-xs font-medium text-slate-600",
  statValue:
    "mt-1 text-lg font-semibold tabular-nums leading-6 text-[#18383a]",
  statMissing:
    "mt-1 text-lg font-semibold tabular-nums leading-6 text-amber-800",
  localNote:
    "rounded-r-md border-l-2 border-teal-800/50 bg-[#edf2ee] px-3 py-2 [&>p]:mt-0",
  missingLink:
    "rounded-sm underline decoration-amber-900/25 underline-offset-4 hover:decoration-amber-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800",
  fieldError:
    "mt-2 break-words text-xs leading-5 text-amber-900",
  button:
    "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-teal-950 bg-[#214d4b] px-4 py-2 text-sm font-semibold text-white shadow-[0_3px_8px_rgba(24,62,57,0.18)] transition-colors hover:border-teal-950 hover:bg-[#183f3e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-wait disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-600 sm:w-auto",
  spinner:
    "size-4 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600 motion-reduce:animate-none",
  error:
    "mt-4 break-words rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800",
  review:
    "mt-6 space-y-5 border-t border-slate-300 pt-6 text-sm",
  heading:
    "text-base font-semibold tracking-tight text-[#18383a]",
  hint:
    "mt-2 text-sm leading-6 text-slate-700",
  itemCard:
    "min-w-0 rounded-lg border border-slate-300/90 bg-[#f0f4f0] px-4 pb-4 pt-3 sm:px-5 sm:pb-5",
  legend:
    "px-2 text-sm font-semibold text-slate-700",
  itemGrid:
    "grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_9rem]",
  deliveryGrid:
    "grid min-w-0 gap-4 sm:grid-cols-2",
  fullWidth:
    "min-w-0 sm:col-span-2",
  label:
    "mb-2 block text-[13px] font-medium text-slate-700",
  input:
    "min-h-11 w-full min-w-0 scroll-mt-8 rounded-md border px-3 py-2 text-sm leading-6 text-[#172a30] outline-none transition-colors placeholder:text-slate-500 focus:border-teal-800 focus:ring-2 focus:ring-teal-800/15 disabled:cursor-wait disabled:opacity-60",
  inputDefault:
    "border-slate-400/80 bg-[#fbfcfa]",
  inputMissing:
    "border-amber-400/80 bg-[#fffdf8]",
  textarea:
    "min-h-28 resize-y",
  statusMissing:
    "rounded-lg border border-amber-200 bg-[#fffbf3] px-4 py-3 text-amber-950",
  statusReady:
    "rounded-lg border border-teal-800/25 bg-[#e3eee7] px-4 py-3 text-teal-950",
  statusTitle:
    "font-semibold",
  missingList:
    "mt-2 list-disc space-y-1 break-words pl-5 text-sm leading-6",
};

export const reviewSaveStyles = {
  panel:
    "space-y-4 rounded-lg border border-slate-300/90 bg-[#edf2ee] p-4 sm:p-5",
  header:
    "flex items-start justify-between gap-3",
  description:
    "min-w-0",
  heading:
    "text-sm font-semibold text-slate-900",
  hint:
    "mt-1 max-w-lg text-sm leading-6 text-slate-600",
  badge:
    "shrink-0 rounded-md border border-teal-900/20 bg-[#e2ebe5] px-2.5 py-1 text-xs font-semibold text-teal-950",
  actions:
    "flex flex-col items-start gap-3 sm:flex-row sm:items-center",
  button:
    "inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#345b57] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#274b47] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-700 aria-busy:cursor-wait sm:w-auto",
  spinner:
    "size-4 animate-spin rounded-full border-2 border-slate-300 border-t-teal-700 motion-reduce:animate-none",
  note:
    "text-xs leading-5 text-slate-500",
  success:
    "break-words rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900",
  error:
    "break-words rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800",
};

export const reviewDecisionStyles = {
  panel:
    "group rounded-lg border border-slate-300/90 bg-[#f2f5f2]",
  summary:
    "flex min-h-14 cursor-pointer list-none flex-wrap items-center justify-between gap-2 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 outline-offset-4 focus-visible:outline-2 focus-visible:outline-teal-700 sm:px-5 [&::-webkit-details-marker]:hidden",
  title:
    "inline-flex items-center gap-2",
  toggle:
    "text-base font-normal text-slate-400 transition-transform group-open:rotate-45 motion-reduce:transition-none",
  badge:
    "rounded-md border border-slate-300/80 bg-[#e8ede9] px-2 py-1 text-xs font-medium text-slate-700",
  body:
    "space-y-3 border-t border-slate-100 px-4 py-4 sm:px-5",
  hint:
    "text-xs leading-6 text-slate-600",
  actions:
    "flex flex-col gap-2 sm:flex-row",
  approveButton:
    "inline-flex min-h-11 items-center justify-center rounded-lg bg-[#345b57] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#274b47] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-700",
  infoButton:
    "inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-400/90 bg-[#f9fbf8] px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-500 hover:bg-[#e9efea] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-600",
};

export const formStyles = {
  form:
    "space-y-5",
  label:
    "mb-2 block text-[13px] font-medium text-slate-700",
  optional:
    "font-normal text-slate-500",
  input:
    "min-h-11 w-full rounded-md border border-slate-400/80 bg-[#fbfcfa] px-3 py-2 text-sm text-[#172a30] outline-none transition-colors placeholder:text-slate-500 focus:border-teal-800 focus:ring-2 focus:ring-teal-800/15",
  textarea:
    "min-h-40 w-full resize-y rounded-md border border-slate-400/80 bg-[#fbfcfa] px-3 py-2 text-sm leading-6 text-[#172a30] outline-none transition-colors placeholder:text-slate-500 focus:border-teal-800 focus:ring-2 focus:ring-teal-800/15",
  button:
    "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#345b57] px-4 py-2 text-sm font-semibold text-white shadow-[0_3px_8px_rgba(24,62,57,0.18)] transition-colors hover:bg-[#274b47] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-wait disabled:bg-slate-300 disabled:text-slate-700",
  spinner:
    "size-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none",
  error:
    "break-words rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800",
};
