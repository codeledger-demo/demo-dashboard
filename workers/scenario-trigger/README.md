# Scenario Trigger Worker

Cloudflare Worker that proxies scenario dispatch requests to the SRE.

## Setup

```bash
cd workers/scenario-trigger
npx wrangler login
npx wrangler secret put GITHUB_PAT
# Paste your GitHub PAT with repo scope on codeledger-demo org
```

## Deploy

```bash
npx wrangler deploy
```

This gives you a URL like `https://codeledger-scenario-trigger.<your-account>.workers.dev`.

## Connect to Dashboard

Set the trigger URL in the dashboard. Two options:

**Option A: Build-time (recommended for static export)**

Add to `next.config.mjs`:
```js
env: {
  NEXT_PUBLIC_SCENARIO_TRIGGER_URL: 'https://codeledger-scenario-trigger.<account>.workers.dev',
}
```

Then update `trigger/page.tsx` to read `process.env.NEXT_PUBLIC_SCENARIO_TRIGGER_URL`.

**Option B: Runtime injection**

Add a script tag to `src/app/layout.tsx`:
```html
<script dangerouslySetInnerHTML={{ __html: `window.__SCENARIO_TRIGGER_URL__ = "https://..."` }} />
```

## Test locally

```bash
npx wrangler dev
# Then: curl -X POST http://localhost:8787 -d '{"scenario_id":"arc7-105-golden-pattern-promotion"}'
```

## Security

- GitHub PAT stored as Cloudflare secret (never in code)
- CORS restricted to demo.codeledger.dev + localhost:3000
- Rate limited: 1 request per 60s per IP
- Scenario allowlist: only known IDs accepted
