// Keep complete Tailwind class names here so styling stays separate from JSX.

export const pageStyles = {
  main:
    "mx-auto max-w-6xl px-4 py-8 antialiased sm:px-8 sm:py-12",
  header:
    "mb-10 border-b border-slate-200 pb-8",
  eyebrow:
    "mb-3 text-xs font-semibold uppercase tracking-widest text-teal-700",
  title:
    "text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl",
  description:
    "mt-3 max-w-xl text-sm leading-6 text-slate-600",
  layout:
    "grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]",
  inquiries:
    "min-w-0",
  sectionHeader:
    "mb-4 flex items-center justify-between gap-4",
  sectionTitle:
    "text-lg font-semibold text-slate-900",
  count:
    "rounded-full border border-slate-200 bg-white px-3 py-1 text-xs tabular-nums text-slate-600",
  emptyState:
    "rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm leading-6 text-slate-500",
  list:
    "space-y-4",
  card:
    "min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6",
  company:
    "mb-3 break-words text-base font-semibold text-slate-900",
  inquiryText:
    "mb-5 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600",
  formPanel:
    "min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6",
  formDescription:
    "mb-6 mt-2 text-sm leading-6 text-slate-500",
};

export const extractStyles = {
  button:
    "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-teal-600 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-wait disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 sm:w-auto",
  spinner:
    "size-4 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600 motion-reduce:animate-none",
  error:
    "mt-4 break-words rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800",
  fields:
    "mt-5 grid gap-x-6 gap-y-4 border-t border-slate-200 pt-5 text-sm sm:grid-cols-2",
  field:
    "min-w-0",
  label:
    "mb-1 text-xs font-medium text-slate-500",
  value:
    "break-words leading-6 text-slate-900",
  specificationField:
    "min-w-0 sm:col-span-2",
  specificationValue:
    "whitespace-pre-wrap break-words leading-6 text-slate-900",
};

export const formStyles = {
  form:
    "space-y-5",
  label:
    "mb-2 block text-sm font-medium text-slate-700",
  optional:
    "font-normal text-slate-500",
  input:
    "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-2 focus:outline-offset-2 focus:outline-teal-600",
  textarea:
    "min-h-40 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-2 focus:outline-offset-2 focus:outline-teal-600",
  button:
    "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-wait disabled:opacity-60",
  spinner:
    "size-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none",
  error:
    "break-words rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800",
};
