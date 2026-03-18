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
  isTaskBound = false,
  onToggleTimer,
  onCompleteTask,
  onAbandonTask,
  onShowTaskDetail,
  onExtendRest,
  onEndRestEarly,
  onCompleteTaskFromRest,
  className = '',
}: PomodoroTimerProps) {
  const progress = (timeRemaining / totalTime) * (2 * Math.PI * 90);

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-soft ${className}`}>
      <div className="flex items-center gap-8">
        <TimerRing
          progress={progress}
          timeText={formatTime(timeRemaining)}
          isResting={status === 'resting'}
        />

        <div className="flex-1">
          <TaskInfo
            title={taskTitle || '自由任务'}
            subtitle={status === 'resting' ? '休息中，放松一下' : (taskSubtitle || '专注当下，提升效率')}
            progress={status === 'resting' ? '休息时间' : (taskProgress || '自由模式')}
            onShowDetail={onShowTaskDetail}
          />

          <TimerControls
            status={status}
            isTaskBound={isTaskBound}
            onToggleTimer={onToggleTimer}
            onCompleteTask={onCompleteTask}
            onAbandonTask={onAbandonTask}
            onExtendRest={onExtendRest}
            onEndRestEarly={onEndRestEarly}
            onCompleteTaskFromRest={onCompleteTaskFromRest}
          />
        </div>
      </div>
    </div>
  );
}

export { type PomodoroTimerProps, type TimerStatus } from './types';
export { useTimerTick } from './hooks';
