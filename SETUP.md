# Demo Dashboard — Deployment Setup

This document covers running the dashboard locally with a real Postgres backend, and the steps to publish it as a private GitHub repository under `codeledger-demo`.

## Prerequisites

- Docker Desktop installed (for local Postgres)
- Node 20+ and pnpm
- The `synthetic-reality-engine` repo cloned alongside this one

## Local Development (Fixture Mode)

The simplest path — no infrastructure required. Fixtures are baked in.

```bash
pnpm install
pnpm dev
# Open http://localhost:3000
```

The dashboard renders all 11 routes against `src/lib/api/fixtures.ts`. Useful for UI work, screenshots, and offline demos.

## Local Development (Live Postgres Mode)

When you want to test the live data path end-to-end:

### 1. Start Postgres

```bash
pnpm db:up
# Postgres listening on localhost:5433
# Schema auto-applied from src/lib/db/schema.sql on first boot
```

### 2. Bootstrap demo data

In the `synthetic-reality-engine` repo:

```bash
cd ../synthetic-reality-engine
pnpm bootstrap:seed
# Writes 60 scenarios → .bootstrap-output/
```

### 3. Sync to Postgres

```bash
cd ../demo-dashboard
DATABASE_URL=postgres://demo:demo@localhost:5433/demo_dashboard \
  pnpm db:sync --data-dir ../synthetic-reality-engine/.bootstrap-output
# Should report:
#   cic_history: 55 inserted
#   release_history: 3 inserted
#   lessons: 3 inserted
```

### 4. Run dev server in live mode

```bash
DATABASE_URL=postgres://demo:demo@localhost:5433/demo_dashboard pnpm dev
```

Now `team-health`, `cic-history`, `lessons`, `release-gates` query Postgres instead of fixtures. The other 4 pages (time-horizon, drift-map, incidents, sandbox) still use fixtures because their data shapes don't have a `live mode` schema yet — `getTimeHorizonData()` etc. throw `not yet implemented in live mode` when `DATABASE_URL` is set, so those pages will error in live mode until the schemas are added.

Alternatively, leave `DATABASE_URL` unset for those routes (they'll fall back to fixtures).

### 5. Tear down

```bash
pnpm db:down       # Stop container, keep volume
pnpm db:reset      # Stop container AND drop volume (clean slate)
```

## Testing

```bash
pnpm test          # Vitest: 22 tests across fixtures, queries, JWT
pnpm typecheck     # TypeScript strict
pnpm build         # Next.js production build
```

## Production Deployment (without Vercel)

Per project decision, Vercel is excluded. Options for hosting:

### Option A: Self-hosted with Docker

```bash
pnpm build
# Build a Docker image with the .next standalone output, run anywhere
```

### Option B: Cloudflare Pages

Cloudflare Pages supports Next.js via the `@cloudflare/next-on-pages` adapter. You'll need to:
1. Add the adapter to package.json
2. Configure the build command to use it
3. Set environment variables in the Pages dashboard

### Option C: Render / Railway / Fly

Any platform that runs Node and exposes a Postgres add-on works:
1. Provision Postgres (use connection string as `DATABASE_URL`)
2. Run `pnpm build && pnpm start`
3. Schedule a periodic sync from acme-platform's `.codeledger/` data

## Environment Variables (Production)

| Variable | Required | Purpose |
|----------|----------|---------|
| `DASHBOARD_JWT_SECRET` | Yes | Signs invite link JWTs (HS256). Min 32 chars. |
| `DATABASE_URL` | If using live mode | Postgres connection string |
| `NEXT_PUBLIC_BASE_URL` | No | For absolute invite link generation, e.g. `https://demo.codeledger.dev` |

## GitHub Repository Setup

```bash
gh repo create codeledger-demo/demo-dashboard \
  --private \
  --description "Prospect-facing dashboard for the CodeLedger demo"

cd /path/to/demo-dashboard
git remote add origin git@github.com:codeledger-demo/demo-dashboard.git
git branch -M main
git push -u origin main
```

Repository should be **private** — invite tokens are issued out-of-band.

## Generating Invite Tokens

The `createInviteToken` function in `src/lib/auth/jwt.ts` produces signed JWTs. Build a one-off script or REST endpoint to generate them:

```typescript
import { createInviteToken } from '@/lib/auth/jwt';

const token = await createInviteToken({
  sub: 'prospect-viewer',
  email: 'cto@prospect.com',
  scope: 'read-only',
  expiresInDays: 14,
});

console.log(`https://demo.codeledger.dev/invite/${token}`);
```

## Data Sync Schedule (Production)

The recommended schedule for syncing acme-platform's CodeLedger output into the dashboard's Postgres:

- **GitHub Actions cron** in `acme-platform`: dump `.codeledger/` data to a JSON artifact every hour
- **Webhook from acme-platform** to a sync endpoint: pull the artifact and run `ecl-sync.ts`

Or simpler: a cron-based GitHub Action in this repo that checks out acme-platform and runs `pnpm db:sync` directly. See `synthetic-reality-engine/SETUP.md` for the bootstrap command.

## Troubleshooting

**`getDb()` fails with `DATABASE_URL is not set`**: Either set the env var or remove it to fall back to fixture mode.

**`column "completion_state" does not exist`**: Schema may not have applied. Run `pnpm db:reset` to recreate the volume.

**Page errors in live mode for time-horizon/drift-map/incidents/sandbox**: Expected — those query functions throw `not yet implemented in live mode` because their schemas aren't migrated yet. Use fixture mode for those routes or extend the sync layer.

**Middleware redirect loop**: Check `DASHBOARD_JWT_SECRET` is set in production. The middleware uses a per-boot random fallback when the secret is missing, which causes all tokens to fail verification.

## Related

- `acme-platform/SETUP.md` — target repo deployment
- `synthetic-reality-engine/SETUP.md` — simulator + bootstrap
