/**
 * 社交登录按钮组
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, fontSize } from '../../../theme';

const SOCIAL_ITEMS = [
  { label: '微信', color: '#07C160', symbol: 'W' },
  { label: 'QQ', color: '#12B7F5', symbol: 'Q' },
  { label: 'Apple', color: colors.text, symbol: 'A' },
];

export function SocialLogin() {
  return (
    <View style={styles.container}>
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>或</Text>
        <View style={styles.line} />
      </View>
      <View style={styles.buttons}>
        {SOCIAL_ITEMS.map((item) => (
          <TouchableOpacity key={item.label} style={styles.socialBtn} activeOpacity={0.7}>
            <Text style={[styles.socialIcon, { color: item.color }]}>{item.symbol}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.xl,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginHorizontal: spacing.lg,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.xl,
    backgroundColor: colors.warm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
});
