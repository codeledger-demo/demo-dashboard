'use client';

import type { ReplayFlowEntry, ReplaySimilarMatch } from '@/types/dashboard';
import { FlowCard } from './FlowCard';
import { SimilarIssue } from './SimilarIssue';

interface ReplayTimelineProps {
  flows: ReplayFlowEntry[];
  similar: ReplaySimilarMatch[];
}

export function ReplayTimeline({ flows, similar }: ReplayTimelineProps) {
  const flowIndex = new Map(flows.map((f) => [f.id, f]));

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="flex gap-6">
        <Stat label="Retained flows" value={flows.length} />
        <Stat label="Similar matches" value={similar.length} />
        <Stat label="Avg score" value={flows.length > 0 ? Math.round(flows.reduce((s, f) => s + f.score, 0) / flows.length * 100) : 0} unit="%" />
      </div>

      {/* Similar issue highlight (if any) */}
      {similar.map((match, i) => (
        <SimilarIssue
          key={i}
          match={match}
          originalFlow={flowIndex.get(match.originalFlowId)}
        />
      ))}

      {/* Flow cards */}
      {flows.map((flow, i) => (
        <FlowCard key={flow.id} flow={flow} index={i} />
      ))}
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: number; unit?: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-stone-900">{value}{unit}</div>
      <div className="text-xs text-stone-500">{label}</div>
    </div>
  );
}
