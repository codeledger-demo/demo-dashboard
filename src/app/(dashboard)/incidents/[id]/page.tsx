import Link from 'next/link';
import { notFound } from 'next/navigation';
import { IncidentTimeline } from '@/components/incidents/IncidentTimeline';
import { IncidentMoments } from '@/components/incidents/IncidentMoments';
import { getNamedIncident, getNamedIncidents } from '@/lib/api/timeline-queries';

// Required for static export (output: 'export' in next.config.mjs).
// Pre-renders one page per known incident ID at build time so the
// dynamic route can be served as plain static HTML.
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  const incidents = await getNamedIncidents();
  return incidents.map((incident) => ({ id: incident.id }));
}

const severityStyles: Record<string, string> = {
  critical: 'bg-red-50 text-semantic-error',
  high: 'bg-amber-50 text-semantic-warning',
  low: 'bg-emerald-50 text-semantic-success',
};

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const incident = await getNamedIncident(id);

  if (!incident) {
    notFound();
  }

  const isNegative = incident.healthImpact < 0;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Link
          href="/incidents"
          className="text-sm text-brand-primary hover:underline"
        >
          &larr; All Incidents
        </Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">{incident.title}</h1>
            <p className="mt-1 text-sm text-stone-500">{incident.tagline}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${severityStyles[incident.severity]}`}>
              {incident.severity}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isNegative ? 'bg-red-50 text-semantic-error' : 'bg-emerald-50 text-semantic-success'
              }`}
            >
              {isNegative ? '' : '+'}
              {incident.healthImpact} health
            </span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-stone-400">
          <span>Arc {incident.arc}</span>
          <span>
            {new Date(incident.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-stone-200 bg-surface-card p-5 shadow-sm">
        <h2 className="font-serif text-base font-semibold text-stone-900">What Happened</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">{incident.narrative}</p>
      </div>

      <div>
        <h2 className="mb-4 font-serif text-base font-semibold text-stone-900">Timeline</h2>
        <IncidentTimeline moments={incident.timeline} />
      </div>

      <div>
        <h2 className="mb-4 font-serif text-base font-semibold text-stone-900">Before / After</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {incident.beforeAfter.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-stone-200 bg-surface-card p-4 text-center shadow-sm"
            >
              <div className="text-xs font-medium text-stone-400">{item.label}</div>
              <div className="mt-1 flex items-center justify-center gap-2">
                <span className="font-mono text-sm text-stone-400">{item.before}</span>
                <span className="text-stone-300">&rarr;</span>
                <span className="font-mono text-sm font-semibold text-stone-900">{item.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <IncidentMoments moments={incident.moments} />

      {incident.lessonsCreated > 0 && (
        <div className="rounded-lg border border-stone-200 bg-surface-card p-5 shadow-sm">
          <h2 className="font-serif text-base font-semibold text-stone-900">Lessons Encoded</h2>
          <p className="mt-1 text-sm text-stone-600">
            {incident.lessonsCreated} lesson{incident.lessonsCreated > 1 ? 's' : ''} were added to the{' '}
            <Link href="/lessons" className="text-brand-primary hover:underline">
              Lessons Ledger
            </Link>{' '}
            from this incident.
          </p>
        </div>
      )}
    </div>
  );
}
