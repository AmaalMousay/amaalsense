import { invokeLLMProvider } from '../_core/llm';
import { calculateGMI, calculateCFI, calculateHRI } from '../utils/emotionIndices';
import type { ContextResult } from './contextClassification';

export interface EmotionVector {
  joy: number;
  fear: number;
  anger: number;
  sadness: number;
  hope: number;
  curiosity: number;
}

export interface SentimentAnalysisResult {
  text: string;
  emotions: EmotionVector;
  dominantEmotion: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  gmi: number;
  cfi: number;
  hri: number;
}

export interface BatchAnalysisResult {
  results: SentimentAnalysisResult[];
  aggregated: {
    gmi: number;
    cfi: number;
    hri: number;
    dominantEmotion: string;
    confidence: number;
  };
  isAIAnalyzed: boolean;
}

export interface AffectiveVector extends EmotionVector {}

export interface EmotionFusionResult {
  vector: AffectiveVector;
  dominantEmotion: keyof AffectiveVector;
  emotionalIntensity: number;
  valence: number;
  arousal: number;
  confidence: number;
  sources: {
    ruleBased: AffectiveVector;
    contextAdjusted: AffectiveVector;
    weights: { ruleBased: number; contextAdjusted: number };
  };
}

export type TrendDirection = 'rising' | 'falling' | 'stable' | 'volatile';
export type MomentumLevel = 'strong_positive' | 'positive' | 'neutral' | 'negative' | 'strong_negative';

export interface EmotionalSpike {
  emotion: keyof AffectiveVector;
  magnitude: number;
  direction: 'up' | 'down';
  significance: 'minor' | 'moderate' | 'major' | 'critical';
}

export interface DynamicsResult {
  momentum: {
    value: number;
    level: MomentumLevel;
    description: string;
    descriptionAr: string;
  };
  volatility: {
    value: number;
    level: 'low' | 'medium' | 'high' | 'extreme';
    description: string;
    descriptionAr: string;
  };
  trend: {
    direction: TrendDirection;
    strength: number;
    predictedChange: number;
    description: string;
    descriptionAr: string;
  };
  spikes: EmotionalSpike[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  stabilityIndex: number;
}

export interface EmotionalMemoryEntry {
  id: string;
  topic: string;
  countryCode: string | null;
  countryName: string | null;
  timestamp: Date;
  affectiveVector: AffectiveVector;
  dominantEmotion: string;
  emotionalIntensity: number;
  valence: number;
  gmi: number;
  cfi: number;
  hri: number;
  domain: string;
  eventType: string;
  sensitivityLevel: string;
  sourceCount: number;
  confidence: number;
  userType: string;
}

export interface HistoricalQuery {
  topic: string;
  countryCode?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

export interface HistoricalTrend {
  entries: EmotionalMemoryEntry[];
  averageGMI: number;
  averageCFI: number;
  averageHRI: number;
  emotionTrend: Array<{ emotion: string; direction: 'rising' | 'falling' | 'stable'; changePercent: number }>;
  volatility: number;
  dataPoints: number;
  momentumInsight?: string;
}

const EMOTIONS: Array<keyof EmotionVector> = ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity'];

const KEYWORDS: Record<keyof EmotionVector, string[]> = {
  joy: ['success', 'win', 'celebrate', 'achievement', 'excellent', 'growth', 'victory', 'positive'],
  fear: ['fear', 'risk', 'danger', 'threat', 'warning', 'crisis', 'panic', 'uncertain', 'emergency'],
  anger: ['anger', 'protest', 'conflict', 'attack', 'violence', 'outrage', 'corruption', 'frustration'],
  sadness: ['death', 'loss', 'grief', 'tragedy', 'suffering', 'disaster', 'mourning', 'collapse'],
  hope: ['hope', 'recovery', 'peace', 'solution', 'improvement', 'progress', 'resilience', 'stability'],
  curiosity: ['study', 'research', 'discover', 'question', 'analysis', 'unknown', 'investigate', 'new'],
};

const memoryStore: EmotionalMemoryEntry[] = [];

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeText(text: string): string {
  return text.toLowerCase();
}

function findDominantEmotion(vector: EmotionVector): keyof EmotionVector {
  return EMOTIONS.reduce((best, emotion) => vector[emotion] > vector[best] ? emotion : best, 'curiosity');
}

// calculateGMI delegated to shared utils/emotionIndices
// calculateCFI delegated to shared utils/emotionIndices
// calculateHRI delegated to shared utils/emotionIndices

function createResult(text: string, emotions: EmotionVector, confidence: number, aiAnalyzed = false): SentimentAnalysisResult {
  const dominantEmotion = findDominantEmotion(emotions);
  const gmi = calculateGMI(emotions);
  return {
    text,
    emotions,
    dominantEmotion,
    sentiment: gmi > 10 ? 'positive' : gmi < -10 ? 'negative' : 'neutral',
    confidence: clamp(confidence),
    gmi,
    cfi: calculateCFI(emotions),
    hri: calculateHRI(emotions),
  };
}

function deterministicFallback(text: string): SentimentAnalysisResult {
  const normalized = normalizeText(text);
  const vector: EmotionVector = { joy: 5, fear: 10, anger: 5, sadness: 5, hope: 10, curiosity: 20 };
  for (const emotion of EMOTIONS) {
    for (const keyword of KEYWORDS[emotion]) {
      if (normalized.includes(keyword)) vector[emotion] += 18;
    }
  }
  const hasNonLatin = /[^\x00-\x7F]/.test(text);
  if (hasNonLatin) vector.curiosity += 8;
  for (const emotion of EMOTIONS) vector[emotion] = clamp(vector[emotion]);
  return createResult(text, vector, hasNonLatin ? 50 : 65);
}

export async function analyzeTextWithAI(text: string): Promise<SentimentAnalysisResult> {
  try {
    const response = await invokeLLMProvider({
      messages: [
        {
          role: 'system',
          content: 'Return only JSON with numeric 0-100 fields: joy, fear, anger, sadness, hope, curiosity, confidence, plus dominantEmotion and sentiment.',
        },
        { role: 'user', content: text.slice(0, 1000) },
      ],
      temperature: 0.2,
      max_tokens: 300,
    });
    const parsed = JSON.parse(response.content || '{}');
    const emotions: EmotionVector = {
      joy: clamp(Number(parsed.joy ?? 0)),
      fear: clamp(Number(parsed.fear ?? 0)),
      anger: clamp(Number(parsed.anger ?? 0)),
      sadness: clamp(Number(parsed.sadness ?? 0)),
      hope: clamp(Number(parsed.hope ?? 0)),
      curiosity: clamp(Number(parsed.curiosity ?? 0)),
    };
    if (Object.values(emotions).every(value => value === 0)) return deterministicFallback(text);
    return createResult(text, emotions, Number(parsed.confidence ?? 80), true);
  } catch {
    return deterministicFallback(text);
  }
}

export async function analyzeTextsWithAI(texts: string[]): Promise<BatchAnalysisResult> {
  const selected = texts.slice(0, 10);
  const results = await Promise.all(selected.map(text => analyzeTextWithAI(text)));
  return { results, aggregated: aggregateResults(results), isAIAnalyzed: results.length > 0 };
}

function aggregateResults(results: SentimentAnalysisResult[]): BatchAnalysisResult['aggregated'] {
  if (results.length === 0) return { gmi: 0, cfi: 50, hri: 50, dominantEmotion: 'neutral', confidence: 0 };
  const totalConfidence = results.reduce((sum, result) => sum + result.confidence, 0) || results.length;
  const weighted = results.reduce((acc, result) => {
    const weight = result.confidence / totalConfidence;
    acc.gmi += result.gmi * weight;
    acc.cfi += result.cfi * weight;
    acc.hri += result.hri * weight;
    acc.confidence += result.confidence;
    acc.emotions[result.dominantEmotion] = (acc.emotions[result.dominantEmotion] || 0) + 1;
    return acc;
  }, { gmi: 0, cfi: 0, hri: 0, confidence: 0, emotions: {} as Record<string, number> });
  const dominantEmotion = Object.entries(weighted.emotions).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
  return {
    gmi: Math.round(weighted.gmi),
    cfi: Math.round(weighted.cfi),
    hri: Math.round(weighted.hri),
    dominantEmotion,
    confidence: Math.round(weighted.confidence / results.length),
  };
}

export async function analyzeCountryNews(headlines: string[], countryCode: string): Promise<BatchAnalysisResult & { countryCode: string }> {
  const result = await analyzeTextsWithAI(headlines);
  return { ...result, countryCode };
}

export function analyzeTopics(input: string | string[]): Record<string, number> {
  const text = Array.isArray(input) ? input.join(' ') : input;
  const normalized = normalizeText(text);
  const topics: Record<string, number> = {};
  const domainKeywords: Record<string, string[]> = {
    economy: ['economy', 'market', 'inflation', 'currency', 'oil', 'gold', 'price'],
    politics: ['government', 'election', 'policy', 'minister', 'parliament'],
    conflict: ['war', 'conflict', 'attack', 'security', 'military'],
    society: ['society', 'community', 'public', 'services', 'protest'],
    health: ['health', 'hospital', 'virus', 'disease', 'medicine'],
    technology: ['technology', 'ai', 'software', 'digital'],
  };
  for (const [topic, keywords] of Object.entries(domainKeywords)) {
    const score = keywords.filter(keyword => normalized.includes(keyword)).length;
    if (score > 0) topics[topic] = score;
  }
  return Object.keys(topics).length ? topics : { general: 1 };
}

export function analyzeEmotions(input: string | string[]): Record<string, number> {
  const text = Array.isArray(input) ? input.join(' ') : input;
  return { ...deterministicFallback(text).emotions };
}

export function analyzeRegions(input: string | string[], fallbackRegion: string = 'Global'): Array<{ id: string; name: string; sentiment: number }> {
  const text = normalizeText(Array.isArray(input) ? input.join(' ') : input);
  const regions = [
    ['LY', 'Libya', ['libya', 'tripoli', 'benghazi']],
    ['EG', 'Egypt', ['egypt', 'cairo']],
    ['SA', 'Saudi Arabia', ['saudi', 'riyadh']],
    ['US', 'United States', ['usa', 'america', 'washington']],
  ] as const;
  const found = regions.find(([, , keywords]) => keywords.some(keyword => text.includes(keyword)));
  return found ? [{ id: found[0], name: found[1], sentiment: 50 }] : [{ id: fallbackRegion, name: fallbackRegion, sentiment: 50 }];
}

export function analyzeSeverity(input: string | string[]): number {
  const emotions = analyzeEmotions(input);
  return clamp((emotions.fear + emotions.anger + emotions.sadness) / 3);
}

export function analyzeImpact(input: string | string[]): number {
  const severity = analyzeSeverity(input);
  return clamp(severity + 20) / 100;
}

export function getEmotionColor(emotion: string): string {
  const colors: Record<string, string> = {
    joy: '#FFD700', fear: '#8B0000', anger: '#FF4500', sadness: '#4169E1', hope: '#32CD32', curiosity: '#9370DB', neutral: '#808080',
  };
  return colors[emotion.toLowerCase()] || '#808080';
}

export function getEmotionIntensity(emotion: string, vector: Record<string, number>): number {
  return Number(vector[emotion.toLowerCase()] || 0);
}

export function generateCountryEmotionData(headlines: string[], countryCode: string): any {
  return { ...aggregateResults(headlines.map(headline => deterministicFallback(headline))), countryCode };
}

function analyzeRuleBased(text: string): AffectiveVector {
  return deterministicFallback(text).emotions;
}

function applyContext(vector: AffectiveVector, context: ContextResult): AffectiveVector {
  const adjusted = { ...vector };
  const domain = String(context.domain || 'general');
  const sensitivity = String(context.sensitivity || 'medium');
  if (['war', 'conflict', 'politics', 'health'].includes(domain)) adjusted.fear = clamp(adjusted.fear * 1.15);
  if (domain === 'economy') adjusted.curiosity = clamp(adjusted.curiosity * 1.1);
  if (sensitivity === 'high' || sensitivity === 'critical') {
    adjusted.fear = clamp(adjusted.fear * 1.2);
    adjusted.anger = clamp(adjusted.anger * 1.1);
  }
  return adjusted;
}

function calculateValence(vector: AffectiveVector): number {
  const positive = vector.joy + vector.hope + vector.curiosity * 0.5;
  const negative = vector.fear + vector.anger + vector.sadness;
  const total = positive + negative;
  return total === 0 ? 0 : Math.round(((positive - negative) / total) * 100);
}

function calculateArousal(vector: AffectiveVector): number {
  const high = vector.anger + vector.fear + vector.joy;
  const low = vector.sadness + vector.hope + vector.curiosity;
  const total = high + low;
  return total === 0 ? 50 : Math.round((high / total) * 100);
}

function calculateIntensity(vector: AffectiveVector): number {
  const values = Object.values(vector);
  return Math.round(Math.max(...values) * 0.6 + (values.reduce((a, b) => a + b, 0) / values.length) * 0.4);
}

export function fuseEmotions(text: string, context: ContextResult): EmotionFusionResult {
  const ruleBased = analyzeRuleBased(text);
  const contextAdjusted = applyContext(ruleBased, context);
  const weights = { ruleBased: 0.45, contextAdjusted: 0.55 };
  const vector: AffectiveVector = {
    joy: Math.round(ruleBased.joy * weights.ruleBased + contextAdjusted.joy * weights.contextAdjusted),
    fear: Math.round(ruleBased.fear * weights.ruleBased + contextAdjusted.fear * weights.contextAdjusted),
    anger: Math.round(ruleBased.anger * weights.ruleBased + contextAdjusted.anger * weights.contextAdjusted),
    sadness: Math.round(ruleBased.sadness * weights.ruleBased + contextAdjusted.sadness * weights.contextAdjusted),
    hope: Math.round(ruleBased.hope * weights.ruleBased + contextAdjusted.hope * weights.contextAdjusted),
    curiosity: Math.round(ruleBased.curiosity * weights.ruleBased + contextAdjusted.curiosity * weights.contextAdjusted),
  };
  return {
    vector,
    dominantEmotion: findDominantEmotion(vector),
    emotionalIntensity: calculateIntensity(vector),
    valence: calculateValence(vector),
    arousal: calculateArousal(vector),
    confidence: Math.min(100, Math.round((context.confidence || 50) * 0.5 + 50)),
    sources: { ruleBased, contextAdjusted, weights },
  };
}

function calculateMomentum(emotions: EmotionFusionResult): DynamicsResult['momentum'] {
  const value = Math.round(clamp(emotions.valence * 0.6 + (emotions.arousal - 50) * 0.4, -100, 100));
  const level: MomentumLevel = value >= 50 ? 'strong_positive' : value >= 20 ? 'positive' : value <= -50 ? 'strong_negative' : value <= -20 ? 'negative' : 'neutral';
  return { value, level, description: `Momentum level: ${level}.`, descriptionAr: `Momentum level: ${level}.` };
}

function calculateVolatility(vector: AffectiveVector): DynamicsResult['volatility'] {
  const values = Object.values(vector);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
  const value = Math.round(clamp(Math.sqrt(variance) * 2.5));
  const level = value > 70 ? 'extreme' : value > 45 ? 'high' : value > 20 ? 'medium' : 'low';
  return { value, level, description: `Volatility level: ${level}.`, descriptionAr: `Volatility level: ${level}.` };
}

function detectSpikes(vector: AffectiveVector): EmotionalSpike[] {
  const average = Object.values(vector).reduce((a, b) => a + b, 0) / EMOTIONS.length;
  return EMOTIONS
    .map(emotion => {
      const deviation = vector[emotion] - average;
      const magnitude = Math.abs(deviation);
      const significance: EmotionalSpike['significance'] = magnitude > 50 ? 'critical' : magnitude > 35 ? 'major' : magnitude > 25 ? 'moderate' : 'minor';
      return { emotion, magnitude, direction: deviation > 0 ? 'up' as const : 'down' as const, significance };
    })
    .filter(spike => spike.magnitude > 15)
    .sort((a, b) => b.magnitude - a.magnitude);
}

export function analyzeEmotionalDynamics(emotions: EmotionFusionResult): DynamicsResult {
  const volatility = calculateVolatility(emotions.vector);
  const momentum = calculateMomentum(emotions);
  const spikes = detectSpikes(emotions.vector);
  const direction: TrendDirection = volatility.value > 60 ? 'volatile' : emotions.valence > 20 ? 'rising' : emotions.valence < -20 ? 'falling' : 'stable';
  const riskScore = (emotions.vector.fear + emotions.vector.anger + volatility.value) / 3;
  const riskLevel: DynamicsResult['riskLevel'] = riskScore > 80 ? 'critical' : riskScore > 55 ? 'high' : riskScore > 30 ? 'medium' : 'low';
  return {
    momentum,
    volatility,
    trend: { direction, strength: Math.round(Math.abs(emotions.valence) * 0.5 + emotions.emotionalIntensity * 0.5), predictedChange: Math.round(clamp(emotions.valence * 0.3 + (emotions.arousal - 50) * 0.2, -50, 50)), description: `Trend direction: ${direction}.`, descriptionAr: `Trend direction: ${direction}.` },
    spikes,
    riskLevel,
    stabilityIndex: Math.round(clamp(100 - volatility.value - spikes.length * 5)),
  };
}

export function storeAnalysis(entry: Omit<EmotionalMemoryEntry, 'id' | 'timestamp'>): EmotionalMemoryEntry {
  const record: EmotionalMemoryEntry = { ...entry, id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`, timestamp: new Date() };
  memoryStore.push(record);
  if (memoryStore.length > 10000) memoryStore.shift();
  return record;
}

export function getHistoricalData(query: HistoricalQuery): EmotionalMemoryEntry[] {
  return memoryStore
    .filter(entry => entry.topic.toLowerCase().includes(query.topic.toLowerCase()) && (!query.countryCode || entry.countryCode === query.countryCode || entry.countryCode === null))
    .filter(entry => !query.startDate || entry.timestamp >= query.startDate)
    .filter(entry => !query.endDate || entry.timestamp <= query.endDate)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, query.limit || 100);
}

export function calculateHistoricalTrend(query: HistoricalQuery): HistoricalTrend {
  const entries = getHistoricalData({ ...query, limit: query.limit || 100 });
  if (entries.length === 0) return { entries: [], averageGMI: 0, averageCFI: 50, averageHRI: 50, emotionTrend: [], volatility: 0, dataPoints: 0 };
  const averageGMI = entries.reduce((sum, entry) => sum + entry.gmi, 0) / entries.length;
  const averageCFI = entries.reduce((sum, entry) => sum + entry.cfi, 0) / entries.length;
  const averageHRI = entries.reduce((sum, entry) => sum + entry.hri, 0) / entries.length;
  const intensities = entries.map(entry => entry.emotionalIntensity);
  const mean = intensities.reduce((a, b) => a + b, 0) / intensities.length;
  const volatility = Math.sqrt(intensities.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / intensities.length);
  return { entries, averageGMI, averageCFI, averageHRI, emotionTrend: [], volatility, dataPoints: entries.length, momentumInsight: 'Historical emotional memory updated.' };
}

export function getLastAnalysis(topic: string, countryCode?: string): EmotionalMemoryEntry | null {
  return getHistoricalData({ topic, countryCode, limit: 1 })[0] || null;
}

export function getMemoryStats() {
  return {
    totalEntries: memoryStore.length,
    uniqueTopics: new Set(memoryStore.map(entry => entry.topic.toLowerCase())).size,
    uniqueCountries: new Set(memoryStore.filter(entry => entry.countryCode).map(entry => entry.countryCode)).size,
    oldestEntry: memoryStore[0]?.timestamp || null,
    newestEntry: memoryStore[memoryStore.length - 1]?.timestamp || null,
  };
}

export function clearMemory(): void {
  memoryStore.length = 0;
}

export { memoryStore };

export default {
  analyzeTextWithAI,
  analyzeTextsWithAI,
  analyzeCountryNews,
  analyzeTopics,
  analyzeEmotions,
  analyzeRegions,
  analyzeSeverity,
  analyzeImpact,
  fuseEmotions,
  analyzeEmotionalDynamics,
  storeAnalysis,
  getHistoricalData,
  calculateHistoricalTrend,
  getLastAnalysis,
  getMemoryStats,
};
