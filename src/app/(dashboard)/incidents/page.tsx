import { IncidentGallery } from '@/components/incidents/IncidentGallery';
import { getNamedIncidents } from '@/lib/api/timeline-queries';

export default async function IncidentsPage() {
  const incidents = await getNamedIncidents();
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">Named Incidents</h1>
        <p className="mt-1 text-sm text-stone-500">
          Key moments in the team&apos;s quality journey, tracked through CodeLedger
        </p>
      </div>
      <IncidentGallery incidents={incidents} />
    </div>
  );
}
