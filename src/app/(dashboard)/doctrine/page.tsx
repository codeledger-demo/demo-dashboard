interface DoctrineEvent {
  id: string;
  task: string;
  variant: string;
  signalCount: number;
  persona: string;
  timestamp: string;
}

function getDoctrineEvents(): DoctrineEvent[] {
  return [
    { id: 'doc-001', task: 'Build a new billing dashboard', variant: 'two_phase_stop', signalCount: 3, persona: 'Priya K', timestamp: '2026-04-14T16:20:00Z' },
    { id: 'doc-002', task: 'Create separate auth service', variant: 'guided_refinement', signalCount: 2, persona: 'Marcus Webb', timestamp: '2026-04-13T11:00:00Z' },
    { id: 'doc-003', task: 'Add new payment processor', variant: 'light_cue', signalCount: 1, persona: 'Marcus Webb', timestamp: '2026-04-12T09:30:00Z' },
    { id: 'doc-004', task: 'Refactor user service tests', variant: 'none', signalCount: 0, persona: 'Sara Chen', timestamp: '2026-04-11T14:45:00Z' },
  ];
}

function variantBadge(v: string) {
  if (v === 'two_phase_stop') return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">TWO-PHASE STOP</span>;
  if (v === 'guided_refinement') return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">GUIDED REFINEMENT</span>;
  if (v === 'light_cue') return <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">LIGHT CUE</span>;
  return <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-500">NONE</span>;
}

export default function DoctrinePage() {
  const events = getDoctrineEvents();
  const interventions = events.filter((e) => e.variant !== 'none');
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Architecture Doctrine</h1>
        <p className="mt-1 text-sm text-stone-500">Detects prompts that risk creating parallel systems, duplicate truth, or second workflows. Progressive intervention protects architectural integrity.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"><div className="text-2xl font-bold text-stone-900">{interventions.length}</div><div className="mt-1 text-xs text-stone-500">Interventions triggered</div></div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"><div className="text-2xl font-bold text-red-600">{events.filter((e) => e.variant === 'two_phase_stop').length}</div><div className="mt-1 text-xs text-stone-500">Two-phase stops</div></div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"><div className="text-2xl font-bold text-emerald-600">{events.filter((e) => e.variant === 'none').length}</div><div className="mt-1 text-xs text-stone-500">Clean passes</div></div>
      </div>
      <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-100 px-4 py-3"><h2 className="text-sm font-semibold text-stone-700">Recent Doctrine Events</h2></div>
        <div className="divide-y divide-stone-50">{events.map((e) => (
          <div key={e.id} className="flex items-center justify-between px-4 py-3">
            <div><div className="text-sm text-stone-700">{e.task}</div><div className="mt-0.5 text-xs text-stone-400">{e.persona} · {new Date(e.timestamp).toLocaleDateString()}</div></div>
            <div className="flex items-center gap-2">{e.signalCount > 0 && <span className="text-xs text-stone-400">{e.signalCount} signal(s)</span>}{variantBadge(e.variant)}</div>
          </div>
        ))}</div>
      </div>
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">5 Doctrine Concepts</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-lg bg-stone-50 p-3"><div className="text-sm font-medium text-stone-700">Single System Rule</div><p className="mt-0.5 text-xs text-stone-500">Integrate into the existing system rather than building a parallel one.</p></div>
          <div className="rounded-lg bg-stone-50 p-3"><div className="text-sm font-medium text-stone-700">Two-Phase Stop</div><p className="mt-0.5 text-xs text-stone-500">When risk is high, stop and verify architecture before proceeding.</p></div>
          <div className="rounded-lg bg-stone-50 p-3"><div className="text-sm font-medium text-stone-700">Existing Seam</div><p className="mt-0.5 text-xs text-stone-500">Extend existing extension points rather than creating new ones.</p></div>
          <div className="rounded-lg bg-stone-50 p-3"><div className="text-sm font-medium text-stone-700">Single Truth</div><p className="mt-0.5 text-xs text-stone-500">One source of truth per domain. No duplicate stores or pipelines.</p></div>
        </div>
      </div>
    </div>
  );
}
