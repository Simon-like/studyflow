export type MessageRole = 'user' | 'ai';

export interface Suggestion {
  index: number;
  text: string;
}

export interface ChatMessageProps {
  id: string;
  role: MessageRole;
  content: string;
  time: string;
  suggestions?: Suggestion[];
  showAvatar?: boolean;
}
