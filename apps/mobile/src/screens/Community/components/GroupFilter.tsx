import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontWeight } from '../../../theme';

interface GroupFilterProps {
  groups: string[];
  activeGroup: string;
  onSelectGroup: (group: string) => void;
}

export function GroupFilter({ groups, activeGroup, onSelectGroup }: GroupFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {groups.map(group => (
        <TouchableOpacity
          key={group}
          style={[
            styles.chip,
            activeGroup === group && styles.activeChip,
          ]}
          onPress={() => onSelectGroup(group)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.text,
            activeGroup === group && styles.activeText,
          ]}>
            {group}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 44,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  content: {
    gap: spacing.sm,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  activeText: {
    color: colors.surface,
  },
});
