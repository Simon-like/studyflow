import { useCompanionChat } from './hooks';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessages } from './components/ChatMessages';
import { QuickActions } from './components/QuickActions';
import { ChatInput } from './components/ChatInput';

export default function CompanionPage() {
  const {
    messages,
    input,
    setInput,
    isTyping,
    sendMessage,
    handleQuickAction,
    handleKeyDown,
  } = useCompanionChat();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-warm to-cream">
      <ChatHeader />
      <ChatMessages messages={messages} isTyping={isTyping} />
      <QuickActions onActionClick={handleQuickAction} />
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={() => sendMessage(input)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
