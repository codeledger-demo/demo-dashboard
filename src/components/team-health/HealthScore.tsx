interface HealthScoreProps {
  score: number;
  trend: 'up' | 'down' | 'flat';
}

export function HealthScore({ score, trend }: HealthScoreProps) {
  const color =
    score >= 85
      ? 'text-semantic-success'
      : score >= 70
        ? 'text-semantic-warning'
        : 'text-semantic-error';

  const ringColor =
    score >= 85
      ? 'stroke-semantic-success'
      : score >= 70
        ? 'stroke-semantic-warning'
        : 'stroke-semantic-error';

  const trendArrow =
    trend === 'up' ? '\u2191' : trend === 'down' ? '\u2193' : '\u2192';

  const trendLabel =
    trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable';

  // SVG ring: radius 70, circumference ~440
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
      <div className="relative flex items-center justify-center">
        <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke="#e7e5e4"
            strokeWidth="10"
          />
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            className={ringColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className={`absolute text-5xl font-bold tabular-nums ${color}`}>
          {score}
        </span>
      </div>

      <p className="mt-3 font-serif text-sm font-medium text-stone-500">
        Team Health
      </p>

      <p className={`mt-1 text-xs ${color}`}>
        {trendArrow} {trendLabel}
      </p>
    </div>
  );
}
