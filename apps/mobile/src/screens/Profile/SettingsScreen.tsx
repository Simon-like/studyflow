/**
 * 设置页面
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Icon, type IconName } from '../../components/ui/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { usePomodoroSettings, useSystemSettings, useChangePassword } from './hooks';
import { colors, spacing, radius, fontSize, fontWeight, alpha, shadows } from '../../theme';
import type { PomodoroSettings, SystemSettings } from '@studyflow/shared';

interface SettingsScreenProps {
  onBack: () => void;
}

const FOCUS_DURATION_OPTIONS = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
const SHORT_BREAK_OPTIONS = [3, 5, 10, 15];
const LONG_BREAK_OPTIONS = [10, 15, 20, 25, 30];

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { logout } = useAuth();
  const { settings: pomodoroSettings, updateSettings: updatePomodoro } = usePomodoroSettings();
  const { settings: systemSettings, updateSettings: updateSystem } = useSystemSettings();
  const changePassword = useChangePassword();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出当前账号吗？', [
      { text: '取消', style: 'cancel' },
      { 
        text: '退出', 
        style: 'destructive', 
        onPress: () => logout()
      },
    ]);
  };

  const handlePomodoroChange = (field: keyof PomodoroSettings, value: number | boolean) => {
    if (!pomodoroSettings) return;
    updatePomodoro({ ...pomodoroSettings, [field]: value });
  };

  const handleSystemChange = (field: keyof SystemSettings, value: string | boolean) => {
    if (!systemSettings) return;
    updateSystem({ ...systemSettings, [field]: value });
  };

  const handlePasswordSubmit = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('错误', '两次输入的新密码不一致');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      Alert.alert('错误', '新密码长度至少6位');
      return;
    }
    changePassword.mutate(
      { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword },
      {
        onSuccess: () => {
          setShowPasswordModal(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        },
      }
    );
  };



  const renderSection = (title: string, icon: IconName, children: React.ReactNode) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name={icon} size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const renderSelectItem = (
    label: string,
    value: number,
    options: number[],
    onChange: (value: number) => void,
    unit = '分钟'
  ) => (
    <View style={styles.selectItem}>
      <Text style={styles.selectLabel}>{label}</Text>
      <View style={styles.selectOptions}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.selectOption,
              value === option && styles.selectOptionActive,
            ]}
            onPress={() => onChange(option)}
          >
            <Text
              style={[
                styles.selectOptionText,
                value === option && styles.selectOptionTextActive,
              ]}
            >
              {option}{unit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderToggleItem = (
    label: string,
    value: boolean,
    onChange: (value: boolean) => void
  ) => (
    <View style={styles.toggleItem}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.surface}
      />
    </View>
  );

  const renderThemeItem = (
    label: string,
    value: string,
    currentTheme: string,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[
        styles.themeItem,
        currentTheme === value && styles.themeItemActive,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.themeItemText,
          currentTheme === value && styles.themeItemTextActive,
        ]}
      >
        {label}
      </Text>
      {currentTheme === value && (
        <Icon name="check" size={16} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>设置</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 番茄钟设置 */}
        {renderSection('番茄钟设置', 'clock', (
          <>
            {renderSelectItem(
              '专注时长',
              Math.floor((pomodoroSettings?.focusDuration || 1500) / 60),
              FOCUS_DURATION_OPTIONS,
              (min) => handlePomodoroChange('focusDuration', min * 60)
            )}
            {renderSelectItem(
              '短休息',
              Math.floor((pomodoroSettings?.shortBreakDuration || 300) / 60),
              SHORT_BREAK_OPTIONS,
              (min) => handlePomodoroChange('shortBreakDuration', min * 60)
            )}
            {renderSelectItem(
              '长休息',
              Math.floor((pomodoroSettings?.longBreakDuration || 900) / 60),
              LONG_BREAK_OPTIONS,
              (min) => handlePomodoroChange('longBreakDuration', min * 60)
            )}
          </>
        ))}

        {/* 通知设置 - 暂时锁定 */}
        {renderSection('通知设置', 'bell', (
          <>
            <View style={styles.lockedOverlay}>
              <View style={styles.lockedContent}>
                <Icon name="shield" size={24} color={colors.textMuted} />
                <Text style={styles.lockedTitle}>通知设置</Text>
                <Text style={styles.lockedSubtitle}>该功能即将推出，敬请期待</Text>
              </View>
            </View>
            {renderToggleItem(
              '启用通知',
              systemSettings?.notificationEnabled ?? true,
              () => {} // 禁用操作
            )}
            {renderToggleItem(
              '提示音',
              systemSettings?.soundEnabled ?? true,
              () => {} // 禁用操作
            )}
            {renderToggleItem(
              '震动提醒',
              systemSettings?.vibrationEnabled ?? true,
              () => {} // 禁用操作
            )}
          </>
        ))}

        {/* 外观设置 - 暂时锁定 */}
        {renderSection('外观', 'palette', (
          <>
            <View style={styles.lockedOverlay}>
              <View style={styles.lockedContent}>
                <Icon name="shield" size={24} color={colors.textMuted} />
                <Text style={styles.lockedTitle}>外观设置</Text>
                <Text style={styles.lockedSubtitle}>该功能即将推出，敬请期待</Text>
              </View>
            </View>
            {renderThemeItem(
              '浅色模式',
              'light',
              systemSettings?.theme || 'light',
              () => {} // 禁用操作
            )}
            {renderThemeItem(
              '深色模式',
              'dark',
              systemSettings?.theme || 'light',
              () => {} // 禁用操作
            )}
            {renderThemeItem(
              '跟随系统',
              'system',
              systemSettings?.theme || 'light',
              () => {} // 禁用操作
            )}
          </>
        ))}

        {/* 隐私与安全 */}
        {renderSection('隐私与安全', 'shield', (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowPasswordModal(true)}
          >
            <Text style={styles.menuItemText}>修改密码</Text>
            <Icon name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}

        {/* 退出登录 */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Icon name="log-out" size={20} color={colors.error} />
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>



        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* 修改密码弹窗 */}
      {showPasswordModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>修改密码</Text>
            <View style={styles.modalContent}>
              <TextInput
                placeholder="当前密码"
                secureTextEntry
                value={passwordData.currentPassword}
                onChangeText={(text: string) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                style={styles.modalInput}
              />
              <TextInput
                placeholder="新密码"
                secureTextEntry
                value={passwordData.newPassword}
                onChangeText={(text: string) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                style={styles.modalInput}
              />
              <TextInput
                placeholder="确认新密码"
                secureTextEntry
                value={passwordData.confirmPassword}
                onChangeText={(text: string) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                style={styles.modalInput}
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.modalButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handlePasswordSubmit}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextConfirm]}>
                  保存
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}

// @ts-ignore - 本地使用
const TextInput = ({ style, ...props }: any) => {
  const { View, TextInput: RNTextInput } = require('react-native');
  return (
    <RNTextInput
      style={[styles.modalInput, style]}
      placeholderTextColor={colors.textMuted}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  placeholder: {
    width: 44,
  },
  container: {
    flex: 1,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    ...shadows.sm,
  },
  selectItem: {
    marginBottom: spacing.md,
  },
  selectLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  selectOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  selectOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectOptionText: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  selectOptionTextActive: {
    color: colors.surface,
    fontWeight: fontWeight.medium,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toggleLabel: {
    fontSize: fontSize.base,
    color: colors.text,
  },
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  themeItemActive: {
    // Active styling
  },
  themeItemText: {
    fontSize: fontSize.base,
    color: colors.text,
  },
  themeItemTextActive: {
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  menuItemText: {
    fontSize: fontSize.base,
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: alpha.error10,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.error,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: radius.xl,
  },
  lockedContent: {
    alignItems: 'center',
  },
  lockedTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.sm,
  },
  lockedSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  bottomPadding: {
    height: spacing.xl * 2,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    width: '100%',
    maxWidth: 400,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  modalContent: {
    gap: spacing.md,
  },
  modalInput: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtonConfirm: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  modalButtonTextConfirm: {
    color: colors.surface,
  },
});
