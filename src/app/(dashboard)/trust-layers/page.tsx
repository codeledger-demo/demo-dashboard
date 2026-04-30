import { ConfidenceBadge } from '@/components/shared/ConfidenceBadge';
import { getTrustLayers } from '@/lib/api/timeline-queries';
import type { TrustLayerMetric, TrustLayerStatus } from '@/types/dashboard';

const statusClasses: Record<TrustLayerStatus, string> = {
  strong: 'border-emerald-200 bg-emerald-50 text-brand-primary',
  watch: 'border-amber-200 bg-amber-50 text-semantic-warning',
  unknown: 'border-stone-200 bg-stone-50 text-stone-500',
};

const statusLabel: Record<TrustLayerStatus, string> = {
  strong: 'Strong',
  watch: 'Watch',
  unknown: 'Unknown',
};

function TrustLayerCard({ metric }: { metric: TrustLayerMetric }): JSX.Element {
  return (
    <article className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            {metric.label}
          </p>
          <h2 className="mt-2 font-serif text-xl font-bold text-stone-900">
            {metric.headline}
          </h2>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[metric.status]}`}>
          {statusLabel[metric.status]}
        </span>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <span className="font-mono text-4xl font-semibold tabular-nums text-stone-900">
          {metric.score}
        </span>
        <span className="mb-1 text-xs uppercase tracking-wide text-stone-400">
          score
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-stone-600">
        {metric.summary}
      </p>

      <div className="mt-5 rounded-lg border border-stone-100 bg-stone-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
          Evidence shown publicly
        </p>
        <ul className="mt-3 space-y-2 text-sm text-stone-600">
          {metric.evidence.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-stone-500">
        {metric.privateBoundary}
      </p>
    </article>
  );
}

export default async function TrustLayersPage(): Promise<JSX.Element> {
  const snapshot = await getTrustLayers();

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
              Trust Layers
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900">
              Public-safe proof across context, audit, and signal health
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-600">
              {snapshot.narrative}
            </p>
          </div>
          <ConfidenceBadge
            confidence={{
              level: 'high',
              eventCount: snapshot.metrics.length,
              reason: 'Fixture is generated from the public-safe trust-layer projection.',
            }}
            showCount
            size="md"
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {snapshot.metrics.map((metric) => (
          <TrustLayerCard key={metric.id} metric={metric} />
        ))}
      </div>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            Public boundary
          </p>
          <h2 className="mt-2 font-serif text-xl font-bold text-stone-900">
            What this page deliberately does not expose
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-stone-600">
            {snapshot.publicBoundary.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            Next proof moment
          </p>
          <h2 className="mt-2 font-serif text-xl font-bold text-stone-900">
            One route from interest to evidence
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            {snapshot.nextProofMoment}
          </p>
          <p className="mt-5 text-xs text-stone-400">
            Generated {snapshot.generatedAt} - {snapshot.mode.replace('_', ' ')}
          </p>
        </div>
      </section>
    </div>
  );
}
