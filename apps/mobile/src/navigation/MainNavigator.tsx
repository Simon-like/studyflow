/**
 * 主应用导航
 * 采用底部 Tab 导航结构
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from '../types/navigation';

// 主页面
import { HomeScreen } from '../screens/main/HomeScreen';
import { TasksScreen } from '../screens/main/TasksScreen';
import { StatsScreen } from '../screens/main/StatsScreen';
import { CompanionScreen } from '../screens/main/CompanionScreen';
import { CommunityScreen } from '../screens/main/CommunityScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Tab 图标映射
const tabIcons: Record<keyof MainTabParamList, { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap }> = {
  Home: { focused: 'home', unfocused: 'home-outline' },
  Tasks: { focused: 'list', unfocused: 'list-outline' },
  Stats: { focused: 'stats-chart', unfocused: 'stats-chart-outline' },
  Companion: { focused: 'chatbubbles', unfocused: 'chatbubbles-outline' },
  Community: { focused: 'people', unfocused: 'people-outline' },
  Profile: { focused: 'person', unfocused: 'person-outline' },
};

// Tab 标签映射
const tabLabels: Record<keyof MainTabParamList, string> = {
  Home: '首页',
  Tasks: '任务',
  Stats: '统计',
  Companion: 'AI伙伴',
  Community: '社区',
  Profile: '我的',
};

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = tabIcons[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B6B', // 珊瑚色主题
        tabBarInactiveTintColor: '#999999',
        tabBarLabel: tabLabels[route.name],
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Companion" component={CompanionScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
