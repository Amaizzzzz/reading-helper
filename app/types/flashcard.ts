import { TranslationEntry } from './translation';

export interface FlashcardData {
  id: string;
  word: string;
  directTranslation: string;  // Direct translation stored in DB
  translation?: {
    translation?: {
      basic?: {
        translation?: string;
        examples?: string[];
      };
    };
  };
  difficulty: number;
  reviewCount: number;
  correctStreak: number;  // Number of consecutive correct answers
  lastReviewed: string | null;
  nextReview: string | null;
  dateAdded: string;
  status: 'active' | 'mastered' | 'archived';  // Card status
  masteryLevel: number;  // 0-100, represents how well the word is known
} 