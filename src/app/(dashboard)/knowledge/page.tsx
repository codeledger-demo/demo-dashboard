import Link from 'next/link';
import { ConfidenceBadge } from '@/components/shared/ConfidenceBadge';
import {
  getPatternSpread,
  getShadowKnowledge,
  getDataModeInfo,
} from '@/lib/api/timeline-queries';

function shadowClass(index: number): string {
  if (index <= 0.15) return 'text-emerald-700';
  if (index <= 0.25) return 'text-amber-700';
  return 'text-red-700';
}

export default async function KnowledgePage(): Promise<JSX.Element> {
  const [patterns, shadow, mode] = await Promise.all([
    getPatternSpread(),
    getShadowKnowledge(),
    getDataModeInfo(),
  ]);

  const sortedPatterns = [...patterns].sort((a, b) => b.reuses - a.reuses);
  const totalReuses = patterns.reduce((sum, p) => sum + p.reuses, 0);
  const uniqueRepos = patterns.reduce((m, p) => Math.max(m, p.reposCovered), 0);
  const sortedShadow = [...shadow].sort((a, b) => b.index - a.index);
  const highestShadow = sortedShadow[0]?.persona ?? 'no engineers';

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      {mode.showSampleBanner && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          {mode.sampleBannerText}
        </div>
      )}

      <Link href="/team-health" className="text-xs text-stone-500 hover:text-stone-800">
        ← Team Health
      </Link>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
          Cockpit · Knowledge pillar
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900">Knowledge</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          Patterns, context, and institutional memory
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-stone-700">
            Knowledge signals: {patterns.length} active patterns, {totalReuses} reuses across{' '}
            {uniqueRepos} repos. Shadow concentration rising in {highestShadow}.
          </p>
          <ConfidenceBadge
            confidence={{
              level: 'medium',
              eventCount: 87,
              reason: 'Aggregated from pattern + lesson signals',
            }}
            showCount
          />
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-stone-900">
          Pattern Spread — cross-repo reuse
        </h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-stone-200">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-[10px] font-medium uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-2 text-left">Pattern</th>
                <th className="px-4 py-2 text-right">Occurrences</th>
                <th className="px-4 py-2 text-right">Reuses</th>
                <th className="px-4 py-2 text-right">Repos</th>
                <th className="px-4 py-2 text-right">Teams</th>
                <th className="px-4 py-2 text-right">Reuse Rate</th>
                <th className="px-4 py-2 text-right">Cross-repo Multiplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedPatterns.map((p) => (
                <tr key={p.patternId} className="hover:bg-stone-50">
                  <td className="px-4 py-2 font-medium text-stone-900">{p.patternName}</td>
                  <td className="px-4 py-2 text-right font-mono text-stone-700">{p.occurrences}</td>
                  <td className="px-4 py-2 text-right font-mono text-stone-900">{p.reuses}</td>
                  <td className="px-4 py-2 text-right font-mono text-stone-700">{p.reposCovered}</td>
                  <td className="px-4 py-2 text-right font-mono text-stone-700">{p.teamsCovered}</td>
                  <td className="px-4 py-2 text-right font-mono text-stone-700">
                    {Math.round(p.reuseRate * 100)}%
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-stone-700">
                    {p.crossRepoReuseRate.toFixed(1)}×
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-stone-900">
          Shadow Knowledge — bus-factor signal
        </h2>
        <p className="mt-2 text-xs text-stone-500">
          Higher index means a larger share of this engineer&rsquo;s recent touches are on files
          only they modify — a bus-factor signal, not a blame signal.
        </p>
        <div className="mt-4 space-y-3">
          {sortedShadow.map((s) => (
            <div
              key={s.persona}
              className="rounded-lg border border-stone-200 bg-surface-elevated p-4"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-medium text-stone-900">{s.persona}</p>
                <p className={`font-mono text-lg font-bold ${shadowClass(s.index)}`}>
                  {s.index.toFixed(2)}
                </p>
              </div>
              <p className="mt-1 text-xs text-stone-500">
                {s.concentratedFiles} concentrated files
              </p>
              <p className="mt-2 text-xs text-stone-400">{s.recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
        <p className="text-sm text-stone-700">
          Active lessons are preventing the same failure modes from recurring.{' '}
          <Link href="/lessons" className="text-brand-primary underline-offset-2 hover:underline">
            → View Lessons Ledger
          </Link>
        </p>
      </div>

      <div className="border-t border-stone-100 pt-5">
        <p className="text-center text-xs text-stone-400">
          Aggregate signals only — no individual productivity tracking.
        </p>
      </div>
    </div>
  );
}
