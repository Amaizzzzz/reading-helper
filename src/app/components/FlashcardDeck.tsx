'use client';

import React, { useState } from 'react';
import { FlashcardData } from '../../types/flashcard';
import Flashcard from './Flashcard';

interface FlashcardDeckProps {
  cards: FlashcardData[];
  onUpdateCard: (card: FlashcardData) => void;
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ cards, onUpdateCard }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleReview = (card: FlashcardData, remembered: boolean) => {
    const updatedCard = {
      ...card,
      reviewCount: card.reviewCount + 1,
      difficulty: remembered ? Math.max(1, card.difficulty - 1) : Math.min(5, card.difficulty + 1),
      lastReviewed: new Date().toISOString(),
      nextReview: calculateNextReview(remembered)
    };
    onUpdateCard(updatedCard);
    
    // Move to next card if available
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const calculateNextReview = (remembered: boolean) => {
    const now = new Date();
    if (remembered) {
      // If remembered, set next review further in the future
      now.setHours(now.getHours() + 24); // Review in 24 hours
    } else {
      // If difficult, review again sooner
      now.setHours(now.getHours() + 4); // Review in 4 hours
    }
    return now.toISOString();
  };

  if (cards.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8">
        No flashcards available. Add some words to your review list!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 text-center">
        Card {currentIndex + 1} of {cards.length}
      </div>
      
      <Flashcard
        key={cards[currentIndex].word}
        card={cards[currentIndex]}
        onReview={handleReview}
      />

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentIndex(Math.min(cards.length - 1, currentIndex + 1))}
          disabled={currentIndex === cards.length - 1}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck; 