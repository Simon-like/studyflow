import { Send, Mic } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function ChatInput({ value, onChange, onSend, onKeyDown }: ChatInputProps) {
  const canSend = value.trim().length > 0;

  return (
    <div className="px-6 pb-6 pt-2">
      <div className="bg-white rounded-2xl p-3 shadow-medium flex items-center gap-3">
        <button className="w-10 h-10 bg-warm rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-mist/30 transition-all">
          <Mic className="w-5 h-5 text-stone" />
        </button>
        <input
          type="text"
          placeholder="输入消息..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 text-charcoal placeholder-mist focus:outline-none text-sm bg-transparent"
        />
        <button
          onClick={onSend}
          disabled={!canSend}
          className="w-10 h-10 bg-coral rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-coral-600 transition-all active:scale-95 disabled:opacity-40 shadow-coral"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
