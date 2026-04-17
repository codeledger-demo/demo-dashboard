export type TimeWindow = '30d' | '60d' | '90d' | '1y' | 'custom';

export interface TimeRange {
  start: Date;
  end: Date;
  window: TimeWindow;
}

export interface DashboardMetric {
  label: string;
  value: number;
  previousValue?: number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
}

export interface PersonaMetrics {
  id: string;
  name: string;
  role: string;
  emoji: string;
  cicPassRate: number;
  prCount30d: number;
  trend: number;
  lastFailureReason: string | null;
  lessonsContributed: number;
  /** Average Completion Ladder step across this engineer's 30d CIC history. */
  avgLadderStep?: number;
  /** Shadow knowledge index — bus-factor proxy [0, 1]. Higher = more concentrated. */
  shadowKnowledgeIndex?: number;
  /** Average hours from CIC failure to clean re-submit for this engineer. */
  avgRemediationHours?: number;
}

export type CompletionState =
  | 'incomplete'
  | 'edited'
  | 'implemented'
  | 'wired'
  | 'verified'
  | 'audited'
  | 'release_safe';

export type ReleaseState =
  | 'not_ready'
  | 'ready_conditional'
  | 'ready'
  | 'ready_hardened';

export interface CICEntry {
  id: string;
  checkedAt: string;
  task: string;
  completionState: CompletionState;
  claimCount: number;
  verifiedClaimCount: number;
  mismatchCount: number;
  driftWarningCount: number;
  persona: string;
  prNumber: number | null;
  /**
   * Completion Ladder step (1-7). 1=incomplete, 7=release_safe. Replaces
   * binary pass/fail thinking with a gradient. Derived from completionState.
   */
  ladderStep?: CompletionLadderStep;
  /**
   * Hours between this failure and a clean re-submit for the same task.
   * Undefined when this row IS the clean submit (not a failure) or when
   * remediation is still pending.
   */
  remediationHours?: number;
  /** Deep-link to the finding detail (or the PR comment). */
  evidenceUrl?: string;
}

export interface ReleaseEntry {
  id: string;
  checkedAt: string;
  releaseState: ReleaseState;
  confidenceScore: number;
  findingCount: number;
  p0Count: number;
  p1Count: number;
  versionTag: string | null;
}

export interface LessonEntry {
  id: string;
  title: string;
  summary: string;
  category: string;
  severity: string;
  triggerCount: number;
  firstSeen: string;
  lastTriggered: string | null;
  active: boolean;
  /** Engineer who encoded the lesson. */
  contributor?: string;
  /**
   * Cumulative count of CIC passes that were guided by this lesson.
   * Different from triggerCount (which counts triggers) — this counts
   * successful preventions.
   */
  activePreventionCount?: number;
  evidenceUrl?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Unified EM Dashboard contracts (from the Complete Product Spec, April 2026)
//
// These types are what the demo fixtures emit TODAY and what the CodeLedger
// product dashboard (`codeledger dashboard build/open/serve`) will emit
// when it's wired to real `.codeledger/` data in Phase 4. Keeping the shapes
// identical means the Phase 4 port is a data-source swap, not a type rewrite.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Confidence level for any metric. Every time-window-dependent number in
 * the dashboard carries one of these, so the UI can distinguish a signal
 * with 87 events behind it from one with 3.
 */
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface ConfidenceAssessment {
  level: ConfidenceLevel;
  /** Number of events the metric was computed from. */
  eventCount: number;
  /** Human-readable explanation of the confidence level. */
  reason: string;
}

/**
 * The four pillars the composite health score decomposes into.
 * Each is a percentage [0, 100]. Matches the Insight cockpit structure.
 */
export interface PillarScores {
  integrity: number;
  quality: number;
  knowledge: number;
  patterns: number;
  /** Composite — weighted average per the engine's scoring rules. */
  composite: number;
  /** Natural-language summary across all pillars. */
  narrative: string;
  confidence: ConfidenceAssessment;
  /** Direction of change vs previous period. */
  trend: 'up' | 'down' | 'flat';
}

/**
 * Completion Ladder step — the 7-stage gradient from Incomplete to
 * Release Safe. Used everywhere pass/fail is reductive.
 */
export type CompletionLadderStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const LADDER_STEP_NAMES: Record<CompletionLadderStep, string> = {
  1: 'Incomplete',
  2: 'Edited',
  3: 'Implemented',
  4: 'Wired',
  5: 'Verified',
  6: 'Audited',
  7: 'Release Safe',
};

/**
 * Map CompletionState → ladder step. This is the canonical mapping
 * that both demo and product use.
 */
export function ladderStepForState(state: CompletionState): CompletionLadderStep {
  const map: Record<CompletionState, CompletionLadderStep> = {
    incomplete: 1,
    edited: 2,
    implemented: 3,
    wired: 4,
    verified: 5,
    audited: 6,
    release_safe: 7,
  };
  return map[state];
}

/**
 * Value Cockpit — the dollar estimate with full derivation. This is the
 * number that survives procurement review, so the structure has to show
 * the math, not just the answer.
 */
export interface ValueBreakdown {
  /** Computed headline, e.g. $14,058 */
  totalEstimate: number;
  currency: string;
  /** Change vs the previous 7d window. */
  delta7d: number;
  confidence: ConfidenceAssessment;
  components: ValueComponent[];
  assumptions: ValueAssumptions;
  /** The formula rendered as a human-readable string. */
  formulaText: string;
  signals: ValueSignal[];
  /** Verbatim copy from spec §7 — the unseen-risk note. */
  unseenRiskNote: string;
}

export interface ValueComponent {
  label: string;
  hours: number;
  percentOfTotal: number;
  /** The math for THIS component shown inline. */
  derivation: string;
}

export interface ValueAssumptions {
  costPerHour: number;
  reworkMultiplier: number;
  blendedHoursPerExecution: number;
}

export interface ValueSignal {
  id: string;
  name: string;
  value: number;
  unit: string;
  severity: 'info' | 'warn' | 'error';
  description: string;
  evidenceUrl?: string;
}

/**
 * Per-engineer Shadow Knowledge Index — bus-factor proxy.
 * Higher is worse (more concentrated tribal knowledge).
 */
export interface ShadowKnowledgeIndex {
  persona: string;
  index: number;
  concentratedFiles: number;
  recommendation: string;
}

/**
 * Pattern Spread — cross-repo reuse of named patterns.
 * The Knowledge Cockpit's top-line signal.
 */
export interface PatternSpreadEntry {
  patternId: string;
  patternName: string;
  occurrences: number;
  reuses: number;
  reposCovered: number;
  teamsCovered: number;
  reuseRate: number;
  crossRepoReuseRate: number;
}

/** Efficiency cockpit signals. */
export interface EfficiencyMetrics {
  promptLift: number;
  contextCompression: number;
  wasteAvoided: number;
  cleanAdmission: number;
  confidence: ConfidenceAssessment;
  /** Average hours between a CIC failure and a clean re-submit. */
  avgTimeToRemediateHours: number;
}

/** Integrity cockpit signals. */
export interface IntegrityMetrics {
  writeSafety: number;
  redactRate: number;
  rejectRate: number;
  integrityDrift: number;
  confidence: ConfidenceAssessment;
  violationConcentration: ViolationConcentration[];
}

export interface ViolationConcentration {
  repo: string;
  primaryViolations: number;
  secondaryViolations: number;
  trend: 'up' | 'down' | 'flat';
}

/** Quality cockpit signals. */
export interface QualityMetrics {
  executionReliability: number;
  reworkRatio: number;
  firstPassSuccess: number;
  confidence: ConfidenceAssessment;
  perServiceBreakdown: QualityPerService[];
}

export interface QualityPerService {
  service: string;
  reliability: number;
  reworkRatio: number;
  trend: 'up' | 'down' | 'flat';
}

/**
 * Release Gate finding — the detail behind a P0/P1 badge count.
 * When an EM clicks a release, they see the actual findings.
 */
export interface ReleaseFinding {
  id: string;
  severity: 'P0' | 'P1' | 'P2' | 'P3';
  category: string;
  title: string;
  description: string;
  filePath: string;
  lineNumber?: number;
  evidenceUrl?: string;
}

/**
 * Natural-language summary surfaced at the top of key pages.
 * Auto-generated from the underlying metrics.
 */
export interface DashboardSummary {
  sentence: string;
  tone: 'healthy' | 'warning' | 'critical';
  confidence: ConfidenceAssessment;
}

/**
 * Data mode signal — tells the UI whether it's rendering fixture data
 * or live data. Drives the "Sample Data" banner in the product dashboard
 * and stays silent on the public demo where fixtures are always in use.
 */
export interface DataModeInfo {
  mode: 'fixture' | 'live';
  /** When in fixture mode, whether to show a "this is sample data" banner. */
  showSampleBanner: boolean;
  /** Copy for the banner. */
  sampleBannerText?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 2: Explainability & Intelligence (v0.10.8)
// ─────────────────────────────────────────────────────────────────────────────

export interface ExplainEntry {
  id: string;
  runId: string;
  timestamp: string;
  outcome: { status: 'PASS' | 'WARN' | 'BLOCK'; summary: string };
  why: Array<{ reason: string; evidenceId?: string }>;
  evidence: Array<{ label: string; value: string; source: string }>;
  contextAnalysis: { isc: number; ccs: number; truthGrade: string };
  confidenceBreakdown: Record<string, number>;
}

export interface LearningPattern {
  name: string;
  occurrences: number;
  successRate: number;
  trend: 'improving' | 'stable' | 'degrading';
  hotspotFiles: string[];
  contributingEntries: string[];
}

export interface LearningsEntry {
  id: string;
  windowLabel: string;
  generatedAt: string;
  topPatterns: LearningPattern[];
  recommendations: string[];
}

export interface NextAction {
  title: string;
  confidence: number;
  basedOn: string[];
  expectedImpact: string;
}

export interface NextEntry {
  id: string;
  generatedAt: string;
  actions: NextAction[];
  rationale: string;
}

export interface TruthTimelineEvent {
  id: string;
  type: 'VERIFY_RUN' | 'TRUTH_SNAPSHOT' | 'EVIDENCE_CAPTURED' | 'RISK_ALERT' | 'HOTSPOT_OBSERVED';
  timestamp: string;
  commitSha: string;
  truthGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  details: Record<string, unknown>;
}

export interface GoldenPattern {
  id: string;
  label: string;
  description: string;
  author: string;
  authorEmoji: string;
  confidence: number;
  verifications: number;
  keywords: string[];
  typicalFiles: string[];
  extractedFrom: string;
  referencedInPRs: number;
}

// ─── Terminal Replay ────────────────────────────────────────────────────────

export interface ReplayFlowEntry {
  id: string;
  title: string;
  persona: string;
  personaEmoji: string;
  startedAt: string;
  provider: 'shell' | 'tmux';
  directory: string;
  steps: string[];
  shape: string;
  score: number;
  action: 'keep' | 'compact';
}

export interface ReplaySimilarMatch {
  label: 'Strong' | 'Likely' | 'Possible';
  resolvedBy: string;
  resolvedByEmoji: string;
  timeAgo: string;
  reasons: string[];
  originalFlowId: string;
}
