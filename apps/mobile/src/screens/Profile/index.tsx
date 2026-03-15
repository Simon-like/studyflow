/**
 * Profile 页面
 * 个人中心
 */

import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import {
  ProfileHeader,
  StatsCard,
  WeeklyChart,
  Achievements,
  // StudyGoals, // 功能搁置
  MenuList,
  LogoutButton,
} from './components';
import { useProfileScreen, useProfileData } from './hooks';
import { EditProfileScreen } from './EditProfileScreen';
import { SettingsScreen } from './SettingsScreen';
import { spacing, colors } from '../../theme';

type ProfileScreenState = 'main' | 'edit' | 'settings';

export default function ProfileScreen() {
  const [screenState, setScreenState] = useState<ProfileScreenState>('main');
  const { handleLogout } = useProfileScreen();
  const { displayName, avatarUrl, subtitle, tags, stats, isLoading } = useProfileData();

  // 处理菜单点击
  const handleMenuPress = (label: string) => {
    switch (label) {
      case '学习统计':
        // 导航到统计页面
        break;
      case '成就中心':
        // 导航到成就页面
        break;
      case '设置':
        setScreenState('settings');
        break;
      case '帮助与反馈':
        // 导航到帮助页面
        break;
      default:
        break;
    }
  };

  // 加载状态
  if (isLoading && screenState === 'main') {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  // 编辑资料页面
  if (screenState === 'edit') {
    return <EditProfileScreen onBack={() => setScreenState('main')} />;
  }

  // 设置页面
  if (screenState === 'settings') {
    return <SettingsScreen onBack={() => setScreenState('main')} />;
  }

  // 主页面
  return (
    <ScreenContainer>
      {/* 个人资料头部 */}
      <ProfileHeader 
        onEditPress={() => setScreenState('edit')} 
        displayName={displayName}
        avatarUrl={avatarUrl}
        subtitle={subtitle}
        tags={tags}
      />
      
      {/* 统计数据卡片 */}
      <StatsCard stats={stats} />
      
      {/* 本周学习时长 */}
      <View style={styles.section}>
        <WeeklyChart />
      </View>
      
      {/* 成就徽章 */}
      <View style={styles.section}>
        <Achievements />
      </View>
      
      {/* 学习目标 - 功能搁置 */}
      {/* <View style={styles.section}>
        <StudyGoals />
      </View> */}
      
      {/* 菜单列表 */}
      <View style={styles.section}>
        <MenuList onItemPress={handleMenuPress} />
      </View>
      
      {/* 退出登录 */}
      <LogoutButton onPress={handleLogout} />
      
      <View style={styles.bottomPadding} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
