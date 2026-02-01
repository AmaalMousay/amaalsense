/**
 * Tests for AmalSense Emotional Intelligence Engines
 * Phase 102: Backend Enhancements
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Engine 0: Emotional Memory
import { 
  storeAnalysis, 
  getHistoricalData, 
  calculateHistoricalTrend,
  getLastAnalysis,
  getMemoryStats,
  clearMemory
} from './emotionalMemory';

// Source Weighting
import {
  getSourceWeight,
  getSourceInfo,
  calculateCompositeWeight,
  calculateAggregateWeight,
  applySourceWeighting,
  knownSources
} from './sourceWeighting';

// Confidence Propagation
import {
  calculateContextConfidence,
  calculateFusionConfidence,
  calculateDynamicsConfidence,
  calculateDriverConfidence,
  calculateInsightConfidence,
  calculateOverallConfidence,
  quickConfidenceScore
} from './confidencePropagation';

// Feedback Store
import {
  addFeedback,
  submitEmotionCorrection,
  submitAccuracyRating,
  submitRelevanceRating,
  submitGeneralComment,
  getFeedbackForAnalysis,
  getFeedbackStats,
  analyzeFeedbackPatterns,
  clearFeedback
} from './feedbackStore';

// ============================================
// Engine 0: Emotional Memory Tests
// ============================================
describe('Engine 0: Emotional Memory Layer', () => {
  beforeEach(() => {
    clearMemory();
  });

  it('should store analysis entry', () => {
    const entry = storeAnalysis({
      topic: 'Climate Change',
      countryCode: 'US',
      countryName: 'United States',
      affectiveVector: { joy: 10, fear: 60, anger: 40, sadness: 50, hope: 30, curiosity: 25 },
      dominantEmotion: 'fear',
      emotionalIntensity: 60,
      valence: -30,
      gmi: 35,
      cfi: 65,
      hri: 40,
      domain: 'environment',
      eventType: 'crisis',
      sensitivityLevel: 'high',
      sourceCount: 5,
      confidence: 75,
      userType: 'researcher'
    });

    expect(entry.id).toBeDefined();
    expect(entry.topic).toBe('Climate Change');
    expect(entry.timestamp).toBeInstanceOf(Date);
  });

  it('should retrieve historical data by topic', () => {
    // Store multiple entries
    storeAnalysis({
      topic: 'Economy',
      countryCode: 'US',
      countryName: 'United States',
      affectiveVector: { joy: 20, fear: 40, anger: 30, sadness: 35, hope: 45, curiosity: 30 },
      dominantEmotion: 'hope',
      emotionalIntensity: 45,
      valence: 10,
      gmi: 55,
      cfi: 40,
      hri: 50,
      domain: 'economy',
      eventType: 'general',
      sensitivityLevel: 'medium',
      sourceCount: 3,
      confidence: 70,
      userType: 'trader'
    });

    storeAnalysis({
      topic: 'Economy Crisis',
      countryCode: 'US',
      countryName: 'United States',
      affectiveVector: { joy: 10, fear: 70, anger: 50, sadness: 60, hope: 20, curiosity: 15 },
      dominantEmotion: 'fear',
      emotionalIntensity: 70,
      valence: -40,
      gmi: 30,
      cfi: 75,
      hri: 25,
      domain: 'economy',
      eventType: 'crisis',
      sensitivityLevel: 'high',
      sourceCount: 8,
      confidence: 85,
      userType: 'trader'
    });

    const results = getHistoricalData({ topic: 'Economy', limit: 10 });
    expect(results.length).toBe(2);
  });

  it('should calculate historical trend', () => {
    // Store several entries for trend calculation
    for (let i = 0; i < 5; i++) {
      storeAnalysis({
        topic: 'Tech Stocks',
        countryCode: null,
        countryName: 'Global',
        affectiveVector: { 
          joy: 30 + i * 5, 
          fear: 40 - i * 3, 
          anger: 20, 
          sadness: 25, 
          hope: 35 + i * 4, 
          curiosity: 40 
        },
        dominantEmotion: 'hope',
        emotionalIntensity: 50 + i * 2,
        valence: 10 + i * 5,
        gmi: 55 + i * 3,
        cfi: 35 - i * 2,
        hri: 45 + i * 3,
        domain: 'technology',
        eventType: 'general',
        sensitivityLevel: 'low',
        sourceCount: 4,
        confidence: 72,
        userType: 'general'
      });
    }

    const trend = calculateHistoricalTrend({ topic: 'Tech Stocks' });
    expect(trend.dataPoints).toBe(5);
    expect(trend.averageGMI).toBeGreaterThan(0);
  });

  it('should get memory stats', () => {
    storeAnalysis({
      topic: 'Test',
      countryCode: 'LY',
      countryName: 'Libya',
      affectiveVector: { joy: 50, fear: 20, anger: 15, sadness: 10, hope: 60, curiosity: 45 },
      dominantEmotion: 'hope',
      emotionalIntensity: 55,
      valence: 35,
      gmi: 65,
      cfi: 25,
      hri: 60,
      domain: 'general',
      eventType: 'general',
      sensitivityLevel: 'low',
      sourceCount: 2,
      confidence: 65,
      userType: 'general'
    });

    const stats = getMemoryStats();
    expect(stats.totalEntries).toBe(1);
    expect(stats.uniqueTopics).toBe(1);
    expect(stats.uniqueCountries).toBe(1);
  });
});

// ============================================
// Source Weighting Tests
// ============================================
describe('Source Weighting System', () => {
  it('should return correct weight for known sources', () => {
    expect(getSourceWeight('reuters')).toBe(1.0);
    expect(getSourceWeight('bbc')).toBe(1.0);
    expect(getSourceWeight('twitter')).toBe(0.7);
  });

  it('should return source info with all properties', () => {
    const info = getSourceInfo('reuters');
    expect(info.name).toBe('Reuters');
    expect(info.type).toBe('news');
    expect(info.baseWeight).toBe(1.0);
    expect(info.reliability).toBeGreaterThan(0.9);
  });

  it('should calculate composite weight correctly', () => {
    const weight = calculateCompositeWeight('reuters');
    expect(weight).toBeGreaterThan(0.8);
    expect(weight).toBeLessThanOrEqual(1.0);
  });

  it('should calculate aggregate weight for multiple sources', () => {
    const result = calculateAggregateWeight(['reuters', 'bbc', 'twitter']);
    expect(result.weightedSources.length).toBe(3);
    expect(result.averageWeight).toBeGreaterThan(0);
    expect(result.totalWeight).toBeGreaterThan(0);
  });

  it('should apply source weighting to results', () => {
    const results = [
      { source: 'reuters', value: 80 },
      { source: 'twitter', value: 60 }
    ];
    const weighted = applySourceWeighting(results);
    expect(weighted).toBeGreaterThan(0);
    // Reuters should have more influence due to higher weight
    expect(weighted).toBeGreaterThan(65);
  });

  it('should have all expected known sources', () => {
    expect(knownSources['reuters']).toBeDefined();
    expect(knownSources['bbc']).toBeDefined();
    expect(knownSources['aljazeera']).toBeDefined();
    expect(knownSources['twitter']).toBeDefined();
    expect(knownSources['reddit']).toBeDefined();
  });
});

// ============================================
// Confidence Propagation Tests
// ============================================
describe('Confidence Propagation System', () => {
  it('should calculate context confidence', () => {
    const confidence = calculateContextConfidence(500, 10, true, true);
    expect(confidence.engineName).toBe('contextClassification');
    expect(confidence.confidence).toBeGreaterThan(0);
    expect(confidence.confidence).toBeLessThanOrEqual(100);
    expect(confidence.factors.length).toBe(4);
  });

  it('should calculate fusion confidence', () => {
    const confidence = calculateFusionConfidence(10, 0.8, 0.7, 0.6);
    expect(confidence.engineName).toBe('emotionFusion');
    expect(confidence.confidence).toBeGreaterThan(0);
  });

  it('should calculate dynamics confidence', () => {
    const confidence = calculateDynamicsConfidence(30, 48, 0.8);
    expect(confidence.engineName).toBe('emotionalDynamics');
    expect(confidence.confidence).toBeGreaterThan(0);
  });

  it('should calculate driver confidence', () => {
    const confidence = calculateDriverConfidence(10, 3, 0.7);
    expect(confidence.engineName).toBe('driverDetection');
    expect(confidence.confidence).toBeGreaterThan(0);
  });

  it('should calculate insight confidence', () => {
    const confidence = calculateInsightConfidence(70, 150, 4);
    expect(confidence.engineName).toBe('explainableInsight');
    expect(confidence.confidence).toBeGreaterThan(0);
  });

  it('should calculate overall confidence from all engines', () => {
    const engines = [
      calculateContextConfidence(500, 10, true, true),
      calculateFusionConfidence(10, 0.8, 0.7, 0.6),
      calculateDynamicsConfidence(30, 48, 0.8),
      calculateDriverConfidence(10, 3, 0.7),
      calculateInsightConfidence(70, 150, 4)
    ];

    const overall = calculateOverallConfidence(engines);
    expect(overall.score).toBeGreaterThan(0);
    expect(overall.score).toBeLessThanOrEqual(100);
    expect(['very_low', 'low', 'medium', 'high', 'very_high']).toContain(overall.level);
    expect(overall.explanation).toBeDefined();
  });

  it('should calculate quick confidence score', () => {
    const score = quickConfidenceScore(5, 200, true);
    expect(score).toBeGreaterThan(50);
    expect(score).toBeLessThanOrEqual(100);
  });
});

// ============================================
// Feedback Store Tests
// ============================================
describe('Feedback Store', () => {
  beforeEach(() => {
    clearFeedback();
  });

  it('should add feedback entry', () => {
    const feedback = addFeedback({
      analysisId: 'AML-123',
      userId: 'user-1',
      userType: 'researcher',
      type: 'accuracy_rating',
      sentiment: 'positive',
      rating: 4,
      topic: 'Climate Change'
    });

    expect(feedback.id).toBeDefined();
    expect(feedback.analysisId).toBe('AML-123');
    expect(feedback.processed).toBe(false);
  });

  it('should submit emotion correction', () => {
    const feedback = submitEmotionCorrection(
      'AML-456',
      'user-2',
      'journalist',
      'Election Results',
      'fear',
      'hope',
      'The tone was actually optimistic'
    );

    expect(feedback.type).toBe('emotion_correction');
    expect(feedback.originalValue).toBe('fear');
    expect(feedback.correctedValue).toBe('hope');
  });

  it('should submit accuracy rating', () => {
    const feedback = submitAccuracyRating(
      'AML-789',
      'user-3',
      'trader',
      'Stock Market',
      5,
      'Very accurate analysis'
    );

    expect(feedback.type).toBe('accuracy_rating');
    expect(feedback.rating).toBe(5);
    expect(feedback.sentiment).toBe('positive');
  });

  it('should submit relevance rating', () => {
    const feedback = submitRelevanceRating(
      'AML-101',
      undefined,
      'general',
      'Weather',
      2,
      'Not relevant to my query'
    );

    expect(feedback.type).toBe('relevance_rating');
    expect(feedback.rating).toBe(2);
    expect(feedback.sentiment).toBe('negative');
  });

  it('should submit general comment', () => {
    const feedback = submitGeneralComment(
      'AML-202',
      'user-4',
      'researcher',
      'COVID-19',
      'Great platform for research',
      'positive'
    );

    expect(feedback.type).toBe('general_comment');
    expect(feedback.comment).toBe('Great platform for research');
  });

  it('should get feedback for analysis', () => {
    submitAccuracyRating('AML-303', 'user-5', 'general', 'Topic A', 4);
    submitAccuracyRating('AML-303', 'user-6', 'general', 'Topic A', 5);
    submitAccuracyRating('AML-404', 'user-7', 'general', 'Topic B', 3);

    const feedback = getFeedbackForAnalysis('AML-303');
    expect(feedback.length).toBe(2);
  });

  it('should get feedback stats', () => {
    submitAccuracyRating('AML-1', undefined, 'general', 'Topic', 4);
    submitAccuracyRating('AML-2', undefined, 'general', 'Topic', 5);
    submitEmotionCorrection('AML-3', undefined, 'general', 'Topic', 'fear', 'hope');

    const stats = getFeedbackStats();
    expect(stats.totalFeedback).toBe(3);
    expect(stats.byType.accuracy_rating).toBe(2);
    expect(stats.byType.emotion_correction).toBe(1);
    expect(stats.averageRating).toBeGreaterThan(0);
  });

  it('should analyze feedback patterns', () => {
    // Add multiple corrections
    submitEmotionCorrection('AML-1', undefined, 'general', 'Topic', 'fear', 'hope');
    submitEmotionCorrection('AML-2', undefined, 'general', 'Topic', 'fear', 'hope');
    submitEmotionCorrection('AML-3', undefined, 'general', 'Topic', 'anger', 'sadness');

    const patterns = analyzeFeedbackPatterns();
    expect(patterns.commonCorrections.length).toBeGreaterThan(0);
    // fear->hope should be most common
    expect(patterns.commonCorrections[0].original).toBe('fear');
    expect(patterns.commonCorrections[0].corrected).toBe('hope');
    expect(patterns.commonCorrections[0].count).toBe(2);
  });
});
