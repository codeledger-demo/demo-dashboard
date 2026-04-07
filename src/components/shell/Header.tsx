interface HeaderProps {
  title: string;
  healthScore?: number;
  healthGrade?: string;
}

export function Header({ title, healthScore, healthGrade }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-surface-card px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold font-serif text-stone-900">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {healthScore !== undefined && (
          <div className="flex items-center gap-2 rounded-full bg-surface-elevated px-3 py-1.5 text-sm">
            <span className="font-mono font-semibold text-brand-primary">
              {healthScore}
            </span>
            {healthGrade && (
              <span className="text-xs text-stone-500">({healthGrade})</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-500">
          <span className="h-1.5 w-1.5 rounded-full bg-semantic-success" />
          Read-only
        </div>
      </div>
    </header>
  );
}
