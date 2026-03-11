/**
 * Companion 页面自定义 Hooks
 */

import { useState, useCallback } from 'react';
import { Message } from './types';
import { INITIAL_MESSAGES, AI_REPLIES, DEFAULT_REPLY, TYPING_DELAY } from './constants';
import { generateId, getCurrentTime, delay } from '../../utils';
import { useScrollToEnd } from '../../hooks';

export function useCompanionScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const { scrollViewRef, scrollToEnd } = useScrollToEnd();
  
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    // 添加用户消息
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: text,
      time: getCurrentTime(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    scrollToEnd();
    
    // 模拟AI回复
    await delay(TYPING_DELAY);
    
    setTyping(false);
    
    const reply = AI_REPLIES[text] || DEFAULT_REPLY;
    const aiMsg: Message = {
      id: generateId(),
      role: 'ai',
      content: reply,
      time: getCurrentTime(),
    };
    
    setMessages(prev => [...prev, aiMsg]);
    scrollToEnd();
  }, [scrollToEnd]);
  
  const handleQuickAction = useCallback((action: string) => {
    sendMessage(action);
  }, [sendMessage]);
  
  const handleSend = useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);
  
  return {
    messages,
    input,
    setInput,
    typing,
    scrollViewRef,
    sendMessage,
    handleQuickAction,
    handleSend,
  };
}
