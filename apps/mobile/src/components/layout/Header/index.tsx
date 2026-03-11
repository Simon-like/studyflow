import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeaderProps } from './types';
import { HEADER_BACKGROUND, HEADER_BORDER_COLOR, HEADER_PADDING } from './constants';
import { colors, fontWeight, fontSize } from '../../../theme';

export * from './types';

export function Header({
  title,
  subtitle,
  left,
  right,
  showBottomBorder = true,
  backgroundColor = HEADER_BACKGROUND,
  style,
}: HeaderProps) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        showBottomBorder && styles.border,
        style,
      ]}
    >
      <View style={styles.side}>{left}</View>
      <View style={styles.center}>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: HEADER_PADDING,
    paddingVertical: HEADER_PADDING,
    minHeight: 56,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: HEADER_BORDER_COLOR,
  },
  side: {
    width: 40,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
