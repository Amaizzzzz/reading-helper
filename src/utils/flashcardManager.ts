import { FlashcardData } from '../types/flashcard';
import { TranslationEntry } from '../types/translation';

// Get cards that are due for review
export function getDueCards(cards: FlashcardData[]): FlashcardData[] {
  const now = new Date();
  return cards.filter(card => {
    if (!card.nextReview) return true;
    return new Date(card.nextReview) <= now;
  }).sort((a, b) => {
    if (!a.nextReview) return -1;
    if (!b.nextReview) return 1;
    return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
  });
}

// Create a new flashcard
export function createFlashcard(word: string, translation: TranslationEntry): FlashcardData {
  return {
    word,
    translation,
    dateAdded: new Date().toISOString(),
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    difficulty: 3 // Start with medium difficulty
  };
}

// Update flashcard after review
export function updateFlashcard(card: FlashcardData, remembered: boolean): FlashcardData {
  const now = new Date();
  
  return {
    ...card,
    lastReviewed: now.toISOString(),
    nextReview: calculateNextReview(now, remembered, card.difficulty).toISOString(),
    reviewCount: card.reviewCount + 1,
    difficulty: remembered 
      ? Math.max(1, card.difficulty - 1) 
      : Math.min(5, card.difficulty + 1)
  };
}

// Calculate next review date based on performance
function calculateNextReview(now: Date, remembered: boolean, difficulty: number): Date {
  const result = new Date(now);
  
  if (remembered) {
    // If remembered, increase interval based on difficulty
    switch (difficulty) {
      case 1: // Easy
        result.setDate(result.getDate() + 7); // Review in 7 days
        break;
      case 2:
        result.setDate(result.getDate() + 5); // Review in 5 days
        break;
      case 3:
        result.setDate(result.getDate() + 3); // Review in 3 days
        break;
      case 4:
        result.setDate(result.getDate() + 2); // Review in 2 days
        break;
      case 5: // Hard
        result.setDate(result.getDate() + 1); // Review in 1 day
        break;
    }
  } else {
    // If not remembered, review again soon
    result.setHours(result.getHours() + 4); // Review in 4 hours
  }
  
  return result;
} 