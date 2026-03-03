import { useState, useRef } from 'react';
import { Mic, Send, Sparkles, Clock, Calendar, Target } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'plan' | 'suggestion';
}

interface CompanionScreenProps {
  onStartFocus?: () => void;
  onViewStats?: () => void;
}

const quickActions = [
  { label: '生成计划', icon: Calendar },
  { label: '开始专注', icon: Clock },
  { label: '查看进度', icon: Target },
];

export function CompanionScreen({ onStartFocus, onViewStats }: CompanionScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好呀！我是小知，你的学习伙伴。今天想完成什么目标呢？',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Mock AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '收到！我来帮你制定一个学习计划。根据你的目标，建议今天完成3个番茄钟的专注学习。需要我帮你设置计时器吗？',
        type: 'suggestion',
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">学伴</h1>
          <p className="text-stone text-sm">AI 智能学习伙伴</p>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-coral" />
          <span className="text-sm text-coral">AI 就绪</span>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="flex-shrink-0 flex flex-col items-center py-8">
        <div className="relative w-40 h-40">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-coral/20 rounded-full blur-2xl animate-pulse" />
          
          {/* Avatar Circle */}
          <div className="relative w-full h-full gradient-coral rounded-full flex items-center justify-center shadow-xl">
            {/* Simple Animated Face */}
            <div className="text-center">
              <div className="flex gap-6 mb-4">
                <div className="w-4 h-6 bg-white rounded-full animate-pulse" />
                <div className="w-4 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
              </div>
              <div className="w-8 h-4 border-b-4 border-white rounded-full mx-auto" />
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-sage rounded-full border-4 border-white" />
        </div>
        
        <p className="text-stone mt-4 text-sm">正在倾听中...</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 gradient-coral rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">知</span>
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-coral text-white rounded-br-md'
                  : 'bg-white text-charcoal rounded-bl-md shadow-sm'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => action.label === '开始专注' ? onStartFocus?.() : null}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm text-charcoal 
                       shadow-sm hover:shadow-md transition-all whitespace-nowrap"
          >
            <action.icon className="w-4 h-4 text-coral" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white rounded-2xl p-3 shadow-lg flex items-center gap-3">
        <button 
          onClick={() => setIsListening(!isListening)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isListening ? 'bg-coral text-white' : 'bg-warm text-stone'
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="输入消息..."
          className="flex-1 text-charcoal placeholder:text-mist focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className="w-10 h-10 bg-coral rounded-xl flex items-center justify-center text-white
                     disabled:opacity-50 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
