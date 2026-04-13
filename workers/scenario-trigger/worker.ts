/**
 * Cloudflare Worker: Scenario Trigger Proxy
 *
 * Proxies scenario dispatch requests to the SRE GitHub Actions workflow.
 * Keeps the GitHub PAT server-side. Rate-limited to 1 request per 60s per IP.
 *
 * Deploy: wrangler deploy
 * Env vars: GITHUB_PAT (secret)
 */

interface Env {
  GITHUB_PAT: string;
}

const ALLOWED_SCENARIOS = new Set([
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
]);

const ALLOWED_ORIGINS = new Set([
  'https://demo.codeledger.dev',
  'https://codeledger-demo.github.io',
  'http://localhost:3000',
]);

// Simple in-memory rate limiter (per-isolate, resets on cold start — good enough)
const lastFired = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

function corsHeaders(origin: string): HeadersInit {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : '';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // Rate limit by IP
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const now = Date.now();
    const last = lastFired.get(ip) || 0;
    if (now - last < RATE_LIMIT_MS) {
      const retryAfter = Math.ceil((RATE_LIMIT_MS - (now - last)) / 1000);
      return new Response(
        JSON.stringify({ error: 'Rate limited', retry_after_seconds: retryAfter }),
        {
          status: 429,
          headers: { ...cors, 'Content-Type': 'application/json', 'Retry-After': String(retryAfter) },
        },
      );
    }

    // Parse request
    let scenarioId: string;
    try {
      const body = (await request.json()) as { scenario_id?: string };
      scenarioId = body.scenario_id || '';
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // Validate scenario
    if (!ALLOWED_SCENARIOS.has(scenarioId)) {
      return new Response(
        JSON.stringify({ error: 'Unknown scenario', allowed: [...ALLOWED_SCENARIOS] }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } },
      );
    }

    // Dispatch to GitHub
    const ghRes = await fetch(
      'https://api.github.com/repos/codeledger-demo/synthetic-reality-engine/dispatches',
      {
        method: 'POST',
        headers: {
          Authorization: `token ${env.GITHUB_PAT}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'codeledger-scenario-trigger/1.0',
        },
        body: JSON.stringify({
          event_type: 'fire-scenario',
          client_payload: { scenario_id: scenarioId },
        }),
      },
    );

    // Record rate limit
    lastFired.set(ip, now);

    if (ghRes.status === 204) {
      return new Response(
        JSON.stringify({ dispatched: true, scenario_id: scenarioId }),
        { status: 202, headers: { ...cors, 'Content-Type': 'application/json' } },
      );
    }

    const ghBody = await ghRes.text();
    return new Response(
      JSON.stringify({ error: 'GitHub dispatch failed', status: ghRes.status, details: ghBody }),
      { status: 502, headers: { ...cors, 'Content-Type': 'application/json' } },
    );
  },
};
