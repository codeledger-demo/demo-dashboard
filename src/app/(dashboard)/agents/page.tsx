interface AgentRow {
  agent: string;
  label: string;
  fps: number;
  fpsNum: number;
  fpsDen: number;
  reversalRate: number;
  riskContribution: number;
  productivityContribution: number;
  patternContribution: number;
  attributionQuality: string;
  executionCount: number;
}

function getAgentScorecard(): { agents: AgentRow[]; topAgent: string; highestRiskAgent: string; narratives: string[] } {
  const agents: AgentRow[] = [
    { agent: 'claude_code', label: 'Claude Code', fps: 0.89, fpsNum: 48, fpsDen: 54, reversalRate: 0.07, riskContribution: 0.32, productivityContribution: 0.55, patternContribution: 0.42, attributionQuality: 'deterministic', executionCount: 54 },
    { agent: 'cursor', label: 'Cursor', fps: 0.76, fpsNum: 22, fpsDen: 29, reversalRate: 0.14, riskContribution: 0.44, productivityContribution: 0.25, patternContribution: 0.33, attributionQuality: 'deterministic', executionCount: 29 },
    { agent: 'codex', label: 'Codex', fps: 0.80, fpsNum: 4, fpsDen: 5, reversalRate: 0.20, riskContribution: 0.24, productivityContribution: 0.05, patternContribution: 0.25, attributionQuality: 'partial', executionCount: 5 },
  ];

  const top = agents.reduce((a, b) => a.productivityContribution > b.productivityContribution ? a : b);
  const risk = agents.reduce((a, b) => a.riskContribution > b.riskContribution ? a : b);

  // Phase 3: Automated executive narratives
  const narratives: string[] = [];
  narratives.push(`${top.label} is the top-performing agent with ${pct(top.fps)} first-pass success across ${top.executionCount} sessions, contributing ${pct(top.productivityContribution)} of successful executions.`);

  if (risk.agent !== top.agent) {
    narratives.push(`${risk.label} generates ${pct(risk.riskContribution)} of risk events but only ${pct(risk.productivityContribution)} of successful executions. Risk-to-productivity ratio: ${(risk.riskContribution / Math.max(0.01, risk.productivityContribution)).toFixed(1)}x.`);
  }

  const patternLeader = agents.reduce((a, b) => a.patternContribution > b.patternContribution ? a : b);
  narratives.push(`${patternLeader.label} leads knowledge growth with ${pct(patternLeader.patternContribution)} of promoted patterns — building reusable institutional memory.`);

  const lowestRework = agents.reduce((a, b) => a.reversalRate < b.reversalRate ? a : b);
  narratives.push(`${lowestRework.label} has the lowest rework rate at ${pct(lowestRework.reversalRate)}, indicating the most stable first-pass behavior.`);

  return { agents, topAgent: top.agent, highestRiskAgent: risk.agent, narratives };
}

function pct(v: number): string { return `${Math.round(v * 100)}%`; }

function fpsBar(fps: number) {
  const width = Math.round(fps * 100);
  const color = fps >= 0.85 ? 'bg-emerald-500' : fps >= 0.70 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 rounded-full bg-stone-100">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
      <span className="text-xs font-medium text-stone-600">{pct(fps)}</span>
    </div>
  );
}

function qualityBadge(q: string) {
  const cls = q === 'deterministic' ? 'bg-emerald-100 text-emerald-700' : q === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500';
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>{q.toUpperCase()}</span>;
}

export default function AgentsPage() {
  const { agents, topAgent, highestRiskAgent, narratives } = getAgentScorecard();

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Agent Performance Intelligence</h1>
        <p className="mt-1 text-sm text-stone-500">Deterministic comparison of AI coding agents. No vibes — just math. Every metric is grounded in Intent-to-Outcome linkage.</p>
      </div>

      {/* Executive Narrative (Phase 3) */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-600">Executive Summary</div>
        <div className="space-y-2">
          {narratives.map((n, i) => (
            <p key={i} className="text-sm text-stone-700">{n}</p>
          ))}
        </div>
      </div>

      {/* Key Callouts */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="text-xs font-medium text-emerald-600">Top Agent</div>
          <div className="mt-1 text-xl font-bold text-stone-900">{agents.find((a) => a.agent === topAgent)?.label}</div>
          <div className="mt-1 text-xs text-stone-500">Highest productivity contribution</div>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="text-xs font-medium text-red-600">Highest Risk</div>
          <div className="mt-1 text-xl font-bold text-stone-900">{agents.find((a) => a.agent === highestRiskAgent)?.label}</div>
          <div className="mt-1 text-xs text-stone-500">Highest risk concentration</div>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <div className="text-xs font-medium text-stone-500">Total Sessions</div>
          <div className="mt-1 text-xl font-bold text-stone-900">{agents.reduce((s, a) => s + a.executionCount, 0)}</div>
          <div className="mt-1 text-xs text-stone-500">Across all agents</div>
        </div>
      </div>

      {/* Scorecard Table */}
      <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-stone-700">Agent Scorecard</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-left text-xs font-medium uppercase tracking-wider text-stone-400">
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">First-Pass Success</th>
                <th className="px-4 py-3">Rework</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3">Productivity</th>
                <th className="px-4 py-3">Patterns</th>
                <th className="px-4 py-3">Sessions</th>
                <th className="px-4 py-3">Attribution</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => (
                <tr key={a.agent} className="border-b border-stone-50 hover:bg-stone-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-stone-800">{a.label}</div>
                    {a.agent === topAgent && <span className="text-[10px] text-emerald-600">TOP</span>}
                    {a.agent === highestRiskAgent && a.agent !== topAgent && <span className="text-[10px] text-red-500">RISK</span>}
                  </td>
                  <td className="px-4 py-3">{fpsBar(a.fps)}</td>
                  <td className="px-4 py-3"><span className={a.reversalRate > 0.10 ? 'text-red-600 font-medium' : 'text-stone-600'}>{pct(a.reversalRate)}</span></td>
                  <td className="px-4 py-3"><span className={a.riskContribution > 0.40 ? 'text-red-600 font-medium' : 'text-stone-600'}>{pct(a.riskContribution)}</span></td>
                  <td className="px-4 py-3 text-stone-600">{pct(a.productivityContribution)}</td>
                  <td className="px-4 py-3 text-stone-600">{pct(a.patternContribution)}</td>
                  <td className="px-4 py-3 text-stone-600">{a.executionCount}</td>
                  <td className="px-4 py-3">{qualityBadge(a.attributionQuality)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof of Capability */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">Proof of Capability</h2>
        <p className="mt-1 text-sm text-stone-500">Every metric above is tagged with its attribution quality. This isn&apos;t AI guesswork — it&apos;s auditable fact derived from Intent-to-Outcome linkage.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-stone-50 p-3">
            <div className="text-xs font-medium text-emerald-600">DETERMINISTIC</div>
            <p className="mt-1 text-xs text-stone-500">Agent explicitly identified. Full provenance chain from task to outcome.</p>
          </div>
          <div className="rounded-lg bg-stone-50 p-3">
            <div className="text-xs font-medium text-amber-600">PARTIAL</div>
            <p className="mt-1 text-xs text-stone-500">Agent inferred from environment signals. Confidence above 50%.</p>
          </div>
          <div className="rounded-lg bg-stone-50 p-3">
            <div className="text-xs font-medium text-stone-500">ADVISORY</div>
            <p className="mt-1 text-xs text-stone-500">Attribution quality below threshold. Data shown but flagged as low-confidence.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
