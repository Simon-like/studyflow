import { Card, CardHeader } from '@/components/ui';
import { AchievementCard } from '@/components/business';
import { ACHIEVEMENTS } from '../constants';

export function Achievements() {
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;

  return (
    <Card className="h-full">
      <CardHeader
        title="成就徽章"
        action={<span className="text-stone text-xs">{unlockedCount}/{ACHIEVEMENTS.length} 已解锁</span>}
      />
      <div className="grid grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((ach) => (
          <AchievementCard key={ach.id} {...ach} />
        ))}
      </div>
    </Card>
  );
}
