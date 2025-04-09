interface TranslationResult {
  translation: {
    basic: string;
    detailed?: string;
    technical?: string;
  };
  examples?: string[];
  suggestions?: {
    vocabulary?: string[];
    grammar?: string[];
    usage?: string[];
  };
}

export async function getContextAwareTranslation(
  text: string,
  hintLevel: number = 3,
  translationDetail: number = 3
): Promise<TranslationResult> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        hintLevel,
        translationDetail,
      }),
    });

    if (!response.ok) {
      throw new Error('Translation request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Translation error:', error);
    return {
      translation: {
        basic: 'Translation failed. Please try again.',
      },
    };
  }
} 