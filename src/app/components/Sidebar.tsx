import React, { useState } from 'react';

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

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onDifficultyChange(value);
  };

  const handleHighlightDensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onHighlightDensityChange(value);
  };

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
      <div className="mac-card p-6">
        <h2 className="text-lg font-medium text-blue-500 mb-8">Learning Assistance</h2>
        
        <div className="space-y-8">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>提示级别</span>
              <span className="text-gray-400">低 - 高</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={difficulty}
              onChange={handleDifficultyChange}
              className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>翻译详细度</span>
              <span className="text-gray-400">简洁 - 详细</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={highlightDensity}
              onChange={handleHighlightDensityChange}
              className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Flashcards Panel */}
      <div className="mac-card p-6">
        <h2 className="text-lg font-medium text-blue-500 mb-6">我的错题集</h2>
        <div className="space-y-4">
          {flashcards.map((card, index) => (
            <div
              key={index}
              onClick={() => toggleFlashcard(index)}
              className="group bg-gray-50 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-sm"
            >
              <div className="font-medium text-gray-800">{card.isFlipped ? card.back : card.front}</div>
              <div className="text-sm text-gray-400 mt-1">
                {card.isFlipped ? '点击查看单词' : '点击查看翻译'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Assistant Panel */}
      <div className="mac-card p-6">
        <h2 className="text-lg font-medium text-blue-500 mb-6">AI语言助手</h2>
        <div className="flex flex-col space-y-4">
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
            在这篇文章中，"深刻改变"指的是人工智能将对我们的生活和工作方式产生根本性、全面性的转变，而不仅仅是表面的影响。
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="输入你的问题..."
              className="mac-input flex-1 px-4 py-2 text-sm"
            />
            <button
              onClick={() => {
                // Handle chat message
                setMessage('');
              }}
              className="mac-button text-sm"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 