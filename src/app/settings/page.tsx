'use client';

import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';

export default function Settings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Learning Settings */}
            <div>
              <h2 className="text-lg font-medium mb-4">Learning Settings</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm text-gray-600">
                    <span>Hint Level</span>
                    <span>{settings.hintLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.hintLevel}
                    onChange={(e) => updateSettings({ ...settings, hintLevel: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm text-gray-600">
                    <span>Translation Detail</span>
                    <span>{settings.translationDetail}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.translationDetail}
                    onChange={(e) => updateSettings({ ...settings, translationDetail: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div>
              <h2 className="text-lg font-medium mb-4">Display Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Dark Mode</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                    <span className="sr-only">Enable dark mode</span>
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Font Size</span>
                  <select className="rounded border-gray-300 text-sm">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
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