'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import type { CICEntry, CompletionState, CompletionLadderStep } from '@/types/dashboard';
import { LADDER_STEP_NAMES } from '@/types/dashboard';
import { CompletionStateBadge } from '@/components/shared/CompletionStateBadge';
import { PersonaFilter } from '@/components/cic/PersonaFilter';
import { CICDetail } from '@/components/cic/CICDetail';

function ladderBadgeClass(step: CompletionLadderStep): string {
  if (step <= 2) return 'bg-red-100 text-red-700';
  if (step <= 4) return 'bg-amber-100 text-amber-700';
  return 'bg-emerald-100 text-emerald-700';
}

interface CICTimelineProps {
  entries: CICEntry[];
}

export function CICTimeline({ entries }: CICTimelineProps) {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<CompletionState | null>(null);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const personas = useMemo(
    () => Array.from(new Set(entries.map((e) => e.persona))).sort(),
    [entries],
  );

  const states = useMemo(
    () =>
      Array.from(new Set(entries.map((e) => e.completionState))).sort() as CompletionState[],
    [entries],
  );

  const filtered = useMemo(() => {
    let result = entries;
    if (selectedPersona) {
      result = result.filter((e) => e.persona === selectedPersona);
    }
    if (selectedState) {
      result = result.filter((e) => e.completionState === selectedState);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.task.toLowerCase().includes(q));
    }
    return result.sort(
      (a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime(),
    );
  }, [entries, selectedPersona, selectedState, search]);

  return (
    <div className="space-y-6">
      <PersonaFilter
        personas={personas}
        selectedPersona={selectedPersona}
        onPersonaChange={setSelectedPersona}
        states={states}
        selectedState={selectedState}
        onStateChange={setSelectedState}
      />

      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-stone-200 bg-surface-card px-4 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
      />

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-surface-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-xs font-medium uppercase tracking-wide text-stone-500">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Developer</th>
              <th className="px-4 py-3">CIC Result</th>
              <th className="px-4 py-3">Ladder</th>
              <th
                className="px-4 py-3 text-right"
                title="Hours between failure and clean re-submit for the same task. Lower is better."
              >
                Time to Remediate
              </th>
              <th className="px-4 py-3 text-right">Claims</th>
              <th className="px-4 py-3 text-right">Drift</th>
              <th className="px-4 py-3 text-right">Evidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.map((entry) => (
              <tr
                key={entry.id}
                onClick={() =>
                  setExpandedId(expandedId === entry.id ? null : entry.id)
                }
                className="cursor-pointer transition hover:bg-surface-elevated"
              >
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-stone-500">
                  {new Date(entry.checkedAt).toLocaleDateString()}
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-stone-800">
                  {entry.task}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                  {entry.persona}
                </td>
                <td className="px-4 py-3">
                  <CompletionStateBadge state={entry.completionState} />
                </td>
                <td className="px-4 py-3">
                  {entry.ladderStep ? (
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${ladderBadgeClass(entry.ladderStep)}`}
                      title={LADDER_STEP_NAMES[entry.ladderStep]}
                    >
                      {entry.ladderStep}/7
                    </span>
                  ) : (
                    <span className="text-stone-400">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-xs text-stone-600">
                  {entry.remediationHours !== undefined
                    ? `${entry.remediationHours.toFixed(1)}h`
                    : '—'}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-stone-700">
                  {entry.verifiedClaimCount}/{entry.claimCount}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  {entry.mismatchCount > 0 ? (
                    <span className="font-mono font-medium text-semantic-error">
                      {entry.mismatchCount} ghost
                    </span>
                  ) : entry.driftWarningCount > 0 ? (
                    <span className="font-mono text-semantic-warning">
                      {entry.driftWarningCount} warn
                    </span>
                  ) : (
                    <span className="text-stone-400">--</span>
                  )}
                </td>
                <td
                  className="whitespace-nowrap px-4 py-3 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    href={entry.evidenceUrl ?? '#'}
                    className={`text-xs hover:underline ${entry.evidenceUrl ? 'text-brand-primary' : 'text-stone-400'}`}
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-stone-400">
                  No entries match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {expandedId && (
        <CICDetail
          entry={filtered.find((e) => e.id === expandedId)!}
          onClose={() => setExpandedId(null)}
        />
      )}
    </div>
  );
}
