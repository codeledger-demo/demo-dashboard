'use client';

import type { CompletionState } from '@/types/dashboard';
import { CompletionStateBadge } from '@/components/shared/CompletionStateBadge';
import { CompletionLadder } from '@/components/sandbox/CompletionLadder';

export interface SandboxFinding {
  severity: 'P0' | 'P1' | 'P2' | 'P3';
  title: string;
  filePath: string;
  description: string;
}

export interface SandboxResultData {
  scenario: string;
  completionState: CompletionState;
  claims: number;
  verified: number;
  ghostFiles: number;
  driftWarnings: number;
  duration: string;
  findings?: SandboxFinding[];
  ladderStep?: number;
  narrative?: string;
}

interface SandboxResultProps {
  result: SandboxResultData;
}

const severityClasses: Record<SandboxFinding['severity'], string> = {
  P0: 'bg-red-100 text-red-800 border-red-300',
  P1: 'bg-orange-100 text-orange-800 border-orange-300',
  P2: 'bg-amber-100 text-amber-800 border-amber-300',
  P3: 'bg-stone-100 text-stone-700 border-stone-300',
};

export function SandboxResult({ result }: SandboxResultProps) {
  const claimPercent = result.claims > 0 ? Math.round((result.verified / result.claims) * 100) : 0;
  const findings = result.findings ?? [];

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

      {result.narrative && (
        <p className="text-sm leading-relaxed text-stone-700">{result.narrative}</p>
      )}

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

      {/* Findings breakdown */}
      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-stone-400">
          Findings
        </h3>
        {findings.length === 0 ? (
          <p className="text-sm text-stone-500">No findings — clean run ✓</p>
        ) : (
          <ul className="space-y-2">
            {findings.map((f, i) => (
              <li
                key={`${f.filePath}-${i}`}
                className="rounded-md border border-stone-200 bg-surface-elevated p-3"
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-bold ${severityClasses[f.severity]}`}
                  >
                    {f.severity}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-stone-900">{f.title}</div>
                    <div className="mt-0.5 font-mono text-xs text-stone-500">{f.filePath}</div>
                    <p className="mt-1 text-xs text-stone-600">{f.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-xs font-medium text-stone-400">Completion Ladder</h3>
        <CompletionLadder currentState={result.completionState} />
      </div>
    </div>
  );
}
