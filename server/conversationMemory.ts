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
    .map((msg) => `${msg.role === 'user' ? 'المستخدم' : 'المساعد'}: ${msg.content}`)
    .join('\n\n');

  const contextString = `
السياق السابق للمحادثة:
الموضوع الحالي: ${context.currentTopic}
المناطق المعنية: ${context.regionContext.join(', ')}
المشاعر السائدة: ${context.emotionalContext.dominantEmotion}
الشعور العام: ${context.emotionalContext.overallSentiment > 0 ? 'إيجابي' : 'سلبي'}

السجل الأخير:
${messageHistory}

الرجاء الإجابة مع الأخذ في الاعتبار هذا السياق.
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
أنت مساعد ذكي متخصص في تحليل المشاعر الجماعية والأنماط الاجتماعية.

السؤال: ${userQuery}

البيانات المحللة:
- الموضوع الرئيسي: ${eventVector.topic}
- المشاعر: الخوف=${eventVector.emotions.fear}, الأمل=${eventVector.emotions.hope}, الغضب=${eventVector.emotions.anger}
- المناطق المتأثرة: ${eventVector.region}
- درجة التأثير: ${eventVector.impactScore}/100
- مستوى الثقة: ${eventVector.regionConfidence}%

المطلوب:
1. تحليل شامل للموقف الحالي
2. الأسباب الجذرية للمشاعر المكتشفة
3. التأثيرات المحتملة على المجتمع
4. التوصيات والحلول الممكنة
5. التوقعات المستقبلية

الرجاء تقديم إجابة محددة وواقعية بناءً على البيانات.
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
    'مصر': ['مصر', 'القاهرة', 'الإسكندرية', 'الجيزة'],
    'السعودية': ['السعودية', 'الرياض', 'جدة', 'الدمام'],
    'الإمارات': ['الإمارات', 'دبي', 'أبوظبي'],
    'ليبيا': ['ليبيا', 'طرابلس', 'بنغازي'],
    'المغرب': ['المغرب', 'الرباط', 'الدار البيضاء'],
    'تونس': ['تونس', 'تونس العاصمة'],
    'الأردن': ['الأردن', 'عمّان'],
  };

  const detectedRegions: string[] = [];
  for (const [region, keywords] of Object.entries(regionKeywords)) {
    if (keywords.some((kw) => query.includes(kw))) {
      detectedRegions.push(region);
    }
  }

  return {
    topic: query.substring(0, 100),
    regions: detectedRegions.length > 0 ? detectedRegions : ['عام'],
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
    'ماذا لو',
    'لماذا',
    'كيف',
    'هل',
    'ما التأثير',
    'ما الحل',
    'المزيد عن',
    'أكثر عن',
  ];

  return followUpKeywords.some((keyword) => currentQuery.includes(keyword));
}
