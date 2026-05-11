import type { StudyGroup } from "@studyflow/shared";

export type { StudyGroup };

export interface GroupCardProps {
  group: StudyGroup;
  onJoin?: (id: string) => void;
  onLeave?: (id: string) => void;
}
