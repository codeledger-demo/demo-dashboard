import Link from 'next/link';

export default function ValueHub() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Value</h1>
        <p className="mt-1 text-sm text-stone-500">What&apos;s the ROI? Savings, efficiency, knowledge growth, and pattern compounding.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link href="/value" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <div className="text-2xl">💰</div>
          <h2 className="mt-2 text-lg font-semibold text-stone-900 group-hover:text-brand-primary">Value Breakdown</h2>
          <p className="mt-1 text-sm text-stone-500">Dollar savings, hours saved, context reduction, rework avoided.</p>
        </Link>
        <Link href="/efficiency" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <div className="text-2xl">⚡</div>
          <h2 className="mt-2 text-lg font-semibold text-stone-900 group-hover:text-brand-primary">Efficiency</h2>
          <p className="mt-1 text-sm text-stone-500">Prompt lift, context compression, ISC scores, TIE visibility.</p>
        </Link>
        <Link href="/knowledge" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <div className="text-2xl">🧠</div>
          <h2 className="mt-2 text-lg font-semibold text-stone-900 group-hover:text-brand-primary">Knowledge</h2>
          <p className="mt-1 text-sm text-stone-500">Pattern reuse, shadow knowledge, institutional memory growth.</p>
        </Link>
        <Link href="/golden-patterns" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <div className="text-2xl">✨</div>
          <h2 className="mt-2 text-lg font-semibold text-stone-900 group-hover:text-brand-primary">Golden Patterns</h2>
          <p className="mt-1 text-sm text-stone-500">Promoted patterns, lifecycle status, reuse counts.</p>
        </Link>
      </div>
    </div>
  );
}
