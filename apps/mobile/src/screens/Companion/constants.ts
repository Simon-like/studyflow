/**
 * Companion 页面常量
 */

import { Suggestion } from '../../components/business/ChatMessage';

// AI 角色信息
export const AI_CHARACTER = {
  name: '小知',
  title: 'AI 学习伙伴',
  avatar: '知',
  status: '正在倾听中...',
};

// 快捷操作
export const QUICK_ACTIONS = ['生成计划', '开始专注', '查看进度', '激励我', '学习方法'];

// 初始消息
export const INITIAL_MESSAGES = [
  {
    id: '1',
    role: 'ai' as const,
    content: '你好呀！我是小知，你的智能学习伙伴 ✨\n今天想完成什么目标呢？',
    time: '10:00',
  },
  {
    id: '2',
    role: 'user' as const,
    content: '我想准备考研数学，但是总是容易分心',
    time: '10:01',
  },
  {
    id: '3',
    role: 'ai' as const,
    content: '考研复习确实需要专注力！我建议这样安排：',
    time: '10:01',
    suggestions: [
      { index: 1, text: '每天上午专注3个番茄钟' },
      { index: 2, text: '配合锁屏模式减少干扰' },
      { index: 3, text: '定期提醒你休息' },
    ] as Suggestion[],
  },
];

// AI 回复映射
export const AI_REPLIES: Record<string, string> = {
  '生成计划': '好的！为你制定考研计划：\n\n📅 上午：数学3个番茄钟\n📅 下午：专业课2个番茄钟\n📅 晚上：政治+英语各1个\n\n坚持就是胜利！',
  '开始专注': '🍅 番茄钟已就绪！\n\n⏱️ 专注时间：25分钟\n🎯 当前任务：考研数学\n\n专注期间放下手机，你可以的！',
  '查看进度': '📊 本周成绩：\n\n✅ 番茄钟：48个\n⏱️ 学习时长：20小时\n🔥 连续打卡：23天\n📈 完成率：89%\n\n比上周提升了15%，太棒了！',
  '激励我': '加油！你已坚持23天！💪\n\n每一次专注都是对未来最好的投资。\n\n你比你想象的更强大！🌟',
  '学习方法': '考研数学推荐方法：\n\n1️⃣ 番茄工作法：25分钟专注\n2️⃣ 错题本：分析每次错误\n3️⃣ 思维导图：梳理知识点\n4️⃣ 间隔复习：定期强化记忆',
};

// 默认回复
export const DEFAULT_REPLY = '我理解你的问题。建议先制定清晰目标，用番茄钟分段完成。你现在从哪里开始呢？';

// 打字动画延迟
export const TYPING_DELAY = 1200;
