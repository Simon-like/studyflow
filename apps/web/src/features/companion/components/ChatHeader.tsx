import { MoreVertical } from 'lucide-react';

export function ChatHeader() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-mist/20">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-coral to-coral-300 rounded-full flex items-center justify-center shadow-coral animate-pulse-soft">
          <span className="text-white font-bold text-lg">知</span>
        </div>
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-sage rounded-full border-2 border-white" />
      </div>
      <div className="flex-1">
        <h1 className="font-semibold text-charcoal">小知 · AI 学习伙伴</h1>
        <p className="text-stone text-xs">正在倾听中...</p>
      </div>
      <button className="p-2 text-stone hover:text-charcoal hover:bg-warm rounded-xl transition-all">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );
}
