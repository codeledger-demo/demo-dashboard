# CodeLedger Living Demo — Go-to-Market Brief

> Internal document for the sales team. Do not share externally.
> Last updated: April 8, 2026 (v0.9.2 feature integration complete)

## What the demo is

Three repositories on GitHub hosting a **live, cron-driven simulation** of an engineering team that CodeLedger has been watching for months. Prospects can see the raw git history, read real PR comments, and explore a full dashboard visualization without any sandbox setup.

| Component | URL | Visibility |
|-----------|-----|-----------|
| Synthetic team's repo | https://github.com/codeledger-demo/acme-platform | **Public** |
| Commit engine | https://github.com/codeledger-demo/synthetic-reality-engine | Private |
| Dashboard | https://demo.codeledger.dev *(not deployed yet)* | Private repo at github.com/codeledger-demo/demo-dashboard |

## What makes this different from a slide deck

1. **Real git activity.** Every weekday, 4 times a day, the simulator fires a scenario from a YAML library. Commits land, PRs open, reviews get posted, merges happen. Prospects who check in a week later see new activity.
2. **Three distinct personas** with distinct failure modes:
   - **Sara Chen** (senior) — clean work, mentors, reviews thoroughly
   - **Marcus Webb** (mid) — cuts corners under deadline pressure
   - **Priya K** (junior, heavy AI completion user) — the source of the biggest incidents and the clearest improvement arc
3. **A narrative.** Six story arcs spanning onboarding → sprint debt → an AI-caused auth incident → team reckoning → recovery → a clean release. Prospects don't watch a demo, they read a story.
4. **An open 7th arc** for the latest CodeLedger features. When v0.9.2 shipped, we added Arc 7 showcase scenarios for Semantic Fortress, Change Capsule, Golden Patterns, and Fleet risk spikes — each with its own dedicated PR on acme-platform.

## What to send a prospect

### Cold outbound / first touch

Send this link: **https://github.com/codeledger-demo/acme-platform**

The first thing they see is the README with:
- A "First time here?" banner pointing to the 8-minute Prospect Guide
- The auto-updating Drama Feed showing current arc, team health, recent headlines
- A link to demo.codeledger.dev

Subject line ideas:
- "Here's an engineering team CodeLedger has been watching for 10 months"
- "A live demo that updates every day (not a 45-minute Zoom call)"
- "What would CodeLedger catch in your codebase? Here's what it caught in ours."

### After a qualifying call

Generate an invite link for demo.codeledger.dev with a 7 or 14 day expiry (CLI snippet in `demo-dashboard/SETUP.md` under "Generating Invite Tokens"). Send it along with:

- Link to the acme-platform repo (so they can cross-reference the dashboard against raw git data)
- Link to the Prospect Guide if they haven't seen it
- **Your direct calendar link** for a follow-up walkthrough

### Live walkthrough (30 minutes)

Recommended structure, timed:

| Time | What | Why |
|------|------|-----|
| 0:00 | Open acme-platform README, scroll to Drama Feed | Shows it's live, unsimulated |
| 2:00 | Open a recent PR authored by Priya K | Shows real CIC output on a real PR |
| 5:00 | Dashboard → Team Health | Shows who's on the team and current state |
| 8:00 | Dashboard → Time Horizon Analytics (the flagship) | Click 30 → 60 → 90 → 1yr. Watch every panel change. |
| 14:00 | Dashboard → Named Incidents → The Auth Incident | The scenario that sells the product. |
| 19:00 | Dashboard → Fleet Insights (Enterprise tier) | For enterprise prospects only — cross-repo view |
| 22:00 | Dashboard → Sandbox Lane | Let them pick a scenario and run it live |
| 26:00 | Q&A | Expected questions in the FAQ below |
| 30:00 | Close — "would you like to try it on your own repo?" |

## FAQ — what prospects actually ask

### "Is this real?"
Yes. The commits, PRs, and CIC output are all real — they come from running the actual `codeledger` CLI against the synthetic repo in CI. The *scenarios* (which files get touched, what the PR title is, who the author is) are scripted via YAML, but the CodeLedger evaluation of those scenarios is real product output.

When the CLI is not yet published to npm, the PR Check workflow runs in "stub mode" and posts a clearly-labeled placeholder comment instead. The stub mode automatically disappears when the CLI ships.

### "Could I run this on my own repo?"
Yes, that's the whole point of CodeLedger. The product itself is at `github.com/codeledgerECF/codeledger-blackbox`. This demo exists so prospects can see what they'd get before they install.

### "How is this different from Sonar / CodeClimate / Snyk?"
Those tools score code statically. CodeLedger scores *changes* against the history of the specific repo. Every scoring decision is deterministic (no LLM in the hot path), explainable (pure-function source lives at `packages/engine/src/graph/calculators.ts`), and compounds over time (memory ledger drives future decisions).

### "Does it use GPT / Claude?"
Not in the hot path. There is no model in any scoring decision. LLMs are what the developer uses to write code; CodeLedger is the verification layer that runs after.

### "How often does the demo update?"
4x/day on weekdays (9am, 11am, 2pm, 4pm Pacific) via GitHub Actions cron. Plus whenever sales manually fires a scenario for a walkthrough.

### "Can I see the simulator source?"
The simulator is in a private repo. Offer read access after they're a qualified lead. Don't hide it — transparency sells the demo.

### "How do I know this isn't just a recording?"
Tell them to pick a timestamp in the future (e.g., tomorrow 10am) and check back. They'll see new activity that wasn't there before. Or open the repo and show them the `Simulate Activity` workflow runs in the Actions tab.

### "What's Arc 7 and why does it have different scenarios?"
Arc 7 is the Feature Showcase arc. When CodeLedger ships a new feature, we add a scenario there to demonstrate it. It's a side-story arc that doesn't participate in the main 6-arc cycle. Prospects evaluating a specific feature can be pointed directly at the matching Arc 7 scenario.

Current Arc 7 scenarios (as of v0.9.2):
- 100: Semantic Fortress blocks an intent-lock violation
- 101: Change Capsule recommends `expand_context`
- 102: Change Capsule blocks a critical-CRS change
- 103: Golden Pattern surfaced by Prompt Coach
- 104: Fleet risk spike alert

## Firing scenarios manually during a call

Sales reps can trigger scenarios live via the `Manual Simulation` workflow:

```bash
# Requires the sales rep to be added to the codeledger-demo org
gh workflow run 'Manual Simulation' \
  --repo codeledger-demo/synthetic-reality-engine \
  -f scenario_id=arc7-100-semantic-fortress-block
```

The scenario completes in ~20 seconds and opens a PR on acme-platform that the prospect can click into immediately. Use this for "let me show you what would happen if..." moments in a walkthrough.

Top scenarios to fire live:

| Scenario ID | Why |
|-------------|-----|
| `arc7-100-semantic-fortress-block` | Shows Semantic Fortress catching an intent-lock violation |
| `arc7-102-change-capsule-block` | Change Capsule blocks a risky auth change with CRS 0.81 |
| `arc7-103-golden-pattern-match` | Prompt Coach surfaces an institutional pattern |
| `arc3-031-ai-generated-refactor` | THE Auth Incident — AI refactor produces ghost file |

## Dashboard invite generation

```bash
cd /path/to/demo-dashboard
npx tsx scripts/generate-invite.ts \
  --email "prospect@company.com" \
  --days 14 \
  --scope read-only
```

(Script not yet written — see `demo-dashboard/SETUP.md` for the one-liner to do this manually via `createInviteToken` in the REPL.)

## Known rough edges (what to not show)

Things still under construction — skip these in walkthroughs until they're fixed:

- **Dashboard is not yet deployed** to `demo.codeledger.dev`. Run it locally for walkthroughs (`pnpm dev` in `demo-dashboard`). Deployment is follow-up work.
- **Fixture mode vs live mode**: when running the dashboard locally without `DATABASE_URL`, all data comes from fixtures and is identical every refresh. Live mode (with Postgres) pulls from the SRE state file. The fallback is honest but subtle — mention it if a technical prospect asks why the numbers don't change.
- **The `codeledger-pr.yml` PR check is in stub mode** because the CLI isn't on npm. PR comments currently say "stub mode" — this automatically goes away when the CLI ships. Preempt the question: "when the CodeLedger CLI ships, this comment becomes a real CIC result automatically — no workflow edits needed."
- **Sara's scorecard reads 0% CIC pass rate** in the Drama Feed scorecard table. This is because the scorecard counts PR events from the *timeline* (100 most recent), and the timeline is only populated from events the state file has saved — which started working late on April 8. Historical PRs aren't retroactively scored. The scorecard fills in as new scenarios fire.
- **Orphan PR #1** on acme-platform is closed-but-not-merged (from a failed first run before labels were auto-created). It's there by design — showing that even we had a rough first run. Don't explicitly mention it unless asked.

## What to do when CodeLedger ships v0.9.3

1. Read the CodeLedger release notes.
2. Follow `synthetic-reality-engine/SYNC_CHECKLIST.md` — it has routine playbooks for behavior changes (§A), schema changes (§B), new CLI commands (§C), and new dashboard surfaces (§D).
3. Add new Arc 7 scenarios at sequences 105+ for any feature that warrants demo coverage.
4. Run the contract test (`pnpm contract:test` in the SRE repo) — it pins real CodeLedger output shapes against the test fixtures.
5. Fire one or two of the new Arc 7 scenarios manually to verify they work end-to-end.
6. Update the "Current Arc 7 scenarios" table in this file.

## Contact

- **Demo ops / repo access**: Ash Seddeek (ash@intelligentcontext.ai)
- **Sales assets**: [folder link]
- **Product questions**: #codeledger on Slack

---

*Intelligent Context AI Inc. · Confidential · Internal use only*
