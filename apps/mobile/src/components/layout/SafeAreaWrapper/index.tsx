import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../theme';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarColor?: string;
  edge?: ('top' | 'bottom' | 'left' | 'right')[];
}

/**
 * 安全区域包装器
 * 处理顶部状态栏和底部导航栏的安全区域
 * 确保内容不会被系统 UI 遮挡
 */
export function SafeAreaWrapper({
  children,
  backgroundColor = colors.background,
  statusBarColor = colors.background,
  edge = ['top', 'bottom', 'left', 'right'],
}: SafeAreaWrapperProps) {
  const insets = useSafeAreaInsets();

  const paddingStyles = {
    paddingTop: edge.includes('top') ? insets.top : 0,
    paddingBottom: edge.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edge.includes('left') ? insets.left : 0,
    paddingRight: edge.includes('right') ? insets.right : 0,
  };

  return (
    <View style={[styles.container, { backgroundColor }, paddingStyles]}>
      {/* Android 状态栏背景色 */}
      {Platform.OS === 'android' && (
        <View
          style={[
            styles.statusBar,
            {
              backgroundColor: statusBarColor,
              height: insets.top,
            },
          ]}
        />
      )}
      {children}
    </View>
  );
}

/**
 * 获取实际的安全区域高度（不包含状态栏）
 */
export function useSafeAreaPadding() {
  const insets = useSafeAreaInsets();

  return {
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
    // Android 底部系统导航栏高度
    androidNavBarHeight: Platform.OS === 'android' ? insets.bottom : 0,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
});
