import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { colors, radius, spacing, fontWeight } from '../../../theme';
import { DEFAULT_GROUP } from '../constants';

interface GroupBannerProps {
  onJoin: () => void;
}

export function GroupBanner({ onJoin }: GroupBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.emoji}>{DEFAULT_GROUP.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{DEFAULT_GROUP.name}</Text>
        <Text style={styles.subtitle}>
          {DEFAULT_GROUP.memberCount}人正在学习 · 今日目标{DEFAULT_GROUP.dailyGoal}
        </Text>
      </View>
      <Button variant="primary" size="sm" onPress={onJoin}>
        加入
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.primary + '12',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
