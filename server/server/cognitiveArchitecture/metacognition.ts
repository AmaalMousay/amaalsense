/**
 * Metacognition Layer
 *
 * Self-monitoring and self-evaluation for AmalSense. This layer watches model
 * confidence, data sufficiency, reasoning quality, errors, learning rate and
 * response quality. It produces internal diagnostics and does not generate final
 * user-facing answers.
 */

import crypto from 'crypto';
import { avg, desc, sql } from 'drizzle-orm';
import { getDb } from '../_core/db';
import { selfEvaluations } from '../drizzle/schema';

export interface PerformanceMetrics {
  predictionAccuracy: number;
  responseCoherence: number;
  userSatisfaction: number;
  processingTime: number;
  memoryUsage: number;
}

export interface ConfidenceCalibration {
  predictedConfidence: number;
  actualAccuracy: number;
  calibrationError: number;
  needsAdjustment: boolean;
}

export interface ErrorReport {
  timestamp: number;
  errorType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  context?: Record<string, unknown>;
}

export interface LearningRateConfig {
  currentRate: number;
  optimalRate: number;
  adjustmentNeeded: boolean;
  reason: string;
}

export interface SystemHealthReport {
  timestamp: number;
  overallHealth: number;
  performance: PerformanceMetrics;
  confidence: ConfidenceCalibration;
  errors: ErrorReport[];
  learningRate: LearningRateConfig;
  recommendations: string[];
}

export interface MetacognitionState {
  performanceHistory: PerformanceMetrics[];
  confidenceHistory: ConfidenceCalibration[];
  errorHistory: ErrorReport[];
  learningRateHistory: number[];
  maxHistorySize: number;
}

export interface DataQualityAssessment {
  score: number;
  factors: {
    recency: number;
    completeness: number;
    reliability: number;
    relevance: number;
  };
  issues: string[];
}

export interface ReasoningQualityAssessment {
  score: number;
  factors: {
    logicalCoherence: number;
    evidenceSupport: number;
    alternativesConsidered: number;
    uncertaintyAcknowledged: number;
  };
  issues: string[];
}

export type BiasType =
  | 'recency_bias'
  | 'confirmation_bias'
  | 'availability_bias'
  | 'anchoring_bias'
  | 'optimism_bias'
  | 'pessimism_bias'
  | 'herd_mentality'
  | 'data_insufficiency';

export interface DetectedBias {
  type: BiasType;
  description: string;
  severity: 'low' | 'medium' | 'high';
  mitigation?: string;
}

export interface MetacognitiveAssessment {
  overallConfidence: number;
  confidenceLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  dataQuality: DataQualityAssessment;
  reasoningQuality: ReasoningQualityAssessment;
  biases: DetectedBias[];
  limitations: string[];
  suggestions: string[];
  needsMoreInfo: boolean;
  infoNeeded?: string[];
  selfCritique: string;
}

export interface SelfEvaluationInput {
  question: string;
  response: string;
  confidence?: number;
  newsSourcesCount: number;
  relevantHeadlinesCount: number;
  causesFromData: boolean;
  analysisVsNarration?: 'analysis' | 'narration' | 'mixed';
  hasSpecificExamples?: boolean;
  avoidsHallucination?: boolean;
  [key: string]: unknown;
}

export interface SelfEvaluationResult {
  questionHash: string;
  confidenceScore: number;
  dataSufficiencyScore: number;
  causesFromDataScore: number;
  analysisVsNarrationScore: number;
  overallScore: number;
  identifiedWeaknesses: string[];
  identifiedStrengths: string[];
  improvementSuggestions: string[];
}

export interface SelfEvaluationSummary {
  totalEvaluations: number;
  averageConfidence: number;
  averageDataSufficiency: number;
  averageCausesFromData: number;
  averageAnalysisVsNarration: number;
  averageOverall: number;
  commonWeaknesses: string[];
  commonStrengths: string[];
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function average(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function initMetacognition(): MetacognitionState {
  return { performanceHistory: [], confidenceHistory: [], errorHistory: [], learningRateHistory: [0.01], maxHistorySize: 100 };
}

export function trackPerformance(state: MetacognitionState, metrics: PerformanceMetrics): MetacognitionState {
  return { ...state, performanceHistory: [...state.performanceHistory, metrics].slice(-state.maxHistorySize) };
}

export function calibrateConfidence(state: MetacognitionState, predictedConfidence: number, actualAccuracy: number): MetacognitionState {
  const calibration: ConfidenceCalibration = {
    predictedConfidence,
    actualAccuracy,
    calibrationError: Math.abs(predictedConfidence - actualAccuracy),
    needsAdjustment: Math.abs(predictedConfidence - actualAccuracy) > 0.15,
  };
  return { ...state, confidenceHistory: [...state.confidenceHistory, calibration].slice(-state.maxHistorySize) };
}

export function detectError(state: MetacognitionState, error: Omit<ErrorReport, 'timestamp'>): MetacognitionState {
  return { ...state, errorHistory: [...state.errorHistory, { ...error, timestamp: Date.now() }].slice(-state.maxHistorySize) };
}

export function optimizeLearningRate(state: MetacognitionState): { state: MetacognitionState; config: LearningRateConfig } {
  const currentRate = state.learningRateHistory[state.learningRateHistory.length - 1] || 0.01;
  const recent = state.performanceHistory.slice(-20);
  const accuracy = average(recent.map(item => item.predictionAccuracy));
  let optimalRate = currentRate;
  let reason = 'Learning rate is stable.';
  if (recent.length >= 5 && accuracy < 0.6) {
    optimalRate = Math.min(currentRate * 1.5, 0.1);
    reason = 'Recent accuracy is low; increasing learning rate.';
  } else if (recent.length >= 5 && accuracy > 0.9) {
    optimalRate = Math.max(currentRate * 0.8, 0.001);
    reason = 'Recent accuracy is high; lowering learning rate for stability.';
  }
  const updated = { ...state, learningRateHistory: [...state.learningRateHistory, optimalRate].slice(-state.maxHistorySize) };
  return { state: updated, config: { currentRate, optimalRate, adjustmentNeeded: optimalRate !== currentRate, reason } };
}

export function generateHealthReport(state: MetacognitionState): SystemHealthReport {
  const recentPerformance = state.performanceHistory.slice(-10);
  const recentErrors = state.errorHistory.filter(error => Date.now() - error.timestamp < 24 * 60 * 60 * 1000);
  const performance = recentPerformance[recentPerformance.length - 1] || { predictionAccuracy: 0, responseCoherence: 0, userSatisfaction: 0, processingTime: 0, memoryUsage: 0 };
  const confidence = state.confidenceHistory[state.confidenceHistory.length - 1] || { predictedConfidence: 0, actualAccuracy: 0, calibrationError: 0, needsAdjustment: false };
  const { config: learningRate } = optimizeLearningRate(state);
  const critical = recentErrors.filter(error => error.severity === 'critical').length;
  const high = recentErrors.filter(error => error.severity === 'high').length;
  let overallHealth = 100;
  if (recentPerformance.length) overallHealth -= Math.max(0, 0.8 - average(recentPerformance.map(item => item.predictionAccuracy))) * 60;
  overallHealth -= critical * 20 + high * 10;
  overallHealth = Math.round(clamp(overallHealth));
  const recommendations: string[] = [];
  if (overallHealth < 70) recommendations.push('Review recent errors and data quality before relying on outputs.');
  if (confidence.needsAdjustment) recommendations.push('Confidence calibration needs adjustment.');
  if (learningRate.adjustmentNeeded) recommendations.push(learningRate.reason);
  if (recommendations.length === 0) recommendations.push('System health is acceptable. Continue monitoring.');
  return { timestamp: Date.now(), overallHealth, performance, confidence, errors: recentErrors, learningRate, recommendations };
}

export function analyzePerformanceTrends(state: MetacognitionState, windowSize: number = 20): { trend: 'improving' | 'stable' | 'declining'; changeRate: number; confidence: number } {
  const recent = state.performanceHistory.slice(-windowSize);
  if (recent.length < 5) return { trend: 'stable', changeRate: 0, confidence: 0 };
  const first = average(recent.slice(0, Math.floor(recent.length / 2)).map(item => item.predictionAccuracy));
  const second = average(recent.slice(Math.floor(recent.length / 2)).map(item => item.predictionAccuracy));
  const changeRate = second - first;
  return { trend: changeRate > 0.03 ? 'improving' : changeRate < -0.03 ? 'declining' : 'stable', changeRate, confidence: Math.min(1, Math.abs(changeRate) * 5) };
}

export function getErrorStatistics(state: MetacognitionState, timeWindow: number = 7 * 24 * 60 * 60 * 1000): { totalErrors: number; errorsByType: Record<string, number>; errorsBySeverity: Record<string, number>; mostCommonError: string | null } {
  const recent = state.errorHistory.filter(error => Date.now() - error.timestamp < timeWindow);
  const errorsByType: Record<string, number> = {};
  const errorsBySeverity: Record<string, number> = {};
  for (const error of recent) {
    errorsByType[error.errorType] = (errorsByType[error.errorType] || 0) + 1;
    errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1;
  }
  const mostCommonError = Object.entries(errorsByType).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  return { totalErrors: recent.length, errorsByType, errorsBySeverity, mostCommonError };
}

function assessDataQuality(context: { dataSourcesCount: number; relevantHeadlinesCount: number; dataAge?: number; sourceReliability?: number }): DataQualityAssessment {
  const factors = {
    recency: context.dataAge === undefined ? 0.7 : clamp(1 - context.dataAge / (24 * 60 * 60 * 1000), 0, 1),
    completeness: clamp(context.relevantHeadlinesCount / 10, 0, 1),
    reliability: context.sourceReliability ?? 0.6,
    relevance: context.dataSourcesCount > 0 ? 0.75 : 0.25,
  };
  const score = average(Object.values(factors));
  const issues: string[] = [];
  if (context.dataSourcesCount === 0) issues.push('No data sources were available.');
  if (context.relevantHeadlinesCount < 3) issues.push('Few relevant evidence items were available.');
  return { score, factors, issues };
}

function assessReasoningQuality(context: { hasCausalChain?: boolean; hasEvidence?: boolean; acknowledgesUncertainty?: boolean; alternativesConsidered?: boolean }): ReasoningQualityAssessment {
  const factors = {
    logicalCoherence: context.hasCausalChain ? 0.8 : 0.5,
    evidenceSupport: context.hasEvidence ? 0.8 : 0.4,
    alternativesConsidered: context.alternativesConsidered ? 0.8 : 0.4,
    uncertaintyAcknowledged: context.acknowledgesUncertainty ? 0.85 : 0.35,
  };
  const score = average(Object.values(factors));
  const issues: string[] = [];
  if (!context.hasEvidence) issues.push('Reasoning lacks explicit evidence support.');
  if (!context.acknowledgesUncertainty) issues.push('Uncertainty should be stated more clearly.');
  return { score, factors, issues };
}

function detectBiases(context: { dataSourcesCount: number; question?: string; recentOnly?: boolean; sentimentSkew?: number }): DetectedBias[] {
  const biases: DetectedBias[] = [];
  if (context.dataSourcesCount < 2) biases.push({ type: 'data_insufficiency', description: 'Too few sources can bias interpretation.', severity: 'high', mitigation: 'Collect more independent sources.' });
  if (context.recentOnly) biases.push({ type: 'recency_bias', description: 'Recent events may be overweighted.', severity: 'medium', mitigation: 'Compare against historical memory.' });
  if ((context.sentimentSkew || 0) > 0.7) biases.push({ type: 'herd_mentality', description: 'Sentiment is highly one-sided.', severity: 'medium', mitigation: 'Check source diversity and counter-evidence.' });
  return biases;
}

function confidenceLevel(score: number): MetacognitiveAssessment['confidenceLevel'] {
  if (score >= 0.85) return 'very_high';
  if (score >= 0.7) return 'high';
  if (score >= 0.5) return 'medium';
  if (score >= 0.3) return 'low';
  return 'very_low';
}

export function assessAnalysis(context: { dataSourcesCount: number; relevantHeadlinesCount: number; dataAge?: number; sourceReliability?: number; hasCausalChain?: boolean; hasEvidence?: boolean; acknowledgesUncertainty?: boolean; alternativesConsidered?: boolean; question?: string; recentOnly?: boolean; sentimentSkew?: number }): MetacognitiveAssessment {
  const dataQuality = assessDataQuality(context);
  const reasoningQuality = assessReasoningQuality(context);
  const biases = detectBiases(context);
  const limitations = [...dataQuality.issues, ...reasoningQuality.issues, ...biases.map(bias => bias.description)];
  const suggestions = limitations.length ? ['Improve evidence diversity and explicitly state uncertainty.'] : ['Current analysis is adequately grounded.'];
  const overallConfidence = clamp((dataQuality.score * 0.55 + reasoningQuality.score * 0.45) - biases.length * 0.08, 0, 1);
  return { overallConfidence, confidenceLevel: confidenceLevel(overallConfidence), dataQuality, reasoningQuality, biases, limitations, suggestions, needsMoreInfo: dataQuality.score < 0.45, infoNeeded: dataQuality.score < 0.45 ? ['More independent data sources'] : undefined, selfCritique: limitations.join(' ') || 'Analysis is coherent and sufficiently grounded.' };
}

export function getConfidenceIndicator(assessment: MetacognitiveAssessment): { emoji: string; label: string; color: string } {
  const map = {
    very_high: { emoji: '🟢', label: 'Very high', color: 'green' },
    high: { emoji: '🟢', label: 'High', color: 'green' },
    medium: { emoji: '🟡', label: 'Medium', color: 'yellow' },
    low: { emoji: '🟠', label: 'Low', color: 'orange' },
    very_low: { emoji: '🔴', label: 'Very low', color: 'red' },
  };
  return map[assessment.confidenceLevel];
}

export function formatAssessmentForDisplay(assessment: MetacognitiveAssessment): string {
  const indicator = getConfidenceIndicator(assessment);
  const parts = [`${indicator.emoji} Confidence: ${indicator.label} (${Math.round(assessment.overallConfidence * 100)}%)`];
  if (assessment.limitations.length) parts.push(`Limitations: ${assessment.limitations.join('; ')}`);
  if (assessment.suggestions.length) parts.push(`Suggestions: ${assessment.suggestions.join('; ')}`);
  return parts.join('\n');
}

export function shouldShowConfidence(assessment: MetacognitiveAssessment): boolean {
  return assessment.overallConfidence < 0.75 || assessment.biases.length > 0 || assessment.needsMoreInfo;
}

export function evaluateSelf(input: SelfEvaluationInput): SelfEvaluationResult {
  const questionHash = crypto.createHash('sha1').update(input.question).digest('hex');
  const confidenceScore = clamp((input.confidence ?? Number(input.confidenceLevel ?? 0.65)) * 100);
  const dataSufficiencyScore = clamp(input.newsSourcesCount * 20 + input.relevantHeadlinesCount * 8);
  const causesFromDataScore = input.causesFromData ? 90 : 35;
  const mode = input.analysisVsNarration || (input.madeDecision ? 'analysis' : 'mixed');
  const analysisVsNarrationScore = mode === 'analysis' ? 90 : mode === 'mixed' ? 65 : 35;
  const overallScore = Math.round(average([confidenceScore, dataSufficiencyScore, causesFromDataScore, analysisVsNarrationScore]));
  const identifiedWeaknesses: string[] = [];
  const identifiedStrengths: string[] = [];
  const improvementSuggestions: string[] = [];
  if (confidenceScore < 55) { identifiedWeaknesses.push('low_confidence'); improvementSuggestions.push('Use stronger evidence or state uncertainty.'); }
  else identifiedStrengths.push('confidence_ok');
  if (dataSufficiencyScore < 55) { identifiedWeaknesses.push('insufficient_data'); improvementSuggestions.push('Collect more sources before analysis.'); }
  else identifiedStrengths.push('data_sufficient');
  if (!input.causesFromData) { identifiedWeaknesses.push('weak_causality'); improvementSuggestions.push('Ground causes in observed evidence.'); }
  if (mode === 'narration') { identifiedWeaknesses.push('too_much_narration'); improvementSuggestions.push('Prefer analysis over decorative prose.'); }
  return { questionHash, confidenceScore, dataSufficiencyScore, causesFromDataScore, analysisVsNarrationScore, overallScore, identifiedWeaknesses, identifiedStrengths, improvementSuggestions };
}

export async function saveSelfEvaluation(input: SelfEvaluationInput, evaluation: SelfEvaluationResult): Promise<{ success: boolean; id?: number }> {
  try {
    const db = await getDb();
    if (!db) return { success: false };
    const result = await db.insert(selfEvaluations).values({
      questionHash: evaluation.questionHash,
      question: input.question,
      confidenceScore: evaluation.confidenceScore,
      dataSufficiencyScore: evaluation.dataSufficiencyScore,
      causesFromDataScore: evaluation.causesFromDataScore,
      analysisVsNarrationScore: evaluation.analysisVsNarrationScore,
      overallScore: evaluation.overallScore,
      identifiedWeaknesses: JSON.stringify(evaluation.identifiedWeaknesses),
      identifiedStrengths: JSON.stringify(evaluation.identifiedStrengths),
      improvementSuggestions: JSON.stringify(evaluation.improvementSuggestions),
      newsSourcesCount: input.newsSourcesCount,
      relevantHeadlinesCount: input.relevantHeadlinesCount,
    });
    return { success: true, id: Number((result as any).lastInsertRowid ?? 0) };
  } catch {
    return { success: false };
  }
}

export async function evaluateAndSave(input: SelfEvaluationInput): Promise<SelfEvaluationResult> {
  const evaluation = evaluateSelf(input);
  await saveSelfEvaluation(input, evaluation);
  return evaluation;
}

function parseJsonArray(value: unknown): string[] {
  try {
    const parsed = JSON.parse(String(value || '[]'));
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export async function getSelfEvaluationSummary(): Promise<SelfEvaluationSummary> {
  const db = await getDb();
  if (!db) return { totalEvaluations: 0, averageConfidence: 0, averageDataSufficiency: 0, averageCausesFromData: 0, averageAnalysisVsNarration: 0, averageOverall: 0, commonWeaknesses: [], commonStrengths: [] };
  const [stats] = await db.select({ avgConfidence: avg(selfEvaluations.confidenceScore), avgDataSufficiency: avg(selfEvaluations.dataSufficiencyScore), avgCausesFromData: avg(selfEvaluations.causesFromDataScore), avgAnalysisVsNarration: avg(selfEvaluations.analysisVsNarrationScore), avgOverall: avg(selfEvaluations.overallScore), total: sql<number>`COUNT(*)` }).from(selfEvaluations);
  const recent = await db.select({ weaknesses: selfEvaluations.identifiedWeaknesses, strengths: selfEvaluations.identifiedStrengths }).from(selfEvaluations).orderBy(desc(selfEvaluations.createdAt)).limit(50);
  return {
    totalEvaluations: Number(stats?.total || 0),
    averageConfidence: Number(stats?.avgConfidence || 0),
    averageDataSufficiency: Number(stats?.avgDataSufficiency || 0),
    averageCausesFromData: Number(stats?.avgCausesFromData || 0),
    averageAnalysisVsNarration: Number(stats?.avgAnalysisVsNarration || 0),
    averageOverall: Number(stats?.avgOverall || 0),
    commonWeaknesses: Array.from(new Set(recent.flatMap(item => parseJsonArray(item.weaknesses)))).slice(0, 10),
    commonStrengths: Array.from(new Set(recent.flatMap(item => parseJsonArray(item.strengths)))).slice(0, 10),
  };
}

export async function getLowScoringEvaluations(limit: number = 20): Promise<typeof selfEvaluations.$inferSelect[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(selfEvaluations).where(sql`${selfEvaluations.overallScore} < 50`).orderBy(desc(selfEvaluations.createdAt)).limit(limit);
}
