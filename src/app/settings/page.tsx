'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Settings() {
  const [settings, setSettings] = useState({
    hintLevel: 50,
    translationDetail: 75,
    darkMode: false,
    fontSize: 'medium',
    lineSpacing: 'normal'
  });

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      // Apply dark mode immediately
      document.documentElement.classList.toggle('dark', parsedSettings.darkMode);
      // Apply font size
      document.documentElement.classList.remove('text-small', 'text-medium', 'text-large');
      document.documentElement.classList.add(`text-${parsedSettings.fontSize}`);
      // Apply line spacing
      document.documentElement.classList.remove('leading-compact', 'leading-normal', 'leading-relaxed');
      document.documentElement.classList.add(`leading-${parsedSettings.lineSpacing}`);
    }
  }, []);

  const updateSettings = (newSettings: any) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('settings', JSON.stringify(updatedSettings));
    
    // Apply dark mode immediately
    if ('darkMode' in newSettings) {
      document.documentElement.classList.toggle('dark', newSettings.darkMode);
    }

    // Apply font size
    if ('fontSize' in newSettings) {
      document.documentElement.classList.remove('text-small', 'text-medium', 'text-large');
      document.documentElement.classList.add(`text-${newSettings.fontSize}`);
    }

    // Apply line spacing
    if ('lineSpacing' in newSettings) {
      document.documentElement.classList.remove('leading-compact', 'leading-normal', 'leading-relaxed');
      document.documentElement.classList.add(`leading-${newSettings.lineSpacing}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Learning Settings */}
            <div>
              <h2 className="text-lg font-medium mb-4 dark:text-white">Learning Settings</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm text-gray-600 dark:text-gray-300">
                    <span>Hint Level</span>
                    <span>{settings.hintLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.hintLevel}
                    onChange={(e) => updateSettings({ hintLevel: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm text-gray-600 dark:text-gray-300">
                    <span>Translation Detail</span>
                    <span>{settings.translationDetail}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.translationDetail}
                    onChange={(e) => updateSettings({ translationDetail: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div>
              <h2 className="text-lg font-medium mb-4 dark:text-white">Display Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Dark Mode</span>
                  <button
                    onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className="sr-only">Enable dark mode</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Font Size</span>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => updateSettings({ fontSize: e.target.value })}
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
                    value={settings.lineSpacing}
                    onChange={(e) => updateSettings({ lineSpacing: e.target.value })}
                    className="rounded border-gray-300 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="compact">Compact</option>
                    <option value="normal">Normal</option>
                    <option value="relaxed">Relaxed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}