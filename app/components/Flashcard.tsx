'use client';

import React from 'react';
import { FlashcardData } from '../types/flashcard';

interface FlashcardProps {
  card: FlashcardData;
  onReview: (status: 'correct' | 'incorrect' | 'hint') => void;
}

export default function Flashcard({ card, onReview }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Calculate color based on mastery level
  const getMasteryColor = (masteryLevel: number) => {
    if (masteryLevel >= 90) return 'bg-green-50 border-green-200';
    if (masteryLevel >= 70) return 'bg-blue-50 border-blue-200';
    if (masteryLevel >= 50) return 'bg-yellow-50 border-yellow-200';
    if (masteryLevel >= 30) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const masteryColor = getMasteryColor(card.masteryLevel || 0);
  const translation = card.directTranslation || 'No translation available';

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className={`${masteryColor} rounded-lg shadow-lg p-6 cursor-pointer transition-transform duration-300 ${
          isFlipped ? 'transform rotate-y-180' : ''
        }`}
        onClick={handleFlip}
      >
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">
            {isFlipped ? 'Translation' : 'Word'}
          </div>
          <div className="text-4xl mb-8">
            {isFlipped ? translation : card.word}
          </div>
          {isFlipped && (
            <div className="space-y-2 text-sm text-gray-600">
              <div>Last reviewed: {formatDate(card.lastReviewed)}</div>
              <div>Next review: {formatDate(card.nextReview)}</div>
              <div>Review count: {card.reviewCount}</div>
              <div>Correct streak: {card.correctStreak}</div>
              <div className="flex items-center justify-center">
                <span>Mastery: </span>
                <div className="w-32 h-2 bg-gray-200 rounded-full ml-2">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${card.masteryLevel || 0}%` }}
                  />
                </div>
                <span className="ml-2">{card.masteryLevel || 0}%</span>
              </div>
              <div>Status: {card.status}</div>
            </div>
          )}
        </div>
      </div>

      {isFlipped && (
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={() => onReview('incorrect')}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Incorrect
          </button>
          <button
            onClick={() => onReview('hint')}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Hint Used
          </button>
          <button
            onClick={() => onReview('correct')}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Correct
          </button>
        </div>
      )}
    </div>
  );
} 