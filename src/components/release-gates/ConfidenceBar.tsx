interface ConfidenceBarProps {
  score: number; // 0-1
}

export function ConfidenceBar({ score }: ConfidenceBarProps) {
  const pct = Math.round(score * 100);
  const color =
    score >= 0.85
      ? 'bg-emerald-400'
      : score >= 0.7
        ? 'bg-amber-400'
        : 'bg-red-400';

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-stone-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-stone-600">{pct}%</span>
    </div>
  );
}
