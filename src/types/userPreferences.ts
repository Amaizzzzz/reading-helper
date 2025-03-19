export interface UserPreferences {
  id: string;
  userId: string;
  hintLevel: number;  // 1-100 for slider
  translationDetail: number;  // 1-100 for slider
  createdAt: string;
  updatedAt: string;
}

export type UpdatePreferencesRequest = {
  hintLevel?: number;
  translationDetail?: number;
}; 