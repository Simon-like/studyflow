/**
 * 导航类型定义
 * 采用 Root/Main 工程范式
 */

import { NavigatorScreenParams } from '@react-navigation/native';

// ==================== Auth Navigator ====================
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// ==================== Main Navigator (Bottom Tabs) ====================
export type MainTabParamList = {
  Home: undefined;
  Tasks: undefined;
  Stats: undefined;
  Companion: undefined;
  Community: undefined;
  Profile: undefined;
};

// ==================== Root Navigator ====================
export type RootStackParamList = {
  // 认证流程
  Auth: NavigatorScreenParams<AuthStackParamList>;
  
  // 主应用流程
  Main: NavigatorScreenParams<MainTabParamList>;
  
  // 全局模态/独立页面
  Settings: undefined;
  TaskDetail: { taskId: string };
  PomodoroTimer: { taskId?: string };
  PostDetail: { postId: string };
  UserProfile: { userId: string };
  EditProfile: undefined;
  Notifications: undefined;
  Search: undefined;
};

// ==================== Navigation Props 辅助类型 ====================
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
