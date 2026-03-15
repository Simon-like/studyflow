/**
 * Tab 切换加载管理 Hook
 * 
 * 专门用于处理 Tab 切换时的加载状态管理
 * 支持多个 tab 的独立加载状态
 * 
 * @example
 * ```typescript
 * // Mobile端 - 自定义 Tab
 * const { getTabLoadingState } = useTabTransition();
 * 
 * <Tab.Screen 
 *   isLoading={getTabLoadingState('home').isLoading}
 * />
 * ```
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { LoadingOptions } from './types';

interface TabLoadingState {
  isLoading: boolean;
  isVisible: boolean;
}

interface TabTransitionOptions extends LoadingOptions {
  /** 切换动画时长（毫秒） */
  transitionDuration?: number;
}

interface TabTransitionManager {
  /** 当前活跃 tab */
  activeTab: string;
  /** 上一个 tab */
  previousTab: string | null;
  /** 是否正在切换 tab */
  isTransitioning: boolean;
  /** 获取指定 tab 的加载状态 */
  getTabLoadingState: (tabKey: string) => TabLoadingState;
  /** 开始 tab 切换 */
  startTabTransition: (toTab: string) => void;
  /** 结束 tab 切换 */
  endTabTransition: () => void;
  /** 设置指定 tab 的加载状态 */
  setTabLoading: (tabKey: string, isLoading: boolean) => void;
}

const DEFAULT_OPTIONS: Required<TabTransitionOptions> = {
  delay: 150,
  minDisplayTime: 400,
  refreshMode: false,
  transitionDuration: 300,
};

/**
 * Tab 切换加载管理 Hook
 */
export function useTabTransition(
  initialTab: string = '',
  options: TabTransitionOptions = {}
): TabTransitionManager {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [previousTab, setPreviousTab] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tabLoadingStates, setTabLoadingStates] = useState<Record<string, TabLoadingState>>({});
  
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimersRef = useRef<Record<string, NodeJS.Timeout>>({});

  // 清理定时器
  const clearTransitionTimer = useCallback(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  // 开始 tab 切换
  const startTabTransition = useCallback((toTab: string) => {
    if (toTab === activeTab) return;
    
    clearTransitionTimer();
    setPreviousTab(activeTab);
    setActiveTab(toTab);
    setIsTransitioning(true);
    
    // 设置切换动画超时
    transitionTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, config.transitionDuration);
  }, [activeTab, config.transitionDuration, clearTransitionTimer]);

  // 结束 tab 切换
  const endTabTransition = useCallback(() => {
    clearTransitionTimer();
    setIsTransitioning(false);
  }, [clearTransitionTimer]);

  // 设置指定 tab 的加载状态
  const setTabLoading = useCallback((tabKey: string, isLoading: boolean) => {
    // 清除之前的定时器
    if (loadingTimersRef.current[tabKey]) {
      clearTimeout(loadingTimersRef.current[tabKey]);
    }

    if (isLoading) {
      // 延迟显示 loading
      loadingTimersRef.current[tabKey] = setTimeout(() => {
        setTabLoadingStates(prev => ({
          ...prev,
          [tabKey]: { isLoading: true, isVisible: true }
        }));
      }, config.delay);
    } else {
      // 直接隐藏 loading
      setTabLoadingStates(prev => ({
        ...prev,
        [tabKey]: { isLoading: false, isVisible: false }
      }));
    }
  }, [config.delay]);

  // 获取指定 tab 的加载状态
  const getTabLoadingState = useCallback((tabKey: string): TabLoadingState => {
    return tabLoadingStates[tabKey] || { isLoading: false, isVisible: false };
  }, [tabLoadingStates]);

  // 清理副作用
  useEffect(() => {
    return () => {
      clearTransitionTimer();
      Object.values(loadingTimersRef.current).forEach(timer => clearTimeout(timer));
    };
  }, [clearTransitionTimer]);

  return {
    activeTab,
    previousTab,
    isTransitioning,
    getTabLoadingState,
    startTabTransition,
    endTabTransition,
    setTabLoading,
  };
}

export default useTabTransition;
