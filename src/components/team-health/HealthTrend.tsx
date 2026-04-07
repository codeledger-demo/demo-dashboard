'use client';

// 30-day demo data: starts at 88, dips to 72 around day 18 (incident), recovers to 84.
const demoDataPoints = generateDemoData();

function generateDemoData(): Array<{ date: string; score: number }> {
  const points: Array<{ date: string; score: number }> = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);

    // Shape: 88 -> dip to 72 around day 12 (i=18) -> recover to 84
    let score: number;
    const dayIndex = 29 - i;
    if (dayIndex <= 10) {
      score = 88 - dayIndex * 0.4;
    } else if (dayIndex <= 18) {
      score = 84 - (dayIndex - 10) * 1.5;
    } else {
      score = 72 + (dayIndex - 18) * 1.0;
    }
    score = Math.round(score + (Math.sin(dayIndex * 1.3) * 1.5));
    points.push({ date: dateStr, score: Math.max(60, Math.min(100, score)) });
  }
  return points;
}

interface HealthTrendProps {
  dataPoints?: Array<{ date: string; score: number }>;
  snapshots?: Array<{ snapshotAt: string; score: number }>;
}

export function HealthTrend({ dataPoints: dataPointsProp, snapshots }: HealthTrendProps) {
  const dataPoints: Array<{ date: string; score: number }> =
    dataPointsProp ??
    (snapshots && snapshots.length > 0
      ? snapshots.map((s) => ({ date: s.snapshotAt.slice(0, 10), score: s.score }))
      : demoDataPoints);

  const padding = { top: 16, right: 16, bottom: 28, left: 36 };
  const chartHeight = 200;
  const chartWidth = 600;
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  const yMin = 0;
  const yMax = 100;
  const yTicks = [0, 25, 50, 75, 100];

  const toX = (i: number) => padding.left + (i / (dataPoints.length - 1)) * innerW;
  const toY = (v: number) => padding.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  const linePath = dataPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(p.score).toFixed(1)}`)
    .join(' ');

  const areaPath =
    linePath +
    ` L ${toX(dataPoints.length - 1).toFixed(1)} ${toY(yMin).toFixed(1)}` +
    ` L ${toX(0).toFixed(1)} ${toY(yMin).toFixed(1)} Z`;

  // Trend direction based on first vs last score
  const trendUp = dataPoints[dataPoints.length - 1].score >= dataPoints[0].score;
  const lineColor = trendUp ? '#0b6e4f' : '#bc6c25';
  const fillColor = trendUp ? 'rgba(11,110,79,0.08)' : 'rgba(188,108,37,0.08)';

  // X-axis labels: every 7 days
  const xLabels = dataPoints
    .map((p, i) => ({ i, label: p.date.slice(5) }))
    .filter((_, i) => i % 7 === 0 || i === dataPoints.length - 1);

  return (
    <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
      <p className="mb-3 font-serif text-sm font-medium text-stone-500">
        Health Trend (30 days)
      </p>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y grid + labels */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={padding.left}
              y1={toY(tick)}
              x2={chartWidth - padding.right}
              y2={toY(tick)}
              stroke="#e7e5e4"
              strokeWidth="1"
            />
            <text
              x={padding.left - 6}
              y={toY(tick) + 3}
              textAnchor="end"
              className="fill-stone-400 text-[9px]"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill={fillColor} />

        {/* Line */}
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" />

        {/* X labels */}
        {xLabels.map(({ i, label }) => (
          <text
            key={i}
            x={toX(i)}
            y={chartHeight - 4}
            textAnchor="middle"
            className="fill-stone-400 text-[9px]"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}
