import { Edit2 } from 'lucide-react';
import { Avatar, Badge } from '@/components/ui';
import { USER_TAGS } from '../constants';

interface ProfileHeaderProps {
  displayName: string;
  avatar: string;
}

export function ProfileHeader({ displayName, avatar }: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-coral/20 via-warm to-cream rounded-3xl p-6 mb-6">
      <div className="flex items-start gap-5">
        <div className="relative flex-shrink-0">
          <Avatar name={displayName} size="xl" color="bg-coral" className="shadow-coral" />
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow-medium flex items-center justify-center hover:bg-warm transition-all">
            <Edit2 className="w-3.5 h-3.5 text-stone" />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold text-charcoal">{displayName}</h1>
          <p className="text-stone text-sm mt-0.5">考研冲刺中 · 坚持 23 天</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {USER_TAGS.map((tag) => (
              <Badge key={tag} variant={tag === '数学达人' || tag === '专注力强' ? 'primary' : 'success'}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <button className="flex-shrink-0 px-4 py-2 bg-white text-charcoal rounded-xl text-sm font-medium border border-mist hover:bg-warm transition-all">
          编辑资料
        </button>
      </div>
    </div>
  );
}
