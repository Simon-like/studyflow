/**
 * Loading 相关类型定义
 * 跨平台共享的 loading 状态类型
 */

/**
 * 页面加载状态
 */
export type PageLoadingState = 
  | 'idle'        // 初始状态
  | 'loading'     // 加载中
  | 'refreshing'  // 刷新中（已有数据，正在更新）
  | 'success'     // 加载成功
  | 'error';      // 加载失败

/**
 * 加载配置选项
 */
export interface LoadingOptions {
  /** 延迟显示loading的时间（毫秒），避免快速响应时的闪烁 */
  delay?: number;
  /** 最小显示时间（毫秒），避免loading一闪而过 */
  minDisplayTime?: number;
  /** 是否启用刷新模式（保留旧数据显示loading） */
  refreshMode?: boolean;
}

/**
 * 页面加载状态管理器返回类型
 */
export interface PageLoadingManager {
  /** 当前加载状态 */
  state: PageLoadingState;
  /** 是否显示 loading UI */
  isLoading: boolean;
  /** 是否是刷新模式（已有数据时刷新） */
  isRefreshing: boolean;
  /** 开始加载 */
  startLoading: () => void;
  /** 开始刷新 */
  startRefreshing: () => void;
  /** 标记加载成功 */
  markSuccess: () => void;
  /** 标记加载失败 */
  markError: () => void;
  /** 重置状态 */
  reset: () => void;
}

/**
 * 延迟加载配置
 */
export interface DelayedLoadingConfig {
  /** 延迟时间（毫秒） */
  delay: number;
  /** 最小显示时间（毫秒） */
  minDisplayTime: number;
}
