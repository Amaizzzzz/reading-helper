'use client';

import React, { useState } from 'react';
import { FlashcardData } from '../types/flashcard';
import Flashcard from './Flashcard';

interface FlashcardDeckProps {
  cards: FlashcardData[];
  onUpdateCard: (card: FlashcardData) => void;
}

export default function FlashcardDeck({ cards, onUpdateCard }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleReview = async (status: 'correct' | 'incorrect' | 'hint') => {
    if (!cards[currentIndex]) return;

    try {
      const response = await fetch('/api/flashcards/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flashcardId: cards[currentIndex].id,
          userId: 'current-user',
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record review');
      }

      const updatedCard = await response.json();
      onUpdateCard(updatedCard);
      
      // Move to next card
      setShowAnswer(false);
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    } catch (error) {
      console.error('Error recording review:', error);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="text-center text-gray-600">
        No flashcards available. Add some words to get started!
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Flashcard
        key={cards[currentIndex].word}
        card={cards[currentIndex]}
        onReview={handleReview}
      />

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % cards.length)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
} 