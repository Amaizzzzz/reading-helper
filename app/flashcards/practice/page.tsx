'use client';

import React, { useState, useEffect } from 'react';
import { FlashcardData } from '../../types/flashcard';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const MASTERY_THRESHOLD = 3; // Number of correct answers needed to master a card

export default function PracticePage() {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const cardId = searchParams.get('id');

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await fetch('/api/flashcards?userId=test-user-1');
      if (!response.ok) {
        throw new Error('Failed to fetch flashcards');
      }
      const data = await response.json();
      setFlashcards(data);
      
      if (cardId) {
        const index = data.findIndex((card: FlashcardData) => card.id === cardId);
        if (index !== -1) {
          setCurrentCardIndex(index);
        }
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      setError('Failed to load flashcards. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleReview = async (isCorrect: boolean) => {
    if (!flashcards[currentCardIndex]) return;

    try {
      const currentCard = flashcards[currentCardIndex];
      const newCorrectStreak = isCorrect ? (currentCard.correctStreak || 0) + 1 : 0;
      const isMastered = newCorrectStreak >= MASTERY_THRESHOLD;

      const response = await fetch('/api/flashcards/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flashcardId: currentCard.id,
          userId: 'test-user-1',
          status: isCorrect ? 'correct' : 'incorrect',
          correctStreak: newCorrectStreak,
          isMastered,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record review');
      }

      const updatedCard = await response.json();
      setFlashcards(prev => prev.map(card => 
        card.id === updatedCard.id ? updatedCard : card
      ));

      // Auto-advance to next card after review
      if (isCorrect) {
        setTimeout(() => {
          handleNext();
        }, 1000);
      }
    } catch (error) {
      console.error('Error recording review:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">Loading flashcards...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <div className="text-2xl font-bold mb-4">Error</div>
          <div>{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">No flashcards yet</div>
          <div className="text-gray-600">Add some words to your review list to get started!</div>
          <Link
            href="/flashcards"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Flashcards
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];
  const translation = currentCard.directTranslation || 'No translation available';
  const progress = currentCard.correctStreak || 0;
  const isMastered = progress >= MASTERY_THRESHOLD;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Practice Flashcards</h1>
          <Link
            href="/flashcards"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Flashcards
          </Link>
        </div>

        <div className="mb-4 text-gray-600">
          Card {currentCardIndex + 1} of {flashcards.length}
        </div>

        <div 
          className={`bg-white rounded-lg shadow-lg p-8 mb-8 cursor-pointer transition-transform duration-300 ${
            isFlipped ? 'transform rotate-y-180' : ''
          }`}
          onClick={handleFlip}
        >
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">
              {isFlipped ? 'Translation' : 'Word'}
            </div>
            <div className="text-4xl mb-8">
              {isFlipped ? translation : currentCard.word}
            </div>
            {isFlipped && (
              <div className="space-y-4">
                <div className="text-gray-600 text-sm">
                  Last reviewed: {currentCard.lastReviewed ? new Date(currentCard.lastReviewed).toLocaleDateString() : 'Never'}
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="text-sm font-medium text-gray-700">Progress to mastery:</div>
                  <div className="flex space-x-1">
                    {[...Array(MASTERY_THRESHOLD)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full ${
                          i < progress ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {isMastered && (
                  <div className="text-green-500 font-medium">
                    ✓ Mastered
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mb-8">
          <button
            onClick={handlePrevious}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Next
          </button>
        </div>

        {isFlipped && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleReview(false)}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Incorrect
            </button>
            <button
              onClick={() => handleReview(true)}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Correct
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 