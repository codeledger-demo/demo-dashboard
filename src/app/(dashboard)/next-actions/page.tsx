import { getLatestNextActions } from '@/lib/api/timeline-queries';

export default async function NextActionsPage() {
  const data = await getLatestNextActions();

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Next Actions</h1>
        <p className="mt-1 text-sm text-stone-500">
          Ranked recommendations based on current signals and historical outcomes. What to do next.
        </p>
      </div>

      <div className="space-y-4">
        {data.actions.map((a, i) => (
          <div key={i} className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-medium text-stone-900">{a.title}</h3>
                  <p className="mt-1 text-sm text-stone-500">{a.expectedImpact}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-mono text-lg font-bold text-stone-900">{a.confidence.toFixed(2)}</div>
                <div className="text-xs text-stone-400">confidence</div>
              </div>
            </div>

            <div className="mt-3 ml-12">
              <div className="h-2 w-full rounded-full bg-stone-100">
                <div
                  className="h-2 rounded-full bg-brand-primary"
                  style={{ width: `${a.confidence * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-4 ml-12">
              <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">Based on</div>
              <ul className="mt-1 space-y-1">
                {a.basedOn.map((b, j) => (
                  <li key={j} className="text-sm text-stone-600">• {b}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-stone-50 px-4 py-3 text-xs text-stone-500">
        {data.rationale}
      </div>
    </div>
  );
}
