import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MoreVertical } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  time: string;
  suggestions?: string[];
}

const QUICK_ACTIONS = ['生成学习计划', '开始专注', '查看进度', '激励一下我', '推荐学习方法'];

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'ai',
    content: '你好呀！我是小知，你的智能学习伙伴 ✨ 今天想完成什么目标呢？',
    time: '10:00',
  },
  {
    id: '2',
    role: 'user',
    content: '我想准备考研数学，但是总是容易分心',
    time: '10:01',
  },
  {
    id: '3',
    role: 'ai',
    content: '考研复习确实需要很强的专注力！我建议这样安排：',
    time: '10:01',
    suggestions: ['每天上午专注学习3个番茄钟', '配合锁屏模式减少干扰', '我会定期提醒你休息哦'],
  },
];

const AI_REPLIES: Record<string, string> = {
  '生成学习计划': '好的！根据你的考研目标，我为你制定了以下计划：\n\n📅 上午（9:00-12:00）：数学3个番茄钟\n📅 下午（14:00-17:00）：专业课2个番茄钟\n📅 晚上（19:00-21:00）：政治+英语各1个番茄钟\n\n你觉得这个安排合适吗？',
  '开始专注': '太棒了！准备好了吗？\n\n🍅 番茄钟已为你设置好 25 分钟\n🎯 当前任务：考研数学复习\n\n记住：专注期间放下手机，你可以的！',
  '查看进度': '📊 本周学习情况：\n\n✅ 完成番茄钟：48 个\n⏱️ 总专注时长：20 小时\n📈 完成率：89%\n🔥 连续打卡：23 天\n\n相比上周提升了 15%，继续加油！',
  '激励一下我': '加油！你已经坚持了 23 天！\n\n每一次专注都是对未来的投资 💪\n现在的努力，会在考场上得到回报。\n\n你比你想象的更强大，继续前进！🌟',
  '推荐学习方法': '针对考研数学，我推荐以下方法：\n\n1️⃣ 番茄工作法：25分钟专注+5分钟休息\n2️⃣ 错题本：及时记录分析错误\n3️⃣ 思维导图：梳理知识点关联\n4️⃣ 定时复习：间隔重复强化记忆\n\n需要我详细介绍某个方法吗？',
};

export default function CompanionPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, time: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    await new Promise((r) => setTimeout(r, 1200));
    setTyping(false);

    const replyContent = AI_REPLIES[text] || `我理解你说的"${text}"。作为你的学习伙伴，我建议先制定清晰的目标，然后用番茄钟分段完成。你现在想从哪里开始呢？`;
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: replyContent,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-warm to-cream">
      {/* Header */}
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 bg-coral rounded-full flex-shrink-0 flex items-center justify-center shadow-soft mt-1">
                <span className="text-white text-xs font-bold">知</span>
              </div>
            )}
            <div className={`max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-coral text-white rounded-br-md'
                    : 'bg-white text-charcoal shadow-soft rounded-bl-md'
                }`}
              >
                {msg.content}
                {msg.suggestions && (
                  <div className="mt-3 bg-warm rounded-xl p-3 space-y-2">
                    {msg.suggestions.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-charcoal">
                        <span className="w-5 h-5 bg-coral/20 rounded-full flex items-center justify-center text-coral font-medium flex-shrink-0">
                          {i + 1}
                        </span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-mist text-xs px-1">{msg.time}</span>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-coral rounded-full flex-shrink-0 flex items-center justify-center shadow-soft">
              <span className="text-white text-xs font-bold">知</span>
            </div>
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-soft">
              <div className="flex gap-1 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-coral rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => sendMessage(action)}
              className="flex-shrink-0 bg-white px-4 py-2 rounded-full text-sm text-charcoal shadow-soft hover:shadow-medium hover:text-coral transition-all active:scale-95"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="px-6 pb-6 pt-2">
        <div className="bg-white rounded-2xl p-3 shadow-medium flex items-center gap-3">
          <button className="w-10 h-10 bg-warm rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-mist/30 transition-all">
            <Mic className="w-5 h-5 text-stone" />
          </button>
          <input
            type="text"
            placeholder="输入消息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            className="flex-1 text-charcoal placeholder-mist focus:outline-none text-sm bg-transparent"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-10 h-10 bg-coral rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-coral-600 transition-all active:scale-95 disabled:opacity-40 shadow-coral"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
