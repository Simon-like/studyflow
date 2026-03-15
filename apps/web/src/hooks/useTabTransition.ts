/**
 * Tab 切换加载管理 Hook
 * 
 * 专门用于处理 Tab 切换时的加载状态管理
 * 支持多个 tab 的独立加载状态
 */

import { useState, useCallback, useRef, useEffect } from 'react';

interface LoadingOptions {
  delay?: number;
  minDisplayTime?: number;
  refreshMode?: boolean;
}

interface TabLoadingState {
  isLoading: boolean;
  isVisible: boolean;
}

interface TabTransitionOptions extends LoadingOptions {
  transitionDuration?: number;
}

interface TabTransitionManager {
  activeTab: string;
  previousTab: string | null;
  isTransitioning: boolean;
  getTabLoadingState: (tabKey: string) => TabLoadingState;
  startTabTransition: (toTab: string) => void;
  endTabTransition: () => void;
  setTabLoading: (tabKey: string, isLoading: boolean) => void;
}

const DEFAULT_OPTIONS: Required<TabTransitionOptions> = {
  delay: 150,
  minDisplayTime: 400,
  refreshMode: false,
  transitionDuration: 300,
};

export function useTabTransition(
  initialTab: string = '',
  options: TabTransitionOptions = {}
): TabTransitionManager {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [previousTab, setPreviousTab] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tabLoadingStates, setTabLoadingStates] = useState<Record<string, TabLoadingState>>({});
  
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const clearTransitionTimer = useCallback(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  const startTabTransition = useCallback((toTab: string) => {
    if (toTab === activeTab) return;
    
    clearTransitionTimer();
    setPreviousTab(activeTab);
    setActiveTab(toTab);
    setIsTransitioning(true);
    
    transitionTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, config.transitionDuration);
  }, [activeTab, config.transitionDuration, clearTransitionTimer]);

  const endTabTransition = useCallback(() => {
    clearTransitionTimer();
    setIsTransitioning(false);
  }, [clearTransitionTimer]);

  const setTabLoading = useCallback((tabKey: string, isLoading: boolean) => {
    if (loadingTimersRef.current[tabKey]) {
      clearTimeout(loadingTimersRef.current[tabKey]);
    }

    if (isLoading) {
      loadingTimersRef.current[tabKey] = setTimeout(() => {
        setTabLoadingStates(prev => ({
          ...prev,
          [tabKey]: { isLoading: true, isVisible: true }
        }));
      }, config.delay);
    } else {
      setTabLoadingStates(prev => ({
        ...prev,
        [tabKey]: { isLoading: false, isVisible: false }
      }));
    }
  }, [config.delay]);

  const getTabLoadingState = useCallback((tabKey: string): TabLoadingState => {
    return tabLoadingStates[tabKey] || { isLoading: false, isVisible: false };
  }, [tabLoadingStates]);

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
