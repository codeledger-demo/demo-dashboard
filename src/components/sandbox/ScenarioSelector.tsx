'use client';

interface SandboxScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'intermediate' | 'advanced';
  expectedOutcome: string;
}

interface ScenarioSelectorProps {
  scenarios: SandboxScenario[];
  selected: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

const difficultyStyles: Record<string, { badge: string; label: string }> = {
  easy: { badge: 'bg-emerald-50 text-semantic-success', label: 'Easy' },
  intermediate: { badge: 'bg-amber-50 text-semantic-warning', label: 'Intermediate' },
  advanced: { badge: 'bg-red-50 text-semantic-error', label: 'Advanced' },
};

export function ScenarioSelector({ scenarios, selected, onSelect, disabled }: ScenarioSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {scenarios.map((scenario) => {
        const isSelected = selected === scenario.id;
        const diff = difficultyStyles[scenario.difficulty] ?? difficultyStyles.easy;

        return (
          <button
            key={scenario.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(scenario.id)}
            className={`relative rounded-lg border-2 p-4 text-left transition-all ${
              isSelected
                ? 'border-brand-primary bg-brand-primary/5 shadow-md'
                : 'border-stone-200 bg-surface-card hover:border-stone-300 hover:shadow-sm'
            } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          >
            {isSelected && (
              <div className="absolute right-3 top-3">
                <svg
                  className="h-5 w-5 text-brand-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <h3 className="font-serif text-base font-semibold text-stone-900">{scenario.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-stone-600">{scenario.description}</p>
            <div className="mt-3">
              <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${diff.badge}`}>
                {diff.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
