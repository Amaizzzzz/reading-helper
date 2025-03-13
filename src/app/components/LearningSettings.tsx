'use client';

import React from 'react';
import { useLearningSettings } from '@/contexts/LearningSettingsContext';

export default function LearningSettings() {
  const { preferences, updatePreferences, isLoading } = useLearningSettings();

  const handleChange = async (key: 'hintLevel' | 'translationDetail', value: number) => {
    try {
      await updatePreferences({ [key]: value });
    } catch (error) {
      console.error('Failed to update preferences:', error);
      // You could add a toast notification here
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 animate-pulse" data-testid="loading-skeleton">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mac-card p-6">
      <h2 className="text-lg font-medium text-blue-500 mb-8">Learning Assistance</h2>
      
      <div className="space-y-8">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Hint Level</span>
            <span className="text-gray-400">Low - High</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={preferences.hintLevel}
            onChange={(e) => handleChange('hintLevel', parseInt(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
            aria-label="Hint Level"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Translation Detail</span>
            <span className="text-gray-400">Brief - Detailed</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={preferences.translationDetail}
            onChange={(e) => handleChange('translationDetail', parseInt(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
            aria-label="Translation Detail"
          />
        </div>
      </div>
    </div>
  );
} 