# Demo Dashboard — Deployment Setup

This document covers running the dashboard locally, building the static site, and the production deployment chain for `demo.codeledger.dev`.

## Prerequisites

- Node 20+ and pnpm
- Docker Desktop (optional — only for the local live-Postgres mode)
- The `synthetic-reality-engine` repo cloned alongside this one if you want to regenerate demo fixtures

## Production Architecture (TL;DR)

```
demo.codeledger.dev
    → Lovable (hosts codeledger.dev at the apex, detects the demo.* subdomain,
       client-side redirects to ↓)
    → codeledger-demo.github.io/demo-dashboard/
       (static site, served free by GitHub Pages, rebuilt on every push to main)
```

**The dashboard is a pure static site** — no server runtime, no database in production, no auth. Every page renders from deterministic fixtures. The production build is `next build` with `output: 'export'`.

## Local Development

### Fixture mode (simplest — no infrastructure)

```bash
pnpm install
pnpm dev
# Open http://localhost:3000
```

Renders all 11 routes against `src/lib/api/fixtures.ts`. Useful for UI work, screenshots, and offline demos.

### Live Postgres mode (optional, for sync testing)

When you want to test the live data path end-to-end against real simulator output:

```bash
# 1. Start Postgres
pnpm db:up
# Postgres listening on localhost:5433
# Schema auto-applied from src/lib/db/schema.sql on first boot

# 2. Bootstrap demo data from the simulator
cd ../synthetic-reality-engine
pnpm bootstrap:seed
# Writes 65 scenarios → .bootstrap-output/

# 3. Sync to Postgres
cd ../demo-dashboard
DATABASE_URL=postgres://demo:demo@localhost:5433/demo_dashboard \
  pnpm db:sync --data-dir ../synthetic-reality-engine/.bootstrap-output

# 4. Run dev in live mode
DATABASE_URL=postgres://demo:demo@localhost:5433/demo_dashboard pnpm dev

# 5. Tear down
pnpm db:down       # stop container, keep volume
pnpm db:reset      # stop container AND drop volume (clean slate)
```

**Important:** live mode is *local dev only*. The production build is static and ignores `DATABASE_URL`. Do not set `DATABASE_URL` in the GitHub Actions build.

## Testing

```bash
pnpm test          # Vitest: 22 tests across fixtures, queries, JWT helpers
pnpm typecheck     # TypeScript strict
pnpm build         # Static export → out/
```

The JWT helper tests still exist because the code is kept (harmless, unused at runtime). They'll remain green as long as the library continues to export the expected API.

## Production Deployment

### Primary chain: GitHub Pages → Lovable → custom domain

The repo has `.github/workflows/deploy-pages.yml` which runs on every push to `main`:

1. Checks out the repo
2. Runs `pnpm install --frozen-lockfile`
3. Runs `pnpm build` with `NEXT_PUBLIC_BASE_PATH=/demo-dashboard`
4. Uploads `out/` as a Pages artifact
5. Deploys to GitHub Pages

The result is live at `https://codeledger-demo.github.io/demo-dashboard/` within ~60 seconds of a push.

The branded URL `https://demo.codeledger.dev` is served separately by Lovable (see the Lovable project at `codeledger.lovable.app`). The Lovable app has a client-side redirect that fires when `window.location.hostname === 'demo.codeledger.dev'`, sending visitors to the GitHub Pages build while preserving deep-link paths.

### Why not server-rendered?

The dashboard in fixture mode has no server-side state — every page is deterministic. Shipping it as static HTML is:

- **Free** (GitHub Pages is free for public repos)
- **Fast** (CDN-served from GitHub's edge)
- **Secure** (no attack surface — there's no server)
- **Honest** (no hidden data, no API calls, everything inspectable in `out/`)

Converting back to a Node server would gain us JWT auth, dynamic data from Postgres, and middleware — none of which add value for a public sales demo.

## GitHub Organization & Repository Setup

This repo already exists at `github.com/codeledger-demo/demo-dashboard` as **public** (required for free GitHub Pages). If you're setting up a fresh instance:

```bash
gh repo create codeledger-demo/demo-dashboard \
  --public \
  --description "Prospect-facing dashboard for the CodeLedger demo"

cd /path/to/demo-dashboard
git remote add origin git@github.com:codeledger-demo/demo-dashboard.git
git branch -M main
git push -u origin main
```

Then enable Pages:

```bash
gh api -X POST /repos/codeledger-demo/demo-dashboard/pages -f 'build_type=workflow'
```

On the next push, `deploy-pages.yml` runs and publishes.

## Custom Domain (optional)

If you're setting up a fresh custom domain (not the existing `demo.codeledger.dev`):

### Option A — GitHub Pages directly

1. Create `public/CNAME` containing your domain, e.g. `demo.yourcompany.com`
2. Drop `NEXT_PUBLIC_BASE_PATH` from the workflow (assets need to resolve at root, not at `/demo-dashboard/`)
3. Add a `CNAME` DNS record at your DNS provider: `demo` → `codeledger-demo.github.io`
4. Register the custom domain on the GitHub side:
   ```bash
   gh api -X PUT /repos/codeledger-demo/demo-dashboard/pages -f 'cname=demo.yourcompany.com'
   ```
5. Wait ~5 min for DNS propagation + SSL provisioning

### Option B — Via an intermediate host (like the current Lovable setup)

1. Point your DNS at the intermediate host (Lovable, Cloudflare Worker, Netlify, etc.)
2. That host does a client-side or HTTP-level redirect to `codeledger-demo.github.io/demo-dashboard/`
3. Preserves the branded URL for marketing purposes while the actual content stays on GitHub Pages

Option B is what's in place today (`demo.codeledger.dev` → Lovable → GitHub Pages).

## Bot Accounts (Not Required for the Dashboard)

Unlike `acme-platform`, the dashboard does NOT need the three bot persona accounts (Sara/Marcus/Priya). Those are only used by `synthetic-reality-engine` to author commits and PRs. The dashboard reads their generated CIC results out of fixtures — it doesn't write back to GitHub.

## GitHub Actions Secrets

The deploy workflow does NOT require any secrets beyond the built-in `GITHUB_TOKEN` (which GitHub provisions automatically for Pages deploys). No PATs, no database URL, no JWT secret — the build is pure and hermetic.

## Environment Variables Reference

| Variable | Used where | Purpose |
|----------|-----------|---------|
| `NEXT_PUBLIC_BASE_PATH` | Build time (CI) | `/demo-dashboard` when targeting github.io, empty when targeting a custom domain at root |
| `DATABASE_URL` | Local dev only | Enables live Postgres mode. Never set in production. |

## Troubleshooting

**Pages build succeeds but routes 404**: Check `trailingSlash: true` is set in `next.config.mjs`. Without it, GitHub Pages serves `team-health.html` but not `team-health/` and internal links break.

**Assets 404 after switching between github.io and custom domain**: `basePath` must match the deployment target. Set `NEXT_PUBLIC_BASE_PATH=/demo-dashboard` for github.io, leave unset for a root-served custom domain.

**Tests pass locally but CI fails**: Check that `pnpm-lock.yaml` is committed and up to date (`pnpm install --frozen-lockfile` enforces it).

**Custom domain works but shows `codeledger-demo.github.io` in the URL bar after a redirect**: That's expected if you're using the Lovable intermediate-host approach. The only way to keep the branded URL in the bar for the entire session is a reverse proxy (Cloudflare Worker) or deploying the static assets directly to the custom domain's origin.

## Related

- [`acme-platform/SETUP.md`](https://github.com/codeledger-demo/acme-platform/blob/main/SETUP.md) — target repo deployment
- [`synthetic-reality-engine/SETUP.md`](https://github.com/codeledger-demo/synthetic-reality-engine/blob/main/SETUP.md) — simulator + bootstrap
