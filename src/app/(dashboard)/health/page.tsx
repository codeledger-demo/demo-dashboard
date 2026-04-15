import Link from 'next/link';

export default function HealthHub() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Health</h1>
        <p className="mt-1 text-sm text-stone-500">How is my team doing? Team performance, code quality, and agent effectiveness.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link href="/team-health" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <div className="text-2xl">💚</div>
          <h2 className="mt-2 text-lg font-semibold text-stone-900 group-hover:text-brand-primary">Team Health</h2>
          <p className="mt-1 text-sm text-stone-500">Health score, persona scorecards, trend lines, recent activity.</p>
        </Link>
        <Link href="/quality" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <div className="text-2xl">⭐</div>
          <h2 className="mt-2 text-lg font-semibold text-stone-900 group-hover:text-brand-primary">Quality</h2>
          <p className="mt-1 text-sm text-stone-500">First-pass success, rework ratio, reliability metrics per service.</p>
        </Link>
        <Link href="/agents" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <div className="text-2xl">🤖</div>
          <h2 className="mt-2 text-lg font-semibold text-stone-900 group-hover:text-brand-primary">Agent Performance</h2>
          <p className="mt-1 text-sm text-stone-500">Per-agent scorecard: FPS, rework, risk, productivity, patterns.</p>
        </Link>
      </div>
    </div>
  );
}
