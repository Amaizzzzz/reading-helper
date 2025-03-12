export interface ReadingSettings {
  maxDifficulty: number;  // 1-5 scale
  highlightDensity: number;  // 0-1 scale
  preferredLevels: ('basic' | 'intermediate' | 'advanced')[];
  autoShowContext: boolean;
  fontSize: number;  // in pixels
  theme: 'light' | 'dark' | 'sepia';
  hintLevel: number;  // 0-100 scale
  translationDetail: number;  // 0-100 scale
}

export interface UserPreferences extends ReadingSettings {
  savedWords: string[];
  recentSearches: string[];
  lastReadPosition?: {
    articleId: string;
    scrollPosition: number;
  };
} 