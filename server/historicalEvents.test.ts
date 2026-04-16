import { describe, it, expect } from 'vitest';
import { historicalEvents } from './historicalEventsData';

describe('Historical Events Data', () => {
  it('should have at least 200 events', () => {
    expect(historicalEvents.length).toBeGreaterThanOrEqual(200);
    console.log(`Total events: ${historicalEvents.length}`);
  });

  it('every event should have required fields', () => {
    for (const event of historicalEvents) {
      expect(event.eventName).toBeTruthy();
      expect(event.eventDate).toBeTruthy();
      expect(event.eventCategory).toBeTruthy();
      expect(event.country).toBeTruthy();
      expect(event.eventDescription).toBeTruthy();
      expect(typeof event.estimatedGMI).toBe('number');
      expect(typeof event.estimatedCFI).toBe('number');
      expect(typeof event.estimatedHRI).toBe('number');
    }
  });

  it('every event should have emotional vector with 6 dimensions', () => {
    for (const event of historicalEvents) {
      expect(event.emotionalVector).toBeDefined();
      expect(typeof event.emotionalVector.joy).toBe('number');
      expect(typeof event.emotionalVector.fear).toBe('number');
      expect(typeof event.emotionalVector.anger).toBe('number');
      expect(typeof event.emotionalVector.sadness).toBe('number');
      expect(typeof event.emotionalVector.hope).toBe('number');
      expect(typeof event.emotionalVector.curiosity).toBe('number');
    }
  });

  it('every event should have impacts with political, economic, social', () => {
    for (const event of historicalEvents) {
      expect(event.impacts).toBeDefined();
      expect(typeof event.impacts.political).toBe('string');
      expect(typeof event.impacts.economic).toBe('string');
      expect(typeof event.impacts.social).toBe('string');
      expect(event.impacts.political.length).toBeGreaterThan(0);
      expect(event.impacts.economic.length).toBeGreaterThan(0);
      expect(event.impacts.social.length).toBeGreaterThan(0);
    }
  });

  it('GMI should be between -100 and 100', () => {
    for (const event of historicalEvents) {
      expect(event.estimatedGMI).toBeGreaterThanOrEqual(-100);
      expect(event.estimatedGMI).toBeLessThanOrEqual(100);
    }
  });

  it('CFI should be between 0 and 100', () => {
    for (const event of historicalEvents) {
      expect(event.estimatedCFI).toBeGreaterThanOrEqual(0);
      expect(event.estimatedCFI).toBeLessThanOrEqual(100);
    }
  });

  it('HRI should be between 0 and 100', () => {
    for (const event of historicalEvents) {
      expect(event.estimatedHRI).toBeGreaterThanOrEqual(0);
      expect(event.estimatedHRI).toBeLessThanOrEqual(100);
    }
  });

  it('emotional vector values should be between 0 and 100', () => {
    for (const event of historicalEvents) {
      const ev = event.emotionalVector;
      for (const [key, value] of Object.entries(ev)) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      }
    }
  });

  it('should have events from multiple categories', () => {
    const categories = new Set(historicalEvents.map(e => e.eventCategory));
    expect(categories.size).toBeGreaterThanOrEqual(5);
    expect(categories.has('conflict')).toBe(true);
    expect(categories.has('economic')).toBe(true);
    expect(categories.has('political')).toBe(true);
  });

  it('should have events from multiple countries', () => {
    const countries = new Set(historicalEvents.map(e => e.country));
    expect(countries.size).toBeGreaterThanOrEqual(10);
  });

  it('should have events spanning multiple decades', () => {
    const years = historicalEvents.map(e => new Date(e.eventDate).getFullYear());
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    expect(maxYear - minYear).toBeGreaterThanOrEqual(50);
  });

  it('every event should have sources array', () => {
    for (const event of historicalEvents) {
      expect(Array.isArray(event.sources)).toBe(true);
      expect(event.sources.length).toBeGreaterThan(0);
    }
  });

  it('every event should have outcome fields', () => {
    for (const event of historicalEvents) {
      expect(typeof event.shortTermOutcome).toBe('string');
      expect(typeof event.mediumTermOutcome).toBe('string');
      expect(typeof event.longTermOutcome).toBe('string');
    }
  });

  it('should contain key historical events', () => {
    const names = historicalEvents.map(e => e.eventName.toLowerCase());
    // Check for some well-known events
    const hasFinancialCrisis = names.some(n => n.includes('financial') || n.includes('lehman'));
    const hasCovid = names.some(n => n.includes('covid') || n.includes('pandemic'));
    const hasLibya = names.some(n => n.includes('libya') || n.includes('libyan'));
    
    expect(hasFinancialCrisis).toBe(true);
    expect(hasCovid).toBe(true);
    expect(hasLibya).toBe(true);
  });
});
