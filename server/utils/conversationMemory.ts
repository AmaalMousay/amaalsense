import { t } from "../_core/i18n";
import { EventVector } from './graphPipeline';

/**
 * Conversation Memory System
 * Maintains multi-turn context for intelligent follow-up questions
 */

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
 * Build context string from conversation history
 */
export function buildConversationContext(context: ConversationContext): string {
  const recentMessages = context.messages.slice(-5); // Last 5 messages
  const messageHistory = recentMessages
    .map((msg) => `${msg.role === 'user' ? t('auto.utils_conversationMemory.34.d79fe04a', 'ar') : t('auto.utils_conversationMemory.33.5af1a8ad', 'ar')}: ${msg.content}`)
    .join('\n\n');

  const contextString = `
  :
 : ${context.currentTopic}
 : ${context.regionContext.join(', ')}
 : ${context.emotionalContext.dominantEmotion}
 : ${context.emotionalContext.overallSentiment > 0 ? t('auto.utils_conversationMemory.32.3c9380a2', 'ar') : t('auto.utils_conversationMemory.31.a5ed0453', 'ar')}

 :
${messageHistory}

       .
`;

  return contextString;
}

/**
 * Create enhanced prompt with conversation context
 */
export function createContextAwarePrompt(
  userQuery: string,
  eventVector: EventVector,
  conversationContext?: ConversationContext
): string {
  const basePrompt = `
         .

: ${userQuery}

 :
-  : ${eventVector.topic}
- : =${eventVector.emotions.fear}, =${eventVector.emotions.hope}, =${eventVector.emotions.anger}
-  : ${eventVector.region}
-  : ${eventVector.impactScore}/100
-  : ${eventVector.regionConfidence}%

:
1.    
2.    
3.    
4.   
5.  

       .
`;

  if (conversationContext && conversationContext.messages.length > 0) {
    return basePrompt + '\n\n' + buildConversationContext(conversationContext);
  }

  return basePrompt;
}

/**
 * Extract topic and regions from user query
 */
export function extractQueryContext(query: string): {
  topic: string;
  regions: string[];
} {
  const regionKeywords: { [key: string]: string[] } = {
    '': [t('auto.utils_conversationMemory.30.9f5f187b', 'ar'), t('auto.utils_conversationMemory.29.93019aa0', 'ar'), t('auto.utils_conversationMemory.28.a26da63f', 'ar'), t('auto.utils_conversationMemory.27.593d7ba1', 'ar')],
    '': [t('auto.utils_conversationMemory.26.cd8d189f', 'ar'), t('auto.utils_conversationMemory.25.ec7f247f', 'ar'), t('auto.utils_conversationMemory.24.de8dd0bd', 'ar'), t('auto.utils_conversationMemory.23.822c2b16', 'ar')],
    '': [t('auto.utils_conversationMemory.22.9bc10b8c', 'ar'), t('auto.utils_conversationMemory.21.4a07a7fb', 'ar'), t('auto.utils_conversationMemory.20.cd666d65', 'ar')],
    '': [t('auto.utils_conversationMemory.19.251aff72', 'ar'), t('auto.utils_conversationMemory.18.da7424b2', 'ar'), t('auto.utils_conversationMemory.17.63a58999', 'ar')],
    '': [t('auto.utils_conversationMemory.16.94b11d17', 'ar'), t('auto.utils_conversationMemory.15.ae6723ec', 'ar'), t('auto.utils_conversationMemory.14.e4002e13', 'ar')],
    '': [t('auto.utils_conversationMemory.13.ba84e974', 'ar'), t('auto.utils_conversationMemory.12.fb618b1a', 'ar')],
    '': [t('auto.utils_conversationMemory.11.bdd0aaf6', 'ar'), t('auto.utils_conversationMemory.10.0304eff4', 'ar')],
  };

  const detectedRegions: string[] = [];
  for (const [region, keywords] of Object.entries(regionKeywords)) {
    if (keywords.some((kw) => query.includes(kw))) {
      detectedRegions.push(region);
    }
  }

  return {
    topic: query.substring(0, 100),
    regions: detectedRegions.length > 0 ? detectedRegions : [t('auto.utils_conversationMemory.9.17859487', 'ar')],
  };
}

/**
 * Update conversation context with new message and analysis
 */
export function updateConversationContext(
  context: ConversationContext,
  userMessage: string,
  assistantResponse: string,
  eventVector: EventVector
): ConversationContext {
  const newMessages: ConversationMessage[] = [
    ...context.messages,
    {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    },
    {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: assistantResponse,
      eventVector,
      timestamp: Date.now(),
    },
  ];

  const queryContext = extractQueryContext(userMessage);

  return {
    ...context,
    messages: newMessages,
    currentTopic: queryContext.topic,
    regionContext: queryContext.regions,
    emotionalContext: {
      dominantEmotion: eventVector.dominantEmotion,
      overallSentiment: eventVector.emotions.hope - eventVector.emotions.fear,
    },
    updatedAt: Date.now(),
  };
}

/**
 * Create new conversation context
 */
export function createConversationContext(
  conversationId: string,
  userId: string
): ConversationContext {
  return {
    conversationId,
    userId,
    messages: [],
    currentTopic: '',
    regionContext: [],
    emotionalContext: {
      dominantEmotion: 'neutral',
      overallSentiment: 0,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Check if follow-up question is related to previous context
 */
export function isFollowUpQuestion(
  currentQuery: string,
  conversationContext: ConversationContext
): boolean {
  if (conversationContext.messages.length === 0) return false;

  const followUpKeywords = [
    t('auto.utils_conversationMemory.8.9dd0db2c', 'ar'),
    t('auto.utils_conversationMemory.7.dc0f9a10', 'ar'),
    t('auto.utils_conversationMemory.6.daa59aa1', 'ar'),
    t('auto.utils_conversationMemory.5.2500c161', 'ar'),
    t('auto.utils_conversationMemory.4.34a86013', 'ar'),
    t('auto.utils_conversationMemory.3.979407ea', 'ar'),
    t('auto.utils_conversationMemory.2.c3612400', 'ar'),
    t('auto.utils_conversationMemory.1.f9620a18', 'ar'),
  ];

  return followUpKeywords.some((keyword) => currentQuery.includes(keyword));
}
