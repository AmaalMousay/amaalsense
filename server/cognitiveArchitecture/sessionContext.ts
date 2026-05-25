/**
 * Session Context
 *
 * Maintains lightweight conversation context for follow-up questions. It stores
 * the current topic, country, domain and recent question history. It does not
 * generate final answers.
 */

export interface SessionContext {
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
  currentTopic?: string;
  currentCountry?: string;
  currentDomain?: string;
  questionHistory: QuestionRecord[];
  cognitiveLens?: string;
  metadata: Record<string, unknown>;
}

export interface QuestionRecord {
  question: string;
  timestamp: Date;
  intent: QuestionIntent;
  extracted: ExtractedContext;
}

export interface QuestionIntent {
  type: 'what' | 'why' | 'how' | 'prediction' | 'comparison' | 'decision' | 'follow_up' | 'general';
  isFollowUp: boolean;
  requiresContext: boolean;
}

export interface ExtractedContext {
  topic?: string;
  country?: string;
  domain?: string;
  entities: string[];
}

const sessions = new Map<string, SessionContext>();
const SESSION_TTL_MS = 60 * 60 * 1000;

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

export function getOrCreateSession(sessionId: string): SessionContext {
  const existing = sessions.get(sessionId);
  if (existing && Date.now() - existing.updatedAt.getTime() < SESSION_TTL_MS) return existing;
  const created: SessionContext = { sessionId, createdAt: new Date(), updatedAt: new Date(), questionHistory: [], metadata: {} };
  sessions.set(sessionId, created);
  return created;
}

export function classifyQuestionIntent(question: string, session: SessionContext): QuestionIntent {
  const text = normalize(question);
  const isFollowUp = /\b(it|this|that|same|again|also|more|what about|and)\b/.test(text) || (question.length < 30 && !!session.currentTopic);
  let type: QuestionIntent['type'] = 'general';
  if (/\bwhy|cause|reason\b/.test(text)) type = 'why';
  else if (/\bhow\b/.test(text)) type = 'how';
  else if (/\bpredict|forecast|future|will|next\b/.test(text)) type = 'prediction';
  else if (/\bcompare|versus|vs\b/.test(text)) type = 'comparison';
  else if (/\bshould|decision|buy|sell|enter|exit\b/.test(text)) type = 'decision';
  else if (/\bwhat\b/.test(text)) type = 'what';
  if (isFollowUp && type === 'general') type = 'follow_up';
  return { type, isFollowUp, requiresContext: isFollowUp || ['prediction', 'comparison', 'decision'].includes(type) };
}

export function extractContextFromQuestion(question: string): ExtractedContext {
  const text = normalize(question);
  const countries: Record<string, string> = { libya: 'Libya', egypt: 'Egypt', usa: 'United States', america: 'United States', china: 'China', russia: 'Russia' };
  const domains: Record<string, string> = {
    gold: 'commodities', oil: 'commodities', dollar: 'forex', bitcoin: 'crypto', crypto: 'crypto', market: 'markets', politics: 'politics', economy: 'economy', social: 'society'
  };
  const country = Object.entries(countries).find(([key]) => text.includes(key))?.[1];
  const domain = Object.entries(domains).find(([key]) => text.includes(key))?.[1];
  const entities = Array.from(new Set((question.match(/[\p{L}\p{N}_]+/gu) || []).filter(token => token.length > 3))).slice(0, 8);
  const topic = entities[0];
  return { topic, country, domain, entities };
}

export function updateSessionContext(sessionId: string, question: string): SessionContext {
  const session = getOrCreateSession(sessionId);
  const intent = classifyQuestionIntent(question, session);
  const extracted = extractContextFromQuestion(question);
  if (extracted.topic) session.currentTopic = extracted.topic;
  if (extracted.country) session.currentCountry = extracted.country;
  if (extracted.domain) session.currentDomain = extracted.domain;
  session.questionHistory.push({ question, timestamp: new Date(), intent, extracted });
  if (session.questionHistory.length > 20) session.questionHistory.shift();
  session.updatedAt = new Date();
  return session;
}

export function getFullContext(sessionId: string, question: string): {
  session: SessionContext;
  effectiveContext: { country: string; domain: string; topic: string; isFollowUp: boolean; questionNumber: number };
} {
  const session = updateSessionContext(sessionId, question);
  const latest = session.questionHistory[session.questionHistory.length - 1];
  return {
    session,
    effectiveContext: {
      country: latest.extracted.country || session.currentCountry || 'Global',
      domain: latest.extracted.domain || session.currentDomain || 'general',
      topic: latest.extracted.topic || session.currentTopic || question,
      isFollowUp: latest.intent.isFollowUp,
      questionNumber: session.questionHistory.length,
    },
  };
}

export function resetSession(sessionId: string): void {
  sessions.delete(sessionId);
}

export function getSessionSummary(sessionId: string): string {
  const session = sessions.get(sessionId);
  if (!session) return 'No active session.';
  return `Session ${sessionId}: topic=${session.currentTopic || 'none'}, country=${session.currentCountry || 'none'}, questions=${session.questionHistory.length}`;
}

export const SessionContextManager = { getOrCreateSession, updateSessionContext, getFullContext, resetSession, getSessionSummary };
