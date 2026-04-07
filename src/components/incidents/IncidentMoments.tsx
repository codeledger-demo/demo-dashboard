interface Moment {
  feature: string;
  outcome: string;
  callout: string;
}

interface IncidentMomentsProps {
  moments: Moment[];
}

const featureColors: Record<string, string> = {
  CIC: 'bg-brand-primary/10 text-brand-primary',
  'Release Authority': 'bg-red-50 text-semantic-error',
  'Lessons Ledger': 'bg-amber-50 text-semantic-warning',
  'Ghost Detection': 'bg-purple-50 text-purple-700',
  'Drift Monitor': 'bg-blue-50 text-semantic-info',
  'Architecture Health': 'bg-emerald-50 text-semantic-success',
};

export function IncidentMoments({ moments }: IncidentMomentsProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-serif text-base font-semibold text-stone-900">
        CodeLedger Features Activated
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {moments.map((moment, i) => (
          <div
            key={i}
            className="rounded-lg border border-stone-200 bg-surface-card p-4 shadow-sm"
          >
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                featureColors[moment.feature] ?? 'bg-stone-100 text-stone-600'
              }`}
            >
              {moment.feature}
            </span>
            <p className="mt-2 text-sm text-stone-700">{moment.outcome}</p>
            <div className="mt-3 rounded-md bg-brand-primary/5 px-3 py-2">
              <p className="text-xs font-medium text-brand-primary">{moment.callout}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
