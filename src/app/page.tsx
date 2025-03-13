'use client';

import React from 'react';
import HighlightableText from './components/HighlightableText';
import LearningSettings from './components/LearningSettings';
import { LearningSettingsProvider } from '@/contexts/LearningSettingsContext';

export default function Home() {
  return (
    <LearningSettingsProvider>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-6">Reading Helper</h1>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <HighlightableText
                text={`Here's a sample text to demonstrate the translation feature. 
                You can highlight any word or phrase to see its translation and learning hints.
                The translation will adapt based on your learning preferences.
                
                For example, try highlighting the word "demonstrate" to see different levels of translation and hints.
                You can also try longer phrases like "learning preferences" to see how the system handles multiple words.`}
              />
            </div>
          </div>

          {/* Settings sidebar */}
          <div className="md:col-span-1">
            <LearningSettings />
          </div>
        </div>
      </main>
    </LearningSettingsProvider>
  );
} 