import { MetricCard } from '@/components/shared/MetricCard';
import type { DashboardMetric } from '@/types/dashboard';

interface WisdomMetricProps {
  wisdomGrowth: number;
  totalLessons: number;
  activelyConsulted: number;
}

export function WisdomMetric({ wisdomGrowth, totalLessons, activelyConsulted }: WisdomMetricProps) {
  const metrics: DashboardMetric[] = [
    {
      label: 'Lessons Learned',
      value: totalLessons,
      trend: 'up' as const,
    },
    {
      label: 'CIC Passes Guided',
      value: wisdomGrowth,
      trend: 'up' as const,
    },
    {
      label: 'Actively Consulted',
      value: activelyConsulted,
      trend: 'flat' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metrics.map((m) => (
        <MetricCard key={m.label} metric={m} />
      ))}
    </div>
  );
}
