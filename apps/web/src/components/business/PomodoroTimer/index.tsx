import type { PomodoroTimerProps } from './types';
import { DEFAULT_TOTAL_TIME } from './constants';
import { TimerRing } from './components/TimerRing';
import { TaskInfo } from './components/TaskInfo';
import { TimerControls } from './components/TimerControls';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function PomodoroTimer({
  status,
  timeRemaining,
  totalTime = DEFAULT_TOTAL_TIME,
  taskTitle,
  taskSubtitle,
  taskProgress,
  onStart,
  onPause,
  onResume,
  onStop,
  className = '',
}: PomodoroTimerProps) {
  const progress = (timeRemaining / totalTime) * (2 * Math.PI * 90);

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-soft ${className}`}>
      <div className="flex items-center gap-8">
        <TimerRing
          progress={progress}
          timeText={formatTime(timeRemaining)}
        />

        <div className="flex-1">
          {taskTitle && (
            <TaskInfo
              title={taskTitle}
              subtitle={taskSubtitle}
              progress={taskProgress}
            />
          )}

          <TimerControls
            status={status}
            onStart={onStart}
            onPause={onPause}
            onResume={onResume}
            onStop={onStop}
          />
        </div>
      </div>
    </div>
  );
}

export { type PomodoroTimerProps, type TimerStatus } from './types';
export { useTimerTick } from './hooks';
