const data = {
  task: 'fix(billing): resume payment retry logic',
  domain: 'billing',
  staleness: {
    level: 'HIGH',
    stale_file_count: 3,
    hours_since_activation: 51,
    warning:
      '⚠ Context freshness: 3 ranked files have changed since last activation. Rerun `codeledger activate` to refresh.',
  },
  prompt_coach: {
    interaction_level: 2,
    variant: 'guided_refinement',
    isc: 0.74,
    ccs: 0.68,
    staleness_escalation: true,
    output_summary:
      '⚠ WARN — Stale context detected. Refresh before editing to avoid acting on outdated file state.',
  },
  outcome: {
    marcus_refreshed: true,
    post_refresh_ccs: 0.86,
    post_refresh_staleness_level: 'FRESH',
    cic_outcome: 'pass',
  },
} as const;

function levelBadge(level: string) {
  if (level === 'HIGH') return <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">HIGH STALENESS</span>;
  if (level === 'FRESH') return <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">FRESH</span>;
  return <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">{level}</span>;
}

export default async function StalenessPage() {
  const { task, domain, staleness, prompt_coach, outcome } = data;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Watch</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900">Staleness</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          JIT staleness detection flags when ranked bundle files have changed since the last activation. Escalates in the Prompt Coach when context is dangerously outdated.
        </p>
      </div>

      {/* Task */}
      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-stone-400">Task</div>
            <div className="mt-1 text-sm font-medium text-stone-800">{task}</div>
          </div>
          <span className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">{domain}</span>
        </div>
      </div>

      {/* Staleness warning */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-stone-700">Staleness Detected</h2>
          {levelBadge(staleness.level)}
        </div>
        <p className="mt-3 text-sm text-stone-700">{staleness.warning}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white p-3">
            <div className="text-xs text-stone-400">Stale files</div>
            <div className="mt-0.5 text-2xl font-bold text-red-600">{staleness.stale_file_count}</div>
          </div>
          <div className="rounded-lg bg-white p-3">
            <div className="text-xs text-stone-400">Hours since activation</div>
            <div className="mt-0.5 text-2xl font-bold text-stone-700">{staleness.hours_since_activation}h</div>
          </div>
        </div>
      </div>

      {/* Prompt Coach escalation */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-stone-700">Prompt Coach — Staleness Escalation</h2>
            <div className="mt-2 flex items-center gap-2 text-xs text-stone-500">
              <span>Level <span className="font-bold text-amber-600">{prompt_coach.interaction_level}</span></span>
              <span>·</span>
              <span className="font-mono">{prompt_coach.variant}</span>
              <span>·</span>
              <span>ISC {prompt_coach.isc.toFixed(2)}</span>
              <span>·</span>
              <span>CCS {prompt_coach.ccs.toFixed(2)}</span>
            </div>
          </div>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700">ESCALATED</span>
        </div>
        <div className="mt-4 rounded-lg bg-stone-900 p-4">
          <p className="font-mono text-xs text-amber-300">{prompt_coach.output_summary}</p>
        </div>
      </div>

      {/* Post-refresh outcome */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-700">After Refresh</h2>
        <p className="mt-1 text-xs text-stone-500">Developer refreshed the bundle — staleness resolved and CIC passed.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Refreshed', value: outcome.marcus_refreshed ? 'Yes' : 'No', ok: outcome.marcus_refreshed },
            { label: 'Post-refresh CCS', value: outcome.post_refresh_ccs.toFixed(2), ok: true },
            { label: 'Staleness level', value: outcome.post_refresh_staleness_level, ok: true },
            { label: 'CIC outcome', value: outcome.cic_outcome.toUpperCase(), ok: outcome.cic_outcome === 'pass' },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-white p-3 text-center">
              <div className="text-xs text-stone-400">{item.label}</div>
              <div className={`mt-1 text-sm font-bold ${item.ok ? 'text-emerald-600' : 'text-red-600'}`}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
