/**
 * 注册页面
 *
 * 字段：昵称（可选）、手机号、密码、确认密码
 * 注册成功后自动登录（双 token）
 * 系统自动生成账号和 PIN
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../theme';
import { FormInput } from './components';
import { useRegisterForm } from './hooks';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../api';

// 屏幕高度检测
const { height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenHeight <= 667;

interface RegisterScreenProps {
  onGoLogin: () => void;
}

export function RegisterScreen({ onGoLogin }: RegisterScreenProps) {
  const { login } = useAuth();
  const {
    nickname, setNickname,
    phone, setPhone,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isLoading, setIsLoading,
    errors,
    handleSubmit: validateAndSubmit,
  } = useRegisterForm();

  const handleSubmit = async () => {
    if (!validateAndSubmit()) return;

    setIsLoading(true);
    try {
      // 1. 注册（仅发送手机号 + 密码 + 可选昵称）
      const res = await api.auth.register({
        phone,
        password,
        nickname: nickname || undefined,
      });

      // 2. 注册成功后用手机号自动登录
      await login(phone, password);

      // 3. 显示注册成功信息
      const user = res.data?.user;
      if (user) {
        Alert.alert(
          '注册成功！',
          `您的账号: ${user.username}\n您的 PIN: ${user.pin}\n\n请牢记您的账号和 PIN，可用于找回密码。`,
          [{ text: '知道了', style: 'default' }]
        );
      }
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      const msg = error?.response?.data?.message || '注册失败，请重试';
      Alert.alert('注册失败', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isSmallScreen && styles.scrollContentSmall,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={[styles.brandSection, isSmallScreen && styles.brandSectionSmall]}>
          <View style={[styles.logo, isSmallScreen && styles.logoSmall]}>
            <Text style={[styles.logoText, isSmallScreen && styles.logoTextSmall]}>💡</Text>
          </View>
          <Text style={[styles.appName, isSmallScreen && styles.appNameSmall]}>StudyFlow</Text>
        </View>

        {/* 表单 */}
        <View style={styles.formSection}>
          <Text style={styles.title}>创建账号</Text>
          <Text style={[styles.subtitle, isSmallScreen && styles.subtitleSmall]}>
            开启你的高效学习之旅
          </Text>

          <FormInput
            label="昵称"
            placeholder="设置一个昵称"
            value={nickname}
            onChangeText={setNickname}
            error={errors.nickname}
          />
          <FormInput
            label="手机号"
            placeholder="1开头的11位手机号"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={11}
            error={errors.phone}
          />
          <FormInput
            label="密码"
            placeholder="至少6位"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          <FormInput
            label="确认密码"
            placeholder="请再次输入密码"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
          />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            onPress={handleSubmit}
          >
            注册
          </Button>

          <View style={[styles.agreement, isSmallScreen && styles.agreementSmall]}>
            <Text style={[styles.agreementText, isSmallScreen && styles.agreementTextSmall]}>
              注册即表示同意
              <Text style={styles.agreementLink}>《服务条款》</Text>
              和
              <Text style={styles.agreementLink}>《隐私政策》</Text>
            </Text>
          </View>

          <View style={[styles.footer, isSmallScreen && styles.footerSmall]}>
            <Text style={styles.footerText}>已有账号？</Text>
            <TouchableOpacity onPress={onGoLogin} activeOpacity={0.7}>
              <Text style={styles.footerLink}>立即登录</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: spacing['3xl'],
  },
  scrollContentSmall: {
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
    paddingBottom: spacing.lg,
    justifyContent: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  brandSectionSmall: {
    marginBottom: spacing.lg,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primarySm,
    marginBottom: spacing.sm,
  },
  logoSmall: {
    width: 44,
    height: 44,
    marginBottom: spacing.xs,
  },
  logoText: {
    fontSize: 28,
  },
  logoTextSmall: {
    fontSize: 22,
  },
  appName: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  appNameSmall: {
    fontSize: fontSize.xl,
  },
  formSection: {
    paddingHorizontal: spacing['3xl'],
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing['2xl'],
  },
  subtitleSmall: {
    marginBottom: spacing.lg,
  },
  agreement: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  agreementSmall: {
    marginTop: spacing.md,
  },
  agreementText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  agreementTextSmall: {
    fontSize: 10,
    lineHeight: 14,
  },
  agreementLink: {
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
  footerSmall: {
    marginTop: spacing.md,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
});
