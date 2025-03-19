import { TranslationEntry } from './translation';

interface FlashcardData {
  word: string;
  translation: TranslationEntry;
  dateAdded: string;
  lastReviewed: string | null;
  nextReview: string | null;
  reviewCount: number;
  difficulty: number; // 1-5 scale
}

export type { FlashcardData }; 