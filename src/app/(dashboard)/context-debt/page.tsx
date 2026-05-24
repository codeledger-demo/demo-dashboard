const data = {
  score: 82,
  grade: 'B',
  trend: 'improving',
  trend_delta: 4,
  factors: {
    isc_coverage: { score: 71, label: 'ISC Coverage', description: 'Fraction of activation sessions with ISC ≥ 0.75' },
    ccs_quality: { score: 88, label: 'CCS Quality', description: 'Median context confidence score across bundles' },
    staleness: { score: 74, label: 'Staleness', description: 'Fraction of bundles activated within staleness TTL' },
    blast_radius_discipline: { score: 90, label: 'Blast Radius Discipline', description: 'Fraction of PRs with blast radius within expected range' },
    evidence_completeness: { score: 87, label: 'Evidence Completeness', description: 'Fraction of verify runs with complete evidence gates' },
  },
  worst_two: ['isc_coverage', 'staleness'],
  recommendation: 'Run `codeledger coach` more consistently before editing, and refresh bundles after long pauses.',
  window_days: 30,
} as const;

function scoreColor(s: number): string {
  return s >= 85 ? 'text-emerald-600' : s >= 70 ? 'text-amber-600' : 'text-red-600';
}

function scoreBg(s: number): string {
  return s >= 85 ? 'bg-emerald-50 border-emerald-200' : s >= 70 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';
}

function scoreBar(s: number) {
  const color = s >= 85 ? 'bg-emerald-500' : s >= 70 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="mt-2 h-2 w-full rounded-full bg-stone-100">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${s}%` }} />
    </div>
  );
}

export default async function ContextDebtPage() {
  const factors = Object.entries(data.factors);

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Health</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900">Context Debt</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          A composite score measuring how well context quality has been maintained across activations over the past {data.window_days} days.
        </p>
      </div>

      {/* Top score card */}
      <div className={`rounded-xl border p-8 shadow-sm ${scoreBg(data.score)}`}>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-stone-400">Overall Context Debt Score</div>
            <div className={`mt-1 text-6xl font-bold ${scoreColor(data.score)}`}>{data.score}</div>
            <div className="mt-1 text-sm font-medium text-stone-500">Grade <span className={`font-bold ${scoreColor(data.score)}`}>{data.grade}</span></div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium uppercase tracking-wide text-stone-400">Trend</div>
            <div className="mt-1 text-lg font-semibold text-emerald-600">↑ {data.trend_delta} pts</div>
            <div className="text-xs text-stone-500 capitalize">{data.trend} vs last period</div>
          </div>
        </div>
      </div>

      {/* Factor breakdown */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">Factor Breakdown</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {factors.map(([key, f]) => {
            const isWeak = (data.worst_two as readonly string[]).includes(key);
            return (
              <div key={key} className={`rounded-xl border bg-white p-5 shadow-sm ${isWeak ? 'border-amber-300' : 'border-stone-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="text-xs font-semibold text-stone-700">{f.label}</div>
                  {isWeak && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">WEAK</span>}
                </div>
                <div className={`mt-2 text-2xl font-bold ${scoreColor(f.score)}`}>{f.score}</div>
                {scoreBar(f.score)}
                <p className="mt-2 text-xs text-stone-500">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendation */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-700">Recommendation</h2>
        <div className="mt-3 rounded-lg bg-stone-900 p-4">
          <p className="font-mono text-xs text-emerald-300">{data.recommendation}</p>
        </div>
      </div>
    </div>
  );
}
