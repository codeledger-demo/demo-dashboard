import { getExplainHistory } from '@/lib/api/timeline-queries';

export default async function ExplainPage() {
  const entries = await getExplainHistory();

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Run Explanations</h1>
        <p className="mt-1 text-sm text-stone-500">
          Why did each analysis produce this result? Evidence-cited, deterministic — no LLM in the loop.
        </p>
      </div>

      <div className="space-y-6">
        {entries.map((e) => (
          <div key={e.id} className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  e.outcome.status === 'PASS' ? 'bg-emerald-100 text-emerald-700' :
                  e.outcome.status === 'WARN' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>{e.outcome.status}</span>
                <span className="text-sm text-stone-500">{new Date(e.timestamp).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-3 text-xs text-stone-400">
                <span>ISC {e.contextAnalysis.isc.toFixed(2)}</span>
                <span>CCS {e.contextAnalysis.ccs.toFixed(2)}</span>
                <span>Truth {e.contextAnalysis.truthGrade}</span>
              </div>
            </div>

            <p className="mt-3 text-sm font-medium text-stone-800">{e.outcome.summary}</p>

            <div className="mt-4 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Why</h3>
              <ul className="space-y-1">
                {e.why.map((w, i) => (
                  <li key={i} className="text-sm text-stone-600">• {w.reason}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Evidence</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {e.evidence.map((ev, i) => (
                  <div key={i} className="rounded-lg bg-stone-50 px-3 py-2">
                    <div className="text-xs text-stone-400">{ev.label}</div>
                    <div className="text-sm font-medium text-stone-700">{ev.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Confidence Breakdown</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(e.confidenceBreakdown).map(([key, val]) => (
                  <div key={key} className="text-xs text-stone-500">
                    <span className="text-stone-400">{key}:</span>{' '}
                    <span className="font-mono font-medium text-stone-700">{(val as number).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
