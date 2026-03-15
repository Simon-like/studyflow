import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Icon } from '../../../components/ui/Icon';
import { colors, radius, spacing, fontWeight, fontSize, alpha, shadows } from '../../../theme';
// User tags for display
const USER_TAGS: string[] = ['数学达人', '早起鸟', '专注力强'];

interface ProfileHeaderProps {
  onEditPress: () => void;
  displayName?: string;
  avatarUrl?: string;
  subtitle?: string;
}

export function ProfileHeader({ 
  onEditPress, 
  displayName = '学习者', 
  avatarUrl,
  subtitle = '坚持学习中',
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrapper}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Avatar name={displayName} size="xl" />
              )}
            </View>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={onEditPress} 
              activeOpacity={0.8}
            >
              <Text style={styles.editText}>编辑资料</Text>
            </TouchableOpacity>
          </View>
          
          {/* 设置按钮 */}
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={onEditPress}
            activeOpacity={0.8}
          >
            <Icon name="settings" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        
        <View style={styles.badges}>
          {USER_TAGS.map((tag) => (
            <Badge 
              key={tag} 
              variant={tag === '数学达人' || tag === '专注力强' ? 'primary' : 'secondary'}
            >
              {tag}
            </Badge>
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
    width: '100%',
    height: '100%',
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    backgroundColor: alpha.primary10,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    flex: 1,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  name: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginTop: spacing.md,
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
    marginTop: spacing.sm,
  },
});
