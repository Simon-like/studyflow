/**
 * 设置页面 - 简化版，只设置休息时间
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Icon, type IconName } from '../../components/ui/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { usePomodoroSettings, useChangePassword } from './hooks';
import { colors, spacing, radius, fontSize, fontWeight, alpha, shadows } from '../../theme';
import type { PomodoroSettings } from '@studyflow/shared';

interface SettingsScreenProps {
  onBack: () => void;
}

const FOCUS_DURATION_OPTIONS = [15, 20, 25, 30, 45, 60];
const BREAK_DURATION_OPTIONS = [3, 5, 10, 15, 20, 25, 30];

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { logout } = useAuth();
  const { settings: pomodoroSettings, updateSettings: updatePomodoro } = usePomodoroSettings();
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

  const handleFocusDurationChange = (minutes: number) => {
    if (!pomodoroSettings) return;
    updatePomodoro({
      ...pomodoroSettings,
      focusDuration: minutes * 60,
    });
  };

  const handleBreakDurationChange = (minutes: number) => {
    if (!pomodoroSettings) return;
    updatePomodoro({
      ...pomodoroSettings,
      breakDuration: minutes * 60,
      shortBreakDuration: minutes * 60,
    });
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

  const focusMinutes = Math.floor((pomodoroSettings?.focusDuration || 1500) / 60);
  const breakMinutes = Math.floor((pomodoroSettings?.breakDuration || 300) / 60);

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
        {/* 专注时长设置 */}
        {renderSection('专注时长', 'play', (
          <View style={styles.selectItem}>
            <Text style={styles.selectLabel}>每轮专注的时长</Text>
            <View style={styles.selectOptions}>
              {FOCUS_DURATION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.selectOption,
                    focusMinutes === option && styles.selectOptionActive,
                  ]}
                  onPress={() => handleFocusDurationChange(option)}
                >
                  <Text
                    style={[
                      styles.selectOptionText,
                      focusMinutes === option && styles.selectOptionTextActive,
                    ]}
                  >
                    {option}分钟
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* 休息时间设置 */}
        {renderSection('休息时间', 'clock', (
          <View style={styles.selectItem}>
            <Text style={styles.selectLabel}>每轮学习后的休息时长</Text>
            <View style={styles.selectOptions}>
              {BREAK_DURATION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.selectOption,
                    breakMinutes === option && styles.selectOptionActive,
                  ]}
                  onPress={() => handleBreakDurationChange(option)}
                >
                  <Text
                    style={[
                      styles.selectOptionText,
                      breakMinutes === option && styles.selectOptionTextActive,
                    ]}
                  >
                    {option}分钟
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
              <RNTextInput
                placeholder="当前密码"
                secureTextEntry
                value={passwordData.currentPassword}
                onChangeText={(text: string) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                style={styles.modalInput}
                placeholderTextColor={colors.textMuted}
              />
              <RNTextInput
                placeholder="新密码"
                secureTextEntry
                value={passwordData.newPassword}
                onChangeText={(text: string) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                style={styles.modalInput}
                placeholderTextColor={colors.textMuted}
              />
              <RNTextInput
                placeholder="确认新密码"
                secureTextEntry
                value={passwordData.confirmPassword}
                onChangeText={(text: string) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                style={styles.modalInput}
                placeholderTextColor={colors.textMuted}
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
    marginBottom: spacing.sm,
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
