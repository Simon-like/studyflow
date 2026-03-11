import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessageProps } from './types';
import { Avatar } from '../../ui/Avatar';
import { colors, radius, spacing, shadows, fontWeight, alpha } from '../../../theme';

export * from './types';

export function ChatMessage({
  role,
  content,
  time,
  suggestions,
  showAvatar = true,
}: ChatMessageProps) {
  const isUser = role === 'user';
  
  return (
    <View style={[styles.container, isUser && styles.userContainer]}>
      {!isUser && showAvatar && (
        <Avatar name="知" size="sm" backgroundColor={colors.primary} />
      )}
      
      <View style={styles.bubbleWrapper}>
        <View style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.aiBubble,
        ]}>
          <Text style={[styles.text, isUser && styles.userText]}>
            {content}
          </Text>
          
          {suggestions && suggestions.length > 0 && (
            <View style={styles.suggestions}>
              {suggestions.map((s) => (
                <View key={s.index} style={styles.suggestionRow}>
                  <View style={styles.suggestionNum}>
                    <Text style={styles.suggestionNumText}>{s.index}</Text>
                  </View>
                  <Text style={styles.suggestionText}>{s.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  userContainer: {
    flexDirection: 'row-reverse',
  },
  bubbleWrapper: {
    maxWidth: '75%',
    gap: 3,
  },
  bubble: {
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  aiBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: radius.sm,
    ...shadows.sm,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: radius.sm,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  userText: {
    color: colors.surface,
  },
  suggestions: {
    marginTop: spacing.sm,
    backgroundColor: colors.warm,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  suggestionNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionNumText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  suggestionText: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
  },
  time: {
    fontSize: 10,
    color: colors.textMuted,
    paddingHorizontal: spacing.xs,
  },
});
