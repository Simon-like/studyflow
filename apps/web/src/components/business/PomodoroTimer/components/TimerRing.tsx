import { CIRCUMFERENCE } from '../constants';

interface TimerRingProps {
  progress: number;
  timeText: string;
  label?: string;
  isResting?: boolean;
}

export function TimerRing({ progress, timeText, label, isResting = false }: TimerRingProps) {
  const strokeDashoffset = CIRCUMFERENCE - progress;
  const displayLabel = label ?? (isResting ? '休息中' : '剩余时间');
  const trackColor = isResting ? '#C8E6C9' : '#F5C9A8';
  const progressColor = isResting ? '#9DB5A0' : '#E8A87C';

  return (
    <div className="relative w-44 h-44 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke={trackColor}
          strokeWidth="8"
        />
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke={progressColor}
          strokeWidth="8"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold text-charcoal">{timeText}</span>
        <span className="text-stone text-xs mt-1">{displayLabel}</span>
      </div>
    </div>
  );
}
