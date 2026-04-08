import Link from 'next/link';
import { ConfidenceBadge } from '@/components/shared/ConfidenceBadge';
import { getQualityMetrics, getDataModeInfo } from '@/lib/api/timeline-queries';
import type { QualityPerService } from '@/types/dashboard';

function reliabilityClass(value: number): string {
  if (value >= 85) return 'text-emerald-700';
  if (value >= 70) return 'text-amber-700';
  return 'text-red-700';
}

function reworkClass(value: number): string {
  if (value < 40) return 'text-emerald-700';
  if (value < 60) return 'text-amber-700';
  return 'text-red-700';
}

function firstPassClass(value: number): string {
  if (value >= 75) return 'text-emerald-700';
  if (value >= 60) return 'text-amber-700';
  return 'text-red-700';
}

const trendArrow: Record<QualityPerService['trend'], string> = {
  up: '↑',
  down: '↓',
  flat: '→',
};

const trendClass: Record<QualityPerService['trend'], string> = {
  up: 'text-emerald-600',
  down: 'text-red-600',
  flat: 'text-stone-500',
};

export default async function QualityPage(): Promise<JSX.Element> {
  const [quality, mode] = await Promise.all([
    getQualityMetrics(),
    getDataModeInfo(),
  ]);

  const sortedServices = [...quality.perServiceBreakdown].sort(
    (a, b) => a.reliability - b.reliability
  );
  const topIssue = [...quality.perServiceBreakdown].sort(
    (a, b) => b.reworkRatio - a.reworkRatio
  )[0]?.service;

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
          Cockpit · Quality pillar
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900">Quality</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          Execution reliability and rework health
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-stone-700">
            Quality at {quality.executionReliability}% —{' '}
            {topIssue ? `rework elevated in ${topIssue}` : 'healthy across services'}.
          </p>
          <ConfidenceBadge confidence={quality.confidence} showCount />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Execution Reliability
          </p>
          <p className={`mt-2 font-mono text-3xl font-bold ${reliabilityClass(quality.executionReliability)}`}>
            {quality.executionReliability}%
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Rework Ratio
          </p>
          <p className={`mt-2 font-mono text-3xl font-bold ${reworkClass(quality.reworkRatio)}`}>
            {quality.reworkRatio}%
          </p>
          <p className="mt-1 text-xs text-stone-500">% of PRs needing follow-up fixes</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            First-Pass Success
          </p>
          <p className={`mt-2 font-mono text-3xl font-bold ${firstPassClass(quality.firstPassSuccess)}`}>
            {quality.firstPassSuccess}%
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-stone-900">
          Per-service reliability
        </h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-stone-200">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-[10px] font-medium uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-2 text-left">Service</th>
                <th className="px-4 py-2 text-right">Reliability</th>
                <th className="px-4 py-2 text-right">Rework</th>
                <th className="px-4 py-2 text-left">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedServices.map((s) => (
                <tr key={s.service} className="hover:bg-stone-50">
                  <td className="px-4 py-2 font-mono text-stone-800">{s.service}</td>
                  <td className={`px-4 py-2 text-right font-mono font-semibold ${reliabilityClass(s.reliability)}`}>
                    {s.reliability}%
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-stone-700">{s.reworkRatio}%</td>
                  <td className={`px-4 py-2 font-semibold ${trendClass[s.trend]}`}>
                    {trendArrow[s.trend]} {s.trend}
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
