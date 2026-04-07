'use client';

import type { CompletionState } from '@/types/dashboard';

interface CompletionLadderProps {
  currentState: CompletionState;
}

const STATES: { key: CompletionState; label: string }[] = [
  { key: 'incomplete', label: 'Incomplete' },
  { key: 'edited', label: 'Edited' },
  { key: 'implemented', label: 'Implemented' },
  { key: 'wired', label: 'Wired' },
  { key: 'verified', label: 'Verified' },
  { key: 'audited', label: 'Audited' },
  { key: 'release_safe', label: 'Release Safe' },
];

export function CompletionLadder({ currentState }: CompletionLadderProps) {
  const currentIndex = STATES.findIndex((s) => s.key === currentState);

  return (
    <div className="flex items-center gap-0">
      {STATES.map((state, i) => {
        const isFilled = i <= currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={state.key} className="flex items-center">
            {/* Step */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                    : isFilled
                      ? 'bg-brand-primary/20 text-brand-primary'
                      : 'bg-stone-100 text-stone-400'
                }`}
                style={isCurrent ? { animation: 'pulse 2s infinite' } : undefined}
              >
                {i + 1}
              </div>
              <span
                className={`mt-1.5 text-[10px] font-medium leading-tight ${
                  isCurrent
                    ? 'text-brand-primary'
                    : isFilled
                      ? 'text-stone-700'
                      : 'text-stone-400'
                }`}
              >
                {state.label}
              </span>
            </div>

            {/* Connector */}
            {i < STATES.length - 1 && (
              <div
                className={`mx-0.5 h-0.5 w-4 sm:w-6 ${
                  i < currentIndex ? 'bg-brand-primary/30' : 'bg-stone-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
