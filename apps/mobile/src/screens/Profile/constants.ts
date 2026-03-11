/**
 * Profile 页面常量
 */

// 用户默认数据
export const DEFAULT_USER = {
  name: '应东林',
  subtitle: '考研冲刺中 · 坚持 23 天',
  avatar: 'Y',
  badges: [
    { label: '数学达人', variant: 'primary' as const },
    { label: '早起鸟', variant: 'secondary' as const },
  ],
};

// 统计数据
export const DEFAULT_STATS = {
  totalStudy: '128h',
  completedPomodoros: '48',
  streakDays: '23天',
};

// 成就数据
export const ACHIEVEMENTS = [
  { icon: '⚡', title: '专注达人', desc: '连续专注30分钟', unlocked: true },
  { icon: '🎯', title: '任务完成', desc: '完成10个任务', unlocked: true },
  { icon: '🔥', title: '连续打卡', desc: '连续7天打卡', unlocked: true },
  { icon: '📚', title: '知识探索', desc: '学习100小时', unlocked: false },
  { icon: '🏆', title: '番茄大师', desc: '累计100个番茄', unlocked: false },
  { icon: '🌟', title: '社区之星', desc: '获得100赞', unlocked: false },
];

// 周学习数据
export const WEEK_DATA = [3.5, 4.0, 2.5, 5.0, 3.0, 4.5, 2.0];
export const WEEK_DAYS = ['一', '二', '三', '四', '五', '六', '日'];

// 学习目标
export const STUDY_GOALS = [
  { label: '考研数学', progress: 68 },
  { label: '英语备考', progress: 45 },
  { label: '专业课', progress: 82 },
];

// 菜单项
export const MENU_ITEMS = [
  { icon: '📊', label: '学习统计', sub: '查看详细数据' },
  { icon: '🏅', label: '成就中心', sub: '3/6 已解锁' },
  { icon: '⚙️', label: '番茄钟设置', sub: '25分钟专注' },
  { icon: '🔔', label: '通知设置', sub: '已开启' },
  { icon: '🎨', label: '外观主题', sub: '浅色模式' },
  { icon: '❓', label: '帮助与反馈', sub: '' },
];
