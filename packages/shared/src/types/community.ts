/**
 * StudyFlow 社区模块共享类型定义
 * 
 * 这是前后端的唯一真相源。
 * 前端从 @studyflow/shared 导入，后端 Java DTO 必须与此结构保持一致。
 */

import type { User } from "./index";

// ============================================
// 作者信息（精简用户信息，用于帖子/评论展示）
// ============================================
export interface PostAuthor {
  id: string;
  username: string;
  nickname?: string;
  avatarUrl?: string;
}

// ============================================
// 帖子相关类型
// ============================================

export interface Post {
  id: string;
  userId: string;
  author?: PostAuthor;
  content: string;
  images?: string[];
  tags?: string[];

  // 关联学习数据（可选，发帖时可关联当日学习数据）
  studyTime?: number;        // 专注时长（分钟）
  taskCount?: number;        // 完成任务数
  pomodoroCount?: number;    // 完成番茄数

  // 互动数据
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;         // 当前用户是否点赞

  // 时间戳
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  content: string;
  images?: string[];
  tags?: string[];
  // 关联学习数据开关
  attachStudyData?: boolean;
}

export interface UpdatePostRequest {
  content?: string;
  images?: string[];
  tags?: string[];
}

// ============================================
// 评论相关类型
// ============================================

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  author?: PostAuthor;
  content: string;

  // 二级回复支持
  parentId?: string;
  replies?: Comment[];       // 前3条回复（展开后加载更多）
  replyCount?: number;       // 总回复数

  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
  parentId?: string;         // 回复某条评论时使用
}

// ============================================
// 点赞相关类型
// ============================================

export interface LikeResponse {
  liked: boolean;
  likeCount: number;
}

// ============================================
// 学习小组相关类型
// ============================================

export interface StudyGroup {
  id: string;
  creatorId: string;
  creator?: PostAuthor;
  name: string;
  description?: string;
  coverImage?: string;
  category: string;          // 考研、编程、英语等

  // 成员信息
  memberCount: number;
  maxMembers: number;
  isJoined?: boolean;        // 当前用户是否已加入

  // 小组目标（可选）
  dailyGoal?: string;        // 如 "6h"

  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  coverImage?: string;
  category: string;
  maxMembers?: number;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  coverImage?: string;
  maxMembers?: number;
}

// ============================================
// 社区分页查询参数
// ============================================

export interface PostsParams {
  page?: number;
  size?: number;
  tag?: string;
  groupId?: string;          // 按小组筛选
}

export interface GroupsParams {
  page?: number;
  size?: number;
  category?: string;
}

// ============================================
// 社区模块专用分页响应（复用通用 PaginatedData）
// ============================================

export type PostsResponse = {
  list: Post[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
};

export type CommentsResponse = {
  list: Comment[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
};

export type GroupsResponse = {
  list: StudyGroup[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
};

// ============================================
// 社区 Tab 类型（前端专用）
// ============================================

export type CommunityTab = "feed" | "groups";

// ============================================
// 内容分类标签（预设）
// ============================================

export const COMMUNITY_TAGS = [
  "打卡成功",
  "学习方法",
  "考研",
  "编程",
  "英语",
  "高数",
  "备考经验",
  "专注提升",
  "时间管理",
  "心态调整",
] as const;

export const GROUP_CATEGORIES = [
  "考研",
  "编程",
  "英语",
  "数学",
  "考证",
  "阅读",
  "运动",
  "早起",
  "夜猫子",
  "其他",
] as const;

export type CommunityTag = (typeof COMMUNITY_TAGS)[number];
export type GroupCategory = (typeof GROUP_CATEGORIES)[number];
