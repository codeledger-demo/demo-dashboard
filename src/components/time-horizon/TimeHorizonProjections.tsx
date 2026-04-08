'use client';

import { useState } from 'react';
import type { PillarScores } from '@/types/dashboard';
import { ConfidenceBadge } from '@/components/shared/ConfidenceBadge';

const SCENARIO_LABELS: Record<string, string> = {
  'healthy-team': 'Healthy Team',
  'degrading-service': 'Degrading Service',
  'integrity-drift': 'Integrity Drift',
  'knowledge-compounding': 'Knowledge Compounding',
  'mixed-org': 'Mixed Org',
};

const SCENARIO_ORDER = [
  'healthy-team',
  'degrading-service',
  'integrity-drift',
  'knowledge-compounding',
  'mixed-org',
];

interface TimeHorizonProjectionsProps {
  projections: Record<string, PillarScores | null>;
}

function pillarColor(value: number): string {
  if (value >= 85) return 'bg-brand-primary';
  if (value >= 70) return 'bg-amber-500';
  return 'bg-semantic-error';
}

export function TimeHorizonProjections({ projections }: TimeHorizonProjectionsProps) {
  const [selected, setSelected] = useState<string>('healthy-team');
  const current = projections[selected];

  const trendArrow =
    current?.trend === 'up' ? '↑' : current?.trend === 'down' ? '↓' : '→';

  return (
    <section className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
      <div className="mb-2">
        <h2 className="font-serif text-xl font-semibold text-stone-900">
          What This Becomes — projected outcomes by scenario
        </h2>
        <p className="mt-1 text-xs text-stone-500">
          Each scenario projects what the fabric would look like if current conditions continued
          for 3 sprints. This is projected, not measured — confidence is intentionally low.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {SCENARIO_ORDER.map((id) => {
          const isActive = id === selected;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelected(id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'border border-stone-200 bg-surface-elevated text-stone-600 hover:text-stone-900'
              }`}
            >
              {SCENARIO_LABELS[id]}
            </button>
          );
        })}
      </div>

      {current ? (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3 border-b border-stone-100 pb-4">
            <span className="font-serif text-lg font-semibold text-stone-900">
              {SCENARIO_LABELS[selected]}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
                Composite
              </span>
              <span className="font-serif text-2xl font-bold text-stone-900">
                {current.composite}
              </span>
              <span className="text-base font-semibold text-stone-500">{trendArrow}</span>
            </div>
            <ConfidenceBadge confidence={current.confidence} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(['integrity', 'quality', 'knowledge', 'patterns'] as const).map((k) => {
              const v = current[k];
              return (
                <div key={k} className="rounded-lg border border-stone-200 p-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                      {k}
                    </span>
                    <span className="font-serif text-xl font-bold text-stone-900">{v}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className={`h-full rounded-full ${pillarColor(v)}`}
                      style={{ width: `${v}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-sm leading-relaxed text-stone-700">{current.narrative}</p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-stone-500">No projection available.</p>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom date range selector
// ─────────────────────────────────────────────────────────────────────────────

type RangePreset = '30d' | '60d' | '90d' | '1y' | 'custom';

const PRESETS: { label: string; value: RangePreset }[] = [
  { label: '30d', value: '30d' },
  { label: '60d', value: '60d' },
  { label: '90d', value: '90d' },
  { label: '1yr', value: '1y' },
  { label: 'Custom', value: 'custom' },
];

export function CustomRangeSelector() {
  const [preset, setPreset] = useState<RangePreset>('30d');
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');

  const showCustom = preset === 'custom';
  const hasCustomDates = showCustom && start && end;

  return (
    <div className="rounded-lg border border-stone-200 bg-surface-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
          Time window
        </span>
        <div className="inline-flex rounded-lg border border-stone-200 bg-surface-card p-0.5">
          {PRESETS.map((p) => {
            const isActive = preset === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setPreset(p.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'bg-surface-elevated text-stone-600 hover:text-stone-900'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {showCustom && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="rounded border border-stone-200 px-2 py-1 text-xs text-stone-700"
            />
            <span className="text-xs text-stone-400">→</span>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="rounded border border-stone-200 px-2 py-1 text-xs text-stone-700"
            />
          </div>
        )}
      </div>

      {showCustom && (
        <p className="mt-2 text-xs text-stone-500">
          {hasCustomDates
            ? `Active range: ${start} → ${end}`
            : 'Pick a start and end date — falls back to 30d until both are chosen.'}
        </p>
      )}
    </div>
  );
}
