import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const COLORS = {
  coral: '#E8A87C',
  coralLight: '#F5C9A8',
  sage: '#9DB5A0',
  cream: '#FDF8F3',
  warm: '#FAF5F0',
  charcoal: '#3D3D3D',
  stone: '#8A8A8A',
  mist: '#C9C5C1',
  white: '#FFFFFF',
};

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  time: string;
  suggestions?: string[];
}

const QUICK_ACTIONS = ['生成计划', '开始专注', '查看进度', '激励我', '学习方法'];

const AI_REPLIES: Record<string, string> = {
  '生成计划': '好的！为你制定考研计划：\n\n📅 上午：数学3个番茄钟\n📅 下午：专业课2个番茄钟\n📅 晚上：政治+英语各1个\n\n坚持就是胜利！',
  '开始专注': '🍅 番茄钟已就绪！\n\n⏱️ 专注时间：25分钟\n🎯 当前任务：考研数学\n\n专注期间放下手机，你可以的！',
  '查看进度': '📊 本周成绩：\n\n✅ 番茄钟：48个\n⏱️ 学习时长：20小时\n🔥 连续打卡：23天\n📈 完成率：89%\n\n比上周提升了15%，太棒了！',
  '激励我': '加油！你已坚持23天！💪\n\n每一次专注都是对未来最好的投资。\n\n你比你想象的更强大！🌟',
  '学习方法': '考研数学推荐方法：\n\n1️⃣ 番茄工作法：25分钟专注\n2️⃣ 错题本：分析每次错误\n3️⃣ 思维导图：梳理知识点\n4️⃣ 间隔复习：定期强化记忆',
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'ai',
    content: '你好呀！我是小知，你的智能学习伙伴 ✨\n今天想完成什么目标呢？',
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
    content: '考研复习确实需要专注力！我建议这样安排：',
    time: '10:01',
    suggestions: ['每天上午专注3个番茄钟', '配合锁屏模式减少干扰', '定期提醒你休息'],
  },
];

export function CompanionScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const now = () => new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, time: now() };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const reply = AI_REPLIES[text] || `我理解你的问题"${text}"。建议先制定清晰目标，用番茄钟分段完成。你现在从哪里开始呢？`;
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: reply, time: now() };
      setMessages((p) => [...p, aiMsg]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1200);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>知</Text>
          </View>
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>小知 · AI 学习伙伴</Text>
          <Text style={styles.headerStatus}>正在倾听中...</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>···</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.msgRow, msg.role === 'user' && styles.msgRowUser]}>
            {msg.role === 'ai' && (
              <View style={styles.msgAiAvatar}>
                <Text style={styles.msgAiAvatarText}>知</Text>
              </View>
            )}
            <View style={styles.msgBubbleWrap}>
              <View style={[styles.msgBubble, msg.role === 'user' ? styles.msgBubbleUser : styles.msgBubbleAi]}>
                <Text style={[styles.msgText, msg.role === 'user' && styles.msgTextUser]}>
                  {msg.content}
                </Text>
                {msg.suggestions && (
                  <View style={styles.suggestions}>
                    {msg.suggestions.map((s, i) => (
                      <View key={i} style={styles.suggestionRow}>
                        <View style={styles.suggestionNum}>
                          <Text style={styles.suggestionNumText}>{i + 1}</Text>
                        </View>
                        <Text style={styles.suggestionText}>{s}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <Text style={styles.msgTime}>{msg.time}</Text>
            </View>
          </View>
        ))}

        {typing && (
          <View style={styles.msgRow}>
            <View style={styles.msgAiAvatar}>
              <Text style={styles.msgAiAvatarText}>知</Text>
            </View>
            <View style={[styles.msgBubble, styles.msgBubbleAi, styles.typingBubble]}>
              <View style={styles.typingDots}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={styles.typingDot} />
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Actions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickActions}
        contentContainerStyle={styles.quickActionsContent}
      >
        {QUICK_ACTIONS.map((a) => (
          <TouchableOpacity key={a} style={styles.quickBtn} onPress={() => sendMessage(a)} activeOpacity={0.7}>
            <Text style={styles.quickBtnText}>{a}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.micBtn}>
          <Text style={styles.micIcon}>🎤</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="输入消息..."
          placeholderTextColor={COLORS.mist}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => sendMessage(input)}
          returnKeyType="send"
          multiline={false}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.sendIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.warm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: `${COLORS.white}CC`,
    borderBottomWidth: 1,
    borderBottomColor: `${COLORS.mist}30`,
    gap: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  aiAvatarText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.sage,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.charcoal,
  },
  headerStatus: {
    fontSize: 12,
    color: COLORS.stone,
    marginTop: 1,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.white}80`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnText: {
    fontSize: 16,
    color: COLORS.charcoal,
    fontWeight: 'bold',
  },
  messages: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
    gap: 16,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  msgRowUser: {
    flexDirection: 'row-reverse',
  },
  msgAiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  msgAiAvatarText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  msgBubbleWrap: {
    maxWidth: '75%',
    gap: 3,
  },
  msgBubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  msgBubbleAi: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  msgBubbleUser: {
    backgroundColor: COLORS.coral,
    borderBottomRightRadius: 4,
  },
  msgText: {
    fontSize: 14,
    color: COLORS.charcoal,
    lineHeight: 20,
  },
  msgTextUser: {
    color: COLORS.white,
  },
  msgTime: {
    fontSize: 10,
    color: COLORS.mist,
    paddingHorizontal: 4,
  },
  suggestions: {
    marginTop: 10,
    backgroundColor: COLORS.warm,
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  suggestionNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: `${COLORS.coral}25`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionNumText: {
    fontSize: 11,
    color: COLORS.coral,
    fontWeight: '600',
  },
  suggestionText: {
    fontSize: 12,
    color: COLORS.charcoal,
    flex: 1,
  },
  typingBubble: {
    paddingVertical: 14,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.coral,
  },
  quickActions: {
    maxHeight: 48,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  quickActionsContent: {
    gap: 8,
    paddingVertical: 4,
  },
  quickBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  quickBtnText: {
    fontSize: 13,
    color: COLORS.charcoal,
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.warm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.charcoal,
    paddingVertical: 4,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  sendIcon: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
