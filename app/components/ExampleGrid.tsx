'use client';

import React from 'react';

interface Example {
  sentence: string;
  translation: string;
  tags?: string[];
  difficulty?: number;
}

interface ExampleGridProps {
  examples: Example[];
}

const ExampleGrid: React.FC<ExampleGridProps> = ({ examples }) => {
  const getDifficultyIcon = (difficulty?: number) => {
    if (!difficulty) return '📝';
    if (difficulty <= 3) return '🟢';
    if (difficulty <= 7) return '🟡';
    return '🔴';
  };

  return (
    <div className="example-grid">
      {examples.map((example, index) => (
        <div key={index} className="example-card hover-lift hover-glow group">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <p className="text-gray-800 font-medium leading-relaxed flex-1">
                {example.sentence}
              </p>
              <span className="text-lg ml-3 opacity-60 group-hover:opacity-100 transition-opacity">
                {getDifficultyIcon(example.difficulty)}
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              {example.translation}
            </p>
            {example.tags && (
              <div className="flex flex-wrap gap-2 pt-2">
                {example.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="tag-container"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-end space-x-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="icon-button" title="朗读">
                🔊
              </button>
              <button className="icon-button" title="收藏">
                ⭐️
              </button>
              <button className="icon-button" title="复制">
                📋
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExampleGrid; 