/**
 * 登录页面
 * 
 * 使用双 Token 认证：
 * - 登录成功后自动保存 accessToken + refreshToken
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
  Dimensions,
} from 'react-native';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../theme';
import { FormInput, SocialLogin } from './components';

import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useLoginForm } from './hooks';

interface LoginScreenProps {
  onGoRegister: () => void;
}

// 屏幕高度检测
const { height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenHeight <= 667;

export function LoginScreen({ onGoRegister }: LoginScreenProps) {
  const { login } = useAuth();
  const {
    account, setAccount,
    password, setPassword,
    isLoading,
    errors,
    handleSubmit: validateAndSubmit,
  } = useLoginForm();

  const handleSubmit = async () => {
    if (!validateAndSubmit()) return;
    
    try {
      await login(account, password);
      // 登录成功由 AuthContext 自动处理状态更新
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      const msg = error?.response?.data?.message || '登录失败，请重试';
      Alert.alert('登录失败', msg);
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
        {/* Logo & 品牌 */}
        <View style={[styles.brandSection, isSmallScreen && styles.brandSectionSmall]}>
          <View style={[styles.logo, isSmallScreen && styles.logoSmall]}>
            <Text style={[styles.logoText, isSmallScreen && styles.logoTextSmall]}>💡</Text>
          </View>
          <Text style={[styles.appName, isSmallScreen && styles.appNameSmall]}>StudyFlow</Text>
          {!isSmallScreen && <Text style={styles.tagline}>你的智能学习伙伴</Text>}
          {!isSmallScreen && (
            <View style={styles.features}>
              {FEATURES.map((f) => (
                <View key={f.text} style={styles.featureItem}>
                  <Text style={styles.featureEmoji}>{f.emoji}</Text>
                  <Text style={styles.featureText}>{f.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 表单 */}
        <View style={styles.formSection}>
          <Text style={styles.title}>欢迎回来</Text>
          <Text style={styles.subtitle}>登录开始今天的学习之旅</Text>


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
            placeholder="请输入密码"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            onPress={handleSubmit}
          >
            登录
          </Button>

          <SocialLogin />

          <View style={styles.footer}>
            <Text style={styles.footerText}>还没有账号？</Text>
            <TouchableOpacity onPress={onGoRegister} activeOpacity={0.7}>
              <Text style={styles.footerLink}>立即注册</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 特性列表
const FEATURES = [
  { emoji: '🍅', text: '番茄钟' },
  { emoji: '📝', text: '任务管理' },
  { emoji: '🤖', text: 'AI 助手' },
];

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
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: spacing.lg,
    justifyContent: 'center',
  },
  brandSection: {
    alignItems: 'center',
    paddingHorizontal: spacing['3xl'],
    marginBottom: spacing['3xl'],
  },
  brandSectionSmall: {
    marginBottom: spacing.lg,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radius['2xl'],
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
    marginBottom: spacing.md,
  },
  logoSmall: {
    width: 48,
    height: 48,
    borderRadius: radius.xl,
    marginBottom: spacing.sm,
  },
  logoText: {
    fontSize: 32,
  },
  logoTextSmall: {
    fontSize: 24,
  },
  appName: {
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  appNameSmall: {
    fontSize: fontSize['2xl'],
  },
  tagline: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  features: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  featureItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
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

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing['2xl'],
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
