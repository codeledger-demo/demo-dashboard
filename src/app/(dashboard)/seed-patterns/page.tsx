const data = {
  seed_run: {
    ecl_entries_scanned: 8,
    patterns_before: 0,
    patterns_after: 2,
    patterns_added: 2,
    completed_at: '2026-05-14T09:12:00Z',
  },
  patterns_seeded: [
    {
      id: 'northstar-auth-middleware-v1',
      label: 'auth middleware update',
      source: 'ecl_success',
      confidence: 0.94,
      keywords: ['auth', 'middleware', 'session', 'token', 'login'],
      based_on_sessions: 5,
    },
    {
      id: 'northstar-billing-retry-v1',
      label: 'billing payment retry',
      source: 'ecl_success',
      confidence: 0.91,
      keywords: ['billing', 'payment', 'retry', 'idempotency', 'webhook'],
      based_on_sessions: 3,
    },
  ],
  prompt_coach_integration: {
    active: true,
    match_example: {
      task: 'update auth middleware to support OAuth2 refresh tokens',
      matched_pattern: 'northstar-auth-middleware-v1',
      similarity: 0.82,
      coach_message:
        "Looks like an auth middleware update — typically we follow the `auth middleware update` North Star pattern. Confidence: 0.94.",
    },
  },
} as const;

function confidenceBar(c: number) {
  const pct = Math.round(c * 100);
  const color = c >= 0.9 ? 'bg-emerald-500' : c >= 0.7 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 rounded-full bg-stone-100">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-stone-600">{c.toFixed(2)}</span>
    </div>
  );
}

export default async function SeedPatternsPage() {
  const { seed_run, patterns_seeded, prompt_coach_integration } = data;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Execution Memory</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900">Seed Patterns</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          Bootstrap North Star patterns from ECL success history. Seeded patterns are injected into the Prompt Coach so agents immediately benefit from prior successful workflows.
        </p>
      </div>

      {/* Seed run summary */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-700">Seed Run</h2>
        <p className="mt-1 text-xs text-stone-400">Completed {new Date(seed_run.completed_at).toLocaleString()}</p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'ECL entries scanned', value: String(seed_run.ecl_entries_scanned) },
            { label: 'Patterns before', value: String(seed_run.patterns_before) },
            { label: 'Patterns after', value: String(seed_run.patterns_after) },
            { label: 'Patterns added', value: String(seed_run.patterns_added), highlight: true },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-lg bg-stone-50 p-4 text-center">
              <div className="text-xs text-stone-400">{kpi.label}</div>
              <div className={`mt-1 text-2xl font-bold ${kpi.highlight ? 'text-emerald-600' : 'text-stone-700'}`}>{kpi.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg bg-stone-900 p-3">
          <p className="font-mono text-xs text-emerald-300">
            codeledger harvest --seed{'  '}# scanned {seed_run.ecl_entries_scanned} ECL entries → {seed_run.patterns_added} patterns seeded
          </p>
        </div>
      </div>

      {/* Seeded patterns */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">Seeded Patterns</h2>
        <div className="space-y-4">
          {patterns_seeded.map((p) => (
            <div key={p.id} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-xs text-stone-400">{p.id}</div>
                  <div className="mt-1 text-sm font-semibold text-stone-800">{p.label}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xs text-stone-400">Confidence</div>
                  <div className="mt-1">{confidenceBar(p.confidence)}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {p.keywords.map((kw) => (
                  <span key={kw} className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600">{kw}</span>
                ))}
              </div>
              <div className="mt-2 flex gap-4 text-xs text-stone-400">
                <span>Source: <span className="font-medium text-stone-600">{p.source}</span></span>
                <span>Based on: <span className="font-medium text-stone-600">{p.based_on_sessions} sessions</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prompt Coach integration */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-700">Prompt Coach Integration</h2>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${prompt_coach_integration.active ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
            {prompt_coach_integration.active ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
        <div className="mt-4">
          <div className="text-xs font-medium text-stone-500">Match example</div>
          <div className="mt-2 rounded-lg bg-white p-4">
            <div className="text-xs text-stone-400">Task</div>
            <div className="mt-0.5 text-sm font-medium text-stone-800">{prompt_coach_integration.match_example.task}</div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-500">
              <span>Pattern: <span className="font-mono font-medium text-indigo-600">{prompt_coach_integration.match_example.matched_pattern}</span></span>
              <span>Similarity: <span className="font-medium text-stone-700">{prompt_coach_integration.match_example.similarity.toFixed(2)}</span></span>
            </div>
          </div>
          <div className="mt-3 rounded-lg bg-stone-900 p-4">
            <p className="font-mono text-xs text-emerald-300">{prompt_coach_integration.match_example.coach_message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
