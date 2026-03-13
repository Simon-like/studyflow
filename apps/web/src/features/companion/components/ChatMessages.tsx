import { useRef, useEffect } from 'react';
import { MessageBubble } from '@/components/business';
import { TypingIndicator } from './TypingIndicator';
import type { ChatMessage } from '@/types';
import type { Suggestion } from '@/components/business/MessageBubble';

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
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
      {messages.map((msg) => {
        const messageProps = {
          ...msg,
          suggestions: msg.suggestions?.map((text, index): Suggestion => ({ text, index })),
        };
        return <MessageBubble key={msg.id} {...messageProps} />;
      })}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
