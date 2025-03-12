'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TranslationPopup from './TranslationPopup';
import { findHighlightWords, getContextAwareTranslation } from '../../utils/textProcessing';
import { TranslationEntry, HighlightWord } from '../../types/translation';
import { useSettings } from '../../contexts/SettingsContext';

interface Section {
  title: string;
  content: string;
}

interface ReadingSectionProps {
  title: string;
  content: string;
  articleId: string;
}

const ReadingSection: React.FC<ReadingSectionProps> = ({ title, content, articleId }) => {
  const { settings, userPreferences, updateLastPosition } = useSettings();
  const [selectedText, setSelectedText] = useState('');
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState<HighlightWord[]>([]);
  const [currentTranslation, setCurrentTranslation] = useState<TranslationEntry | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<number>(0);

  // Apply settings to highlighted words
  useEffect(() => {
    const words = findHighlightWords(content)
      .filter(word => word.translation.difficulty <= settings.maxDifficulty)
      .slice(0, Math.ceil(content.split(' ').length * settings.highlightDensity));
    setHighlightedWords(words);
  }, [content, settings.maxDifficulty, settings.highlightDensity]);

  // Restore last read position
  useEffect(() => {
    const lastPosition = userPreferences.lastReadPosition;
    if (lastPosition && lastPosition.articleId === articleId && typeof lastPosition.scrollPosition === 'number') {
      window.scrollTo(0, lastPosition.scrollPosition);
    }
  }, [articleId, userPreferences.lastReadPosition]);

  // Save scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (articleId) {
        updateLastPosition(articleId, window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [articleId, updateLastPosition]);

  // Split content into sections on component mount
  useEffect(() => {
    const paragraphs = content.split('\n\n');
    const newSections = paragraphs.map((paragraph, index) => ({
      title: `Section ${index + 1}`,
      content: paragraph.trim()
    }));
    setSections(newSections);
  }, [content]);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const selectedContent = selection.toString();
      
      setSelectedText(selectedContent);
      setPopupPosition({
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY
      });
      
      const translation = getContextAwareTranslation(
        selectedContent,
        content,
        content.indexOf(selectedContent)
      );
      setCurrentTranslation(translation);
      setShowPopup(true);
    }
  }, [content]);

  const renderContent = (sectionContent: string) => {
    if (highlightedWords.length === 0) return sectionContent;

    let lastIndex = 0;
    const elements: JSX.Element[] = [];

    highlightedWords.forEach((highlight, index) => {
      if (highlight.startIndex > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>
            {sectionContent.slice(lastIndex, highlight.startIndex)}
          </span>
        );
      }

      elements.push(
        <span
          key={`highlight-${index}`}
          className="cursor-pointer bg-yellow-100/80 hover:bg-yellow-200/80 transition-colors px-0.5 rounded"
          onClick={(e) => {
            e.preventDefault();
            setSelectedText(highlight.word);
            const rect = e.currentTarget.getBoundingClientRect();
            setPopupPosition({
              x: rect.left + window.scrollX,
              y: rect.bottom + window.scrollY
            });
            setCurrentTranslation(highlight.translation);
            setShowPopup(true);
          }}
        >
          {highlight.word}
        </span>
      );

      lastIndex = highlight.endIndex;
    });

    if (lastIndex < sectionContent.length) {
      elements.push(
        <span key="text-end">
          {sectionContent.slice(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
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
      </div>

      {/* Active Section Content */}
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
          className="px-8 py-6"
          onMouseUp={handleTextSelection}
          style={{ 
            fontSize: `${settings.fontSize}px`,
            lineHeight: '2',
            color: '#374151'
          }}
        >
          {sections[activeSection] && renderContent(sections[activeSection].content)}
        </div>
      </div>

      {showPopup && currentTranslation && (
        <TranslationPopup
          text={selectedText}
          position={popupPosition}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default ReadingSection; 