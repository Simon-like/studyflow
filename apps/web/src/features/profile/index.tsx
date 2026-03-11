import { useProfileData } from './hooks';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileStats } from './components/ProfileStats';
import { WeeklyActivity } from './components/WeeklyActivity';
import { Achievements } from './components/Achievements';
import { StudyGoals } from './components/StudyGoals';

export default function ProfilePage() {
  const { displayName, avatar, stats } = useProfileData();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <ProfileHeader displayName={displayName} avatar={avatar} />
      <ProfileStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyActivity />
        <Achievements />
      </div>

      <StudyGoals />
    </div>
  );
}
