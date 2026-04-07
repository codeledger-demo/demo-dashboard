# demo-dashboard

> The prospect-facing dashboard for the CodeLedger Living Demo Environment, deployed at **demo.codeledger.dev**.

A Next.js 14 App Router application that visualizes the synthetic engineering team's activity, CodeLedger metrics, and story arcs. Prospects access it via time-limited JWT invite links.

## What It Shows

Six screens spanning the full CodeLedger product surface:

1. **Team Health Overview** — score, persona cards, 30-day trend, recent activity
2. **CIC History** — filterable timeline of Completion Integrity Check results
3. **Lessons Ledger Feed** — team institutional memory with wisdom-growth metric
4. **Time Horizon Analytics** — 30/60/90/1yr selector refreshing all metric panels (the flagship view)
5. **Architecture Drift Map** — SVG service graph with per-service drift indicators
6. **Release Gate History** — release check timeline with state progression

Plus:

- **Named Incidents** — gallery + detail pages for the 4 story-arc anchors
- **Sandbox Lane** — prospects trigger a real CIC check against pre-prepared branches

## Data Mode

The dashboard operates in two modes, selected by environment:

- **Demo mode (default)** — when `DATABASE_URL` is unset, `src/lib/api/timeline-queries.ts` returns deterministic fixtures from `src/lib/api/fixtures.ts`. This lets the dashboard render a coherent demo with zero infrastructure.
- **Live mode** — when `DATABASE_URL` is set, the same query functions issue real PostgreSQL queries against the schema in `src/lib/db/schema.sql`. Data is synced from the acme-platform's `.codeledger/` directory by `src/lib/sync/ecl-sync.ts` (scheduled via GitHub Actions).

**No code changes are required to switch modes** — the data layer is identical from the UI's perspective.

## Architecture

```
demo-dashboard/
  src/
    app/
      (auth)/invite/[token]/    # JWT invite handler, sets cookie
      (dashboard)/               # All authenticated screens
        team-health/
        cic-history/
        lessons/
        time-horizon/
        drift-map/
        release-gates/
        incidents/
        incidents/[id]/
        sandbox/
    components/
      shell/                     # Sidebar, Header, TimeWindowSelector
      shared/                    # MetricCard, TrendBadge, badges, etc.
      team-health/               # HealthScore, PersonaCards, HealthTrend, RecentActivity
      cic/                       # CICTimeline, CICDetail, PersonaFilter
      lessons/                   # LessonCard, LessonTimeline, WisdomMetric
      time-horizon/              # TimeHorizonDashboard, MetricPanel, TimelineScrubber
      drift-map/                 # ServiceGraph, DriftOverlay, DriftLegend
      release-gates/             # ReleaseTimeline, GateDetail, ConfidenceBar
      incidents/                 # IncidentGallery, IncidentTimeline, IncidentMoments
      sandbox/                   # ScenarioSelector, SandboxRunner, CompletionLadder
    lib/
      auth/                      # JWT verify, cookie management (jose)
      db/                        # PostgreSQL client + schema
      api/                       # Query layer + demo fixtures
      sync/                      # ECL → Postgres sync from acme-platform
    hooks/                       # useTimeWindow, useRealtimeData
    middleware.ts                # Edge middleware enforcing invite token
    types/dashboard.ts           # All dashboard types
```

## Auth

- Prospect invite links: `/invite/<jwt>` — the JWT (HS256, signed with `DASHBOARD_JWT_SECRET`) contains `scope: "read-only"` and 7 or 14 day expiry.
- The invite handler page validates the token and sets an `invite_token` cookie.
- `src/middleware.ts` enforces the cookie on all dashboard routes. Read-only is enforced at the query layer — no write endpoints exist.

## Build

```bash
pnpm install
pnpm dev            # Next.js dev server on :3000
pnpm build          # Next.js production build
pnpm typecheck
```

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DASHBOARD_JWT_SECRET` | Yes (prod) | Signs invite JWTs. If missing, all tokens fail verification (loud warning). |
| `DATABASE_URL` | No | Postgres connection string. If set, dashboard switches from fixtures to live data. |

## Related Repos

- **acme-platform** — the synthetic target repo the dashboard reports on
- **synthetic-reality-engine** — the simulator driving acme-platform

## License

Intelligent Context AI Inc. — Confidential. Internal use only.
