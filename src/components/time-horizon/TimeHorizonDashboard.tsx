'use client';

import { useTimeWindow } from '@/hooks/useTimeWindow';
import { TimeWindowSelector } from '@/components/shell/TimeWindowSelector';
import { MetricPanel } from './MetricPanel';
import { TimelineScrubber } from './TimelineScrubber';
import { ComparisonTable } from './ComparisonTable';
interface HorizonData {
  cicPassRate: number;
  cicTrend: number[];
  driftSuppressed: number;
  driftTrend: number[];
  lessonsStart: number;
  lessonsEnd: number;
  lessonsTrend: number[];
  releasesTotal: number;
  releasesPass: number;
  releasesBlock: number;
  releasesWarn: number;
  releasesBars: number[];
  healthDelta: number;
  personaScores: Array<{ name: string; start: number; end: number }>;
}

interface TimeHorizonDashboardProps {
  data: Record<string, HorizonData>;
  arcs: Array<{ name: string; startDate: string; endDate: string }>;
  incidents: Array<{ date: string; name: string; severity: string }>;
  timelineStart: string;
  timelineEnd: string;
}

export function TimeHorizonDashboard({
  data,
  arcs,
  incidents,
  timelineStart,
  timelineEnd,
}: TimeHorizonDashboardProps) {
  const { window, setWindow } = useTimeWindow('30d');

  const horizon = data[window] ?? data['30d'];

  return (
    <div className="space-y-8">
      {/* Header with selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Time Horizon Analytics
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Track quality trends across configurable time windows
          </p>
        </div>
        <TimeWindowSelector value={window} onChange={setWindow} />
      </div>

      {/* Timeline Scrubber */}
      <TimelineScrubber
        startDate={new Date(timelineStart)}
        endDate={new Date(timelineEnd)}
        incidents={incidents}
        arcs={arcs}
      />

      {/* 2x3 Metric Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <MetricPanel
          title="CIC Pass Rate"
          value={`${horizon.cicPassRate}%`}
          subtitle="Completion Integrity Check pass rate"
          chart="line"
          chartData={horizon.cicTrend}
          trend={horizon.cicPassRate >= 80 ? 'up' : 'down'}
          color="#0b6e4f"
        />
        <MetricPanel
          title="Drift Suppressed"
          value={horizon.driftSuppressed}
          subtitle="Cumulative architectural drift events caught"
          chart="bar"
          chartData={horizon.driftTrend}
          trend="up"
          color="#2563eb"
        />
        <MetricPanel
          title="Lessons Ledger"
          value={`${horizon.lessonsStart} \u2192 ${horizon.lessonsEnd}`}
          subtitle="Institutional lessons: start vs today"
          chart="line"
          chartData={horizon.lessonsTrend}
          trend="up"
          color="#0b6e4f"
        />
        <MetricPanel
          title="Release Gate Decisions"
          value={`${horizon.releasesTotal} releases`}
          subtitle={`${horizon.releasesPass} PASS / ${horizon.releasesBlock} BLOCK / ${horizon.releasesWarn} WARN`}
          chart="bar"
          chartData={horizon.releasesBars}
          trend={horizon.releasesBlock > horizon.releasesTotal * 0.3 ? 'down' : 'up'}
          color={horizon.releasesBlock > horizon.releasesTotal * 0.3 ? '#a23b2a' : '#0b6e4f'}
        />
        <MetricPanel
          title="Developer Context Scores"
          value={`${horizon.personaScores.length} engineers`}
          subtitle={horizon.personaScores.map((p) => `${p.name}: ${p.start}\u2192${p.end}`).join(' | ')}
          chart="bar"
          chartData={horizon.personaScores.map((p) => p.end)}
          trend="up"
          color="#0b6e4f"
        />
        <MetricPanel
          title="Architecture Health Delta"
          value={`${horizon.healthDelta >= 0 ? '+' : ''}${horizon.healthDelta}`}
          subtitle="Net change in architecture health score"
          chart="delta"
          chartData={[horizon.healthDelta]}
          trend={horizon.healthDelta > 0 ? 'up' : horizon.healthDelta < 0 ? 'down' : 'flat'}
        />
      </div>

      {/* Comparison Table */}
      <div>
        <h2 className="mb-4 font-serif text-xl font-semibold text-stone-900">
          Period Comparison
        </h2>
        <ComparisonTable
          metrics={[
            { label: 'CIC Pass Rate', startValue: horizon.cicPassRate - 6, endValue: horizon.cicPassRate, unit: '%' },
            { label: 'Drift Events Caught', startValue: 0, endValue: horizon.driftSuppressed },
            { label: 'Lessons in Ledger', startValue: horizon.lessonsStart, endValue: horizon.lessonsEnd },
            { label: 'Architecture Health', startValue: 80, endValue: 80 + horizon.healthDelta },
            ...horizon.personaScores.map((p) => ({
              label: `${p.name} Context Score`,
              startValue: p.start,
              endValue: p.end,
              unit: '%',
            })),
          ]}
        />
      </div>
    </div>
  );
}
