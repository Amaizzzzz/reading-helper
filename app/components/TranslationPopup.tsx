'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TranslationEntry } from '../types/translation';
import { createFlashcard } from '../utils/flashcardManager';

interface Position {
  x: number;
  y: number;
}

interface TranslationPopupProps {
  text: string;
  position: Position;
  onClose: () => void;
  translation: TranslationEntry;
  onAddToFlashcards?: (word: string, translation: TranslationEntry) => Promise<string>;
}

const TranslationPopup: React.FC<TranslationPopupProps> = ({
  text,
  position,
  onClose,
  translation,
  onAddToFlashcards,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addStatus, setAddStatus] = useState<'idle' | 'adding' | 'added' | 'exists' | 'error'>('idle');

  useEffect(() => {
    const popup = popupRef.current;
    if (!popup) return;

    // Ensure popup is within viewport bounds
    const rect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { x, y } = position;

    // Adjust horizontal position if popup would overflow
    if (rect.right > viewportWidth) {
      x = viewportWidth - rect.width - 20;
    }
    if (x < 0) {
      x = 20;
    }

    // Adjust vertical position if popup would overflow
    if (rect.bottom > viewportHeight) {
      y = y - rect.height - 40; // Position above selection
    }
    if (y < 0) {
      y = 20;
    }

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    // Prevent text selection while popup is open
    const handleSelection = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('selectstart', handleSelection);
    return () => {
      document.removeEventListener('selectstart', handleSelection);
    };
  }, [position]);

  const handleAddToFlashcards = async () => {
    console.log('>>> TranslationPopup: handleAddToFlashcards button clicked');
    // Prevent action if already added/exists or currently adding
    if (!onAddToFlashcards || addStatus === 'added' || addStatus === 'exists' || addStatus === 'adding') return;
    
    setAddStatus('adding');
    try {
      const status = await onAddToFlashcards(text, translation);
      // Ensure the returned status matches the defined types
      if (status === 'added' || status === 'exists') {
        setAddStatus(status); 
      } else {
        // Handle unexpected status from the promise?
        console.error('Unexpected status received:', status);
        setAddStatus('error');
      }
    } catch (error) {
      console.error('Error during add to flashcards callback:', error);
      setAddStatus('error');
    }
  };

  // Determine button text and disabled state based on status
  const getButtonState = () => {
    switch (addStatus) {
      case 'adding':
        return { text: 'Adding...', disabled: true };
      case 'added':
        return { text: 'Added', disabled: true };
      case 'exists':
        return { text: 'Already Exists', disabled: true };
      case 'error':
        return { text: 'Error - Retry?', disabled: false }; // Allow retry on error
      case 'idle':
      default:
        return { text: 'Add to Flashcards', disabled: false };
    }
  };

  const buttonState = getButtonState();

  const { basic, detailed, technical } = translation.translation;
  const suggestions = translation.suggestions || {
    vocabulary: [],
    grammar: [],
    usage: [],
    memory: []
  };

  return (
    <div
      ref={popupRef}
      className="fixed z-50 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 min-w-[300px] max-w-[400px] border border-gray-200"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="text-lg font-medium">{text}</div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Basic Translation */}
        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Translation</div>
          <div className="text-base text-gray-900 dark:text-gray-100">{basic.translation}</div>
          {basic.examples.length > 0 && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
              {basic.examples[0]}
            </div>
          )}
        </div>

        {/* Detailed Translation */}
        {detailed && (
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Detailed</div>
            <div className="text-sm text-gray-900 dark:text-gray-100">{detailed.translation}</div>
            {detailed.notes && detailed.notes.length > 0 && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {detailed.notes[0]}
              </div>
            )}
          </div>
        )}

        {/* Technical Translation */}
        {technical && (
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Technical</div>
            <div className="text-sm text-gray-900 dark:text-gray-100">{technical.translation}</div>
            {technical.domain && (
              <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Domain: {technical.domain}
              </div>
            )}
          </div>
        )}

        {/* Related Words */}
        {suggestions.vocabulary.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Related Words:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.vocabulary.map((word, index) => (
                <div 
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300"
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grammar Notes */}
        {suggestions.grammar.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Grammar Notes:</div>
            <ul className="list-disc list-inside text-xs text-gray-700 dark:text-gray-300 space-y-1">
              {suggestions.grammar.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Usage Tips */}
        {suggestions.usage.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Usage Tips:</div>
            <ul className="list-disc list-inside text-xs text-gray-700 dark:text-gray-300 space-y-1">
              {suggestions.usage.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Add to Flashcards Button */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <button
            onClick={handleAddToFlashcards}
            disabled={buttonState.disabled}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {buttonState.text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslationPopup; 