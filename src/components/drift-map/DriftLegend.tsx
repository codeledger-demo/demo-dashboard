const levels = [
  { label: 'Low drift', color: 'bg-emerald-400' },
  { label: 'Medium drift', color: 'bg-amber-400' },
  { label: 'High drift', color: 'bg-red-400' },
];

export function DriftLegend() {
  return (
    <div className="flex flex-wrap items-center gap-5 rounded-lg border border-stone-200 bg-surface-card px-4 py-3 text-xs text-stone-600">
      {levels.map((l) => (
        <span key={l.label} className="flex items-center gap-1.5">
          <span className={`inline-block h-3 w-3 rounded-full ${l.color}`} />
          {l.label}
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <svg className="h-4 w-6 text-stone-400" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <line x1="0" y1="6" x2="20" y2="6" />
          <polygon points="20,3 24,6 20,9" fill="currentColor" stroke="none" />
        </svg>
        Cross-service dependency
      </span>
    </div>
  );
}
