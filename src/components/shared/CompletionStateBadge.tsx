import type { CompletionState } from '@/types/dashboard';

interface CompletionStateBadgeProps {
  state: CompletionState;
}

const stateColors: Record<CompletionState, string> = {
  verified: 'bg-emerald-50 text-semantic-success',
  audited: 'bg-emerald-50 text-semantic-success',
  release_safe: 'bg-emerald-50 text-semantic-success',
  implemented: 'bg-amber-50 text-semantic-warning',
  wired: 'bg-amber-50 text-semantic-warning',
  incomplete: 'bg-red-50 text-semantic-error',
  edited: 'bg-red-50 text-semantic-error',
};

const stateLabels: Record<CompletionState, string> = {
  incomplete: 'Incomplete',
  edited: 'Edited',
  implemented: 'Implemented',
  wired: 'Wired',
  verified: 'Verified',
  audited: 'Audited',
  release_safe: 'Release Safe',
};

export function CompletionStateBadge({ state }: CompletionStateBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stateColors[state]}`}
    >
      {stateLabels[state]}
    </span>
  );
}
