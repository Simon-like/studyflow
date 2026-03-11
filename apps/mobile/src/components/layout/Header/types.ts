import { ViewStyle } from 'react-native';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  showBottomBorder?: boolean;
  backgroundColor?: string;
  style?: ViewStyle;
}
