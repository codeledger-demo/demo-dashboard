import type { CICEntry } from '@/types/dashboard';
import { CompletionStateBadge } from '@/components/shared/CompletionStateBadge';

interface CICDetailProps {
  entry: CICEntry;
  onClose: () => void;
}

export function CICDetail({ entry, onClose }: CICDetailProps) {
  const claimRatio =
    entry.claimCount > 0
      ? Math.round((entry.verifiedClaimCount / entry.claimCount) * 100)
      : 0;

  return (
    <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold text-stone-900">
            CIC Detail
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            {new Date(entry.checkedAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
          aria-label="Close detail"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="mb-4 text-sm text-stone-700">{entry.task}</p>

      <div className="mb-4 flex items-center gap-3">
        <CompletionStateBadge state={entry.completionState} />
        <span className="text-sm text-stone-500">by {entry.persona}</span>
      </div>

      <div className="mb-4 space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-stone-600">Claims verified</span>
            <span className="font-mono font-medium text-stone-900">
              {entry.verifiedClaimCount}/{entry.claimCount} ({claimRatio}%)
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-brand-primary transition-all"
              style={{ width: `${claimRatio}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-surface-elevated p-3">
            <p className="text-xs text-stone-500">Ghost Files</p>
            <p
              className={`font-mono text-lg font-semibold ${
                entry.mismatchCount > 0 ? 'text-semantic-error' : 'text-stone-900'
              }`}
            >
              {entry.mismatchCount}
            </p>
          </div>
          <div className="rounded-lg bg-surface-elevated p-3">
            <p className="text-xs text-stone-500">Drift Warnings</p>
            <p
              className={`font-mono text-lg font-semibold ${
                entry.driftWarningCount > 0 ? 'text-semantic-warning' : 'text-stone-900'
              }`}
            >
              {entry.driftWarningCount}
            </p>
          </div>
        </div>
      </div>

      {entry.prNumber && (
        <p className="text-sm text-stone-500">
          PR{' '}
          <span className="font-mono font-medium text-brand-primary">
            #{entry.prNumber}
          </span>
        </p>
      )}
    </div>
  );
}
