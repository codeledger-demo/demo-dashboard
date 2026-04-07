import type { ReleaseState } from '@/types/dashboard';

interface ReleaseStateBadgeProps {
  state: ReleaseState;
}

const stateColors: Record<ReleaseState, string> = {
  ready_hardened: 'bg-emerald-50 text-semantic-success',
  ready: 'bg-emerald-50 text-semantic-success',
  ready_conditional: 'bg-amber-50 text-semantic-warning',
  not_ready: 'bg-red-50 text-semantic-error',
};

const stateLabels: Record<ReleaseState, string> = {
  not_ready: 'Not Ready',
  ready_conditional: 'Conditional',
  ready: 'Ready',
  ready_hardened: 'Hardened',
};

export function ReleaseStateBadge({ state }: ReleaseStateBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stateColors[state]}`}
    >
      {stateLabels[state]}
    </span>
  );
}
