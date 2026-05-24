const data = {
  intent_lock: {
    locked: true,
    intent_signature: 'billing-payment-refactor-v1',
    scope_keywords: ['billing', 'payment', 'route', 'handler'],
    locked_at: '2026-05-12T10:14:00Z',
    locked_by: 'marcus-webb',
  },
  drift_check: {
    drift_level: 'major',
    warning: 'Scope drift detected: 1 file outside locked intent (billing). Run `codeledger intent unlock` to reset or narrow the PR.',
    out_of_scope_file_count: 1,
    recommendation: 'Narrow this PR to billing routes only, or unlock and re-lock with the broader scope.',
  },
  activate_output: {
    bundle_files: 7,
    intent_drift_shown: true,
    inline_warning: '⚠ Intent lock drift: edits outside locked scope detected.',
  },
} as const;

export default async function IntentLockPage() {
  const { intent_lock, drift_check, activate_output } = data;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Watch</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900">Intent Lock</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          Tracks whether ongoing edits stay within the declared task scope. Fires when a PR drifts outside the locked intent signature.
        </p>
      </div>

      {/* Lock status */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">LOCKED</span>
          <span className="text-sm font-medium text-stone-700">{intent_lock.intent_signature}</span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <div className="text-xs text-stone-400">Locked by</div>
            <div className="mt-0.5 text-sm font-medium text-stone-700">{intent_lock.locked_by}</div>
          </div>
          <div>
            <div className="text-xs text-stone-400">Locked at</div>
            <div className="mt-0.5 text-sm font-medium text-stone-700">{new Date(intent_lock.locked_at).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-stone-400">Scope keywords</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {intent_lock.scope_keywords.map((kw) => (
                <span key={kw} className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Drift check */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-red-700">Drift Detected</h2>
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase text-red-700">{drift_check.drift_level}</span>
        </div>
        <p className="mt-2 text-sm text-stone-700">{drift_check.warning}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-red-600">
          <span>{drift_check.out_of_scope_file_count} file{drift_check.out_of_scope_file_count !== 1 ? 's' : ''} outside locked scope</span>
        </div>
        <div className="mt-4 rounded-lg bg-stone-900 p-3">
          <p className="font-mono text-xs text-amber-300">{drift_check.recommendation}</p>
        </div>
      </div>

      {/* Activate output */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-700">Inline Activate Warning</h2>
        <p className="mt-1 text-xs text-stone-500">Shown in the terminal when `codeledger activate` detects out-of-scope edits.</p>
        <div className="mt-4 rounded-lg bg-stone-900 p-4">
          <p className="font-mono text-xs text-amber-300">{activate_output.inline_warning}</p>
          <p className="mt-1 font-mono text-xs text-stone-400">Bundle files: {activate_output.bundle_files} | Intent drift shown: {String(activate_output.intent_drift_shown)}</p>
        </div>
      </div>
    </div>
  );
}
