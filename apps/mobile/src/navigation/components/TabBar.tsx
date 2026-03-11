import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from '../../components/ui/Icon';
import { colors, radius, spacing, fontWeight, fontSize, alpha, shadows } from '../../theme';
import { TabKey, TabConfig } from '../constants';

interface TabBarProps {
  tabs: TabConfig[];
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
}

export function TabBar({ tabs, activeTab, onTabPress }: TabBarProps) {
  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              {isActive && <View style={styles.activeIndicator} />}
              <Icon name={tab.icon} active={isActive} />
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: alpha.mist30,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    ...shadows.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    gap: 4,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },
  activeIndicator: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    backgroundColor: alpha.primary15,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
});
