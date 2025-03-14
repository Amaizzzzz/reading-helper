export interface GrammaticalInfo {
  partOfSpeech: string;
  forms?: {
    singular?: string;
    plural?: string;
    pastTense?: string;
    presentTense?: string;
    futureTense?: string;
    comparative?: string;
    superlative?: string;
  };
  usage: {
    pattern: string;
    examples: string[];
  }[];
}

export interface TranslationLevel {
  translation: string;
  examples: string[];
  notes: string[];
}

export interface Collocation {
  pattern: string;
  translation: string;
  examples: string[];
  frequency: 'high' | 'medium' | 'low';
}

export interface ContextualUsage {
  domain: string;  // e.g., "academic", "business", "casual"
  meaning: string;
  examples: string[];
}

export interface TranslationDetail {
  translation: string;
  examples: string[];
  notes?: string[];
  domain?: string;
}

export interface Translation {
  basic: TranslationDetail;
  detailed?: TranslationDetail;
  technical?: TranslationDetail;
}

export interface Suggestions {
  vocabulary: string[];
  grammar: string[];
  usage: string[];
  memory: string[];
}

export interface ContextAnalysis {
  precedingWords: string[];
  followingWords: string[];
  sentencePosition: number;
  isInQuotes: boolean;
  nearbyKeywords: string[];
}

export interface TranslationEntry {
  word: string;
  context: string;
  translation: {
    basic: {
      translation: string;
      examples: string[];
    };
    detailed?: {
      translation: string;
      examples: string[];
      notes?: string[];
    };
    technical?: {
      translation: string;
      examples: string[];
      domain?: string;
    };
  };
  suggestions?: {
    vocabulary: string[];
    grammar: string[];
    usage: string[];
    memory: string[];
  };
  examples: string[];
  difficulty: number;
  contextAnalysis?: ContextAnalysis;
  llmTranslation?: string;
}

export interface HighlightWord {
  word: string;
  startIndex: number;
  endIndex: number;
  translation: TranslationEntry;
}

export interface TextMetrics {
  wordCount: number;
  sentenceCount: number;
  averageWordLength: number;
  uniqueWords: Set<string>;
  languageConfidence: {
    lang: string;
    confidence: number;
  };
}

export interface TextAnalysis {
  metrics: {
    wordCount: number;
    sentenceCount: number;
    averageWordLength: number;
    uniqueWords: Set<string>;
  };
  highlights: HighlightWord[];
  languageConfidence: {
    lang: string;
    confidence: number;
  };
  sourceText: string;
  processedAt: string;
}

export interface LearningPrompt {
  type: 'vocabulary' | 'grammar' | 'usage' | 'memory';
  content: string;
  examples: string[];
} 