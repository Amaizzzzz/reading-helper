'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'en' | 'zh';
  fontSize: 'small' | 'medium' | 'large';
  lineSpacing: 'compact' | 'normal' | 'relaxed';
  hintLevel: number;
  translationDetail: number;
}

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    language: 'en',
    fontSize: 'medium',
    lineSpacing: 'normal',
    hintLevel: 50,
    translationDetail: 50
  });
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
  }, [preferences.theme]);

  useEffect(() => {
    // Apply font size
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    document.documentElement.classList.add(`text-${preferences.fontSize}`);
  }, [preferences.fontSize]);

  useEffect(() => {
    // Apply line spacing
    document.documentElement.classList.remove('leading-tight', 'leading-normal', 'leading-relaxed');
    document.documentElement.classList.add(`leading-${preferences.lineSpacing}`);
  }, [preferences.lineSpacing]);

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setPreferences(prev => ({ ...prev, theme }));
  };

  const handleLanguageChange = (language: 'en' | 'zh') => {
    setPreferences(prev => ({ ...prev, language }));
  };

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    setPreferences(prev => ({ ...prev, fontSize: size }));
  };

  const handleLineSpacingChange = (spacing: 'compact' | 'normal' | 'relaxed') => {
    setPreferences(prev => ({ ...prev, lineSpacing: spacing }));
  };

  const handleHintLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPreferences(prev => ({ ...prev, hintLevel: value }));
  };

  const handleTranslationDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPreferences(prev => ({ ...prev, translationDetail: value }));
  };

  const handleSavePreferences = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));

      // Save to backend
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      setStatus('Preferences saved successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setStatus('Failed to save preferences');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-[800px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link 
            href="/reading-list"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Reading List
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-8 dark:text-white">Settings</h1>

          {/* Theme Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Theme</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`px-4 py-2 rounded-lg ${
                  preferences.theme === 'light'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`px-4 py-2 rounded-lg ${
                  preferences.theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Language Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Language</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-4 py-2 rounded-lg ${
                  preferences.language === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('zh')}
                className={`px-4 py-2 rounded-lg ${
                  preferences.language === 'zh'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                Chinese
              </button>
            </div>
          </div>

          {/* Font Size Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Font Size</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => handleFontSizeChange('small')}
                className={`px-4 py-2 rounded-lg ${
                  preferences.fontSize === 'small'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                Small
              </button>
              <button
                onClick={() => handleFontSizeChange('medium')}
                className={`px-4 py-2 rounded-lg ${
                  preferences.fontSize === 'medium'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => handleFontSizeChange('large')}
                className={`px-4 py-2 rounded-lg ${
                  preferences.fontSize === 'large'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                Large
              </button>
            </div>
          </div>

          {/* Line Spacing Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Line Spacing</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => handleLineSpacingChange('compact')}
                className={`px-4 py-2 rounded-lg ${
                  preferences.lineSpacing === 'compact'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                Compact
              </button>
              <button
                onClick={() => handleLineSpacingChange('normal')}
                className={`px-4 py-2 rounded-lg ${
                  preferences.lineSpacing === 'normal'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => handleLineSpacingChange('relaxed')}
                className={`px-4 py-2 rounded-lg ${
                  preferences.lineSpacing === 'relaxed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                Relaxed
              </button>
            </div>
          </div>

          {/* Hint Level Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Hint Level</h2>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                value={preferences.hintLevel}
                onChange={handleHintLevelChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300 w-12 text-right">
                {preferences.hintLevel}%
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Adjust how detailed the hints are when translating text
            </p>
          </div>

          {/* Translation Detail Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Translation Detail</h2>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                value={preferences.translationDetail}
                onChange={handleTranslationDetailChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300 w-12 text-right">
                {preferences.translationDetail}%
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Adjust how detailed the translations are
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSavePreferences}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Preferences
            </button>
          </div>

          {/* Status Message */}
          {status && (
            <div className={`mt-4 p-4 rounded-lg ${
              status.includes('Failed') 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
            }`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}