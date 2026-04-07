import type { DashboardMetric } from '@/types/dashboard';
import { TrendBadge } from './TrendBadge';

interface MetricCardProps {
  metric: DashboardMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const delta =
    metric.previousValue !== undefined
      ? metric.value - metric.previousValue
      : undefined;

  const pct =
    delta !== undefined && metric.previousValue
      ? Math.round((delta / metric.previousValue) * 100)
      : undefined;

  return (
    <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        {metric.label}
      </p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-3xl font-bold tabular-nums text-stone-900">
          {metric.value}
        </span>
        {metric.unit && (
          <span className="mb-1 text-sm text-stone-400">{metric.unit}</span>
        )}
      </div>
      {pct !== undefined && metric.trend && (
        <div className="mt-2">
          <TrendBadge value={pct} trend={metric.trend} />
        </div>
      )}
    </div>
  );
}
