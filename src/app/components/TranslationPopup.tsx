'use client';

import React from 'react';
import { TranslationEntry } from '@/types/translation';

interface Position {
  x: number;
  y: number;
}

interface TranslationPopupProps {
  text: string;
  position: Position;
  onClose: () => void;
  translation: TranslationEntry;
}

const TranslationPopup: React.FC<TranslationPopupProps> = ({
  text,
  position,
  onClose,
  translation,
}) => {
  const { basic, detailed, technical } = translation.translation;
  const suggestions = translation.suggestions || {
    vocabulary: [],
    grammar: [],
    usage: [],
    memory: []
  };

  return (
    <div
      className="translation-popup bg-white shadow-lg rounded-xl p-4 fixed z-50 min-w-[300px] max-w-[400px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 10}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="word text-lg font-medium">{text}</div>
        <button 
          onClick={onClose}
          className="close-btn text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Basic Translation */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">Translation</div>
          <div className="text-sm text-gray-600">{basic.translation}</div>
          {basic.examples.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              {basic.examples[0]}
            </div>
          )}
        </div>

        {/* Detailed Translation */}
        {detailed && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Detailed</div>
            <div className="text-sm text-gray-600">{detailed.translation}</div>
            {detailed.notes && detailed.notes.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                {detailed.notes[0]}
              </div>
            )}
          </div>
        )}

        {/* Technical Translation */}
        {technical && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Technical</div>
            <div className="text-sm text-gray-600">{technical.translation}</div>
            {technical.domain && (
              <div className="mt-1 text-xs text-gray-500">
                Domain: {technical.domain}
              </div>
            )}
          </div>
        )}

        {/* Related Words */}
        {suggestions.vocabulary.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm text-gray-500 mb-2">Related Words:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.vocabulary.map((word, index) => (
                <div 
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-50 rounded-full text-gray-600"
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grammar Notes */}
        {suggestions.grammar.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm text-gray-500 mb-2">Grammar Notes:</div>
            <ul className="list-disc list-inside text-xs text-gray-600">
              {suggestions.grammar.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Usage Tips */}
        {suggestions.usage.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm text-gray-500 mb-2">Usage Tips:</div>
            <ul className="list-disc list-inside text-xs text-gray-600">
              {suggestions.usage.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationPopup; 