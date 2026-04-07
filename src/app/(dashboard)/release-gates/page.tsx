import { ReleaseTimeline } from '@/components/release-gates/ReleaseTimeline';
import { getReleaseHistory } from '@/lib/api/timeline-queries';

export default async function ReleaseGatesPage() {
  const releases = await getReleaseHistory();

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Release Gate History
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Release readiness checks from v2.3.8 (blocked) through v2.4.1 (The Clean Release).
        </p>
      </div>

      <ReleaseTimeline releases={releases} />
    </div>
  );
}
