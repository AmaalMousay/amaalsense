import { smartJsonChat } from '../_core/llm';

export type QuestionType =
  | 'why'
  | 'what'
  | 'how'
  | 'should'
  | 'will'
  | 'compare'
  | 'what_if'
  | 'when'
  | 'who'
  | 'explain'
  | 'greeting'
  | 'general';

export type RealIntent =
  | 'make_decision'
  | 'understand_cause'
  | 'predict_future'
  | 'assess_risk'
  | 'find_opportunity'
  | 'validate_belief'
  | 'learn_concept'
  | 'compare_options'
  | 'get_reassurance'
  | 'socialize'
  | 'explore_scenario';

export type EmotionalNeed =
  | 'anxious'
  | 'curious'
  | 'urgent'
  | 'skeptical'
  | 'hopeful'
  | 'confused'
  | 'decisive'
  | 'neutral';

export type SourceType =
  | 'emotion_indicators'
  | 'economic_data'
  | 'news'
  | 'historical'
  | 'expert_knowledge'
  | 'comparison_data'
  | 'scenario_models';

export interface ResponseStrategy {
  style: 'analytical' | 'advisory' | 'educational' | 'reassuring' | 'comparative';
  depth: 'brief' | 'detailed' | 'comprehensive';
  includeData: boolean;
  includeRecommendation: boolean;
  includeScenarios: boolean;
  tone: 'formal' | 'conversational' | 'urgent';
}

export interface DeepQuestion {
  surface: {
    text: string;
    topic: string;
    questionType: QuestionType;
    keywords: string[];
  };
  deep: {
    realIntent: RealIntent;
    implicitQuestions: string[];
    emotionalNeed: EmotionalNeed;
    urgency: 'immediate' | 'planning' | 'learning';
  };
  context: {
    isFollowUp: boolean;
    previousTopic?: string | null;
    userExpertise: 'beginner' | 'intermediate' | 'expert';
    language: 'ar' | 'en';
  };
  requiredSources: SourceType[];
  responseStrategy: ResponseStrategy;
}

export type Layer1QuestionType =
  | 'sentiment'
  | 'factual'
  | 'opinion'
  | 'trend'
  | 'comparison'
  | 'explanation'
  | 'prediction'
  | 'recommendation'
  | 'other';

export type AnalysisType =
  | 'emotion_analysis'
  | 'trend_detection'
  | 'sentiment_analysis'
  | 'fact_checking'
  | 'comparison_analysis'
  | 'direct_answer';

export interface Layer1Output {
  originalQuestion: string;
  language: string;
  questionType: Layer1QuestionType;
  entities: {
    topics: string[];
    people: string[];
    locations: string[];
    organizations: string[];
  };
  hasFactualError: boolean;
  factualErrorDescription?: string;
  clarificationNeeded: boolean;
  clarificationReason?: string;
  confidence: number;
  timeContext?: string;
  geographicContext?: {
    countryCode?: string;
    locationName?: string;
    region?: string;
  };
  isComparative: boolean;
  isOpinionBased: boolean;
  readyForAnalysis: boolean;
  suggestedAnalysisType?: AnalysisType;
}

export type IntentType =
  | 'decision_support'
  | 'information'
  | 'prediction'
  | 'comparison'
  | 'recommendation'
  | 'scenario'
  | 'explanation'
  | 'sentiment'
  | 'risk_assessment'
  | 'opportunity'
  | 'general';

export type DomainType =
  | 'finance'
  | 'crypto'
  | 'commodities'
  | 'politics'
  | 'economy'
  | 'social'
  | 'technology'
  | 'general';

export type TimeHorizon = 'immediate' | 'short_term' | 'medium_term' | 'long_term' | 'unspecified';
export type RiskSensitivity = 'conservative' | 'moderate' | 'aggressive' | 'unknown';
export type DirectionType = 'up' | 'down' | 'stable' | 'volatile' | 'unknown';

export interface SemanticFrame {
  intent: IntentType;
  intentConfidence: number;
  entity: string;
  entityType: 'asset' | 'market' | 'country' | 'event' | 'concept' | 'unknown';
  domain: DomainType;
  direction: DirectionType;
  timeHorizon: TimeHorizon;
  riskSensitivity: RiskSensitivity;
  userNeed: string;
  expectedResponseType: 'verdict' | 'explanation' | 'data' | 'recommendation' | 'scenario';
  keywords: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  urgency: 'high' | 'medium' | 'low';
  originalQuestion: string;
  normalizedQuestion: string;
}

export interface InjectedContext {
  currentIndicators: {
    gmi: number;
    cfi: number;
    hri: number;
    dominantEmotion: string;
    confidence: number;
  };
  trend: {
    direction: 'improving' | 'declining' | 'stable';
    momentum: number;
    volatility: number;
  };
  historicalContext: {
    yesterday: { gmi: number; cfi: number; hri: number };
    lastWeek: { gmi: number; cfi: number; hri: number };
    change24h: number;
    change7d: number;
  };
  reasoningRules: string[];
  preliminaryRecommendation: string;
}

export interface ClarificationResult {
  needsClarification: boolean;
  reason: string;
  questions: string[];
  confidence: number;
}

export interface ClarificationRequest {
  isAmbiguous: boolean;
  reason: string;
  suggestedQuestions: string[];
  confidence: number;
}

export interface SimilarityMatch {
  question: string;
  answer?: string;
  similarity: number;
  metadata?: Record<string, unknown>;
}

const ARABIC_CHAR_PATTERN = /[\u0600-\u06FF]/;
const WORD_PATTERN = /[\p{L}\p{N}_]+/gu;

function detectUserLanguage(text: string): 'ar' | 'en' {
  return ARABIC_CHAR_PATTERN.test(text) ? 'ar' : 'en';
}

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function extractKeywordsInternal(text: string): string[] {
  const words = normalizeText(text).match(WORD_PATTERN) || [];
  const stopWords = new Set([
    'the', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'with', 'from', 'what', 'why', 'how', 'when', 'where', 'who', 'is', 'are', 'do', 'does',
  ]);
  return Array.from(new Set(words.filter(word => word.length > 2 && !stopWords.has(word)))).slice(0, 12);
}

export function extractTopic(text: string): string {
  const keywords = extractKeywordsInternal(text);
  return keywords[0] || 'General';
}

function inferQuestionType(text: string): QuestionType {
  const q = normalizeText(text);
  if (/\b(hello|hi|hey|thanks|thank you)\b/.test(q)) return 'greeting';
  if (/\bwhy\b/.test(q)) return 'why';
  if (/\bhow\b/.test(q)) return 'how';
  if (/\bshould\b/.test(q)) return 'should';
  if (/\bwill\b|\bpredict\b|\bforecast\b/.test(q)) return 'will';
  if (/\bcompare\b|\bversus\b|\bvs\b/.test(q)) return 'compare';
  if (/\bwhat if\b|\bscenario\b/.test(q)) return 'what_if';
  if (/\bwhen\b/.test(q)) return 'when';
  if (/\bwho\b/.test(q)) return 'who';
  if (/\bexplain\b|\bmeaning\b|\bdefinition\b/.test(q)) return 'explain';
  if (/\bwhat\b/.test(q)) return 'what';
  return 'general';
}

function mapQuestionTypeToLayer1(type: QuestionType): Layer1QuestionType {
  switch (type) {
    case 'why':
    case 'how':
    case 'explain':
      return 'explanation';
    case 'will':
    case 'when':
      return 'prediction';
    case 'compare':
      return 'comparison';
    case 'should':
      return 'recommendation';
    default:
      return 'other';
  }
}

function determineSuggestedAnalysisType(questionType: Layer1QuestionType, isOpinionBased: boolean): AnalysisType {
  if (questionType === 'sentiment' || isOpinionBased) return 'emotion_analysis';
  if (questionType === 'trend') return 'trend_detection';
  if (questionType === 'factual') return 'fact_checking';
  if (questionType === 'comparison') return 'comparison_analysis';
  if (questionType === 'opinion') return 'sentiment_analysis';
  return 'direct_answer';
}

function inferRealIntent(type: QuestionType): RealIntent {
  switch (type) {
    case 'why':
      return 'understand_cause';
    case 'will':
    case 'when':
      return 'predict_future';
    case 'should':
      return 'make_decision';
    case 'compare':
      return 'compare_options';
    case 'what_if':
      return 'explore_scenario';
    case 'greeting':
      return 'socialize';
    default:
      return 'learn_concept';
  }
}

function inferRequiredSources(type: QuestionType): SourceType[] {
  if (type === 'greeting' || type === 'what' || type === 'explain') return ['expert_knowledge'];
  if (type === 'compare') return ['comparison_data', 'historical', 'emotion_indicators'];
  if (type === 'will' || type === 'when' || type === 'what_if') return ['historical', 'scenario_models', 'emotion_indicators'];
  if (type === 'why') return ['news', 'historical', 'expert_knowledge'];
  return ['emotion_indicators'];
}

export async function understandQuestion(
  question: string,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<DeepQuestion> {
  const systemPrompt = `Analyze the user's question and return valid JSON with surface, deep, context, requiredSources, and responseStrategy. Use only the enum values documented in the TypeScript interfaces.`;
  const userMessage = JSON.stringify({ question, conversationHistory: conversationHistory?.slice(-6) || [] });

  try {
    const analysis = await smartJsonChat(systemPrompt, userMessage, 'question_understanding');
    const fallbackType = inferQuestionType(question);
    return {
      surface: {
        text: question,
        topic: analysis.surface?.topic || extractTopic(question),
        questionType: analysis.surface?.questionType || fallbackType,
        keywords: analysis.surface?.keywords || extractKeywordsInternal(question),
      },
      deep: {
        realIntent: analysis.deep?.realIntent || inferRealIntent(fallbackType),
        implicitQuestions: analysis.deep?.implicitQuestions || [],
        emotionalNeed: analysis.deep?.emotionalNeed || 'neutral',
        urgency: analysis.deep?.urgency || 'learning',
      },
      context: {
        isFollowUp: Boolean(conversationHistory?.length),
        previousTopic: analysis.context?.previousTopic || null,
        userExpertise: analysis.context?.userExpertise || 'beginner',
        language: analysis.context?.language || detectUserLanguage(question),
      },
      requiredSources: analysis.requiredSources || inferRequiredSources(fallbackType),
      responseStrategy: analysis.responseStrategy || {
        style: 'analytical',
        depth: 'detailed',
        includeData: true,
        includeRecommendation: fallbackType === 'should',
        includeScenarios: fallbackType === 'what_if',
        tone: 'conversational',
      },
    };
  } catch {
    const questionType = inferQuestionType(question);
    return {
      surface: { text: question, topic: extractTopic(question), questionType, keywords: extractKeywordsInternal(question) },
      deep: { realIntent: inferRealIntent(questionType), implicitQuestions: [], emotionalNeed: 'neutral', urgency: 'learning' },
      context: { isFollowUp: Boolean(conversationHistory?.length), userExpertise: 'beginner', language: detectUserLanguage(question) },
      requiredSources: inferRequiredSources(questionType),
      responseStrategy: { style: 'analytical', depth: 'detailed', includeData: true, includeRecommendation: questionType === 'should', includeScenarios: questionType === 'what_if', tone: 'conversational' },
    };
  }
}

export async function layer1QuestionUnderstanding(question: string, language: string = detectUserLanguage(question)): Promise<Layer1Output> {
  const deep = await understandQuestion(question);
  const layerType = mapQuestionTypeToLayer1(deep.surface.questionType);
  const isOpinionBased = ['sentiment', 'opinion'].includes(layerType);
  const clarification = evaluateAmbiguity(deep);
  return {
    originalQuestion: question,
    language,
    questionType: layerType,
    entities: {
      topics: deep.surface.topic === 'General' ? [] : [deep.surface.topic],
      people: [],
      locations: [],
      organizations: [],
    },
    hasFactualError: false,
    clarificationNeeded: clarification.needsClarification,
    clarificationReason: clarification.reason,
    confidence: Math.round(deep.responseStrategy.includeData ? 80 : 65),
    timeContext: deep.deep.urgency,
    geographicContext: { countryCode: 'GLOBAL', locationName: 'Global' },
    isComparative: deep.surface.questionType === 'compare',
    isOpinionBased,
    readyForAnalysis: !clarification.needsClarification,
    suggestedAnalysisType: determineSuggestedAnalysisType(layerType, isOpinionBased),
  };
}

export function validateQuestionQuality(output: Layer1Output): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  if (output.hasFactualError) issues.push(output.factualErrorDescription || 'Potential factual issue detected.');
  if (output.clarificationNeeded) issues.push(output.clarificationReason || 'Clarification is needed.');
  if (output.confidence < 50) issues.push('Low confidence in question understanding.');
  return { isValid: issues.length === 0, issues };
}

export function formatLayer1Output(output: Layer1Output): string {
  return JSON.stringify(output, null, 2);
}

export function classifyIntent(question: string): { intent: IntentType; confidence: number } {
  const q = normalizeText(question);
  if (/\b(should|buy|sell|decide|decision)\b/.test(q)) return { intent: 'decision_support', confidence: 85 };
  if (/\b(predict|forecast|future|will)\b/.test(q)) return { intent: 'prediction', confidence: 85 };
  if (/\b(compare|versus|vs)\b/.test(q)) return { intent: 'comparison', confidence: 85 };
  if (/\b(risk|danger|threat)\b/.test(q)) return { intent: 'risk_assessment', confidence: 80 };
  if (/\b(sentiment|mood|feel|emotion)\b/.test(q)) return { intent: 'sentiment', confidence: 80 };
  if (/\b(why|cause|explain)\b/.test(q)) return { intent: 'explanation', confidence: 80 };
  return { intent: 'general', confidence: 55 };
}

function detectDomain(question: string): DomainType {
  const q = normalizeText(question);
  if (/\b(bitcoin|crypto|ethereum)\b/.test(q)) return 'crypto';
  if (/\b(gold|silver|oil|commodity|commodities)\b/.test(q)) return 'commodities';
  if (/\b(stock|market|shares|trading)\b/.test(q)) return 'finance';
  if (/\b(government|election|policy|politics)\b/.test(q)) return 'politics';
  if (/\b(economy|inflation|currency|interest)\b/.test(q)) return 'economy';
  if (/\b(social|people|community)\b/.test(q)) return 'social';
  if (/\b(ai|technology|software|digital)\b/.test(q)) return 'technology';
  return 'general';
}

function extractEntity(question: string): { entity: string; entityType: SemanticFrame['entityType'] } {
  const q = normalizeText(question);
  const assets: Record<string, string> = { gold: 'gold', silver: 'silver', oil: 'oil', bitcoin: 'bitcoin', dollar: 'dollar' };
  for (const [keyword, entity] of Object.entries(assets)) if (q.includes(keyword)) return { entity, entityType: 'asset' };
  const countries: Record<string, string> = { libya: 'libya', egypt: 'egypt', saudi: 'saudi arabia', usa: 'usa', america: 'usa' };
  for (const [keyword, entity] of Object.entries(countries)) if (q.includes(keyword)) return { entity, entityType: 'country' };
  return { entity: extractTopic(question), entityType: 'unknown' };
}

function detectDirection(question: string): DirectionType {
  const q = normalizeText(question);
  if (/\b(up|rise|increase|higher)\b/.test(q)) return 'up';
  if (/\b(down|fall|drop|lower|decrease)\b/.test(q)) return 'down';
  if (/\b(stable|steady)\b/.test(q)) return 'stable';
  if (/\b(volatile|unstable)\b/.test(q)) return 'volatile';
  return 'unknown';
}

function detectTimeHorizon(question: string): TimeHorizon {
  const q = normalizeText(question);
  if (/\b(now|today|currently)\b/.test(q)) return 'immediate';
  if (/\b(tomorrow|this week|next days)\b/.test(q)) return 'short_term';
  if (/\b(next week|month|next month)\b/.test(q)) return 'medium_term';
  if (/\b(year|long term|future)\b/.test(q)) return 'long_term';
  return 'unspecified';
}

function expectedResponse(intent: IntentType): SemanticFrame['expectedResponseType'] {
  if (intent === 'decision_support' || intent === 'recommendation') return 'verdict';
  if (intent === 'prediction' || intent === 'comparison') return 'data';
  if (intent === 'scenario') return 'scenario';
  return 'explanation';
}

export function parseQuestion(question: string): SemanticFrame {
  const { intent, confidence } = classifyIntent(question);
  const { entity, entityType } = extractEntity(question);
  const keywords = extractKeywordsInternal(question);
  const q = normalizeText(question);
  const hasPositive = /\b(opportunity|profit|gain|hope)\b/.test(q);
  const hasNegative = /\b(risk|loss|danger|fear)\b/.test(q);
  return {
    intent,
    intentConfidence: confidence,
    entity,
    entityType,
    domain: detectDomain(question),
    direction: detectDirection(question),
    timeHorizon: detectTimeHorizon(question),
    riskSensitivity: 'unknown',
    userNeed: `User needs ${intent} for ${entity}.`,
    expectedResponseType: expectedResponse(intent),
    keywords,
    sentiment: hasPositive && hasNegative ? 'mixed' : hasPositive ? 'positive' : hasNegative ? 'negative' : 'neutral',
    urgency: /\b(now|urgent|immediately)\b/.test(q) ? 'high' : 'medium',
    originalQuestion: question,
    normalizedQuestion: q,
  };
}

export function buildContext(
  semanticFrame: SemanticFrame,
  indicators: { gmi: number; cfi: number; hri: number; dominantEmotion: string; confidence: number }
): InjectedContext {
  const direction = indicators.hri > 60 && indicators.cfi < 50 ? 'improving' : indicators.cfi > 70 || indicators.gmi < -30 ? 'declining' : 'stable';
  const yesterday = { gmi: indicators.gmi, cfi: indicators.cfi, hri: indicators.hri };
  const lastWeek = { gmi: indicators.gmi, cfi: indicators.cfi, hri: indicators.hri };
  return {
    currentIndicators: indicators,
    trend: { direction, momentum: (indicators.hri - indicators.cfi) / 100, volatility: Math.abs(indicators.gmi) > 50 || indicators.cfi > 70 ? 0.8 : 0.4 },
    historicalContext: { yesterday, lastWeek, change24h: 0, change7d: 0 },
    reasoningRules: [],
    preliminaryRecommendation: '',
  };
}

export function evaluateAmbiguity(questionOrUnderstanding: string | DeepQuestion): ClarificationResult {
  const text = typeof questionOrUnderstanding === 'string' ? questionOrUnderstanding : questionOrUnderstanding.surface.text;
  const keywords = extractKeywordsInternal(text);
  const vague = keywords.length === 0 || text.trim().length < 4;
  return {
    needsClarification: vague,
    reason: vague ? 'The question is too short or lacks a clear topic.' : '',
    questions: vague ? ['What topic, country, or decision should AmalSense focus on?'] : [],
    confidence: vague ? 0.75 : 0.9,
  };
}

export function formatClarificationResponse(result: ClarificationResult, language: 'ar' | 'en' = 'en'): string {
  return result.needsClarification ? result.questions.join('\n') : '';
}

export async function detectAmbiguity(question: string, language: string = detectUserLanguage(question)): Promise<ClarificationRequest> {
  const result = evaluateAmbiguity(question);
  return {
    isAmbiguous: result.needsClarification,
    reason: result.reason,
    suggestedQuestions: result.questions,
    confidence: result.confidence,
  };
}

export async function generateClarificationDialog(question: string, language: string = detectUserLanguage(question)): Promise<string> {
  const ambiguity = await detectAmbiguity(question, language);
  return ambiguity.isAmbiguous ? ambiguity.suggestedQuestions.join('\n') : '';
}

export function calculateQuestionSimilarity(q1: string, q2: string): number {
  const a = new Set(extractKeywordsInternal(q1));
  const b = new Set(extractKeywordsInternal(q2));
  if (a.size === 0 && b.size === 0) return 1;
  const intersection = [...a].filter(item => b.has(item)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

export function findSimilarQuestions(
  question: string,
  candidates: Array<{ question: string; answer?: string; metadata?: Record<string, unknown> }>,
  threshold: number = 0.65
): SimilarityMatch[] {
  return candidates
    .map(candidate => ({ ...candidate, similarity: calculateQuestionSimilarity(question, candidate.question) }))
    .filter(candidate => candidate.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);
}

export function generateQuestionCacheKey(question: string): string {
  return normalizeText(question).replace(/[^a-z0-9\p{L}]+/gu, '-').slice(0, 120);
}

export function shouldUseCachedResponse(match: SimilarityMatch, maxAgeMs: number = 24 * 60 * 60 * 1000): boolean {
  const timestamp = match.metadata?.timestamp;
  if (!timestamp) return match.similarity >= 0.85;
  const time = typeof timestamp === 'number' ? timestamp : new Date(String(timestamp)).getTime();
  return match.similarity >= 0.85 && Date.now() - time <= maxAgeMs;
}

export default {
  understandQuestion,
  extractTopic,
  layer1QuestionUnderstanding,
  validateQuestionQuality,
  formatLayer1Output,
  classifyIntent,
  parseQuestion,
  buildContext,
  evaluateAmbiguity,
  formatClarificationResponse,
  detectAmbiguity,
  generateClarificationDialog,
  calculateQuestionSimilarity,
  findSimilarQuestions,
  generateQuestionCacheKey,
  shouldUseCachedResponse,
};
