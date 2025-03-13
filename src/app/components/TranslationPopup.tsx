'use client';

import React, { useState } from 'react';
import { useLearningSettings } from '@/contexts/LearningSettingsContext';

interface TranslationPopupProps {
  text: string;
  position: {
    x: number;
    y: number;
  };
  translation: string;
  isLoading: boolean;
  onClose: () => void;
}

const TranslationPopup: React.FC<TranslationPopupProps> = ({
  text,
  position,
  translation,
  isLoading,
  onClose,
}) => {
  const { preferences } = useLearningSettings();
  const [selectedLevel, setSelectedLevel] = useState<number>(0);

  const levels = [
    { title: 'Context Hints', content: 'Similar words and context clues' },
    { title: 'Basic Translation', content: 'Simple explanation' },
    { title: 'Detailed Translation', content: 'Comprehensive explanation' },
    { title: 'Learning Tips', content: 'Memory aids and usage examples' }
  ];

  const parseTranslation = (translation: string) => {
    const sections: { [key: string]: string } = {};
    
    // Split by double newlines to separate sections
    const parts = translation.split('\n\n').filter(Boolean);

    parts.forEach(part => {
      const lines = part.split('\n');
      const header = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();

      if (header.includes('Context Hints')) {
        sections.context = content;
      } else if (header.includes('Basic Translation')) {
        sections.basic = content;
      } else if (header.includes('Detailed Translation')) {
        sections.detailed = content;
      } else if (header.includes('Learning Tips')) {
        sections.tips = content;
      }
    });

    return sections;
  };

  const getTranslationContent = () => {
    if (isLoading) {
      return <div className="text-gray-500">Loading translation...</div>;
    }

    if (!translation) {
      return <div className="text-gray-500">No translation available</div>;
    }

    const parsedSections = parseTranslation(translation);
    let content = '';

    switch (selectedLevel) {
      case 0: // Context Hints
        content = parsedSections.context || 'No context hints available';
        break;
      case 1: // Basic Translation
        content = parsedSections.basic || 'No basic translation available';
        break;
      case 2: // Detailed Translation
        content = parsedSections.detailed || 'No detailed translation available';
        break;
      case 3: // Learning Tips
        content = parsedSections.tips || 'No learning tips available';
        break;
      default:
        content = translation;
    }

    return (
      <div className="text-gray-700 whitespace-pre-wrap">
        {content}
      </div>
    );
  };

  return (
    <div
      className="fixed bg-white rounded-lg shadow-lg p-4 max-w-sm z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 10}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="font-medium text-lg break-words">{text}</div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 ml-2"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 mb-4">
        {levels.map((level, index) => (
          <div
            key={index}
            className={`p-2 rounded cursor-pointer transition-colors ${
              selectedLevel === index
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedLevel(index)}
          >
            <div className="text-sm font-medium">{level.title}</div>
            <div className="text-xs text-gray-500">{level.content}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4">
        {getTranslationContent()}
      </div>
    </div>
  );
};

export default TranslationPopup; 