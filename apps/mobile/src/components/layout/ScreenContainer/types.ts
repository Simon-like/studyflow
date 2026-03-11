import { ViewStyle, ScrollViewProps } from 'react-native';

export interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  safeArea?: boolean;
  padding?: boolean;
  backgroundColor?: string;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollViewProps?: Omit<ScrollViewProps, 'style' | 'contentContainerStyle'>;
}
