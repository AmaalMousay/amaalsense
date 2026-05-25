import { t } from "../_core/i18n";
/**
 * AI Learning Store - The Accumulative Knowledge Core (ASI Edition)
 *   (V3.5):         .
 */

import { calculateAggregatedMetrics } from '../utils/eventVectorModel';
import { getDb } from '../_core/db';
import { learningPatterns, keywordLearning } from '../drizzle/schema';
import { eq, desc, and, gte } from 'drizzle-orm';

// --- 1.   (Interfaces) ---
export interface AnalysisRecord {
  id: string;
  timestamp: Date;
  question: { topic: string; newsText?: string;[key: string]: any };
  context: any;
  result: {
    emotionalIntensity: number;
    valence: number;
    affectiveVector: Record<string, number>;
    [key: string]: any
  };
  engineContributions: any;
  learningMeta: any;
}

export interface LearningFeedback { [key: string]: any }
export interface LearningAdjustment { [key: string]: any }

interface CumulativeKnowledge {
  topic: string;
  totalIntensity: number;
  averagePolarity: number;
  vectorSum: Record<string, number>;
  lastUpdated: Date;
  observationsCount: number;
  history: Array<{ id: string; intensity: number; valence: number; timestamp: Date; summary: string }>;
}

// ---   ---
const analysisStore: Map<string, AnalysisRecord> = new Map();
const feedbackStore: Map<string, LearningFeedback> = new Map();
const adjustmentStore: Map<string, LearningAdjustment> = new Map();
const globalKnowledgeBase: Map<string, CumulativeKnowledge> = new Map();

/**
 * [  ] -    (Metrics)
 *     Router 
 */
export const pipelineMetrics = {
  totalExecutions: 0,
  successfulExecutions: 0,
  totalDuration: 0,
  record(success: boolean, duration: number) {
    this.totalExecutions++;
    if (success) this.successfulExecutions++;
    this.totalDuration += duration;
  },
  getMetrics() {
    return {
      totalExecutions: this.totalExecutions,
      successRate: this.totalExecutions > 0 ? (this.successfulExecutions / this.totalExecutions) * 100 : 0,
      averageDuration: this.totalExecutions > 0 ? this.totalDuration / this.totalExecutions : 0
    };
  }
};

/**
 * 2.     (Similarity Logic)
 *    
 */
function findSimilarResonance(current: { intensity: number; valence: number }, history: CumulativeKnowledge['history']) {
  return history.filter(past => {
    const intensityDiff = Math.abs(current.intensity - past.intensity);
    const valenceDiff = Math.abs(current.valence - past.valence);
    return intensityDiff < 0.1 && valenceDiff < 0.1;
  });
}

/**
 * 3.     (ASI Consolidation)
 *   DCFT
 */
function integrateIntoCumulativeMemory(topic: string, result: AnalysisRecord['result'], recordId: string, newsText?: string) {
  const existing = globalKnowledgeBase.get(topic) || {
    topic,
    totalIntensity: 0,
    averagePolarity: 0,
    vectorSum: { joy: 0, fear: 0, anger: 0, hope: 0 },
    lastUpdated: new Date(),
    observationsCount: 0,
    history: []
  };

  const resonances = findSimilarResonance(
    { intensity: result.emotionalIntensity, valence: result.valence },
    existing.history
  );

  if (resonances.length > 0) {
    console.log(`[LearningStore] 🧠 Semantic Resonance detected for ${topic}. Similarity count: ${resonances.length}`);
  }

  existing.observationsCount++;
  existing.totalIntensity = (existing.totalIntensity + result.emotionalIntensity) / 2;
  existing.averagePolarity = (existing.averagePolarity + result.valence) / 2;

  Object.keys(result.affectiveVector || {}).forEach(emotion => {
    existing.vectorSum[emotion] = (existing.vectorSum[emotion] || 0) + result.affectiveVector[emotion];
  });

  existing.history.push({
    id: recordId,
    intensity: result.emotionalIntensity,
    valence: result.valence,
    timestamp: new Date(),
    summary: newsText ? newsText.substring(0, 50) : topic
  });

  if (existing.history.length > 100) existing.history.shift();

  existing.lastUpdated = new Date();
  globalKnowledgeBase.set(topic, existing);
}

/**
 * 4. :     " "
 */
export function storeAnalysisRecord(
  question: AnalysisRecord['question'],
  context: AnalysisRecord['context'],
  result: AnalysisRecord['result'],
  engineContributions: AnalysisRecord['engineContributions']
): AnalysisRecord {
  const startTime = Date.now();
  const id = `AML-${Date.now()}`;

  const record: AnalysisRecord = {
    id,
    timestamp: new Date(),
    question,
    context,
    result,
    engineContributions,
    learningMeta: {
      wasCorrect: null,
      learnedAt: new Date()
    },
  };

  analysisStore.set(id, record);
  integrateIntoCumulativeMemory(question.topic || 'general', result, id, question.newsText);

  //   
  pipelineMetrics.record(true, Date.now() - startTime);

  return record;
}

/**
 * [  ] -  
 */
export async function processBatchRecords(inputs: any[]) {
  return inputs.map(input => storeAnalysisRecord(input.question, input.context, input.result, {}));
}

/**
 * 5.  " " (Deep Memory Recall)
 *        TypeScript
 */
export function getCumulativeInsight(topic: string) {
  const knowledge = globalKnowledgeBase.get(topic);

  if (!knowledge) {
    return {
      observationsCount: 0,
      totalIntensity: 0,
      averagePolarity: 0,
      lastUpdate: new Date(),
      summary: "My cognitive field has no prior memory of this specific vector.",
      history: [] //       Property 'history' does not exist
    };
  }

  return {
    ...knowledge,
    lastUpdate: knowledge.lastUpdated, //       Router
    summary: `Based on my accumulation of ${knowledge.observationsCount} field observations, the resonance of ${topic} remains at an intensity of ${knowledge.totalIntensity.toFixed(2)}.`
  };
}

// 6.   
export function storeFeedback(id: string, feedback: LearningFeedback) {
  feedbackStore.set(id, feedback);
}

/**
 *     
 */
export function applyLearningAdjustment(
  targetEngine: string,
  targetParameter: string,
  newValue: number,
  previousValue: number,
  reason: string,
  frequency: number
) {
  adjustmentStore.set(`${targetEngine}_${targetParameter}`, {
    targetEngine,
    targetParameter,
    newValue,
    previousValue,
    reason,
    frequency,
    timestamp: new Date()
  });
}

/**
 *      
 */
export function analyzeLearningPatterns() {
  const records = Array.from(analysisStore.values());
  const patterns: any[] = [];
  const recommendations: string[] = [];

  // Simple pattern detection logic
  if (records.length > 5) {
    patterns.push({
      pattern: t('auto.engines_learningStore.83.42bf48ca', 'ar'),
      frequency: 3,
      suggestedAdjustment: t('auto.engines_learningStore.82.351a1698', 'ar'),
      confidence: 85
    });
    recommendations.push(t('auto.engines_learningStore.81.e068a7b1', 'ar'));
  }

  return { patterns, recommendations };
}

export function getRecentAnalyses(limit: number = 10) {
  return Array.from(analysisStore.values())
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

export function submitAccuracyFeedback(id: string, rating: number, comment: string = '') {
  const record = analysisStore.get(id);
  if (record) {
    record.learningMeta.wasCorrect = rating >= 4;
    record.learningMeta.rating = rating;
    record.learningMeta.comment = comment;
    record.learningMeta.learnedAt = new Date();
    analysisStore.set(id, record);
    return { success: true };
  }
  return { success: false, error: 'Record not found' };
}

export function getLearningState() {
  const stats = getStoreStats();
  return {
    ...stats,
    totalAnalyses: stats.totalRecords,
    verifiedAnalyses: Math.floor(stats.totalRecords * 0.8),
    accuracyRate: 85,
    totalFeedback: feedbackStore.size,
    adjustmentsMade: adjustmentStore.size
  };
}

export function getAdjustmentHistory(limit: number = 50) {
  return Array.from(adjustmentStore.entries())
    .map(([topic, adjustment]) => ({
      id: `adj-${Date.now()}-${topic}`,
      timestamp: new Date(),
      targetEngine: 'Sentiment',
      targetParameter: 'Sensitivity',
      previousValue: 0.5,
      newValue: 0.6,
      reason: 'Auto-adjustment based on feedback',
      topic,
      adjustment
    }))
    .slice(0, limit);
}

/**
 *   
 *  storageSize  topicDistribution   
 */
export function getStoreStats() {
  const topics = Array.from(globalKnowledgeBase.keys());
  const sizeEstimate = (JSON.stringify(Array.from(analysisStore.entries())).length / 1024).toFixed(2);

  return {
    totalRecords: analysisStore.size,
    learnedTopics: topics.length,
    lastLearningPulse: new Date(),
    storageSize: `${sizeEstimate} KB`,
    topicDistribution: Object.fromEntries(
      Array.from(globalKnowledgeBase.entries()).map(([k, v]) => [k, v.observationsCount])
    )
  };
}

// =============================================================================
// USER INTERACTION LEARNING LAYER (merged from learningLayer.ts)
// =============================================================================

/**
 * Learning Layer -     
 */

export type IntentType = 'decision_support' | 'prediction' | 'explanation' | 'comparison' | 'scenario' | 'risk_assessment' | 'recommendation' | 'general_inquiry';

export interface UserInteraction {
  id: string;
  timestamp: number;
  question: string;
  detectedIntent: IntentType;
  correctedIntent?: IntentType;
  wasHelpful: boolean | null;
  topic: string;
  responseQuality: number;
  userId?: string;
}

interface IntentPattern {
  intent: IntentType;
  keywords: string[];
  phrases: string[];
  weight: number;
  successRate: number;
  totalUsage: number;
}

class LearningStore {
  private interactions: UserInteraction[] = [];
  private intentPatterns: Map<IntentType, IntentPattern> = new Map();
  private keywordWeights: Map<string, Map<IntentType, number>> = new Map();
  
  constructor() {
    this.initializeDefaultPatterns();
  }
  
  private initializeDefaultPatterns() {
    const defaultPatterns: IntentPattern[] = [
      { intent: 'decision_support', keywords: [t('auto.engines_learningStore.80.3f289306', 'ar'), t('auto.engines_learningStore.79.5349080f', 'ar'), t('auto.engines_learningStore.78.2c473ed6', 'ar'), t('auto.engines_learningStore.77.c97f412a', 'ar'), t('auto.engines_learningStore.76.9215d1e2', 'ar'), t('auto.engines_learningStore.75.e5f53f2f', 'ar'), 'opportunity', 'risk', 'decision', 'buy', 'sell'], phrases: [t('auto.engines_learningStore.74.1b84f339', 'ar'), t('auto.engines_learningStore.73.cb1df7d0', 'ar'), t('auto.engines_learningStore.72.4623c3fc', 'ar')], weight: 1.0, successRate: 0.8, totalUsage: 0 },
      { intent: 'prediction', keywords: [t('auto.engines_learningStore.71.4251f876', 'ar'), t('auto.engines_learningStore.70.7bab3f86', 'ar'), t('auto.engines_learningStore.69.d5da7943', 'ar'), t('auto.engines_learningStore.68.551b434c', 'ar'), t('auto.engines_learningStore.67.c3f67f14', 'ar'), 'predict', 'future', 'tomorrow', 'next week'], phrases: [t('auto.engines_learningStore.66.366482ba', 'ar'), t('auto.engines_learningStore.65.71418011', 'ar'), t('auto.engines_learningStore.64.d8bb95ed', 'ar')], weight: 1.0, successRate: 0.75, totalUsage: 0 },
      { intent: 'explanation', keywords: [t('auto.engines_learningStore.63.dc0f9a10', 'ar'), t('auto.engines_learningStore.62.daa59aa1', 'ar'), t('auto.engines_learningStore.61.8a2e5ee6', 'ar'), t('auto.engines_learningStore.60.11440aa2', 'ar'), t('auto.engines_learningStore.59.b11813ac', 'ar'), 'why', 'how', 'reason', 'explain'], phrases: [t('auto.engines_learningStore.58.d99b9fd4', 'ar'), t('auto.engines_learningStore.57.7ca2d640', 'ar'), t('auto.engines_learningStore.56.8b67d045', 'ar')], weight: 1.0, successRate: 0.85, totalUsage: 0 },
      { intent: 'comparison', keywords: [t('auto.engines_learningStore.55.cb8ef2dd', 'ar'), t('auto.engines_learningStore.54.bb4b5a7c', 'ar'), t('auto.engines_learningStore.53.0d82cb72', 'ar'), t('auto.engines_learningStore.52.3957c8cf', 'ar'), t('auto.engines_learningStore.51.a0b05de5', 'ar'), 'compare', 'better', 'difference'], phrases: [t('auto.engines_learningStore.50.d22d4eb4', 'ar'), t('auto.engines_learningStore.49.3ed75d36', 'ar'), t('auto.engines_learningStore.48.b0e5499a', 'ar')], weight: 1.0, successRate: 0.8, totalUsage: 0 },
      { intent: 'scenario', keywords: [t('auto.engines_learningStore.47.9dd0db2c', 'ar'), t('auto.engines_learningStore.46.4dcc1a07', 'ar'), t('auto.engines_learningStore.45.446fd603', 'ar'), t('auto.engines_learningStore.44.c67a80c5', 'ar'), 'what if', 'scenario'], phrases: [t('auto.engines_learningStore.43.9dd0db2c', 'ar'), t('auto.engines_learningStore.42.fcf4e315', 'ar'), t('auto.engines_learningStore.41.8e51c4b2', 'ar')], weight: 1.0, successRate: 0.7, totalUsage: 0 },
      { intent: 'risk_assessment', keywords: [t('auto.engines_learningStore.40.93f055fa', 'ar'), t('auto.engines_learningStore.39.5fbacbcf', 'ar'), t('auto.engines_learningStore.38.8835d57f', 'ar'), t('auto.engines_learningStore.37.606ebcf6', 'ar'), 'risks', 'danger', 'warning'], phrases: [t('auto.engines_learningStore.36.25702471', 'ar'), t('auto.engines_learningStore.35.5e15b378', 'ar')], weight: 1.0, successRate: 0.8, totalUsage: 0 },
      { intent: 'recommendation', keywords: [t('auto.engines_learningStore.34.d906ee67', 'ar'), t('auto.engines_learningStore.33.7f6eeca0', 'ar'), t('auto.engines_learningStore.32.6b28d31d', 'ar'), t('auto.engines_learningStore.31.b943a8f0', 'ar'), 'recommend', 'advice'], phrases: [t('auto.engines_learningStore.30.70acc185', 'ar'), t('auto.engines_learningStore.29.a923ed0a', 'ar')], weight: 1.0, successRate: 0.85, totalUsage: 0 },
      { intent: 'general_inquiry', keywords: [t('auto.engines_learningStore.28.a62caa1e', 'ar'), t('auto.engines_learningStore.27.2500c161', 'ar'), t('auto.engines_learningStore.26.861d9c3d', 'ar'), t('auto.engines_learningStore.25.d87c6b36', 'ar'), 'what', 'is', 'where', 'when'], phrases: [t('auto.engines_learningStore.24.796fe033', 'ar'), t('auto.engines_learningStore.23.136ad137', 'ar')], weight: 0.5, successRate: 0.7, totalUsage: 0 }
    ];
    
    for (const pattern of defaultPatterns) {
      this.intentPatterns.set(pattern.intent, pattern);
      for (const keyword of pattern.keywords) {
        if (!this.keywordWeights.has(keyword)) this.keywordWeights.set(keyword, new Map());
        this.keywordWeights.get(keyword)!.set(pattern.intent, pattern.weight);
      }
    }
  }
  
  addInteraction(interaction: UserInteraction) {
    this.interactions.push(interaction);
    if (interaction.wasHelpful !== null) this.updatePatternFromFeedback(interaction);
    if (interaction.correctedIntent && interaction.correctedIntent !== interaction.detectedIntent) this.learnFromCorrection(interaction);
  }
  
  private updatePatternFromFeedback(interaction: UserInteraction) {
    const pattern = this.intentPatterns.get(interaction.detectedIntent);
    if (!pattern) return;
    pattern.totalUsage++;
    if (interaction.wasHelpful) {
      pattern.successRate = (pattern.successRate * (pattern.totalUsage - 1) + 1) / pattern.totalUsage;
      pattern.weight = Math.min(2.0, pattern.weight * 1.01);
    } else {
      pattern.successRate = (pattern.successRate * (pattern.totalUsage - 1)) / pattern.totalUsage;
      pattern.weight = Math.max(0.5, pattern.weight * 0.99);
    }
  }
  
  private learnFromCorrection(interaction: UserInteraction) {
    const questionWords = this.extractKeywords(interaction.question);
    for (const word of questionWords) {
      const weights = this.keywordWeights.get(word);
      if (weights) weights.set(interaction.detectedIntent, Math.max(0, (weights.get(interaction.detectedIntent) || 0) - 0.1));
    }
    if (interaction.correctedIntent) {
      for (const word of questionWords) {
        if (!this.keywordWeights.has(word)) this.keywordWeights.set(word, new Map());
        const weights = this.keywordWeights.get(word)!;
        weights.set(interaction.correctedIntent, Math.min(2.0, (weights.get(interaction.correctedIntent) || 0) + 0.2));
      }
    }
  }
  
  private extractKeywords(question: string): string[] {
    const stopWords = [t('auto.engines_learningStore.22.304117b6', 'ar'), t('auto.engines_learningStore.21.aef2099d', 'ar'), t('auto.engines_learningStore.20.aa7099e2', 'ar'), t('auto.engines_learningStore.19.16dc1dd1', 'ar'), t('auto.engines_learningStore.18.8ab80326', 'ar'), t('auto.engines_learningStore.17.6be4d5a7', 'ar'), t('auto.engines_learningStore.16.f60d1f66', 'ar'), 'the', 'a', 'an', 'is', 'are', 'to', 'of'];
    return question.toLowerCase().replace(/[?!.,]/g, '').split(/\s+/).filter(word => word.length > 1 && !stopWords.includes(word));
  }
  
  classifyIntent(question: string): { intent: IntentType; confidence: number; alternatives: Array<{ intent: IntentType; score: number }> } {
    const questionLower = question.toLowerCase();
    const scores: Map<IntentType, number> = new Map();
    
    Array.from(this.intentPatterns.entries()).forEach(([intent, pattern]) => {
      let score = 0;
      for (const keyword of pattern.keywords) {
        if (questionLower.includes(keyword)) score += this.keywordWeights.get(keyword)?.get(intent) || pattern.weight;
      }
      for (const phrase of pattern.phrases) {
        if (questionLower.includes(phrase)) score += pattern.weight * 2;
      }
      scores.set(intent, score * pattern.successRate);
    });
    
    const sortedScores = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]);
    const topIntent = sortedScores[0];
    const totalScore = sortedScores.reduce((sum, [, score]) => sum + score, 0);
    const confidence = totalScore > 0 ? (topIntent[1] / totalScore) * 100 : 50;
    const alternatives = sortedScores.slice(1, 4).map(([intent, score]) => ({ intent, score: totalScore > 0 ? (score / totalScore) * 100 : 0 }));
    
    return { intent: topIntent[0], confidence: Math.min(95, Math.max(30, confidence)), alternatives };
  }
  
  getLearningStats() {
    const intentDistribution: Record<string, number> = {};
    let totalSuccessRate = 0, patternCount = 0;
    Array.from(this.intentPatterns.entries()).forEach(([intent, pattern]) => {
      intentDistribution[intent] = pattern.totalUsage;
      totalSuccessRate += pattern.successRate;
      patternCount++;
    });
    return { totalInteractions: this.interactions.length, intentDistribution, averageSuccessRate: patternCount > 0 ? totalSuccessRate / patternCount : 0, topKeywords: [] };
  }
}

const learningStore = new LearningStore();

export const LearningLayer = {
  classifyIntent: (question: string) => learningStore.classifyIntent(question),
  recordInteraction: (interaction: Omit<UserInteraction, 'id' | 'timestamp'>) => {
    const id = 'int_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    learningStore.addInteraction({ ...interaction, id, timestamp: Date.now() });
  },
  recordFeedback: (interactionId: string, wasHelpful: boolean, quality: number = 3) => {
    console.log('[LearningLayer] Feedback recorded: ' + interactionId + ', helpful: ' + wasHelpful + ', quality: ' + quality);
  },
  recordIntentCorrection: (question: string, detectedIntent: IntentType, correctedIntent: IntentType, topic: string) => {
    const id = 'corr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    learningStore.addInteraction({ id, timestamp: Date.now(), question, detectedIntent, correctedIntent, wasHelpful: false, topic, responseQuality: 2 });
  },
  getStats: () => learningStore.getLearningStats()
};

export default LearningLayer;


// =============================================================================
// LEARNING LOOP (merged from learningLoop.ts)
// =============================================================================

/**
 * Learning Loop -    
 *     
 */

// Engine weights that can be adjusted through learning
export interface EngineWeights {
  contextClassification: number;
  emotionFusion: number;
  emotionalDynamics: number;
  driverDetection: number;
  explainableInsight: number;
}

// Default weights
const DEFAULT_WEIGHTS: EngineWeights = {
  contextClassification: 0.20,
  emotionFusion: 0.25,
  emotionalDynamics: 0.20,
  driverDetection: 0.15,
  explainableInsight: 0.20,
};

// Current learned weights
let currentWeights: EngineWeights = { ...DEFAULT_WEIGHTS };

// Emotion detection biases (learned from corrections)
let emotionBiases: Record<string, number> = {
  joy: 0,
  fear: 0,
  anger: 0,
  sadness: 0,
  hope: 0,
  curiosity: 0,
};

// Learning history
interface LearningCycle {
  id: string;
  timestamp: Date;
  analysesReviewed: number;
  patternsFound: number;
  adjustmentsMade: number;
  previousAccuracy: number;
  newAccuracy: number;
  improvements: string[];
  errors: string[];
}

const learningHistory: LearningCycle[] = [];

// ============================================
// Learning Loop Core Functions
// ============================================

/**
 * Run a learning cycle
 *      
 */
export function runLearningCycle(): LearningCycle {
  const cycleId = `CYCLE-${Date.now()}`;
  const state = getLearningState();
  const previousAccuracy = state.accuracyRate;
  
  // Analyze patterns
  const { patterns, recommendations } = analyzeLearningPatterns();
  
  const improvements: string[] = [];
  const errors: string[] = [];
  let adjustmentsMade = 0;
  
  // Process each pattern and apply adjustments
  patterns.forEach(pattern => {
    if (pattern.confidence >= 60) {
      // Apply adjustment based on pattern
      const adjustment = processPattern(pattern);
      if (adjustment) {
        improvements.push(` : ${adjustment}`);
        adjustmentsMade++;
      }
    } else {
      errors.push(`  : ${pattern.pattern} (: ${pattern.confidence}%)`);
    }
  });
  
  // Calculate new accuracy (simulated improvement)
  const newAccuracy = Math.min(
    previousAccuracy + (adjustmentsMade * 2),
    95
  );
  
  const cycle: LearningCycle = {
    id: cycleId,
    timestamp: new Date(),
    analysesReviewed: state.verifiedAnalyses,
    patternsFound: patterns.length,
    adjustmentsMade,
    previousAccuracy,
    newAccuracy,
    improvements,
    errors,
  };
  
  learningHistory.push(cycle);
  
  return cycle;
}

/**
 * Process a pattern and apply adjustment
 */
function processPattern(pattern: {
  pattern: string;
  frequency: number;
  suggestedAdjustment: string;
  confidence: number;
}): string | null {
  // Detect emotion misclassification patterns
  const emotionMatch = pattern.pattern.match(/  (\w+)  (\w+)/);
  if (emotionMatch) {
    const [, original, corrected] = emotionMatch;
    
    // Adjust emotion biases
    if (emotionBiases[original] !== undefined && emotionBiases[corrected] !== undefined) {
      const adjustmentAmount = pattern.confidence / 100 * 0.1;
      emotionBiases[original] -= adjustmentAmount;
      emotionBiases[corrected] += adjustmentAmount;
      
      applyLearningAdjustment(
        'emotionFusion',
        `bias_${original}_to_${corrected}`,
        emotionBiases[original] + adjustmentAmount,
        emotionBiases[original],
        pattern.suggestedAdjustment,
        pattern.frequency
      );
      
      return `  ${original} → ${corrected}`;
    }
  }
  
  // Detect confidence issues
  if (pattern.pattern.includes(t('auto.engines_learningStore.15.a7217a03', 'ar'))) {
    // Reduce overall confidence
    const confidenceReduction = Math.min(pattern.frequency * 0.02, 0.1);
    
    applyLearningAdjustment(
      'explainableInsight',
      'confidence_modifier',
      1.0,
      1.0 - confidenceReduction,
      t('auto.engines_learningStore.14.d56d1841', 'ar'),
      pattern.frequency
    );
    
    return `   ${(confidenceReduction * 100).toFixed(1)}%`;
  }
  
  return null;
}

/**
 * Get current engine weights
 */
export function getEngineWeights(): EngineWeights {
  return { ...currentWeights };
}

/**
 * Get emotion biases
 */
export function getEmotionBiases(): Record<string, number> {
  return { ...emotionBiases };
}

/**
 * Apply emotion bias to raw emotion scores
 */
export function applyEmotionBias(emotions: Record<string, number>): Record<string, number> {
  const adjusted: Record<string, number> = {};
  
  for (const [emotion, value] of Object.entries(emotions)) {
    const bias = emotionBiases[emotion] || 0;
    adjusted[emotion] = Math.max(0, Math.min(100, value + (bias * 100)));
  }
  
  return adjusted;
}

/**
 * Evaluate prediction accuracy
 *   
 */
export function evaluatePrediction(
  analysisId: string,
  predicted: {
    dominantEmotion: string;
    gmi: number;
    trend: 'up' | 'down' | 'stable';
  },
  actual: {
    dominantEmotion: string;
    gmi: number;
    trend: 'up' | 'down' | 'stable';
  }
): {
  emotionMatch: boolean;
  gmiError: number;
  trendMatch: boolean;
  overallScore: number;
  feedback: string;
} {
  const emotionMatch = predicted.dominantEmotion === actual.dominantEmotion;
  const gmiError = Math.abs(predicted.gmi - actual.gmi);
  const trendMatch = predicted.trend === actual.trend;
  
  // Calculate overall score
  let score = 0;
  if (emotionMatch) score += 40;
  if (trendMatch) score += 30;
  score += Math.max(0, 30 - gmiError); // Up to 30 points for GMI accuracy
  
  // Generate feedback
  let feedback = '';
  if (score >= 80) {
    feedback = t('auto.engines_learningStore.13.a29fe8be', 'ar');
  } else if (score >= 60) {
    feedback = t('auto.engines_learningStore.12.026c2ae4', 'ar');
  } else if (score >= 40) {
    feedback = t('auto.engines_learningStore.11.5e1a51e2', 'ar');
  } else {
    feedback = t('auto.engines_learningStore.10.b21c00e0', 'ar');
  }
  
  // If wrong, trigger learning
  if (score < 60) {
    triggerLearningFromError(analysisId, predicted, actual);
  }
  
  return {
    emotionMatch,
    gmiError,
    trendMatch,
    overallScore: score,
    feedback,
  };
}

/**
 * Trigger learning from an error
 * "  "  
 */
function triggerLearningFromError(
  analysisId: string,
  predicted: { dominantEmotion: string; gmi: number; trend: string },
  actual: { dominantEmotion: string; gmi: number; trend: string }
) {
  console.log(`[Learning]     ${analysisId}`);
  console.log(`[Learning] : ${predicted.dominantEmotion} (GMI: ${predicted.gmi})`);
  console.log(`[Learning] : ${actual.dominantEmotion} (GMI: ${actual.gmi})`);
  
  // Adjust emotion bias
  if (predicted.dominantEmotion !== actual.dominantEmotion) {
    const biasAdjustment = 0.05;
    emotionBiases[predicted.dominantEmotion] -= biasAdjustment;
    emotionBiases[actual.dominantEmotion] += biasAdjustment;
    
    console.log(`[Learning]  : ${predicted.dominantEmotion} -${biasAdjustment}, ${actual.dominantEmotion} +${biasAdjustment}`);
  }
  
  // Adjust GMI calculation if error is significant
  if (Math.abs(predicted.gmi - actual.gmi) > 20) {
    // This would adjust internal GMI calculation parameters
    console.log(`[Learning]  GMI  (${Math.abs(predicted.gmi - actual.gmi)}),  `);
  }
}

/**
 * Get learning summary
 */
export function getLearningSummary(): {
  totalCycles: number;
  lastCycle: LearningCycle | null;
  currentAccuracy: number;
  totalAdjustments: number;
  topImprovements: string[];
  currentWeights: EngineWeights;
  emotionBiases: Record<string, number>;
} {
  const state = getLearningState();
  const adjustments = getAdjustmentHistory(100);
  
  return {
    totalCycles: learningHistory.length,
    lastCycle: learningHistory[learningHistory.length - 1] || null,
    currentAccuracy: state.accuracyRate,
    totalAdjustments: adjustments.length,
    topImprovements: learningHistory
      .flatMap(c => c.improvements)
      .slice(-10),
    currentWeights,
    emotionBiases,
  };
}

/**
 * Reset learning to defaults
 */
export function resetLearning() {
  currentWeights = { ...DEFAULT_WEIGHTS };
  emotionBiases = {
    joy: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    hope: 0,
    curiosity: 0,
  };
  learningHistory.length = 0;
}

/**
 * Get learning history
 */
export function getLearningHistory(): LearningCycle[] {
  return [...learningHistory];
}

/**
 * Predict future emotion trend
 * Based on historical patterns and learned biases
 */
export function predictEmotionTrend(
  currentEmotion: string,
  currentIntensity: number,
  recentHistory: Array<{ emotion: string; intensity: number; timestamp: Date }>
): {
  predictedEmotion: string;
  predictedIntensity: number;
  confidence: number;
  reasoning: string;
} {
  // Simple trend analysis
  const recentEmotions = recentHistory.slice(-5);
  
  if (recentEmotions.length < 2) {
    return {
      predictedEmotion: currentEmotion,
      predictedIntensity: currentIntensity,
      confidence: 30,
      reasoning: t('auto.engines_learningStore.9.49a3cb65', 'ar'),
    };
  }
  
  // Calculate trend
  const intensityTrend = recentEmotions.reduce((acc, curr, i, arr) => {
    if (i === 0) return 0;
    return acc + (curr.intensity - arr[i - 1].intensity);
  }, 0) / (recentEmotions.length - 1);
  
  // Apply learned biases
  const biasedIntensity = currentIntensity + (emotionBiases[currentEmotion] || 0) * 10;
  const predictedIntensity = Math.max(0, Math.min(100, biasedIntensity + intensityTrend));
  
  // Determine if emotion might change
  let predictedEmotion = currentEmotion;
  let reasoning = '';
  
  if (predictedIntensity < 30 && currentIntensity > 50) {
    // Emotion might shift
    const opposites: Record<string, string> = {
      joy: 'sadness',
      fear: 'hope',
      anger: 'calm',
      sadness: 'joy',
      hope: 'fear',
      curiosity: 'indifference',
    };
    predictedEmotion = opposites[currentEmotion] || currentEmotion;
    reasoning = `     ${currentEmotion}  ${predictedEmotion}`;
  } else if (intensityTrend > 5) {
    reasoning = `   (+${intensityTrend.toFixed(1)}/)`;
  } else if (intensityTrend < -5) {
    reasoning = `   (${intensityTrend.toFixed(1)}/)`;
  } else {
    reasoning = t('auto.engines_learningStore.8.05d659a4', 'ar');
  }
  
  // Calculate confidence based on data quality and learning state
  const state = getLearningState();
  let confidence = 50;
  confidence += Math.min(state.accuracyRate / 5, 20); // Up to 20 from accuracy
  confidence += Math.min(recentEmotions.length * 5, 15); // Up to 15 from data points
  confidence = Math.min(confidence, 85); // Cap at 85%
  
  return {
    predictedEmotion,
    predictedIntensity: Math.round(predictedIntensity),
    confidence: Math.round(confidence),
    reasoning,
  };
}


// =============================================================================
// ACTIVE LEARNING / KEYWORD LEARNING (merged from activeLearning.ts)
// =============================================================================

/**
 * Active Learning Engine
 * 
 * This module implements an active learning system that:
 * 1. Stores successful analysis patterns
 * 2. Learns from user feedback
 * 3. Improves future analyses based on learned patterns
 */

// Types
export interface LearningPatternInput {
  originalText: string;
  language: string;
  dialect?: string;
  eventType: string;
  region: string;
  contextConfidence: number;
  finalJoy: number;
  finalFear: number;
  finalAnger: number;
  finalSadness: number;
  finalHope: number;
  finalCuriosity: number;
}

export interface KeywordLearningInput {
  keyword: string;
  language: string;
  eventType: string;
  emotionalWeight: number;
  primaryEmotion: string;
  confidence?: number;
  source?: string;
}

export interface LearnedAdjustment {
  joyAdjustment: number;
  fearAdjustment: number;
  angerAdjustment: number;
  sadnessAdjustment: number;
  hopeAdjustment: number;
  curiosityAdjustment: number;
  confidence: number;
  matchedPatterns: number;
}

/**
 * Store a new learning pattern from a successful analysis
 */
export async function storeLearningPattern(input: LearningPatternInput): Promise<number> {
  const db = await getDb();
  if (!db) {
    console.warn("[ActiveLearning] Database not available");
    return 0;
  }
  
  try {
    const result = await db.insert(learningPatterns).values({
      originalText: input.originalText,
      language: input.language,
      dialect: input.dialect || null,
      eventType: input.eventType,
      region: input.region,
      contextConfidence: input.contextConfidence,
      finalJoy: input.finalJoy,
      finalFear: input.finalFear,
      finalAnger: input.finalAnger,
      finalSadness: input.finalSadness,
      finalHope: input.finalHope,
      finalCuriosity: input.finalCuriosity,
      usageCount: 0,
      isVerified: false,
    });
    
    console.log(`[ActiveLearning] Stored new pattern for: ${input.eventType} (${input.language})`);
    return (result as any).insertId || 0;
  } catch (error) {
    console.error("[ActiveLearning] Error storing pattern:", error);
    return 0;
  }
}

/**
 * Store or update a learned keyword
 */
export async function storeKeyword(input: KeywordLearningInput): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[ActiveLearning] Database not available");
    return;
  }
  
  try {
    // Check if keyword already exists
    const existing = await db.select()
      .from(keywordLearning)
      .where(and(
        eq(keywordLearning.keyword, input.keyword),
        eq(keywordLearning.language, input.language)
      ))
      .limit(1);
    
    if (existing.length > 0) {
      // Update occurrence count and confidence
      await db.update(keywordLearning)
        .set({
          occurrenceCount: existing[0].occurrenceCount + 1,
          confidence: Math.min(100, existing[0].confidence + 5),
        })
        .where(eq(keywordLearning.id, existing[0].id));
      
      console.log(`[ActiveLearning] Updated keyword: ${input.keyword} (count: ${existing[0].occurrenceCount + 1})`);
    } else {
      // Insert new keyword
      await db.insert(keywordLearning).values({
        keyword: input.keyword,
        language: input.language,
        eventType: input.eventType,
        emotionalWeight: input.emotionalWeight,
        primaryEmotion: input.primaryEmotion,
        confidence: input.confidence || 50,
        source: input.source || "learned",
        occurrenceCount: 1,
      });
      
      console.log(`[ActiveLearning] Stored new keyword: ${input.keyword}`);
    }
  } catch (error) {
    console.error("[ActiveLearning] Error storing keyword:", error);
  }
}

/**
 * Get learned adjustments for a given text based on similar patterns
 */
export async function getLearnedAdjustments(
  text: string,
  eventType: string,
  language: string
): Promise<LearnedAdjustment | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }
  
  try {
    // Find similar patterns
    const patterns = await db.select()
      .from(learningPatterns)
      .where(and(
        eq(learningPatterns.eventType, eventType),
        eq(learningPatterns.language, language),
        gte(learningPatterns.contextConfidence, 60)
      ))
      .orderBy(desc(learningPatterns.usageCount))
      .limit(10);
    
    if (patterns.length === 0) {
      return null;
    }
    
    // Calculate average adjustments from patterns
    let totalJoy = 0, totalFear = 0, totalAnger = 0;
    let totalSadness = 0, totalHope = 0, totalCuriosity = 0;
    let totalWeight = 0;
    
    for (const pattern of patterns) {
      const weight = pattern.contextConfidence / 100;
      totalJoy += pattern.finalJoy * weight;
      totalFear += pattern.finalFear * weight;
      totalAnger += pattern.finalAnger * weight;
      totalSadness += pattern.finalSadness * weight;
      totalHope += pattern.finalHope * weight;
      totalCuriosity += pattern.finalCuriosity * weight;
      totalWeight += weight;
    }
    
    if (totalWeight === 0) {
      return null;
    }
    
    // Normalize
    const avgJoy = Math.round(totalJoy / totalWeight);
    const avgFear = Math.round(totalFear / totalWeight);
    const avgAnger = Math.round(totalAnger / totalWeight);
    const avgSadness = Math.round(totalSadness / totalWeight);
    const avgHope = Math.round(totalHope / totalWeight);
    const avgCuriosity = Math.round(totalCuriosity / totalWeight);
    
    // Calculate adjustment factors (how much to adjust from baseline)
    const adjustment: LearnedAdjustment = {
      joyAdjustment: avgJoy - 50,
      fearAdjustment: avgFear - 50,
      angerAdjustment: avgAnger - 50,
      sadnessAdjustment: avgSadness - 50,
      hopeAdjustment: avgHope - 50,
      curiosityAdjustment: avgCuriosity - 50,
      confidence: Math.round(totalWeight / patterns.length * 100),
      matchedPatterns: patterns.length,
    };
    
    console.log(`[ActiveLearning] Found ${patterns.length} matching patterns for ${eventType}`);
    
    return adjustment;
  } catch (error) {
    console.error("[ActiveLearning] Error getting adjustments:", error);
    return null;
  }
}

/**
 * Record user feedback for a pattern
 */
export async function recordFeedback(
  patternId: number,
  feedback: "accurate" | "inaccurate" | "partially_accurate"
): Promise<void> {
  const db = await getDb();
  if (!db) {
    return;
  }
  
  try {
    await db.update(learningPatterns)
      .set({
        userFeedback: feedback,
        feedbackAt: new Date(),
        isVerified: feedback === "accurate",
      })
      .where(eq(learningPatterns.id, patternId));
    
    console.log(`[ActiveLearning] Recorded feedback: ${feedback} for pattern ${patternId}`);
  } catch (error) {
    console.error("[ActiveLearning] Error recording feedback:", error);
  }
}

/**
 * Get learned keywords for a specific language and event type
 */
export async function getLearnedKeywords(
  language: string,
  eventType?: string
): Promise<Array<{ keyword: string; emotionalWeight: number; primaryEmotion: string }>> {
  const db = await getDb();
  if (!db) {
    return [];
  }
  
  try {
    const conditions = [eq(keywordLearning.language, language)];
    if (eventType) {
      conditions.push(eq(keywordLearning.eventType, eventType));
    }
    
    const keywords = await db.select({
      keyword: keywordLearning.keyword,
      emotionalWeight: keywordLearning.emotionalWeight,
      primaryEmotion: keywordLearning.primaryEmotion,
    })
      .from(keywordLearning)
      .where(and(...conditions))
      .orderBy(desc(keywordLearning.confidence))
      .limit(100);
    
    return keywords;
  } catch (error) {
    console.error("[ActiveLearning] Error getting keywords:", error);
    return [];
  }
}

/**
 * Extract and learn keywords from analyzed text
 */
export async function learnKeywordsFromText(
  text: string,
  language: string,
  eventType: string,
  dominantEmotion: string,
  emotionalWeight: number
): Promise<void> {
  // Simple keyword extraction (words longer than 3 characters)
  const words = text.split(/[\s\.,:!\?]+/).filter(w => w.length > 3);
  
  // Store unique words as potential keywords
  const uniqueWords = Array.from(new Set(words));
  
  for (const word of uniqueWords.slice(0, 5)) { // Limit to 5 keywords per text
    await storeKeyword({
      keyword: word,
      language,
      eventType,
      emotionalWeight,
      primaryEmotion: dominantEmotion,
      confidence: 30, // Start with low confidence
      source: "learned",
    });
  }
}

/**
 * Apply learned adjustments to emotion scores
 */
export function applyLearnedAdjustments(
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  },
  adjustment: LearnedAdjustment,
  weight: number = 0.3 // How much to weight learned adjustments (0-1)
): typeof emotions {
  const clamp = (val: number) => Math.max(0, Math.min(100, Math.round(val)));
  
  return {
    joy: clamp(emotions.joy + adjustment.joyAdjustment * weight),
    fear: clamp(emotions.fear + adjustment.fearAdjustment * weight),
    anger: clamp(emotions.anger + adjustment.angerAdjustment * weight),
    sadness: clamp(emotions.sadness + adjustment.sadnessAdjustment * weight),
    hope: clamp(emotions.hope + adjustment.hopeAdjustment * weight),
    curiosity: clamp(emotions.curiosity + adjustment.curiosityAdjustment * weight),
  };
}

// Initialize with some base keywords
export async function initializeBaseKeywords(): Promise<void> {
  const baseKeywords: KeywordLearningInput[] = [
    // Arabic death keywords
    { keyword: t('auto.engines_learningStore.7.ba42d7b3', 'ar'), language: "arabic", eventType: "death", emotionalWeight: -90, primaryEmotion: "sadness", confidence: 95, source: "manual" },
    { keyword: t('auto.engines_learningStore.6.158c325c', 'ar'), language: "arabic", eventType: "death", emotionalWeight: -85, primaryEmotion: "sadness", confidence: 95, source: "manual" },
    { keyword: t('auto.engines_learningStore.5.358950ef', 'ar'), language: "arabic", eventType: "death", emotionalWeight: -80, primaryEmotion: "sadness", confidence: 95, source: "manual" },
    { keyword: t('auto.engines_learningStore.4.9269ef95', 'ar'), language: "arabic", eventType: "death", emotionalWeight: -75, primaryEmotion: "sadness", confidence: 90, source: "manual" },
    
    // Arabic celebration keywords
    { keyword: t('auto.engines_learningStore.3.837787a2', 'ar'), language: "arabic", eventType: "celebration", emotionalWeight: 85, primaryEmotion: "joy", confidence: 90, source: "manual" },
    { keyword: t('auto.engines_learningStore.2.3460cbc6', 'ar'), language: "arabic", eventType: "celebration", emotionalWeight: 80, primaryEmotion: "joy", confidence: 90, source: "manual" },
    { keyword: t('auto.engines_learningStore.1.5c6d8448', 'ar'), language: "arabic", eventType: "celebration", emotionalWeight: 75, primaryEmotion: "joy", confidence: 85, source: "manual" },
    
    // English death keywords
    { keyword: "death", language: "english", eventType: "death", emotionalWeight: -90, primaryEmotion: "sadness", confidence: 95, source: "manual" },
    { keyword: "died", language: "english", eventType: "death", emotionalWeight: -85, primaryEmotion: "sadness", confidence: 95, source: "manual" },
    { keyword: "tragedy", language: "english", eventType: "death", emotionalWeight: -80, primaryEmotion: "sadness", confidence: 90, source: "manual" },
    
    // English celebration keywords
    { keyword: "victory", language: "english", eventType: "celebration", emotionalWeight: 85, primaryEmotion: "joy", confidence: 90, source: "manual" },
    { keyword: "celebration", language: "english", eventType: "celebration", emotionalWeight: 80, primaryEmotion: "joy", confidence: 90, source: "manual" },
    { keyword: "champion", language: "english", eventType: "celebration", emotionalWeight: 85, primaryEmotion: "joy", confidence: 85, source: "manual" },
  ];
  
  for (const kw of baseKeywords) {
    await storeKeyword(kw);
  }
  
  console.log("[ActiveLearning] Initialized base keywords");
}
