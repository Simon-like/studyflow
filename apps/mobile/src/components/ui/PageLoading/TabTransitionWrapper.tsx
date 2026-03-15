/**
 * Tab 切换过渡包装组件 (React Native)
 * 
 * 用于包裹 Tab 内容，在切换时显示平滑的加载动画
 * 
 * @example
 * ```typescript
 * function Navigation() {
 *   const [activeTab, setActiveTab] = useState('home');
 *   const { getTabLoadingState, startTabTransition, setTabLoading } = useTabTransition('home');
 *   
 *   const handleTabPress = (tabKey: string) => {
 *     startTabTransition(tabKey);
 *     setActiveTab(tabKey);
 *     // 模拟加载
 *     setTabLoading(tabKey, true);
 *     setTimeout(() => setTabLoading(tabKey, false), 1000);
 *   };
 *   
 *   return (
 *     <View style={{ flex: 1 }}>
 *       <TabTransitionWrapper
 *         tabKey={activeTab}
 *         isLoading={getTabLoadingState(activeTab).isLoading}
 *       >
 *         <ActiveScreen />
 *       </TabTransitionWrapper>
 *       <TabBar onTabPress={handleTabPress} />
 *     </View>
 *   );
 * }
 * ```
 */

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
// 动画配置（与 @studyflow/theme 保持一致）
const LOADING_ANIMATION = {
  pageRefresh: {
    fadeOutDuration: 300,
  },
};
import { PageLoadingIndicator } from './PageLoadingIndicator';

interface TabTransitionWrapperProps {
  /** 子组件 */
  children: ReactNode;
  /** 当前 Tab 的 key */
  tabKey: string;
  /** 是否正在加载 */
  isLoading?: boolean;
  /** 切换动画结束回调 */
  onTransitionEnd?: () => void;
}

export function TabTransitionWrapper({
  children,
  tabKey,
  isLoading = false,
  onTransitionEnd,
}: TabTransitionWrapperProps) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [currentTabKey, setCurrentTabKey] = useState(tabKey);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  const transitionDuration = LOADING_ANIMATION.pageRefresh.fadeOutDuration;

  useEffect(() => {
    if (tabKey !== currentTabKey) {
      // Tab 切换开始 - 退出动画
      setIsTransitioning(true);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: transitionDuration / 2,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 8,
          duration: transitionDuration / 2,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 更新内容
        setDisplayChildren(children);
        setCurrentTabKey(tabKey);
        
        // 进入动画
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: transitionDuration / 2,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateAnim, {
            toValue: 0,
            duration: transitionDuration / 2,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsTransitioning(false);
          onTransitionEnd?.();
        });
      });
    } else {
      // 同一 Tab 内更新
      setDisplayChildren(children);
    }
  }, [tabKey, children, currentTabKey, transitionDuration, onTransitionEnd, fadeAnim, translateAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: translateAnim }],
        }}
      >
        {displayChildren}
      </Animated.View>
      
      <PageLoadingIndicator
        visible={isLoading}
        size="small"
        backgroundOpacity={0.6}
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

export default TabTransitionWrapper;
