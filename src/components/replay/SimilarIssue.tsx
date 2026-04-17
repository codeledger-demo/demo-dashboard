import type { ReplaySimilarMatch, ReplayFlowEntry } from '@/types/dashboard';

interface SimilarIssueProps {
  match: ReplaySimilarMatch;
  originalFlow?: ReplayFlowEntry;
}

export function SimilarIssue({ match, originalFlow }: SimilarIssueProps) {
  const labelColor = match.label === 'Strong'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : match.label === 'Likely'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-stone-50 text-stone-600 border-stone-200';

  return (
    <div className="rounded-xl border-2 border-amber-200 bg-amber-50/30 p-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-xl">&#9889;</span>
        <div>
          <h3 className="font-serif text-base font-bold text-stone-900">Similar issue detected</h3>
          <p className="text-xs text-stone-500">
            Resolved by {match.resolvedByEmoji} {match.resolvedBy} &middot; {match.timeAgo}
          </p>
        </div>
        <span className={`ml-auto rounded-full border px-2.5 py-0.5 text-xs font-semibold ${labelColor}`}>
          {match.label}
        </span>
      </div>

      {/* Reasons */}
      <div className="mt-4">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-stone-400 mb-2">Why this matched</div>
        <ul className="space-y-1">
          {match.reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Original flow steps (if available) */}
      {originalFlow && (
        <div className="mt-4 rounded-lg bg-white/60 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-stone-400 mb-2">Original resolution</div>
          <ol className="space-y-1">
            {originalFlow.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="w-4 shrink-0 text-right font-mono text-xs text-stone-400">{i + 1}.</span>
                <code className="font-mono text-stone-600">{step}</code>
              </li>
            ))}
          </ol>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Shape</span>
            <span className="font-mono text-xs text-brand-primary">{originalFlow.shape}</span>
          </div>
        </div>
      )}
    </div>
  );
}
