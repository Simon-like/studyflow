import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { colors, radius, spacing, fontWeight, fontSize, alpha } from '../../../theme';
import { ACHIEVEMENTS } from '../constants';

const UNLOCKED_COUNT = ACHIEVEMENTS.filter(a => a.unlocked).length;

export function Achievements() {
  return (
    <Card>
      <SectionHeader
        title="成就徽章"
        right={<Text style={styles.progress}>{UNLOCKED_COUNT}/{ACHIEVEMENTS.length} 已解锁</Text>}
      />
      <View style={styles.grid}>
        {ACHIEVEMENTS.map(achievement => (
          <View
            key={achievement.title}
            style={[
              styles.item,
              !achievement.unlocked && styles.locked,
            ]}
          >
            <View style={[
              styles.icon,
              !achievement.unlocked && styles.iconLocked,
            ]}>
              <Text style={styles.emoji}>{achievement.icon}</Text>
            </View>
            <Text style={styles.title}>{achievement.title}</Text>
            <Text style={styles.desc}>{achievement.desc}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  progress: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  item: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: colors.warm,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  locked: {
    opacity: 0.4,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconLocked: {
    backgroundColor: alpha.mist30,
  },
  emoji: {
    fontSize: 22,
  },
  title: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  desc: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});
