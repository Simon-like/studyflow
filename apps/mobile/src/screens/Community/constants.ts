/**
 * Community 页面常量
 */

import { colors } from '../../theme';

// 学习小组
export const GROUPS = ['全部', '考研', '编程', '英语', '运动'];

// 默认推荐小组
export const DEFAULT_GROUP = {
  name: '考研冲刺营',
  memberCount: 328,
  dailyGoal: '6h',
  emoji: '🎯',
};

// 初始帖子数据
export const INITIAL_POSTS = [
  {
    id: '1',
    author: 'Lucy学习日记',
    avatar: 'L',
    avatarColor: colors.secondary,
    time: '2小时前',
    group: '考研小组',
    content: '今天完成了8个番茄钟，终于把线代复习完了！StudyFlow真的很有帮助 🎉',
    tags: ['打卡成功', '考研'],
    likes: 128,
    comments: 24,
    liked: false,
  },
  {
    id: '2',
    author: 'Mark的编程之路',
    avatar: 'M',
    avatarColor: '#81C784',
    time: '5小时前',
    group: '编程小组',
    content: '连续30天打卡达成！感谢小知每天的陪伴，从拖延症到每天学习4小时，进步真的很明显 💪',
    tags: ['30天成就', '编程'],
    likes: 256,
    comments: 42,
    liked: true,
  },
  {
    id: '3',
    author: '小陈的考研路',
    avatar: 'C',
    avatarColor: colors.primary,
    time: '8小时前',
    group: '考研小组',
    content: '分享一个技巧：番茄钟 + 思维导图学习高数，效果超好！每个番茄结束整理一张图，知识点更清晰了。',
    tags: ['学习方法', '高数'],
    likes: 89,
    comments: 15,
    liked: false,
  },
];
