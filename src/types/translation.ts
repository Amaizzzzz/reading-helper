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
      notes: string[];
    };
    technical?: {
      translation: string;
      examples: string[];
      domain: string;
    };
  };
  suggestions: {
    vocabulary: string[];
    grammar: string[];
    usage: string[];
    memory: string[];
  };
  examples: string[];
  difficulty: number;  // 1-5
}

export interface HighlightWord {
  word: string;
  startIndex: number;
  endIndex: number;
  translation: TranslationEntry;
}

export interface LearningPrompt {
  type: 'vocabulary' | 'grammar' | 'usage' | 'memory';
  content: string;
  examples: string[];
} 