import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PostCardProps } from './types';
import { Avatar } from '../../ui/Avatar';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { colors, radius, spacing, shadows, fontWeight, alpha } from '../../../theme';

export * from './types';

export function PostCard({
  author,
  avatar,
  avatarColor,
  time,
  group,
  content,
  tags,
  likes,
  comments,
  liked,
  onLike,
  onComment,
  onShare,
}: PostCardProps) {
  return (
    <Card style={styles.card}>
      {/* 作者信息 */}
      <View style={styles.author}>
        <Avatar name={avatar} size="md" backgroundColor={avatarColor} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{author}</Text>
          <Text style={styles.meta}>{time} · {group}</Text>
        </View>
      </View>
      
      {/* 内容 */}
      <Text style={styles.content}>{content}</Text>
      
      {/* 标签 */}
      <View style={styles.tags}>
        {tags.map((tag) => (
          <Badge key={tag} variant="primary">{tag}</Badge>
        ))}
      </View>
      
      {/* 操作按钮 */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onLike} activeOpacity={0.7}>
          <Text style={[styles.actionIcon, liked && styles.actionIconLiked]}>
            {liked ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.actionCount, liked && styles.actionCountLiked]}>
            {likes}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn} onPress={onComment} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn} onPress={onShare} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>↗️</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: 10,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  meta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  content: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: alpha.mist30,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionIconLiked: {},
  actionCount: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionCountLiked: {
    color: colors.primary,
  },
});
