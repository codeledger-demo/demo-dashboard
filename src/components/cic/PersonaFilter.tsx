'use client';

import type { CompletionState } from '@/types/dashboard';

interface PersonaFilterProps {
  personas: string[];
  selectedPersona: string | null;
  onPersonaChange: (persona: string | null) => void;
  states: CompletionState[];
  selectedState: CompletionState | null;
  onStateChange: (state: CompletionState | null) => void;
}

const stateLabels: Record<CompletionState, string> = {
  incomplete: 'Incomplete',
  edited: 'Edited',
  implemented: 'Implemented',
  wired: 'Wired',
  verified: 'Verified',
  audited: 'Audited',
  release_safe: 'Release Safe',
};

export function PersonaFilter({
  personas,
  selectedPersona,
  onPersonaChange,
  states,
  selectedState,
  onStateChange,
}: PersonaFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-stone-500">Developer:</span>
        <button
          onClick={() => onPersonaChange(null)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition ${
            selectedPersona === null
              ? 'bg-brand-primary text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          All
        </button>
        {personas.map((persona) => (
          <button
            key={persona}
            onClick={() => onPersonaChange(persona)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              selectedPersona === persona
                ? 'bg-brand-primary text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {persona}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-stone-500">State:</span>
        <button
          onClick={() => onStateChange(null)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition ${
            selectedState === null
              ? 'bg-brand-primary text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          All
        </button>
        {states.map((state) => (
          <button
            key={state}
            onClick={() => onStateChange(state)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              selectedState === state
                ? 'bg-brand-primary text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {stateLabels[state]}
          </button>
        ))}
      </div>
    </div>
  );
}
