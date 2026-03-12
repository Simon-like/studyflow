import { Button } from '@/components/ui';
import type { TimerStatus } from '../types';

interface TimerControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function TimerControls({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
}: TimerControlsProps) {
  return (
    <div className="flex gap-3">
      {status === 'idle' && (
        <Button onClick={onStart} fullWidth>
          开始专注
        </Button>
      )}
      {status === 'running' && (
        <Button onClick={onPause} fullWidth className=''>
          暂停
        </Button>
      )}
      {status === 'paused' && (
        <Button onClick={onResume} fullWidth>
          继续
        </Button>
      )}
      <Button variant="secondary" onClick={onStop}>
        结束
      </Button>
    </div>
  );
}
