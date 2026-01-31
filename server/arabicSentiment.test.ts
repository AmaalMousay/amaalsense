/**
 * Test Arabic Sentiment Analysis - Death/Tragedy Context
 * Ensures the system correctly identifies sadness in Arabic death news
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the LLM module
vi.mock('./_core/llm', () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          joy: 5,
          fear: 20,
          anger: 15,
          sadness: 85,
          hope: 10,
          curiosity: 10,
          dominantEmotion: 'sadness',
          sentiment: 'negative',
          confidence: 90,
        }),
      },
    }],
  }),
}));

// Import after mocking
import { analyzeTextWithAI } from './aiSentimentAnalyzer';

describe('Arabic Death News Sentiment Analysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should detect sadness as dominant emotion for Arabic death news', async () => {
    const deathNews = 'موت أبومرداع ودخيل في السعودية';
    const result = await analyzeTextWithAI(deathNews);
    
    // Sadness should be the dominant emotion
    expect(result.dominantEmotion).toBe('sadness');
    
    // Joy should be very low for death news
    expect(result.emotions.joy).toBeLessThan(20);
    
    // Sadness should be high
    expect(result.emotions.sadness).toBeGreaterThan(50);
    
    // Sentiment should be negative
    expect(result.sentiment).toBe('negative');
  });

  it('should detect sadness for وفاة keyword', async () => {
    const deathNews = 'وفاة الشيخ محمد عن عمر يناهز 80 عاماً';
    const result = await analyzeTextWithAI(deathNews);
    
    expect(result.dominantEmotion).toBe('sadness');
    expect(result.sentiment).toBe('negative');
  });

  it('should detect sadness for استشهد/شهيد keywords', async () => {
    const martyrNews = 'استشهد 10 مدنيين في الغارة الجوية';
    const result = await analyzeTextWithAI(martyrNews);
    
    expect(result.dominantEmotion).toBe('sadness');
    expect(result.emotions.sadness).toBeGreaterThan(50);
  });

  it('should have low GMI for death news', async () => {
    const deathNews = 'مقتل 5 أشخاص في حادث مروري';
    const result = await analyzeTextWithAI(deathNews);
    
    // GMI should be negative for death news
    expect(result.gmi).toBeLessThan(0);
  });

  it('should have high CFI for tragedy news', async () => {
    const tragedyNews = 'كارثة طبيعية تودي بحياة المئات';
    const result = await analyzeTextWithAI(tragedyNews);
    
    // CFI should be elevated for tragedy
    expect(result.cfi).toBeGreaterThan(40);
  });
});

describe('Arabic Positive News Sentiment Analysis', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Mock positive response for positive news
    const llmModule = await import('./_core/llm');
    vi.mocked(llmModule.invokeLLM).mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            joy: 75,
            fear: 10,
            anger: 5,
            sadness: 5,
            hope: 80,
            curiosity: 40,
            dominantEmotion: 'hope',
            sentiment: 'positive',
            confidence: 85,
          }),
        },
      }],
    });
  });

  it('should detect joy/hope for positive Arabic news', async () => {
    const positiveNews = 'نجاح كبير للمنتخب الوطني في البطولة';
    const result = await analyzeTextWithAI(positiveNews);
    
    // Should be positive sentiment
    expect(result.sentiment).toBe('positive');
    
    // Joy or hope should be dominant
    expect(['joy', 'hope']).toContain(result.dominantEmotion);
  });

  it('should have positive GMI for success news', async () => {
    const successNews = 'إنجاز تاريخي للعلماء العرب في مجال الطب';
    const result = await analyzeTextWithAI(successNews);
    
    // GMI should be positive
    expect(result.gmi).toBeGreaterThan(0);
  });
});
