/**
 * DCFT Engine Tests
 * Tests for the Digital Consciousness Field Theory implementation
 */

import { describe, it, expect } from 'vitest';
import { DCFTEngine, dcftEngine, analyzeTextDCFT } from './dcftEngine';
import { calculateDecayFactor, DECAY_RATES, calculateHalfLife } from './temporalDecay';
import { calculateInfluenceWeight, SOURCE_WEIGHTS } from './influenceWeight';
import { normalizeToAV, calculateAVMagnitude, getDominantEmotion } from './affectiveVector';
import { CognitiveLayer } from './cognitiveLayer';
import { AwarenessLayer } from './awarenessLayer';

describe('DCFT Engine', () => {
  describe('Text Analysis', () => {
    it('should analyze positive text correctly', async () => {
      const result = await analyzeTextDCFT('Great victory and celebration today!', 'test');
      
      expect(result).toBeDefined();
      expect(result.indices).toBeDefined();
      expect(result.indices.gmi).toBeGreaterThanOrEqual(-100);
      expect(result.indices.gmi).toBeLessThanOrEqual(100);
      expect(result.emotions).toBeDefined();
      expect(result.dominantEmotion).toBeDefined();
    });

    it('should analyze negative text correctly', async () => {
      const result = await analyzeTextDCFT('Crisis and fear spreading everywhere', 'test');
      
      expect(result).toBeDefined();
      expect(result.indices.cfi).toBeGreaterThan(0);
    });

    it('should detect emotional phase for intense content', async () => {
      const result = await analyzeTextDCFT(
        'Massive panic and terror as crisis unfolds! People are afraid and angry!',
        'news'
      );
      
      expect(result.alertLevel).toBeDefined();
    });
  });

  describe('Temporal Decay', () => {
    it('should calculate decay factor correctly', () => {
      // At time 0, decay should be 1
      const decayAtZero = calculateDecayFactor(0);
      expect(decayAtZero).toBe(1);

      // After some time, decay should be less than 1
      const decayAfter10Hours = calculateDecayFactor(10);
      expect(decayAfter10Hours).toBeLessThan(1);
      expect(decayAfter10Hours).toBeGreaterThan(0);
    });

    it('should have different decay rates for different emotions', () => {
      expect(DECAY_RATES.anger).toBeGreaterThan(DECAY_RATES.hope);
      expect(DECAY_RATES.curiosity).toBeGreaterThan(DECAY_RATES.sadness);
    });

    it('should calculate half-life correctly', () => {
      const halfLife = calculateHalfLife(0.07);
      expect(halfLife).toBeCloseTo(9.9, 1); // ~9.9 hours for λ=0.07
    });
  });

  describe('Influence Weighting', () => {
    it('should weight news sources higher than social media', () => {
      const newsWeight = calculateInfluenceWeight('news', 1000, 100, 0.9);
      const socialWeight = calculateInfluenceWeight('mastodon', 1000, 100, 0.9);
      
      expect(newsWeight).toBeGreaterThan(socialWeight);
    });

    it('should increase weight with higher engagement', () => {
      const lowEngagement = calculateInfluenceWeight('news', 1000, 10, 0.8);
      const highEngagement = calculateInfluenceWeight('news', 1000, 100000, 0.8);
      
      expect(highEngagement).toBeGreaterThan(lowEngagement);
    });

    it('should have government sources with highest weight', () => {
      expect(SOURCE_WEIGHTS.government).toBeGreaterThan(SOURCE_WEIGHTS.news);
      expect(SOURCE_WEIGHTS.government).toBeGreaterThan(SOURCE_WEIGHTS.academic);
    });
  });

  describe('Affective Vector', () => {
    it('should normalize emotions to -1 to +1 range', () => {
      const av = normalizeToAV({
        joy: 75,
        fear: 25,
        anger: 50,
        sadness: 0,
        hope: 100,
        curiosity: 50,
      });

      expect(av.joy).toBe(0.5);      // 75/50 - 1 = 0.5
      expect(av.fear).toBe(-0.5);    // 25/50 - 1 = -0.5
      expect(av.hope).toBe(1);       // 100/50 - 1 = 1
      expect(av.sadness).toBe(-1);   // 0/50 - 1 = -1
    });

    it('should calculate magnitude correctly', () => {
      const av = { joy: 1, fear: 0, anger: 0, sadness: 0, hope: 0, curiosity: 0 };
      const magnitude = calculateAVMagnitude(av);
      
      expect(magnitude).toBeCloseTo(1, 2);
    });

    it('should identify dominant emotion', () => {
      const av = { joy: 0.8, fear: 0.2, anger: 0.1, sadness: -0.3, hope: 0.5, curiosity: 0.3 };
      const dominant = getDominantEmotion(av);
      
      expect(dominant.emotion).toBe('joy');
      expect(dominant.polarity).toBe('positive');
    });
  });

  describe('Cognitive Layer - DCF Calculation', () => {
    it('should calculate D(t) formula correctly', () => {
      const cognitiveLayer = new CognitiveLayer();
      
      const events = [
        {
          id: 'test-1',
          content: 'Test content',
          source: 'news',
          timestamp: new Date(),
          reach: 1000,
          engagement: 100,
          affectiveVector: { joy: 0.5, fear: 0.1, anger: 0, sadness: -0.2, hope: 0.3, curiosity: 0.2 },
          confidence: 0.8,
        },
      ];

      const amplitude = cognitiveLayer.calculateDCFAmplitude(events);
      expect(amplitude).toBeGreaterThan(0);
    });

    it('should calculate RI(e,t) for each emotion', () => {
      const cognitiveLayer = new CognitiveLayer();
      
      const events = [
        {
          id: 'test-1',
          content: 'Happy and hopeful news!',
          source: 'news',
          timestamp: new Date(),
          reach: 1000,
          engagement: 100,
          affectiveVector: { joy: 0.8, fear: -0.2, anger: -0.3, sadness: -0.4, hope: 0.7, curiosity: 0.3 },
          confidence: 0.9,
        },
      ];

      const ri = cognitiveLayer.calculateResonanceIndex('joy', events);
      expect(ri).toBeGreaterThan(0);
    });
  });

  describe('Awareness Layer - Index Generation', () => {
    it('should calculate GMI in correct range', () => {
      const awarenessLayer = new AwarenessLayer();
      
      const dcfState = {
        timestamp: new Date(),
        amplitude: 50,
        resonanceIndices: { joy: 0.5, fear: -0.2, anger: -0.1, sadness: -0.3, hope: 0.4, curiosity: 0.2 },
        aggregatedAV: { joy: 0.5, fear: -0.2, anger: -0.1, sadness: -0.3, hope: 0.4, curiosity: 0.2 },
        dominantEmotion: 'joy',
        emotionalPhase: null,
        eventCount: 10,
        confidence: 0.8,
      };

      const gmi = awarenessLayer.calculateGMI(dcfState);
      expect(gmi).toBeGreaterThanOrEqual(-100);
      expect(gmi).toBeLessThanOrEqual(100);
    });

    it('should calculate CFI in correct range', () => {
      const awarenessLayer = new AwarenessLayer();
      
      const dcfState = {
        timestamp: new Date(),
        amplitude: 50,
        resonanceIndices: { joy: -0.2, fear: 0.7, anger: 0.5, sadness: 0.3, hope: -0.3, curiosity: 0.1 },
        aggregatedAV: { joy: -0.2, fear: 0.7, anger: 0.5, sadness: 0.3, hope: -0.3, curiosity: 0.1 },
        dominantEmotion: 'fear',
        emotionalPhase: null,
        eventCount: 10,
        confidence: 0.8,
      };

      const cfi = awarenessLayer.calculateCFI(dcfState);
      expect(cfi).toBeGreaterThanOrEqual(0);
      expect(cfi).toBeLessThanOrEqual(100);
    });

    it('should calculate HRI in correct range', () => {
      const awarenessLayer = new AwarenessLayer();
      
      const dcfState = {
        timestamp: new Date(),
        amplitude: 50,
        resonanceIndices: { joy: 0.3, fear: -0.1, anger: -0.2, sadness: -0.2, hope: 0.6, curiosity: 0.4 },
        aggregatedAV: { joy: 0.3, fear: -0.1, anger: -0.2, sadness: -0.2, hope: 0.6, curiosity: 0.4 },
        dominantEmotion: 'hope',
        emotionalPhase: null,
        eventCount: 10,
        confidence: 0.8,
      };

      const hri = awarenessLayer.calculateHRI(dcfState);
      expect(hri).toBeGreaterThanOrEqual(0);
      expect(hri).toBeLessThanOrEqual(100);
    });

    it('should detect alert levels correctly', () => {
      const awarenessLayer = new AwarenessLayer();
      
      // Normal conditions
      const normalAlert = awarenessLayer.determineAlertLevel(
        { gmi: 20, cfi: 30, hri: 60 },
        null
      );
      expect(normalAlert).toBe('normal');

      // Critical conditions
      const criticalAlert = awarenessLayer.determineAlertLevel(
        { gmi: -80, cfi: 85, hri: 20 },
        { type: 'crisis', intensity: 0.9, startTime: new Date(), dominantEmotions: ['fear'], description: 'Crisis' }
      );
      expect(criticalAlert).toBe('critical');
    });
  });

  describe('Full Pipeline Integration', () => {
    it('should process multiple texts and aggregate results', async () => {
      const texts = [
        'Great economic growth reported today',
        'Scientists make breakthrough discovery',
        'Community celebrates local hero',
      ];

      const result = await dcftEngine.analyzeTexts(texts, 'batch');
      
      expect(result.eventCount).toBe(3);
      expect(result.indices.gmi).toBeGreaterThanOrEqual(-100);
      expect(result.indices.gmi).toBeLessThanOrEqual(100);
      expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('should generate consistent results for same input', async () => {
      const text = 'Hope and optimism for the future';
      
      const result1 = await analyzeTextDCFT(text, 'test');
      const result2 = await analyzeTextDCFT(text, 'test');
      
      // Results should be similar (not exactly equal due to time-based factors)
      expect(Math.abs(result1.indices.gmi - result2.indices.gmi)).toBeLessThan(20);
    });
  });
});
