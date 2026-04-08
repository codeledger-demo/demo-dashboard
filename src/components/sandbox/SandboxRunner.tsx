'use client';

import { useState, useCallback } from 'react';
import type { CompletionState } from '@/types/dashboard';
import { ScenarioSelector } from '@/components/sandbox/ScenarioSelector';
import { SandboxResult, type SandboxResultData, type SandboxFinding } from '@/components/sandbox/SandboxResult';

interface SandboxScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'intermediate' | 'advanced';
  expectedOutcome: string;
}

interface SandboxRunnerProps {
  scenarios: SandboxScenario[];
}

const SCENARIO_RESULTS: Record<string, SandboxResultData> = {
  'ghost-file-detection': {
    scenario: 'Ghost File Detection',
    completionState: 'incomplete',
    claims: 12,
    verified: 7,
    ghostFiles: 3,
    driftWarnings: 2,
    duration: '4.2s',
    findings: [
      {
        severity: 'P1',
        title: 'Ghost file — auth/legacy-handler.ts',
        filePath: 'src/auth/legacy-handler.ts',
        description: 'File no longer referenced by any import after refactor',
      },
      {
        severity: 'P1',
        title: 'Ghost file — auth/old-session.ts',
        filePath: 'src/auth/old-session.ts',
        description: 'Orphaned helper retained from prior implementation',
      },
      {
        severity: 'P2',
        title: 'Validation bypass — auth/router.ts',
        filePath: 'src/auth/router.ts',
        description: 'Route handler skips shared input validator',
      },
    ],
  },
  'clean-feature': {
    scenario: 'Clean Feature Ship',
    completionState: 'verified',
    claims: 8,
    verified: 8,
    ghostFiles: 0,
    driftWarnings: 0,
    duration: '3.1s',
    findings: [],
  },
  'release-authority-block': {
    scenario: 'Release Gate Block',
    completionState: 'implemented',
    claims: 15,
    verified: 9,
    ghostFiles: 1,
    driftWarnings: 4,
    duration: '6.7s',
    findings: [
      {
        severity: 'P1',
        title: 'Ghost file — billing/unused-adapter.ts',
        filePath: 'services/billing/src/adapters/unused-adapter.ts',
        description: 'Adapter not wired into any dispatch path',
      },
      {
        severity: 'P1',
        title: 'Runtime validation missing — checkout route',
        filePath: 'services/billing/src/routes/checkout.ts',
        description: 'POST handler accepts typed body without runtime schema check',
      },
      {
        severity: 'P1',
        title: 'Runtime validation missing — refund route',
        filePath: 'services/billing/src/routes/refund.ts',
        description: 'Refund handler trusts client payload without validation',
      },
      {
        severity: 'P2',
        title: 'Outbound HTTP without timeout',
        filePath: 'services/billing/src/clients/stripe.ts',
        description: 'fetch() call lacks an AbortController timeout',
      },
    ],
  },
  'silent-warn-accumulation': {
    scenario: 'Silent WARN Accumulation',
    completionState: 'verified',
    claims: 15,
    verified: 15,
    ghostFiles: 0,
    driftWarnings: 5,
    duration: '5.8s',
    ladderStep: 5,
    narrative:
      'Each individual PR passes CIC as verified. The accumulated pattern — 5 drift warnings across 5 services in 2 weeks — triggers the architecture health alert. No single PR would have been blocked, but the drift velocity signal fires.',
    findings: [
      {
        severity: 'P2',
        title: 'Drift warning — billing/subscriptions.ts',
        filePath: 'services/billing/src/routes/subscriptions.ts',
        description: 'Deviation from established billing pattern',
      },
      {
        severity: 'P2',
        title: 'Drift warning — reporting/queries.ts',
        filePath: 'services/reporting/src/queries/billing-queries.ts',
        description: 'Copy-paste from earlier report module',
      },
      {
        severity: 'P2',
        title: 'Drift warning — webhooks/dispatcher.ts',
        filePath: 'services/webhooks/src/dispatcher.ts',
        description: 'Retry logic diverges from shared retry util',
      },
      {
        severity: 'P2',
        title: 'Drift warning — auth/middleware.ts',
        filePath: 'services/auth/src/middleware/jwt-verify.ts',
        description: 'Inline validation instead of shared schema',
      },
      {
        severity: 'P2',
        title: 'Drift warning — notifications/queue.ts',
        filePath: 'services/notifications/src/queue/processor.ts',
        description: 'Queue timeout hardcoded instead of config-driven',
      },
    ],
  },
};

export function SandboxRunner({ scenarios }: SandboxRunnerProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SandboxResultData | null>(null);

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

// Re-export type alias used externally if needed
export type { CompletionState, SandboxFinding };
