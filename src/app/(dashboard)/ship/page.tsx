import Link from 'next/link';

export default function ShipHub() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Ship</h1>
        <p className="mt-1 text-sm text-stone-500">Are we shipping safely? Integrity verification across architecture, implementation, and release.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link href="/integrity-overview" className="group rounded-xl border-2 border-indigo-200 bg-indigo-50 p-6 shadow-sm transition hover:border-indigo-400 hover:shadow">
          <div className="text-2xl">🛡️</div>
          <h2 className="mt-2 text-lg font-semibold text-stone-900 group-hover:text-indigo-700">Integrity Trinity</h2>
          <p className="mt-1 text-sm text-stone-500">Unified view: Architecture + Implementation + Release integrity.</p>
        </Link>
        <Link href="/doctrine" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <div className="text-2xl">🏛️</div>
          <h2 className="mt-2 text-lg font-semibold text-stone-900 group-hover:text-brand-primary">Architecture Doctrine</h2>
          <p className="mt-1 text-sm text-stone-500">Parallel-system detection, progressive intervention events.</p>
        </Link>
        <Link href="/shadow" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <div className="text-2xl">🔬</div>
          <h2 className="mt-2 text-lg font-semibold text-stone-900 group-hover:text-brand-primary">Shadow Evaluation</h2>
          <p className="mt-1 text-sm text-stone-500">Legacy vs candidate comparison, gate verdicts, match rates.</p>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link href="/integrity" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <h3 className="text-sm font-semibold text-stone-700 group-hover:text-brand-primary">Integrity Details</h3>
          <p className="mt-1 text-xs text-stone-500">Write safety, boundary integrity, clean admission.</p>
        </Link>
        <Link href="/release-gates" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <h3 className="text-sm font-semibold text-stone-700 group-hover:text-brand-primary">Release Gates</h3>
          <p className="mt-1 text-xs text-stone-500">Release readiness history, propagation checks.</p>
        </Link>
        <Link href="/cic-history" className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow">
          <h3 className="text-sm font-semibold text-stone-700 group-hover:text-brand-primary">CIC History</h3>
          <p className="mt-1 text-xs text-stone-500">Completion Integrity Check timeline.</p>
        </Link>
      </div>
    </div>
  );
}
