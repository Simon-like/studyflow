import { useRef, useEffect } from 'react';
import { MessageBubble } from '@/components/business';
import { TypingIndicator } from './TypingIndicator';
import type { ChatMessage } from '@/types';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} {...msg} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
