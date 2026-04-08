import Link from 'next/link';
import type { PillarScores } from '@/types/dashboard';
import { ConfidenceBadge } from '@/components/shared/ConfidenceBadge';

interface PillarBarProps {
  pillars: PillarScores;
  valueEstimate: number;
  valueCurrency: string;
}

/**
 * Four-pillar decomposition of the team health score.
 *
 * Replaces the single opaque "84" with Integrity / Quality / Knowledge /
 * Patterns — each clickable and linking to its cockpit drill-down page.
 * Per spec §5 Page 1, this is the header of the Team Health page and
 * the single highest-leverage addition for EM-facing credibility.
 *
 * Also surfaces:
 * - The NL summary sentence above the bar
 * - The composite score + trend arrow
 * - A clickable VALUE chip linking to /value
 * - A confidence badge covering the full pillar bundle
 */
export function PillarBar({
  pillars,
  valueEstimate,
  valueCurrency,
}: PillarBarProps): JSX.Element {
  const formatCurrency = (n: number): string =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: valueCurrency,
      maximumFractionDigits: 0,
    }).format(n);

  const trendArrow = pillars.trend === 'up' ? '↑' : pillars.trend === 'down' ? '↓' : '→';
  const trendColor =
    pillars.trend === 'up'
      ? 'text-brand-primary'
      : pillars.trend === 'down'
        ? 'text-semantic-error'
        : 'text-stone-400';

  const pillarEntries: Array<{
    key: keyof Omit<PillarScores, 'composite' | 'narrative' | 'confidence' | 'trend'>;
    label: string;
    value: number;
    href: string;
    description: string;
  }> = [
    {
      key: 'integrity',
      label: 'Integrity',
      value: pillars.integrity,
      href: '/integrity',
      description: 'Write safety, redaction, policy violations',
    },
    {
      key: 'quality',
      label: 'Quality',
      value: pillars.quality,
      href: '/quality',
      description: 'Execution reliability, rework ratio',
    },
    {
      key: 'knowledge',
      label: 'Knowledge',
      value: pillars.knowledge,
      href: '/knowledge',
      description: 'Pattern spread, shadow knowledge, lessons',
    },
    {
      key: 'patterns',
      label: 'Patterns',
      value: pillars.patterns,
      href: '/knowledge',
      description: 'Reuse rate, cross-repo propagation',
    },
  ];

  return (
    <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
      {/* NL summary sentence */}
      <p className="text-sm leading-relaxed text-stone-700">
        {pillars.narrative}
      </p>

      {/* Composite + confidence + value */}
      <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-stone-100 pb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Composite
          </span>
          <span className="font-serif text-3xl font-bold text-stone-900">
            {pillars.composite}
          </span>
          <span className={`text-lg font-semibold ${trendColor}`}>{trendArrow}</span>
        </div>
        <ConfidenceBadge confidence={pillars.confidence} />
        <Link
          href="/value"
          className="ml-auto inline-flex items-center gap-2 rounded-lg border border-brand-primary/30 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-brand-primary hover:bg-emerald-100"
        >
          <span className="text-[10px] uppercase tracking-wide">Value</span>
          <span className="font-mono text-sm font-semibold">
            {formatCurrency(valueEstimate)}
          </span>
          <span className="text-xs">→</span>
        </Link>
      </div>

      {/* Four pillars */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {pillarEntries.map((pillar) => {
          const color =
            pillar.value >= 85
              ? 'bg-brand-primary'
              : pillar.value >= 70
                ? 'bg-amber-500'
                : 'bg-semantic-error';
          const borderColor =
            pillar.value >= 85
              ? 'border-brand-primary/30 hover:border-brand-primary'
              : pillar.value >= 70
                ? 'border-amber-300 hover:border-amber-400'
                : 'border-red-300 hover:border-red-400';

          return (
            <Link
              key={pillar.key}
              href={pillar.href}
              className={`group rounded-lg border p-3 transition-colors ${borderColor}`}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  {pillar.label}
                </span>
                <span className="font-serif text-2xl font-bold text-stone-900">
                  {pillar.value}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
                <div
                  className={`h-full rounded-full ${color} transition-all`}
                  style={{ width: `${pillar.value}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-stone-400 group-hover:text-stone-600">
                {pillar.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
