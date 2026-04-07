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
}
