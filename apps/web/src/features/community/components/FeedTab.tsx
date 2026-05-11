import { PostCard } from "@/components/business";
import type { Post } from "@studyflow/shared";

interface FeedTabProps {
  posts: Post[];
  onLike: (id: string) => void;
  onComment?: (id: string) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function FeedTab({
  posts,
  onLike,
  onComment,
  isLoading,
  hasMore,
  onLoadMore,
}: FeedTabProps) {
  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 animate-pulse shadow-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-mist/30 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-mist/30 rounded w-24 mb-1" />
                <div className="h-3 bg-mist/30 rounded w-16" />
              </div>
            </div>
            <div className="h-4 bg-mist/30 rounded w-full mb-2" />
            <div className="h-4 bg-mist/30 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-stone">
        <p className="text-lg mb-2">暂无动态</p>
        <p className="text-sm">发布第一条动态，开始你的学习分享吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onComment={onComment}
        />
      ))}
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="mx-auto py-3 px-6 text-sm text-stone hover:text-coral transition-colors disabled:opacity-50"
        >
          {isLoading ? "加载中..." : "加载更多"}
        </button>
      )}
    </div>
  );
}
