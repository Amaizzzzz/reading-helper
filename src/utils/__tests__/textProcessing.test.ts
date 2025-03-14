import { findHighlightWords, getContextAwareTranslation, processText } from '../textProcessing';
import { TextAnalysis, TranslationEntry } from '@/types/translation';

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Text Processing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findHighlightWords', () => {
    it('identifies words to highlight', () => {
      const text = 'The journey of learning is a wonderful journey.';
      const highlights = findHighlightWords(text);

      expect(highlights).toHaveLength(2);
      expect(highlights[0]).toMatchObject({
        word: 'journey',
        startIndex: 4,
        endIndex: 11
      });
      expect(highlights[1]).toMatchObject({
        word: 'journey',
        startIndex: 39,
        endIndex: 46
      });
    });

    it('maintains case sensitivity in output', () => {
      const text = 'The Journey begins';
      const highlights = findHighlightWords(text);

      expect(highlights).toHaveLength(1);
      expect(highlights[0].word).toBe('Journey');
    });

    it('handles words with no translations', () => {
      const text = 'The cat sat on the mat';
      const highlights = findHighlightWords(text);

      expect(highlights).toHaveLength(0);
    });

    it('correctly identifies word boundaries', () => {
      const text = 'journeyman journey journeys';
      const highlights = findHighlightWords(text);

      expect(highlights).toHaveLength(1);
      expect(highlights[0]).toMatchObject({
        word: 'journey',
        startIndex: 11,
        endIndex: 18
      });
    });
  });

  describe('getContextAwareTranslation', () => {
    it('provides context-aware translation for known words', () => {
      const text = 'The journey to success requires dedication.';
      const word = 'journey';
      const position = 4;

      const translation = getContextAwareTranslation(word, text, position);

      expect(translation.word).toBe('journey');
      expect(translation.contextAnalysis).toBeDefined();
      expect(translation.contextAnalysis?.precedingWords).toContain('The');
      expect(translation.contextAnalysis?.followingWords).toContain('success');
      expect(translation.contextAnalysis?.isInQuotes).toBe(false);
    });

    it('handles words at the start of text', () => {
      const text = 'journey to success';
      const word = 'journey';
      const position = 0;

      const translation = getContextAwareTranslation(word, text, position);

      expect(translation.contextAnalysis?.precedingWords).toHaveLength(0);
      expect(translation.contextAnalysis?.followingWords).toContain('success');
    });

    it('handles words at the end of text', () => {
      const text = 'start the journey';
      const word = 'journey';
      const position = 10;

      const translation = getContextAwareTranslation(word, text, position);

      expect(translation.contextAnalysis?.precedingWords).toContain('the');
      expect(translation.contextAnalysis?.followingWords).toHaveLength(0);
    });

    it('detects words in quotes', () => {
      const text = 'They said "the journey was amazing"';
      const word = 'journey';
      const position = 14;

      const translation = getContextAwareTranslation(word, text, position);

      expect(translation.contextAnalysis?.isInQuotes).toBe(true);
    });

    it('provides default translation for unknown words', () => {
      const text = 'The cat sat on the mat';
      const word = 'cat';
      const position = 4;

      const translation = getContextAwareTranslation(word, text, position);

      expect(translation.word).toBe('cat');
      expect(translation.translation.basic.translation).toBe('Translation not available');
    });
  });

  describe('processText', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            result: 'Mocked translation result'
          })
        })
      );
    });

    it('processes text and returns complete analysis', async () => {
      const text = 'The journey of learning is amazing.';
      const result = await processText(text);

      expect(result).toMatchObject({
        sourceText: text,
        metrics: {
          wordCount: 6,
          sentenceCount: 1
        }
      });
      expect(result.highlights).toHaveLength(1);
      expect(result.processedAt).toBeDefined();
    });

    it('includes language detection in metrics', async () => {
      const text = 'The journey begins. La vie est belle.';
      const result = await processText(text);

      expect(result.metrics.languageConfidence).toBeDefined();
      expect(result.metrics.languageConfidence.lang).toBeDefined();
      expect(result.metrics.languageConfidence.confidence).toBeGreaterThan(0);
    });

    it('handles empty text', async () => {
      const text = '';
      const result = await processText(text);

      expect(result.metrics.wordCount).toBe(0);
      expect(result.metrics.sentenceCount).toBe(0);
      expect(result.highlights).toHaveLength(0);
    });

    it('handles API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.reject(new Error('API Error'))
      );

      const text = 'The journey begins';
      await expect(processText(text)).rejects.toThrow('API Error');
    });

    it('processes multiple highlights in parallel', async () => {
      const text = 'The journey begins, another journey ends';
      const result = await processText(text);

      expect(result.highlights).toHaveLength(2);
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('preserves order of highlights', async () => {
      const text = 'First journey, second journey';
      const result = await processText(text);

      expect(result.highlights).toHaveLength(2);
      expect(result.highlights[0].startIndex).toBeLessThan(result.highlights[1].startIndex);
    });
  });
}); 