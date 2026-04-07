'use client';

import type { TimeWindow } from '@/types/dashboard';

interface TimeWindowSelectorProps {
  value: TimeWindow;
  onChange: (window: TimeWindow) => void;
}

const windows: { label: string; value: TimeWindow }[] = [
  { label: '30d', value: '30d' },
  { label: '60d', value: '60d' },
  { label: '90d', value: '90d' },
  { label: '1yr', value: '1y' },
];

export function TimeWindowSelector({ value, onChange }: TimeWindowSelectorProps) {
  return (
    <div className="inline-flex rounded-lg border border-stone-200 bg-surface-card p-0.5">
      {windows.map((w) => {
        const isActive = value === w.value;
        return (
          <button
            key={w.value}
            onClick={() => onChange(w.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? 'bg-brand-primary text-white shadow-sm'
                : 'bg-surface-elevated text-stone-600 hover:text-stone-900'
            }`}
          >
            {w.label}
          </button>
        );
      })}
    </div>
  );
}
