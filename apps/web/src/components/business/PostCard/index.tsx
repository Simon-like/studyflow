import { Heart, MessageCircle, Share2, Clock } from "lucide-react";
import { Card, Avatar } from "@/components/ui";
import type { PostCardProps } from "./types";

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

export function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const authorName = post.author?.nickname || post.author?.username || "匿名用户";
  const avatarLetter = authorName.charAt(0).toUpperCase();

  return (
    <Card hover>
      {/* Author */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar
          name={avatarLetter}
          src={post.author?.avatarUrl}
          size="md"
        />
        <div className="flex-1">
          <p className="text-charcoal font-medium text-sm">{authorName}</p>
          <p className="text-stone text-xs">{formatTime(post.createdAt)}</p>
        </div>
        {post.studyTime != null && post.studyTime > 0 && (
          <div className="flex items-center gap-1 text-sage text-xs bg-sage/10 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            <span>{post.studyTime}分钟</span>
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-charcoal text-sm leading-relaxed mb-3">
        {post.content}
      </p>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {post.images.slice(0, 3).map((url, i) => (
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

      {/* Actions */}
      <div className="flex items-center gap-6 text-stone pt-3 border-t border-mist/20">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 text-sm transition-all active:scale-95 hover:scale-105 ${
            post.isLiked ? "text-coral" : "hover:text-coral"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${post.isLiked ? "fill-coral" : ""}`}
          />
          <span>{post.likeCount}</span>
        </button>
        <button
          onClick={() => onComment?.(post.id)}
          className="flex items-center gap-1.5 text-sm hover:text-coral transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.commentCount}</span>
        </button>
        <button
          onClick={() => onShare?.(post.id)}
          className="flex items-center gap-1.5 text-sm hover:text-coral transition-all"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}

export type { PostCardProps, Post } from "./types";
