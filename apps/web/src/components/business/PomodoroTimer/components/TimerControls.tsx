import { Button } from '@/components/ui';
import type { TimerStatus } from '../types';
import { Play, Pause, CheckCircle, Square } from 'lucide-react';

interface TimerControlsProps {
  status: TimerStatus;
  isTaskBound?: boolean;
  onToggleTimer: () => void;
  onCompleteTask: () => void;
  onAbandonTask: () => void;
}

export function TimerControls({
  status,
  isTaskBound = false,
  onToggleTimer,
  onCompleteTask,
  onAbandonTask,
}: TimerControlsProps) {
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isIdle = status === 'idle';
  // 完成按钮禁用条件：未绑定任务且计时器未运行（自由模式下必须开始计时后才能完成）
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
