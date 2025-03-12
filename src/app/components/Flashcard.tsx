'use client';

import React, { useState } from 'react';
import { FlashcardData } from '../../types/flashcard';
import { calculateMasteryLevel } from '../../utils/flashcardManager';

interface FlashcardProps {
  card: FlashcardData;
  onResult: (correct: boolean) => void;
  onAddExample: (example: string) => void;
  onUpdateNotes: (notes: string) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
  card,
  onResult,
  onAddExample,
  onUpdateNotes
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [newExample, setNewExample] = useState('');
  const [newNote, setNewNote] = useState('');

  const masteryLevel = calculateMasteryLevel(card);
  const masteryColor = masteryLevel >= 80 
    ? 'bg-green-100' 
    : masteryLevel >= 50 
    ? 'bg-yellow-100' 
    : 'bg-red-100';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div 
        className={`relative h-64 w-full cursor-pointer perspective-1000 ${
          isFlipped ? 'rotate-y-180' : ''
        } transition-transform duration-500`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <div 
          className={`absolute w-full h-full backface-hidden ${
            isFlipped ? 'hidden' : 'block'
          } ${masteryColor} rounded-xl shadow-lg p-6`}
        >
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{card.word}</h2>
            <div className="text-sm text-gray-600">
              Stage: {card.repetitionStage + 1}/6
            </div>
          </div>
          <div className="mt-4 text-gray-600">
            Click to reveal translation
          </div>
        </div>

        {/* Back of card */}
        <div 
          className={`absolute w-full h-full backface-hidden ${
            isFlipped ? 'block' : 'hidden'
          } bg-white rounded-xl shadow-lg p-6`}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700">Translation</h3>
              <p className="text-xl">{card.translation.translation.basic.translation}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResult(true);
                  setIsFlipped(false);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                I knew it
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResult(false);
                  setIsFlipped(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Still learning
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Examples Section */}
      <div className="mt-6">
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="text-blue-600 hover:text-blue-700"
        >
          {showExamples ? 'Hide Examples' : 'Show Examples'}
        </button>
        
        {showExamples && (
          <div className="mt-4 space-y-4">
            {card.examples.map((example, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                {example}
              </div>
            ))}
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                placeholder="Add a new example"
                className="flex-1 px-3 py-2 border rounded"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (newExample.trim()) {
                    onAddExample(newExample);
                    setNewExample('');
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="mt-4">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="text-blue-600 hover:text-blue-700"
        >
          {showNotes ? 'Hide Notes' : 'Show Notes'}
        </button>
        
        {showNotes && (
          <div className="mt-4">
            <textarea
              value={card.notes || newNote}
              onChange={(e) => {
                setNewNote(e.target.value);
                onUpdateNotes(e.target.value);
              }}
              placeholder="Add your notes here..."
              className="w-full px-3 py-2 border rounded"
              rows={4}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>

      {/* Progress Indicators */}
      <div className="mt-6 flex justify-between text-sm text-gray-600">
        <div>Streak: {card.correctStreak}</div>
        <div>Mastery: {Math.round(masteryLevel)}%</div>
        <div>
          Next review:{' '}
          {card.nextReview
            ? new Date(card.nextReview).toLocaleDateString()
            : 'Now'}
        </div>
      </div>
    </div>
  );
};

export default Flashcard; 