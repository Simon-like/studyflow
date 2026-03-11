import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from '../../../components/ui/Avatar';
import { colors, radius, spacing, fontWeight, shadows, alpha } from '../../../theme';
import { AI_CHARACTER } from '../constants';

export function ChatHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <Avatar name={AI_CHARACTER.avatar} size="lg" backgroundColor={colors.primary} />
        <View style={styles.onlineDot} />
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name}>{AI_CHARACTER.name} · {AI_CHARACTER.title}</Text>
        <Text style={styles.status}>{AI_CHARACTER.status}</Text>
      </View>
      
      <TouchableOpacity style={styles.moreButton}>
        <Text style={styles.moreText}>···</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: alpha.white80,
    borderBottomWidth: 1,
    borderBottomColor: alpha.mist30,
    gap: spacing.md,
  },
  avatarWrapper: {
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  status: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: alpha.mist25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: fontWeight.bold,
  },
});
