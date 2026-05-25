/**
 * AmalSense Learning Store
 *
 * Central learning memory for analysis records, feedback, engine weights,
 * user-interaction intent learning, prediction evaluation and keyword learning.
 * It is intentionally deterministic and English-only. It stores operational
 * learning state; the Knowledge Core stores long-term semantic memory.
 */

import { getDb } from '../_core/db';
import { learningPatterns, keywordLearning } from '../drizzle/schema';
import { and, desc, eq, gte } from 'drizzle-orm';

export interface AnalysisRecord {
  id: string;
  timestamp: Date;
  question: { topic: string; newsText?: string; [key: string]: any };
  context: any;
  result: {
    emotionalIntensity: number;
    valence: number;
    affectiveVector: Record<string, number>;
    [key: string]: any;
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

const analysisStore = new Map<string, AnalysisRecord>();
const feedbackStore = new Map<string, LearningFeedback>();
const adjustmentStore = new Map<string, LearningAdjustment>();
const globalKnowledgeBase = new Map<string, CumulativeKnowledge>();

export const pipelineMetrics = {
  totalExecutions: 0,
  successfulExecutions: 0,
  totalDuration: 0,
  record(success: boolean, duration: number) {
    this.totalExecutions += 1;
    if (success) this.successfulExecutions += 1;
    this.totalDuration += duration;
  },
  getMetrics() {
    return {
      totalExecutions: this.totalExecutions,
      successRate: this.totalExecutions > 0 ? (this.successfulExecutions / this.totalExecutions) * 100 : 0,
      averageDuration: this.totalExecutions > 0 ? this.totalDuration / this.totalExecutions : 0,
    };
  },
};

function getOrCreateCumulativeKnowledge(topic: string): CumulativeKnowledge {
  const existing = globalKnowledgeBase.get(topic);
  if (existing) return existing;
  const created: CumulativeKnowledge = {
    topic,
    totalIntensity: 0,
    averagePolarity: 0,
    vectorSum: {},
    lastUpdated: new Date(),
    observationsCount: 0,
    history: [],
  };
  globalKnowledgeBase.set(topic, created);
  return created;
}

function integrateIntoCumulativeMemory(topic: string, result: AnalysisRecord['result'], recordId: string, newsText?: string) {
  const memory = getOrCreateCumulativeKnowledge(topic || 'general');
  memory.observationsCount += 1;
  memory.totalIntensity = memory.observationsCount === 1 ? result.emotionalIntensity : (memory.totalIntensity + result.emotionalIntensity) / 2;
  memory.averagePolarity = memory.observationsCount === 1 ? result.valence : (memory.averagePolarity + result.valence) / 2;
  for (const [emotion, value] of Object.entries(result.affectiveVector || {})) {
    memory.vectorSum[emotion] = (memory.vectorSum[emotion] || 0) + Number(value || 0);
  }
  memory.history.push({ id: recordId, intensity: result.emotionalIntensity, valence: result.valence, timestamp: new Date(), summary: newsText ? newsText.slice(0, 120) : topic });
  if (memory.history.length > 100) memory.history.shift();
  memory.lastUpdated = new Date();
}

export function storeAnalysisRecord(
  question: AnalysisRecord['question'],
  context: AnalysisRecord['context'],
  result: AnalysisRecord['result'],
  engineContributions: AnalysisRecord['engineContributions']
): AnalysisRecord {
  const start = Date.now();
  const id = `AML-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const record: AnalysisRecord = {
    id,
    timestamp: new Date(),
    question,
    context,
    result,
    engineContributions,
    learningMeta: { wasCorrect: null, learnedAt: new Date() },
  };
  analysisStore.set(id, record);
  integrateIntoCumulativeMemory(question.topic || 'general', result, id, question.newsText);
  pipelineMetrics.record(true, Date.now() - start);
  return record;
}

export async function processBatchRecords(inputs: any[]) {
  return inputs.map(input => storeAnalysisRecord(input.question, input.context, input.result, input.engineContributions || {}));
}

export function getCumulativeInsight(topic: string) {
  const memory = globalKnowledgeBase.get(topic);
  if (!memory) {
    return { observationsCount: 0, totalIntensity: 0, averagePolarity: 0, lastUpdate: new Date(), summary: 'No prior cumulative memory for this topic.', history: [] };
  }
  return { ...memory, lastUpdate: memory.lastUpdated, summary: `Observed ${memory.observationsCount} field records for ${topic}; average intensity ${memory.totalIntensity.toFixed(2)}.` };
}

export function storeFeedback(id: string, feedback: LearningFeedback) {
  feedbackStore.set(id, feedback);
}

export function applyLearningAdjustment(targetEngine: string, targetParameter: string, newValue: number, previousValue: number, reason: string, frequency: number) {
  adjustmentStore.set(`${targetEngine}_${targetParameter}`, { targetEngine, targetParameter, newValue, previousValue, reason, frequency, timestamp: new Date() });
}

export function analyzeLearningPatterns() {
  const patterns: Array<{ pattern: string; confidence: number; suggestedAdjustment: string }> = [];
  const recommendations: string[] = [];
  const records = [...analysisStore.values()];
  if (records.length > 10) {
    const avgIntensity = records.reduce((sum, record) => sum + Number(record.result.emotionalIntensity || 0), 0) / records.length;
    if (avgIntensity > 0.75) patterns.push({ pattern: 'high_intensity_bias', confidence: 0.7, suggestedAdjustment: 'Review source weighting and fear amplification.' });
  }
  if (feedbackStore.size === 0) recommendations.push('Collect more human feedback to improve calibration.');
  return { patterns, recommendations };
}

export function getRecentAnalyses(limit: number = 10) {
  return [...analysisStore.values()].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
}

export function submitAccuracyFeedback(id: string, rating: number, comment: string = '') {
  const record = analysisStore.get(id);
  if (record) record.learningMeta.wasCorrect = rating >= 4;
  storeFeedback(id, { rating, comment, type: 'accuracy', timestamp: new Date() });
  return { success: true, id, rating };
}

export function getLearningState() {
  const total = analysisStore.size;
  const feedback = [...feedbackStore.values()];
  const positive = feedback.filter(item => Number(item.rating || 0) >= 4).length;
  return { totalAnalyses: total, totalFeedback: feedback.length, accuracyRate: feedback.length ? (positive / feedback.length) * 100 : 0, cumulativeTopics: globalKnowledgeBase.size, verifiedAnalyses: positive, adjustmentsMade: adjustmentStore.size };
}

export function getAdjustmentHistory(limit: number = 50) {
  return [...adjustmentStore.values()].slice(-limit);
}

export function getStoreStats() {
  const topicDistribution: Record<string, number> = {};
  for (const record of analysisStore.values()) topicDistribution[record.question.topic] = (topicDistribution[record.question.topic] || 0) + 1;
  return { totalRecords: analysisStore.size, storageSize: `${JSON.stringify([...analysisStore.values()]).length} bytes`, topicDistribution, cumulativeTopics: globalKnowledgeBase.size };
}

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

class InteractionLearningStore {
  private interactions: UserInteraction[] = [];
  private patterns: IntentPattern[] = [
    { intent: 'decision_support', keywords: ['opportunity', 'risk', 'decision', 'buy', 'sell', 'invest'], phrases: ['should i', 'what should i do'], weight: 1, successRate: 0.8, totalUsage: 0 },
    { intent: 'prediction', keywords: ['predict', 'future', 'tomorrow', 'next week', 'forecast'], phrases: ['what will happen', 'what is the outlook'], weight: 1, successRate: 0.75, totalUsage: 0 },
    { intent: 'explanation', keywords: ['why', 'how', 'reason', 'explain'], phrases: ['why is', 'how does'], weight: 1, successRate: 0.85, totalUsage: 0 },
    { intent: 'comparison', keywords: ['compare', 'better', 'difference', 'versus'], phrases: ['compare between', 'which is better'], weight: 1, successRate: 0.8, totalUsage: 0 },
    { intent: 'scenario', keywords: ['what if', 'scenario'], phrases: ['what happens if'], weight: 1, successRate: 0.7, totalUsage: 0 },
    { intent: 'risk_assessment', keywords: ['risk', 'danger', 'warning'], phrases: ['what are the risks'], weight: 1, successRate: 0.8, totalUsage: 0 },
    { intent: 'recommendation', keywords: ['recommend', 'advice'], phrases: ['what do you recommend'], weight: 1, successRate: 0.85, totalUsage: 0 },
    { intent: 'general_inquiry', keywords: ['what', 'is', 'where', 'when'], phrases: ['what is'], weight: 0.5, successRate: 0.7, totalUsage: 0 },
  ];

  classifyIntent(question: string): IntentType {
    const lower = question.toLowerCase();
    let best: { intent: IntentType; score: number } = { intent: 'general_inquiry', score: 0 };
    for (const pattern of this.patterns) {
      const score = pattern.keywords.filter(keyword => lower.includes(keyword)).length + pattern.phrases.filter(phrase => lower.includes(phrase)).length * 2;
      if (score > best.score) best = { intent: pattern.intent, score };
    }
    return best.intent;
  }

  addInteraction(interaction: UserInteraction) {
    this.interactions.push(interaction);
    if (this.interactions.length > 1000) this.interactions.shift();
  }

  getLearningStats() {
    return { totalInteractions: this.interactions.length, patterns: this.patterns.length };
  }
}

const interactionLearningStore = new InteractionLearningStore();

export const LearningLayer = {
  classifyIntent: (question: string) => interactionLearningStore.classifyIntent(question),
  recordInteraction: (interaction: Omit<UserInteraction, 'id' | 'timestamp'>) => {
    const id = `interaction_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    interactionLearningStore.addInteraction({ ...interaction, id, timestamp: Date.now() });
    return id;
  },
  recordCorrection: (question: string, detectedIntent: IntentType, correctedIntent: IntentType, topic: string) => {
    const id = `correction_${Date.now()}`;
    interactionLearningStore.addInteraction({ id, timestamp: Date.now(), question, detectedIntent, correctedIntent, wasHelpful: false, topic, responseQuality: 2 });
    return id;
  },
  getStats: () => interactionLearningStore.getLearningStats(),
};

export interface EngineWeights {
  contextClassification: number;
  emotionFusion: number;
  emotionalDynamics: number;
  driverDetection: number;
  explainableInsight: number;
}

const DEFAULT_WEIGHTS: EngineWeights = { contextClassification: 0.2, emotionFusion: 0.25, emotionalDynamics: 0.2, driverDetection: 0.15, explainableInsight: 0.2 };
let currentWeights: EngineWeights = { ...DEFAULT_WEIGHTS };
let emotionBiases: Record<string, number> = { joy: 0, fear: 0, anger: 0, sadness: 0, hope: 0, curiosity: 0 };

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

export function runLearningCycle(): LearningCycle {
  const state = getLearningState();
  const patterns = analyzeLearningPatterns();
  const cycle: LearningCycle = { id: `cycle_${Date.now()}`, timestamp: new Date(), analysesReviewed: analysisStore.size, patternsFound: patterns.patterns.length, adjustmentsMade: 0, previousAccuracy: state.accuracyRate, newAccuracy: state.accuracyRate, improvements: patterns.recommendations, errors: [] };
  learningHistory.push(cycle);
  return cycle;
}

export function getEngineWeights(): EngineWeights { return { ...currentWeights }; }
export function getEmotionBiases(): Record<string, number> { return { ...emotionBiases }; }
export function applyEmotionBias(emotions: Record<string, number>): Record<string, number> {
  return Object.fromEntries(Object.entries(emotions).map(([emotion, value]) => [emotion, Number(value || 0) + (emotionBiases[emotion] || 0)]));
}

export function evaluatePrediction(id: string, predicted: number, actual: number, tolerance: number = 10) {
  const error = Math.abs(predicted - actual);
  const accurate = error <= tolerance;
  storeFeedback(id, { type: 'prediction', predicted, actual, error, accurate, timestamp: new Date() });
  return { accurate, error, tolerance };
}

export function getLearningSummary() { return { state: getLearningState(), weights: currentWeights, emotionBiases, history: learningHistory.slice(-10) }; }
export function resetLearning() { currentWeights = { ...DEFAULT_WEIGHTS }; emotionBiases = { joy: 0, fear: 0, anger: 0, sadness: 0, hope: 0, curiosity: 0 }; learningHistory.length = 0; }
export function getLearningHistory(): LearningCycle[] { return [...learningHistory]; }
export function predictEmotionTrend(emotion: string) { return { emotion, direction: 'stable' as const, confidence: 0.5 }; }

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

export async function storeLearningPattern(input: LearningPatternInput): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.insert(learningPatterns).values({ ...input, dialect: input.dialect || null, usageCount: 0, isVerified: false });
  return Number((result as any).lastInsertRowid ?? 0);
}

export async function storeKeyword(input: KeywordLearningInput): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(keywordLearning).where(and(eq(keywordLearning.keyword, input.keyword), eq(keywordLearning.language, input.language))).limit(1);
  if (existing.length) {
    await db.update(keywordLearning).set({ occurrenceCount: existing[0].occurrenceCount + 1, confidence: Math.min(100, existing[0].confidence + 5) }).where(eq(keywordLearning.id, existing[0].id));
  } else {
    await db.insert(keywordLearning).values({ ...input, confidence: input.confidence || 50, source: input.source || 'learned', occurrenceCount: 1 });
  }
}

export async function getLearnedAdjustments(language: string, eventType: string, region?: string): Promise<LearnedAdjustment | null> {
  const db = await getDb();
  if (!db) return null;
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const patterns = await db.select().from(learningPatterns).where(and(eq(learningPatterns.language, language), eq(learningPatterns.eventType, eventType), gte(learningPatterns.createdAt, since))).orderBy(desc(learningPatterns.contextConfidence)).limit(20);
  if (!patterns.length) return null;
  const avg = (key: keyof typeof patterns[number]) => patterns.reduce((sum, pattern: any) => sum + Number(pattern[key] || 0), 0) / patterns.length;
  return {
    joyAdjustment: avg('finalJoy') - 50,
    fearAdjustment: avg('finalFear') - 50,
    angerAdjustment: avg('finalAnger') - 50,
    sadnessAdjustment: avg('finalSadness') - 50,
    hopeAdjustment: avg('finalHope') - 50,
    curiosityAdjustment: avg('finalCuriosity') - 50,
    confidence: avg('contextConfidence'),
    matchedPatterns: patterns.length,
  };
}

export async function recordFeedback(patternId: number, feedback: 'accurate' | 'inaccurate' | 'partially_accurate'): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(learningPatterns).set({ userFeedback: feedback, feedbackAt: new Date(), isVerified: feedback === 'accurate' }).where(eq(learningPatterns.id, patternId));
}

export async function getLearnedKeywords(language: string, eventType?: string): Promise<Array<{ keyword: string; emotionalWeight: number; primaryEmotion: string }>> {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(keywordLearning.language, language)];
  if (eventType) conditions.push(eq(keywordLearning.eventType, eventType));
  return db.select({ keyword: keywordLearning.keyword, emotionalWeight: keywordLearning.emotionalWeight, primaryEmotion: keywordLearning.primaryEmotion }).from(keywordLearning).where(and(...conditions)).orderBy(desc(keywordLearning.confidence)).limit(100);
}

export async function learnKeywordsFromText(text: string, language: string, eventType: string, emotion: string): Promise<void> {
  for (const keyword of text.toLowerCase().match(/[\p{L}\p{N}_]+/gu)?.filter(word => word.length > 3).slice(0, 20) || []) {
    await storeKeyword({ keyword, language, eventType, emotionalWeight: 10, primaryEmotion: emotion, confidence: 40, source: 'text_learning' });
  }
}

export function applyLearnedAdjustments(emotions: Record<string, number>, adjustment: LearnedAdjustment | null): Record<string, number> {
  if (!adjustment) return emotions;
  return {
    ...emotions,
    joy: Number(emotions.joy || 0) + adjustment.joyAdjustment,
    fear: Number(emotions.fear || 0) + adjustment.fearAdjustment,
    anger: Number(emotions.anger || 0) + adjustment.angerAdjustment,
    sadness: Number(emotions.sadness || 0) + adjustment.sadnessAdjustment,
    hope: Number(emotions.hope || 0) + adjustment.hopeAdjustment,
    curiosity: Number(emotions.curiosity || 0) + adjustment.curiosityAdjustment,
  };
}

export async function initializeBaseKeywords(): Promise<void> {
  const baseKeywords: KeywordLearningInput[] = [
    { keyword: 'death', language: 'english', eventType: 'death', emotionalWeight: -90, primaryEmotion: 'sadness', confidence: 95, source: 'base' },
    { keyword: 'crisis', language: 'english', eventType: 'crisis', emotionalWeight: -70, primaryEmotion: 'fear', confidence: 90, source: 'base' },
    { keyword: 'success', language: 'english', eventType: 'achievement', emotionalWeight: 70, primaryEmotion: 'joy', confidence: 90, source: 'base' },
    { keyword: 'recovery', language: 'english', eventType: 'recovery', emotionalWeight: 65, primaryEmotion: 'hope', confidence: 90, source: 'base' },
  ];
  for (const keyword of baseKeywords) await storeKeyword(keyword);
}

export default LearningLayer;
