export interface Group {
  id: string;
  name: string;
  members: number;
  goal: string;
  color: 'coral' | 'sage';
}

export interface GroupCardProps extends Group {
  onJoin?: (id: string) => void;
}
