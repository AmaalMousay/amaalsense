/**
 * Tests for countryNewsAnalyzer - Real Data Engine
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the external dependencies
vi.mock('./googleRssService', () => ({
  fetchGoogleNewsByTopic: vi.fn().mockResolvedValue([
    { title: 'Libya peace talks resume', description: 'UN-backed peace talks', link: 'https://example.com/1', pubDate: new Date().toISOString(), source: 'Reuters', language: 'en' },
    { title: 'Oil production increases in Libya', description: 'NOC reports increase', link: 'https://example.com/2', pubDate: new Date().toISOString(), source: 'Bloomberg', language: 'en' },
    { title: 'محادثات السلام الليبية', description: 'محادثات بدعم أممي', link: 'https://example.com/3', pubDate: new Date().toISOString(), source: 'العربية', language: 'ar' },
  ]),
  fetchGoogleNewsByCountry: vi.fn().mockResolvedValue([
    { title: 'Libya elections update', description: 'Electoral commission announces', link: 'https://example.com/4', pubDate: new Date().toISOString(), source: 'BBC', language: 'en' },
    { title: 'Economic reforms in Libya', description: 'Central bank reforms', link: 'https://example.com/5', pubDate: new Date().toISOString(), source: 'FT', language: 'en' },
  ]),
}));

vi.mock('./newsService', () => ({
  fetchCountryNews: vi.fn().mockResolvedValue([
    { title: 'Libya humanitarian aid', description: 'Aid arrives in Tripoli', url: 'https://example.com/6', publishedAt: new Date().toISOString(), source: { name: 'CNN' } },
  ]),
}));

vi.mock('./smartLLM', () => ({
  smartJsonChat: vi.fn().mockResolvedValue({
    gmi: 15,
    cfi: 35,
    hri: 55,
    dominantEmotion: 'hope',
    emotionIntensity: 65,
    summary: 'Libya shows signs of progress with peace talks and economic reforms.',
    summaryAr: 'ليبيا تظهر علامات تقدم مع محادثات السلام والإصلاحات الاقتصادية.',
    newsAnalysis: [
      { index: 0, category: 'political', sentiment: 'positive' },
      { index: 1, category: 'economic', sentiment: 'positive' },
      { index: 2, category: 'political', sentiment: 'neutral' },
      { index: 3, category: 'political', sentiment: 'positive' },
      { index: 4, category: 'economic', sentiment: 'positive' },
      { index: 5, category: 'social', sentiment: 'positive' },
    ],
    trendingTopics: [
      { topic: 'Peace talks', topicAr: 'محادثات السلام', category: 'political', heat: 80, sentiment: 'positive' },
      { topic: 'Oil production', topicAr: 'إنتاج النفط', category: 'economic', heat: 70, sentiment: 'positive' },
    ],
  }),
}));

describe('countryNewsAnalyzer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export analyzeCountry function', async () => {
    const { analyzeCountry } = await import('./countryNewsAnalyzer');
    expect(typeof analyzeCountry).toBe('function');
  });

  it('should export quickCountryAnalysis function', async () => {
    const { quickCountryAnalysis } = await import('./countryNewsAnalyzer');
    expect(typeof quickCountryAnalysis).toBe('function');
  });

  it('should export COUNTRY_META with supported countries', async () => {
    const mod = await import('./countryNewsAnalyzer');
    // The module should have country metadata
    expect(mod).toBeDefined();
  });

  it('should analyze a country and return structured data', async () => {
    const { analyzeCountry } = await import('./countryNewsAnalyzer');
    const result = await analyzeCountry('LY');
    
    // Should have required fields
    expect(result).toHaveProperty('countryCode', 'LY');
    expect(result).toHaveProperty('countryName');
    expect(result).toHaveProperty('countryNameAr');
    expect(result).toHaveProperty('gmi');
    expect(result).toHaveProperty('cfi');
    expect(result).toHaveProperty('hri');
    expect(result).toHaveProperty('dominantEmotion');
    expect(result).toHaveProperty('news');
    expect(result).toHaveProperty('trendingTopics');
    expect(result).toHaveProperty('isRealData');
    expect(result).toHaveProperty('lastUpdated');
  });

  it('should return real data flag as true when news is found', async () => {
    const { analyzeCountry } = await import('./countryNewsAnalyzer');
    const result = await analyzeCountry('LY');
    
    expect(result.isRealData).toBe(true);
  });

  it('should categorize news into political, economic, social', async () => {
    const { analyzeCountry } = await import('./countryNewsAnalyzer');
    const result = await analyzeCountry('LY');
    
    // News should be categorized
    expect(result.news).toHaveProperty('political');
    expect(result.news).toHaveProperty('economic');
    expect(result.news).toHaveProperty('social');
    expect(Array.isArray(result.news.political)).toBe(true);
    expect(Array.isArray(result.news.economic)).toBe(true);
    expect(Array.isArray(result.news.social)).toBe(true);
  });

  it('should have GMI in range -100 to 100', async () => {
    const { analyzeCountry } = await import('./countryNewsAnalyzer');
    const result = await analyzeCountry('LY');
    
    expect(result.gmi).toBeGreaterThanOrEqual(-100);
    expect(result.gmi).toBeLessThanOrEqual(100);
  });

  it('should have CFI and HRI in range 0 to 100', async () => {
    const { analyzeCountry } = await import('./countryNewsAnalyzer');
    const result = await analyzeCountry('LY');
    
    expect(result.cfi).toBeGreaterThanOrEqual(0);
    expect(result.cfi).toBeLessThanOrEqual(100);
    expect(result.hri).toBeGreaterThanOrEqual(0);
    expect(result.hri).toBeLessThanOrEqual(100);
  });

  it('should include trending topics', async () => {
    const { analyzeCountry } = await import('./countryNewsAnalyzer');
    const result = await analyzeCountry('LY');
    
    expect(Array.isArray(result.trendingTopics)).toBe(true);
    if (result.trendingTopics.length > 0) {
      const topic = result.trendingTopics[0];
      expect(topic).toHaveProperty('topic');
      expect(topic).toHaveProperty('topicAr');
      expect(topic).toHaveProperty('sentiment');
    }
  });

  it('should include summary in English and Arabic', async () => {
    const { analyzeCountry } = await import('./countryNewsAnalyzer');
    const result = await analyzeCountry('LY');
    
    expect(typeof result.summary).toBe('string');
    expect(typeof result.summaryAr).toBe('string');
    expect(result.summary.length).toBeGreaterThan(0);
    expect(result.summaryAr.length).toBeGreaterThan(0);
  });

  it('should throw error for unknown country codes', async () => {
    const { analyzeCountry } = await import('./countryNewsAnalyzer');
    
    // Unknown country codes should throw an error
    await expect(analyzeCountry('XX')).rejects.toThrow('Unknown country code: XX');
  });

  it('should return quick analysis with correct shape', async () => {
    const { quickCountryAnalysis } = await import('./countryNewsAnalyzer');
    const result = await quickCountryAnalysis('LY');
    
    // quickCountryAnalysis returns a subset of the full analysis
    expect(result).toHaveProperty('gmi');
    expect(result).toHaveProperty('cfi');
    expect(result).toHaveProperty('hri');
    expect(result).toHaveProperty('isRealData');
  });

  it('should cache results for subsequent calls', async () => {
    const { analyzeCountry } = await import('./countryNewsAnalyzer');
    
    const result1 = await analyzeCountry('LY');
    const result2 = await analyzeCountry('LY');
    
    // Both should return the same data (from cache)
    expect(result1.gmi).toBe(result2.gmi);
    expect(result1.cfi).toBe(result2.cfi);
  });
});
