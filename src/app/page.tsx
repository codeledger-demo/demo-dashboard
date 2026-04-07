export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-md rounded-xl border border-stone-200 bg-surface-card p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-brand-primary font-serif">
          CodeLedger Dashboard
        </h1>
        <p className="mb-6 text-stone-500 text-sm">
          Synthetic team health &middot; read-only demo
        </p>
        <div className="rounded-lg bg-surface-elevated p-4 text-center">
          <p className="text-stone-600 text-sm">
            Enter your invite link to access the dashboard.
          </p>
          <p className="mt-2 text-xs text-stone-400">
            Invite links look like:{' '}
            <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs">
              /invite/eyJ...
            </code>
          </p>
        </div>
      </div>
    </main>
  );
}
