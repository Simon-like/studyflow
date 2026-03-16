/**
 * 注册页面
 * 
 * 使用双 Token 认证：
 * - 注册成功后自动登录
 * - 使用 AuthContext 管理登录状态
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
} from 'react-native';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../theme';
import { FormInput } from './components';
import { useRegisterForm } from './hooks';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../api';

interface RegisterScreenProps {
  onGoLogin: () => void;
}

export function RegisterScreen({ onGoLogin }: RegisterScreenProps) {
  const { login } = useAuth();
  const {
    name, setName,
    account, setAccount,
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
      // 1. 先注册
      await api.auth.register({ 
        username: account, 
        password, 
        nickname: name 
      });
      
      // 2. 注册成功后自动登录（使用双 token）
      await login(account, password);
      // 登录成功由 AuthContext 自动处理状态更新
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.brandSection}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>💡</Text>
          </View>
          <Text style={styles.appName}>StudyFlow</Text>
        </View>

        {/* 表单 */}
        <View style={styles.formSection}>
          <Text style={styles.title}>创建账号</Text>
          <Text style={styles.subtitle}>开启你的高效学习之旅</Text>

          <FormInput
            label="姓名"
            placeholder="你的姓名"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />
          <FormInput
            label="手机号/邮箱"
            placeholder="请输入"
            value={account}
            onChangeText={setAccount}
            keyboardType="email-address"
            error={errors.account}
          />
          <FormInput
            label="密码"
            placeholder="至少6位，包含字母和数字"
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

          <View style={styles.agreement}>
            <Text style={styles.agreementText}>
              注册即表示同意
              <Text style={styles.agreementLink}>《服务条款》</Text>
              和
              <Text style={styles.agreementLink}>《隐私政策》</Text>
            </Text>
          </View>

          <View style={styles.footer}>
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
  brandSection: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
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
  logoText: {
    fontSize: 28,
  },
  appName: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.text,
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
  agreement: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  agreementText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
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
