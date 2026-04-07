import { LessonTimeline } from '@/components/lessons/LessonTimeline';
import { getLessons } from '@/lib/api/timeline-queries';

const WISDOM_GROWTH = 12;

export default async function LessonsPage() {
  const lessons = await getLessons();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">Lessons Ledger</h1>
        <p className="mt-1 text-sm text-stone-500">
          Institutional memory from past incidents, reviews, and patterns
        </p>
      </div>
      <LessonTimeline lessons={lessons} wisdomGrowth={WISDOM_GROWTH} />
    </div>
  );
}
