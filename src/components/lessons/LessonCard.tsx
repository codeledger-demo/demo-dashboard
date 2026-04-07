import type { LessonEntry } from '@/types/dashboard';

interface LessonCardProps {
  lesson: LessonEntry;
}

const severityStyles: Record<string, { border: string; badge: string }> = {
  high: {
    border: 'border-l-semantic-error',
    badge: 'bg-red-50 text-semantic-error',
  },
  medium: {
    border: 'border-l-semantic-warning',
    badge: 'bg-amber-50 text-semantic-warning',
  },
  low: {
    border: 'border-l-brand-accent',
    badge: 'bg-emerald-50 text-semantic-success',
  },
};

export function LessonCard({ lesson }: LessonCardProps) {
  const styles = severityStyles[lesson.severity] ?? severityStyles.low;
  const firstSeen = new Date(lesson.firstSeen).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const lastTriggered = lesson.lastTriggered
    ? new Date(lesson.lastTriggered).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div
      className={`rounded-lg border border-stone-200 border-l-4 ${styles.border} bg-surface-card p-5 shadow-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-base font-semibold text-stone-900">
          {lesson.title}
        </h3>
        <span
          className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            lesson.active
              ? 'bg-emerald-50 text-semantic-success'
              : 'bg-stone-100 text-stone-400'
          }`}
        >
          {lesson.active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        {lesson.summary}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-medium text-brand-primary">
          {lesson.category}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles.badge}`}>
          {lesson.severity}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-stone-500">
          <span aria-label="trigger count">&#x1F525;</span>
          {lesson.triggerCount}
        </span>
      </div>

      <div className="mt-3 flex gap-4 text-xs text-stone-400">
        <span>First seen: {firstSeen}</span>
        {lastTriggered && <span>Last triggered: {lastTriggered}</span>}
      </div>
    </div>
  );
}
