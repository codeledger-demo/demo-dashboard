import { SandboxRunner } from '@/components/sandbox/SandboxRunner';
import { getSandboxScenarios } from '@/lib/api/timeline-queries';

export default async function SandboxPage() {
  const scenarios = await getSandboxScenarios();
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">Sandbox Lane</h1>
        <p className="mt-1 text-sm text-stone-500">
          Run simulated CIC checks to see CodeLedger in action
        </p>
      </div>
      <SandboxRunner scenarios={scenarios} />
    </div>
  );
}
