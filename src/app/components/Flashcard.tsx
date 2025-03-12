'use client';

import React, { useState } from 'react';
import { FlashcardData } from '../../types/flashcard';

interface FlashcardProps {
  card: FlashcardData;
  onReview: (card: FlashcardData, remembered: boolean) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, onReview }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReview = (remembered: boolean) => {
    onReview(card, remembered);
    setIsFlipped(false);
  };

  // Calculate color based on difficulty
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return 'bg-green-50 border-green-200';
      case 2:
        return 'bg-blue-50 border-blue-200';
      case 3:
        return 'bg-yellow-50 border-yellow-200';
      case 4:
        return 'bg-orange-50 border-orange-200';
      case 5:
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const difficultyColor = getDifficultyColor(card.difficulty);

  return (
    <div className="perspective-1000">
      <div
        className={`relative w-full transition-transform duration-500 transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div
          className={`absolute inset-0 backface-hidden ${
            difficultyColor
          } border-2 rounded-xl shadow-lg p-6`}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold">{card.word}</h2>
            <div className="text-sm text-gray-600">
              Reviews: {card.reviewCount} | Difficulty: {card.difficulty}/5
            </div>
          </div>
          <div className="mt-4 text-gray-600">
            <p>Click to see translation</p>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 ${
            difficultyColor
          } border-2 rounded-xl shadow-lg p-6`}
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">Translation</h3>
              <p>{card.translation.translation.basic.translation}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">Examples</h3>
              <ul className="list-disc list-inside space-y-1">
                {card.translation.translation.basic.examples.map((example: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600">{example}</li>
                ))}
              </ul>
            </div>

            <div className="pt-4 flex justify-center space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReview(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Difficult
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReview(true);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Easy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard; 