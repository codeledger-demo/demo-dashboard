import Link from 'next/link';

export default function WatchHub() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Watch</h1>
        <p className="mt-1 text-sm text-stone-500">What needs attention? Incidents, drift, truth timeline, and actionable recommendations.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link href="/incidents" className="group rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm transition hover:border-red-400 hover:shadow">
          <div className="text-2xl">🚨</div>
          <h2 className="mt-2 text-lg font-semibold text-stone-900 group-hover:text-red-700">Incidents</h2>
          <p className="mt-1 text-sm text-stone-500">Active incidents, the Auth Incident narrative, post-mortem analysis.</p>
        </Link>
        <Link href="/drift-map" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <div className="text-2xl">🗺️</div>
          <h2 className="mt-2 text-lg font-semibold text-stone-900 group-hover:text-brand-primary">Drift Map</h2>
          <p className="mt-1 text-sm text-stone-500">Intent drift visualization, scope creep detection.</p>
        </Link>
        <Link href="/truth-timeline" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <div className="text-2xl">📜</div>
          <h2 className="mt-2 text-lg font-semibold text-stone-900 group-hover:text-brand-primary">Truth Timeline</h2>
          <p className="mt-1 text-sm text-stone-500">Evidence chain events, truth grade progression.</p>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link href="/trust-layers" className="group rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <h3 className="text-sm font-semibold text-stone-700 group-hover:text-brand-primary">Trust Layers</h3>
          <p className="mt-1 text-xs text-stone-500">Context sufficiency, audit board, and signal health.</p>
        </Link>
        <Link href="/explain" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <h3 className="text-sm font-semibold text-stone-700 group-hover:text-brand-primary">Explain</h3>
          <p className="mt-1 text-xs text-stone-500">Why did this happen? Evidence-cited run narrative.</p>
        </Link>
        <Link href="/next-actions" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <h3 className="text-sm font-semibold text-stone-700 group-hover:text-brand-primary">Next Actions</h3>
          <p className="mt-1 text-xs text-stone-500">Ranked recommendations based on current signals.</p>
        </Link>
      </div>
    </div>
  );
}
