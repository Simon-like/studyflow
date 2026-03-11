import { CIRCUMFERENCE } from '../constants';

interface TimerRingProps {
  progress: number;
  timeText: string;
  label?: string;
}

export function TimerRing({ progress, timeText, label = '剩余时间' }: TimerRingProps) {
  const strokeDashoffset = CIRCUMFERENCE - progress;

  return (
    <div className="relative w-44 h-44 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="#F5C9A8"
          strokeWidth="8"
        />
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="#E8A87C"
          strokeWidth="8"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold text-charcoal">{timeText}</span>
        <span className="text-stone text-xs mt-1">{label}</span>
      </div>
    </div>
  );
}
