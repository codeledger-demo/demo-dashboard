const data = {
  pr_summary: {
    title: 'feat(notifications): delivery-status webhook handler',
    risk: 'low',
    drift: 'none',
    evidence_gaps: 0,
    observations: [
      'Bundle covered all changed files',
      'Test evidence present for all production changes',
      'Context fingerprint captured at merge time',
    ],
  },
  context_fingerprint: {
    available: true,
    ccs: 0.91,
    ccs_label: 'HIGH',
    isc: 0.88,
    isc_label: 'SUFFICIENT',
    bundle_hash: 'a3f7c2e1',
    captured_at: '2026-05-13T14:22:00Z',
    summary:
      'Context was HIGH confidence (CCS 0.91) with SUFFICIENT intent coverage (ISC 0.88). Bundle covered 100% of changed files.',
  },
  trust_layers: {
    context_sufficiency: {
      status: 'sufficient',
      confidence: 91,
      recommendation: 'proceed',
      gaps: [] as string[],
    },
    audit_board: {
      status: 'pass',
      risk: 'low',
      confidence: 93,
      findings: 0,
      evidence_gaps: 0,
    },
  },
} as const;

function riskBadge(risk: string) {
  const cls =
    risk === 'low'
      ? 'bg-emerald-100 text-emerald-700'
      : risk === 'medium'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-red-100 text-red-700';
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${cls}`}>{risk}</span>
  );
}

export default async function PrFingerprintPage() {
  const { pr_summary, context_fingerprint, trust_layers } = data;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Ship</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900">PR Fingerprint</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          At merge time, CodeLedger captures a context fingerprint — CCS, ISC, bundle hash — giving every PR a permanent, auditable context receipt.
        </p>
      </div>

      {/* PR summary */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-stone-400">Pull Request</div>
            <h2 className="mt-1 text-base font-semibold text-stone-900">{pr_summary.title}</h2>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">Risk</span>
              {riskBadge(pr_summary.risk)}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">Drift</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">{pr_summary.drift}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">Evidence Gaps</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{pr_summary.evidence_gaps}</span>
            </div>
          </div>
        </div>
        <ul className="mt-4 space-y-1">
          {pr_summary.observations.map((obs, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-stone-600">
              <span className="text-emerald-500">✓</span> {obs}
            </li>
          ))}
        </ul>
      </div>

      {/* Context fingerprint */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-700">Context Fingerprint</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-emerald-50 p-4">
            <div className="text-xs font-medium text-stone-400">CCS</div>
            <div className="mt-1 text-2xl font-bold text-emerald-700">{context_fingerprint.ccs.toFixed(2)}</div>
            <div className="text-xs text-emerald-600">{context_fingerprint.ccs_label}</div>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4">
            <div className="text-xs font-medium text-stone-400">ISC</div>
            <div className="mt-1 text-2xl font-bold text-emerald-700">{context_fingerprint.isc.toFixed(2)}</div>
            <div className="text-xs text-emerald-600">{context_fingerprint.isc_label}</div>
          </div>
          <div className="rounded-lg bg-stone-50 p-4">
            <div className="text-xs font-medium text-stone-400">Bundle Hash</div>
            <div className="mt-1 font-mono text-sm font-bold text-stone-700">{context_fingerprint.bundle_hash}</div>
            <div className="text-xs text-stone-500">Deterministic</div>
          </div>
          <div className="rounded-lg bg-stone-50 p-4">
            <div className="text-xs font-medium text-stone-400">Captured At</div>
            <div className="mt-1 text-sm font-medium text-stone-700">
              {new Date(context_fingerprint.captured_at).toLocaleDateString()}
            </div>
            <div className="text-xs text-stone-500">{new Date(context_fingerprint.captured_at).toLocaleTimeString()}</div>
          </div>
        </div>
        <p className="mt-4 text-sm text-stone-600">{context_fingerprint.summary}</p>
      </div>

      {/* Trust layers */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Context Sufficiency</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700">{trust_layers.context_sufficiency.status}</span>
            <span className="text-sm font-medium text-stone-700">Confidence {trust_layers.context_sufficiency.confidence}%</span>
          </div>
          <p className="mt-2 text-xs text-stone-600">Recommendation: {trust_layers.context_sufficiency.recommendation}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Audit Board</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700">{trust_layers.audit_board.status}</span>
            <span className="text-sm font-medium text-stone-700">Confidence {trust_layers.audit_board.confidence}%</span>
          </div>
          <p className="mt-2 text-xs text-stone-600">
            Findings: {trust_layers.audit_board.findings} | Evidence gaps: {trust_layers.audit_board.evidence_gaps} | Risk: {trust_layers.audit_board.risk}
          </p>
        </div>
      </div>
    </div>
  );
}
