import { UserPreferences } from '../types/userPreferences';

const STORAGE_KEY = 'user_preferences';

const defaultPreferences: UserPreferences = {
  id: '1',
  userId: 'default-user',
  hintLevel: 50,  // Default to middle value
  translationDetail: 50,  // Default to middle value
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export function getStoredPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return defaultPreferences;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultPreferences;
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error parsing stored preferences:', error);
    return defaultPreferences;
  }
}

export function updateStoredPreferences(updates: Partial<UserPreferences>): UserPreferences {
  const current = getStoredPreferences();
  const updated: UserPreferences = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return updated;
}

export function clearStoredPreferences(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
} 