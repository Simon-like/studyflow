import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Icon } from '../../../components/ui/Icon';
import { colors, spacing, fontWeight, fontSize, alpha } from '../../../theme';
import { MENU_ITEMS } from '../constants';

interface MenuListProps {
  onItemPress: (label: string) => void;
}

export function MenuList({ onItemPress }: MenuListProps) {
  return (
    <Card padding="none">
      {MENU_ITEMS.map((item, index) => (
        <TouchableOpacity
          key={item.label}
          style={[styles.item, index > 0 && styles.itemBorder]}
          onPress={() => onItemPress(item.label)}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <View style={styles.text}>
            <Text style={styles.label}>{item.label}</Text>
            {item.sub ? <Text style={styles.sub}>{item.sub}</Text> : null}
          </View>
          <Icon name="chevron-right" color={colors.textMuted} />
        </TouchableOpacity>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  itemBorder: {
    borderTopWidth: 1,
    borderTopColor: alpha.mist25,
  },
  icon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  text: {
    flex: 1,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  sub: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 1,
  },
});
