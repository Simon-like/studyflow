import { ViewStyle } from 'react-native';

export type CardVariant = 'default' | 'elevated' | 'outlined';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  onPress?: () => void;
}
