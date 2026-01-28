import { describe, it, expect, vi } from 'vitest';

// Mock the LLM module
vi.mock('./_core/llm', () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          joy: 60,
          fear: 20,
          anger: 10,
          sadness: 15,
          hope: 70,
          curiosity: 40,
          dominantEmotion: 'hope',
          sentiment: 'positive',
          confidence: 85,
        }),
      },
    }],
  }),
}));

// Import after mocking
const { analyzeTextWithAI, analyzeTextsWithAI } = await import('./aiSentimentAnalyzer');

describe('AI Sentiment Analyzer', () => {
  describe('analyzeTextWithAI', () => {
    it('should analyze text and return emotion vector', async () => {
      const result = await analyzeTextWithAI('Saudi Arabia announces new economic development plan');

      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('emotions');
      expect(result).toHaveProperty('dominantEmotion');
      expect(result).toHaveProperty('sentiment');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('gmi');
      expect(result).toHaveProperty('cfi');
      expect(result).toHaveProperty('hri');
    });

    it('should return emotions within valid ranges', async () => {
      const result = await analyzeTextWithAI('Test headline');

      expect(result.emotions.joy).toBeGreaterThanOrEqual(0);
      expect(result.emotions.joy).toBeLessThanOrEqual(100);
      expect(result.emotions.fear).toBeGreaterThanOrEqual(0);
      expect(result.emotions.fear).toBeLessThanOrEqual(100);
      expect(result.emotions.anger).toBeGreaterThanOrEqual(0);
      expect(result.emotions.anger).toBeLessThanOrEqual(100);
      expect(result.emotions.sadness).toBeGreaterThanOrEqual(0);
      expect(result.emotions.sadness).toBeLessThanOrEqual(100);
      expect(result.emotions.hope).toBeGreaterThanOrEqual(0);
      expect(result.emotions.hope).toBeLessThanOrEqual(100);
      expect(result.emotions.curiosity).toBeGreaterThanOrEqual(0);
      expect(result.emotions.curiosity).toBeLessThanOrEqual(100);
    });

    it('should return indices within valid ranges', async () => {
      const result = await analyzeTextWithAI('Test headline');

      expect(result.gmi).toBeGreaterThanOrEqual(-100);
      expect(result.gmi).toBeLessThanOrEqual(100);
      expect(result.cfi).toBeGreaterThanOrEqual(0);
      expect(result.cfi).toBeLessThanOrEqual(100);
      expect(result.hri).toBeGreaterThanOrEqual(0);
      expect(result.hri).toBeLessThanOrEqual(100);
    });

    it('should return confidence within valid range', async () => {
      const result = await analyzeTextWithAI('Test headline');

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });
  });

  describe('analyzeTextsWithAI', () => {
    it('should analyze multiple texts and return aggregated results', async () => {
      const texts = [
        'Saudi Arabia announces new economic plan',
        'Technology sector grows rapidly',
        'International summit hosted in Riyadh',
      ];

      const result = await analyzeTextsWithAI(texts);

      expect(result).toHaveProperty('results');
      expect(result).toHaveProperty('aggregated');
      expect(result).toHaveProperty('isAIAnalyzed');
      expect(result.results.length).toBe(texts.length);
    });

    it('should return empty results for empty input', async () => {
      const result = await analyzeTextsWithAI([]);

      expect(result.results.length).toBe(0);
      expect(result.aggregated.gmi).toBe(0);
      expect(result.aggregated.cfi).toBe(50);
      expect(result.aggregated.hri).toBe(50);
      expect(result.isAIAnalyzed).toBe(false);
    });

    it('should aggregate results correctly', async () => {
      const texts = ['Headline 1', 'Headline 2'];
      const result = await analyzeTextsWithAI(texts);

      expect(result.aggregated).toHaveProperty('gmi');
      expect(result.aggregated).toHaveProperty('cfi');
      expect(result.aggregated).toHaveProperty('hri');
      expect(result.aggregated).toHaveProperty('dominantEmotion');
      expect(result.aggregated).toHaveProperty('confidence');
    });
  });
});

describe('News Service', async () => {
  const { generateMockNews, getNewsWithFallback } = await import('./newsService');

  describe('generateMockNews', () => {
    it('should generate mock news for a country', () => {
      const news = generateMockNews('SA', 5);

      expect(news.length).toBe(5);
      expect(news[0]).toHaveProperty('title');
      expect(news[0]).toHaveProperty('description');
      expect(news[0]).toHaveProperty('source');
      expect(news[0]).toHaveProperty('url');
      expect(news[0]).toHaveProperty('publishedAt');
    });

    it('should generate news with country name in headlines', () => {
      const news = generateMockNews('US', 3);

      const hasUSMention = news.some(
        (article) =>
          article.title.includes('United States') ||
          article.title.includes('USA') ||
          article.title.includes('America')
      );
      expect(hasUSMention).toBe(true);
    });
  });

  describe('getNewsWithFallback', () => {
    it('should return news with fallback indicator', async () => {
      const result = await getNewsWithFallback('SA', 5);

      expect(result).toHaveProperty('articles');
      expect(result).toHaveProperty('isReal');
      expect(result.articles.length).toBeGreaterThan(0);
    });
  });
});
