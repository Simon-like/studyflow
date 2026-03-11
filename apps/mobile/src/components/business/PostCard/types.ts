export interface PostCardProps {
  id: string;
  author: string;
  avatar: string;
  avatarColor: string;
  time: string;
  group: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  liked: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}
