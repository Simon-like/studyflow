import type { Post, StudyGroup } from '@/types';

export const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    author: 'Lucy学习日记',
    avatar: 'L',
    time: '2小时前',
    group: '考研小组',
    content:
      '今天完成了8个番茄钟，终于把线代复习完了！感觉自己的专注力提升了很多，StudyFlow真的很有帮助 🎉',
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
    content:
      '连续30天打卡达成！感谢小知每天的陪伴和鼓励，从拖延症晚期到现在每天稳定学习4小时，真的是肉眼可见的进步 💪',
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
    content:
      '分享一个小技巧：用番茄钟 + 思维导图的方式学习高数，效果超好！每完成一个番茄就整理一张思维导图，知识点更清晰了。',
    tags: ['学习方法', '高数'],
    likes: 89,
    comments: 15,
    liked: false,
  },
];

export const GROUPS: StudyGroup[] = [
  { id: '1', name: '考研冲刺营', members: 328, goal: '今日目标6h', color: 'coral' },
  { id: '2', name: '编程学习圈', members: 512, goal: '今日目标4h', color: 'sage' },
  { id: '3', name: '英语提升团', members: 204, goal: '今日目标2h', color: 'coral' },
];

export const TAB_ITEMS = [
  { key: 'feed', label: '动态广场' },
  { key: 'groups', label: '学习小组' },
] as const;
