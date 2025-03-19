import React, { useState } from 'react';
import LearningSettings from './LearningSettings';

interface SidebarProps {
  difficulty: number;
  highlightDensity: number;
  onDifficultyChange: (value: number) => void;
  onHighlightDensityChange: (value: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  difficulty,
  highlightDensity,
  onDifficultyChange,
  onHighlightDensityChange,
}) => {
  const [message, setMessage] = useState('');
  const [flashcards, setFlashcards] = useState([
    { front: 'Example Word', back: 'Example Translation', isFlipped: false },
  ]);

  const toggleFlashcard = (index: number) => {
    setFlashcards(cards =>
      cards.map((card, i) =>
        i === index ? { ...card, isFlipped: !card.isFlipped } : card
      )
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Learning Adjustment Panel */}
      <LearningSettings />

      {/* Flashcards Panel */}
      <div className="mac-card p-6">
        <h2 className="text-lg font-medium text-blue-500 mb-6">My Review List</h2>
        <div className="space-y-4">
          {flashcards.map((card, index) => (
            <div
              key={index}
              onClick={() => toggleFlashcard(index)}
              className="group bg-gray-50 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-sm"
            >
              <div className="font-medium text-gray-800">{card.isFlipped ? card.back : card.front}</div>
              <div className="text-sm text-gray-400 mt-1">
                {card.isFlipped ? 'Click to see word' : 'Click to see translation'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Assistant Panel */}
      <div className="mac-card p-6">
        <h2 className="text-lg font-medium text-blue-500 mb-6">AI Language Assistant</h2>
        <div className="flex flex-col space-y-4">
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
            How can I help you understand the text better?
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your question..."
              className="mac-input flex-1 px-4 py-2 text-sm"
            />
            <button
              onClick={() => {
                // Handle chat message
                setMessage('');
              }}
              className="mac-button text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 