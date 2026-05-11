/**
 * DYNAMIC TEMPLATE SYSTEM - Response Personality Layer
 * يتحكم في نبرة الرد، طوله، وكيفية التفاعل مع المستخدم بناءً على سياق الحوار.
 */

export interface UserProfileContext {
  userLevel: 'beginner' | 'intermediate' | 'expert' | 'professional';
  interests: string[];
  preferredTone: 'formal' | 'casual' | 'empathetic' | 'analytical';
  conversationCount: number;
  messageCount: number;
  lastActive: Date;
}

export interface TemplateContext {
  turnCount: number;
  previousTopics: string[];
  currentTopic: string;
  questionsAsked: string[];
  cfi: number;
  gmi: number;
  userQuestion?: string;
  userLevel: 'beginner' | 'intermediate' | 'expert' | 'professional';
  conversationDepth: 'initial' | 'follow_up' | 'deep_conversation';
  emotionalState: 'stable' | 'volatile' | 'crisis' | 'optimistic';
}

export interface TemplateStyle {
  tone: 'formal' | 'casual' | 'empathetic' | 'analytical';
  responseLength: 'short' | 'moderate' | 'detailed';
  includeNumbers: boolean;
  useEmoji: boolean;
}

/**
 * بناء سياق القالب بناءً على الحوار الحالي
 */
export function buildTemplateContext(
  turnCount: number,
  previousTopics: string[],
  currentTopic: string,
  questionsAsked: string[],
  cfi: number,
  gmi: number,
  userQuestion?: string
): TemplateContext {
  // تحديد مستوى المستخدم بناءً على طبيعة الأسئلة (تبسيط للديمو)
  const isDeep = turnCount > 3 || (userQuestion?.length || 0) > 100;
  
  return {
    turnCount,
    previousTopics,
    currentTopic,
    questionsAsked,
    cfi,
    gmi,
    userQuestion,
    userLevel: isDeep ? 'expert' : 'beginner',
    conversationDepth: turnCount === 1 ? 'initial' : turnCount < 4 ? 'follow_up' : 'deep_conversation',
    emotionalState: cfi > 70 ? 'crisis' : gmi > 30 ? 'optimistic' : 'stable'
  };
}

/**
 * بناء سياق القالب مع بروفايل المستخدم
 */
export function buildTemplateContextWithProfile(
  turnCount: number,
  previousTopics: string[],
  currentTopic: string,
  questionsAsked: string[],
  cfi: number,
  gmi: number,
  userQuestion: string | undefined,
  profile: UserProfileContext
): TemplateContext {
  const context = buildTemplateContext(turnCount, previousTopics, currentTopic, questionsAsked, cfi, gmi, userQuestion);
  return {
    ...context,
    userLevel: profile.userLevel
  };
}

/**
 * تحديد أسلوب الرد بناءً على السياق
 */
export function buildTemplateStyle(context: TemplateContext): TemplateStyle {
  if (context.userLevel === 'professional') {
    return { tone: 'analytical', responseLength: 'detailed', includeNumbers: true, useEmoji: false };
  }
  
  if (context.emotionalState === 'crisis') {
    return { tone: 'empathetic', responseLength: 'moderate', includeNumbers: true, useEmoji: false };
  }

  return { tone: 'casual', responseLength: 'moderate', includeNumbers: false, useEmoji: true };
}

/**
 * توليد مقدمة ديناميكية
 */
export function generateDynamicIntro(context: TemplateContext, topic: string): string {
  if (context.conversationDepth === 'initial') {
    return `بناءً على طلبك، قمت بتحليل الوعي الرقمي حول **${topic}**. إليك التقرير المحدث:\n\n`;
  }
  return '';
}

/**
 * توليد خاتمة ديناميكية
 */
export function generateDynamicClosing(context: TemplateContext, style: TemplateStyle): string {
  const questions = [
    `هل تريد التعمق أكثر في ${context.currentTopic}؟`,
    `كيف ترى تأثير هذه الأخبار على منطقتك؟`,
    `هل تريد مقارنة هذه البيانات بفترة سابقة؟`
  ];
  return questions[Math.floor(Math.random() * questions.length)];
}

/**
 * تعديل طول المحتوى
 */
export function adjustContentLength(content: string, style: TemplateStyle): string {
  if (style.responseLength === 'short' && content.length > 200) {
    return content.substring(0, 197) + '...';
  }
  return content;
}

/**
 * تنسيق الأرقام
 */
export function formatNumbers(content: string, style: TemplateStyle): string {
  if (!style.includeNumbers) {
    // استبدال الأرقام بوصف لغوي (تبسيط)
    return content.replace(/\d+%/g, 'نسبة ملحوظة');
  }
  return content;
}
