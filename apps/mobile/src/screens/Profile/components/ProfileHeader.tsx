import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Icon } from '../../../components/ui/Icon';
import { colors, radius, spacing, fontWeight, fontSize, alpha, shadows } from '../../../theme';
import type { UserTag } from '@studyflow/shared';

interface ProfileHeaderProps {
  onEditPress: () => void;
  displayName?: string;
  avatarUrl?: string;
  subtitle?: string;
  tags?: UserTag[];
}

export function ProfileHeader({ 
  onEditPress, 
  displayName = '学习者', 
  avatarUrl,
  subtitle = '坚持学习中',
  tags,
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
          

        </View>
        
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        
        <View style={styles.badges}>
          {tags && tags.length > 0 ? (
            tags.map((tag) => (
              <Badge 
                key={tag.id} 
                variant={tag.type === 'achievement' ? 'primary' : tag.type === 'system' ? 'success' : 'secondary'}
              >
                {tag.name}
              </Badge>
            ))
          ) : (
            <Text style={styles.noTagsText}>点击编辑资料添加标签</Text>
          )}
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
    flexWrap: 'wrap',
  },
  noTagsText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
