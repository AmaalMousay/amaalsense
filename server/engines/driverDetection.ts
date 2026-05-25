/**
 * Driver Detection Engine
 *
 * Finds the likely drivers behind an emotional state. It does not generate the
 * final user response; it supplies structured causes, narratives and evidence to
 * the central processing path.
 */

import type { ContextResult, ContentDomain, EventType } from './contextClassification';
import type { AffectiveVector, EmotionFusionResult } from './emotionEngine';

export interface KeyDriver {
  term: string;
  termAr: string;
  impact: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: 'person' | 'organization' | 'event' | 'topic' | 'location' | 'action';
}

export interface RootCause {
  cause: string;
  causeAr: string;
  confidence: number;
  emotionTriggered: keyof AffectiveVector;
  evidence: string[];
}

export interface Narrative {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  emotionalTone: 'hopeful' | 'fearful' | 'angry' | 'sad' | 'joyful' | 'curious' | 'mixed';
  strength: number;
}

export interface RelatedEvent {
  event: string;
  eventAr: string;
  relevance: number;
  timeframe: 'recent' | 'ongoing' | 'historical';
  emotionalImpact: 'amplifying' | 'dampening' | 'neutral';
}

export interface DriverDetectionResult {
  keyDrivers: KeyDriver[];
  rootCauses: RootCause[];
  narratives: Narrative[];
  relatedEvents: RelatedEvent[];
  whyStatement: { en: string; ar: string };
  confidence: number;
}

const DOMAIN_TERMS: Record<ContentDomain, string[]> = {
  politics: ['government', 'policy', 'election', 'minister', 'parliament', 'security', 'diplomacy'],
  economy: ['market', 'price', 'inflation', 'currency', 'oil', 'gold', 'bank', 'liquidity', 'jobs'],
  health: ['health', 'hospital', 'disease', 'virus', 'medicine', 'patient', 'vaccine'],
  war: ['war', 'conflict', 'attack', 'military', 'weapon', 'ceasefire', 'casualties'],
  sports: ['match', 'team', 'player', 'championship', 'score', 'victory'],
  entertainment: ['movie', 'music', 'artist', 'celebrity', 'award'],
  technology: ['technology', 'ai', 'software', 'cyber', 'data', 'platform'],
  environment: ['climate', 'pollution', 'flood', 'fire', 'earthquake', 'energy'],
  society: ['public', 'community', 'protest', 'services', 'living', 'migration'],
  education: ['school', 'student', 'university', 'teacher', 'exam'],
  general: [],
};

const EVENT_TERMS: Record<EventType, string[]> = {
  crisis: ['crisis', 'emergency', 'collapse', 'shortage'],
  death: ['death', 'killed', 'fatal', 'casualties'],
  celebration: ['celebration', 'victory', 'award', 'festival'],
  conflict: ['conflict', 'clash', 'attack', 'violence'],
  announcement: ['announced', 'statement', 'plan', 'decision'],
  discovery: ['research', 'study', 'breakthrough', 'discovery'],
  election: ['election', 'vote', 'candidate', 'campaign'],
  disaster: ['disaster', 'flood', 'earthquake', 'fire'],
  achievement: ['achievement', 'success', 'record', 'milestone'],
  controversy: ['controversy', 'scandal', 'accusation', 'criticism'],
  neutral: [],
};

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[\p{L}\p{N}_]+/gu) || []).filter(token => token.length > 2);
}

function dominantEmotion(vector: AffectiveVector): keyof AffectiveVector {
  return (Object.entries(vector).sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0] || 'curiosity') as keyof AffectiveVector;
}

function sentimentFor(term: string): KeyDriver['sentiment'] {
  if (/risk|crisis|war|conflict|death|inflation|collapse|attack|shortage/i.test(term)) return 'negative';
  if (/success|recovery|peace|growth|agreement|improvement|stability/i.test(term)) return 'positive';
  return 'neutral';
}

function categorizeDriver(term: string): KeyDriver['category'] {
  if (/government|bank|company|organization|parliament|ministry/i.test(term)) return 'organization';
  if (/libya|egypt|usa|market|region|city/i.test(term)) return 'location';
  if (/increase|drop|rise|fall|decision|announcement/i.test(term)) return 'action';
  if (/crisis|conflict|election|disaster|recovery/i.test(term)) return 'event';
  return 'topic';
}

function extractKeyDrivers(text: string, context: ContextResult, emotions: EmotionFusionResult): KeyDriver[] {
  const tokens = tokenize(text);
  const keywords = new Set([...DOMAIN_TERMS[context.domain], ...EVENT_TERMS[context.eventType], ...context.keywords]);
  const drivers: KeyDriver[] = [];
  for (const keyword of keywords) {
    const count = tokens.filter(token => token.includes(keyword) || keyword.includes(token)).length;
    if (count === 0) continue;
    drivers.push({
      term: keyword,
      termAr: keyword,
      impact: Math.min(100, Math.round(count * 20 + emotions.emotionalIntensity * 0.4)),
      sentiment: sentimentFor(keyword),
      category: categorizeDriver(keyword),
    });
  }
  return drivers.sort((a, b) => b.impact - a.impact).slice(0, 8);
}

function identifyRootCauses(text: string, context: ContextResult, emotions: EmotionFusionResult): RootCause[] {
  const primaryEmotion = dominantEmotion(emotions.vector);
  const evidence = extractKeyDrivers(text, context, emotions).slice(0, 4).map(driver => driver.term);
  const causes: RootCause[] = [];
  if (context.domain !== 'general') {
    causes.push({ cause: `${context.domain} context`, causeAr: `${context.domain} context`, confidence: context.confidence, emotionTriggered: primaryEmotion, evidence });
  }
  if (context.eventType !== 'neutral') {
    causes.push({ cause: `${context.eventType} event framing`, causeAr: `${context.eventType} event framing`, confidence: Math.max(50, context.confidence - 5), emotionTriggered: primaryEmotion, evidence });
  }
  if (causes.length === 0) {
    causes.push({ cause: 'mixed contextual signals', causeAr: 'mixed contextual signals', confidence: 45, emotionTriggered: primaryEmotion, evidence });
  }
  return causes;
}

function generateNarratives(context: ContextResult, emotions: EmotionFusionResult): Narrative[] {
  const primaryEmotion = dominantEmotion(emotions.vector);
  const tone: Narrative['emotionalTone'] = primaryEmotion === 'fear' ? 'fearful' : primaryEmotion === 'anger' ? 'angry' : primaryEmotion === 'sadness' ? 'sad' : primaryEmotion === 'hope' ? 'hopeful' : primaryEmotion === 'joy' ? 'joyful' : primaryEmotion === 'curiosity' ? 'curious' : 'mixed';
  const title = `${context.domain} ${context.eventType} narrative`;
  return [{ title, titleAr: title, description: `The event is being interpreted through ${context.domain}/${context.eventType} context with ${primaryEmotion} as the dominant emotion.`, descriptionAr: `The event is being interpreted through ${context.domain}/${context.eventType} context with ${primaryEmotion} as the dominant emotion.`, emotionalTone: tone, strength: emotions.emotionalIntensity }];
}

function identifyRelatedEvents(context: ContextResult): RelatedEvent[] {
  if (context.eventType === 'neutral') return [];
  return [{ event: `${context.eventType} follow-up`, eventAr: `${context.eventType} follow-up`, relevance: 65, timeframe: 'ongoing', emotionalImpact: context.sensitivity === 'critical' || context.sensitivity === 'high' ? 'amplifying' : 'neutral' }];
}

function generateWhyStatement(context: ContextResult, emotions: EmotionFusionResult, drivers: KeyDriver[], causes: RootCause[]): { en: string; ar: string } {
  const mainDriver = drivers[0]?.term || context.domain;
  const mainCause = causes[0]?.cause || `${context.domain} context`;
  const text = `The dominant emotion appears to be driven by ${mainCause}, with ${mainDriver} as the strongest visible signal.`;
  return { en: text, ar: text };
}

export function detectDrivers(text: string, context: ContextResult, emotions: EmotionFusionResult): DriverDetectionResult {
  const keyDrivers = extractKeyDrivers(text, context, emotions);
  const rootCauses = identifyRootCauses(text, context, emotions);
  const narratives = generateNarratives(context, emotions);
  const relatedEvents = identifyRelatedEvents(context);
  const whyStatement = generateWhyStatement(context, emotions, keyDrivers, rootCauses);
  const confidence = Math.round((context.confidence + emotions.confidence + (keyDrivers.length ? 70 : 45)) / 3);
  return { keyDrivers, rootCauses, narratives, relatedEvents, whyStatement, confidence };
}

export default { detectDrivers };
