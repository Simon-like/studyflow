export type IconName = 
  | 'home' 
  | 'chat' 
  | 'users' 
  | 'user' 
  | 'play' 
  | 'pause' 
  | 'stop' 
  | 'check' 
  | 'chevron-right'
  | 'chevron-left'
  | 'more'
  | 'send'
  | 'tasks'
  | 'settings'
  | 'camera'
  | 'log-out'
  | 'trash-2'
  | 'clock'
  | 'bell'
  | 'palette'
  | 'shield'
  | 'bar-chart-2'
  | 'award'
  | 'help-circle';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  active?: boolean;
}
