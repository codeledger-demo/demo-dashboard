import Link from 'next/link';

interface Incident {
  id: string;
  title: string;
  tagline: string;
  arc: number;
  severity: 'critical' | 'high' | 'low';
  date: string;
  resolved: boolean;
  healthImpact: number;
  lessonsCreated: number;
  keyMetric: string;
}

interface IncidentGalleryProps {
  incidents: Incident[];
}

const severityConfig: Record<string, { icon: string; color: string; border: string }> = {
  critical: {
    icon: 'M12 9v4m0 4h.01M12 2L2 20h20L12 2z',
    color: 'text-red-600',
    border: 'border-l-red-500',
  },
  high: {
    icon: 'M12 9v4m0 4h.01M12 2L2 20h20L12 2z',
    color: 'text-amber-600',
    border: 'border-l-amber-500',
  },
  low: {
    icon: 'M5 13l4 4L19 7',
    color: 'text-emerald-600',
    border: 'border-l-emerald-500',
  },
};

const arcLabels: Record<number, string> = {
  3: 'Arc 3: The Incident',
  4: 'Arc 4: The Reckoning',
  5: 'Arc 5: The Turnaround',
  6: 'Arc 6: The Payoff',
};

export function IncidentGallery({ incidents }: IncidentGalleryProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {incidents.map((incident) => {
        const config = severityConfig[incident.severity] ?? severityConfig.low;
        const isNegative = incident.healthImpact < 0;

        return (
          <Link
            key={incident.id}
            href={`/incidents/${incident.id}`}
            className={`group rounded-lg border border-stone-200 border-l-4 ${config.border} bg-surface-card p-5 shadow-sm transition-shadow hover:shadow-md`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <svg
                  className={`h-5 w-5 shrink-0 ${config.color}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={config.icon} />
                </svg>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  {incident.title}
                </h3>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isNegative
                    ? 'bg-red-50 text-semantic-error'
                    : 'bg-emerald-50 text-semantic-success'
                }`}
              >
                {isNegative ? '' : '+'}
                {incident.healthImpact}
              </span>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-stone-600">{incident.tagline}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-medium text-brand-primary">
                {arcLabels[incident.arc] ?? `Arc ${incident.arc}`}
              </span>
              <span className="text-xs text-stone-400">
                {new Date(incident.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="rounded bg-stone-100 px-2 py-0.5 font-mono text-xs text-stone-600">
                {incident.keyMetric}
              </span>
              <span className="text-xs font-medium text-brand-primary opacity-0 transition-opacity group-hover:opacity-100">
                View Details &rarr;
              </span>
            </div>

            {incident.lessonsCreated > 0 && (
              <div className="mt-2 text-xs text-stone-400">
                {incident.lessonsCreated} lesson{incident.lessonsCreated > 1 ? 's' : ''} encoded
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
