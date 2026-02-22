/**
 * 移动端本地存储封装
 * 使用 React Native 的 AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  /**
   * 获取存储项
   */
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  /**
   * 设置存储项
   */
  set: async <T>(key: string, value: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  /**
   * 删除存储项
   */
  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  /**
   * 清空所有存储
   */
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },

  /**
   * 获取多个存储项
   */
  multiGet: async (keys: string[]): Promise<readonly [string, string | null][]> => {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.error('Storage multiGet error:', error);
      return [];
    }
  },

  /**
   * 设置多个存储项
   */
  multiSet: async (keyValues: [string, string][]): Promise<void> => {
    try {
      await AsyncStorage.multiSet(keyValues);
    } catch (error) {
      console.error('Storage multiSet error:', error);
    }
  },

  /**
   * 删除多个存储项
   */
  multiRemove: async (keys: string[]): Promise<void> => {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Storage multiRemove error:', error);
    }
  },
};
