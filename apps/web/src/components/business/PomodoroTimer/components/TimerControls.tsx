import { Button } from '@/components/ui';
import type { TimerStatus } from '../types';
import { Play, Pause, CheckCircle, RotateCcw, XCircle } from 'lucide-react';

interface TimerControlsProps {
  status: TimerStatus;
  onToggleTimer: () => void;
  onCompleteTask: () => void;
  onResetTimer: () => void;
  onAbandonTask: () => void;
}

export function TimerControls({
  status,
  onToggleTimer,
  onCompleteTask,
  onResetTimer,
  onAbandonTask,
}: TimerControlsProps) {
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isIdle = status === 'idle';

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
          className="flex-1"
          disabled={isIdle}
        >
          <CheckCircle className="w-4 h-4 mr-1.5 text-sage" />
          <span className="text-xs">完成</span>
        </Button>

        {/* 重新计时 */}
        <Button 
          variant="secondary" 
          onClick={onResetTimer}
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-1.5 text-coral" />
          <span className="text-xs">重置</span>
        </Button>

        {/* 放弃任务 */}
        <Button 
          variant="secondary" 
          onClick={onAbandonTask}
          className="flex-1"
          disabled={isIdle}
        >
          <XCircle className="w-4 h-4 mr-1.5 text-stone" />
          <span className="text-xs">放弃</span>
        </Button>
      </div>
    </div>
  );
}
