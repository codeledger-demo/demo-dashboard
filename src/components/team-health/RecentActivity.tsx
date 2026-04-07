interface ActivityEvent {
  id: string;
  timestamp: string;
  headline: string;
  severity: string;
  persona: string;
}

// Hardcoded demo events matching the story arc.
const demoEvents: ActivityEvent[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1 * 3600_000).toISOString(),
    headline: 'CIC check passed \u2014 all claims verified',
    severity: 'success',
    persona: 'Sara Chen',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3 * 3600_000).toISOString(),
    headline: 'PR #142 merged \u2014 billing service refactor',
    severity: 'success',
    persona: 'Sara Chen',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 5 * 3600_000).toISOString(),
    headline: 'CIC failure \u2014 missing runtime validation on /api/projects',
    severity: 'error',
    persona: 'Marcus Webb',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 8 * 3600_000).toISOString(),
    headline: 'Lesson contributed: "Always add timeout to outbound HTTP calls"',
    severity: 'info',
    persona: 'Marcus Webb',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 12 * 3600_000).toISOString(),
    headline: 'CIC check passed \u2014 drift warning on shared helpers',
    severity: 'warning',
    persona: 'Priya Kapoor',
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 18 * 3600_000).toISOString(),
    headline: 'Release v2.4.1 \u2014 confidence 92%, 0 P0 findings',
    severity: 'success',
    persona: 'Sara Chen',
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 24 * 3600_000).toISOString(),
    headline: 'CIC failure \u2014 outbound HTTP call without timeout in billing',
    severity: 'error',
    persona: 'Priya Kapoor',
  },
  {
    id: '8',
    timestamp: new Date(Date.now() - 30 * 3600_000).toISOString(),
    headline: 'PR #139 merged \u2014 auth middleware cleanup',
    severity: 'success',
    persona: 'Marcus Webb',
  },
  {
    id: '9',
    timestamp: new Date(Date.now() - 48 * 3600_000).toISOString(),
    headline: 'Architecture health dipped to 72 \u2014 duplication pressure detected',
    severity: 'warning',
    persona: 'System',
  },
  {
    id: '10',
    timestamp: new Date(Date.now() - 72 * 3600_000).toISOString(),
    headline: 'Lesson contributed: "Validate route params at the boundary"',
    severity: 'info',
    persona: 'Priya Kapoor',
  },
];

function severityDot(severity: string): string {
  switch (severity) {
    case 'success':
      return 'bg-semantic-success';
    case 'warning':
      return 'bg-semantic-warning';
    case 'error':
      return 'bg-semantic-error';
    default:
      return 'bg-semantic-info';
  }
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface RecentActivityProps {
  events?: ActivityEvent[];
}

export function RecentActivity({ events = demoEvents }: RecentActivityProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
      <p className="mb-4 font-serif text-sm font-medium text-stone-500">
        Recent Activity
      </p>
      <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
        {events.map((e) => (
          <div key={e.id} className="flex items-start gap-3">
            <div className="mt-1.5 flex-shrink-0">
              <span className={`block h-2 w-2 rounded-full ${severityDot(e.severity)}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug text-stone-700">{e.headline}</p>
              <p className="mt-0.5 text-xs text-stone-400">
                {relativeTime(e.timestamp)} &middot; {e.persona}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
