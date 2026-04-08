import type { ConfidenceAssessment } from '@/types/dashboard';

interface ConfidenceBadgeProps {
  confidence: ConfidenceAssessment;
  showCount?: boolean;
  size?: 'sm' | 'md';
}

const LEVEL_STYLES: Record<ConfidenceAssessment['level'], string> = {
  low: 'bg-amber-50 text-amber-700 border-amber-200',
  medium: 'bg-sky-50 text-sky-700 border-sky-200',
  high: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const LEVEL_LABEL: Record<ConfidenceAssessment['level'], string> = {
  low: 'low confidence',
  medium: 'medium confidence',
  high: 'high confidence',
};

/**
 * Small pill badge showing the confidence level of a metric.
 *
 * Used everywhere a time-window-dependent number is displayed. The
 * `title` tooltip shows the event count + reason so an EM who hovers
 * gets the full picture without cluttering the main UI.
 *
 * Matches the spec §7 privacy-footer spirit: every number is labeled
 * with how much signal is behind it, so there's no implied authority
 * from a small sample.
 */
export function ConfidenceBadge({
  confidence,
  showCount = false,
  size = 'sm',
}: ConfidenceBadgeProps): JSX.Element {
  const classes = LEVEL_STYLES[confidence.level];
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1';
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${classes} ${padding} ${textSize}`}
      title={`${LEVEL_LABEL[confidence.level]} · ${String(confidence.eventCount)} events · ${confidence.reason}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${
        confidence.level === 'high' ? 'bg-emerald-500' :
        confidence.level === 'medium' ? 'bg-sky-500' : 'bg-amber-500'
      }`} />
      {LEVEL_LABEL[confidence.level]}
      {showCount && (
        <span className="text-stone-400">· {String(confidence.eventCount)} events</span>
      )}
    </span>
  );
}
