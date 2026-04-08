import { TimeHorizonDashboard } from '@/components/time-horizon/TimeHorizonDashboard';
import {
  TimeHorizonProjections,
  CustomRangeSelector,
} from '@/components/time-horizon/TimeHorizonProjections';
import {
  getTimeHorizonData,
  getTimeHorizonProjection,
} from '@/lib/api/timeline-queries';
import type { PillarScores } from '@/types/dashboard';

const SCENARIO_IDS = [
  'healthy-team',
  'degrading-service',
  'integrity-drift',
  'knowledge-compounding',
  'mixed-org',
];

export default async function TimeHorizonPage() {
  const [{ metrics, arcs, incidents }, ...projectionList] = await Promise.all([
    getTimeHorizonData(),
    ...SCENARIO_IDS.map((id) => getTimeHorizonProjection(id)),
  ]);

  const projections: Record<string, PillarScores | null> = {};
  SCENARIO_IDS.forEach((id, i) => {
    projections[id] = projectionList[i] as PillarScores | null;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
      <TimeHorizonDashboard
        data={metrics}
        arcs={arcs}
        incidents={incidents}
        timelineStart="2026-01-01"
        timelineEnd="2026-03-04"
      />
      <CustomRangeSelector />
      <TimeHorizonProjections projections={projections} />
    </div>
  );
}
