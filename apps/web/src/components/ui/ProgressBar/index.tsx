import type { ProgressBarProps } from './types';
import { PROGRESS_SIZES, PROGRESS_COLORS, PROGRESS_BASE_CLASSES } from './constants';

export function ProgressBar({
  progress,
  total = 100,
  showLabel = false,
  size = 'md',
  color = 'primary',
  label,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((progress / total) * 100, 0), 100);

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between mb-2">
          {label && <p className="text-charcoal font-medium text-sm">{label}</p>}
          {showLabel && (
            <span className="text-coral text-sm font-bold">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`${PROGRESS_BASE_CLASSES} ${PROGRESS_SIZES[size]}`}>
        <div
          className={`${PROGRESS_COLORS[color]} h-full rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export { type ProgressBarProps } from './types';
