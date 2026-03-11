import { GroupCard } from '@/components/business';
import type { StudyGroup } from '@/types';
import { CreateGroupCard } from './CreateGroupCard';

interface GroupsTabProps {
  groups: StudyGroup[];
  onJoin: (id: string) => void;
}

export function GroupsTab({ groups, onJoin }: GroupsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <GroupCard key={group.id} {...group} onJoin={onJoin} />
      ))}
      <CreateGroupCard />
    </div>
  );
}
