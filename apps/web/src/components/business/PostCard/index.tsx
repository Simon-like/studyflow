import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Card, Avatar } from '@/components/ui';
import type { PostCardProps, Post } from './types';

export function PostCard({
  id,
  author,
  avatar,
  time,
  group,
  content,
  tags,
  likes,
  comments,
  liked,
  onLike,
  onComment,
  onShare,
}: PostCardProps) {
  return (
    <Card hover>
      {/* Author */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar name={avatar} size="md" />
        <div className="flex-1">
          <p className="text-charcoal font-medium text-sm">{author}</p>
          <p className="text-stone text-xs">
            {time} · {group}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-charcoal text-sm leading-relaxed mb-3">{content}</p>

      {/* Tags */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {tags.map((tag) => (
          <span key={tag} className="bg-coral/10 text-coral text-xs px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 text-stone pt-3 border-t border-mist/20">
        <button
          onClick={() => onLike(id)}
          className={`flex items-center gap-1.5 text-sm transition-all active:scale-95 hover:scale-105 ${
            liked ? 'text-coral' : 'hover:text-coral'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-coral' : ''}`} />
          <span>{likes}</span>
        </button>
        <button
          onClick={() => onComment?.(id)}
          className="flex items-center gap-1.5 text-sm hover:text-coral transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{comments}</span>
        </button>
        <button
          onClick={() => onShare?.(id)}
          className="flex items-center gap-1.5 text-sm hover:text-coral transition-all"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}

export { type PostCardProps, type Post } from './types';
