/**
 * Profile 页面自定义 Hooks
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

  const handleLogout = useCallback(() => {
    if (Platform.OS === 'web') {
      // Expo Web 下 Alert.alert 行为不可靠，直接用 window.confirm
      // eslint-disable-next-line no-restricted-globals
      const confirmed = confirm('确定要退出当前账号吗？');
      if (confirmed) logout();
    } else {
      Alert.alert('退出登录', '确定要退出当前账号吗？', [
        { text: '取消', style: 'cancel' },
        { text: '退出', style: 'destructive', onPress: logout },
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
