'use client';

import { useMemo, useState } from 'react';
import type { LessonEntry } from '@/types/dashboard';
import { LessonCard } from './LessonCard';
import { CategoryFilter } from './CategoryFilter';
import { WisdomMetric } from './WisdomMetric';

type SortKey = 'recent' | 'triggered' | 'severity';

const severityRank: Record<string, number> = { high: 0, medium: 1, low: 2 };

interface LessonTimelineProps {
  lessons: LessonEntry[];
  wisdomGrowth: number;
}

export function LessonTimeline({ lessons, wisdomGrowth }: LessonTimelineProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>('recent');

  const categories = useMemo(
    () => Array.from(new Set(lessons.map((l) => l.category))).sort(),
    [lessons],
  );

  const activelyConsulted = useMemo(
    () => lessons.filter((l) => l.active && l.triggerCount > 0).length,
    [lessons],
  );

  const filtered = useMemo(() => {
    let list = selectedCategory
      ? lessons.filter((l) => l.category === selectedCategory)
      : lessons;

    list = [...list].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.firstSeen).getTime() - new Date(a.firstSeen).getTime();
      }
      if (sortBy === 'triggered') {
        return b.triggerCount - a.triggerCount;
      }
      return (severityRank[a.severity] ?? 3) - (severityRank[b.severity] ?? 3);
    });

    return list;
  }, [lessons, selectedCategory, sortBy]);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'recent', label: 'Most Recent' },
    { key: 'triggered', label: 'Most Triggered' },
    { key: 'severity', label: 'Severity' },
  ];

  return (
    <div className="space-y-6">
      <WisdomMetric
        wisdomGrowth={wisdomGrowth}
        totalLessons={lessons.length}
        activelyConsulted={activelyConsulted}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
        <div className="flex gap-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                sortBy === opt.key
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-stone-400">
            No lessons match the selected filter.
          </p>
        )}
      </div>
    </div>
  );
}
