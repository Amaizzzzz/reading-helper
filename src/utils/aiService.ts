import OpenAI from 'openai';
import { ChatMessage, ChatContext } from '../types/chat';
import { FlashcardData } from '../types/flashcard';
import { createMessage } from './chatManager';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

interface AIResponse {
  translation?: string;
  explanation?: string;
  grammarPoints?: {
    explanation: string;
    examples: string[];
  }[];
  relatedWords?: string[];
  suggestedFlashcards?: FlashcardData[];
}

export async function generateAIResponse(
  message: string,
  context: ChatContext,
  languagePair: { from: string; to: string }
): Promise<ChatMessage> {
  try {
    const systemPrompt = `You are a helpful language learning assistant for ${languagePair.to} (learning) from ${languagePair.from} (native).
Current learning level: ${context.learningLevel} (1-5).
Recent topics: ${context.preferredTopics.join(', ')}.

Provide responses in the following format:
1. Translation (if requested)
2. Natural explanation in ${languagePair.from}
3. Grammar points (if relevant)
4. Related vocabulary
5. Example sentences

Keep explanations appropriate for the user's level.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const aiResponse = parseAIResponse(completion.choices[0].message.content || '');
    
    // Create flashcards from related words
    const flashcards = aiResponse.relatedWords?.map(word => ({
      word,
      translation: {
        basic: { translation: "To be translated", examples: [] },
        intermediate: { translation: "To be translated", examples: [] },
        advanced: { translation: "To be translated", examples: [] }
      },
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      nextReview: new Date().toISOString(),
      repetitionStage: 0,
      correctStreak: 0,
      incorrectStreak: 0,
      examples: [],
      notes: ''
    })) || [];

    return createMessage('assistant', aiResponse.explanation || '', {
      grammarPoints: aiResponse.grammarPoints,
      relatedWords: aiResponse.relatedWords,
      suggestedFlashcards: flashcards
    });
  } catch (error) {
    console.error('AI Service Error:', error);
    return createMessage(
      'system',
      'Sorry, I encountered an error while processing your request. Please try again.'
    );
  }
}

function parseAIResponse(response: string): AIResponse {
  // This is a simple parser - you might want to make it more robust
  const sections = response.split('\n\n');
  const result: AIResponse = {};

  sections.forEach(section => {
    if (section.startsWith('Translation:')) {
      result.translation = section.replace('Translation:', '').trim();
    } else if (section.startsWith('Grammar Points:')) {
      result.grammarPoints = section
        .replace('Grammar Points:', '')
        .trim()
        .split('\n')
        .filter(Boolean)
        .map(point => {
          const [explanation, ...examples] = point.split(':');
          return {
            explanation: explanation.trim(),
            examples: examples.join(':').split(';').map(ex => ex.trim())
          };
        });
    } else if (section.startsWith('Related Words:')) {
      result.relatedWords = section
        .replace('Related Words:', '')
        .trim()
        .split('\n')
        .map(word => word.trim());
    } else {
      // Assume it's the explanation if no specific marker
      result.explanation = section.trim();
    }
  });

  return result;
} 