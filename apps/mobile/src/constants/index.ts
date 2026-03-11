/**
 * 全局常量配置
 * 
 * 原则:
 * 1. 应用通用的常量优先从 @studyflow/shared 导入
 * 2. 仅在此定义移动端特有的常量
 */

import { 
  DEFAULT_FOCUS_DURATION, 
  DEFAULT_SHORT_BREAK_DURATION, 
  DEFAULT_LONG_BREAK_DURATION,
  POMODOROS_BEFORE_LONG_BREAK,
  APP_NAME,
  APP_VERSION 
} from '@studyflow/shared';

// 重新导出 shared 常量，方便组件使用
export { 
  DEFAULT_FOCUS_DURATION, 
  DEFAULT_SHORT_BREAK_DURATION, 
  DEFAULT_LONG_BREAK_DURATION,
  POMODOROS_BEFORE_LONG_BREAK,
  APP_NAME,
  APP_VERSION 
} from '@studyflow/shared';

// 番茄钟配置
// 使用 shared 包的基础配置，添加移动端特有的视觉配置
export const POMODORO_CONFIG = {
  // 视觉配置 (移动端特有)
  RADIUS: 90,
  get CIRCUMFERENCE() {
    return 2 * Math.PI * this.RADIUS;
  },
  
  // 业务配置 (来自 shared 包)
  DEFAULT_DURATION: DEFAULT_FOCUS_DURATION,
  SHORT_BREAK: DEFAULT_SHORT_BREAK_DURATION,
  LONG_BREAK: DEFAULT_LONG_BREAK_DURATION,
  POMODOROS_BEFORE_LONG_BREAK,
  
  // 移动端特有的限制配置
  MIN_DURATION: 15 * 60,
  MAX_DURATION: 120 * 60,
} as const;

// 时间格式化
export const TIME_FORMAT = {
  FULL: 'HH:mm',
  SHORT: 'H:mm',
  DATE: 'MM/dd',
  DATE_FULL: 'yyyy-MM-dd',
  RELATIVE: 'relative',
} as const;

// 社区配置
export const COMMUNITY_CONFIG = {
  GROUPS: ['全部', '考研', '编程', '英语', '运动'],
  MAX_POST_LENGTH: 500,
  MAX_COMMENT_LENGTH: 200,
} as const;

// 成就配置
export const ACHIEVEMENTS = [
  { id: 'focus_master', icon: '⚡', title: '专注达人', desc: '连续专注30分钟', unlocked: true },
  { id: 'task_complete', icon: '🎯', title: '任务完成', desc: '完成10个任务', unlocked: true },
  { id: 'streak_7', icon: '🔥', title: '连续打卡', desc: '连续7天打卡', unlocked: true },
  { id: 'knowledge_seeker', icon: '📚', title: '知识探索', desc: '学习100小时', unlocked: false },
  { id: 'pomodoro_master', icon: '🏆', title: '番茄大师', desc: '累计100个番茄', unlocked: false },
  { id: 'community_star', icon: '🌟', title: '社区之星', desc: '获得100赞', unlocked: false },
] as const;

// 菜单项
export const MENU_ITEMS = [
  { icon: '📊', label: '学习统计', sub: '查看详细数据' },
  { icon: '🏅', label: '成就中心', sub: '3/6 已解锁' },
  { icon: '⚙️', label: '番茄钟设置', sub: '25分钟专注' },
  { icon: '🔔', label: '通知设置', sub: '已开启' },
  { icon: '🎨', label: '外观主题', sub: '浅色模式' },
  { icon: '❓', label: '帮助与反馈', sub: '' },
] as const;

// 快捷操作
export const QUICK_ACTIONS = ['生成计划', '开始专注', '查看进度', '激励我', '学习方法'] as const;

// AI 回复模板
export const AI_REPLIES: Record<string, string> = {
  '生成计划': '好的！为你制定考研计划：\n\n📅 上午：数学3个番茄钟\n📅 下午：专业课2个番茄钟\n📅 晚上：政治+英语各1个\n\n坚持就是胜利！',
  '开始专注': '🍅 番茄钟已就绪！\n\n⏱️ 专注时间：25分钟\n🎯 当前任务：考研数学\n\n专注期间放下手机，你可以的！',
  '查看进度': '📊 本周成绩：\n\n✅ 番茄钟：48个\n⏱️ 学习时长：20小时\n🔥 连续打卡：23天\n📈 完成率：89%\n\n比上周提升了15%，太棒了！',
  '激励我': '加油！你已坚持23天！💪\n\n每一次专注都是对未来最好的投资。\n\n你比你想象的更强大！🌟',
  '学习方法': '考研数学推荐方法：\n\n1️⃣ 番茄工作法：25分钟专注\n2️⃣ 错题本：分析每次错误\n3️⃣ 思维导图：梳理知识点\n4️⃣ 间隔复习：定期强化记忆',
};

// 周数据（用于统计图表）
export const WEEK_DATA = [3.5, 4.0, 2.5, 5.0, 3.0, 4.5, 2.0];
export const WEEK_DAYS = ['一', '二', '三', '四', '五', '六', '日'];

// 默认任务数据
export const DEFAULT_TASKS = [
  { id: 1, title: '英语单词背诵', sub: '100个单词 · 已完成', done: true, active: false },
  { id: 2, title: '考研数学复习', sub: '进行中 · 预计4个番茄', done: false, active: true },
  { id: 3, title: '专业课笔记整理', sub: '预计2个番茄', done: false, active: false },
];

// 导航配置
export const TABS = [
  { key: 'home', label: '首页' },
  { key: 'companion', label: '学伴' },
  { key: 'community', label: '社区' },
  { key: 'profile', label: '我的' },
] as const;

export type TabKey = typeof TABS[number]['key'];
