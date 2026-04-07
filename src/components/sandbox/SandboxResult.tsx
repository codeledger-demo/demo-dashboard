'use client';

import type { CompletionState } from '@/types/dashboard';
import { CompletionStateBadge } from '@/components/shared/CompletionStateBadge';
import { CompletionLadder } from '@/components/sandbox/CompletionLadder';

interface SandboxResultData {
  scenario: string;
  completionState: CompletionState;
  claims: number;
  verified: number;
  ghostFiles: number;
  driftWarnings: number;
  duration: string;
}

interface SandboxResultProps {
  result: SandboxResultData;
}

export function SandboxResult({ result }: SandboxResultProps) {
  const claimPercent = result.claims > 0 ? Math.round((result.verified / result.claims) * 100) : 0;

  return (
    <div className="space-y-5 rounded-lg border border-stone-200 bg-surface-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CompletionStateBadge state={result.completionState} />
          <span className="text-sm text-stone-500">
            CodeLedger evaluated this in{' '}
            <span className="font-mono font-medium text-stone-700">{result.duration}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Claims */}
        <div className="rounded-lg border border-stone-200 bg-surface-elevated p-4">
          <div className="text-xs font-medium text-stone-400">Claims Verified</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-xl font-bold text-stone-900">
              {result.verified}/{result.claims}
            </span>
            <span className="text-xs text-stone-400">({claimPercent}%)</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-brand-primary transition-all"
              style={{ width: `${claimPercent}%` }}
            />
          </div>
        </div>

        {/* Ghost Files */}
        <div className="rounded-lg border border-stone-200 bg-surface-elevated p-4">
          <div className="text-xs font-medium text-stone-400">Ghost Files</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`font-mono text-xl font-bold ${
                result.ghostFiles > 0 ? 'text-semantic-error' : 'text-stone-900'
              }`}
            >
              {result.ghostFiles}
            </span>
            {result.ghostFiles > 0 && (
              <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-semantic-error">
                DETECTED
              </span>
            )}
          </div>
        </div>

        {/* Drift Warnings */}
        <div className="rounded-lg border border-stone-200 bg-surface-elevated p-4">
          <div className="text-xs font-medium text-stone-400">Drift Warnings</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`font-mono text-xl font-bold ${
                result.driftWarnings > 0 ? 'text-semantic-warning' : 'text-stone-900'
              }`}
            >
              {result.driftWarnings}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-medium text-stone-400">Completion Ladder</h3>
        <CompletionLadder currentState={result.completionState} />
      </div>
    </div>
  );
}
