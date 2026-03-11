export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  color: 'coral' | 'sage';
}

export interface AchievementCardProps extends Achievement {
  onClick?: (id: string) => void;
}
