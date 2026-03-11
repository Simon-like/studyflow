import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { HomeScreen } from './src/screens/HomeScreen';
import { CompanionScreen } from './src/screens/CompanionScreen';
import { CommunityScreen } from './src/screens/CommunityScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

type TabKey = 'home' | 'companion' | 'community' | 'profile';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

const COLORS = {
  coral: '#E8A87C',
  sage: '#9DB5A0',
  charcoal: '#3D3D3D',
  stone: '#8A8A8A',
  cream: '#FDF8F3',
  white: '#FFFFFF',
  mist: '#C9C5C1',
};

function HomeIcon({ active }: { active: boolean }) {
  const color = active ? COLORS.coral : COLORS.stone;
  return (
    <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 10, height: 10, borderWidth: 2, borderColor: color, transform: [{ rotate: '45deg' }], marginBottom: 2 }} />
      <View style={{ width: 14, height: 10, borderWidth: 2, borderColor: color, borderTopWidth: 0, backgroundColor: active ? `${COLORS.coral}20` : 'transparent' }} />
    </View>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  const color = active ? COLORS.coral : COLORS.stone;
  return (
    <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 20, height: 14, borderRadius: 8, borderWidth: 2, borderColor: color }} />
      <View style={{ width: 0, height: 0, borderLeftWidth: 4, borderRightWidth: 4, borderTopWidth: 5, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: color, marginTop: -1, marginLeft: -6, alignSelf: 'flex-start' }} />
    </View>
  );
}

function UsersIcon({ active }: { active: boolean }) {
  const color = active ? COLORS.coral : COLORS.stone;
  return (
    <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 2 }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: color }} />
      <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: color }} />
    </View>
  );
}

function UserIcon({ active }: { active: boolean }) {
  const color = active ? COLORS.coral : COLORS.stone;
  return (
    <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: color, marginBottom: 2 }} />
      <View style={{ width: 18, height: 8, borderRadius: 9, borderWidth: 2, borderColor: color, borderBottomWidth: 0 }} />
    </View>
  );
}

const TABS: TabConfig[] = [
  { key: 'home', label: '首页', icon: (a) => <HomeIcon active={a} /> },
  { key: 'companion', label: '学伴', icon: (a) => <ChatIcon active={a} /> },
  { key: 'community', label: '社区', icon: (a) => <UsersIcon active={a} /> },
  { key: 'profile', label: '我的', icon: (a) => <UserIcon active={a} /> },
];

const SCREENS: Record<TabKey, React.ComponentType> = {
  home: HomeScreen,
  companion: CompanionScreen,
  community: CommunityScreen,
  profile: ProfileScreen,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const ActiveScreen = SCREENS[activeTab];

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Screen Content */}
        <View style={styles.content}>
          <ActiveScreen />
        </View>

        {/* Bottom Tab Bar */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tabItem}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                <View style={styles.tabIconWrapper}>
                  {isActive && <View style={styles.tabActiveIndicator} />}
                  {tab.icon(isActive)}
                </View>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: `${COLORS.mist}40`,
    paddingBottom: Platform.OS === 'ios' ? 0 : 8,
    paddingTop: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  tabIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },
  tabActiveIndicator: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: `${COLORS.coral}15`,
  },
  tabLabel: {
    fontSize: 11,
    color: COLORS.stone,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.coral,
    fontWeight: '600',
  },
});
