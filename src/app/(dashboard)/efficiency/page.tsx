import Link from 'next/link';
import { ConfidenceBadge } from '@/components/shared/ConfidenceBadge';
import {
  getEfficiencyMetrics,
  getAllPersonaMetrics,
  getDataModeInfo,
} from '@/lib/api/timeline-queries';

function MetricCardLite({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle: string;
}): JSX.Element {
  return (
    <div className="rounded-xl border border-stone-200 bg-surface-card p-5 shadow-sm">
      <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">{label}</p>
      <p className="mt-2 font-mono text-3xl font-bold text-stone-900">{value}</p>
      <p className="mt-1 text-xs text-stone-500">{subtitle}</p>
    </div>
  );
}

export default async function EfficiencyPage(): Promise<JSX.Element> {
  const [efficiency, personas, mode] = await Promise.all([
    getEfficiencyMetrics(),
    getAllPersonaMetrics(30),
    getDataModeInfo(),
  ]);

  const avg = efficiency.avgTimeToRemediateHours;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      {mode.showSampleBanner && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          {mode.sampleBannerText}
        </div>
      )}

      <Link href="/team-health" className="text-xs text-stone-500 hover:text-stone-800">
        ← Team Health
      </Link>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
          Cockpit · Efficiency
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900">
          Execution Efficiency
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          How prompt refinement and context compression reduce waste
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-stone-700">
            Prompt Lift {efficiency.promptLift}%, Waste Avoided {efficiency.wasteAvoided}%, average
            Time to Remediate {avg.toFixed(1)}h.
          </p>
          <ConfidenceBadge confidence={efficiency.confidence} showCount />
        </div>
      </div>

      <section>
        <h2 className="mb-3 font-serif text-lg font-semibold text-stone-900">Input quality</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <MetricCardLite
            label="Prompt Lift"
            value={`${efficiency.promptLift}%`}
            subtitle="how much the prompt coach improved inputs"
          />
          <MetricCardLite
            label="Context Compression"
            value={`${efficiency.contextCompression}%`}
            subtitle="how much context was reduced without losing signal"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-serif text-lg font-semibold text-stone-900">Output quality</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <MetricCardLite
            label="Waste Avoided"
            value={`${efficiency.wasteAvoided}%`}
            subtitle="retries avoided, first-pass success"
          />
          <MetricCardLite
            label="Clean Admission"
            value={`${efficiency.cleanAdmission}%`}
            subtitle="entries accepted without redaction"
          />
        </div>
      </section>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
          Estimated proxy
        </p>
        <p className="mt-2 text-sm leading-relaxed text-stone-700">
          Waste avoided is an estimated operational proxy — based on retries avoided, first-pass
          success, and low rework signals. Not a precise financial metric — use as a directional
          indicator.
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-surface-card p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-stone-900">
          Time to Remediate — cycle time from failure to clean submit
        </h2>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="font-serif text-5xl font-bold text-brand-primary">
            {avg.toFixed(1)}h
          </span>
          <span className="text-sm text-stone-500">average</span>
        </div>
        <div className="mt-6 overflow-hidden rounded-lg border border-stone-200">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-[10px] font-medium uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-2 text-left">Engineer</th>
                <th className="px-4 py-2 text-right">Avg TTR</th>
                <th className="px-4 py-2 text-left">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {personas.map((p) => {
                const ttr = p.avgRemediationHours ?? 0;
                const below = ttr < avg;
                return (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="px-4 py-2 text-stone-800">
                      {p.emoji} {p.name}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-stone-900">
                      {ttr.toFixed(1)}h
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold ${below ? 'text-emerald-600' : 'text-red-600'}`}
                    >
                      {below ? '↓ below avg' : '↑ above avg'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-stone-500">
          Lower is better. This is the metric that answers the #1 EM objection: &ldquo;does
          quality gating slow my team down?&rdquo;
        </p>
      </div>

      <div className="border-t border-stone-100 pt-5">
        <p className="text-center text-xs text-stone-400">
          Aggregate signals only — no individual productivity tracking.
        </p>
      </div>
    </div>
  );
}
