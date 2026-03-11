/**
 * Companion 页面
 * AI 学习伙伴
 */

import React from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { ChatMessage } from '../../components/business/ChatMessage';
import { ChatHeader, ChatInput, QuickActions, TypingIndicator } from './components';
import { useCompanionScreen } from './hooks';
import { colors, spacing } from '../../theme';

export default function CompanionScreen() {
  const {
    messages,
    input,
    setInput,
    typing,
    scrollViewRef,
    handleQuickAction,
    handleSend,
  } = useCompanionScreen();
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 头部 */}
      <ChatHeader />
      
      {/* 消息列表 */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            id={msg.id}
            role={msg.role}
            content={msg.content}
            time={msg.time}
            suggestions={msg.suggestions}
          />
        ))}
        
        {typing && <TypingIndicator />}
      </ScrollView>
      
      {/* 快捷操作 */}
      <QuickActions onAction={handleQuickAction} />
      
      {/* 输入框 */}
      <ChatInput
        value={input}
        onChangeText={setInput}
        onSend={handleSend}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warm,
  },
  messages: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  messagesContent: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
});
