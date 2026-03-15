import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Icon, type IconName } from '../../../components/ui/Icon';
import { colors, spacing, fontWeight, fontSize, alpha } from '../../../theme';

interface MenuItem {
  icon: IconName;
  label: string;
  sub: string;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: 'bar-chart-2', label: '学习统计', sub: '查看详细数据' },
  { icon: 'award', label: '成就中心', sub: '3/6 已解锁' },
  { icon: 'settings', label: '设置', sub: '番茄钟、通知、主题' },
  { icon: 'help-circle', label: '帮助与反馈', sub: '' },
];

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
          <View style={styles.iconContainer}>
            <Icon name={item.icon} size={20} color={colors.primary} />
          </View>
          <View style={styles.text}>
            <Text style={styles.label}>{item.label}</Text>
            {item.sub ? <Text style={styles.sub}>{item.sub}</Text> : null}
          </View>
          <Icon name="chevron-right" size={20} color={colors.textMuted} />
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
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: alpha.primary10,
    alignItems: 'center',
    justifyContent: 'center',
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
