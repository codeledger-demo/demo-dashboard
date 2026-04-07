interface MetricPanelProps {
  title: string;
  value: string | number;
  subtitle?: string;
  chart?: 'line' | 'bar' | 'delta';
  chartData?: number[];
  trend?: 'up' | 'down' | 'flat';
  color?: string;
}

function Sparkline({ data, color = '#0b6e4f' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} className="mt-2">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BarChart({ data, color = '#0b6e4f' }: { data: number[]; color?: string }) {
  const max = Math.max(...data) || 1;
  const w = 120;
  const h = 32;
  const barW = w / data.length - 2;

  return (
    <svg width={w} height={h} className="mt-2">
      {data.map((v, i) => {
        const barH = (v / max) * (h - 4);
        return (
          <rect
            key={i}
            x={i * (barW + 2) + 1}
            y={h - barH - 2}
            width={barW}
            height={barH}
            rx={2}
            fill={color}
            opacity={0.8}
          />
        );
      })}
    </svg>
  );
}

function DeltaIndicator({ value, color }: { value: number; color?: string }) {
  const isPositive = value >= 0;
  const fill = color ?? (isPositive ? '#0b6e4f' : '#a23b2a');

  return (
    <div className="mt-2 flex items-center gap-1">
      <svg width={16} height={16} viewBox="0 0 16 16">
        <path
          d={isPositive ? 'M8 3l5 8H3z' : 'M8 13l5-8H3z'}
          fill={fill}
        />
      </svg>
      <span className="text-sm font-semibold" style={{ color: fill }}>
        {isPositive ? '+' : ''}{value}
      </span>
    </div>
  );
}

export function MetricPanel({
  title,
  value,
  subtitle,
  chart,
  chartData,
  trend,
  color,
}: MetricPanelProps) {
  const trendColor =
    trend === 'up' ? 'text-brand-primary' : trend === 'down' ? 'text-semantic-error' : 'text-stone-500';

  return (
    <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        {title}
      </p>
      <div className="mt-2 flex items-end justify-between">
        <span className={`text-3xl font-bold tabular-nums text-stone-900 ${trendColor}`}>
          {value}
        </span>
        {trend && (
          <span className={`text-xs font-medium ${trendColor}`}>
            {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
          </span>
        )}
      </div>
      {chart === 'line' && chartData && <Sparkline data={chartData} color={color} />}
      {chart === 'bar' && chartData && <BarChart data={chartData} color={color} />}
      {chart === 'delta' && chartData && chartData.length > 0 && (
        <DeltaIndicator value={chartData[0]} color={color} />
      )}
      {subtitle && (
        <p className="mt-2 text-xs text-stone-400">{subtitle}</p>
      )}
    </div>
  );
}
