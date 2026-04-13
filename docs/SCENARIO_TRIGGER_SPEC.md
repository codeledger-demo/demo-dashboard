# Scenario Trigger API

Serverless function that proxies scenario dispatch requests to the SRE GitHub Actions workflow. Keeps the GitHub PAT server-side.

## Endpoint

```
POST /api/fire-scenario
```

## Request

```json
{
  "scenario_id": "arc7-105-golden-pattern-promotion"
}
```

## Response

- `202 Accepted` — dispatched successfully
- `400 Bad Request` — invalid or unrecognized scenario_id
- `429 Too Many Requests` — rate limited (1 per 60s per IP)

## Implementation

Deploy as a Cloudflare Worker, Vercel Edge Function, or AWS Lambda:

```typescript
export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const { scenario_id } = await req.json();

  // Validate against allowlist
  const ALLOWED = [
    'arc7-100-semantic-fortress-block',
    'arc7-101-change-capsule-expand',
    'arc7-102-change-capsule-block',
    'arc7-103-golden-pattern-match',
    'arc7-104-fleet-risk-spike',
    'arc7-105-golden-pattern-promotion',
    'arc7-106-golden-pattern-coach-reference',
    'arc7-107-truth-control-plane-loop',
    'arc7-108-phase2-explain-post-incident',
    'arc7-109-coach-implementation-plan',
  ];

  if (!ALLOWED.includes(scenario_id)) {
    return new Response(JSON.stringify({ error: 'Unknown scenario' }), { status: 400 });
  }

  // Dispatch to SRE
  const res = await fetch(
    'https://api.github.com/repos/codeledger-demo/synthetic-reality-engine/dispatches',
    {
      method: 'POST',
      headers: {
        Authorization: `token ${process.env.GITHUB_PAT}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'fire-scenario',
        client_payload: { scenario_id },
      }),
    },
  );

  if (res.status === 204) {
    return new Response(JSON.stringify({ dispatched: true, scenario_id }), { status: 202 });
  }

  return new Response(JSON.stringify({ error: 'Dispatch failed', status: res.status }), { status: 502 });
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_PAT` | Personal access token with `repo` scope on `codeledger-demo` org |

## Security

- PAT never exposed to the client
- Scenario allowlist prevents arbitrary dispatches
- Rate limit: 1 request per 60 seconds per IP
- CORS: restrict to `demo.codeledger.dev` origin

## Dashboard Integration

Set `window.__SCENARIO_TRIGGER_URL__` to the deployed endpoint URL. The trigger page at `/trigger` reads this at runtime. Without it, the page shows a "connect API" message.

For static builds, inject via a script tag in `layout.tsx` or via environment variable at build time.
