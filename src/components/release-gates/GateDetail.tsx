import type { ReleaseEntry, ReleaseFinding } from '@/types/dashboard';
import { ReleaseStateBadge } from '@/components/shared/ReleaseStateBadge';
import { ConfidenceBar } from './ConfidenceBar';

interface GateDetailProps {
  release: ReleaseEntry;
  findings: ReleaseFinding[];
  onClose: () => void;
}

const severityClasses: Record<ReleaseFinding['severity'], string> = {
  P0: 'bg-red-100 text-red-700 border-red-200',
  P1: 'bg-amber-100 text-amber-700 border-amber-200',
  P2: 'bg-sky-100 text-sky-700 border-sky-200',
  P3: 'bg-stone-100 text-stone-700 border-stone-200',
};

const blockedNarrative: Record<string, string> = {
  'rel-01':
    'Without the release gate, v2.3.8 would have shipped with an unrotated auth token, an unchecked session handler, and three P1 drift findings in the billing integration. The credential leak from the Auth Incident (Arc 3) would have reached production.',
};

export function GateDetail({ release, findings, onClose }: GateDetailProps) {
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

        <div className="border-t border-stone-100 pt-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-500">
            Findings
          </p>
          {findings.length === 0 ? (
            <p className="rounded border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-xs text-emerald-700">
              No findings — release shipped clean ✓
            </p>
          ) : (
            <ul className="space-y-3">
              {findings.map((f) => (
                <li
                  key={f.id}
                  className="rounded-lg border border-stone-100 bg-stone-50/40 p-3"
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${severityClasses[f.severity]}`}
                    >
                      {f.severity}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-stone-900">{f.title}</p>
                      <p className="mt-1 text-xs text-stone-600">{f.description}</p>
                      <p className="mt-1 font-mono text-[11px] text-stone-500">
                        {f.filePath}
                        {f.lineNumber !== undefined ? `:${f.lineNumber}` : ''}
                      </p>
                      {f.evidenceUrl && (
                        <a
                          href={f.evidenceUrl}
                          className="mt-1 inline-block text-xs text-brand-primary hover:underline"
                        >
                          View evidence →
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-xs text-stone-400">
          {new Date(release.checkedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
