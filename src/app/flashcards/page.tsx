'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Flashcards() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewHistory, setReviewHistory] = useState({
    correct: 0,
    incorrect: 0,
    hintUsed: 0
  });

  const flashcards = [
    {
      id: 1,
      word: 'Ephemeral',
      translation: 'Lasting for a very short time',
      example: 'Social media fame can be ephemeral.',
      lastReviewed: '2024-03-20'
    },
    {
      id: 2,
      word: 'Serendipity',
      translation: 'Finding something good without looking for it',
      example: 'Meeting you here was pure serendipity!',
      lastReviewed: '2024-03-19'
    },
    {
      id: 3,
      word: 'Eloquent',
      translation: 'Fluent and persuasive in speaking or writing',
      example: 'She gave an eloquent speech at the conference.',
      lastReviewed: '2024-03-18'
    }
  ];

  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleReview = (status: 'correct' | 'incorrect' | 'hint') => {
    setReviewHistory(prev => ({
      ...prev,
      [status]: prev[status] + 1
    }));
    handleNext();
  };

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-[800px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold dark:text-white">Flashcards</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Card {currentCardIndex + 1} of {flashcards.length}</span>
              <span>Last reviewed: {currentCard.lastReviewed}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Flashcard */}
          <div className="relative min-h-[300px] flex items-center justify-center mb-8">
            <div 
              className={`w-full p-8 rounded-lg shadow-lg transition-all duration-300 transform ${
                showAnswer ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-700'
              }`}
            >
              <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">
                {currentCard.word}
              </h2>
              {showAnswer && (
                <div className="mt-4">
                  <p className="text-xl text-gray-700 dark:text-gray-300 text-center mb-4">
                    {currentCard.translation}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-center italic">
                    "{currentCard.example}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
            <button
              onClick={handlePrevious}
              disabled={currentCardIndex === 0}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentCardIndex === flashcards.length - 1}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Review Actions */}
          {showAnswer && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleReview('correct')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Correct
              </button>
              <button
                onClick={() => handleReview('incorrect')}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Incorrect
              </button>
              <button
                onClick={() => handleReview('hint')}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Used Hint
              </button>
            </div>
          )}

          {/* Review Stats */}
          <div className="mt-8 pt-8 border-t dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Review Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {reviewHistory.correct}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Correct</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {reviewHistory.incorrect}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Incorrect</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {reviewHistory.hintUsed}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Hints Used</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 