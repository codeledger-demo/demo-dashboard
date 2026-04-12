import { getLatestLearnings } from '@/lib/api/timeline-queries';

export default async function LearningsPage() {
  const data = await getLatestLearnings();

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Learnings</h1>
        <p className="mt-1 text-sm text-stone-500">
          Recurring patterns from ECL history — {data.windowLabel}. What repeats across the team.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {data.topPatterns.map((p) => (
          <div key={p.name} className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm font-semibold text-stone-800">{p.name}</h3>
              <span className={`text-xs font-medium ${
                p.trend === 'improving' ? 'text-emerald-600' :
                p.trend === 'degrading' ? 'text-red-600' :
                'text-stone-400'
              }`}>
                {p.trend === 'improving' ? '↑' : p.trend === 'degrading' ? '↓' : '→'} {p.trend}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div>
                <div className="text-2xl font-bold text-stone-900">{p.occurrences}</div>
                <div className="text-xs text-stone-400">occurrences</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900">{Math.round(p.successRate * 100)}%</div>
                <div className="text-xs text-stone-400">success rate</div>
              </div>
            </div>

            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-stone-100">
                <div
                  className={`h-2 rounded-full ${p.successRate >= 0.75 ? 'bg-emerald-500' : p.successRate >= 0.5 ? 'bg-amber-500' : 'bg-red-400'}`}
                  style={{ width: `${p.successRate * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-stone-400">Hotspot files</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {p.hotspotFiles.map((f) => (
                  <span key={f} className="rounded bg-stone-100 px-2 py-0.5 font-mono text-xs text-stone-600">
                    {f.split('/').pop()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-stone-900">Recommendations</h2>
        <ul className="mt-4 space-y-3">
          {data.recommendations.map((r, i) => (
            <li key={i} className="flex gap-3 text-sm text-stone-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-bold text-brand-primary">{i + 1}</span>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
