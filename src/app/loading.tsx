import { feedbackStyles } from './uiStyles';

export default function Loading() {
  return (
    <div className={feedbackStyles.skeletonPage} role="status" aria-label="Ładowanie zapytań">
      <div className={`${feedbackStyles.skeletonBlock} mb-6 h-8 w-80`} />
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <div className={`${feedbackStyles.skeletonBlock} h-32`} />
        <div className={`${feedbackStyles.skeletonBlock} h-32`} />
        <div className={`${feedbackStyles.skeletonBlock} h-32`} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-3">
          <div className={`${feedbackStyles.skeletonBlock} h-16`} />
          <div className={`${feedbackStyles.skeletonBlock} h-16`} />
          <div className={`${feedbackStyles.skeletonBlock} h-16`} />
        </div>
        <div className={`${feedbackStyles.skeletonBlock} h-96`} />
      </div>
      <span className="sr-only">Ładowanie…</span>
    </div>
  );
}
