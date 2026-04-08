import Link from 'next/link';
import { ConfidenceBadge } from '@/components/shared/ConfidenceBadge';
import { getIntegrityMetrics, getDataModeInfo } from '@/lib/api/timeline-queries';
import type { ViolationConcentration } from '@/types/dashboard';

function pctClass(value: number, thresholds: { good: number; warn: number }, lowerBetter = false): string {
  if (lowerBetter) {
    if (value < thresholds.good) return 'text-emerald-700';
    if (value < thresholds.warn) return 'text-amber-700';
    return 'text-red-700';
  }
  if (value >= thresholds.good) return 'text-emerald-700';
  if (value >= thresholds.warn) return 'text-amber-700';
  return 'text-red-700';
}

const trendArrow: Record<ViolationConcentration['trend'], string> = {
  up: '↑',
  down: '↓',
  flat: '→',
};

const trendClass: Record<ViolationConcentration['trend'], string> = {
  up: 'text-red-600',
  down: 'text-emerald-600',
  flat: 'text-stone-500',
};

export default async function IntegrityPage(): Promise<JSX.Element> {
  const [integrity, mode] = await Promise.all([
    getIntegrityMetrics(),
    getDataModeInfo(),
  ]);

  const sortedViolations = [...integrity.violationConcentration].sort(
    (a, b) => b.primaryViolations - a.primaryViolations
  );
  const topViolationRepo = sortedViolations[0]?.repo ?? 'no repos';

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
          Cockpit · Integrity pillar
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900">Integrity</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          Write safety, policy violations, ledger admission control
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-stone-700">
            Integrity at {integrity.writeSafety}% —{' '}
            {integrity.integrityDrift > 20
              ? `drift rising in ${topViolationRepo}`
              : 'stable across the fabric'}
            .
          </p>
          <ConfidenceBadge confidence={integrity.confidence} showCount />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Write Safety
          </p>
          <p className={`mt-2 font-mono text-3xl font-bold ${pctClass(integrity.writeSafety, { good: 80, warn: 60 })}`}>
            {integrity.writeSafety}%
          </p>
          <p className="mt-1 text-xs text-stone-500">ledger admission rate</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Redact Rate
          </p>
          <p className={`mt-2 font-mono text-3xl font-bold ${pctClass(integrity.redactRate, { good: 10, warn: 10 }, true)}`}>
            {integrity.redactRate}%
          </p>
          <p className="mt-1 text-xs text-stone-500">content requiring safety modification</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Reject Rate
          </p>
          <p className={`mt-2 font-mono text-3xl font-bold ${pctClass(integrity.rejectRate, { good: 5, warn: 5 }, true)}`}>
            {integrity.rejectRate}%
          </p>
          <p className="mt-1 text-xs text-stone-500">executions blocked entirely</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Integrity Drift
          </p>
          <p className={`mt-2 font-mono text-3xl font-bold ${pctClass(integrity.integrityDrift, { good: 15, warn: 25 }, true)}`}>
            {integrity.integrityDrift}%
          </p>
          <p className="mt-1 text-xs text-stone-500">policy violations</p>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-stone-900">
          Violation concentration by repo
        </h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-stone-200">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-[10px] font-medium uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-2 text-left">Repo</th>
                <th className="px-4 py-2 text-right">Primary</th>
                <th className="px-4 py-2 text-right">Secondary</th>
                <th className="px-4 py-2 text-left">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedViolations.map((v) => (
                <tr key={v.repo} className="hover:bg-stone-50">
                  <td className="px-4 py-2 font-mono text-stone-800">{v.repo}</td>
                  <td className="px-4 py-2 text-right font-mono text-stone-900">{v.primaryViolations}</td>
                  <td className="px-4 py-2 text-right font-mono text-stone-700">{v.secondaryViolations}</td>
                  <td className={`px-4 py-2 font-semibold ${trendClass[v.trend]}`}>
                    {trendArrow[v.trend]} {v.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t border-stone-100 pt-5">
        <p className="text-center text-xs text-stone-400">
          Aggregate signals only — no individual productivity tracking.
        </p>
      </div>
    </div>
  );
}
