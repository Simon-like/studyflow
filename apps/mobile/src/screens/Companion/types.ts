/**
 * Companion 页面类型定义
 */

import { Suggestion } from '../../components/business/ChatMessage';

export type MessageRole = 'user' | 'ai';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  time: string;
  suggestions?: Suggestion[];
}
