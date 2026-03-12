import { PostCard } from '@/components/business';
import type { Post } from '@/types';

interface FeedTabProps {
  posts: Post[];
  onLike: (id: string) => void;
}

export function FeedTab({ posts, onLike }: FeedTabProps) {
  return (
    <div className="space-y-5">
      {posts.map((post) => (
        <PostCard key={post.id} {...post} onLike={onLike} />
      ))}
    </div>
  );
}
