import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SCENARIO_TRIGGER_URL,
  resolveScenarioTriggerUrl,
} from '@/lib/scenario-trigger';

describe('scenario trigger endpoint configuration', () => {
  it('falls back to the deployed worker endpoint', () => {
    expect(resolveScenarioTriggerUrl({})).toBe(DEFAULT_SCENARIO_TRIGGER_URL);
  });

  it('allows runtime injection to override the build-time endpoint', () => {
    expect(resolveScenarioTriggerUrl({
      __SCENARIO_TRIGGER_URL__: ' https://example.com/fire ',
    })).toBe('https://example.com/fire');
  });
});
