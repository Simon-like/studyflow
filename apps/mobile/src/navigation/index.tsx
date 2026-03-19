/**
 * 导航组件
 * 
 * 集成双 Token 认证系统 + Tab 切换动画
 * 1. 使用 AuthProvider 管理全局认证状态
 * 2. 自动处理 token 刷新
 * 3. 未登录时显示登录界面
 * 4. Tab 切换时显示柔和的 loading 动画
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTabTransition } from '@studyflow/shared/loading';
import { TabTransitionWrapper } from '../components/ui/PageLoading';
import { TabBar } from './components/TabBar';
import { TABS, TabKey } from './constants';
import { colors, spacing } from '../theme';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Android底部导航栏高度估计值
const ANDROID_NAV_BAR_HEIGHT = 16;

// 导入页面
import HomeScreen from '../screens/Home';
import TasksScreen from '../screens/Tasks';
import CompanionScreen from '../screens/Companion';
import CommunityScreen from '../screens/Community';
import ProfileScreen from '../screens/Profile';
import StatsScreen from '../screens/Stats';
import AuthModule from '../screens/Auth';

// 可叠加的全屏页面
type OverlayScreen = 'stats' | null;

/**
 * 内部导航组件（使用 AuthContext）
 */
function NavigationContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [overlay, setOverlay] = useState<OverlayScreen>(null);

  // Tab 切换动画管理
  const {
    getTabLoadingState,
    startTabTransition,
    endTabTransition,
    setTabLoading,
  } = useTabTransition('home');

  // 处理 Tab 切换
  const handleTabPress = useCallback((tabKey: TabKey) => {
    if (tabKey === activeTab) return;

    startTabTransition(tabKey);
    setActiveTab(tabKey);
    setTabLoading(tabKey, true);
    setTimeout(() => {
      setTabLoading(tabKey, false);
    }, 600);
  }, [activeTab, startTabTransition, setTabLoading]);

  // 跨页面导航（子页面调用）
  const handleNavigate = useCallback((screen: string) => {
    const tabKeys: Record<string, TabKey> = { home: 'home', tasks: 'tasks', companion: 'companion', community: 'community', profile: 'profile' };
    if (tabKeys[screen]) {
      handleTabPress(tabKeys[screen]);
    } else if (screen === 'stats') {
      setOverlay('stats');
    }
  }, [handleTabPress]);

  // 加载中显示空白（或可以添加 Loading 组件）
  if (authLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
      </View>
    );
  }

  // 未登录 → 显示登录/注册
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <AuthModule />
      </View>
    );
  }

  // 已登录 → 显示主界面
  // Android底部安全区内边距
  const bottomPadding = Platform.OS === 'android' ? ANDROID_NAV_BAR_HEIGHT : 0;

  // 叠加页面（全屏覆盖 tabs）
  if (overlay === 'stats') {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <StatsScreen onBack={() => setOverlay(null)} />
      </View>
    );
  }

  // 渲染当前 tab 页面
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'tasks':
        return <TasksScreen />;
      case 'companion':
        return <CompanionScreen />;
      case 'community':
        return <CommunityScreen />;
      case 'profile':
        return <ProfileScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* 页面内容 */}
      <View style={styles.content}>
        <TabTransitionWrapper
          tabKey={activeTab}
          isLoading={getTabLoadingState(activeTab).isLoading}
          onTransitionEnd={endTabTransition}
        >
          {renderScreen()}
        </TabTransitionWrapper>
      </View>

      {/* 底部导航栏 */}
      <View style={{ paddingBottom: bottomPadding }}>
        <TabBar
          tabs={TABS}
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
      </View>
    </View>
  );
}

/**
 * 导航组件（带 AuthProvider）
 */
export function Navigation() {
  return (
    <AuthProvider>
      <NavigationContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
