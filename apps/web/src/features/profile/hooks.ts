import { useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import type { ProfileStats } from './types';
import { Clock, Target, Flame, Award } from 'lucide-react';

export function useProfileData() {
  const { user } = useAuthStore();
  const { todayPomodoros, totalFocusTime } = usePomodoroStore();

  const displayName = user?.nickname || user?.username || '应东林';
  const avatar = displayName[0]?.toUpperCase();
  const totalHours = Math.floor(totalFocusTime / 3600);

  const stats: ProfileStats[] = useMemo(
    () => [
      {
        icon: Clock,
        label: '累计学习',
        value: `${totalHours}h`,
        color: 'coral',
      },
      {
        icon: Target,
        label: '完成番茄',
        value: String(todayPomodoros || 48),
        color: 'sage',
      },
      {
        icon: Flame,
        label: '连续打卡',
        value: '23天',
        color: 'coral',
      },
      {
        icon: Award,
        label: '获得成就',
        value: '3个',
        color: 'sage',
      },
    ],
    [totalHours, todayPomodoros]
  );

  return {
    displayName,
    avatar,
    stats,
  };
}
