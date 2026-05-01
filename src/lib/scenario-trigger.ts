export const DEFAULT_SCENARIO_TRIGGER_URL = 'https://codeledger-scenario-trigger.ash-248.workers.dev';

export function configuredScenarioTriggerUrl(): string {
  return (process.env.NEXT_PUBLIC_SCENARIO_TRIGGER_URL || DEFAULT_SCENARIO_TRIGGER_URL).trim();
}

export function resolveScenarioTriggerUrl(source: unknown = globalThis): string {
  if (source && typeof source === 'object') {
    const value = (source as { __SCENARIO_TRIGGER_URL__?: unknown }).__SCENARIO_TRIGGER_URL__;
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return configuredScenarioTriggerUrl();
}
