import type { ServiceNode } from './ServiceGraph';

interface DriftOverlayProps {
  service: ServiceNode | null;
  onClose: () => void;
}

const driftColor: Record<string, string> = {
  low: 'bg-emerald-50 text-semantic-success',
  medium: 'bg-amber-50 text-semantic-warning',
  high: 'bg-red-50 text-semantic-error',
};

const demoFindings: Record<string, string[]> = {
  auth: [
    'P0: Token refresh handler missing runtime validation',
    'P1: Session store has no TTL enforcement',
    'P1: OAuth callback lacks CSRF check',
  ],
  billing: [
    'P1: Stripe webhook signature not verified in staging',
    'P1: Invoice PDF generator bypasses shared formatter',
  ],
  notifications: ['P2: Email template fallback untested'],
  reporting: [
    'P1: Raw SQL query in monthly aggregation',
    'P2: CSV export missing header sanitisation',
  ],
  webhooks: ['P2: Retry backoff cap too aggressive for large payloads'],
};

export function DriftOverlay({ service, onClose }: DriftOverlayProps) {
  if (!service) return null;

  const passColor =
    service.cicPassRate >= 90
      ? 'text-semantic-success'
      : service.cicPassRate >= 80
        ? 'text-semantic-warning'
        : 'text-semantic-error';

  const findings = demoFindings[service.id] ?? [];

  return (
    <div className="absolute right-0 top-0 z-10 h-full w-80 overflow-y-auto border-l border-stone-200 bg-surface-card p-5 shadow-lg">
      <div className="flex items-start justify-between">
        <h3 className="font-serif text-lg font-bold text-stone-900">{service.name}</h3>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-700">&times;</button>
      </div>

      <span className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${driftColor[service.driftLevel]}`}>
        {service.driftLevel} drift
      </span>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-stone-500">CIC Pass Rate</dt>
          <dd className={`font-semibold ${passColor}`}>{service.cicPassRate}%</dd>
        </div>
        <div>
          <dt className="text-stone-500">Files</dt>
          <dd className="font-medium text-stone-900">{service.fileCount}</dd>
        </div>
        <div>
          <dt className="text-stone-500">Last Commit</dt>
          <dd className="font-medium text-stone-900">{service.lastCommitPersona}</dd>
        </div>
      </dl>

      {findings.length > 0 && (
        <div className="mt-5">
          <h4 className="text-xs font-medium uppercase tracking-wide text-stone-500">Recent Findings</h4>
          <ul className="mt-2 space-y-1.5 text-xs text-stone-700">
            {findings.map((f, i) => (
              <li key={i} className="rounded border border-stone-100 bg-stone-50 px-2 py-1.5">{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
