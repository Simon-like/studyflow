/**
 * 导航组件
 * 
 * 集成双 Token 认证系统：
 * 1. 使用 AuthProvider 管理全局认证状态
 * 2. 自动处理 token 刷新
 * 3. 未登录时显示登录界面
 */

import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
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
import AuthModule from '../screens/Auth';

const SCREENS: Record<TabKey, React.ComponentType> = {
  home: HomeScreen,
  tasks: TasksScreen,
  companion: CompanionScreen,
  community: CommunityScreen,
  profile: ProfileScreen,
};

/**
 * 内部导航组件（使用 AuthContext）
 */
function NavigationContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const ActiveScreen = SCREENS[activeTab];

  // 加载中显示空白（或可以添加 Loading 组件）
  if (isLoading) {
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

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* 页面内容 */}
      <View style={styles.content}>
        <ActiveScreen />
      </View>

      {/* 底部导航栏 */}
      <View style={{ paddingBottom: bottomPadding }}>
        <TabBar
          tabs={TABS}
          activeTab={activeTab}
          onTabPress={setActiveTab}
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
