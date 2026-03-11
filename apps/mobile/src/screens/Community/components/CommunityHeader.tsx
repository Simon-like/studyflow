import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { colors, spacing, fontWeight, fontSize } from '../../../theme';

interface CommunityHeaderProps {
  onCreatePost: () => void;
}

export function CommunityHeader({ onCreatePost }: CommunityHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>学习社区</Text>
      <Button variant="primary" size="sm" onPress={onCreatePost}>
        + 发布
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
});
