/**
 * Session Cognitive Context
 * ذاكرة سياقية مستمرة تحفظ السياق بين الأسئلة
 * 
 * المشكلة التي يحلها:
 * - لما تسأل عن إندونيسيا ثم تسأل "ما المخاطر؟"
 * - النظام كان ينسى إندونيسيا ويتكلم عن الذهب العالمي!
 * 
 * الحل:
 * - حفظ السياق (الدولة، المجال، الموضوع، الدور)
 * - ربط أسئلة المتابعة بالسياق السابق
 */

export interface SessionContext {
  sessionId: string;
  
  // السياق الجغرافي
  country?: string;
  region?: string;
  
  // السياق الموضوعي
  domain?: string;  // politics, economy, health, etc.
  topic?: string;   // الموضوع المحدد
  subTopic?: string;
  
  // السياق المعرفي
  cognitiveLens?: string;  // العدسة المعرفية المستخدمة
  analysisDepth?: 'shallow' | 'medium' | 'deep';
  
  // سياق المستخدم
  userRole?: 'journalist' | 'researcher' | 'politician' | 'economist' | 'general';
  
  // تاريخ الأسئلة في الجلسة
  questionHistory: QuestionRecord[];
  
  // الكيانات المذكورة
  mentionedEntities: string[];
  
  // الطابع الزمني
  createdAt: Date;
  lastUpdatedAt: Date;
}

export interface QuestionRecord {
  question: string;
  intent: QuestionIntent;
  timestamp: Date;
  extractedContext: ExtractedContext;
}

export interface QuestionIntent {
  type: 'why' | 'what' | 'how' | 'risks' | 'recommendation' | 'whatif' | 'comparison' | 'followup' | 'clarification';
  isFollowUp: boolean;
  requiresContext: boolean;
}

export interface ExtractedContext {
  country?: string;
  domain?: string;
  topic?: string;
  entities?: string[];
  timeframe?: string;
}

// مخزن الجلسات في الذاكرة
const sessionStore = new Map<string, SessionContext>();

/**
 * إنشاء أو استرجاع جلسة
 */
export function getOrCreateSession(sessionId: string): SessionContext {
  if (sessionStore.has(sessionId)) {
    return sessionStore.get(sessionId)!;
  }
  
  const newSession: SessionContext = {
    sessionId,
    questionHistory: [],
    mentionedEntities: [],
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
  };
  
  sessionStore.set(sessionId, newSession);
  return newSession;
}

/**
 * تحديث سياق الجلسة بناءً على سؤال جديد
 */
export function updateSessionContext(
  sessionId: string,
  question: string,
  extractedContext: ExtractedContext
): SessionContext {
  const session = getOrCreateSession(sessionId);
  
  // تحديد نوع السؤال
  const intent = classifyQuestionIntent(question, session);
  
  // إذا كان سؤال متابعة، نحتفظ بالسياق السابق
  if (intent.isFollowUp && intent.requiresContext) {
    // لا نغير الدولة أو المجال إذا لم يُذكر صراحة
    if (extractedContext.country) {
      session.country = extractedContext.country;
    }
    if (extractedContext.domain) {
      session.domain = extractedContext.domain;
    }
    if (extractedContext.topic) {
      session.topic = extractedContext.topic;
    }
  } else {
    // سؤال جديد - نحدث السياق بالكامل
    if (extractedContext.country) session.country = extractedContext.country;
    if (extractedContext.domain) session.domain = extractedContext.domain;
    if (extractedContext.topic) session.topic = extractedContext.topic;
  }
  
  // إضافة الكيانات المذكورة
  if (extractedContext.entities) {
    const uniqueEntities = new Set([...session.mentionedEntities, ...extractedContext.entities]);
    session.mentionedEntities = Array.from(uniqueEntities);
  }
  
  // تسجيل السؤال في التاريخ
  session.questionHistory.push({
    question,
    intent,
    timestamp: new Date(),
    extractedContext,
  });
  
  session.lastUpdatedAt = new Date();
  sessionStore.set(sessionId, session);
  
  return session;
}

/**
 * تصنيف نية السؤال
 */
export function classifyQuestionIntent(question: string, session: SessionContext): QuestionIntent {
  const q = question.toLowerCase();
  
  // أسئلة المتابعة القصيرة
  const followUpPatterns = [
    /^ما (المخاطر|التوصية|التوقعات)\??$/,
    /^(لماذا|كيف|متى|أين)\??$/,
    /^ماذا (لو|يعني)\??$/,
    /^هل\s/,
    /^وماذا عن/,
    /^ماذا عن/,
  ];
  
  const isFollowUp = session.questionHistory.length > 0 && (
    followUpPatterns.some(p => p.test(q)) ||
    question.length < 30
  );
  
  // تحديد نوع السؤال
  let type: QuestionIntent['type'] = 'what';
  
  if (/لماذا|ليش|شن السبب/.test(q)) {
    type = 'why';
  } else if (/كيف|شلون/.test(q)) {
    type = 'how';
  } else if (/مخاطر|خطر|تهديد/.test(q)) {
    type = 'risks';
  } else if (/توصية|نصيحة|اقتراح|شن نسوي/.test(q)) {
    type = 'recommendation';
  } else if (/ماذا لو|لو صار|شن لو/.test(q)) {
    type = 'whatif';
  } else if (/مقارنة|الفرق|vs|مقابل/.test(q)) {
    type = 'comparison';
  } else if (isFollowUp && /وضح|اشرح|فصل/.test(q)) {
    type = 'clarification';
  } else if (isFollowUp) {
    type = 'followup';
  }
  
  return {
    type,
    isFollowUp,
    requiresContext: isFollowUp || /المخاطر|التوصية|التوقعات|ماذا لو/.test(q),
  };
}

/**
 * استخراج السياق من السؤال
 */
export function extractContextFromQuestion(question: string): ExtractedContext {
  const context: ExtractedContext = {};
  
  // استخراج الدولة
  const countryPatterns: Record<string, string[]> = {
    'libya': ['ليبيا', 'الليبي', 'الليبية', 'طرابلس', 'بنغازي', 'libya'],
    'egypt': ['مصر', 'المصري', 'المصرية', 'القاهرة', 'egypt'],
    'saudi': ['السعودية', 'السعودي', 'الرياض', 'saudi'],
    'uae': ['الإمارات', 'الإماراتي', 'دبي', 'أبوظبي', 'uae'],
    'indonesia': ['إندونيسيا', 'الإندونيسي', 'جاكرتا', 'indonesia'],
    'usa': ['أمريكا', 'الأمريكي', 'واشنطن', 'usa', 'america'],
    'global': ['العالم', 'عالمي', 'دولي', 'global'],
  };
  
  for (const [country, patterns] of Object.entries(countryPatterns)) {
    if (patterns.some(p => question.toLowerCase().includes(p.toLowerCase()))) {
      context.country = country;
      break;
    }
  }
  
  // استخراج المجال
  const domainPatterns: Record<string, string[]> = {
    'politics': ['سياسة', 'سياسي', 'انتخابات', 'حكومة', 'برلمان', 'رئيس'],
    'economy': ['اقتصاد', 'اقتصادي', 'أسعار', 'تضخم', 'بنك', 'عملة', 'دينار', 'دولار'],
    'health': ['صحة', 'صحي', 'مرض', 'وباء', 'مستشفى', 'طبي'],
    'education': ['تعليم', 'تعليمي', 'مدرسة', 'جامعة', 'طالب'],
    'security': ['أمن', 'أمني', 'عسكري', 'صراع', 'حرب', 'ميليشيا'],
    'environment': ['بيئة', 'مناخ', 'تلوث', 'طقس'],
    'technology': ['تكنولوجيا', 'تقنية', 'ذكاء اصطناعي', 'إنترنت'],
    'society': ['مجتمع', 'اجتماعي', 'هجرة', 'شباب', 'بطالة'],
  };
  
  for (const [domain, patterns] of Object.entries(domainPatterns)) {
    if (patterns.some(p => question.toLowerCase().includes(p.toLowerCase()))) {
      context.domain = domain;
      break;
    }
  }
  
  // استخراج الموضوع (الجملة الرئيسية)
  // نأخذ الموضوع من السؤال بعد إزالة كلمات الاستفهام
  const topicMatch = question
    .replace(/^(ما|ماذا|كيف|لماذا|هل|متى|أين|من|شن|شلون|ليش)\s*/i, '')
    .replace(/\?|؟/g, '')
    .trim();
  
  if (topicMatch.length > 5) {
    context.topic = topicMatch.substring(0, 100);
  }
  
  return context;
}

/**
 * الحصول على السياق الكامل للسؤال الحالي
 * يدمج السياق المستخرج مع سياق الجلسة
 */
export function getFullContext(sessionId: string, question: string): {
  session: SessionContext;
  currentContext: ExtractedContext;
  effectiveContext: {
    country: string;
    domain: string;
    topic: string;
    isFollowUp: boolean;
    questionNumber: number;
  };
} {
  const extractedContext = extractContextFromQuestion(question);
  const session = updateSessionContext(sessionId, question, extractedContext);
  
  // السياق الفعّال = السياق المستخرج + السياق المحفوظ
  const effectiveContext = {
    country: extractedContext.country || session.country || 'global',
    domain: extractedContext.domain || session.domain || 'general',
    topic: extractedContext.topic || session.topic || question,
    isFollowUp: session.questionHistory.length > 1,
    questionNumber: session.questionHistory.length,
  };
  
  return {
    session,
    currentContext: extractedContext,
    effectiveContext,
  };
}

/**
 * إعادة تعيين الجلسة
 */
export function resetSession(sessionId: string): void {
  sessionStore.delete(sessionId);
}

/**
 * الحصول على ملخص الجلسة
 */
export function getSessionSummary(sessionId: string): string {
  const session = sessionStore.get(sessionId);
  if (!session) return 'لا توجد جلسة نشطة';
  
  const parts: string[] = [];
  
  if (session.country) parts.push(`الدولة: ${session.country}`);
  if (session.domain) parts.push(`المجال: ${session.domain}`);
  if (session.topic) parts.push(`الموضوع: ${session.topic}`);
  parts.push(`عدد الأسئلة: ${session.questionHistory.length}`);
  
  return parts.join(' | ');
}

/**
 * تصدير الدوال
 */
export const SessionContextManager = {
  getOrCreateSession,
  updateSessionContext,
  classifyQuestionIntent,
  extractContextFromQuestion,
  getFullContext,
  resetSession,
  getSessionSummary,
};
