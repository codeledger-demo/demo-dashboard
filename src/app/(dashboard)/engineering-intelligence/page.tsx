import { getMergeMemoryRollup } from '@/lib/api/timeline-queries';
import type { MergeMemoryRollupRow } from '@/lib/api/timeline-queries';

export const dynamic = 'force-static';

function pct(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

function confidencePill(tag: MergeMemoryRollupRow['confidenceTag']): JSX.Element {
  const styles = {
    deterministic: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    partial: 'bg-amber-100 text-amber-700 border-amber-300',
    advisory: 'bg-stone-100 text-stone-500 border-stone-300',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${styles[tag]}`}>
      {tag}
    </span>
  );
}

function certBar(rate: number): JSX.Element {
  const pctVal = Math.round(rate * 100);
  const color = pctVal >= 90 ? 'bg-emerald-500' : pctVal >= 70 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-stone-200">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pctVal}%` }} />
      </div>
      <span className="tabular-nums text-sm">{pct(rate)}</span>
    </div>
  );
}

function riskBadge(rate: number): JSX.Element {
  const pctVal = Math.round(rate * 100);
  const color = pctVal === 0 ? 'text-emerald-700' : pctVal <= 25 ? 'text-amber-600' : 'text-red-600';
  return <span className={`tabular-nums text-sm font-medium ${color}`}>{pct(rate)}</span>;
}

function AuthorRow({ row }: { row: MergeMemoryRollupRow }): JSX.Element {
  const displayName = row.author
    .replace(/-acme$/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <details className="group border-b border-stone-100 last:border-0">
      <summary className="flex cursor-pointer select-none items-center gap-4 px-4 py-3 hover:bg-stone-50">
        <span className="w-5 text-stone-400 transition-transform group-open:rotate-90">▶</span>
        <span className="w-36 font-medium text-stone-800">{displayName}</span>
        <span className="w-16 text-center tabular-nums text-sm text-stone-600">{row.merges}</span>
        <span className="w-40">{certBar(row.certified_rate)}</span>
        <span className="w-24">{riskBadge(row.risk_cues_rate)}</span>
        <span className="ml-auto">{confidencePill(row.confidenceTag)}</span>
      </summary>

      {row.recent_samples.length > 0 && (
        <div className="ml-9 mb-3 mr-4 rounded-lg border border-stone-100 bg-stone-50">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-left text-stone-500">
                <th className="px-3 py-2 font-medium">Merge</th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Certified</th>
                <th className="px-3 py-2 font-medium">Risk cues</th>
              </tr>
            </thead>
            <tbody>
              {row.recent_samples.map((s, i) => (
                <tr key={i} className="border-b border-stone-100 last:border-0">
                  <td className="max-w-xs truncate px-3 py-2 text-stone-700">
                    {s.task ?? '(untitled)'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-stone-500">
                    {new Date(s.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      timeZone: 'UTC',
                    })}
                  </td>
                  <td className="px-3 py-2">
                    {s.certified ? (
                      <span className="text-emerald-600">✓ yes</span>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {s.risk_count > 0 ? (
                      <span className="text-amber-600">{s.risk_count} finding{s.risk_count !== 1 ? 's' : ''}</span>
                    ) : (
                      <span className="text-stone-400">none</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </details>
  );
}

export default async function EngineeringIntelligencePage(): Promise<JSX.Element> {
  const rollup = await getMergeMemoryRollup();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Engineering Intelligence</h1>
        <p className="mt-1 text-sm text-stone-500">
          Manager-facing merge rollup — 7-day window, per-developer cert and risk mix.
          {rollup.isSynthetic && (
            <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 border border-blue-200">
              synthetic data
            </span>
          )}
        </p>
      </div>

      {/* Headline metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Total merges (7d)</p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-stone-900">
            {rollup.headline.total_merges}
          </p>
          <p className="mt-1 text-xs text-stone-400">{rollup.per_author.length} contributors</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Certified rate</p>
          <p className={`mt-2 text-4xl font-bold tabular-nums ${
            rollup.headline.certified_rate >= 0.9 ? 'text-emerald-700' :
            rollup.headline.certified_rate >= 0.7 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {pct(rollup.headline.certified_rate)}
          </p>
          <p className="mt-1 text-xs text-stone-400">CIC verified at merge</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400">With risk cues</p>
          <p className={`mt-2 text-4xl font-bold tabular-nums ${
            rollup.headline.risk_cues_rate === 0 ? 'text-emerald-700' :
            rollup.headline.risk_cues_rate <= 0.25 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {pct(rollup.headline.risk_cues_rate)}
          </p>
          <p className="mt-1 text-xs text-stone-400">review findings or ghost files</p>
        </div>
      </div>

      {/* Merge Memory tile */}
      <div className="rounded-xl border border-stone-200 bg-surface-card shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
          <div>
            <h2 className="font-semibold text-stone-800">Merge Memory Rollup</h2>
            <p className="text-xs text-stone-400">
              Per-developer · 7-day window · expand a row for recent merges
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-400">
            {confidencePill(rollup.headline.confidenceTag)}
            <span>as of {new Date(rollup.generated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</span>
          </div>
        </div>

        {/* Column headers */}
        <div className="flex items-center gap-4 border-b border-stone-100 bg-stone-50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-stone-400">
          <span className="w-5" />
          <span className="w-36">Developer</span>
          <span className="w-16 text-center">Merges</span>
          <span className="w-40">Certified</span>
          <span className="w-24">Risk cues</span>
          <span className="ml-auto">Signal</span>
        </div>

        <div>
          {rollup.per_author.map((row) => (
            <AuthorRow key={row.author} row={row} />
          ))}
        </div>
      </div>

      <p className="text-xs text-stone-400">
        Data sourced from SRE bootstrap seeder · Arc 7 scenario #120 ·{' '}
        <span className="font-mono">{rollup.window}</span> window ending{' '}
        {new Date(rollup.generated_at).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC',
        })}
      </p>
    </div>
  );
}
