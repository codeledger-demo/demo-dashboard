import { HealthScore } from '@/components/team-health/HealthScore';
import { PersonaCards } from '@/components/team-health/PersonaCards';
import { HealthTrend } from '@/components/team-health/HealthTrend';
import { RecentActivity } from '@/components/team-health/RecentActivity';
import {
  getTeamHealthScore,
  getAllPersonaMetrics,
  getHealthSnapshots,
} from '@/lib/api/timeline-queries';

export default async function TeamHealthPage() {
  const [healthMetric, personas, snapshots] = await Promise.all([
    getTeamHealthScore(),
    getAllPersonaMetrics(30),
    getHealthSnapshots({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    }),
  ]);

  const healthScore = healthMetric?.value ?? 0;
  const previousValue = healthMetric?.previousValue ?? healthScore;
  const healthTrend: 'up' | 'down' | 'flat' =
    healthScore > previousValue ? 'up' : healthScore < previousValue ? 'down' : 'flat';

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
      <h1 className="font-serif text-3xl font-bold text-stone-900">
        Team Health Overview
      </h1>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <HealthScore score={healthScore} trend={healthTrend} />
        <HealthTrend snapshots={snapshots} />
      </div>

      <PersonaCards personas={personas} />
      <RecentActivity />
    </div>
  );
}
