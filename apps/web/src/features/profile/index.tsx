import { useProfileData, useEditProfileModal } from './hooks';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileStats } from './components/ProfileStats';
import { WeeklyActivity } from './components/WeeklyActivity';
import { Achievements } from './components/Achievements';
import { StudyGoals } from './components/StudyGoals';
import { EditProfileModal } from './components/EditProfileModal';

export default function ProfilePage() {
  const { displayName, avatarUrl, studyGoal, stats, isLoading } = useProfileData();
  const {
    isOpen,
    openModal,
    closeModal,
    profile,
    isSubmitting,
    handleSubmit,
    handleAvatarChange,
  } = useEditProfileModal();

  if (isLoading) {
    return (
      <div className="p-10 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-40 bg-mist/30 rounded-3xl" />
          <div className="h-24 bg-mist/30 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-mist/30 rounded-2xl" />
            <div className="h-64 bg-mist/30 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-10 max-w-6xl mx-auto">
        <ProfileHeader
          displayName={displayName}
          avatarUrl={avatarUrl}
          studyGoal={studyGoal}
          onEditPress={openModal}
        />
        <ProfileStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WeeklyActivity />
          <Achievements />
        </div>

        <StudyGoals />
      </div>

      <EditProfileModal
        isOpen={isOpen}
        onClose={closeModal}
        profile={profile}
        onSubmit={handleSubmit}
        onAvatarChange={handleAvatarChange}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
