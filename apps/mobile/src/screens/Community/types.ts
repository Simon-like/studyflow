/**
 * Community 页面类型定义
 * @deprecated: Mock 阶段临时定义，将在 Phase 5 统一替换为 @studyflow/shared 中的正式类型
 */

export interface Post {
  id: string;
  author: string;
  avatar: string;
  avatarColor: string;
  time: string;
  group: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  liked: boolean;
}

export type ActiveGroup = string;
