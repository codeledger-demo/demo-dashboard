import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCICHistory,
  getReleaseHistory,
  getLessons,
  getPersonaMetrics,
  getAllPersonaMetrics,
  getTeamHealthScore,
} from '@/lib/api/timeline-queries';

describe('timeline-queries (fixture mode)', () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
  });

  it('getCICHistory() returns fixtures', async () => {
    const rows = await getCICHistory();
    expect(rows.length).toBeGreaterThan(0);
  });

  it('getCICHistory({ persona }) filters by persona', async () => {
    const rows = await getCICHistory({ persona: 'sara-chen' });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.persona === 'sara-chen')).toBe(true);
  });

  it('getCICHistory({ completionState }) filters by state', async () => {
    const rows = await getCICHistory({ completionState: 'incomplete' });
    expect(rows.every((r) => r.completionState === 'incomplete')).toBe(true);
  });

  it('getReleaseHistory() returns fixtures', async () => {
    const rows = await getReleaseHistory();
    expect(rows.length).toBeGreaterThan(0);
  });

  it('getLessons() returns fixtures', async () => {
    const rows = await getLessons();
    expect(rows.length).toBeGreaterThan(0);
  });

  it('getLessons({ category }) filters by category', async () => {
    const rows = await getLessons({ category: 'auth-incident' });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.category === 'auth-incident')).toBe(true);
  });

  it('getPersonaMetrics(sara-chen) returns metrics', async () => {
    const m = await getPersonaMetrics('sara-chen');
    expect(m).not.toBeNull();
    expect(m?.id).toBe('sara-chen');
  });

  it('getPersonaMetrics(unknown) returns null', async () => {
    const m = await getPersonaMetrics('unknown-persona');
    expect(m).toBeNull();
  });

  it('getTeamHealthScore() returns metric with value > 0', async () => {
    const m = await getTeamHealthScore();
    expect(m).not.toBeNull();
    expect((m?.value ?? 0) > 0).toBe(true);
  });

  it('getAllPersonaMetrics() returns all 3 personas', async () => {
    const all = await getAllPersonaMetrics();
    expect(all.length).toBe(3);
  });
});
