import { useState } from 'react';
import { Heart, MessageCircle, Share2, Plus } from 'lucide-react';

interface Post {
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

const GROUPS = [
  { name: '考研冲刺营', members: 328, goal: '今日目标6h', color: 'coral' },
  { name: '编程学习圈', members: 512, goal: '今日目标4h', color: 'sage' },
  { name: '英语提升团', members: 204, goal: '今日目标2h', color: 'coral' },
];

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    author: 'Lucy学习日记',
    avatar: 'L',
    time: '2小时前',
    group: '考研小组',
    content: '今天完成了8个番茄钟，终于把线代复习完了！感觉自己的专注力提升了很多，StudyFlow真的很有帮助 🎉',
    tags: ['打卡成功', '考研'],
    likes: 128,
    comments: 24,
    liked: false,
  },
  {
    id: '2',
    author: 'Mark的编程之路',
    avatar: 'M',
    time: '5小时前',
    group: '编程小组',
    content: '连续30天打卡达成！感谢小知每天的陪伴和鼓励，从拖延症晚期到现在每天稳定学习4小时，真的是肉眼可见的进步 💪',
    tags: ['30天成就', '编程'],
    likes: 256,
    comments: 42,
    liked: true,
  },
  {
    id: '3',
    author: '小陈的考研日记',
    avatar: 'C',
    time: '8小时前',
    group: '考研小组',
    content: '分享一个小技巧：用番茄钟 + 思维导图的方式学习高数，效果超好！每完成一个番茄就整理一张思维导图，知识点更清晰了。',
    tags: ['学习方法', '高数'],
    likes: 89,
    comments: 15,
    liked: false,
  },
];

const AVATAR_COLORS: Record<string, string> = {
  L: 'bg-sage',
  M: 'bg-blue-400',
  C: 'bg-coral',
  Y: 'bg-amber-400',
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [tab, setTab] = useState<'feed' | 'groups'>('feed');

  const toggleLike = (id: string) => {
    setPosts(posts.map((p) =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">学习社区</h1>
          <p className="text-stone text-sm mt-0.5">与同学共同进步，相互鼓励加油</p>
        </div>
        <button className="flex items-center gap-2 bg-coral text-white px-4 py-2.5 rounded-xl font-medium hover:bg-coral-600 transition-all active:scale-95 shadow-coral">
          <Plus className="w-4 h-4" />
          发布动态
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[['feed', '动态广场'], ['groups', '学习小组']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as 'feed' | 'groups')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === key ? 'bg-coral text-white shadow-coral' : 'bg-white text-stone hover:bg-warm border border-mist'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'feed' ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-5 shadow-soft hover:-translate-y-0.5 hover:shadow-medium transition-all">
              {/* Author */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${AVATAR_COLORS[post.avatar] || 'bg-mist'} rounded-full flex items-center justify-center text-white font-bold`}>
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-charcoal font-medium text-sm">{post.author}</p>
                  <p className="text-stone text-xs">{post.time} · {post.group}</p>
                </div>
              </div>

              {/* Content */}
              <p className="text-charcoal text-sm leading-relaxed mb-3">{post.content}</p>

              {/* Tags */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-coral/10 text-coral text-xs px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-6 text-stone pt-3 border-t border-mist/20">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-sm transition-all active:scale-95 hover:scale-105 ${
                    post.liked ? 'text-coral' : 'hover:text-coral'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.liked ? 'fill-coral' : ''}`} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm hover:text-coral transition-all">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm hover:text-coral transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GROUPS.map((group) => (
            <div
              key={group.name}
              className="bg-white rounded-2xl p-5 shadow-soft hover:-translate-y-1 hover:shadow-medium transition-all"
            >
              <div className={`w-12 h-12 bg-${group.color} rounded-xl flex items-center justify-center mb-4 shadow-soft`}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h3 className="font-semibold text-charcoal mb-1">{group.name}</h3>
              <p className="text-stone text-xs mb-3">{group.members} 人正在学习 · {group.goal}</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {['coral', 'sage', 'blue-400'].map((c, i) => (
                    <div key={i} className={`w-7 h-7 bg-${c} rounded-full border-2 border-white`} />
                  ))}
                  <div className="w-7 h-7 bg-warm rounded-full border-2 border-white flex items-center justify-center text-xs text-stone">
                    +{group.members - 3}
                  </div>
                </div>
                <button className="bg-coral text-white text-xs px-4 py-1.5 rounded-xl hover:bg-coral-600 transition-all active:scale-95">
                  加入小组
                </button>
              </div>
            </div>
          ))}

          {/* Create Group */}
          <div className="bg-warm rounded-2xl p-5 border-2 border-dashed border-mist flex flex-col items-center justify-center text-center cursor-pointer hover:border-coral transition-all group">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-soft group-hover:shadow-medium transition-all">
              <Plus className="w-6 h-6 text-stone group-hover:text-coral transition-colors" />
            </div>
            <p className="text-stone text-sm font-medium group-hover:text-coral transition-colors">创建新小组</p>
          </div>
        </div>
      )}
    </div>
  );
}
