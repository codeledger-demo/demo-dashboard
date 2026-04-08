/**
 * Demo fixtures — returned by timeline-queries.ts when DATABASE_URL is not set.
 *
 * These values match the PRD story arcs and personas. They let the dashboard
 * render a coherent demo without a live PostgreSQL connection.
 *
 * When DATABASE_URL is set, timeline-queries.ts bypasses these fixtures and
 * issues real queries instead.
 */

import type {
  CICEntry,
  ReleaseEntry,
  LessonEntry,
  PersonaMetrics,
  DashboardMetric,
} from '@/types/dashboard';

export function isLiveMode(): boolean {
  return typeof process.env.DATABASE_URL === 'string' && process.env.DATABASE_URL.length > 0;
}

export const FIXTURE_CIC_HISTORY: readonly CICEntry[] = [
  {
    id: 'cic-001',
    checkedAt: '2026-03-04T10:15:00Z',
    task: 'feat(analytics): webhook analytics module with tests',
    completionState: 'release_safe',
    claimCount: 18,
    verifiedClaimCount: 18,
    mismatchCount: 0,
    driftWarningCount: 0,
    persona: 'sara-chen',
    prNumber: 284,
  },
  {
    id: 'cic-002',
    checkedAt: '2026-03-03T14:22:00Z',
    task: 'feat(billing): analytics extension on AnalyticsCollector',
    completionState: 'verified',
    claimCount: 12,
    verifiedClaimCount: 12,
    mismatchCount: 0,
    driftWarningCount: 0,
    persona: 'marcus-webb',
    prNumber: 283,
  },
  {
    id: 'cic-003',
    checkedAt: '2026-03-02T11:40:00Z',
    task: 'test(webhooks): comprehensive analytics test coverage',
    completionState: 'verified',
    claimCount: 9,
    verifiedClaimCount: 9,
    mismatchCount: 0,
    driftWarningCount: 0,
    persona: 'priya-k',
    prNumber: 281,
  },
  {
    id: 'cic-004',
    checkedAt: '2026-02-15T09:10:00Z',
    task: 'refactor(billing): align with established patterns',
    completionState: 'verified',
    claimCount: 11,
    verifiedClaimCount: 11,
    mismatchCount: 0,
    driftWarningCount: 1,
    persona: 'sara-chen',
    prNumber: 267,
  },
  {
    id: 'cic-005',
    checkedAt: '2026-02-10T16:45:00Z',
    task: 'feat(notifications): password reset email template',
    completionState: 'verified',
    claimCount: 7,
    verifiedClaimCount: 7,
    mismatchCount: 0,
    driftWarningCount: 0,
    persona: 'priya-k',
    prNumber: 259,
  },
  {
    id: 'cic-006',
    checkedAt: '2026-01-25T14:30:00Z',
    task: 'refactor(auth): AI-generated JWT verification rewrite',
    completionState: 'incomplete',
    claimCount: 8,
    verifiedClaimCount: 3,
    mismatchCount: 1,
    driftWarningCount: 2,
    persona: 'priya-k',
    prNumber: 218,
  },
  {
    id: 'cic-007',
    checkedAt: '2026-01-22T15:20:00Z',
    task: 'fix(billing): quick retry logic patch',
    completionState: 'edited',
    claimCount: 5,
    verifiedClaimCount: 3,
    mismatchCount: 0,
    driftWarningCount: 1,
    persona: 'marcus-webb',
    prNumber: 211,
  },
  {
    id: 'cic-008',
    checkedAt: '2026-01-18T11:15:00Z',
    task: 'feat(notifications): Slack channel integration',
    completionState: 'release_safe',
    claimCount: 14,
    verifiedClaimCount: 14,
    mismatchCount: 0,
    driftWarningCount: 0,
    persona: 'sara-chen',
    prNumber: 198,
  },
];

export const FIXTURE_RELEASE_HISTORY: readonly ReleaseEntry[] = [
  {
    id: 'rel-006',
    checkedAt: '2026-03-04T12:00:00Z',
    releaseState: 'ready_hardened',
    confidenceScore: 0.97,
    findingCount: 0,
    p0Count: 0,
    p1Count: 0,
    versionTag: 'v2.4.1',
  },
  {
    id: 'rel-005',
    checkedAt: '2026-02-20T09:30:00Z',
    releaseState: 'ready',
    confidenceScore: 0.92,
    findingCount: 0,
    p0Count: 0,
    p1Count: 0,
    versionTag: 'v2.4.1-rc1',
  },
  {
    id: 'rel-004',
    checkedAt: '2026-02-12T14:15:00Z',
    releaseState: 'ready',
    confidenceScore: 0.89,
    findingCount: 0,
    p0Count: 0,
    p1Count: 0,
    versionTag: 'v2.4.0',
  },
  {
    id: 'rel-003',
    checkedAt: '2026-02-05T10:00:00Z',
    releaseState: 'ready_conditional',
    confidenceScore: 0.81,
    findingCount: 1,
    p0Count: 0,
    p1Count: 1,
    versionTag: 'v2.4.0-rc1',
  },
  {
    id: 'rel-002',
    checkedAt: '2026-01-28T16:45:00Z',
    releaseState: 'ready_conditional',
    confidenceScore: 0.72,
    findingCount: 2,
    p0Count: 0,
    p1Count: 2,
    versionTag: 'v2.3.9-hotfix',
  },
  {
    id: 'rel-001',
    checkedAt: '2026-01-25T18:00:00Z',
    releaseState: 'not_ready',
    confidenceScore: 0.34,
    findingCount: 5,
    p0Count: 2,
    p1Count: 3,
    versionTag: 'v2.3.8',
  },
];

export const FIXTURE_LESSONS: readonly LessonEntry[] = [
  {
    id: 'lesson-auth-ghost-files',
    title: 'AI refactors in auth require integration test coverage',
    summary:
      'Ghost files introduced by AI refactors can silently remove critical validation. All auth middleware changes must include integration tests covering all validation paths.',
    category: 'auth-incident',
    severity: 'high',
    triggerCount: 3,
    firstSeen: '2026-01-25T14:30:00Z',
    lastTriggered: '2026-02-05T10:15:00Z',
    active: true,
  },
  {
    id: 'lesson-sprint-debt-pattern',
    title: 'Sprint deadline shortcuts accumulate CIC warnings',
    summary:
      'Silent WARN accumulation across multiple PRs in the same service is a leading indicator of architecture drift. Weekly WARN count reviews should be mandatory.',
    category: 'sprint-debt',
    severity: 'medium',
    triggerCount: 5,
    firstSeen: '2026-02-01T09:00:00Z',
    lastTriggered: '2026-02-15T11:30:00Z',
    active: true,
  },
  {
    id: 'lesson-ghost-file-detection',
    title: 'Ghost files must be detected before merge',
    summary:
      'Files created by AI refactors but not imported anywhere should block the PR at review time, not at release time.',
    category: 'auth-incident',
    severity: 'high',
    triggerCount: 2,
    firstSeen: '2026-01-25T14:30:00Z',
    lastTriggered: '2026-01-26T09:00:00Z',
    active: true,
  },
  {
    id: 'lesson-billing-copy-paste',
    title: 'Billing service patterns should not be copy-pasted',
    summary:
      'Duplicated logic across billing-report.ts and churn-report.ts creates maintenance burden. Shared patterns belong in a common module.',
    category: 'code-hygiene',
    severity: 'medium',
    triggerCount: 4,
    firstSeen: '2026-02-02T10:00:00Z',
    lastTriggered: '2026-02-14T15:20:00Z',
    active: true,
  },
  {
    id: 'lesson-webhook-retry-coverage',
    title: 'Webhook retry logic needs test coverage for edge cases',
    summary:
      'Network timeouts, 5xx responses, and deserialization errors all need explicit test coverage. Happy-path-only tests mask production failures.',
    category: 'test-coverage',
    severity: 'low',
    triggerCount: 1,
    firstSeen: '2026-02-03T12:00:00Z',
    lastTriggered: '2026-02-03T12:00:00Z',
    active: true,
  },
  {
    id: 'lesson-hardcoded-secrets',
    title: 'Hardcoded credentials in test files trigger security findings',
    summary:
      'Even in tests, API keys and secrets should come from environment variables or explicit test fixtures.',
    category: 'security',
    severity: 'high',
    triggerCount: 2,
    firstSeen: '2026-02-04T16:00:00Z',
    lastTriggered: '2026-02-10T11:00:00Z',
    active: true,
  },
];

export const FIXTURE_TEAM_HEALTH: DashboardMetric = {
  label: 'Team Health Score',
  value: 84,
  previousValue: 80,
  unit: '/100',
  trend: 'up',
};

export const FIXTURE_PERSONA_METRICS: Record<string, PersonaMetrics> = {
  'sara-chen': {
    id: 'sara-chen',
    name: 'Sara Chen',
    role: 'Senior Engineer',
    emoji: '🟢',
    cicPassRate: 97,
    prCount30d: 12,
    trend: 2,
    lastFailureReason: null,
    lessonsContributed: 0,
  },
  'marcus-webb': {
    id: 'marcus-webb',
    name: 'Marcus Webb',
    role: 'Mid-Level Engineer',
    emoji: '🟡',
    cicPassRate: 76,
    prCount30d: 8,
    trend: -4,
    lastFailureReason: 'CIC WARN: billing drift pattern',
    lessonsContributed: 2,
  },
  'priya-k': {
    id: 'priya-k',
    name: 'Priya K',
    role: 'Junior Engineer',
    emoji: '🔴',
    cicPassRate: 58,
    prCount30d: 6,
    trend: 4,
    lastFailureReason: 'CIC INCOMPLETE: ghost files in auth refactor',
    lessonsContributed: 2,
  },
};

// ---------- Time Horizon ----------

export interface HorizonMetrics {
  cicPassRate: number;
  cicTrend: number[];
  driftSuppressed: number;
  driftTrend: number[];
  lessonsStart: number;
  lessonsEnd: number;
  lessonsTrend: number[];
  releasesTotal: number;
  releasesPass: number;
  releasesBlock: number;
  releasesWarn: number;
  releasesBars: number[];
  healthDelta: number;
  personaScores: Array<{ name: string; start: number; end: number }>;
}

export interface ArcDef {
  name: string;
  startDate: string;
  endDate: string;
}

export interface IncidentMarker {
  date: string;
  name: string;
  severity: string;
}

export const FIXTURE_TIME_HORIZON_METRICS: Record<string, HorizonMetrics> = {
  '30d': {
    cicPassRate: 82,
    cicTrend: [74, 76, 78, 75, 80, 79, 82],
    driftSuppressed: 12,
    driftTrend: [1, 2, 1, 3, 2, 1, 2],
    lessonsStart: 5,
    lessonsEnd: 8,
    lessonsTrend: [5, 5, 6, 6, 7, 7, 8],
    releasesTotal: 2,
    releasesPass: 1,
    releasesBlock: 1,
    releasesWarn: 0,
    releasesBars: [1, 1],
    healthDelta: 4,
    personaScores: [
      { name: 'Sara', start: 94, end: 97 },
      { name: 'Marcus', start: 72, end: 76 },
      { name: 'Priya', start: 54, end: 58 },
    ],
  },
  '60d': {
    cicPassRate: 80,
    cicTrend: [72, 74, 70, 76, 78, 75, 80],
    driftSuppressed: 22,
    driftTrend: [2, 4, 3, 5, 3, 3, 2],
    lessonsStart: 4,
    lessonsEnd: 9,
    lessonsTrend: [4, 5, 6, 7, 7, 8, 9],
    releasesTotal: 4,
    releasesPass: 2,
    releasesBlock: 1,
    releasesWarn: 1,
    releasesBars: [1, 0, 1, 1],
    healthDelta: 1,
    personaScores: [
      { name: 'Sara', start: 92, end: 97 },
      { name: 'Marcus', start: 70, end: 76 },
      { name: 'Priya', start: 48, end: 58 },
    ],
  },
  '90d': {
    cicPassRate: 78,
    cicTrend: [70, 72, 68, 74, 76, 73, 78, 75, 78],
    driftSuppressed: 34,
    driftTrend: [3, 5, 4, 6, 3, 4, 5, 2, 2],
    lessonsStart: 2,
    lessonsEnd: 10,
    lessonsTrend: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    releasesTotal: 5,
    releasesPass: 2,
    releasesBlock: 2,
    releasesWarn: 1,
    releasesBars: [1, 0, 1, 1, 1],
    healthDelta: -2,
    personaScores: [
      { name: 'Sara', start: 90, end: 97 },
      { name: 'Marcus', start: 68, end: 76 },
      { name: 'Priya', start: 42, end: 58 },
    ],
  },
  '1y': {
    cicPassRate: 81,
    cicTrend: [60, 64, 68, 70, 72, 74, 73, 76, 78, 75, 80, 81],
    driftSuppressed: 156,
    driftTrend: [8, 14, 12, 18, 15, 10, 16, 14, 12, 15, 11, 11],
    lessonsStart: 0,
    lessonsEnd: 12,
    lessonsTrend: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12],
    releasesTotal: 18,
    releasesPass: 12,
    releasesBlock: 4,
    releasesWarn: 2,
    releasesBars: [1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
    healthDelta: 8,
    personaScores: [
      { name: 'Sara', start: 82, end: 97 },
      { name: 'Marcus', start: 55, end: 76 },
      { name: 'Priya', start: 30, end: 58 },
    ],
  },
};

export const FIXTURE_TIME_HORIZON_ARCS: ArcDef[] = [
  { name: 'Clean Baseline', startDate: '2026-01-01', endDate: '2026-01-14' },
  { name: 'Sprint Squeeze', startDate: '2026-01-15', endDate: '2026-01-21' },
  { name: 'The Incident', startDate: '2026-01-22', endDate: '2026-01-28' },
  { name: 'The Reckoning', startDate: '2026-01-29', endDate: '2026-02-04' },
  { name: 'Recovery', startDate: '2026-02-05', endDate: '2026-02-18' },
  { name: 'Clean Release', startDate: '2026-02-19', endDate: '2026-03-04' },
];

export const FIXTURE_TIME_HORIZON_INCIDENTS: IncidentMarker[] = [
  { date: '2026-01-25', name: 'Auth Incident', severity: 'critical' },
  { date: '2026-02-01', name: 'Sprint Debt', severity: 'high' },
  { date: '2026-03-01', name: 'Clean Release', severity: 'low' },
];

// ---------- Drift Map ----------

export interface DriftServiceNode {
  id: string;
  name: string;
  fileCount: number;
  driftLevel: 'low' | 'medium' | 'high';
  cicPassRate: number;
  lastCommitPersona: string;
}

export interface DriftServiceEdge {
  from: string;
  to: string;
  label?: string;
}

export const FIXTURE_DRIFT_MAP_NODES: DriftServiceNode[] = [
  { id: 'shared-utils', name: 'shared-utils', fileCount: 22, driftLevel: 'low', cicPassRate: 96, lastCommitPersona: 'Sara Chen' },
  { id: 'auth', name: 'auth', fileCount: 17, driftLevel: 'high', cicPassRate: 72, lastCommitPersona: 'Marcus Webb' },
  { id: 'billing', name: 'billing', fileCount: 14, driftLevel: 'medium', cicPassRate: 78, lastCommitPersona: 'Sara Chen' },
  { id: 'notifications', name: 'notifications', fileCount: 12, driftLevel: 'low', cicPassRate: 94, lastCommitPersona: 'Sara Chen' },
  { id: 'reporting', name: 'reporting', fileCount: 10, driftLevel: 'medium', cicPassRate: 80, lastCommitPersona: 'Priya Kapoor' },
  { id: 'webhooks', name: 'webhooks', fileCount: 10, driftLevel: 'low', cicPassRate: 88, lastCommitPersona: 'Sara Chen' },
];

export const FIXTURE_DRIFT_MAP_EDGES: DriftServiceEdge[] = [
  { from: 'auth', to: 'shared-utils' },
  { from: 'billing', to: 'shared-utils' },
  { from: 'notifications', to: 'shared-utils' },
  { from: 'billing', to: 'auth', label: 'token validation' },
  { from: 'webhooks', to: 'notifications' },
  { from: 'reporting', to: 'billing', label: 'billing queries' },
];

// ---------- Named Incidents ----------

export interface IncidentTimelineEntry {
  date: string;
  title: string;
  description: string;
  feature: string;
  outcome: string;
}

export interface IncidentBeforeAfter {
  label: string;
  before: string;
  after: string;
}

export interface IncidentMoment {
  feature: string;
  outcome: string;
  callout: string;
}

export interface NamedIncident {
  id: string;
  title: string;
  tagline: string;
  arc: number;
  severity: 'critical' | 'high' | 'low';
  date: string;
  resolved: boolean;
  healthImpact: number;
  lessonsCreated: number;
  keyMetric: string;
  narrative: string;
  timeline: IncidentTimelineEntry[];
  beforeAfter: IncidentBeforeAfter[];
  moments: IncidentMoment[];
}

export const FIXTURE_NAMED_INCIDENTS: NamedIncident[] = [
  {
    id: 'the-auth-incident',
    title: 'The Auth Incident',
    tagline: 'AI-generated auth refactor flagged by CIC ghost file detection',
    arc: 3,
    severity: 'critical',
    date: '2026-01-25',
    resolved: true,
    healthImpact: -22,
    lessonsCreated: 2,
    keyMetric: 'Release Authority: BLOCKED',
    narrative:
      'An AI-assisted auth refactor introduced orphaned files that bypassed integration tests. CIC ghost file detection caught the unreferenced modules before merge, but the damage to architecture health was already visible. Release Authority blocked the release, forcing a revert and re-implementation with proper test coverage.',
    timeline: [
      { date: '2026-01-23', title: 'Auth refactor PR opened', description: 'AI-generated refactor of session handling and token refresh modules.', feature: 'CIC', outcome: 'CIC flagged 3 ghost files in the auth module' },
      { date: '2026-01-24', title: 'Ghost files detected', description: 'Unreferenced auth helper modules found by ghost file detection.', feature: 'Ghost Detection', outcome: 'Completion state dropped to incomplete' },
      { date: '2026-01-25', title: 'Release blocked', description: 'Release Authority blocked v2.3.0 due to critical CIC findings.', feature: 'Release Authority', outcome: 'Release state: BLOCKED' },
      { date: '2026-01-27', title: 'Lessons encoded', description: 'Two lessons added to the ledger about AI refactors in auth modules.', feature: 'Lessons Ledger', outcome: 'Lessons les-001 and les-003 created' },
    ],
    beforeAfter: [
      { label: 'Architecture Health', before: '78', after: '56' },
      { label: 'CIC Pass Rate', before: '72%', after: '54%' },
      { label: 'Ghost Files', before: '0', after: '3' },
      { label: 'Release State', before: 'ready', after: 'BLOCKED' },
    ],
    moments: [
      { feature: 'CIC', outcome: 'Detected 3 ghost files in the auth refactor', callout: 'Demo: Show how CIC catches AI-generated orphaned code' },
      { feature: 'Release Authority', outcome: 'Blocked release v2.3.0', callout: 'Demo: Release gate prevents shipping incomplete refactors' },
      { feature: 'Lessons Ledger', outcome: 'Encoded 2 lessons about AI auth refactors', callout: 'Demo: Institutional memory preserves incident learnings' },
    ],
  },
  {
    id: 'the-sprint-debt-event',
    title: 'The Sprint Debt Event',
    tagline: 'Silent WARN accumulation across billing and reporting',
    arc: 4,
    severity: 'high',
    date: '2026-02-01',
    resolved: true,
    healthImpact: -18,
    lessonsCreated: 2,
    keyMetric: '7 consecutive CIC warnings',
    narrative:
      'Sprint deadline pressure led to a series of PRs merged with CIC warnings. Over two weeks, 7 consecutive warnings accumulated across the billing and reporting modules. The compounding drift went unnoticed until architecture health scoring surfaced the pattern, triggering a team retrospective.',
    timeline: [
      { date: '2026-01-20', title: 'Sprint deadline approaches', description: 'Team rushes billing integration PRs to meet sprint commitment.', feature: 'CIC', outcome: 'First CIC warning on billing PR — merged anyway' },
      { date: '2026-01-25', title: 'Warnings compound', description: '4 more PRs merged with CIC warnings in billing and reporting.', feature: 'Drift Monitor', outcome: 'Drift velocity: RISING' },
      { date: '2026-02-01', title: '7th consecutive warning', description: 'Architecture health drops below threshold, triggering intervention.', feature: 'Architecture Health', outcome: 'AHS dropped to 62 (Grade D)' },
      { date: '2026-02-03', title: 'Team retrospective', description: 'Sprint debt patterns identified and two lessons encoded.', feature: 'Lessons Ledger', outcome: 'Lessons les-002 and les-004 created' },
    ],
    beforeAfter: [
      { label: 'CIC Warnings', before: '0', after: '7' },
      { label: 'Architecture Health', before: '80', after: '62' },
      { label: 'Drift Velocity', before: 'LOW', after: 'HIGH' },
      { label: 'Sprint Completion', before: '100%', after: '85%' },
    ],
    moments: [
      { feature: 'CIC', outcome: '7 consecutive warnings across billing and reporting', callout: 'Demo: CIC tracks warning patterns, not just individual checks' },
      { feature: 'Drift Monitor', outcome: 'Drift velocity escalated from LOW to HIGH', callout: 'Demo: Drift detection catches compounding quality erosion' },
      { feature: 'Lessons Ledger', outcome: 'Sprint debt patterns encoded for future prevention', callout: 'Demo: Lessons prevent the same shortcuts from recurring' },
    ],
  },
  {
    id: 'the-priya-turnaround',
    title: 'The Priya Turnaround',
    tagline: 'CIC pass rate climbs from 54% to 71%',
    arc: 5,
    severity: 'low',
    date: '2026-02-10',
    resolved: true,
    healthImpact: 16,
    lessonsCreated: 1,
    keyMetric: 'CIC: 54% → 71%',
    narrative:
      'After the auth incident and sprint debt event, Priya adopted a CIC-first workflow. Her pass rate climbed from 54% to 71% over three weeks as she used lessons from the ledger to avoid known pitfalls. Her improvement inspired similar adoption across the team.',
    timeline: [
      { date: '2026-02-05', title: 'Priya adopts CIC-first workflow', description: 'Begins running CIC checks before opening PRs.', feature: 'CIC', outcome: 'First clean CIC pass in 3 weeks' },
      { date: '2026-02-08', title: 'Lessons ledger consulted', description: 'Priya references auth and sprint debt lessons before billing PR.', feature: 'Lessons Ledger', outcome: 'Avoided known ghost file pattern' },
      { date: '2026-02-10', title: 'Pass rate milestone', description: 'CIC pass rate reaches 71% — up from 54%.', feature: 'Architecture Health', outcome: 'AHS recovered to 78 (Grade C+)' },
    ],
    beforeAfter: [
      { label: 'CIC Pass Rate', before: '54%', after: '71%' },
      { label: 'Architecture Health', before: '62', after: '78' },
      { label: 'PRs with Warnings', before: '46%', after: '29%' },
    ],
    moments: [
      { feature: 'CIC', outcome: 'Pass rate improved 17 percentage points', callout: 'Demo: Individual developer improvement is measurable' },
      { feature: 'Lessons Ledger', outcome: 'Lessons from past incidents prevented repeat mistakes', callout: 'Demo: Institutional memory drives behavior change' },
    ],
  },
  {
    id: 'the-clean-release',
    title: 'The Clean Release',
    tagline: 'v2.4.1 ships clean — first release with zero warnings in 6 weeks',
    arc: 6,
    severity: 'low',
    date: '2026-03-01',
    resolved: true,
    healthImpact: 7,
    lessonsCreated: 0,
    keyMetric: 'Release Authority: ready_hardened',
    narrative:
      'Version 2.4.1 shipped with zero CIC warnings and a ready_hardened release state — the first clean release in six weeks. The improvement was driven by lessons encoded from earlier incidents and the team-wide adoption of CIC-first workflows.',
    timeline: [
      { date: '2026-02-25', title: 'Release candidate prepared', description: 'All PRs for v2.4.1 pass CIC with zero warnings.', feature: 'CIC', outcome: 'Clean CIC: 0 warnings, 0 ghost files' },
      { date: '2026-02-28', title: 'Release Authority check', description: 'Pre-release verification passes all gates.', feature: 'Release Authority', outcome: 'Release state: ready_hardened' },
      { date: '2026-03-01', title: 'v2.4.1 ships', description: 'First clean release in 6 weeks. Zero warnings, zero findings.', feature: 'Architecture Health', outcome: 'AHS: 85 (Grade B)' },
    ],
    beforeAfter: [
      { label: 'CIC Warnings', before: '7', after: '0' },
      { label: 'Release State', before: 'BLOCKED', after: 'ready_hardened' },
      { label: 'Architecture Health', before: '62', after: '85' },
      { label: 'Confidence Score', before: '0.45', after: '0.92' },
    ],
    moments: [
      { feature: 'CIC', outcome: 'Zero warnings across all PRs in the release', callout: 'Demo: Clean releases are the measurable outcome of quality investment' },
      { feature: 'Release Authority', outcome: 'ready_hardened — highest release state', callout: 'Demo: Release Authority confirms the team earned trust back' },
    ],
  },
];

// ---------- Sandbox ----------

export interface SandboxScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'intermediate' | 'advanced';
  expectedOutcome: string;
}

export const FIXTURE_SANDBOX_SCENARIOS: SandboxScenario[] = [
  {
    id: 'ghost-file-detection',
    title: 'Ghost File Detection',
    description: 'An AI-refactored auth module with unreferenced files. Will CIC catch it?',
    difficulty: 'intermediate',
    expectedOutcome: 'incomplete',
  },
  {
    id: 'clean-feature',
    title: 'Clean Feature Ship',
    description: 'A well-tested billing integration. Everything should pass.',
    difficulty: 'easy',
    expectedOutcome: 'verified',
  },
  {
    id: 'release-authority-block',
    title: 'Release Gate Block',
    description: 'A release candidate with P1 findings. Will Release Authority allow it?',
    difficulty: 'advanced',
    expectedOutcome: 'not_ready',
  },
];

export const FIXTURE_HEALTH_SNAPSHOTS = [
  { snapshotAt: '2026-01-01T00:00:00Z', score: 88 },
  { snapshotAt: '2026-01-08T00:00:00Z', score: 87 },
  { snapshotAt: '2026-01-15T00:00:00Z', score: 83 },
  { snapshotAt: '2026-01-22T00:00:00Z', score: 78 },
  { snapshotAt: '2026-01-25T00:00:00Z', score: 72 },
  { snapshotAt: '2026-02-01T00:00:00Z', score: 74 },
  { snapshotAt: '2026-02-08T00:00:00Z', score: 79 },
  { snapshotAt: '2026-02-15T00:00:00Z', score: 82 },
  { snapshotAt: '2026-02-22T00:00:00Z', score: 85 },
  { snapshotAt: '2026-03-01T00:00:00Z', score: 87 },
  { snapshotAt: '2026-03-04T00:00:00Z', score: 84 },
];

// ---------- Fleet (v0.9.2 Enterprise tier) ----------

export interface FleetRepoSummary {
  repoName: string;
  healthScore: number;
  cicPassRate: number;
  releaseTruth24h: { pass: number; warn: number; fail: number };
  releaseTruth7d: { pass: number; warn: number; fail: number };
  riskTrend: 'stable' | 'rising' | 'falling';
}

export interface FleetRiskAlert {
  id: string;
  triggeredAt: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedRepos: string[];
  pattern: string;
  windowComparison: string;
}

export interface FleetData {
  totalRepos: number;
  healthyRepos: number;
  warningRepos: number;
  criticalRepos: number;
  repos: FleetRepoSummary[];
  activeAlerts: FleetRiskAlert[];
  preventedIssuesAcrossFleet: number;
}

export const FIXTURE_FLEET_DATA: FleetData = {
  totalRepos: 5,
  healthyRepos: 3,
  warningRepos: 1,
  criticalRepos: 1,
  preventedIssuesAcrossFleet: 47,
  repos: [
    {
      repoName: 'acme-platform',
      healthScore: 88,
      cicPassRate: 94,
      releaseTruth24h: { pass: 12, warn: 1, fail: 0 },
      releaseTruth7d: { pass: 78, warn: 4, fail: 1 },
      riskTrend: 'stable',
    },
    {
      repoName: 'acme-data-pipeline',
      healthScore: 72,
      cicPassRate: 81,
      releaseTruth24h: { pass: 6, warn: 2, fail: 1 },
      releaseTruth7d: { pass: 38, warn: 9, fail: 3 },
      riskTrend: 'rising',
    },
    {
      repoName: 'acme-mobile',
      healthScore: 85,
      cicPassRate: 90,
      releaseTruth24h: { pass: 8, warn: 0, fail: 0 },
      releaseTruth7d: { pass: 52, warn: 3, fail: 0 },
      riskTrend: 'stable',
    },
    {
      repoName: 'acme-internal-tools',
      healthScore: 58,
      cicPassRate: 68,
      releaseTruth24h: { pass: 3, warn: 2, fail: 3 },
      releaseTruth7d: { pass: 21, warn: 12, fail: 7 },
      riskTrend: 'rising',
    },
    {
      repoName: 'acme-marketing-site',
      healthScore: 91,
      cicPassRate: 96,
      releaseTruth24h: { pass: 5, warn: 0, fail: 0 },
      releaseTruth7d: { pass: 34, warn: 1, fail: 0 },
      riskTrend: 'falling',
    },
  ],
  activeAlerts: [
    {
      id: 'alert-2026-04-08-auth-billing',
      triggeredAt: '2026-04-08T14:22:00Z',
      severity: 'high',
      affectedRepos: ['acme-platform', 'acme-data-pipeline'],
      pattern: '24h failure concentration in auth/billing services',
      windowComparison: '24h: 4 fails | 7d avg: 0.6 fails | 30d avg: 0.3 fails',
    },
    {
      id: 'alert-2026-04-07-test-coverage',
      triggeredAt: '2026-04-07T09:10:00Z',
      severity: 'medium',
      affectedRepos: ['acme-internal-tools'],
      pattern: '7d test coverage decline across reporting modules',
      windowComparison: '7d: -8.4% coverage | 30d avg: -0.9% | 90d avg: +0.2%',
    },
  ],
};
