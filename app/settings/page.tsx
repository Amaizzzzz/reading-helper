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
      const parsedPreferences = JSON.parse(savedPreferences);
      setPreferences(parsedPreferences);
      // Apply theme immediately
      document.documentElement.classList.toggle('dark', parsedPreferences.theme === 'dark');
      // Apply font size
      document.documentElement.classList.remove('text-small', 'text-medium', 'text-large');
      document.documentElement.classList.add(`text-${parsedPreferences.fontSize}`);
      // Apply line spacing
      document.documentElement.classList.remove('leading-compact', 'leading-normal', 'leading-relaxed');
      document.documentElement.classList.add(`leading-${parsedPreferences.lineSpacing}`);
    }
  }, []);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
    
    // Apply theme immediately if it was updated
    if ('theme' in newPreferences) {
      document.documentElement.classList.toggle('dark', newPreferences.theme === 'dark');
    }

    // Apply font size immediately if it was updated
    if ('fontSize' in newPreferences) {
      document.documentElement.classList.remove('text-small', 'text-medium', 'text-large');
      document.documentElement.classList.add(`text-${newPreferences.fontSize}`);
    }

    // Apply line spacing immediately if it was updated
    if ('lineSpacing' in newPreferences) {
      document.documentElement.classList.remove('leading-compact', 'leading-normal', 'leading-relaxed');
      document.documentElement.classList.add(`leading-${newPreferences.lineSpacing}`);
    }
  };

  const handleSavePreferences = async () => {
    try {
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
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-8 dark:text-white">Settings</h1>

          {/* Display Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Display</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Theme</span>
                <button
                  onClick={() => updatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' })}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-200 dark:bg-gray-700"
                  aria-label="Toggle theme"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Font Size</span>
                <select
                  value={preferences.fontSize}
                  onChange={(e) => updatePreferences({ fontSize: e.target.value as 'small' | 'medium' | 'large' })}
                  className="rounded border-gray-300 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Line Spacing</span>
                <select
                  value={preferences.lineSpacing}
                  onChange={(e) => updatePreferences({ lineSpacing: e.target.value as 'compact' | 'normal' | 'relaxed' })}
                  className="rounded border-gray-300 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="compact">Compact</option>
                  <option value="normal">Normal</option>
                  <option value="relaxed">Relaxed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Language</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Interface Language</span>
                <select
                  value={preferences.language}
                  onChange={(e) => updatePreferences({ language: e.target.value as 'en' | 'zh' })}
                  className="rounded border-gray-300 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>
          </div>

          {/* Learning Assistance Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Learning Assistance</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Hint Level</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{preferences.hintLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={preferences.hintLevel}
                  onChange={(e) => updatePreferences({ hintLevel: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Adjust how direct the hints are when reviewing flashcards
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Translation Detail</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{preferences.translationDetail}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={preferences.translationDetail}
                  onChange={(e) => updatePreferences({ translationDetail: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Control the amount of detail in translations and explanations
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSavePreferences}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Preferences
            </button>
          </div>

          {/* Status Message */}
          {status && (
            <div className={`mt-4 p-3 rounded-lg ${
              status.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}