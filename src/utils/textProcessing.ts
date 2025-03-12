import { TranslationEntry, HighlightWord } from '../types/translation';

const mockTranslations: { [key: string]: TranslationEntry } = {
  'journey': {
    word: 'journey',
    context: 'Represents a continuous process in the context of language learning',
    suggestions: {
      vocabulary: [
        'Related words: trip (short travel), voyage (sea journey), expedition (exploration)',
        'Word forms: journeyed (past tense), journeying (present participle)',
        'Synonyms: travel, venture, quest, odyssey'
      ],
      grammar: [
        'As a noun: embark on a journey',
        'As a verb: to journey through life',
        'Common phrases: life journey, spiritual journey, learning journey'
      ],
      usage: [
        'Life metaphor: Life is a journey, not a destination',
        'Learning process: The journey of learning never ends',
        'Personal growth: My journey of self-discovery'
      ],
      memory: [
        'Memory tip: jour (French "day") + ney, daily journey',
        'Association: Life is like a journey, full of unknowns and adventures',
        'Scene memory: Imagine yourself on a memorable journey'
      ]
    },
    examples: [
      'Learning a language is a journey that requires patience and dedication.',
      'Every journey begins with a single step.',
      'The journey of self-improvement never truly ends.'
    ],
    difficulty: 2
  },
  'cognitive': {
    word: 'cognitive',
    context: 'In educational and psychological contexts, describes mental and learning processes',
    suggestions: {
      vocabulary: [
        'Root word: cogn- (know, recognize)',
        'Related words: cognition, recognize, cognizant',
        'Antonyms: instinctive, emotional'
      ],
      grammar: [
        'Adjective usage: cognitive skills',
        'Noun form: cognition',
        'Adverb form: cognitively'
      ],
      usage: [
        'Psychological term: cognitive development',
        'Educational field: cognitive learning strategies',
        'Neuroscience: cognitive neuroscience'
      ],
      memory: [
        'Root memory: cogn- (know) + -itive (adjective suffix)',
        'Association memory: "Cognition" is like a computer processing information in your brain',
        'Scene application: Using cognitive strategies when learning new knowledge'
      ]
    },
    examples: [
      'Cognitive development is crucial in early childhood.',
      'Students need to develop strong cognitive skills.',
      'The cognitive approach to learning emphasizes mental processes.'
    ],
    difficulty: 4
  }
};

export const findHighlightWords = (text: string): HighlightWord[] => {
  const words = text.split(/\s+/);
  const highlights: HighlightWord[] = [];
  let currentIndex = 0;

  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/g, '');
    if (mockTranslations[cleanWord]) {
      const startIndex = text.indexOf(word, currentIndex);
      highlights.push({
        word: word,
        startIndex: startIndex,
        endIndex: startIndex + word.length,
        translation: mockTranslations[cleanWord]
      });
      currentIndex = startIndex + word.length;
    }
  });

  return highlights;
};

export const getContextAwareTranslation = (
  word: string,
  context: string,
  position: number
): TranslationEntry => {
  const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/g, '');
  return mockTranslations[cleanWord] || {
    word: word,
    basic: 'No translation',
    intermediate: 'No detailed explanation',
    advanced: 'No advanced explanation',
    examples: ['No example sentence'],
    difficulty: 1,
    context: 'No contextual explanation'
  };
}; 