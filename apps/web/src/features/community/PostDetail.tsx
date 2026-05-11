import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  Loader2,
} from "lucide-react";
import { Avatar } from "@/components/ui";
import {
  usePostDetail,
  useComments,
  useToggleLike,
  useCreateComment,
} from "@studyflow/api";
import type { Comment } from "@studyflow/shared";

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  return date.toLocaleDateString("zh-CN");
}

function CommentItem({ comment }: { comment: Comment }) {
  const authorName =
    comment.author?.nickname || comment.author?.username || "匿名用户";

  return (
    <div className="flex gap-3 py-4">
      <Avatar
        name={authorName.charAt(0)}
        src={comment.author?.avatarUrl}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-charcoal">
            {authorName}
          </span>
          <span className="text-xs text-stone">
            {formatTime(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-charcoal leading-relaxed">
          {comment.content}
        </p>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-mist/30 space-y-3">
            {comment.replies.map((reply) => {
              const replyAuthor =
                reply.author?.nickname ||
                reply.author?.username ||
                "匿名用户";
              return (
                <div key={reply.id} className="flex gap-2">
                  <Avatar
                    name={replyAuthor.charAt(0)}
                    src={reply.author?.avatarUrl}
                    size="sm"
                  />
                  <div>
                    <span className="text-xs font-medium text-charcoal">
                      {replyAuthor}
                    </span>
                    <span className="text-xs text-stone ml-2">
                      {formatTime(reply.createdAt)}
                    </span>
                    <p className="text-xs text-charcoal mt-0.5">
                      {reply.content}
                    </p>
                  </div>
                </div>
              );
            })}
            {(comment.replyCount ?? 0) > (comment.replies?.length ?? 0) && (
              <button className="text-xs text-coral hover:underline">
                查看全部 {comment.replyCount} 条回复
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");

  const { data: post, isLoading: postLoading } = usePostDetail(id || "");
  const { data: comments, isLoading: commentsLoading } = useComments(id || "");
  const toggleLike = useToggleLike();
  const createComment = useCreateComment(id || "");

  const handleSubmitComment = () => {
    if (!commentText.trim() || !id) return;
    createComment.mutate(
      { content: commentText.trim() },
      { onSuccess: () => setCommentText("") },
    );
  };

  if (postLoading) {
    return (
      <div className="p-10 max-w-3xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-mist/30 rounded w-32 mb-8" />
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-mist/30 rounded-full" />
              <div>
                <div className="h-4 bg-mist/30 rounded w-24 mb-1" />
                <div className="h-3 bg-mist/30 rounded w-16" />
              </div>
            </div>
            <div className="h-4 bg-mist/30 rounded w-full mb-2" />
            <div className="h-4 bg-mist/30 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-10 max-w-3xl mx-auto text-center py-20">
        <p className="text-stone text-lg">帖子不存在或已被删除</p>
        <button
          onClick={() => navigate("/community")}
          className="text-coral hover:underline mt-4 inline-block"
        >
          返回社区
        </button>
      </div>
    );
  }

  const authorName =
    post.author?.nickname || post.author?.username || "匿名用户";
  const commentList = Array.isArray(comments) ? comments : [];

  return (
    <div className="p-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-warm rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-charcoal" />
        </button>
        <h1 className="font-display text-xl font-bold text-charcoal">
          动态详情
        </h1>
      </div>

      {/* Post Content */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar
            name={authorName.charAt(0)}
            src={post.author?.avatarUrl}
            size="lg"
          />
          <div>
            <p className="text-charcoal font-medium">{authorName}</p>
            <p className="text-stone text-xs">{formatTime(post.createdAt)}</p>
          </div>
        </div>

        <p className="text-charcoal leading-relaxed mb-4">{post.content}</p>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {post.images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                className="rounded-lg object-cover w-full aspect-square"
              />
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-coral/10 text-coral text-xs px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Study Data */}
        {post.studyTime != null && post.studyTime > 0 && (
          <div className="bg-sage/10 rounded-xl p-3 mb-4 flex items-center gap-4 text-sm text-sage">
            <span>📚 专注 {post.studyTime} 分钟</span>
            {post.taskCount != null && post.taskCount > 0 && (
              <span>✅ 完成 {post.taskCount} 个任务</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 text-stone pt-4 border-t border-mist/20">
          <button
            onClick={() => toggleLike.mutate(post.id)}
            className={`flex items-center gap-1.5 text-sm transition-all active:scale-95 hover:scale-105 ${
              post.isLiked ? "text-coral" : "hover:text-coral"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${post.isLiked ? "fill-coral" : ""}`}
            />
            <span>{post.likeCount}</span>
          </button>
          <div className="flex items-center gap-1.5 text-sm">
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentCount}</span>
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div className="bg-white rounded-2xl shadow-card p-4 mb-6">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
            placeholder="写一条评论..."
            className="flex-1 bg-warm rounded-xl px-4 py-2.5 text-sm outline-none text-charcoal placeholder:text-stone/50"
          />
          <button
            onClick={handleSubmitComment}
            disabled={!commentText.trim() || createComment.isPending}
            className="p-2.5 bg-coral text-white rounded-xl hover:bg-coral/90 transition-colors disabled:opacity-50"
          >
            {createComment.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-2xl shadow-card px-6">
        <h3 className="text-sm font-medium text-charcoal pt-5 pb-2">
          评论 ({post.commentCount})
        </h3>

        {commentsLoading ? (
          <div className="py-8 text-center text-stone text-sm">
            加载评论中...
          </div>
        ) : commentList.length === 0 ? (
          <div className="py-8 text-center text-stone text-sm">
            暂无评论，来发表第一条评论吧
          </div>
        ) : (
          <div className="divide-y divide-mist/20">
            {commentList.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
