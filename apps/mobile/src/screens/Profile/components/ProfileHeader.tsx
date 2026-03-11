import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { colors, radius, spacing, fontWeight, fontSize, alpha, shadows } from '../../../theme';
import { DEFAULT_USER } from '../constants';
import { Badge as BadgeType } from '../types';

interface ProfileHeaderProps {
  onEditPress: () => void;
}

function BadgeItem({ label, variant }: BadgeType) {
  return (
    <View style={[styles.badge, variant === 'secondary' && styles.badgeSecondary]}>
      <Text style={[styles.badgeText, variant === 'secondary' && styles.badgeTextSecondary]}>
        {label}
      </Text>
    </View>
  );
}

export function ProfileHeader({ onEditPress }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <View style={styles.content}>
        <View style={styles.avatarRow}>
          <Avatar name={DEFAULT_USER.avatar} size="xl" />
          <TouchableOpacity style={styles.editButton} onPress={onEditPress} activeOpacity={0.8}>
            <Text style={styles.editText}>编辑资料</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.name}>{DEFAULT_USER.name}</Text>
        <Text style={styles.subtitle}>{DEFAULT_USER.subtitle}</Text>
        
        <View style={styles.badges}>
          {DEFAULT_USER.badges.map(badge => (
            <BadgeItem key={badge.label} {...badge} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingBottom: spacing.lg,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: alpha.primary20,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  editButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  editText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  name: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 3,
    marginBottom: spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: alpha.primary25,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  badgeSecondary: {
    backgroundColor: alpha.secondary25,
  },
  badgeText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: fontWeight.medium,
  },
  badgeTextSecondary: {
    color: colors.secondaryDark,
  },
});
