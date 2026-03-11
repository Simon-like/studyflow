import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontWeight } from '../../../theme';

interface LogoutButtonProps {
  onPress: () => void;
}

export function LogoutButton({ onPress }: LogoutButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>退出登录</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border + '60',
  },
  text: {
    fontSize: 15,
    color: colors.error,
    fontWeight: fontWeight.semibold,
  },
});
