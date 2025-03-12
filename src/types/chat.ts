import { FlashcardData } from './flashcard';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  relatedWords?: string[];
  suggestedFlashcards?: FlashcardData[];
  grammarPoints?: {
    explanation: string;
    examples: string[];
  }[];
}

export interface ChatContext {
  recentFlashcards: FlashcardData[];
  learningLevel: number;
  preferredTopics: string[];
  lastInteractionTime: string | null;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  context: ChatContext;
  languagePair: {
    from: string;
    to: string;
  };
  created: string;
  lastUpdated: string;
}

export interface ChatAnalytics {
  totalSessions: number;
  totalMessages: number;
  averageResponseTime: number;
  topicDistribution: Record<string, number>;
  grammarPointsCovered: number;
  vocabularyIntroduced: number;
  learningProgress: {
    date: string;
    score: number;
  }[];
} 