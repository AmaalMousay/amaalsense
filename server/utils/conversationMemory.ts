/**
 * Conversation Memory System
 *
 * Maintains multi-turn context for intelligent follow-up questions.
 * Stores message history, topic, and emotional context per conversation.
 */

import type { EventVector } from './graphPipeline';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  eventVector?: EventVector;
  timestamp: number;
}

export interface ConversationContext {
  conversationId: string;
  userId: string;
  messages: ConversationMessage[];
  currentTopic: string;
  regionContext: string[];
  emotionalContext: {
    dominantEmotion: string;
    overallSentiment: number;
  };
  createdAt: number;
  updatedAt: number;
}

/**
 * Build a compact context string from conversation history
 */
export function buildConversationContext(context: ConversationContext): string {
  const recentMessages = context.messages.slice(-5);
  const history = recentMessages
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n\n');

  return [
    `Active topic: ${context.currentTopic}`,
    `Region: ${context.regionContext.join(', ')}`,
    `Dominant emotion: ${context.emotionalContext.dominantEmotion}`,
    `Overall sentiment: ${context.emotionalContext.overallSentiment > 0 ? 'positive' : 'negative'}`,
    '',
    'Recent conversation:',
    history,
    '',
    'Use this context to maintain continuity.',
  ].join('\n');
}

/**
 * Create a context-aware prompt for the language model.
 */
export function createContextAwarePrompt(
  userQuery: string,
  eventVector: EventVector,
  conversationContext?: ConversationContext,
): string {
  const base = [
    'You are AmalSense collective emotion analyst.',
    '',
    `User question: ${userQuery}`,
    '',
    'Event vector context:',
    `- Topic: ${eventVector.topic}`,
    `- Emotion signals: fear=${eventVector.emotions.fear}, hope=${eventVector.emotions.hope}, anger=${eventVector.emotions.anger}`,
    `- Region: ${eventVector.region}`,
    `- Impact score: ${eventVector.impactScore}/100`,
    `- Region confidence: ${eventVector.regionConfidence}%`,
    '',
    'Answer structure:',
    '1. Direct answer to the question',
    '2. Key emotion signals observed',
    '3. Causal factors if identifiable',
    '4. Relevant event context',
    '5. Confidence note',
    '',
    'Stay factual. Do not invent data.',
  ].join('\n');

  if (conversationContext && conversationContext.messages.length > 0) {
    return base + '\n\n' + buildConversationContext(conversationContext);
  }

  return base;
}

const REGION_KEYWORDS: Record<string, string[]> = {
  Egypt: ['egypt', 'cairo', 'alexandria', 'giza'],
  'Saudi Arabia': ['saudi arabia', 'riyadh', 'jeddah', 'dammam'],
  UAE: ['uae', 'dubai', 'abu dhabi', 'sharjah'],
  Libya: ['libya', 'tripoli', 'benghazi', 'misrata'],
  Morocco: ['morocco', 'rabat', 'casablanca', 'marrakesh'],
  Tunisia: ['tunisia', 'tunis', 'sousse'],
  Jordan: ['jordan', 'amman'],
};

/**
 * Extract topic and regions from a user query.
 */
export function extractQueryContext(query: string): { topic: string; regions: string[] } {
  const lower = query.toLowerCase();
  const regions: string[] = [];
  for (const [region, keywords] of Object.entries(REGION_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) regions.push(region);
  }
  return { topic: query.substring(0, 100), regions: regions.length > 0 ? regions : ['General'] };
}

/**
 * Update a conversation context with a new user-assistant exchange.
 */
export function updateConversationContext(
  context: ConversationContext,
  userMessage: string,
  assistantResponse: string,
  eventVector: EventVector,
): ConversationContext {
  const newMessages: ConversationMessage[] = [
    ...context.messages,
    { id: `msg-${Date.now()}-user`, role: 'user', content: userMessage, timestamp: Date.now() },
    { id: `msg-${Date.now()}-assistant`, role: 'assistant', content: assistantResponse, eventVector, timestamp: Date.now() },
  ];
  const ctx = extractQueryContext(userMessage);
  return {
    ...context,
    messages: newMessages,
    currentTopic: ctx.topic,
    regionContext: ctx.regions,
    emotionalContext: {
      dominantEmotion: eventVector.dominantEmotion,
      overallSentiment: eventVector.emotions.hope - eventVector.emotions.fear,
    },
    updatedAt: Date.now(),
  };
}

/**
 * Create a fresh conversation context.
 */
export function createConversationContext(conversationId: string, userId: string): ConversationContext {
  return {
    conversationId,
    userId,
    messages: [],
    currentTopic: '',
    regionContext: [],
    emotionalContext: { dominantEmotion: 'neutral', overallSentiment: 0 },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Heuristic check: is the current query a follow-up to a previous conversation?
 */
export function isFollowUpQuestion(currentQuery: string, conversationContext: ConversationContext): boolean {
  if (conversationContext.messages.length === 0) return false;
  const followUpPatterns = [
    /^(what about|and|how about|why|how|tell me more|explain|compare)/i,
    /(more|again|instead|also|further|elaborate)/i,
  ];
  return followUpPatterns.some((p) => p.test(currentQuery.trim()));
}
