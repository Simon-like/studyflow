import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Platform } from 'react-native';
import { ScreenContainerProps } from './types';
import { DEFAULT_BACKGROUND, DEFAULT_PADDING } from './constants';

export * from './types';

// 状态栏高度（Android需要额外处理）
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;

export function ScreenContainer({
  children,
  scrollable = true,
  safeArea = true,
  padding = true,
  backgroundColor = DEFAULT_BACKGROUND,
  style,
  contentContainerStyle,
  scrollViewProps,
}: ScreenContainerProps) {
  // 计算顶部安全区内边距
  const topPadding = safeArea && Platform.OS === 'android' ? STATUS_BAR_HEIGHT : 0;

  const content = scrollable ? (
    <ScrollView
      style={styles.flex}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        padding && styles.padding,
        { paddingTop: topPadding },
        contentContainerStyle,
      ]}
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, padding && styles.padding, { paddingTop: topPadding }, contentContainerStyle]}>
      {children}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: DEFAULT_PADDING,
  },
});
