import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '../../../components/ui/Avatar';
import { colors, spacing, fontWeight, fontSize, alpha } from '../../../theme';
import { useUser } from '../../../hooks';
import { WELCOME_MESSAGES } from '../constants';

export function WelcomeHeader() {
  const { displayName, avatarUrl, isLoading } = useUser();

  // 根据时间选择欢迎语
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return WELCOME_MESSAGES.morning;
    if (hour < 18) return WELCOME_MESSAGES.afternoon;
    return WELCOME_MESSAGES.evening;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.gradient}>
        <View style={styles.content}>
          <View>
            <Text style={styles.subtitle}>{getWelcomeMessage()}</Text>
            <Text style={styles.title}>Hi, {displayName}</Text>
          </View>
          <Avatar 
            name={displayName} 
            src={avatarUrl}
            size="lg" 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  gradient: {
    backgroundColor: alpha.primary10,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginTop: 2,
  },
});
