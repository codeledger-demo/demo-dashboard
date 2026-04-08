# demo-dashboard

> The prospect-facing dashboard for the CodeLedger Living Demo Environment, deployed at **[demo.codeledger.dev](https://demo.codeledger.dev)**.

A Next.js 14 App Router application that visualizes the synthetic engineering team's activity, CodeLedger metrics, and story arcs. Built as a static site and served from GitHub Pages at `codeledger-demo.github.io/demo-dashboard/`, with `demo.codeledger.dev` as the public branded entry point (Lovable hosts `codeledger.dev` and redirects the `demo.*` subdomain to the GitHub Pages build).

## ⚠️ Not the same as CodeLedger's Engineering Dashboard

CodeLedger v0.9.2 ships its own static **Engineering Dashboard** (`codeledger dashboard build/open/serve`) that engineering teams run locally against their own repos to inspect their own evidence, hotspots, and architecture health. That's a *product feature* of CodeLedger.

This **demo-dashboard** is something different: a prospect-facing showcase that visualizes a synthetic engineering team (Sara, Marcus, Priya) working on the synthetic `acme-platform` repo over time. It exists to *sell* CodeLedger by showing what the product catches, not to *be* CodeLedger.

| | Engineering Dashboard (product) | demo-dashboard (this repo) |
|---|---|---|
| **Audience** | Engineers running CodeLedger | Prospects evaluating CodeLedger |
| **Data source** | Your real `.codeledger/` directory | Synthetic `acme-platform` simulator output (fixtures) |
| **Deployed where** | Each team self-hosts | [demo.codeledger.dev](https://demo.codeledger.dev) (public, static) |
| **Auth** | None (local file) | None (public demo) |
| **Built by** | `codeledger dashboard build` | `next build` with `output: 'export'` |

Both can coexist. A prospect who buys CodeLedger uses both: the demo to evaluate, the Engineering Dashboard to operate.

## What It Shows

Eight screens spanning the full CodeLedger product surface:

1. **Team Health Overview** — score, persona cards, 30-day trend, recent activity
2. **CIC History** — filterable timeline of Completion Integrity Check results
3. **Lessons Ledger Feed** — team institutional memory with wisdom-growth metric
4. **Time Horizon Analytics** — 30/60/90/1yr selector refreshing all metric panels (the flagship view)
5. **Architecture Drift Map** — SVG service graph with per-service drift indicators
6. **Release Gate History** — release check timeline with state progression
7. **Fleet Insights** _(Enterprise tier showcase)_ — cross-repo intelligence with risk spike alerts (added April 2026 with v0.9.2 fleet feature)
8. **Sandbox Lane** — prospects trigger a CIC check against pre-prepared scenarios

Plus:

- **Named Incidents** — gallery + detail pages for the 4 story-arc anchors (the-auth-incident, the-sprint-debt-event, the-priya-turnaround, the-clean-release)

## CodeLedger v0.9.2 features showcased

The dashboard includes demo scenarios for these v0.9.2 (April 2026) features:

- **Semantic Fortress** (merge-check + intent-lock registry + hallucination guard) — Arc 7 scenario 100
- **Change Capsule** (fused structural+behavioral safety check) — Arc 7 scenarios 101 & 102
- **Golden Pattern surfacing** via Prompt Coach — Arc 7 scenario 103
- **Fleet risk spike alerts** — Arc 7 scenario 104 + the `/fleet` dashboard route
- **MCP Server** (`codeledger mcp start`) — referenced in scenario annotations; the dashboard does not consume MCP directly but the demo CLI commands include it

## Deployment Architecture

```
┌─────────────────────┐
│  demo.codeledger.dev│  (public branded URL — hits Lovable edge)
└──────────┬──────────┘
           │ Lovable app detects hostname,
           │ client-side redirect to ↓
           ▼
┌────────────────────────────────────────────┐
│ codeledger-demo.github.io/demo-dashboard/  │  (static export, served by GitHub Pages)
└────────────────────────────────────────────┘
           ▲
           │ built + deployed on every push to main via
           │ .github/workflows/deploy-pages.yml
           │
┌──────────┴──────────┐
│  codeledger-demo/   │
│  demo-dashboard     │  (this repo — public, source of truth)
└─────────────────────┘
```

The dashboard is a **pure static site** — `next build` with `output: 'export'` produces HTML in `out/` with no server runtime. Every page renders from deterministic fixtures in `src/lib/api/fixtures.ts`. This means the demo works offline, costs nothing to host, and can never leak real customer data (there's no customer data to leak).

## Data Mode

The dashboard operates in two modes, selected by environment at build time:

- **Demo mode (default, production)** — when `DATABASE_URL` is unset, `src/lib/api/timeline-queries.ts` returns deterministic fixtures from `src/lib/api/fixtures.ts`. This is what the live `demo.codeledger.dev` serves.
- **Live mode (local dev only)** — when `DATABASE_URL` is set, the same query functions issue real PostgreSQL queries against the schema in `src/lib/db/schema.sql`. Data is synced from the acme-platform's `.codeledger/` directory by `src/lib/sync/ecl-sync.ts`. Requires a running Postgres (see `docker-compose.yml`). Not used in production — the static export is the production build.

**No code changes are required to switch modes** — the data layer is identical from the UI's perspective.

## Architecture

```
demo-dashboard/
  src/
    app/
      layout.tsx                   # Root layout with globals.css
      page.tsx                     # Landing page with tour CTAs
      (dashboard)/                 # All dashboard screens
        team-health/
        cic-history/
        lessons/
        time-horizon/
        drift-map/
        release-gates/
        incidents/
        incidents/[id]/            # Pre-rendered via generateStaticParams
        fleet/
        sandbox/
    components/
      shell/                       # Sidebar, Header, TimeWindowSelector
      shared/                      # MetricCard, TrendBadge, badges, etc.
      team-health/                 # HealthScore, PersonaCards, HealthTrend, RecentActivity
      cic/                         # CICTimeline, CICDetail, PersonaFilter
      lessons/                     # LessonCard, LessonTimeline, WisdomMetric
      time-horizon/                # TimeHorizonDashboard, MetricPanel, TimelineScrubber
      drift-map/                   # ServiceGraph, DriftOverlay, DriftLegend
      release-gates/               # ReleaseTimeline, GateDetail, ConfidenceBar
      incidents/                   # IncidentGallery, IncidentTimeline, IncidentMoments
      fleet/                       # Fleet repo table, risk alert cards
      sandbox/                     # ScenarioSelector, SandboxRunner, CompletionLadder
    lib/
      api/                         # timeline-queries.ts + fixtures.ts (single data source)
      db/                          # PostgreSQL client + schema (unused in static build)
      sync/                        # ECL → Postgres sync (unused in static build)
      auth/                        # JWT helpers (legacy, kept for tests)
    hooks/                         # useTimeWindow, useRealtimeData
    types/dashboard.ts             # All dashboard types
  tests/                           # 22 vitest tests (fixtures, queries, JWT)
  .github/workflows/
    deploy-pages.yml               # Build + deploy to GitHub Pages on push
```

## Build + Deploy

```bash
pnpm install
pnpm dev            # Next.js dev server on :3000 (hot reload)
pnpm build          # Static export → out/
pnpm typecheck
pnpm test           # Vitest, 22 tests
```

The `deploy-pages.yml` workflow runs on every push to `main`, builds the static site with `NEXT_PUBLIC_BASE_PATH=/demo-dashboard`, and publishes to GitHub Pages. New commits are live at `codeledger-demo.github.io/demo-dashboard/` in ~60 seconds.

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_BASE_PATH` | No | Set to `/demo-dashboard` when deploying to `github.io/demo-dashboard/`. Leave unset when deploying to the root of a custom domain. |
| `DATABASE_URL` | No | Local dev only — enables live Postgres mode. Never set in production (the production build is static). |

## Related Repos

- **[acme-platform](https://github.com/codeledger-demo/acme-platform)** — the public synthetic target repo the dashboard reports on
- **[synthetic-reality-engine](https://github.com/codeledger-demo/synthetic-reality-engine)** — the private simulator driving acme-platform

## License

Intelligent Context AI Inc. — Confidential. Internal use only.
