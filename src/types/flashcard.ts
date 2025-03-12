interface FlashcardData {
  word: string;
  translation: TranslationEntry;
  dateAdded: string;
  lastReviewed: string | null;
  nextReview: string | null;
  repetitionStage: number; // 0-5 representing spaced repetition stages
  correctStreak: number;
  incorrectStreak: number;
  examples: string[];
  notes: string;
}

interface StudySession {
  date: string;
  cardsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
  duration: number; // in seconds
}

interface StudyProgress {
  totalCards: number;
  masteredCards: number;
  sessionsCompleted: number;
  lastSession: StudySession | null;
  history: StudySession[];
}

export type { FlashcardData, StudySession, StudyProgress };

console.log('Page rendering...', { settings }); 