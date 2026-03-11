import type { ChatMessage } from '@/types';

export interface CompanionState {
  messages: ChatMessage[];
  input: string;
  isTyping: boolean;
}

export type QuickAction = '生成学习计划' | '开始专注' | '查看进度' | '激励一下我' | '推荐学习方法';
