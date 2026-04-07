import { describe, it, expect, beforeEach } from 'vitest';
import {
  isLiveMode,
  FIXTURE_CIC_HISTORY,
  FIXTURE_PERSONA_METRICS,
  FIXTURE_LESSONS,
  FIXTURE_RELEASE_HISTORY,
} from '@/lib/api/fixtures';

describe('fixtures', () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
  });

  it('isLiveMode() is false when DATABASE_URL unset', () => {
    expect(isLiveMode()).toBe(false);
  });

  it('isLiveMode() is true when DATABASE_URL set', () => {
    process.env.DATABASE_URL = 'postgres://localhost/test';
    expect(isLiveMode()).toBe(true);
  });

  it('FIXTURE_CIC_HISTORY has at least 5 entries', () => {
    expect(FIXTURE_CIC_HISTORY.length).toBeGreaterThanOrEqual(5);
  });

  it('FIXTURE_PERSONA_METRICS has all 3 personas', () => {
    expect(FIXTURE_PERSONA_METRICS['sara-chen']).toBeDefined();
    expect(FIXTURE_PERSONA_METRICS['marcus-webb']).toBeDefined();
    expect(FIXTURE_PERSONA_METRICS['priya-k']).toBeDefined();
  });

  it('FIXTURE_LESSONS has at least 5 entries with required fields', () => {
    expect(FIXTURE_LESSONS.length).toBeGreaterThanOrEqual(5);
    for (const lesson of FIXTURE_LESSONS) {
      expect(lesson.id).toBeTruthy();
      expect(lesson.title).toBeTruthy();
      expect(lesson.summary).toBeTruthy();
      expect(lesson.category).toBeTruthy();
      expect(lesson.severity).toBeTruthy();
    }
  });

  it('FIXTURE_RELEASE_HISTORY contains not_ready and ready_hardened entries', () => {
    const states = FIXTURE_RELEASE_HISTORY.map((r) => r.releaseState);
    expect(states).toContain('not_ready');
    expect(states).toContain('ready_hardened');
  });
});
