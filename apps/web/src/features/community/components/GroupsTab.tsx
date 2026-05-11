import { GroupCard } from "@/components/business";
import type { StudyGroup } from "@studyflow/shared";
import { CreateGroupCard } from "./CreateGroupCard";

interface GroupsTabProps {
  groups: StudyGroup[];
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
  onCreateGroup?: () => void;
  isLoading?: boolean;
}

export function GroupsTab({
  groups,
  onJoin,
  onLeave,
  onCreateGroup,
  isLoading,
}: GroupsTabProps) {
  if (isLoading && groups.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 animate-pulse shadow-card h-48"
          >
            <div className="w-12 h-12 bg-mist/30 rounded-xl mb-4" />
            <div className="h-4 bg-mist/30 rounded w-24 mb-2" />
            <div className="h-3 bg-mist/30 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          onJoin={onJoin}
          onLeave={onLeave}
        />
      ))}
      <CreateGroupCard onClick={onCreateGroup} />
    </div>
  );
}
