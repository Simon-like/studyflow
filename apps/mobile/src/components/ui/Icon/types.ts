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
  | 'more'
  | 'send'
  | 'tasks';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  active?: boolean;
}
