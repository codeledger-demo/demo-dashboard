import { getFleetData } from '@/lib/api/timeline-queries';
import { MetricCard } from '@/components/shared/MetricCard';
import type { FleetRiskAlert, FleetRepoSummary } from '@/lib/api/fixtures';

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
  const fleet = await getFleetData();

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
    </div>
  );
}
