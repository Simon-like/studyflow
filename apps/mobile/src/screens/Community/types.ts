/**
 * Community 页面类型定义
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
