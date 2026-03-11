import { useState, useRef, useEffect, useCallback } from 'react';
import { generateId } from '@/lib/utils';
import type { ChatMessage } from '@/types';
import type { QuickAction } from './types';
import { INITIAL_MESSAGES, AI_REPLIES, TYPING_DELAY } from './constants';

export function useCompanionChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const now = new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Add user message
      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: text,
        time: now,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');

      // Show typing indicator
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, TYPING_DELAY));
      setIsTyping(false);

      // Add AI reply
      const replyContent =
        AI_REPLIES[text] ||
        AI_REPLIES.default.replace('你说的', `你说的"${text}"`);

      const aiMsg: ChatMessage = {
        id: generateId(),
        role: 'ai',
        content: replyContent,
        time: new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    },
    []
  );

  const handleQuickAction = useCallback(
    (action: QuickAction) => {
      sendMessage(action);
    },
    [sendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [input, sendMessage]
  );

  return {
    messages,
    input,
    setInput,
    isTyping,
    bottomRef,
    sendMessage,
    handleQuickAction,
    handleKeyDown,
  };
}
