/**
 * Profile 页面自定义 Hooks
 */

import { useState, useCallback } from 'react';

export function useProfileScreen() {
  const [editMode, setEditMode] = useState(false);
  
  const toggleEditMode = useCallback(() => {
    setEditMode(prev => !prev);
  }, []);
  
  const handleMenuPress = useCallback((label: string) => {
    console.log('Menu pressed:', label);
  }, []);
  
  const handleLogout = useCallback(() => {
    console.log('Logout');
  }, []);
  
  return {
    editMode,
    toggleEditMode,
    handleMenuPress,
    handleLogout,
  };
}
