import type { ReleaseEntry } from '@/types/dashboard';
import { ReleaseStateBadge } from '@/components/shared/ReleaseStateBadge';
import { ConfidenceBar } from './ConfidenceBar';

interface GateDetailProps {
  release: ReleaseEntry;
  onClose: () => void;
}

const blockedNarrative: Record<string, string> = {
  'rel-01':
    'Without the release gate, v2.3.8 would have shipped with an unrotated auth token, an unchecked session handler, and three P1 drift findings in the billing integration. The credential leak from the Auth Incident (Arc 3) would have reached production.',
};

export function GateDetail({ release, onClose }: GateDetailProps) {
  const narrative = blockedNarrative[release.id];

  return (
    <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-bold text-stone-900">
            {release.versionTag ?? release.id}
          </h3>
          <ReleaseStateBadge state={release.releaseState} />
        </div>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-700">&times;</button>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <span className="text-stone-500">Confidence</span>
          <div className="mt-1">
            <ConfidenceBar score={release.confidenceScore} />
          </div>
        </div>

        <div className="flex gap-4">
          {release.p0Count > 0 && (
            <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-semantic-error">
              {release.p0Count} P0
            </span>
          )}
          {release.p1Count > 0 && (
            <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-semantic-warning">
              {release.p1Count} P1
            </span>
          )}
          <span className="text-xs text-stone-500">
            {release.findingCount} total findings
          </span>
        </div>

        {narrative && (
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-3">
            <p className="text-xs font-medium text-red-800">What would have shipped</p>
            <p className="mt-1 text-xs text-red-700">{narrative}</p>
          </div>
        )}

        <p className="text-xs text-stone-400">
          {new Date(release.checkedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
