import { ReplayTimeline } from '@/components/replay/ReplayTimeline';
import { getReplayFlows, getReplaySimilar } from '@/lib/api/timeline-queries';

export default async function ReplayPage() {
  const [flows, similar] = await Promise.all([
    getReplayFlows(),
    getReplaySimilar(),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">Terminal Replay</h1>
        <p className="mt-1 text-sm text-stone-500">
          Retained command flows from real debugging sessions &mdash; execution memory, not logs
        </p>
      </div>
      <ReplayTimeline flows={flows} similar={similar} />
    </div>
  );
}
