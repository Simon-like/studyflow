export interface SafeAreaWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarColor?: string;
  edge?: ('top' | 'bottom' | 'left' | 'right')[];
}
