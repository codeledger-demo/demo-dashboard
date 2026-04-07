import { ServiceGraph } from '@/components/drift-map/ServiceGraph';
import { getDriftMapGraph } from '@/lib/api/timeline-queries';

export default async function DriftMapPage() {
  const { nodes, edges } = await getDriftMapGraph();
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Architecture Drift Map
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Service dependency graph with drift levels and CIC pass rates across acme-platform.
        </p>
      </div>

      <ServiceGraph nodes={nodes} edges={edges} />
    </div>
  );
}
