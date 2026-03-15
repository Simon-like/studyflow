import { Edit2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge } from '@/components/ui';
import { USER_TAGS } from '../constants';

interface ProfileHeaderProps {
  displayName: string;
  avatarUrl?: string;
  studyGoal?: string;
  onEditPress?: () => void;
}

export function ProfileHeader({
  displayName,
  avatarUrl,
  studyGoal = '考研冲刺中',
  onEditPress,
}: ProfileHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-coral/20 via-warm to-cream rounded-3xl p-8 mb-8">
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar
            name={displayName}
            src={avatarUrl}
            size="xl"
            color="bg-coral"
            className="shadow-coral"
          />
          <button
            onClick={onEditPress}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow-medium flex items-center justify-center hover:bg-warm transition-all"
            title="编辑头像"
          >
            <Edit2 className="w-3.5 h-3.5 text-stone" />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold text-charcoal">
            {displayName}
          </h1>
          <p className="text-stone text-sm mt-0.5 truncate">
            {studyGoal} · <span className="text-coral">坚持学习中</span>
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {USER_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={tag === '数学达人' || tag === '专注力强' ? 'primary' : 'success'}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={onEditPress}
            className="px-4 py-2 bg-white text-charcoal rounded-xl text-sm font-medium border border-mist hover:bg-warm transition-all"
          >
            编辑资料
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="px-4 py-2 bg-white/50 text-stone rounded-xl text-sm font-medium border border-mist/50 hover:bg-white transition-all flex items-center justify-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            设置
          </button>
        </div>
      </div>
    </div>
  );
}
