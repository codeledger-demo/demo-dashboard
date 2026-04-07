'use client';

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onChange: (category: string | null) => void;
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  const chips = ['All', ...categories];

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((cat) => {
        const isActive = cat === 'All' ? selected === null : selected === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat === 'All' ? null : cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? 'bg-brand-primary text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
