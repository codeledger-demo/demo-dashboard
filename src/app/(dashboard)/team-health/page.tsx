import { HealthScore } from '@/components/team-health/HealthScore';
import { PersonaCards } from '@/components/team-health/PersonaCards';
import { HealthTrend } from '@/components/team-health/HealthTrend';
import { RecentActivity } from '@/components/team-health/RecentActivity';
import { PillarBar } from '@/components/team-health/PillarBar';
import {
  getTeamHealthScore,
  getAllPersonaMetrics,
  getHealthSnapshots,
  getPillarScores,
  getValueBreakdown,
  getDataModeInfo,
} from '@/lib/api/timeline-queries';

export default async function TeamHealthPage(): Promise<JSX.Element> {
  const [healthMetric, personas, snapshots, pillars, value, mode] = await Promise.all([
    getTeamHealthScore(),
    getAllPersonaMetrics(30),
    getHealthSnapshots({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    }),
    getPillarScores(),
    getValueBreakdown(),
    getDataModeInfo(),
  ]);

  const healthScore = healthMetric?.value ?? 0;
  const previousValue = healthMetric?.previousValue ?? healthScore;
  const healthTrend: 'up' | 'down' | 'flat' =
    healthScore > previousValue ? 'up' : healthScore < previousValue ? 'down' : 'flat';

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
      {mode.showSampleBanner && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          {mode.sampleBannerText}
        </div>
      )}

      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Team Health Overview
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Every metric is traceable to evidence. No manual logging.
        </p>
      </div>

      {/* Four-pillar header — replaces the opaque single score */}
      <PillarBar
        pillars={pillars}
        valueEstimate={value.totalEstimate}
        valueCurrency={value.currency}
      />

      {/* Legacy per-engineer / trend section — kept for emotional signal */}
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <HealthScore score={healthScore} trend={healthTrend} />
        <HealthTrend snapshots={snapshots} />
      </div>

      <PersonaCards personas={personas} />
      <RecentActivity />

      {/* Privacy footer — verbatim from spec §7, load-bearing trust copy */}
      <div className="border-t border-stone-100 pt-5">
        <p className="text-center text-xs text-stone-400">
          Aggregate signals only — no individual productivity tracking.
        </p>
      </div>
    </div>
  );
}
