import { Edit2 } from 'lucide-react';
import { Avatar, Badge } from '@/components/ui';
import type { UserTag } from '@studyflow/shared';

interface ProfileHeaderProps {
  displayName: string;
  avatarUrl?: string;
  studyGoal?: string;
  tags?: UserTag[];
  onEditPress?: () => void;
}

export function ProfileHeader({
  displayName,
  avatarUrl,
  studyGoal = '考研冲刺中',
  tags,
  onEditPress,
}: ProfileHeaderProps) {

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
            {tags && tags.length > 0 ? (
              tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={tag.type === 'achievement' ? 'primary' : tag.type === 'system' ? 'success' : 'default'}
                >
                  {tag.name}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-stone/60">点击编辑资料添加标签</span>
            )}
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
        </div>
      </div>
    </div>
  );
}
