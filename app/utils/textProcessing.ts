import { TranslationEntry, HighlightWord, TextAnalysis } from '../types/translation';

// Remove mock translations as we'll use real API data
interface TextMetrics {
  wordCount: number;
  sentenceCount: number;
  averageWordLength: number;
  uniqueWords: Set<string>;
  languageConfidence: {
    lang: string;
    confidence: number;
  };
}

function analyzeText(text: string): TextMetrics {
  const words = text.match(/\b\w+\b/g) || [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  
  // Simple language detection based on common words
  const englishWords = new Set(['the', 'is', 'at', 'which', 'on']);
  const frenchWords = new Set(['le', 'la', 'est', 'qui', 'dans']);
  const spanishWords = new Set(['el', 'la', 'es', 'que', 'en']);
  
  let englishCount = 0;
  let frenchCount = 0;
  let spanishCount = 0;
  
  words.forEach(word => {
    const lower = word.toLowerCase();
    if (englishWords.has(lower)) englishCount++;
    if (frenchWords.has(lower)) frenchCount++;
    if (spanishWords.has(lower)) spanishCount++;
  });
  
  const total = Math.max(1, englishCount + frenchCount + spanishCount);
  const confidences = [
    { lang: 'en', confidence: englishCount / total },
    { lang: 'fr', confidence: frenchCount / total },
    { lang: 'es', confidence: spanishCount / total }
  ];
  
  const primaryLanguage = confidences.reduce((a, b) => 
    a.confidence > b.confidence ? a : b
  );

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    averageWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length,
    uniqueWords,
    languageConfidence: primaryLanguage
  };
}

export function findHighlightWords(text: string): HighlightWord[] {
  const words = text.match(/\b\w+\b/g) || [];
  const highlights: HighlightWord[] = [];
  const seenPositions = new Set<number>();

  // Find all word positions
  const wordPositions = words.reduce((acc, word, idx) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!seenPositions.has(match.index)) {
        acc.push({
          word,
          index: match.index,
          originalCase: text.slice(match.index, match.index + word.length)
        });
        seenPositions.add(match.index);
      }
    }
    return acc;
  }, [] as Array<{ word: string; index: number; originalCase: string }>);

  // Sort by position to maintain order
  wordPositions.sort((a, b) => a.index - b.index);

  return wordPositions.map(({ word, index, originalCase }) => ({
    word: originalCase,
    startIndex: index,
    endIndex: index + word.length,
    translation: {
      word: word,
      context: text.slice(Math.max(0, index - 100), Math.min(text.length, index + word.length + 100)),
      translation: {
        basic: {
          translation: '', // Will be filled by the translation API
          examples: []
        }
      },
      suggestions: {
        vocabulary: [],
        grammar: [],
        usage: [],
        memory: []
      },
      examples: [],
      difficulty: 3
    }
  }));
}

export async function getContextAwareTranslation(
  word: string,
  context: string,
  position: number,
  settings?: {
    hintLevel: number;
    translationDetail: number;
    sourceLang: string;
    targetLang: string;
  }
): Promise<TranslationEntry> {
  // Extract surrounding context
  const contextWindow = 100; // characters on each side
  const start = Math.max(0, position - contextWindow);
  const end = Math.min(context.length, position + word.length + contextWindow);
  const surroundingContext = context.slice(start, end);
  
  let preferences = { 
    hintLevel: settings?.hintLevel || 3, 
    translationDetail: settings?.translationDetail || 3,
    sourceLang: settings?.sourceLang || 'English',
    targetLang: settings?.targetLang || 'English'
  };

  try {
    console.log('Sending translation request for word:', word);
    // Get translation from API
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: word,
        context: surroundingContext,
        sourceLang: preferences.sourceLang,
        targetLang: preferences.targetLang,
        hintLevel: preferences.hintLevel,
        translationDetail: preferences.translationDetail
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle both direct response and wrapped response formats
    const translationResult = data.translation || data.result || data;
    
    if (!translationResult) {
      throw new Error('No translation result in response');
    }

    return translationResult;
  } catch (error: any) {
    console.error('Translation API error:', error);
    // Return a fallback translation entry with the error message
    return {
      word,
      context: surroundingContext,
      translation: {
        basic: {
          translation: error.message || 'Translation failed. Please try again.',
          examples: []
        }
      },
      suggestions: {
        vocabulary: [],
        grammar: [],
        usage: [],
        memory: []
      },
      examples: [],
      difficulty: 3
    };
  }
}

export async function processText(text: string): Promise<TextAnalysis> {
  try {
    // First analyze the text
    const metrics = analyzeText(text);
    
    // Find words to highlight
    const highlights = findHighlightWords(text);
    
    // Get translations for highlighted words
    const translations = await Promise.all(
      highlights.map(async highlight => {
        const translation = await getContextAwareTranslation(
          highlight.word,
          text,
          highlight.startIndex
        );
        
        return {
          ...highlight,
          translation
        };
      })
    );
    
    return {
      metrics,
      highlights: translations,
      languageConfidence: metrics.languageConfidence,
      sourceText: text,
      processedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error processing text:', error);
    throw error;
  }
} 