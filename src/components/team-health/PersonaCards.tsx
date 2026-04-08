import type { PersonaMetrics } from '@/types/dashboard';
import { TrendBadge } from '@/components/shared/TrendBadge';

interface PersonaCardsProps {
  personas: PersonaMetrics[];
}

function accentColor(passRate: number): string {
  if (passRate >= 85) return 'border-t-semantic-success';
  if (passRate >= 70) return 'border-t-semantic-warning';
  return 'border-t-semantic-error';
}

function passRateColor(passRate: number): string {
  if (passRate >= 85) return 'text-semantic-success';
  if (passRate >= 70) return 'text-semantic-warning';
  return 'text-semantic-error';
}

function shadowColor(index: number | undefined): string {
  if (index === undefined) return 'text-stone-400';
  if (index <= 0.15) return 'text-semantic-success';
  if (index <= 0.25) return 'text-semantic-warning';
  return 'text-semantic-error';
}

function trendDirection(trend: number): 'up' | 'down' | 'flat' {
  if (trend > 0) return 'up';
  if (trend < 0) return 'down';
  return 'flat';
}

export function PersonaCards({ personas }: PersonaCardsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {personas.map((p) => (
        <div
          key={p.id}
          className={`rounded-xl border border-stone-200 border-t-4 bg-surface-card p-5 shadow-sm ${accentColor(p.cicPassRate)}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{p.emoji}</span>
            <div>
              <p className="font-serif text-sm font-semibold text-stone-900">
                {p.name}
              </p>
              <p className="text-xs text-stone-400">{p.role}</p>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                CIC Pass Rate
              </p>
              <p className={`text-3xl font-bold tabular-nums ${passRateColor(p.cicPassRate)}`}>
                {p.cicPassRate}%
              </p>
            </div>
            <TrendBadge value={Math.abs(p.trend)} trend={trendDirection(p.trend)} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-stone-100 pt-3">
            <div>
              <p className="text-xs text-stone-400">PRs (30d)</p>
              <p className="text-sm font-semibold tabular-nums text-stone-700">
                {p.prCount30d}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-400">Lessons</p>
              <p className="text-sm font-semibold tabular-nums text-stone-700">
                {p.lessonsContributed}
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-1 border-t border-stone-100 pt-3">
            <div className="text-xs text-stone-500">
              Avg ladder:{' '}
              <span className="font-mono font-semibold text-stone-700">
                {p.avgLadderStep?.toFixed(1) ?? '—'}/7
              </span>
            </div>
            <div
              className="text-xs text-stone-500"
              title="Shadow Knowledge Index — bus-factor proxy [0, 1]. Higher = more concentrated tribal knowledge."
            >
              Shadow:{' '}
              <span className={`font-mono font-semibold ${shadowColor(p.shadowKnowledgeIndex)}`}>
                {p.shadowKnowledgeIndex?.toFixed(2) ?? '—'}
              </span>
            </div>
            <div className="text-xs text-stone-500">
              Avg remediation:{' '}
              <span className="font-mono font-semibold text-stone-700">
                {p.avgRemediationHours?.toFixed(1) ?? '—'}h
              </span>
            </div>
          </div>

          {p.lastFailureReason && (
            <p className="mt-3 rounded bg-stone-50 px-2 py-1.5 text-xs text-stone-400 leading-snug">
              Last failure: {p.lastFailureReason}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
