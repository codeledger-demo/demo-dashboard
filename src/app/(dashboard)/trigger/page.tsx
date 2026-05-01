'use client';

import { useState } from 'react';
import { resolveScenarioTriggerUrl } from '@/lib/scenario-trigger';

const SCENARIOS = [
  { id: 'arc7-100-semantic-fortress-block', name: 'Semantic Fortress Block', arc: '7', feature: 'Intent-lock violation detection' },
  { id: 'arc7-101-change-capsule-expand', name: 'Change Capsule Expand', arc: '7', feature: 'OCC context expansion' },
  { id: 'arc7-102-change-capsule-block', name: 'Change Capsule Block', arc: '7', feature: 'High-risk change blocking' },
  { id: 'arc7-103-golden-pattern-match', name: 'Golden Pattern Match', arc: '7', feature: 'Prompt Coach pattern surfacing' },
  { id: 'arc7-104-fleet-risk-spike', name: 'Fleet Risk Spike', arc: '7', feature: 'Cross-repo risk detection' },
  { id: 'arc7-105-golden-pattern-promotion', name: 'Golden Pattern Promotion', arc: '7A', feature: "Sara's pattern → golden status" },
  { id: 'arc7-106-golden-pattern-coach-reference', name: 'Coach Pattern Reference', arc: '7A', feature: "Coach guides Marcus via Sara's pattern" },
  { id: 'arc7-107-truth-control-plane-loop', name: 'Truth Control Plane', arc: '7C', feature: 'Truth grade C→B→A progression' },
  { id: 'arc7-108-phase2-explain-post-incident', name: 'Phase 2 Post-Incident', arc: '7D', feature: 'Deterministic explain/learnings/next' },
  { id: 'arc7-109-coach-implementation-plan', name: 'Coach Implementation Plan', arc: '7E', feature: 'Evidence-cited webhook guidance' },
];

type Status = 'idle' | 'firing' | 'success' | 'error' | 'no-endpoint';

export default function TriggerPage() {
  const [selected, setSelected] = useState(SCENARIOS[5].id);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(false);
  const [lastFired, setLastFired] = useState<string | null>(null);

  const API_ENDPOINT = typeof window !== 'undefined'
    ? resolveScenarioTriggerUrl(window)
    : resolveScenarioTriggerUrl();

  async function fire() {
    if (cooldown) return;

    if (!API_ENDPOINT) {
      setStatus('no-endpoint');
      setMessage(
        'Scenario trigger API not connected. Set window.__SCENARIO_TRIGGER_URL__ or deploy the serverless function at /api/fire-scenario.',
      );
      return;
    }

    setStatus('firing');
    setMessage('');
    setCooldown(true);
    setTimeout(() => setCooldown(false), 60_000);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: selected }),
      });

      if (res.ok || res.status === 202) {
        setStatus('success');
        setMessage(`Scenario ${selected} dispatched. Activity will appear in ~60s.`);
        setLastFired(new Date().toLocaleTimeString());
      } else {
        setStatus('error');
        setMessage(`API returned ${res.status}: ${await res.text()}`);
      }
    } catch (err) {
      setStatus('error');
      setMessage(`Network error: ${(err as Error).message}`);
    }
  }

  const statusColors: Record<Status, string> = {
    idle: 'bg-stone-100 text-stone-600',
    firing: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    error: 'bg-red-100 text-red-700',
    'no-endpoint': 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Scenario Trigger
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Fire a feature showcase scenario on the synthetic engineering team.
          Activity appears in the demo repo and dashboard within ~60 seconds.
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-stone-700">
          Select scenario
        </label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
        >
          {SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              [{s.arc}] {s.name} — {s.feature}
            </option>
          ))}
        </select>

        <div className="mt-4 rounded-lg bg-stone-50 px-4 py-3">
          <div className="font-mono text-xs text-stone-400">scenario_id</div>
          <div className="font-mono text-sm text-stone-700">{selected}</div>
        </div>

        <button
          onClick={fire}
          disabled={cooldown || status === 'firing'}
          className={`mt-4 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white transition-colors ${
            cooldown || status === 'firing'
              ? 'cursor-not-allowed bg-stone-300'
              : 'bg-brand-primary hover:bg-brand-primary/90'
          }`}
        >
          {status === 'firing'
            ? 'Dispatching...'
            : cooldown
              ? 'Cooldown (60s)'
              : 'Fire Scenario'}
        </button>

        {message && (
          <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${statusColors[status]}`}>
            {message}
          </div>
        )}

        {lastFired && (
          <div className="mt-3 text-xs text-stone-400">
            Last fired: {lastFired}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-stone-900">
          How it works
        </h2>
        <ol className="mt-4 space-y-3 text-sm text-stone-600">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-bold text-brand-primary">1</span>
            You select a scenario and click Fire.
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-bold text-brand-primary">2</span>
            The Synthetic Reality Engine picks up the scenario (~30s).
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-bold text-brand-primary">3</span>
            Bot accounts create branches, commits, and PRs in acme-platform (~60s).
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-bold text-brand-primary">4</span>
            CodeLedger CI analyzes the PR and posts a composite comment (~2min).
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-bold text-brand-primary">5</span>
            The dashboard updates with new activity.
          </li>
        </ol>
      </div>
    </div>
  );
}
