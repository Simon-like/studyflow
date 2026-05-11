import type { Post } from "@studyflow/shared";

export type { Post };

export interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
}
