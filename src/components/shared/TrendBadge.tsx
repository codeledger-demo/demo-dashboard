interface TrendBadgeProps {
  value: number;
  trend: 'up' | 'down' | 'flat';
}

export function TrendBadge({ value, trend }: TrendBadgeProps) {
  const colorClass =
    trend === 'up'
      ? 'bg-emerald-50 text-semantic-success'
      : trend === 'down'
        ? 'bg-red-50 text-semantic-error'
        : 'bg-stone-100 text-stone-500';

  const symbol = trend === 'up' ? '+' : trend === 'down' ? '' : '';
  const label = trend === 'flat' ? '\u2014' : `${symbol}${value}%`;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}
