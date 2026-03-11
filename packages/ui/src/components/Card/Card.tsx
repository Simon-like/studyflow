import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { designSystem } from '../../theme/design-system';

export interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'hover' | 'elevated';
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
  contentStyle,
}) => {
  const cardStyles = [
    styles.base,
    styles.variants[variant],
    style,
  ];

  const contentStyles = [
    styles.content,
    contentStyle,
  ];

  return (
    <View style={cardStyles}>
      <View style={contentStyles}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  variants: {
    default: {},
    hover: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 8,
    },
    elevated: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 10,
    },
  },
  content: {
    padding: 16,
  },
});