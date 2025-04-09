import { FlashcardData } from '../types/flashcard';
import { TranslationEntry } from '../types/translation';

// Get cards that are due for review
export const getDueCards = async (userId: string): Promise<FlashcardData[]> => {
  try {
    const response = await fetch(`/api/flashcards?userId=${userId}&due=true`);
    if (!response.ok) {
      throw new Error('Failed to fetch due cards');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching due cards:', error);
    return [];
  }
};

// Create a new flashcard
export const createFlashcard = async (
  userId: string,
  word: string,
  translation: string,
  directTranslation: string
): Promise<FlashcardData | null> => {
  try {
    const response = await fetch('/api/flashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        word,
        translation: {
          translation: {
            basic: {
              translation,
              examples: []
            }
          }
        },
        directTranslation,
        difficulty: 1,
        reviewCount: 0,
        correctStreak: 0,
        lastReviewed: null,
        nextReview: new Date().toISOString(),
        dateAdded: new Date().toISOString(),
        status: 'active' as const,
        masteryLevel: 0
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create flashcard');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating flashcard:', error);
    return null;
  }
};

// Update flashcard after review
export const updateFlashcard = async (
  cardId: string,
  remembered: boolean,
  usedHint: boolean = false
): Promise<FlashcardData | null> => {
  try {
    const response = await fetch(`/api/flashcards/${cardId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        remembered,
        usedHint,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update flashcard');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating flashcard:', error);
    return null;
  }
};

// Calculate next review date based on performance
export const calculateNextReview = (
  currentDate: Date,
  difficulty: number,
  remembered: boolean,
  usedHint: boolean = false
): Date => {
  const baseInterval = 1; // days
  const difficultyMultiplier = Math.pow(2, difficulty - 1);
  const hintPenalty = usedHint ? 0.5 : 1;
  const successBonus = remembered ? 2 : 0.5;

  const daysUntilNextReview = baseInterval * difficultyMultiplier * hintPenalty * successBonus;
  const nextReview = new Date(currentDate);
  nextReview.setDate(currentDate.getDate() + Math.max(1, Math.floor(daysUntilNextReview)));
  return nextReview;
}; 