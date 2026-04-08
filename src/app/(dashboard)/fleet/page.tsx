import Link from 'next/link';
import {
  getFleetData,
  getPatternSpread,
  getIntegrityMetrics,
} from '@/lib/api/timeline-queries';
import { MetricCard } from '@/components/shared/MetricCard';
import { ConfidenceBadge } from '@/components/shared/ConfidenceBadge';
import type { FleetRiskAlert, FleetRepoSummary } from '@/lib/api/fixtures';
import type { ViolationConcentration } from '@/types/dashboard';

const violationTrendArrow: Record<ViolationConcentration['trend'], string> = {
  up: '↑',
  down: '↓',
  flat: '→',
};

const violationTrendClass: Record<ViolationConcentration['trend'], string> = {
  up: 'text-red-600',
  down: 'text-emerald-600',
  flat: 'text-stone-500',
};

const severityClasses: Record<FleetRiskAlert['severity'], string> = {
  low: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  medium: 'bg-amber-100 text-amber-700 border-amber-300',
  high: 'bg-orange-100 text-orange-700 border-orange-300',
  critical: 'bg-red-100 text-red-700 border-red-300',
};

const trendArrow: Record<FleetRepoSummary['riskTrend'], string> = {
  stable: '→',
  rising: '↑',
  falling: '↓',
};

const trendClass: Record<FleetRepoSummary['riskTrend'], string> = {
  stable: 'text-stone-500',
  rising: 'text-red-600',
  falling: 'text-emerald-600',
};

function healthClass(score: number): string {
  if (score >= 85) return 'text-emerald-700';
  if (score >= 70) return 'text-amber-700';
  return 'text-red-700';
}

export default async function FleetPage() {
  const [fleet, patterns, integrity] = await Promise.all([
    getFleetData(),
    getPatternSpread(),
    getIntegrityMetrics(),
  ]);

  const topPatterns = [...patterns].sort((a, b) => b.reuses - a.reuses).slice(0, 3);
  const remainingPatterns = Math.max(0, patterns.length - topPatterns.length);
  const sortedViolations = [...integrity.violationConcentration].sort(
    (a, b) => b.primaryViolations - a.primaryViolations
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-10">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Fleet Insights
          </h1>
          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
            BETA
          </span>
          <span className="rounded-full border border-stone-300 bg-stone-50 px-2 py-0.5 text-xs font-medium text-stone-600">
            Tier: Enterprise
          </span>
        </div>
        <p className="text-sm text-stone-600">
          Cross-repo intelligence across your engineering portfolio
        </p>
      </header>

      <section className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-stone-700">
            Your fleet of {fleet.totalRepos} repos is{' '}
            {fleet.criticalRepos === 0 ? 'mostly healthy' : 'showing stress'}.{' '}
            {fleet.criticalRepos > 0
              ? `${fleet.criticalRepos} repo${fleet.criticalRepos === 1 ? '' : 's'} need attention.`
              : 'No critical repos right now.'}{' '}
            {fleet.preventedIssuesAcrossFleet} prevented issues across the org this month.
          </p>
          <ConfidenceBadge
            confidence={{
              level: 'medium',
              eventCount: 87,
              reason: `Rollup from ${fleet.totalRepos} repos over 30 days`,
            }}
          />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <MetricCard
          metric={{ label: 'Total Repos', value: fleet.totalRepos, trend: 'flat' }}
        />
        <MetricCard
          metric={{ label: 'Healthy', value: fleet.healthyRepos, trend: 'flat' }}
        />
        <MetricCard
          metric={{ label: 'Warning', value: fleet.warningRepos, trend: 'flat' }}
        />
        <MetricCard
          metric={{ label: 'Critical', value: fleet.criticalRepos, trend: 'flat' }}
        />
        <MetricCard
          metric={{
            label: 'Prevented Issues',
            value: fleet.preventedIssuesAcrossFleet,
            trend: 'flat',
          }}
        />
      </div>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold text-stone-900">
          Active Risk Alerts
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {fleet.activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-xl border-2 border-red-300 bg-red-50/40 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-mono text-stone-500">{alert.id}</p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    {alert.pattern}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-semibold uppercase ${severityClasses[alert.severity]}`}
                >
                  {alert.severity}
                </span>
              </div>
              <p className="mt-3 font-mono text-xs text-stone-600">
                {alert.windowComparison}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {alert.affectedRepos.map((r) => (
                  <span
                    key={r}
                    className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-stone-700 ring-1 ring-stone-300"
                  >
                    {r}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-stone-500">
                Triggered {new Date(alert.triggeredAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold text-stone-900">Repos</h2>
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Repo</th>
                <th className="px-4 py-3">Health</th>
                <th className="px-4 py-3">CIC Pass Rate</th>
                <th className="px-4 py-3">24h Releases</th>
                <th className="px-4 py-3">7d Releases</th>
                <th className="px-4 py-3">Risk Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {fleet.repos.map((repo) => (
                <tr key={repo.repoName}>
                  <td className="px-4 py-3 font-mono text-stone-800">
                    {repo.repoName}
                  </td>
                  <td className={`px-4 py-3 font-bold tabular-nums ${healthClass(repo.healthScore)}`}>
                    {repo.healthScore}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-stone-700">
                    {repo.cicPassRate}%
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-600">
                    <span className="text-emerald-700">{repo.releaseTruth24h.pass}P</span>
                    {' / '}
                    <span className="text-amber-700">{repo.releaseTruth24h.warn}W</span>
                    {' / '}
                    <span className="text-red-700">{repo.releaseTruth24h.fail}F</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-600">
                    <span className="text-emerald-700">{repo.releaseTruth7d.pass}P</span>
                    {' / '}
                    <span className="text-amber-700">{repo.releaseTruth7d.warn}W</span>
                    {' / '}
                    <span className="text-red-700">{repo.releaseTruth7d.fail}F</span>
                  </td>
                  <td className={`px-4 py-3 font-semibold ${trendClass[repo.riskTrend]}`}>
                    {trendArrow[repo.riskTrend]} {repo.riskTrend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-stone-900">
          Pattern Spread — cross-repo reuse
        </h2>
        <p className="mt-1 text-xs text-stone-500">Top reused patterns across your repos</p>
        <div className="mt-4 overflow-hidden rounded-lg border border-stone-200">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-[10px] font-medium uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-2 text-left">Pattern Name</th>
                <th className="px-4 py-2 text-right">Reuses</th>
                <th className="px-4 py-2 text-right">Repos</th>
                <th className="px-4 py-2 text-right">Reuse Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {topPatterns.map((p) => (
                <tr key={p.patternId}>
                  <td className="px-4 py-2 font-medium text-stone-900">{p.patternName}</td>
                  <td className="px-4 py-2 text-right font-mono text-stone-700">{p.reuses}</td>
                  <td className="px-4 py-2 text-right font-mono text-stone-700">{p.reposCovered}</td>
                  <td className="px-4 py-2 text-right font-mono text-stone-700">
                    {Math.round(p.reuseRate * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-stone-500">
          {remainingPatterns} additional patterns tracked.{' '}
          <Link href="/knowledge" className="text-brand-primary underline-offset-2 hover:underline">
            → View Knowledge Cockpit
          </Link>
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-stone-900">
          Violation Concentration — top drift repos
        </h2>
        <p className="mt-1 text-xs text-stone-500">
          Repos with the highest policy violation counts
        </p>
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
                <tr key={v.repo}>
                  <td className="px-4 py-2 font-mono text-stone-800">{v.repo}</td>
                  <td className="px-4 py-2 text-right font-mono text-stone-900">
                    {v.primaryViolations}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-stone-700">
                    {v.secondaryViolations}
                  </td>
                  <td className={`px-4 py-2 font-semibold ${violationTrendClass[v.trend]}`}>
                    {violationTrendArrow[v.trend]} {v.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-stone-500">
          <Link href="/integrity" className="text-brand-primary underline-offset-2 hover:underline">
            → View Integrity Cockpit
          </Link>
        </p>
      </section>
    </div>
  );
}
