/**
 * 页面加载容器组件 (React Native)
 * 
 * 自动处理页面加载状态的容器组件
 * 
 * @example
 * ```typescript
 * function HomeScreen() {
 *   const { isLoading, startLoading, markSuccess } = usePageLoading();
 *   
 *   useEffect(() => {
 *     startLoading();
 *     fetchData().then(() => markSuccess());
 *   }, []);
 *   
 *   return (
 *     <PageLoadingContainer isLoading={isLoading}>
 *       <HomeContent />
 *     </PageLoadingContainer>
 *   );
 * }
 * ```
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { PageLoadingIndicator } from './PageLoadingIndicator';

interface PageLoadingContainerProps {
  /** 子组件 */
  children: ReactNode;
  /** 是否显示加载状态 */
  isLoading: boolean;
  /** 是否使用局部加载（非全屏） */
  local?: boolean;
  /** 额外的样式 */
  style?: any;
}

export function PageLoadingContainer({
  children,
  isLoading,
  local = false,
  style,
}: PageLoadingContainerProps) {
  return (
    <View style={[styles.container, style]}>
      {children}
      <PageLoadingIndicator
        visible={isLoading}
        size={local ? 'small' : 'medium'}
        backgroundOpacity={local ? 0.6 : 0.8}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});

export default PageLoadingContainer;
