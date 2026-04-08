/**
 * Timeline queries — the single data access layer for all dashboard pages.
 *
 * When DATABASE_URL is set, these functions issue real PostgreSQL queries
 * against the schema defined in lib/db/schema.sql.
 *
 * When DATABASE_URL is unset (demo mode), they return deterministic fixtures
 * from lib/api/fixtures.ts. This lets the dashboard render a coherent demo
 * without a live database while keeping all query call-sites identical.
 */

import { getDb } from '@/lib/db/client';
import {
  isLiveMode,
  FIXTURE_CIC_HISTORY,
  FIXTURE_RELEASE_HISTORY,
  FIXTURE_LESSONS,
  FIXTURE_TEAM_HEALTH,
  FIXTURE_PERSONA_METRICS,
  FIXTURE_HEALTH_SNAPSHOTS,
  FIXTURE_TIME_HORIZON_METRICS,
  FIXTURE_TIME_HORIZON_ARCS,
  FIXTURE_TIME_HORIZON_INCIDENTS,
  FIXTURE_DRIFT_MAP_NODES,
  FIXTURE_DRIFT_MAP_EDGES,
  FIXTURE_NAMED_INCIDENTS,
  FIXTURE_SANDBOX_SCENARIOS,
  FIXTURE_FLEET_DATA,
  type FleetData,
  type HorizonMetrics,
  type ArcDef,
  type IncidentMarker,
  type DriftServiceNode,
  type DriftServiceEdge,
  type NamedIncident,
  type SandboxScenario,
} from '@/lib/api/fixtures';
import type {
  CICEntry,
  ReleaseEntry,
  LessonEntry,
  PersonaMetrics,
  DashboardMetric,
} from '@/types/dashboard';

interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}

interface CICFilter extends DateRangeFilter {
  persona?: string;
  completionState?: string;
}

interface LessonFilter {
  active?: boolean;
  category?: string;
}

interface ECLEvent {
  id: string;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt: string;
  sessionId: string | null;
  persona: string | null;
}

interface ECLFilter extends DateRangeFilter {
  eventType?: string;
  sessionId?: string;
}

interface HealthSnapshot {
  snapshotAt: string;
  score: number;
}

export async function getCICHistory(params: CICFilter = {}): Promise<CICEntry[]> {
  if (!isLiveMode()) {
    return filterCICFixtures(params);
  }

  const sql = getDb();
  const conditions: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (params.persona) {
    values.push(params.persona);
    conditions.push(`persona = $${values.length}`);
  }
  if (params.completionState) {
    values.push(params.completionState);
    conditions.push(`completion_state = $${values.length}`);
  }
  if (params.startDate) {
    values.push(params.startDate.toISOString());
    conditions.push(`checked_at >= $${values.length}`);
  }
  if (params.endDate) {
    values.push(params.endDate.toISOString());
    conditions.push(`checked_at <= $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = await sql.unsafe(
    `SELECT * FROM cic_history ${where} ORDER BY checked_at DESC LIMIT 500`,
    values
  );

  return rows.map((r) => ({
    id: r.id as string,
    checkedAt: String(r.checked_at),
    task: r.task as string,
    completionState: r.completion_state as CICEntry['completionState'],
    claimCount: Number(r.claim_count),
    verifiedClaimCount: Number(r.verified_claim_count),
    mismatchCount: Number(r.mismatch_count),
    driftWarningCount: Number(r.drift_warning_count),
    persona: r.persona as string,
    prNumber: r.pr_number != null ? Number(r.pr_number) : null,
  }));
}

function filterCICFixtures(params: CICFilter): CICEntry[] {
  return FIXTURE_CIC_HISTORY.filter((entry) => {
    if (params.persona && entry.persona !== params.persona) return false;
    if (params.completionState && entry.completionState !== params.completionState) return false;
    if (params.startDate && new Date(entry.checkedAt) < params.startDate) return false;
    if (params.endDate && new Date(entry.checkedAt) > params.endDate) return false;
    return true;
  });
}

export async function getReleaseHistory(
  params: DateRangeFilter = {}
): Promise<ReleaseEntry[]> {
  if (!isLiveMode()) {
    return FIXTURE_RELEASE_HISTORY.filter((entry) => {
      if (params.startDate && new Date(entry.checkedAt) < params.startDate) return false;
      if (params.endDate && new Date(entry.checkedAt) > params.endDate) return false;
      return true;
    });
  }

  const sql = getDb();
  const conditions: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (params.startDate) {
    values.push(params.startDate.toISOString());
    conditions.push(`checked_at >= $${values.length}`);
  }
  if (params.endDate) {
    values.push(params.endDate.toISOString());
    conditions.push(`checked_at <= $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = await sql.unsafe(
    `SELECT * FROM release_history ${where} ORDER BY checked_at DESC LIMIT 200`,
    values
  );

  return rows.map((r) => ({
    id: r.id as string,
    checkedAt: String(r.checked_at),
    releaseState: r.release_state as ReleaseEntry['releaseState'],
    confidenceScore: Number(r.confidence_score),
    findingCount: Number(r.finding_count),
    p0Count: Number(r.p0_count),
    p1Count: Number(r.p1_count),
    versionTag: r.version_tag != null ? String(r.version_tag) : null,
  }));
}

export async function getLessons(params: LessonFilter = {}): Promise<LessonEntry[]> {
  if (!isLiveMode()) {
    return FIXTURE_LESSONS.filter((lesson) => {
      if (params.active !== undefined && lesson.active !== params.active) return false;
      if (params.category && lesson.category !== params.category) return false;
      return true;
    });
  }

  const sql = getDb();
  const conditions: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (params.active !== undefined) {
    values.push(params.active);
    conditions.push(`active = $${values.length}`);
  }
  if (params.category) {
    values.push(params.category);
    conditions.push(`category = $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = await sql.unsafe(
    `SELECT * FROM lessons ${where} ORDER BY trigger_count DESC LIMIT 200`,
    values
  );

  return rows.map((r) => ({
    id: r.id as string,
    title: r.title as string,
    summary: r.summary as string,
    category: r.category as string,
    severity: r.severity as string,
    triggerCount: Number(r.trigger_count),
    firstSeen: String(r.first_seen),
    lastTriggered: r.last_triggered != null ? String(r.last_triggered) : null,
    active: Boolean(r.active),
  }));
}

export async function getHealthSnapshots(
  params: DateRangeFilter = {}
): Promise<HealthSnapshot[]> {
  if (!isLiveMode()) {
    return FIXTURE_HEALTH_SNAPSHOTS.filter((snapshot) => {
      if (params.startDate && new Date(snapshot.snapshotAt) < params.startDate) return false;
      if (params.endDate && new Date(snapshot.snapshotAt) > params.endDate) return false;
      return true;
    });
  }

  const sql = getDb();
  const conditions: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (params.startDate) {
    values.push(params.startDate.toISOString());
    conditions.push(`snapshot_at >= $${values.length}`);
  }
  if (params.endDate) {
    values.push(params.endDate.toISOString());
    conditions.push(`snapshot_at <= $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = await sql.unsafe(
    `SELECT snapshot_at, ahs_score FROM health_snapshots ${where} ORDER BY snapshot_at DESC LIMIT 100`,
    values
  );

  return rows.map((r) => ({
    snapshotAt: String(r.snapshot_at),
    score: Number(r.ahs_score),
  }));
}

export async function getPersonaMetrics(
  persona: string,
  windowDays: number = 30
): Promise<PersonaMetrics | null> {
  if (!isLiveMode()) {
    return FIXTURE_PERSONA_METRICS[persona] ?? null;
  }

  const sql = getDb();
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();

  const rows = await sql.unsafe(
    `SELECT
       persona,
       COUNT(*) AS total,
       COUNT(*) FILTER (WHERE completion_state IN ('verified','audited','release_safe')) AS passed,
       COUNT(DISTINCT pr_number) FILTER (WHERE pr_number IS NOT NULL) AS pr_count
     FROM cic_history
     WHERE persona = $1 AND checked_at >= $2
     GROUP BY persona`,
    [persona, since]
  );

  if (rows.length === 0) return null;

  const row = rows[0];
  const total = Number(row.total);
  const passed = Number(row.passed);

  return {
    id: persona,
    name: persona,
    role: 'developer',
    emoji: '🧑‍💻',
    cicPassRate: total > 0 ? Math.round((passed / total) * 100) : 0,
    prCount30d: Number(row.pr_count),
    trend: 0,
    lastFailureReason: null,
    lessonsContributed: 0,
  };
}

export async function getAllPersonaMetrics(windowDays: number = 30): Promise<PersonaMetrics[]> {
  const personas = ['sara-chen', 'marcus-webb', 'priya-k'];
  const results = await Promise.all(personas.map((p) => getPersonaMetrics(p, windowDays)));
  return results.filter((m): m is PersonaMetrics => m !== null);
}

export async function getTeamHealthScore(): Promise<DashboardMetric | null> {
  if (!isLiveMode()) {
    return FIXTURE_TEAM_HEALTH;
  }

  const sql = getDb();
  const rows = await sql.unsafe(
    `SELECT ahs_score, grade FROM health_snapshots ORDER BY snapshot_at DESC LIMIT 1`
  );

  if (rows.length === 0) return null;

  return {
    label: 'Architecture Health Score',
    value: Number(rows[0].ahs_score),
    unit: rows[0].grade as string,
    trend: 'flat',
  };
}

export async function getECLEvents(params: ECLFilter = {}): Promise<ECLEvent[]> {
  if (!isLiveMode()) {
    return [];
  }

  const sql = getDb();
  const conditions: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (params.eventType) {
    values.push(params.eventType);
    conditions.push(`event_type = $${values.length}`);
  }
  if (params.sessionId) {
    values.push(params.sessionId);
    conditions.push(`session_id = $${values.length}`);
  }
  if (params.startDate) {
    values.push(params.startDate.toISOString());
    conditions.push(`created_at >= $${values.length}`);
  }
  if (params.endDate) {
    values.push(params.endDate.toISOString());
    conditions.push(`created_at <= $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = await sql.unsafe(
    `SELECT * FROM ecl_events ${where} ORDER BY created_at DESC LIMIT 500`,
    values
  );

  return rows.map((r) => ({
    id: r.id as string,
    eventType: r.event_type as string,
    payload: r.payload as Record<string, unknown>,
    createdAt: String(r.created_at),
    sessionId: r.session_id != null ? String(r.session_id) : null,
    persona: r.persona != null ? String(r.persona) : null,
  }));
}

// ---------- Time Horizon ----------

export async function getTimeHorizonData(): Promise<{
  metrics: Record<string, HorizonMetrics>;
  arcs: ArcDef[];
  incidents: IncidentMarker[];
}> {
  if (!isLiveMode()) {
    return {
      metrics: FIXTURE_TIME_HORIZON_METRICS,
      arcs: FIXTURE_TIME_HORIZON_ARCS,
      incidents: FIXTURE_TIME_HORIZON_INCIDENTS,
    };
  }
  throw new Error('getTimeHorizonData: not yet implemented in live mode');
}

// ---------- Drift Map ----------

export async function getDriftMapGraph(): Promise<{
  nodes: DriftServiceNode[];
  edges: DriftServiceEdge[];
}> {
  if (!isLiveMode()) {
    return { nodes: FIXTURE_DRIFT_MAP_NODES, edges: FIXTURE_DRIFT_MAP_EDGES };
  }
  throw new Error('getDriftMapGraph: not yet implemented in live mode');
}

// ---------- Named Incidents ----------

export async function getNamedIncidents(): Promise<NamedIncident[]> {
  if (!isLiveMode()) {
    return FIXTURE_NAMED_INCIDENTS;
  }
  throw new Error('getNamedIncidents: not yet implemented in live mode');
}

export async function getNamedIncident(id: string): Promise<NamedIncident | null> {
  if (!isLiveMode()) {
    return FIXTURE_NAMED_INCIDENTS.find((i) => i.id === id) ?? null;
  }
  throw new Error('getNamedIncident: not yet implemented in live mode');
}

// ---------- Sandbox ----------

export async function getSandboxScenarios(): Promise<SandboxScenario[]> {
  if (!isLiveMode()) {
    return FIXTURE_SANDBOX_SCENARIOS;
  }
  throw new Error('getSandboxScenarios: not yet implemented in live mode');
}

// ---------- Fleet ----------

export async function getFleetData(): Promise<FleetData> {
  if (!isLiveMode()) {
    return FIXTURE_FLEET_DATA;
  }
  throw new Error('getFleetData: not yet implemented in live mode');
}
