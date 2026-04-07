interface TimelineMoment {
  date: string;
  title: string;
  description: string;
  feature: string;
  outcome: string;
}

interface IncidentTimelineProps {
  moments: TimelineMoment[];
}

const featureColors: Record<string, string> = {
  CIC: 'bg-brand-primary/10 text-brand-primary',
  'Release Authority': 'bg-red-50 text-semantic-error',
  'Lessons Ledger': 'bg-amber-50 text-semantic-warning',
  'Ghost Detection': 'bg-purple-50 text-purple-700',
  'Drift Monitor': 'bg-blue-50 text-semantic-info',
  'Architecture Health': 'bg-emerald-50 text-semantic-success',
};

export function IncidentTimeline({ moments }: IncidentTimelineProps) {
  return (
    <div className="relative space-y-0">
      {moments.map((moment, i) => (
        <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
          {/* Connecting line */}
          {i < moments.length - 1 && (
            <div className="absolute left-[7px] top-4 h-full w-0.5 bg-stone-200" />
          )}

          {/* Dot */}
          <div className="relative z-10 mt-1.5 h-4 w-4 shrink-0 rounded-full border-2 border-brand-primary bg-white" />

          {/* Content */}
          <div className="flex-1 rounded-lg border border-stone-200 bg-surface-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-stone-400">
                {new Date(moment.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  featureColors[moment.feature] ?? 'bg-stone-100 text-stone-600'
                }`}
              >
                {moment.feature}
              </span>
            </div>
            <h4 className="mt-1 font-serif text-sm font-semibold text-stone-900">
              {moment.title}
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-stone-600">{moment.description}</p>
            <p className="mt-2 text-xs font-medium text-brand-primary">{moment.outcome}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
