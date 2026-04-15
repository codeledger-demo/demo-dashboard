import Link from 'next/link';

export default function LandingPage(): JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-bg p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="rounded-xl border border-stone-200 bg-surface-card p-10 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-brand-primary">
              LIVE DEMO
            </span>
            <span className="text-xs text-stone-400">Updated every weekday at 9am, 11am, 2pm, 4pm Pacific</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-stone-900">
            CodeLedger Living Demo
          </h1>
          <p className="mt-3 text-lg text-stone-600">
            A synthetic engineering team. Real CodeLedger output. Ten months of history.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-stone-500">
            You&rsquo;re looking at a demonstration of what CodeLedger catches in a real
            engineering team&rsquo;s daily work. Sara, Marcus, and Priya are bot personas
            who open PRs every weekday. Every score, trend, and incident below comes from
            actual product output running against the{' '}
            <a
              href="https://github.com/codeledger-demo/acme-platform"
              className="text-brand-primary underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              acme-platform
            </a>{' '}
            synthetic monorepo.
          </p>


          {/* Positioning Block */}
          <div className="mt-6 rounded-lg border border-stone-200 bg-stone-50 p-5 text-sm leading-relaxed text-stone-600">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-primary">
              What problem are we solving?
            </p>
            <p className="mt-2">
              <strong>The Problem</strong> &mdash; AI coding agents waste 40&ndash;60% of their context
              window on irrelevant files. Every session starts cold. Institutional knowledge lives in
              people&rsquo;s heads and disappears when they leave. There is no risk signal before a merge.
            </p>
            <p className="mt-2">
              <strong>The Solution</strong> &mdash; CodeLedger is a deterministic context control plane
              for software development. It scores every file in a repository, selects only what the current
              task requires, captures outcomes, and promotes successful patterns into reusable institutional memory.
            </p>
            <p className="mt-2">
              <strong>The Intelligence Layer</strong> &mdash; The Task Intelligence Engine is seeded from
              day one with a curated ontology of golden patterns &mdash; distilled from leading engineering
              teams at organizations including Google, SAP, and Salesforce. Your own earned patterns layer
              on top, making the system progressively more tailored to your codebase.
            </p>
            <p className="mt-3 text-xs italic text-brand-primary">
              Logs are history. Ledger is intelligence.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/team-health"
              className="flex items-center justify-between rounded-lg border border-brand-primary bg-brand-primary px-5 py-4 text-white shadow-sm transition hover:bg-brand-secondary"
            >
              <span className="font-medium">Start the tour →</span>
              <span className="text-xs opacity-80">8 min</span>
            </Link>
            <a
              href="https://github.com/codeledger-demo/acme-platform/blob/main/PROSPECT_GUIDE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-stone-200 bg-surface-elevated px-5 py-4 text-stone-700 shadow-sm transition hover:border-stone-300"
            >
              <span className="font-medium">Read the guide</span>
              <span className="text-xs opacity-60">↗</span>
            </a>
          </div>

          <div className="mt-8 border-t border-stone-100 pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Recommended click path
            </p>
            <ol className="mt-3 space-y-1 text-sm text-stone-600">
              <li>
                <span className="text-stone-400">1.</span>{' '}
                <Link href="/team-health" className="text-brand-primary hover:underline">
                  Team Health
                </Link>{' '}
                — 20 seconds to get oriented
              </li>
              <li>
                <span className="text-stone-400">2.</span>{' '}
                <Link href="/time-horizon" className="text-brand-primary hover:underline">
                  Time Horizon Analytics
                </Link>{' '}
                — the flagship view
              </li>
              <li>
                <span className="text-stone-400">3.</span>{' '}
                <Link href="/incidents/the-auth-incident" className="text-brand-primary hover:underline">
                  The Auth Incident
                </Link>{' '}
                — the scenario that sells the product
              </li>
              <li>
                <span className="text-stone-400">4.</span>{' '}
                <Link href="/fleet" className="text-brand-primary hover:underline">
                  Fleet Insights
                </Link>{' '}
                — cross-repo view (Enterprise tier)
              </li>
              <li>
                <span className="text-stone-400">5.</span>{' '}
                <Link href="/sandbox" className="text-brand-primary hover:underline">
                  Sandbox Lane
                </Link>{' '}
                — try a real CIC check yourself
              </li>
            </ol>
          </div>
        </div>

        <p className="text-center text-xs text-stone-400">
          CodeLedger &middot; Intelligent Context AI Inc. &middot;{' '}
          <a
            href="https://codeledger.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-600"
          >
            codeledger.dev
          </a>
        </p>
      </div>
    </main>
  );
}
