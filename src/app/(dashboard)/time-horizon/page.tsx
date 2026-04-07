import { TimeHorizonDashboard } from '@/components/time-horizon/TimeHorizonDashboard';
import { getTimeHorizonData } from '@/lib/api/timeline-queries';

export default async function TimeHorizonPage() {
  const { metrics, arcs, incidents } = await getTimeHorizonData();
  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10">
      <TimeHorizonDashboard
        data={metrics}
        arcs={arcs}
        incidents={incidents}
        timelineStart="2026-01-01"
        timelineEnd="2026-03-04"
      />
    </div>
  );
}
