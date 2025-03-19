'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserPreferences } from '@/types/userPreferences';
import { getStoredPreferences, updateStoredPreferences } from '@/utils/userPreferences';

interface LearningSettingsContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
}

const LearningSettingsContext = createContext<LearningSettingsContextType | undefined>(undefined);

export function LearningSettingsProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(getStoredPreferences());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch('/api/preferences');
        if (response.ok) {
          const data = await response.json();
          setPreferences(data);
          updateStoredPreferences(data);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updated = await response.json();
        setPreferences(updated);
        updateStoredPreferences(updated);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  return (
    <LearningSettingsContext.Provider value={{ preferences, updatePreferences, isLoading }}>
      {children}
    </LearningSettingsContext.Provider>
  );
}

export function useLearningSettings() {
  const context = useContext(LearningSettingsContext);
  if (context === undefined) {
    throw new Error('useLearningSettings must be used within a LearningSettingsProvider');
  }
  return context;
} 