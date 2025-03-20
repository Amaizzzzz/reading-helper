'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Flashcards() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewHistory, setReviewHistory] = useState<Array<{ id: string; status: 'correct' | 'incorrect' | 'hint_used' }>>([]);

  const flashcards = [
    {
      id: '1',
      word: 'unprecedented',
      translation: '前例のない',
      example: 'The pandemic caused unprecedented changes in our daily lives.',
      lastReviewed: '2 days ago'
    },
    {
      id: '2',
      word: 'abuse',
      translation: '虐待',
      example: 'The organization works to prevent child abuse.',
      lastReviewed: '1 week ago'
    },
    {
      id: '3',
      word: 'resilient',
      translation: '回復力のある',
      example: 'The community proved to be resilient after the natural disaster.',
      lastReviewed: '3 days ago'
    }
  ];

  const currentCard = flashcards[currentCardIndex];

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

  const handleReview = (status: 'correct' | 'incorrect' | 'hint_used') => {
    setReviewHistory([...reviewHistory, { id: currentCard.id, status }]);
    handleNext();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[800px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Flashcards</h1>
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Home
          </Link>
        </div>

        {/* Flashcard */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 min-h-[300px] flex flex-col justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">{currentCard.word}</h2>
            {showAnswer ? (
              <div className="space-y-4">
                <p className="text-xl text-gray-700">{currentCard.translation}</p>
                <p className="text-gray-600 italic">{currentCard.example}</p>
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={() => handleReview('correct')}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Correct
                  </button>
                  <button
                    onClick={() => handleReview('incorrect')}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Incorrect
                  </button>
                  <button
                    onClick={() => handleReview('hint_used')}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Used Hint
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAnswer(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Show Answer
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Card {currentCardIndex + 1} of {flashcards.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentCardIndex === flashcards.length - 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Progress */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Review Progress</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <div className="text-green-800 font-medium">
                {reviewHistory.filter(r => r.status === 'correct').length}
              </div>
              <div className="text-sm text-green-600">Correct</div>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <div className="text-red-800 font-medium">
                {reviewHistory.filter(r => r.status === 'incorrect').length}
              </div>
              <div className="text-sm text-red-600">Incorrect</div>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <div className="text-yellow-800 font-medium">
                {reviewHistory.filter(r => r.status === 'hint_used').length}
              </div>
              <div className="text-sm text-yellow-600">Used Hint</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 