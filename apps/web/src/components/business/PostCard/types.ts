export interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  group: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  liked: boolean;
}

export interface PostCardProps extends Post {
  onLike: (id: string) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
}
