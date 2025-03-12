'use client';

import React, { useEffect, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface TranslationPopupProps {
  text: string;
  position: Position;
  onClose: () => void;
}

const TranslationPopup: React.FC<TranslationPopupProps> = ({
  text,
  position,
  onClose,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [relatedWords, setRelatedWords] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API call for related words
    setRelatedWords(['similar', 'synonym', 'related', 'word']);
  }, [text]);

  const levels = [
    { title: 'Basic Definition', content: 'Simple explanation...' },
    { title: 'Detailed Explanation', content: 'More detailed explanation...' },
    { title: 'Technical Definition', content: 'Technical field explanation...' }
  ];

  return (
    <div
      className="translation-popup"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 10}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="word">{text}</div>
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      </div>

      <div className="translation-levels space-y-2 mb-4">
        {levels.map((level, index) => (
          <div
            key={index}
            className={`level-item ${selectedLevel === index ? 'active' : ''}`}
            onClick={() => setSelectedLevel(index)}
          >
            <div className="text-sm font-medium">{level.title}</div>
            <div className="text-xs text-gray-500">{level.content}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="text-sm text-gray-500 mb-2">Related Words:</div>
        <div className="flex flex-wrap gap-2">
          {relatedWords.map((word, index) => (
            <div key={index} className="related-word">
              {word}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TranslationPopup; 