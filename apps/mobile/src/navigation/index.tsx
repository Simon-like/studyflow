/**
 * 导航组件
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TabBar } from './components/TabBar';
import { TABS, TabKey } from './constants';
import { colors } from '../theme';

// 导入页面
import HomeScreen from '../screens/Home';
import CompanionScreen from '../screens/Companion';
import CommunityScreen from '../screens/Community';
import ProfileScreen from '../screens/Profile';

const SCREENS: Record<TabKey, React.ComponentType> = {
  home: HomeScreen,
  companion: CompanionScreen,
  community: CommunityScreen,
  profile: ProfileScreen,
};

export function Navigation() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const ActiveScreen = SCREENS[activeTab];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* 页面内容 */}
      <View style={styles.content}>
        <ActiveScreen />
      </View>
      
      {/* 底部导航栏 */}
      <TabBar
        tabs={TABS}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </View>
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
