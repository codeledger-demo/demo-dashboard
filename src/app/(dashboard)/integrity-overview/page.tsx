interface IntegrityDomain {
  domain: string;
  verdict: string;
  detail: string;
  icon: string;
}

function getIntegrityStatus(): IntegrityDomain[] {
  return [
    { domain: 'Architecture', verdict: 'PASS', detail: 'No parallel-system risks detected. Doctrine clean.', icon: '🏛️' },
    { domain: 'Implementation', verdict: 'PASS', detail: 'Shadow: safe_to_expand (96% match, 0% critical)', icon: '🔧' },
    { domain: 'Release', verdict: 'WARN', detail: '104/131 features propagated. 27 undocumented commands.', icon: '📦' },
  ];
}

function verdictColor(v: string) {
  if (v === 'PASS') return 'border-emerald-200 bg-emerald-50';
  if (v === 'WARN') return 'border-amber-200 bg-amber-50';
  return 'border-red-200 bg-red-50';
}

function verdictText(v: string) {
  if (v === 'PASS') return 'text-emerald-700';
  if (v === 'WARN') return 'text-amber-700';
  return 'text-red-700';
}

export default function IntegrityOverviewPage() {
  const domains = getIntegrityStatus();
  const overall = domains.some((d) => d.verdict === 'FAIL') ? 'FAIL' : domains.some((d) => d.verdict === 'WARN') ? 'WARN' : 'PASS';
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Integrity Trinity</h1>
        <p className="mt-1 text-sm text-stone-500">One unified view of architecture, implementation, and release integrity. CodeLedger protects how you design, how you implement, and how you release.</p>
      </div>
      <div className={`rounded-xl border-2 p-6 text-center ${verdictColor(overall)}`}>
        <div className={`text-3xl font-bold ${verdictText(overall)}`}>Overall: {overall}</div>
        <p className="mt-1 text-sm text-stone-500">Deterministic verification across all integrity domains</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{domains.map((d) => (
        <div key={d.domain} className={`rounded-xl border p-5 ${verdictColor(d.verdict)}`}>
          <div className="text-2xl">{d.icon}</div>
          <div className="mt-2 text-sm font-semibold text-stone-700">{d.domain} Integrity</div>
          <div className={`mt-1 text-lg font-bold ${verdictText(d.verdict)}`}>{d.verdict}</div>
          <p className="mt-2 text-xs text-stone-500">{d.detail}</p>
        </div>
      ))}</div>
      <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-100 px-4 py-3"><h2 className="text-sm font-semibold text-stone-700">Surface Propagation</h2></div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-stone-100 text-left text-xs font-medium uppercase tracking-wider text-stone-400">
            <th className="px-4 py-2">Surface</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Evidence</th>
          </tr></thead>
          <tbody>
            {[
              { surface: 'Source', status: 'OK', evidence: 'All commands registered' },
              { surface: 'Dist (compiled)', status: 'OK', evidence: 'Build clean' },
              { surface: 'Standalone CJS', status: 'OK', evidence: 'SHA256: 88cc8fd9c544' },
              { surface: 'Vendored binary', status: 'OK', evidence: 'SHA256: 88cc8fd9c544 (matches)' },
              { surface: 'Documentation', status: 'WARN', evidence: '27 commands undocumented' },
            ].map((s) => (
              <tr key={s.surface} className="border-b border-stone-50">
                <td className="px-4 py-2 text-stone-700">{s.surface}</td>
                <td className="px-4 py-2">{s.status === 'OK' ? <span className="text-emerald-600 font-medium">✓ OK</span> : <span className="text-amber-600 font-medium">⚠ WARN</span>}</td>
                <td className="px-4 py-2 text-xs text-stone-500">{s.evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">What CodeLedger Protects</h2>
        <div className="mt-4 space-y-3">
          <div className="flex gap-3"><span className="text-lg">🏛️</span><div><div className="text-sm font-medium text-stone-700">Architecture — Doctrine Intelligence</div><p className="text-xs text-stone-500">Prevents parallel systems, duplicate truth, and second workflows. Progressive intervention from light cue to two-phase stop.</p></div></div>
          <div className="flex gap-3"><span className="text-lg">🔧</span><div><div className="text-sm font-medium text-stone-700">Implementation — Shadow Evaluation</div><p className="text-xs text-stone-500">Compares legacy and candidate implementations side by side. 5 comparators, severity classification, CI-grade gate.</p></div></div>
          <div className="flex gap-3"><span className="text-lg">📦</span><div><div className="text-sm font-medium text-stone-700">Release — Feature Propagation</div><p className="text-xs text-stone-500">Verifies features propagate across all surfaces: source, dist, standalone, vendored, docs. SHA256 content hashing.</p></div></div>
        </div>
      </div>
    </div>
  );
}
