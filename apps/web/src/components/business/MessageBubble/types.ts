export interface Suggestion {
  text: string;
  index?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  time: string;
  suggestions?: Suggestion[];
}

export interface MessageBubbleProps extends Message {}
