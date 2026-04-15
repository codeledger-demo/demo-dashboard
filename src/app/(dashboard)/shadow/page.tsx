interface ShadowRun {
  id: string;
  legacy: string;
  candidate: string;
  samples: number;
  exactMatchPct: number;
  criticalDiffPct: number;
  recommendation: string;
  completedAt: string;
  latencyLegacy: number;
  latencyCandidate: number;
}

function getShadowRuns(): ShadowRun[] {
  return [
    { id: 'shd_a14e226d', legacy: 'isc-scoring', candidate: 'isc-scoring-v2', samples: 50, exactMatchPct: 96, criticalDiffPct: 0, recommendation: 'safe_to_expand', completedAt: '2026-04-14T19:30:00Z', latencyLegacy: 2, latencyCandidate: 3 },
    { id: 'shd_b29f334e', legacy: 'file-scoring', candidate: 'file-scoring-weighted', samples: 120, exactMatchPct: 72, criticalDiffPct: 8, recommendation: 'hold', completedAt: '2026-04-13T14:15:00Z', latencyLegacy: 15, latencyCandidate: 12 },
    { id: 'shd_c33d445f', legacy: 'assembly-pipeline', candidate: 'assembly-pipeline-v3', samples: 200, exactMatchPct: 45, criticalDiffPct: 22, recommendation: 'unsafe', completedAt: '2026-04-12T10:00:00Z', latencyLegacy: 45, latencyCandidate: 120 },
  ];
}

function badge(rec: string) {
  const cls = rec === 'safe_to_expand' ? 'bg-emerald-100 text-emerald-700'
    : rec === 'hold' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
  const label = rec === 'safe_to_expand' ? 'SAFE' : rec === 'hold' ? 'HOLD' : 'UNSAFE';
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}

export default function ShadowPage() {
  const runs = getShadowRuns();
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Shadow: Parallel Truth Evaluation</h1>
        <p className="mt-1 text-sm text-stone-500">Compare legacy and candidate implementations side by side before rollout. Never trust a refactor until the new code proves itself.</p>
      </div>
      <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-stone-100 text-left text-xs font-medium uppercase tracking-wider text-stone-400">
            <th className="px-4 py-3">Run</th><th className="px-4 py-3">Legacy vs Candidate</th><th className="px-4 py-3">Samples</th><th className="px-4 py-3">Match</th><th className="px-4 py-3">Critical</th><th className="px-4 py-3">Latency</th><th className="px-4 py-3">Verdict</th>
          </tr></thead>
          <tbody>{runs.map((r) => (
            <tr key={r.id} className="border-b border-stone-50 hover:bg-stone-50/50">
              <td className="px-4 py-3 font-mono text-xs text-stone-500">{r.id}</td>
              <td className="px-4 py-3"><span className="text-stone-700">{r.legacy}</span><span className="mx-1 text-stone-300">vs</span><span className="text-stone-700">{r.candidate}</span></td>
              <td className="px-4 py-3 text-stone-600">{r.samples}</td>
              <td className="px-4 py-3 text-stone-600">{r.exactMatchPct}%</td>
              <td className="px-4 py-3"><span className={r.criticalDiffPct > 5 ? 'font-medium text-red-600' : 'text-stone-600'}>{r.criticalDiffPct}%</span></td>
              <td className="px-4 py-3 text-xs text-stone-500">{r.latencyLegacy}ms → {r.latencyCandidate}ms</td>
              <td className="px-4 py-3">{badge(r.recommendation)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">How Shadow Works</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-stone-50 p-4"><div className="text-sm font-medium text-stone-700">1. Run both paths</div><p className="mt-1 text-xs text-stone-500">Execute legacy and candidate on identical inputs with per-sample timeout.</p></div>
          <div className="rounded-lg bg-stone-50 p-4"><div className="text-sm font-medium text-stone-700">2. Compare deterministically</div><p className="mt-1 text-xs text-stone-500">5 comparators: output, sufficiency, ranking, normalization, latency.</p></div>
          <div className="rounded-lg bg-stone-50 p-4"><div className="text-sm font-medium text-stone-700">3. Gate the rollout</div><p className="mt-1 text-xs text-stone-500">CI-grade thresholds. Exit 0 = safe. Exit 10 = blocked.</p></div>
        </div>
      </div>
    </div>
  );
}
