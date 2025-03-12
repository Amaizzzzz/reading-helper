import { FlashcardData, StudySession, StudyProgress } from '../types/flashcard';
import { TranslationEntry } from '../types/translation';

// Spaced repetition intervals in days
const INTERVALS = [1, 3, 7, 14, 30, 90];

export function createFlashcard(word: string, translation: TranslationEntry): FlashcardData {
  return {
    word,
    translation,
    dateAdded: new Date().toISOString(),
    lastReviewed: null,
    nextReview: new Date().toISOString(), // Review immediately
    repetitionStage: 0,
    correctStreak: 0,
    incorrectStreak: 0,
    examples: [],
    notes: ''
  };
}

export function updateFlashcard(
  card: FlashcardData,
  correct: boolean,
  examples?: string[],
  notes?: string
): FlashcardData {
  const now = new Date();
  let { repetitionStage, correctStreak, incorrectStreak } = card;

  if (correct) {
    correctStreak++;
    incorrectStreak = 0;
    if (repetitionStage < INTERVALS.length - 1) {
      repetitionStage++;
    }
  } else {
    incorrectStreak++;
    correctStreak = 0;
    repetitionStage = Math.max(0, repetitionStage - 1);
  }

  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + INTERVALS[repetitionStage]);

  return {
    ...card,
    lastReviewed: now.toISOString(),
    nextReview: nextReview.toISOString(),
    repetitionStage,
    correctStreak,
    incorrectStreak,
    examples: examples || card.examples,
    notes: notes || card.notes
  };
}

export function getDueCards(cards: FlashcardData[]): FlashcardData[] {
  const now = new Date();
  return cards
    .filter(card => {
      if (!card.nextReview) return true;
      return new Date(card.nextReview) <= now;
    })
    .sort((a, b) => {
      if (!a.nextReview) return -1;
      if (!b.nextReview) return 1;
      return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
    });
}

export function createStudySession(): StudySession {
  return {
    date: new Date().toISOString(),
    cardsStudied: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    duration: 0
  };
}

export function updateStudyProgress(
  progress: StudyProgress,
  session: StudySession
): StudyProgress {
  return {
    ...progress,
    totalCards: progress.totalCards,
    masteredCards: progress.masteredCards,
    sessionsCompleted: progress.sessionsCompleted + 1,
    lastSession: session,
    history: [...progress.history, session]
  };
}

export function calculateMasteryLevel(card: FlashcardData): number {
  const maxStage = INTERVALS.length - 1;
  return (card.repetitionStage / maxStage) * 100;
}

export function getStudyStats(progress: StudyProgress) {
  const totalAnswers = progress.history.reduce(
    (sum, session) => sum + session.correctAnswers + session.incorrectAnswers,
    0
  );
  const totalCorrect = progress.history.reduce(
    (sum, session) => sum + session.correctAnswers,
    0
  );
  
  return {
    accuracy: totalAnswers > 0 ? (totalCorrect / totalAnswers) * 100 : 0,
    totalStudied: totalAnswers,
    averagePerSession: progress.sessionsCompleted > 0 
      ? totalAnswers / progress.sessionsCompleted 
      : 0
  };
} 