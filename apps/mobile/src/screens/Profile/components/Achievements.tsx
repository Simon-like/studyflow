import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { colors, radius, spacing, fontWeight, fontSize, alpha } from '../../../theme';
import type { UserStats } from '@studyflow/shared';

interface AchievementDef {
  id: string;
  icon: string;
  title: string;
  desc: string;
  check: (stats: UserStats) => boolean;
}

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: '1', icon: '⚡', title: '专注达人', desc: '累计专注超过1小时', check: (s) => s.totalFocusMinutes >= 60 },
  { id: '2', icon: '🎯', title: '任务完成者', desc: '完成10个任务', check: (s) => s.completedTasks >= 10 },
  { id: '3', icon: '🔥', title: '连续打卡', desc: '连续7天打卡', check: (s) => s.longestStreak >= 7 },
  { id: '4', icon: '📚', title: '知识探索者', desc: '累计学习100小时', check: (s) => s.totalFocusMinutes >= 6000 },
  { id: '5', icon: '🏆', title: '番茄大师', desc: '累计完成100个番茄', check: (s) => s.totalPomodoros >= 100 },
  { id: '6', icon: '🌟', title: '坚持之星', desc: '累计学习30天', check: (s) => s.studyDays >= 30 },
];

interface AchievementsProps {
  userStats?: UserStats;
}

export function Achievements({ userStats }: AchievementsProps) {
  const achievements = useMemo(() => {
    return ACHIEVEMENT_DEFS.map(def => ({
      ...def,
      unlocked: userStats ? def.check(userStats) : false,
    }));
  }, [userStats]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Card>
      <SectionHeader
        title="成就徽章"
        right={<Text style={styles.progress}>{unlockedCount}/{achievements.length} 已解锁</Text>}
      />
      <View style={styles.grid}>
        {achievements.map(achievement => (
          <View
            key={achievement.id}
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
