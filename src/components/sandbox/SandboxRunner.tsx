'use client';

import { useState, useCallback } from 'react';
import type { CompletionState } from '@/types/dashboard';
import { ScenarioSelector } from '@/components/sandbox/ScenarioSelector';
import { SandboxResult } from '@/components/sandbox/SandboxResult';

interface SandboxScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'intermediate' | 'advanced';
  expectedOutcome: string;
}

interface ResultData {
  scenario: string;
  completionState: CompletionState;
  claims: number;
  verified: number;
  ghostFiles: number;
  driftWarnings: number;
  duration: string;
}

interface SandboxRunnerProps {
  scenarios: SandboxScenario[];
}

const SCENARIO_RESULTS: Record<string, ResultData> = {
  'ghost-file-detection': {
    scenario: 'Ghost File Detection',
    completionState: 'incomplete',
    claims: 12,
    verified: 7,
    ghostFiles: 3,
    driftWarnings: 2,
    duration: '4.2s',
  },
  'clean-feature': {
    scenario: 'Clean Feature Ship',
    completionState: 'verified',
    claims: 8,
    verified: 8,
    ghostFiles: 0,
    driftWarnings: 0,
    duration: '3.1s',
  },
  'release-authority-block': {
    scenario: 'Release Gate Block',
    completionState: 'implemented',
    claims: 15,
    verified: 9,
    ghostFiles: 1,
    driftWarnings: 4,
    duration: '6.7s',
  },
};

export function SandboxRunner({ scenarios }: SandboxRunnerProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);

  const handleRun = useCallback(() => {
    if (!selected) return;
    setRunning(true);
    setResult(null);

    const delay = 3000 + Math.random() * 5000;
    setTimeout(() => {
      setResult(SCENARIO_RESULTS[selected] ?? null);
      setRunning(false);
    }, delay);
  }, [selected]);

  const handleSelect = useCallback((id: string) => {
    setSelected(id);
    setResult(null);
  }, []);

  return (
    <div className="space-y-6">
      <ScenarioSelector
        scenarios={scenarios}
        selected={selected}
        onSelect={handleSelect}
        disabled={running}
      />

      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={!selected || running}
          onClick={handleRun}
          className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
            !selected || running
              ? 'cursor-not-allowed bg-stone-200 text-stone-400'
              : 'bg-brand-primary text-white shadow-sm hover:bg-brand-primary/90'
          }`}
        >
          {running ? 'Evaluating...' : 'Run CIC Check'}
        </button>

        {running && (
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Running CIC evaluation...
          </div>
        )}
      </div>

      {result && <SandboxResult result={result} />}
    </div>
  );
}
