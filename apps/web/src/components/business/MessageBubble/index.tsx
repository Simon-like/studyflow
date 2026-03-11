import { Avatar } from '@/components/ui';
import type { MessageBubbleProps, Message, Suggestion } from './types';

function SuggestionList({ suggestions }: { suggestions: Suggestion[] }) {
  return (
    <div className="mt-3 bg-warm rounded-xl p-3 space-y-2">
      {suggestions.map((s, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-charcoal">
          {s.index !== undefined && (
            <span className="w-5 h-5 bg-coral/20 rounded-full flex items-center justify-center text-coral font-medium flex-shrink-0">
              {s.index}
            </span>
          )}
          <span>{s.text}</span>
        </div>
      ))}
    </div>
  );
}

export function MessageBubble({
  role,
  content,
  time,
  suggestions,
}: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-coral rounded-full flex-shrink-0 flex items-center justify-center shadow-soft mt-1">
          <span className="text-white text-xs font-bold">知</span>
        </div>
      )}
      <div
        className={`max-w-[70%] ${
          isUser ? 'items-end' : 'items-start'
        } flex flex-col gap-1`}
      >
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
            isUser
              ? 'bg-coral text-white rounded-br-md'
              : 'bg-white text-charcoal shadow-soft rounded-bl-md'
          }`}
        >
          {content}
          {suggestions && <SuggestionList suggestions={suggestions} />}
        </div>
        <span className="text-mist text-xs px-1">{time}</span>
      </div>
    </div>
  );
}

export { type MessageBubbleProps, type Message, type Suggestion } from './types';
