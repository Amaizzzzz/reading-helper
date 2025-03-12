import { TranslationEntry, HighlightWord } from '../types/translation';

const mockTranslations: { [key: string]: TranslationEntry } = {
  'journey': {
    word: 'journey',
    context: 'Represents a continuous process in the context of language learning',
    translation: {
      basic: {
        translation: 'A trip or travel from one place to another',
        examples: [
          'The journey to success is often challenging.',
          'They embarked on a long journey across the country.'
        ]
      },
      detailed: {
        translation: 'An act of traveling from one place to another, especially when involving a considerable distance or time',
        examples: [
          'Life is a journey, not a destination.',
          'The spacecraft completed its journey to Mars.'
        ],
        notes: [
          'Often used metaphorically to describe personal growth or progress'
        ]
      },
      technical: {
        translation: 'A passage or progress from one stage to another',
        examples: [
          'The customer journey in digital marketing',
          'The hero\'s journey in literature'
        ],
        domain: 'business, literature'
      }
    },
    suggestions: {
      vocabulary: [
        'voyage',
        'expedition',
        'trek',
        'odyssey'
      ],
      grammar: [
        'Used as a countable noun',
        'Can be used with prepositions: on/in/through a journey'
      ],
      usage: [
        'Often used metaphorically',
        'Common in both formal and informal contexts'
      ],
      memory: [
        'Think of "jour" (French for "day") - a journey was historically the distance one could travel in a day',
        'Associate with the phrase "life\'s journey"'
      ]
    },
    examples: [
      'The journey of a thousand miles begins with a single step.',
      'Their journey to becoming fluent speakers took several years.'
    ],
    difficulty: 2
  }
};

export function findHighlightWords(text: string): HighlightWord[] {
  const words = text.match(/\b\w+\b/g) || [];
  const highlights: HighlightWord[] = [];

  words.forEach(word => {
    const lowerWord = word.toLowerCase();
    if (mockTranslations[lowerWord]) {
      const startIndex = text.toLowerCase().indexOf(lowerWord);
      if (startIndex !== -1) {
        highlights.push({
          word: word,
          startIndex,
          endIndex: startIndex + word.length,
          translation: mockTranslations[lowerWord]
        });
      }
    }
  });

  return highlights;
}

export function getContextAwareTranslation(
  word: string,
  context: string,
  position: number
): TranslationEntry {
  const lowerWord = word.toLowerCase();
  const translation = mockTranslations[lowerWord];
  
  if (!translation) {
    // Return a default translation if word not found
    return {
      word: word,
      context: context.slice(Math.max(0, position - 50), position + 50),
      translation: {
        basic: {
          translation: 'Translation not available',
          examples: []
        }
      },
      suggestions: {
        vocabulary: [],
        grammar: [],
        usage: [],
        memory: []
      },
      examples: [],
      difficulty: 3
    };
  }

  return {
    ...translation,
    context: context.slice(Math.max(0, position - 50), position + 50)
  };
} 