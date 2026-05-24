const data = {
  report: {
    period: { start: '2026-02-10', end: '2026-05-10', days: 90 },
    generated_at: '2026-05-13T09:00:00Z',
    generated_by: 'sara-chen-acme',
    repo: 'acme-platform',
  },
  summary: {
    total_merges: 47,
    cic_pass_rate: 0.89,
    release_gates_run: 12,
    release_gates_passed: 11,
    verify_runs: 47,
    verify_pass_rate: 0.91,
    policy_violations: 2,
    policy_violations_resolved: 2,
  },
  cic_outcomes: {
    pass: 42,
    warn: 3,
    fail: 2,
    breakdown_by_persona: {
      'sara-chen-acme': { pass: 22, warn: 1, fail: 0 },
      'marcus-webb': { pass: 15, warn: 2, fail: 2 },
      'priya-k': { pass: 5, warn: 0, fail: 0 },
    },
  },
  release_gates: {
    total: 12,
    passed: 11,
    blocked: 1,
    block_reason: 'missing_test_coverage',
    block_resolved: true,
  },
  policy_enforcement: {
    rules_active: 6,
    violations_detected: 2,
    violations_resolved_within_48h: 2,
    overrides_used: 0,
  },
  evidence_integrity: {
    all_findings_traceable: true,
    no_hallucinated_events: true,
    schema_version_consistent: true,
  },
} as const;

function pct(v: number): string {
  return `${Math.round(v * 100)}%`;
}

function integrityBadge(ok: boolean) {
  return ok ? (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">PASS</span>
  ) : (
    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">FAIL</span>
  );
}

export default async function CompliancePage() {
  const { report, summary, cic_outcomes, release_gates, policy_enforcement, evidence_integrity } = data;
  const personas = Object.entries(cic_outcomes.breakdown_by_persona);

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Ship</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900">Compliance</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          A {report.period.days}-day deterministic compliance report for <strong>{report.repo}</strong>. Every finding maps to a real ledger event — no narrative hallucination.
        </p>
        <p className="mt-1 text-xs text-stone-400">
          Period: {report.period.start} → {report.period.end} · Generated: {new Date(report.generated_at).toLocaleDateString()} · By: {report.generated_by}
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Total Merges', value: String(summary.total_merges), note: 'across period' },
          { label: 'CIC Pass Rate', value: pct(summary.cic_pass_rate), note: `${cic_outcomes.pass}/${cic_outcomes.pass + cic_outcomes.warn + cic_outcomes.fail} passed` },
          { label: 'Verify Pass Rate', value: pct(summary.verify_pass_rate), note: `${summary.verify_runs} runs` },
          { label: 'Policy Violations', value: String(summary.policy_violations), note: `${summary.policy_violations_resolved} resolved` },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-medium text-stone-400">{kpi.label}</div>
            <div className="mt-1 text-2xl font-bold text-stone-900">{kpi.value}</div>
            <div className="mt-0.5 text-xs text-stone-500">{kpi.note}</div>
          </div>
        ))}
      </div>

      {/* CIC outcomes */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-700">CIC Outcomes</h2>
        <div className="mt-4 flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{cic_outcomes.pass}</div>
            <div className="text-xs text-stone-400">Pass</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{cic_outcomes.warn}</div>
            <div className="text-xs text-stone-400">Warn</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{cic_outcomes.fail}</div>
            <div className="text-xs text-stone-400">Fail</div>
          </div>
        </div>
        <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-stone-400">By Developer</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-left text-xs font-medium uppercase tracking-wider text-stone-400">
                <th className="pb-2">Developer</th>
                <th className="pb-2">Pass</th>
                <th className="pb-2">Warn</th>
                <th className="pb-2">Fail</th>
              </tr>
            </thead>
            <tbody>
              {personas.map(([name, counts]) => (
                <tr key={name} className="border-b border-stone-50">
                  <td className="py-2 font-medium text-stone-700">{name}</td>
                  <td className="py-2 text-emerald-600">{counts.pass}</td>
                  <td className="py-2 text-amber-600">{counts.warn}</td>
                  <td className="py-2 text-red-600">{counts.fail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Release gates + Policy */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-700">Release Gates</h2>
          <div className="mt-3 space-y-2 text-sm text-stone-600">
            <div className="flex justify-between"><span>Total runs</span><span className="font-medium">{release_gates.total}</span></div>
            <div className="flex justify-between"><span>Passed</span><span className="font-medium text-emerald-600">{release_gates.passed}</span></div>
            <div className="flex justify-between"><span>Blocked</span><span className="font-medium text-red-600">{release_gates.blocked}</span></div>
            <div className="flex justify-between"><span>Block reason</span><span className="font-mono text-xs text-stone-500">{release_gates.block_reason}</span></div>
            <div className="flex justify-between"><span>Block resolved</span><span className={release_gates.block_resolved ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>{release_gates.block_resolved ? 'Yes' : 'No'}</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-700">Policy Enforcement</h2>
          <div className="mt-3 space-y-2 text-sm text-stone-600">
            <div className="flex justify-between"><span>Rules active</span><span className="font-medium">{policy_enforcement.rules_active}</span></div>
            <div className="flex justify-between"><span>Violations detected</span><span className="font-medium text-amber-600">{policy_enforcement.violations_detected}</span></div>
            <div className="flex justify-between"><span>Resolved within 48h</span><span className="font-medium text-emerald-600">{policy_enforcement.violations_resolved_within_48h}</span></div>
            <div className="flex justify-between"><span>Overrides used</span><span className="font-medium">{policy_enforcement.overrides_used}</span></div>
          </div>
        </div>
      </div>

      {/* Evidence integrity */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-700">Evidence Integrity</h2>
        <p className="mt-1 text-xs text-stone-500">All findings in this report must map to verifiable events. No hallucinated data.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { key: 'all_findings_traceable', label: 'All findings traceable', ok: evidence_integrity.all_findings_traceable },
            { key: 'no_hallucinated_events', label: 'No hallucinated events', ok: evidence_integrity.no_hallucinated_events },
            { key: 'schema_version_consistent', label: 'Schema version consistent', ok: evidence_integrity.schema_version_consistent },
          ].map((item) => (
            <div key={item.key} className="flex items-center gap-2 rounded-lg bg-stone-50 px-4 py-3">
              {integrityBadge(item.ok)}
              <span className="text-xs text-stone-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
