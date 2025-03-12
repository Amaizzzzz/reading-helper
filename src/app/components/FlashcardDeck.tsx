'use client';

import React, { useState, useEffect } from 'react';
import { FlashcardData, StudySession, StudyProgress } from '../../types/flashcard';
import { 
  getDueCards, 
  updateFlashcard, 
  createStudySession,
  updateStudyProgress,
  getStudyStats
} from '../../utils/flashcardManager';
import Flashcard from './Flashcard';

interface FlashcardDeckProps {
  savedCards: FlashcardData[];
  onUpdateCard: (card: FlashcardData) => void;
  onSessionComplete: (session: StudySession) => void;
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  savedCards,
  onUpdateCard,
  onSessionComplete
}) => {
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [dueCards, setDueCards] = useState<FlashcardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Initialize study session
  useEffect(() => {
    const due = getDueCards(savedCards);
    setDueCards(due);
    if (due.length > 0 && !currentSession) {
      setCurrentSession(createStudySession());
      setSessionStartTime(new Date());
    }
  }, [savedCards]);

  const handleCardResult = (correct: boolean) => {
    if (!currentSession || currentCardIndex >= dueCards.length) return;

    const card = dueCards[currentCardIndex];
    const updatedCard = updateFlashcard(card, correct);
    onUpdateCard(updatedCard);

    setCurrentSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        cardsStudied: prev.cardsStudied + 1,
        correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
        incorrectAnswers: prev.incorrectAnswers + (correct ? 0 : 1)
      };
    });

    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      finishSession();
    }
  };

  const finishSession = () => {
    if (!currentSession || !sessionStartTime) return;

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - sessionStartTime.getTime()) / 1000);
    
    const completedSession = {
      ...currentSession,
      duration
    };

    onSessionComplete(completedSession);
    setCurrentSession(null);
    setSessionStartTime(null);
    setCurrentCardIndex(0);
    setDueCards([]);
  };

  const handleAddExample = (example: string) => {
    if (currentCardIndex >= dueCards.length) return;

    const card = dueCards[currentCardIndex];
    const updatedCard = {
      ...card,
      examples: [...card.examples, example]
    };
    onUpdateCard(updatedCard);
  };

  const handleUpdateNotes = (notes: string) => {
    if (currentCardIndex >= dueCards.length) return;

    const card = dueCards[currentCardIndex];
    const updatedCard = {
      ...card,
      notes
    };
    onUpdateCard(updatedCard);
  };

  if (!currentSession || dueCards.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          No cards due for review
        </h2>
        <p className="text-gray-600">
          Great job! Come back later when you have cards to review.
        </p>
      </div>
    );
  }

  const currentCard = dueCards[currentCardIndex];
  const progress = (currentCardIndex / dueCards.length) * 100;

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-600 text-center">
          {currentCardIndex + 1} of {dueCards.length} cards
        </div>
      </div>

      {/* Current Card */}
      <Flashcard
        card={currentCard}
        onResult={handleCardResult}
        onAddExample={handleAddExample}
        onUpdateNotes={handleUpdateNotes}
      />

      {/* Session Stats */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <div>Correct: {currentSession.correctAnswers}</div>
        <div>Incorrect: {currentSession.incorrectAnswers}</div>
        <div>
          Accuracy:{' '}
          {Math.round(
            (currentSession.correctAnswers /
              (currentSession.correctAnswers + currentSession.incorrectAnswers)) *
              100 || 0
          )}%
        </div>
      </div>

      {/* Skip Button */}
      <div className="mt-4 text-center">
        <button
          onClick={() => {
            if (currentCardIndex < dueCards.length - 1) {
              setCurrentCardIndex(currentCardIndex + 1);
            }
          }}
          className="text-gray-600 hover:text-gray-800"
        >
          Skip for now →
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck; 