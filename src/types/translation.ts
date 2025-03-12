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
  suggestions: {
    vocabulary: string[];    // 词汇联想
    grammar: string[];       // 语法规则
    usage: string[];         // 使用场景
    memory: string[];        // 记忆技巧
  };
  examples: string[];        // 上下文例句
  difficulty: number;        // 难度等级 1-5
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