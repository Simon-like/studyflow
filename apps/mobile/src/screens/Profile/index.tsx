/**
 * Profile 页面
 * 个人中心
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import {
  ProfileHeader,
  StatsCard,
  WeeklyChart,
  Achievements,
  StudyGoals,
  MenuList,
  LogoutButton,
} from './components';
import { useProfileScreen } from './hooks';
import { spacing } from '../../theme';

export default function ProfileScreen() {
  const { toggleEditMode, handleMenuPress, handleLogout } = useProfileScreen();
  
  return (
    <ScreenContainer>
      {/* 个人资料头部 */}
      <ProfileHeader onEditPress={toggleEditMode} />
      
      {/* 统计数据卡片 */}
      <StatsCard />
      
      {/* 本周学习时长 */}
      <View style={styles.section}>
        <WeeklyChart />
      </View>
      
      {/* 成就徽章 */}
      <View style={styles.section}>
        <Achievements />
      </View>
      
      {/* 学习目标 */}
      <View style={styles.section}>
        <StudyGoals />
      </View>
      
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
  section: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
