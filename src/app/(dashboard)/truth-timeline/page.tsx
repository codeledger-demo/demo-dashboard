import { getTruthTimeline } from '@/lib/api/timeline-queries';

const typeColors: Record<string, string> = {
  VERIFY_RUN: 'bg-blue-500',
  TRUTH_SNAPSHOT: 'bg-emerald-500',
  EVIDENCE_CAPTURED: 'bg-stone-400',
  RISK_ALERT: 'bg-red-500',
  HOTSPOT_OBSERVED: 'bg-amber-500',
};

const gradeColors: Record<string, string> = {
  A: 'bg-emerald-100 text-emerald-700',
  B: 'bg-blue-100 text-blue-700',
  C: 'bg-amber-100 text-amber-700',
  D: 'bg-orange-100 text-orange-700',
  F: 'bg-red-100 text-red-700',
};

export default async function TruthTimelinePage() {
  const events = await getTruthTimeline();

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Truth Timeline</h1>
        <p className="mt-1 text-sm text-stone-500">
          Continuous truth assessment — how confidence evolves as evidence accumulates.
        </p>
      </div>

      <div className="flex gap-4 text-xs">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
            <span className="text-stone-500">{type.replace(/_/g, ' ')}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {events.map((e) => (
          <div key={e.id} className="flex items-start gap-4 rounded-xl border border-stone-200 bg-white px-5 py-4 shadow-sm">
            <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${typeColors[e.type] ?? 'bg-stone-300'}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${gradeColors[e.truthGrade] ?? 'bg-stone-100 text-stone-600'}`}>
                  {e.truthGrade}
                </span>
                <span className="font-mono text-xs text-stone-400">{e.commitSha}</span>
                <span className="text-xs text-stone-400">
                  {new Date(e.timestamp).toLocaleDateString()} {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="mt-1 text-sm text-stone-700">{e.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
