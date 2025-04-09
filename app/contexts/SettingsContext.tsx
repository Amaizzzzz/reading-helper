'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReadingSettings, UserPreferences } from '../types/settings';

const defaultSettings: ReadingSettings = {
  maxDifficulty: 3,
  highlightDensity: 0.5,
  preferredLevels: ['basic', 'intermediate'],
  autoShowContext: false,
  fontSize: 16,
  theme: 'light',
  hintLevel: 50,
  translationDetail: 50
};

const defaultUserPreferences: UserPreferences = {
  ...defaultSettings,
  savedWords: [],
  recentSearches: [],
  lastReadPosition: undefined
};

interface SettingsContextType {
  settings: ReadingSettings;
  userPreferences: UserPreferences;
  updateSettings: (newSettings: Partial<ReadingSettings>) => void;
  saveWord: (word: string) => void;
  removeWord: (word: string) => void;
  addRecentSearch: (search: string) => void;
  updateLastPosition: (articleId: string, position: number) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ReadingSettings>(defaultSettings);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultUserPreferences);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('readingSettings');
      const savedPreferences = localStorage.getItem('userPreferences');
      
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      if (savedPreferences) {
        setUserPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('readingSettings', JSON.stringify(settings));
      localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings, userPreferences]);

  const updateSettings = (newSettings: Partial<ReadingSettings>) => {
    console.log('>>> SettingsContext: updateSettings called with:', newSettings); // DEBUG LOG
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      console.log('>>> SettingsContext: Settings state updated to:', updated); // DEBUG LOG
      return updated;
    });
  };

  const saveWord = (word: string) => {
    setUserPreferences(prev => ({
      ...prev,
      savedWords: prev.savedWords.includes(word) 
        ? prev.savedWords 
        : [...prev.savedWords, word]
    }));
  };

  const removeWord = (word: string) => {
    setUserPreferences(prev => ({
      ...prev,
      savedWords: prev.savedWords.filter(w => w !== word)
    }));
  };

  const addRecentSearch = (search: string) => {
    setUserPreferences(prev => ({
      ...prev,
      recentSearches: [
        search,
        ...prev.recentSearches.filter(s => s !== search).slice(0, 9)
      ]
    }));
  };

  const updateLastPosition = (articleId: string, position: number) => {
    setUserPreferences(prev => ({
      ...prev,
      lastReadPosition: { articleId, scrollPosition: position }
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        userPreferences,
        updateSettings,
        saveWord,
        removeWord,
        addRecentSearch,
        updateLastPosition
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}; 