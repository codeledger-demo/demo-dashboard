import { CICTimeline } from '@/components/cic/CICTimeline';
import { getCICHistory } from '@/lib/api/timeline-queries';

export default async function CICHistoryPage() {
  const entries = await getCICHistory();

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          CIC History
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Completion Integrity Check results across all developers and sessions.
        </p>
      </div>

      <CICTimeline entries={entries} />
    </div>
  );
}
