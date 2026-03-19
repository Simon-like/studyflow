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
  MenuList,
  LogoutButton,
} from './components';
import { useProfileScreen, useProfileData } from './hooks';
import { EditProfileScreen } from './EditProfileScreen';
import { SettingsScreen } from './SettingsScreen';
import StatsScreen from '../Stats';
import { spacing, colors } from '../../theme';

type ProfileScreenState = 'main' | 'edit' | 'settings' | 'stats';

export default function ProfileScreen() {
  const [screenState, setScreenState] = useState<ProfileScreenState>('main');
  const { handleLogout } = useProfileScreen();
  const { displayName, avatarUrl, subtitle, tags, stats, isLoading } = useProfileData();

  // 处理菜单点击
  const handleMenuPress = (label: string) => {
    switch (label) {
      case '学习统计':
        setScreenState('stats');
        break;
      case '设置':
        setScreenState('settings');
        break;
      case '帮助与反馈':
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

  if (screenState === 'edit') {
    return <EditProfileScreen onBack={() => setScreenState('main')} />;
  }

  if (screenState === 'settings') {
    return <SettingsScreen onBack={() => setScreenState('main')} />;
  }

  if (screenState === 'stats') {
    return <StatsScreen onBack={() => setScreenState('main')} />;
  }

  return (
    <ScreenContainer>
      <ProfileHeader
        onEditPress={() => setScreenState('edit')}
        displayName={displayName}
        avatarUrl={avatarUrl}
        subtitle={subtitle}
        tags={tags}
      />

      <StatsCard stats={stats} />

      <View style={styles.section}>
        <WeeklyChart />
      </View>

      <View style={styles.section}>
        <Achievements userStats={stats} />
      </View>

      <View style={styles.section}>
        <MenuList onItemPress={handleMenuPress} />
      </View>

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
