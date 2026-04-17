import type { ReplayFlowEntry } from '@/types/dashboard';

function timeAgo(iso: string): string {
  const ms = Date.now() - Date.parse(iso);
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  const week = Math.floor(day / 7);
  return `${week}w ago`;
}

interface FlowCardProps {
  flow: ReplayFlowEntry;
  index: number;
}

export function FlowCard({ flow, index }: FlowCardProps) {
  const scorePct = Math.round(flow.score * 100);
  const scoreColor = scorePct >= 80 ? 'text-semantic-success' : scorePct >= 60 ? 'text-amber-600' : 'text-stone-400';

  return (
    <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-400">Flow {index + 1}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              flow.action === 'keep' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {flow.action}
            </span>
          </div>
          <h3 className="mt-1 font-serif text-base font-semibold text-stone-900">{flow.title}</h3>
        </div>
        <div className={`text-right ${scoreColor}`}>
          <div className="text-lg font-bold">{scorePct}</div>
          <div className="text-[10px] uppercase tracking-wide text-stone-400">score</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
        <span>{flow.personaEmoji} {flow.persona}</span>
        <span>{timeAgo(flow.startedAt)}</span>
        <span className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[10px]">{flow.provider}</span>
        <span className="font-mono text-stone-400">{flow.directory}</span>
      </div>

      {/* Steps */}
      <div className="mt-4 rounded-lg bg-stone-50 p-3">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-stone-400 mb-2">Steps</div>
        <ol className="space-y-1">
          {flow.steps.map((step, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="w-4 shrink-0 text-right font-mono text-xs text-stone-400">{i + 1}.</span>
              <code className="font-mono text-stone-700">{step}</code>
            </li>
          ))}
        </ol>
      </div>

      {/* Flow shape */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Shape</span>
        <span className="font-mono text-xs text-brand-primary">{flow.shape}</span>
      </div>
    </div>
  );
}
