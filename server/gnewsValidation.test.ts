/**
 * GNews API Validation Test
 * Tests that the GNews API key is valid and can fetch news
 */

import { describe, it, expect } from 'vitest';
import { testGNewsConnection, fetchGNewsHeadlines } from './gnewsService';

describe('GNews API Validation', () => {
  it.skip('should have a valid GNews API key', async () => {
    const result = await testGNewsConnection();
    console.log('GNews connection test:', result);
    expect(result.success).toBe(true);
  }, 15000);
  
  it.skip('should fetch Arabic headlines', async () => {
    const news = await fetchGNewsHeadlines({ language: 'ar', max: 3 });
    console.log(`Fetched ${news.length} Arabic articles`);
    expect(news.length).toBeGreaterThan(0);
  }, 15000);
  
  it.skip('should fetch English headlines', async () => {
    const news = await fetchGNewsHeadlines({ language: 'en', max: 3 });
    console.log(`Fetched ${news.length} English articles`);
    expect(news.length).toBeGreaterThan(0);
  }, 15000);
});
