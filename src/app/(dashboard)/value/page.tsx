import Link from 'next/link';
import { ConfidenceBadge } from '@/components/shared/ConfidenceBadge';
import { getValueBreakdown, getDataModeInfo } from '@/lib/api/timeline-queries';

/**
 * Value Cockpit — the dollar estimate with full derivation.
 *
 * This is the page that survives procurement review. Every number
 * is traceable: the formula is shown inline, the input signals are
 * listed with "View evidence" links, the assumptions are surfaced
 * (and overridable — though the override UI is static in the demo),
 * and the unseen-risk note is the verbatim copy from the product spec.
 *
 * Structure follows §5 Page 6 of the Unified EM Dashboard spec:
 *   - Headline: total + confidence + 7d delta
 *   - Component breakdown: hours + % + per-component derivation
 *   - Formula: shown in mono
 *   - Input signals table with evidence links
 *   - Assumptions (cost/hr, rework multiplier, blended hours)
 *   - Unseen risk note (verbatim)
 *   - Privacy footer (verbatim)
 */
export default async function ValuePage(): Promise<JSX.Element> {
  const [value, mode] = await Promise.all([
    getValueBreakdown(),
    getDataModeInfo(),
  ]);

  const formatCurrency = (n: number): string =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: value.currency,
      maximumFractionDigits: 0,
    }).format(n);

  const deltaText =
    value.delta7d === 0
      ? 'flat vs last 7 days'
      : value.delta7d > 0
        ? `+${formatCurrency(value.delta7d)} vs last 7 days`
        : `${formatCurrency(value.delta7d)} vs last 7 days`;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      {mode.showSampleBanner && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          {mode.sampleBannerText}
        </div>
      )}

      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
          Engineering work as a compounding asset
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900">
          Value Cockpit
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          Every dollar shown here is derived from signals CodeLedger captured directly from
          CI — retries avoided, context reused, patterns compounded. The math is in the open.
        </p>
      </div>

      {/* Headline total + confidence + delta */}
      <div className="rounded-xl border border-stone-200 bg-surface-card p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Estimated savings (last 30 days)
            </p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-serif text-5xl font-bold text-brand-primary">
                {formatCurrency(value.totalEstimate)}
              </span>
              <span className="text-sm text-stone-500">{deltaText}</span>
            </div>
            <div className="mt-3">
              <ConfidenceBadge confidence={value.confidence} showCount size="md" />
            </div>
          </div>
          <div className="hidden rounded-lg border border-stone-200 bg-surface-elevated p-4 text-right md:block">
            <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
              Total hours saved
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold text-stone-900">
              {value.components.reduce((sum, c) => sum + c.hours, 0).toFixed(1)}h
            </p>
            <p className="mt-1 text-[10px] text-stone-400">
              across {value.confidence.eventCount} executions
            </p>
          </div>
        </div>
      </div>

      {/* Component breakdown */}
      <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-serif text-lg font-semibold text-stone-900">
            Breakdown by component
          </h2>
          <p className="text-xs text-stone-400">hours saved · % of total</p>
        </div>
        <div className="space-y-4">
          {value.components.map((component) => (
            <div key={component.label} className="rounded-lg border border-stone-100 bg-surface-elevated p-4">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-medium text-stone-900">{component.label}</h3>
                  <p className="mt-1 font-mono text-xs text-stone-500">
                    {component.derivation}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-lg font-semibold text-stone-900">
                    {component.hours.toFixed(1)}h
                  </p>
                  <p className="text-xs text-stone-500">
                    {component.percentOfTotal.toFixed(1)}%
                  </p>
                </div>
              </div>
              {/* Inline percentage bar */}
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full bg-brand-primary transition-all"
                  style={{ width: `${component.percentOfTotal}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How this value is computed */}
      <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-stone-900">
          How this value is computed
        </h2>
        <div className="mt-4 rounded-lg bg-stone-900 p-4">
          <p className="font-mono text-xs text-emerald-300">
            {value.formulaText}
          </p>
        </div>

        {/* Input signals */}
        <div className="mt-6">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Input signals (each with evidence)
          </p>
          <div className="mt-2 overflow-hidden rounded-lg border border-stone-200">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-[10px] font-medium uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-2 text-left">Signal</th>
                  <th className="px-4 py-2 text-right">Value</th>
                  <th className="px-4 py-2 text-left">Severity</th>
                  <th className="px-4 py-2 text-left">Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {value.signals.map((signal) => (
                  <tr key={signal.id} className="hover:bg-stone-50">
                    <td className="px-4 py-2">
                      <div className="font-medium text-stone-900">{signal.name}</div>
                      <div className="mt-0.5 text-xs text-stone-500">{signal.description}</div>
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-stone-900">
                      {signal.value}
                      {signal.unit === '%' ? '%' : signal.unit === 'h' ? 'h' : ''}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          signal.severity === 'error'
                            ? 'bg-red-50 text-semantic-error'
                            : signal.severity === 'warn'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-sky-50 text-sky-700'
                        }`}
                      >
                        {signal.severity}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {signal.evidenceUrl ? (
                        <Link
                          href={signal.evidenceUrl}
                          className="text-xs text-brand-primary underline-offset-2 hover:underline"
                        >
                          View evidence →
                        </Link>
                      ) : (
                        <span className="text-xs text-stone-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Assumptions */}
      <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-stone-900">Assumptions</h2>
        <p className="mt-1 text-sm text-stone-500">
          Adjust these to match your loaded rate. The math changes — the direction doesn&rsquo;t.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-stone-200 bg-surface-elevated p-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
              Cost per hour (loaded)
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold text-stone-900">
              ${value.assumptions.costPerHour}
            </p>
            <p className="mt-1 text-[10px] text-stone-400">per engineer-hour</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-surface-elevated p-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
              Rework multiplier
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold text-stone-900">
              {value.assumptions.reworkMultiplier.toFixed(1)}×
            </p>
            <p className="mt-1 text-[10px] text-stone-400">context switching cost</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-surface-elevated p-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
              Blended hours / execution
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold text-stone-900">
              {value.assumptions.blendedHoursPerExecution.toFixed(2)}h
            </p>
            <p className="mt-1 text-[10px] text-stone-400">average</p>
          </div>
        </div>
      </div>

      {/* Unseen risk note — VERBATIM from spec §7, load-bearing trust copy */}
      <div className="rounded-lg border-l-4 border-brand-primary bg-emerald-50/50 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-primary">
          Unseen value — not in this estimate
        </p>
        <p className="mt-2 text-sm leading-relaxed text-stone-700">
          {value.unseenRiskNote}
        </p>
      </div>

      {/* Privacy footer — VERBATIM, every page with per-engineer data has this */}
      <div className="border-t border-stone-100 pt-5">
        <p className="text-center text-xs text-stone-400">
          Value is grounded in aggregate signals. No individual developer scoring.
        </p>
      </div>
    </div>
  );
}
