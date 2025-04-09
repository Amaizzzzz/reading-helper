'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import TranslationPopup from './TranslationPopup';
import { getContextAwareTranslation } from '../utils/textProcessing';
import { TranslationEntry } from '../types/translation';
import { useSettings } from '../contexts/SettingsContext';
import { createFlashcard } from '../utils/flashcardManager';
import { FlashcardData } from '../types/flashcard';

interface TranslationPopupState {
  text: string;
  position: { x: number; y: number };
  translation: TranslationEntry;
}

interface InteractiveReaderProps {
  title: string;
  content: string;
  articleId?: string;
}

export default function InteractiveReader({ title, content: initialContent, articleId }: InteractiveReaderProps) {
  const { settings } = useSettings();
  const [selectedText, setSelectedText] = useState('');
  const [translationPopup, setTranslationPopup] = useState<TranslationPopupState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTranslation, setIsFetchingTranslation] = useState(false);
  const [inputText, setInputText] = useState('');
  const [content, setContent] = useState(initialContent);
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const processingTextRef = useRef<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAddToFlashcards = async (word: string, translation: TranslationEntry): Promise<'added' | 'exists' | 'error'> => {
    console.log('>>> InteractiveReader: handleAddToFlashcards called with:', word);
    try {
      const response = await fetch(`/api/flashcards/check?word=${encodeURIComponent(word)}&userId=test-user-1`);
      const { exists } = await response.json();

      if (exists) {
        console.log('>>> Word already exists:', word);
        return 'exists'; // Return status
      }

      const addResponse = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word,
          translations: [{
            text: translation.translation.basic.translation,
            language: 'en'
          }],
          userId: 'test-user-1'
        }),
      });

      if (!addResponse.ok) {
        throw new Error(`Failed to add flashcard: ${addResponse.statusText}`);
      }

      const newFlashcard = await addResponse.json();
      console.log('>>> Word added successfully:', newFlashcard);
      // Optionally update local state if needed
      // setFlashcards(prev => [...prev, newFlashcard]);
      return 'added'; // Return status

    } catch (error) {
      console.error('Error adding flashcard:', error);
      // We will let the catch block in TranslationPopup handle the UI
      throw error; // Re-throw error
    }
  };

  const handleTextSelection = useCallback(async () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    console.log(`>>> InteractiveReader: handleTextSelection (debounced) triggered for: ${text || '(no text)'}`);

    if (processingTextRef.current === text && translationPopup) {
       console.warn(`>>> InteractiveReader: EXIT (Debounced - Ref check) - Popup already shown for this text: '${text}'`);
       return;
    }
    if (isFetchingTranslation) {
        console.warn(`>>> InteractiveReader: EXIT (Debounced - Flag check) - Still fetching previous translation`);
        return;
    }

    if (!text) {
      processingTextRef.current = null;
      setTranslationPopup(null);
      console.log('>>> InteractiveReader: No text selected, clearing ref and popup.')
      return;
    }

    if (isLoading) {
       console.warn(`>>> InteractiveReader: EXIT (Debounced - isLoading check)`);
       return;
    }

    const range = selection?.getRangeAt(0);
    const rect = range?.getBoundingClientRect();
    if (!rect) return;

    console.log(`>>> InteractiveReader: Proceeding to fetch for: '${text}'`);
    processingTextRef.current = text;
    setIsFetchingTranslation(true);
    setIsLoading(true);

    const viewportX = rect.left + (rect.width / 2);
    const viewportY = rect.top - 10;
    const x = viewportX + window.scrollX;
    const y = viewportY + window.scrollY;

    try {
      const position = content.indexOf(text);
      const translationOptions = {
          hintLevel: Math.ceil(settings.hintLevel / 20),
          translationDetail: Math.ceil(settings.translationDetail / 20),
          sourceLang: 'English',
          targetLang: 'English'
      };
      console.log('>>> InteractiveReader: Using translation options:', translationOptions);
      const translationResult = await getContextAwareTranslation(
        text,
        content,
        position,
        translationOptions
      );
      
      if (!translationResult) {
        throw new Error('No translation result received');
      }
      
      console.log('>>> InteractiveReader: setTranslationPopup called for:', text);
      setTranslationPopup({
        text,
        translation: translationResult,
        position: { x, y }
      });
    } catch (error: any) {
      console.error('Translation error:', error);
      let errorMessage = 'Translation failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('API key')) {
          errorMessage = 'API configuration error. Please check your settings.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection.';
        }
      }
      
      console.log('>>> InteractiveReader: setTranslationPopup (error) called for:', text);
      setTranslationPopup({
        text,
        translation: {
          word: text,
          context: '',
          translation: {
            basic: {
              translation: errorMessage,
              examples: []
            }
          },
          suggestions: {
            vocabulary: [],
            grammar: [],
            usage: [],
            memory: []
          },
          examples: [],
          difficulty: 3
        },
        position: { x, y }
      });
      processingTextRef.current = null;
    } finally {
      setIsLoading(false);
      setIsFetchingTranslation(false);
    }
  }, [content, settings, isLoading, isFetchingTranslation, translationPopup]);

  const handleStartReading = () => {
    if (inputText.trim()) {
      setContent(inputText.trim());
      setTranslationPopup(null); // Clear any existing popup
    }
  };

  const handleClosePopup = () => {
    console.log('>>> InteractiveReader: Closing popup, clearing processing ref.'); // DEBUG LOG
    processingTextRef.current = null;
    setTranslationPopup(null);
  };

  useEffect(() => {
    const debouncedHandler = () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        handleTextSelection();
      }, 250);
    };

    document.addEventListener('mouseup', debouncedHandler);
    return () => {
      document.removeEventListener('mouseup', debouncedHandler);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [handleTextSelection]);

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="prose prose-lg dark:prose-invert">
        {content ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <button
                className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                onClick={() => {
                  setContent('');
                  setInputText('');
                  setTranslationPopup(null);
                }}
              >
                New Text
              </button>
            </div>
            <p className="select-text">{content}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter or paste your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleStartReading}
              disabled={!inputText.trim()}
            >
              Start Reading
            </button>
          </div>
        )}
      </div>
      
      {translationPopup && (
        <TranslationPopup
          text={translationPopup.text}
          position={translationPopup.position}
          translation={translationPopup.translation}
          onClose={handleClosePopup}
          onAddToFlashcards={handleAddToFlashcards}
        />
      )}
    </div>
  );
} 