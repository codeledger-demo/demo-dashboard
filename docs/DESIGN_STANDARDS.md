# Demo Dashboard — Design Standards

## This Is the Flagship

This repo powers demo.codeledger.dev — the first thing prospects see.
Visual quality is non-negotiable. Every page must feel polished, calm, and credible.

## Architecture

- **Framework:** Next.js 14 with static export (`output: 'export'`)
- **Styling:** Tailwind CSS — no inline styles, no CSS-in-JS
- **Components:** Reusable components in `src/components/` — always reuse before creating
- **Data:** Fixture mode (no `DATABASE_URL`) returns synthetic demo data from `src/lib/api/fixtures.ts`
- **Deployment:** GitHub Pages via `pnpm build` -> static `out/` directory

## Two Rendering Implementations — By Design

| Target | Rendering | Repo |
|--------|-----------|------|
| demo.codeledger.dev | Next.js + Tailwind (this repo) | demo-dashboard |
| `codeledger insight serve` | React SSR with inline styles | codeledger-blackbox/packages/insight-ui |
| `codeledger dashboard build` | Same SSR, static HTML | codeledger-blackbox/packages/insight-ui |

Same product logic, same data pipeline, same metrics. Different rendering quality.
The demo gets flagship polish. The customer CLI gets functional rendering.

**Do NOT replace this repo's Next.js rendering with SSR static HTML.**
We tried this on 2026-04-15. It lost visual depth, shadows, border warmth, and polish.
The revert is documented in the git history.

## Design Rules

- **Shadows:** Use `shadow-sm` or `shadow-md` on cards. Never flat/shadowless.
- **Border radius:** `rounded-xl` (12px) for cards. `rounded-lg` (8px) for pills/badges.
- **Borders:** `border-stone-200` (warm gray). Never cold gray (`#e7e5e4`).
- **Backgrounds:** `bg-surface-card` (`#ffffff`) for cards, `bg-surface-bg` (`#fafaf9`) for page.
- **Typography:** Serif (`font-serif`) for headings. Sans (`font-sans`) for body. Mono for metrics.
- **Colors:** `brand-primary` (`#0b6e4f`) for positive. `semantic-warning` (`#bc6c25`) for caution. `semantic-error` (`#a23b2a`) for critical.
- **Spacing:** Generous. `p-5` or `p-6` for card padding. `space-y-8` between sections.
- **Progressive disclosure:** Use fewer sections per page. Collapse detail behind interaction. Less is more.

## When Adding New Pages

1. Create page in `src/app/(dashboard)/[new-page]/page.tsx`
2. Add to sidebar in `src/components/shell/Sidebar.tsx`
3. Add fixture data to `src/lib/api/fixtures.ts` plus query to `timeline-queries.ts`
4. Reuse existing components from `src/components/shared/`
5. Match the visual quality of Team Health and Integrity pages
6. Test: `pnpm build` must pass with zero errors

## When Modifying Existing Pages

- Do not flatten shadows or reduce border radius
- Do not replace Tailwind classes with inline styles
- Do not add more than 5 sections visible on first load
- Keep the "less is more" principle — collapse detail, show summaries
