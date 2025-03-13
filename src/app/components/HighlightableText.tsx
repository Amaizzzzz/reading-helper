import React, { useState, useRef, useEffect } from 'react';
import { useLearningSettings } from '@/contexts/LearningSettingsContext';
import TranslationPopup from './TranslationPopup';

interface HighlightableTextProps {
  text: string;
  sourceLang?: string;
  targetLang?: string;
}

interface Position {
  x: number;
  y: number;
}

const HighlightableText: React.FC<HighlightableTextProps> = ({
  text,
  sourceLang = 'auto',
  targetLang = 'English'
}) => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [popupPosition, setPopupPosition] = useState<Position | null>(null);
  const [translation, setTranslation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const { preferences } = useLearningSettings();

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (selectedText) {
      setSelectedText(selectedText);
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      
      if (rect) {
        setPopupPosition({
          x: rect.left + (rect.width / 2),
          y: rect.bottom + window.scrollY
        });
        fetchTranslation(selectedText);
      }
    } else {
      setSelectedText('');
      setPopupPosition(null);
    }
  };

  const fetchTranslation = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          hintLevel: preferences.hintLevel,
          translationDetail: preferences.translationDetail
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Translation request failed');
      }

      const data = await response.json();
      setTranslation(data.translation);
    } catch (error: any) {
      console.error('Translation error:', error);
      setTranslation(`Translation failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      element.addEventListener('mouseup', handleTextSelection);
      return () => {
        element.removeEventListener('mouseup', handleTextSelection);
      };
    }
  }, []);

  return (
    <div className="relative">
      <div
        ref={textRef}
        className="prose max-w-none"
        style={{ userSelect: 'text' }}
      >
        {text}
      </div>
      
      {popupPosition && selectedText && (
        <TranslationPopup
          text={selectedText}
          position={popupPosition}
          translation={translation}
          isLoading={isLoading}
          onClose={() => {
            setSelectedText('');
            setPopupPosition(null);
          }}
        />
      )}
    </div>
  );
};

export default HighlightableText; 