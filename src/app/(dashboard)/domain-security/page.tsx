const data = {
  task: 'feat(reporting): add team-summary reporting view',
  domain: 'database',
  prompt_coach: {
    interaction_level: 1,
    variant: 'light_cue',
    isc: 0.82,
    ccs: 0.79,
    domain_signals_fired: [
      {
        id: 'security_invoker_required',
        domain: 'database',
        weight: 0.85,
        message:
          'When creating Postgres views, use SECURITY INVOKER to prevent privilege escalation. Omitting it means the view runs with the owner\'s privileges.',
      },
      {
        id: 'migration_reversibility',
        domain: 'database',
        weight: 0.70,
        message:
          'Include a DROP VIEW rollback in the migration file so this change can be reversed safely.',
      },
    ],
    output_summary:
      '💡 Database domain: 2 security signals. Use SECURITY INVOKER on the view and include a rollback migration.',
  },
  outcome: {
    signals_followed: 2,
    security_invoker_included: true,
    rollback_migration_included: true,
    cic_outcome: 'pass',
  },
} as const;

function weightBar(w: number) {
  const pct = Math.round(w * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded-full bg-stone-100">
        <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-stone-500">{w.toFixed(2)}</span>
    </div>
  );
}

export default async function DomainSecurityPage() {
  const { task, domain, prompt_coach, outcome } = data;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Watch</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900">Domain Security</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          Domain-specific security signals from the Prompt Coach. Fires when a task touches a high-risk domain like database, auth, or payments.
        </p>
      </div>

      {/* Task + domain */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-stone-400">Task</div>
            <div className="mt-1 text-sm font-medium text-stone-800">{task}</div>
          </div>
          <span className="shrink-0 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase text-indigo-700">{domain}</span>
        </div>
        <div className="mt-4 flex gap-4">
          <div>
            <div className="text-xs text-stone-400">ISC</div>
            <div className="mt-0.5 text-sm font-bold text-stone-700">{prompt_coach.isc.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-stone-400">CCS</div>
            <div className="mt-0.5 text-sm font-bold text-stone-700">{prompt_coach.ccs.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-stone-400">Interaction Level</div>
            <div className="mt-0.5 text-sm font-bold text-stone-700">{prompt_coach.interaction_level} — <span className="font-mono text-xs">{prompt_coach.variant}</span></div>
          </div>
        </div>
      </div>

      {/* Signals */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">Domain Signals Fired</h2>
        <div className="space-y-4">
          {prompt_coach.domain_signals_fired.map((sig) => (
            <div key={sig.id} className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-xs font-semibold text-stone-700">{sig.id}</div>
                  <div className="mt-0.5 text-[10px] uppercase text-stone-400">{sig.domain} domain</div>
                </div>
                <div className="shrink-0">
                  {weightBar(sig.weight)}
                </div>
              </div>
              <p className="mt-3 text-sm text-stone-700">{sig.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Coach output */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-700">Prompt Coach Output</h2>
        <div className="mt-3 rounded-lg bg-stone-900 p-4">
          <p className="font-mono text-xs text-emerald-300">{prompt_coach.output_summary}</p>
        </div>
      </div>

      {/* Outcome */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-700">Outcome</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Signals followed', value: String(outcome.signals_followed) },
            { label: 'SECURITY INVOKER', value: outcome.security_invoker_included ? 'Yes' : 'No', ok: outcome.security_invoker_included },
            { label: 'Rollback migration', value: outcome.rollback_migration_included ? 'Yes' : 'No', ok: outcome.rollback_migration_included },
            { label: 'CIC outcome', value: outcome.cic_outcome.toUpperCase(), ok: outcome.cic_outcome === 'pass' },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-white p-3 text-center">
              <div className="text-xs text-stone-400">{item.label}</div>
              <div className={`mt-1 text-sm font-bold ${'ok' in item ? (item.ok ? 'text-emerald-600' : 'text-red-600') : 'text-stone-700'}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
