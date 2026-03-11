import type { Post, StudyGroup } from '@/types';

export type CommunityTab = 'feed' | 'groups';

export interface CommunityData {
  posts: Post[];
  groups: StudyGroup[];
}
