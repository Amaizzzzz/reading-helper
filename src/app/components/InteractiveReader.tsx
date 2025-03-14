'use client';

import React, { useState, useCallback } from 'react';
import TranslationPopup from './TranslationPopup';
import { getContextAwareTranslation } from '../../utils/textProcessing';
import { TranslationEntry } from '../../types/translation';
import { useSettings } from '../../contexts/SettingsContext';

interface Section {
  title: string;
  content: string;
}

interface InteractiveReaderProps {
  title: string;
  content: string;
  articleId: string;
}

const InteractiveReader: React.FC<InteractiveReaderProps> = ({ title, content, articleId }) => {
  const { settings, userPreferences, updateLastPosition } = useSettings();
  const [selectedText, setSelectedText] = useState('');
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState<TranslationEntry | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [inputContent, setInputContent] = useState('');
  const [isEditing, setIsEditing] = useState(!content);

  // Restore last read position
  React.useEffect(() => {
    const lastPosition = userPreferences.lastReadPosition;
    if (lastPosition && lastPosition.articleId === articleId && typeof lastPosition.scrollPosition === 'number') {
      window.scrollTo(0, lastPosition.scrollPosition);
    }
  }, [articleId, userPreferences.lastReadPosition]);

  // Save scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      if (articleId) {
        updateLastPosition(articleId, window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [articleId, updateLastPosition]);

  // Split content into sections on component mount or when input changes
  React.useEffect(() => {
    const textToProcess = content || inputContent;
    if (!textToProcess) return;
    
    const paragraphs = textToProcess.split('\n\n');
    const newSections = paragraphs.map((paragraph, index) => ({
      title: `Section ${index + 1}`,
      content: paragraph.trim()
    }));
    setSections(newSections);
  }, [content, inputContent]);

  const handleTextSelection = useCallback(async () => {
    const selection = window.getSelection();
    if (!selection || !selection.toString().trim()) return;

    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const selectedContent = selection.toString().trim();
      
      setSelectedText(selectedContent);
      setPopupPosition({
        x: rect.left + (rect.width / 2) + window.scrollX,
        y: rect.bottom + window.scrollY
      });
      
      // Show loading state
      setCurrentTranslation({
        word: selectedContent,
        context: '',
        translation: {
          basic: {
            translation: 'Loading translation...',
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
      });
      setShowPopup(true);
      
      const translation = await getContextAwareTranslation(
        selectedContent,
        content || inputContent || '',
        (content || inputContent || '').indexOf(selectedContent)
      );
      setCurrentTranslation(translation);
    } catch (error) {
      console.error('Error getting translation:', error);
      setCurrentTranslation({
        word: selectedText,
        context: '',
        translation: {
          basic: {
            translation: 'Failed to load translation. Please try again.',
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
      });
    }
  }, [content, inputContent, selectedText]);

  const handleSubmitContent = () => {
    if (inputContent.trim()) {
      setIsEditing(false);
      setActiveSection(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      {isEditing && (
        <div className="mac-card p-6">
          <div className="space-y-4">
            <textarea
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Paste or type your text here..."
              className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSubmitContent}
                disabled={!inputContent.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Process Text
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Navigation */}
      {sections.length > 0 && !isEditing && (
        <div className="mac-card p-4 flex space-x-2 overflow-x-auto">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setActiveSection(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${activeSection === index 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              {section.title}
            </button>
          ))}
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors bg-gray-50 text-gray-600 hover:bg-gray-100"
          >
            Edit Text
          </button>
        </div>
      )}

      {/* Active Section Content */}
      {sections.length > 0 && !isEditing && (
        <div className="mac-card overflow-hidden transition-all duration-300">
          <div className="px-8 py-6 border-b border-gray-100">
            <h1 
              className="text-xl font-medium text-gray-900"
              style={{ fontSize: `${settings.fontSize}px` }}
            >
              {sections[activeSection]?.title || title}
            </h1>
          </div>
          <div 
            className="px-8 py-6 select-text"
            onMouseUp={handleTextSelection}
            style={{ 
              fontSize: `${settings.fontSize}px`,
              lineHeight: '2',
              color: '#374151'
            }}
          >
            {sections[activeSection]?.content}
          </div>
        </div>
      )}

      {showPopup && currentTranslation && (
        <TranslationPopup
          text={selectedText}
          position={popupPosition}
          onClose={() => setShowPopup(false)}
          translation={currentTranslation}
        />
      )}
    </div>
  );
};

export default InteractiveReader; 