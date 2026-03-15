/**
 * 页面加载指示器组件 (React Native)
 * 
 * 柔和的页面加载动画，与 Web 端保持一致的视觉风格
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { colors, alpha } from '../../../theme';
// 动画配置（与 @studyflow/theme 保持一致）
const LOADING_ANIMATION = {
  pageRefresh: {
    duration: 600,
    delay: 150,
    minDisplayTime: 400,
    fadeOutDuration: 300,
  },
  skeleton: {
    shimmerDuration: 1500,
    pulseDuration: 2000,
  },
  spinner: {
    rotateDuration: 800,
    dotCount: 3,
    bounceDelay: 150,
  },
};

interface PageLoadingIndicatorProps {
  /** 是否可见 */
  visible: boolean;
  /** 尺寸：small | medium | large */
  size?: 'small' | 'medium' | 'large';
  /** 背景透明度 */
  backgroundOpacity?: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SIZE_CONFIG = {
  small: {
    container: 32,
    icon: 16,
    dot: 6,
  },
  medium: {
    container: 56,
    icon: 28,
    dot: 8,
  },
  large: {
    container: 80,
    icon: 40,
    dot: 10,
  },
};

export function PageLoadingIndicator({
  visible,
  size = 'medium',
  backgroundOpacity = 0.8,
}: PageLoadingIndicatorProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const sizeConfig = SIZE_CONFIG[size];

  // 淡入淡出动画
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: LOADING_ANIMATION.pageRefresh.fadeOutDuration,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: LOADING_ANIMATION.pageRefresh.fadeOutDuration,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  // Logo 脉冲动画
  useEffect(() => {
    if (!visible) return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: LOADING_ANIMATION.skeleton.pulseDuration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: LOADING_ANIMATION.skeleton.pulseDuration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    return () => pulse.stop();
  }, [visible, pulseAnim]);

  // 圆点弹跳动画
  useEffect(() => {
    if (!visible) return;

    const animations = bounceAnims.map((anim, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(index * LOADING_ANIMATION.spinner.bounceDelay),
          Animated.timing(anim, {
            toValue: -8,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(300 - index * LOADING_ANIMATION.spinner.bounceDelay),
        ])
      );
    });

    animations.forEach(anim => anim.start());
    return () => animations.forEach(anim => anim.stop());
  }, [visible, bounceAnims]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          backgroundColor: `rgba(253, 248, 243, ${backgroundOpacity})`,
        },
      ]}
    >
      {/* Logo 容器 */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            width: sizeConfig.container,
            height: sizeConfig.container,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <View style={styles.iconWrapper}>
          <View style={[styles.iconLine, { width: sizeConfig.icon * 0.4, height: 2, top: sizeConfig.icon * 0.35, left: sizeConfig.icon * 0.1 }]} />
          <View style={[styles.iconLine, { width: 2, height: sizeConfig.icon * 0.35, top: sizeConfig.icon * 0.1, left: sizeConfig.icon * 0.5 }]} />
          <View style={[styles.iconDot, { width: sizeConfig.icon * 0.15, height: sizeConfig.icon * 0.15, top: sizeConfig.icon * 0.6, left: sizeConfig.icon * 0.42 }]} />
        </View>
      </Animated.View>

      {/* 弹跳圆点 */}
      <View style={styles.dotsContainer}>
        {bounceAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: sizeConfig.dot,
                height: sizeConfig.dot,
                transform: [{ translateY: anim }],
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  logoContainer: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconWrapper: {
    width: '60%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLine: {
    position: 'absolute',
    backgroundColor: colors.surface,
    borderRadius: 1,
  },
  iconDot: {
    position: 'absolute',
    backgroundColor: colors.surface,
    borderRadius: 100,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    backgroundColor: colors.primary,
    borderRadius: 100,
  },
});

export default PageLoadingIndicator;
