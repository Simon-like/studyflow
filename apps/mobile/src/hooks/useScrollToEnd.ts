/**
 * 自动滚动到底部 Hook
 * 用于聊天界面等场景
 */

import { useRef, useCallback } from 'react';
import { ScrollView } from 'react-native';

interface UseScrollToEndReturn {
  scrollViewRef: React.RefObject<ScrollView | null>;
  scrollToEnd: (animated?: boolean) => void;
}

export function useScrollToEnd(): UseScrollToEndReturn {
  const scrollViewRef = useRef<ScrollView | null>(null);
  
  const scrollToEnd = useCallback((animated = true) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated });
    }, 100);
  }, []);
  
  return {
    scrollViewRef,
    scrollToEnd,
  };
}
