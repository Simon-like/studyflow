/**
 * Profile 页面自定义 Hooks
 * 
 * 集成双 Token 认证：
 * - 使用 AuthContext 的 logout 方法
 * - 自动清除 token 并跳转登录页
 */

import { useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export function useProfileScreen() {
  const { logout } = useAuth();
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = useCallback(() => {
    setEditMode(prev => !prev);
  }, []);

  const handleMenuPress = useCallback((label: string) => {
    console.log('Menu pressed:', label);
  }, []);

  const handleLogout = useCallback(async () => {
    const performLogout = async () => {
      try {
        await logout();
        // 登出成功后，AuthContext 会自动更新状态
        // Navigation 组件会自动跳转到登录页面
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    if (Platform.OS === 'web') {
      // Expo Web 下 Alert.alert 行为不可靠，直接用 window.confirm
      // eslint-disable-next-line no-restricted-globals
      const confirmed = confirm('确定要退出当前账号吗？');
      if (confirmed) performLogout();
    } else {
      Alert.alert('退出登录', '确定要退出当前账号吗？', [
        { text: '取消', style: 'cancel' },
        { text: '退出', style: 'destructive', onPress: performLogout },
      ]);
    }
  }, [logout]);

  return {
    editMode,
    toggleEditMode,
    handleMenuPress,
    handleLogout,
  };
}
