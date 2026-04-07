interface ComparisonMetric {
  label: string;
  startValue: number;
  endValue: number;
  unit?: string;
}

interface ComparisonTableProps {
  metrics: ComparisonMetric[];
}

export function ComparisonTable({ metrics }: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-surface-card shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-100 bg-surface-elevated">
            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-stone-500">
              Metric
            </th>
            <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-stone-500">
              Start of Period
            </th>
            <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-stone-500">
              End of Period
            </th>
            <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-stone-500">
              Change
            </th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => {
            const change = m.endValue - m.startValue;
            const isPositive = change > 0;
            const isNegative = change < 0;
            const changeColor = isPositive
              ? 'text-brand-primary'
              : isNegative
                ? 'text-semantic-error'
                : 'text-stone-500';
            const unit = m.unit ?? '';

            return (
              <tr key={m.label} className="border-b border-stone-50 last:border-0">
                <td className="px-5 py-3 font-medium text-stone-900">{m.label}</td>
                <td className="px-5 py-3 text-right tabular-nums text-stone-600">
                  {m.startValue}{unit}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-stone-900 font-semibold">
                  {m.endValue}{unit}
                </td>
                <td className={`px-5 py-3 text-right tabular-nums font-semibold ${changeColor}`}>
                  {isPositive ? '+' : ''}{change}{unit}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
