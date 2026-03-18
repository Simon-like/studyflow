import { useMemo } from 'react';
import { Card, CardHeader } from '@/components/ui';
import { AchievementCard } from '@/components/business';
import type { UserStats } from '@studyflow/shared';

interface AchievementDef {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: 'coral' | 'sage';
  check: (stats: UserStats) => boolean;
}

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    id: '1', icon: '⚡', title: '专注达人', description: '累计专注超过1小时',
    color: 'coral', check: (s) => s.totalFocusMinutes >= 60,
  },
  {
    id: '2', icon: '🎯', title: '任务完成者', description: '完成10个任务',
    color: 'sage', check: (s) => s.completedTasks >= 10,
  },
  {
    id: '3', icon: '🔥', title: '连续打卡', description: '连续7天打卡',
    color: 'coral', check: (s) => s.longestStreak >= 7,
  },
  {
    id: '4', icon: '📚', title: '知识探索者', description: '累计学习100小时',
    color: 'sage', check: (s) => s.totalFocusMinutes >= 6000,
  },
  {
    id: '5', icon: '🏆', title: '番茄大师', description: '累计完成100个番茄',
    color: 'coral', check: (s) => s.totalPomodoros >= 100,
  },
  {
    id: '6', icon: '🌟', title: '坚持之星', description: '累计学习30天',
    color: 'sage', check: (s) => s.studyDays >= 30,
  },
];

interface AchievementsProps {
  userStats?: UserStats;
}

export function Achievements({ userStats }: AchievementsProps) {
  const achievements = useMemo(() => {
    return ACHIEVEMENT_DEFS.map((def) => ({
      ...def,
      unlocked: userStats ? def.check(userStats) : false,
    }));
  }, [userStats]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <Card className="h-full">
      <CardHeader
        title="成就徽章"
        action={<span className="text-stone text-xs">{unlockedCount}/{achievements.length} 已解锁</span>}
      />
      <div className="grid grid-cols-3 gap-3">
        {achievements.map((ach) => (
          <AchievementCard key={ach.id} {...ach} />
        ))}
      </div>
    </Card>
  );
}
