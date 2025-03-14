'use client';

import React from 'react';
import { useLearningSettings } from '@/contexts/LearningSettingsContext';

const HINT_LEVELS = [
  { value: 1, label: 'Indirect Hints' },
  { value: 2, label: 'Context Clues' },
  { value: 3, label: 'Basic Translation' },
  { value: 4, label: 'Clear Translation' },
  { value: 5, label: 'Comprehensive' }
];

const DETAIL_LEVELS = [
  { value: 1, label: 'Basic' },
  { value: 2, label: 'With Examples' },
  { value: 3, label: 'With Vocabulary' },
  { value: 4, label: 'With Grammar' },
  { value: 5, label: 'Full Analysis' }
];

export default function LearningSettings() {
  const { preferences, updatePreferences, isLoading } = useLearningSettings();

  const handleChange = async (key: 'hintLevel' | 'translationDetail', value: number) => {
    try {
      const roundedValue = Math.round(value);
      await updatePreferences({ [key]: roundedValue });
    } catch (error) {
      console.error('Failed to update preferences:', error);
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
            <span className="text-blue-500 font-medium">
              {HINT_LEVELS.find(l => l.value === preferences.hintLevel)?.label}
            </span>
          </div>
          <div className="relative pt-5 pb-5">
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={preferences.hintLevel}
              onChange={(e) => handleChange('hintLevel', parseInt(e.target.value))}
              className="slider-input"
              aria-label="Hint Level"
            />
            <div className="slider-track"></div>
            <div className="slider-spots">
              {HINT_LEVELS.map((level) => (
                <div key={level.value} className="slider-spot-container" style={{ left: `${(level.value - 1) * 25}%` }}>
                  <div className={`slider-spot ${level.value === preferences.hintLevel ? 'active' : ''}`} />
                  <div className="slider-label">{level.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Translation Detail</span>
            <span className="text-blue-500 font-medium">
              {DETAIL_LEVELS.find(l => l.value === preferences.translationDetail)?.label}
            </span>
          </div>
          <div className="relative pt-5 pb-5">
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={preferences.translationDetail}
              onChange={(e) => handleChange('translationDetail', parseInt(e.target.value))}
              className="slider-input"
              aria-label="Translation Detail"
            />
            <div className="slider-track"></div>
            <div className="slider-spots">
              {DETAIL_LEVELS.map((level) => (
                <div key={level.value} className="slider-spot-container" style={{ left: `${(level.value - 1) * 25}%` }}>
                  <div className={`slider-spot ${level.value === preferences.translationDetail ? 'active' : ''}`} />
                  <div className="slider-label">{level.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider-input {
          -webkit-appearance: none;
          width: 100%;
          height: 2px;
          background: transparent;
          position: relative;
          z-index: 2;
          margin: 10px 0;
        }

        .slider-track {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: #e5e7eb;
          transform: translateY(-50%);
          border-radius: 999px;
        }

        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 3;
        }

        .slider-input::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 3;
        }

        .slider-spots {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          z-index: 1;
        }

        .slider-spot-container {
          position: absolute;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 60px;
        }

        .slider-spot {
          width: 8px;
          height: 8px;
          background: #e5e7eb;
          border: 2px solid white;
          border-radius: 50%;
          margin-bottom: 8px;
          transition: all 0.2s ease;
        }

        .slider-spot.active {
          background: #3b82f6;
          transform: scale(1.2);
        }

        .slider-label {
          font-size: 10px;
          color: #6b7280;
          text-align: center;
          margin-top: 4px;
          white-space: nowrap;
          opacity: 0.8;
        }

        .slider-input:focus {
          outline: none;
        }

        .slider-input::-webkit-slider-runnable-track {
          width: 100%;
          height: 2px;
          cursor: pointer;
          background: transparent;
          border-radius: 999px;
        }

        .slider-input::-moz-range-track {
          width: 100%;
          height: 2px;
          cursor: pointer;
          background: transparent;
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
} 