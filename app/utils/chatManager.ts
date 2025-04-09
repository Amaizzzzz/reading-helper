import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatSession, ChatContext, ChatAnalytics } from '../types/chat';
import { FlashcardData } from '../types/flashcard';
import { generateAIResponse } from './aiService';

export function createChatSession(
  languageFrom: string,
  languageTo: string,
  context?: Partial<ChatContext>
): ChatSession {
  const defaultContext: ChatContext = {
    recentFlashcards: [],
    learningLevel: 1,
    preferredTopics: [],
    lastInteractionTime: null
  };

  return {
    id: uuidv4(),
    title: `${languageFrom} to ${languageTo} Chat`,
    messages: [],
    context: { ...defaultContext, ...context },
    languagePair: {
      from: languageFrom,
      to: languageTo
    },
    created: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };
}

export function createMessage(
  role: 'user' | 'assistant' | 'system',
  content: string,
  extras?: {
    relatedWords?: string[];
    suggestedFlashcards?: FlashcardData[];
    grammarPoints?: { explanation: string; examples: string[] }[];
  }
): ChatMessage {
  return {
    id: uuidv4(),
    role,
    content,
    timestamp: new Date().toISOString(),
    ...extras
  };
}

export function updateChatContext(
  session: ChatSession,
  updates: Partial<ChatContext>
): ChatSession {
  return {
    ...session,
    context: { ...session.context, ...updates },
    lastUpdated: new Date().toISOString()
  };
}

export function analyzeChat(session: ChatSession): {
  topics: string[];
  suggestedLevel: number;
  grammarPoints: string[];
} {
  // Extract topics from messages
  const topics = new Set<string>();
  const grammarPoints = new Set<string>();
  let totalComplexity = 0;
  let messageCount = 0;

  session.messages.forEach(message => {
    if (message.grammarPoints) {
      message.grammarPoints.forEach(point => {
        grammarPoints.add(point.explanation);
      });
    }

    // Simple complexity analysis based on message length and structure
    if (message.role === 'user') {
      const complexity = calculateMessageComplexity(message.content);
      totalComplexity += complexity;
      messageCount++;
    }
  });

  // Suggest learning level based on average message complexity
  const averageComplexity = messageCount > 0 ? totalComplexity / messageCount : 1;
  const suggestedLevel = Math.min(Math.ceil(averageComplexity / 2), 5);

  return {
    topics: Array.from(topics),
    suggestedLevel,
    grammarPoints: Array.from(grammarPoints)
  };
}

export async function generateResponse(
  message: string,
  context: ChatContext,
  languagePair: { from: string; to: string }
): Promise<ChatMessage> {
  return generateAIResponse(message, context, languagePair);
}

export function updateAnalytics(
  analytics: ChatAnalytics,
  session: ChatSession
): ChatAnalytics {
  const sessionAnalysis = analyzeChat(session);
  
  return {
    ...analytics,
    totalSessions: analytics.totalSessions + 1,
    totalMessages: analytics.totalMessages + session.messages.length,
    grammarPointsCovered: analytics.grammarPointsCovered + sessionAnalysis.grammarPoints.length,
    vocabularyIntroduced: analytics.vocabularyIntroduced + 
      session.messages.reduce((sum, msg) => sum + (msg.relatedWords?.length || 0), 0),
    learningProgress: [
      ...analytics.learningProgress,
      {
        date: new Date().toISOString(),
        score: sessionAnalysis.suggestedLevel
      }
    ]
  };
}

function calculateMessageComplexity(content: string): number {
  // Simple complexity calculation based on:
  // - Message length
  // - Sentence structure
  // - Vocabulary diversity
  const words = content.split(/\s+/);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  const sentences = content.split(/[.!?]+/).filter(Boolean);
  const avgSentenceLength = words.length / sentences.length;

  return (
    (uniqueWords.size / words.length) * 2 +
    (avgWordLength / 5) +
    (avgSentenceLength / 10)
  );
} 