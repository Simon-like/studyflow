import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { ScreenContainerProps } from './types';
import { DEFAULT_BACKGROUND, DEFAULT_PADDING } from './constants';

export * from './types';

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
  const content = scrollable ? (
    <ScrollView
      style={styles.flex}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        padding && styles.padding,
        contentContainerStyle,
      ]}
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, padding && styles.padding, contentContainerStyle]}>
      {children}
    </View>
  );

  const container = (
    <View style={[styles.container, { backgroundColor }, style]}>
      {content}
    </View>
  );

  if (safeArea) {
    // 不使用SafeAreaView，因为React Native默认提供
    return container;
  }

  return container;
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
