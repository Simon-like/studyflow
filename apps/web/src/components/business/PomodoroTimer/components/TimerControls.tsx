import { Button } from '@/components/ui';
import type { TimerStatus } from '../types';
import { Play, Pause, CheckCircle, Square, Clock, Coffee } from 'lucide-react';

interface TimerControlsProps {
  status: TimerStatus;
  isTaskBound?: boolean;
  onToggleTimer: () => void;
  onCompleteTask: () => void;
  onAbandonTask: () => void;
  onExtendRest?: () => void;
  onEndRestEarly?: () => void;
  onCompleteTaskFromRest?: () => void;
}

export function TimerControls({
  status,
  isTaskBound = false,
  onToggleTimer,
  onCompleteTask,
  onAbandonTask,
  onExtendRest,
  onEndRestEarly,
  onCompleteTaskFromRest,
}: TimerControlsProps) {
  const isResting = status === 'resting';

  // 休息状态的操作区域
  if (isResting) {
    return (
      <div className="space-y-3 flex flex-col gap-4">
        {/* 延长休息 5 分钟 */}
        <Button
          onClick={onExtendRest}
          fullWidth
          className="bg-sage hover:bg-sage/80"
        >
          <Clock className="w-4 h-4 mr-2" />
          延长5min
        </Button>

        {/* 次要操作 */}
        <div className="flex gap-2">
          {isTaskBound ? (
            /* 任务模式：提前结束休息并完成任务 */
            <Button
              variant="secondary"
              onClick={onCompleteTaskFromRest}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-1.5 text-sage" />
              <span className="text-xs">完成任务</span>
            </Button>
          ) : (
            /* 自由模式：提前结束休息 */
            <Button
              variant="secondary"
              onClick={onEndRestEarly}
              className="flex-1"
            >
              <Coffee className="w-4 h-4 mr-1.5 text-stone" />
              <span className="text-xs">提前结束休息</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // 专注状态的操作区域（原有逻辑）
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isIdle = status === 'idle';
  const isCompleteDisabled = !isTaskBound && isIdle;

  return (
    <div className="space-y-3 flex flex-col gap-4">
      {/* 主操作：开始/暂停 */}
      <Button
        onClick={onToggleTimer}
        fullWidth
        className={isRunning ? 'bg-amber hover:bg-amber-600' : 'bg-coral'}
      >
        {isRunning ? (
          <>
            <Pause className="w-4 h-4 mr-2" />
            暂停专注
          </>
        ) : isPaused ? (
          <>
            <Play className="w-4 h-4 mr-2" />
            继续专注
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            开始专注
          </>
        )}
      </Button>

      {/* 次要操作行 */}
      <div className="flex gap-2">
        {/* 提前完成任务 */}
        <Button
          variant="secondary"
          onClick={onCompleteTask}
          disabled={isCompleteDisabled}
          className={`flex-1 ${isCompleteDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <CheckCircle className={`w-4 h-4 mr-1.5 ${isCompleteDisabled ? 'text-stone/50' : 'text-sage'}`} />
          <span className={`text-xs ${isCompleteDisabled ? 'text-stone/50' : ''}`}>完成</span>
        </Button>

        {/* 放弃任务（始终可用） */}
        <Button
          variant="secondary"
          onClick={onAbandonTask}
          className="flex-1"
        >
          <Square className="w-4 h-4 mr-1.5 text-stone" />
          <span className="text-xs">放弃任务</span>
        </Button>
      </div>
    </div>
  );
}
