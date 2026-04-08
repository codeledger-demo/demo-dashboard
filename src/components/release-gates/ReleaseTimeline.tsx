'use client';

import { useState } from 'react';
import type { ReleaseEntry, ReleaseState, ReleaseFinding } from '@/types/dashboard';
import { ReleaseStateBadge } from '@/components/shared/ReleaseStateBadge';
import { ConfidenceBar } from './ConfidenceBar';
import { GateDetail } from './GateDetail';

interface ReleaseTimelineProps {
  releases: ReleaseEntry[];
  findingsByRelease?: Record<string, ReleaseFinding[]>;
}

const ladderStepByReleaseState: Record<ReleaseState, number> = {
  not_ready: 2,
  ready_conditional: 4,
  ready: 5,
  ready_hardened: 7,
};

const borderColor: Record<string, string> = {
  not_ready: 'border-l-red-400',
  ready_conditional: 'border-l-amber-400',
  ready: 'border-l-emerald-400',
  ready_hardened: 'border-l-emerald-500',
};

const statusIcon: Record<string, { path: string; color: string }> = {
  not_ready: {
    path: 'M12 9v4m0 4h.01M12 2L2 20h20L12 2z',
    color: 'text-semantic-error',
  },
  ready_conditional: {
    path: 'M12 9v4m0 4h.01M12 2L2 20h20L12 2z',
    color: 'text-semantic-warning',
  },
  ready: {
    path: 'M5 13l4 4L19 7',
    color: 'text-semantic-success',
  },
  ready_hardened: {
    path: 'M12 2l7 4v6c0 5.25-3.5 9.75-7 11-3.5-1.25-7-5.75-7-11V6l7-4z',
    color: 'text-semantic-success',
  },
};

export function ReleaseTimeline({ releases, findingsByRelease }: ReleaseTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...releases].sort(
    (a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime(),
  );

  return (
    <div className="space-y-3">
      {sorted.map((r) => {
        const icon = statusIcon[r.releaseState];
        const isExpanded = expandedId === r.id;

        return (
          <div key={r.id} className="space-y-2">
            <button
              onClick={() => setExpandedId(isExpanded ? null : r.id)}
              className={`flex w-full items-center gap-4 rounded-xl border border-stone-200 border-l-4 bg-surface-card px-4 py-3 text-left shadow-sm transition-colors hover:bg-stone-50 ${borderColor[r.releaseState]}`}
            >
              {/* Icon */}
              <svg
                className={`h-5 w-5 shrink-0 ${icon.color}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={icon.path} />
              </svg>

              {/* Version + date */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-stone-900">
                    {r.versionTag ?? r.id}
                  </span>
                  <ReleaseStateBadge state={r.releaseState} />
                </div>
                <p className="mt-0.5 text-xs text-stone-400">
                  {new Date(r.checkedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Confidence */}
              <div className="hidden items-center gap-2 sm:flex">
                <ConfidenceBar score={r.confidenceScore} />
                <span
                  className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] text-stone-600"
                  title="Average Completion Ladder step (proxy from release state)"
                >
                  Ladder {ladderStepByReleaseState[r.releaseState]}/7
                </span>
              </div>

              {/* Findings */}
              <div className="flex shrink-0 items-center gap-2 text-xs">
                {r.p0Count > 0 && (
                  <span className="rounded bg-red-50 px-1.5 py-0.5 font-medium text-semantic-error">
                    {r.p0Count} P0
                  </span>
                )}
                {r.p1Count > 0 && (
                  <span className="rounded bg-amber-50 px-1.5 py-0.5 font-medium text-semantic-warning">
                    {r.p1Count} P1
                  </span>
                )}
                {r.findingCount === 0 && (
                  <span className="text-stone-400">clean</span>
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="ml-9">
                <GateDetail
                  release={r}
                  findings={findingsByRelease?.[r.id] ?? []}
                  onClose={() => setExpandedId(null)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
