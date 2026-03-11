import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadows, alpha } from '../../../theme';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChangeText, onSend }: ChatInputProps) {
  const canSend = value.trim().length > 0;
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.micButton}>
        <Text style={styles.micIcon}>🎤</Text>
      </TouchableOpacity>
      
      <TextInput
        style={styles.input}
        placeholder="输入消息..."
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSend}
        returnKeyType="send"
        multiline={false}
      />
      
      <TouchableOpacity
        style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
        onPress={onSend}
        disabled={!canSend}
        activeOpacity={0.8}
      >
        <Text style={styles.sendIcon}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
    ...shadows.md,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.warm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primarySm,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendIcon: {
    fontSize: 18,
    color: colors.surface,
    fontWeight: 'bold',
  },
});
