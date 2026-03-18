import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileStats } from './components/ProfileStats';
import { Achievements } from './components/Achievements';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { displayName, avatarUrl, studyGoal, tags, stats, rawStats, isLoading } = useUser();

  const handleEditPress = () => {
    navigate('/profile/edit');
  };

  if (isLoading) {
    return (
      <div className="p-10 max-w-6xl mx-auto">
        <div className="animate-pulse mb-8">
          <div className="h-40 bg-mist/30 rounded-3xl" />
        </div>
        <div className="animate-pulse mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-mist/30 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-mist/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <ProfileHeader
        displayName={displayName}
        avatarUrl={avatarUrl}
        studyGoal={studyGoal}
        tags={tags}
        onEditPress={handleEditPress}
      />
      <ProfileStats stats={stats} />
      <Achievements userStats={rawStats} />
    </div>
  );
}
