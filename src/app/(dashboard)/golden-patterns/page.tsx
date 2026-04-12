import { getGoldenPatterns } from '@/lib/api/timeline-queries';

export default async function GoldenPatternsPage() {
  const patterns = await getGoldenPatterns();

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Golden Patterns</h1>
        <p className="mt-1 text-sm text-stone-500">
          Validated engineering approaches extracted from ECL success history. The team&apos;s north star.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {patterns.map((p) => (
          <div key={p.id} className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-600">{p.id}</span>
                <h3 className="font-medium text-stone-900">{p.label}</h3>
              </div>
              <span className="text-sm">{p.authorEmoji}</span>
            </div>

            <p className="mt-2 text-sm text-stone-600">{p.description}</p>

            <div className="mt-4 flex items-center gap-6">
              <div>
                <div className="font-mono text-xl font-bold text-stone-900">{p.confidence.toFixed(2)}</div>
                <div className="text-xs text-stone-400">confidence</div>
              </div>
              <div>
                <div className="font-mono text-xl font-bold text-stone-900">{p.verifications}×</div>
                <div className="text-xs text-stone-400">verified</div>
              </div>
              <div>
                <div className="font-mono text-xl font-bold text-stone-900">{p.referencedInPRs}</div>
                <div className="text-xs text-stone-400">PR refs</div>
              </div>
            </div>

            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-amber-50">
                <div className="h-2 rounded-full bg-amber-400" style={{ width: `${p.confidence * 100}%` }} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1">
              {p.keywords.map((k) => (
                <span key={k} className="rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                  {k}
                </span>
              ))}
            </div>

            <div className="mt-3 text-xs text-stone-400">
              <span className="font-medium text-stone-500">{p.author}</span> · {p.extractedFrom}
            </div>

            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {p.typicalFiles.map((f) => (
                  <span key={f} className="rounded bg-stone-100 px-2 py-0.5 font-mono text-xs text-stone-500">
                    {f.split('/').slice(-2).join('/')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
