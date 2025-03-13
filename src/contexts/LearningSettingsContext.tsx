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
  const [isLoading, setIsLoading] = useState(false);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      const updated = updateStoredPreferences(updates);
      setPreferences(updated);
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