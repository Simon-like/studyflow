/**
 * Root Navigator - 应用根导航
 * 
 * 采用 Root/Main 工程范式：
 * - Root: 管理认证状态，决定显示 Auth 还是 Main 流程
 * - Auth: 登录、注册等未认证流程
 * - Main: 已认证后的主应用流程（底部 Tab 导航）
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuthStore } from '../stores/authStore';

// 子导航
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

// 全局页面（需要登录态）
import { SettingsScreen } from '../screens/main/SettingsScreen';
import { TaskDetailScreen } from '../screens/main/TaskDetailScreen';
import { PomodoroTimerScreen } from '../screens/main/PomodoroTimerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAuthStore();

  // 等待认证状态初始化完成
  if (!isInitialized) {
    // 可以在这里显示启动屏
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // ==================== 已认证：主应用流程 ====================
        <>
          {/* Main: 底部 Tab 导航 */}
          <Stack.Screen name="Main" component={MainNavigator} />
          
          {/* 全局页面（覆盖在 Tab 之上） */}
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen 
            name="TaskDetail" 
            component={TaskDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen 
            name="PomodoroTimer" 
            component={PomodoroTimerScreen}
            options={{ 
              animation: 'fade',
              presentation: 'fullScreenModal',
            }}
          />
          {/* TODO: 其他全局页面 */}
          {/* <Stack.Screen name="Notifications" component={NotificationsScreen} /> */}
          {/* <Stack.Screen name="EditProfile" component={EditProfileScreen} /> */}
        </>
      ) : (
        // ==================== 未认证：认证流程 ====================
        <>
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
};
