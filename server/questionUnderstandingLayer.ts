/**
 * Question Understanding Layer
 * 
 * طبقة ذكية تفهم السؤال وتحدد:
 * 1. هل يحتاج تحليل عاطفي أم لا؟
 * 2. ما نوع السؤال؟
 * 3. هل يمكن الإجابة مباشرة؟
 * 4. ما درجة الأولوية؟
 * 
 * الهدف: تجنب التحليل غير الضروري وتسريع الاستجابة
 */

import { z } from 'zod';

/**
 * أنواع الأسئلة
 */
export enum QuestionType {
  // يحتاج تحليل عاطفي
  EMOTIONAL_ANALYSIS = 'emotional_analysis',      // "ما شعور الناس تجاه...؟"
  SENTIMENT_CHECK = 'sentiment_check',            // "هل الناس خائفون من...؟"
  TREND_ANALYSIS = 'trend_analysis',              // "ما الاتجاه الحالي لـ...؟"
  IMPACT_ASSESSMENT = 'impact_assessment',        // "ما تأثير... على المجتمع؟"
  COLLECTIVE_MOOD = 'collective_mood',            // "ما مزاج الناس الآن؟"
  
  // لا يحتاج تحليل - إجابة مباشرة
  FACTUAL_QUESTION = 'factual_question',          // "كم عدد سكان مصر؟"
  DEFINITION = 'definition',                      // "ما معنى DCFT؟"
  HOW_TO = 'how_to',                              // "كيفية استخدام المنصة؟"
  GENERAL_INFO = 'general_info',                  // "ما هي DCFT؟"
  TECHNICAL_HELP = 'technical_help',              // "كيف أغير كلمة المرور؟"
  
  // غير واضح - يحتاج توضيح
  UNCLEAR = 'unclear',                            // "ماذا تقصد؟"
}

/**
 * مستويات الأولوية
 */
export enum PriorityLevel {
  IMMEDIATE = 'immediate',    // يحتاج إجابة فورية
  HIGH = 'high',              // يحتاج تحليل سريع
  NORMAL = 'normal',          // تحليل عادي
  LOW = 'low',                // يمكن تأجيله
}

/**
 * نتيجة فهم السؤال
 */
export interface QuestionUnderstandingResult {
  // معلومات السؤال
  questionType: QuestionType;
  needsAnalysis: boolean;           // هل يحتاج تحليل عاطفي؟
  needsIndices: boolean;            // هل يحتاج مؤشرات (GMI, CFI, HRI)؟
  needsGroq: boolean;               // هل يحتاج Groq للتحليل الذكي؟
  
  // الأولوية والسرعة
  priority: PriorityLevel;
  estimatedProcessingTime: number;  // بالميلي ثانية
  
  // الإجابة المباشرة (إن وجدت)
  directAnswer?: string;            // إجابة مباشرة بدون تحليل
  
  // معلومات إضافية
  detectedTopic?: string;           // الموضوع المكتشف
  detectedEntities?: string[];      // الكيانات المكتشفة (دول، أشخاص، إلخ)
  language: 'ar' | 'en';            // لغة السؤال
  confidence: number;               // درجة ثقة التصنيف (0-1)
  
  // التفاصيل
  reasoning: string;                // شرح السبب
  suggestedAction: string;          // الإجراء المقترح
}

/**
 * قاموس الكلمات المفتاحية لكل نوع سؤال
 */
const KEYWORD_PATTERNS = {
  // أسئلة تحتاج تحليل عاطفي
  [QuestionType.EMOTIONAL_ANALYSIS]: {
    ar: ['شعور', 'مشاعر', 'عاطفة', 'يشعر', 'كيف يشعر', 'ما شعور', 'ردة فعل', 'تفاعل'],
    en: ['feel', 'feeling', 'emotion', 'sentiment', 'mood', 'how people feel', 'reaction'],
  },
  
  [QuestionType.SENTIMENT_CHECK]: {
    ar: ['خائف', 'خوف', 'قلق', 'قلقين', 'متفائل', 'متشائم', 'سعيد', 'حزين', 'غاضب'],
    en: ['afraid', 'fear', 'worried', 'optimistic', 'pessimistic', 'happy', 'sad', 'angry'],
  },
  
  [QuestionType.TREND_ANALYSIS]: {
    ar: ['اتجاه', 'اتجاهات', 'ترند', 'تطور', 'تغير', 'تصاعد', 'تراجع', 'تحسن', 'تدهور'],
    en: ['trend', 'trends', 'direction', 'development', 'change', 'increase', 'decrease'],
  },
  
  [QuestionType.IMPACT_ASSESSMENT]: {
    ar: ['تأثير', 'تأثيرات', 'تأثر', 'تأثره', 'تأثرهم', 'تأثيره', 'تأثرت', 'تأثروا'],
    en: ['impact', 'effect', 'affect', 'consequence', 'influence', 'result'],
  },
  
  [QuestionType.COLLECTIVE_MOOD]: {
    ar: ['مزاج', 'مزاج الناس', 'مزاج المجتمع', 'الوضع النفسي', 'الحالة النفسية', 'الحالة العامة'],
    en: ['mood', 'collective mood', 'general mood', 'atmosphere', 'climate'],
  },
  
  // أسئلة لا تحتاج تحليل
  [QuestionType.FACTUAL_QUESTION]: {
    ar: ['كم', 'عدد', 'كم عدد', 'متى', 'أين', 'ما اسم', 'ما هي', 'ما هو'],
    en: ['how many', 'how much', 'when', 'where', 'what is', 'who is'],
  },
  
  [QuestionType.DEFINITION]: {
    ar: ['معنى', 'تعريف', 'ما معنى', 'ما تعريف', 'شرح', 'اشرح', 'وضح'],
    en: ['meaning', 'definition', 'explain', 'what does', 'what is the definition'],
  },
  
  [QuestionType.HOW_TO]: {
    ar: ['كيف', 'كيفية', 'كيف أ', 'كيف ن', 'خطوات', 'طريقة', 'طريقة ل'],
    en: ['how to', 'how can', 'how do', 'steps', 'way to', 'method'],
  },
  
  [QuestionType.TECHNICAL_HELP]: {
    ar: ['مشكلة', 'خطأ', 'لا يعمل', 'لم أستطع', 'لا أستطيع', 'كيف أصلح', 'كيف أغير'],
    en: ['problem', 'error', 'not working', 'how to fix', 'how to change', 'issue'],
  },
};

/**
 * قاموس الإجابات المباشرة
 */
const DIRECT_ANSWERS: Record<string, string> = {
  // تعريفات
  'dcft': 'DCFT (Digital Consciousness Field Theory) هي نظرية تم تطويرها من قبل أمال رضوان لقياس الوعي الجماعي الرقمي من خلال تحليل المشاعر والعواطف في البيانات الرقمية.',
  'gmi': 'GMI (Global Mood Index) - مؤشر المزاج العالمي: يقيس المزاج العام للمجتمع من -100 (متشائم جداً) إلى +100 (متفائل جداً).',
  'cfi': 'CFI (Collective Fear Index) - مؤشر الخوف الجماعي: يقيس مستوى الخوف والقلق في المجتمع من 0 إلى 100%.',
  'hri': 'HRI (Hope & Resilience Index) - مؤشر الأمل والمرونة: يقيس مستوى الأمل والقدرة على التعافي من 0 إلى 100%.',
  
  // مساعدة تقنية
  'password': 'لتغيير كلمة المرور: اذهب إلى الإعدادات > الأمان > تغيير كلمة المرور',
  'login': 'للدخول: اذهب إلى صفحة تسجيل الدخول وأدخل بريدك الإلكتروني وكلمة المرور',
  'register': 'للتسجيل: اضغط على "تسجيل جديد" وأدخل بياناتك',
};

/**
 * كشف لغة السؤال
 */
function detectLanguage(text: string): 'ar' | 'en' {
  const arabicRegex = /[\u0600-\u06FF]/g;
  const arabicChars = text.match(arabicRegex) || [];
  return arabicChars.length > text.length / 2 ? 'ar' : 'en';
}

/**
 * استخراج الموضوع من السؤال
 */
function extractTopic(text: string): string | undefined {
  // كلمات شائعة في الأسئلة
  const stopWords = ['ما', 'هل', 'كيف', 'متى', 'أين', 'من', 'لماذا', 'ماذا', 'هو', 'هي', 'هم', 'هن', 'the', 'is', 'are', 'what', 'how', 'when', 'where'];
  
  const words = text.toLowerCase().split(/\s+/).filter(w => !stopWords.includes(w) && w.length > 2);
  
  // أول 3 كلمات غير شائعة هي الموضوع
  return words.slice(0, 3).join(' ') || undefined;
}

/**
 * استخراج الكيانات (دول، أشخاص، إلخ)
 */
function extractEntities(text: string): string[] {
  const entities: string[] = [];
  
  // دول
  const countries = ['مصر', 'السعودية', 'الإمارات', 'الكويت', 'قطر', 'البحرين', 'عمان', 'اليمن', 'الأردن', 'لبنان', 'سوريا', 'العراق', 'إيران', 'تركيا', 'فلسطين'];
  countries.forEach(country => {
    if (text.includes(country)) entities.push(country);
  });
  
  // أشخاص مشهورين
  const people = ['محمد', 'أحمد', 'علي', 'فاطمة', 'عائشة', 'أمل'];
  people.forEach(person => {
    if (text.includes(person)) entities.push(person);
  });
  
  return entities;
}

/**
 * تصنيف نوع السؤال
 */
function classifyQuestionType(text: string, language: 'ar' | 'en'): QuestionType {
  const lowerText = text.toLowerCase();
  
  // البحث في الكلمات المفتاحية
  for (const [type, patterns] of Object.entries(KEYWORD_PATTERNS)) {
    const keywords = patterns[language] || [];
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return type as QuestionType;
    }
  }
  
  // إذا لم نجد تطابق، نعتبره غير واضح
  return QuestionType.UNCLEAR;
}

/**
 * حساب درجة الثقة
 */
function calculateConfidence(questionType: QuestionType, text: string): number {
  // أسئلة واضحة جداً
  if ([QuestionType.FACTUAL_QUESTION, QuestionType.DEFINITION].includes(questionType)) {
    return 0.95;
  }
  
  // أسئلة عاطفية واضحة
  if ([QuestionType.EMOTIONAL_ANALYSIS, QuestionType.SENTIMENT_CHECK].includes(questionType)) {
    return 0.90;
  }
  
  // أسئلة أخرى
  if (questionType !== QuestionType.UNCLEAR) {
    return 0.75;
  }
  
  // غير واضحة
  return 0.40;
}

/**
 * الدالة الرئيسية: فهم السؤال
 */
export async function understandQuestion(
  question: string
): Promise<QuestionUnderstandingResult> {
  const language = detectLanguage(question);
  const questionType = classifyQuestionType(question, language);
  const confidence = calculateConfidence(questionType, question);
  const topic = extractTopic(question);
  const entities = extractEntities(question);
  
  // تحديد ما إذا كان يحتاج تحليل
  const needsAnalysis = [
    QuestionType.EMOTIONAL_ANALYSIS,
    QuestionType.SENTIMENT_CHECK,
    QuestionType.TREND_ANALYSIS,
    QuestionType.IMPACT_ASSESSMENT,
    QuestionType.COLLECTIVE_MOOD,
  ].includes(questionType);
  
  // تحديد ما إذا كان يحتاج مؤشرات
  const needsIndices = [
    QuestionType.COLLECTIVE_MOOD,
    QuestionType.TREND_ANALYSIS,
  ].includes(questionType);
  
  // تحديد ما إذا كان يحتاج Groq
  const needsGroq = [
    QuestionType.EMOTIONAL_ANALYSIS,
    QuestionType.IMPACT_ASSESSMENT,
    QuestionType.TREND_ANALYSIS,
  ].includes(questionType);
  
  // تحديد الأولوية
  let priority = PriorityLevel.NORMAL;
  if (questionType === QuestionType.TECHNICAL_HELP) {
    priority = PriorityLevel.IMMEDIATE;
  } else if (needsAnalysis) {
    priority = PriorityLevel.HIGH;
  } else if (questionType === QuestionType.UNCLEAR) {
    priority = PriorityLevel.LOW;
  }
  
  // تقدير وقت المعالجة
  let estimatedProcessingTime = 100; // base time
  if (needsAnalysis) estimatedProcessingTime += 2000; // DCFT + Graph
  if (needsGroq) estimatedProcessingTime += 1500;     // Groq
  if (needsIndices) estimatedProcessingTime += 500;   // Indices
  
  // الإجابة المباشرة
  let directAnswer: string | undefined;
  if (!needsAnalysis) {
    // البحث عن إجابة مباشرة
    const topicLower = topic?.toLowerCase() || '';
    for (const [key, answer] of Object.entries(DIRECT_ANSWERS)) {
      if (topicLower.includes(key)) {
        directAnswer = answer;
        break;
      }
    }
  }
  
  // الشرح والإجراء المقترح
  let reasoning = '';
  let suggestedAction = '';
  
  switch (questionType) {
    case QuestionType.EMOTIONAL_ANALYSIS:
      reasoning = 'سؤال يطلب تحليل مشاعر الناس - يحتاج تحليل عاطفي شامل';
      suggestedAction = 'تشغيل DCFT + Graph Pipeline + Groq للتحليل الشامل';
      break;
      
    case QuestionType.SENTIMENT_CHECK:
      reasoning = 'سؤال يطلب التحقق من مشاعر محددة - يحتاج تحليل سريع';
      suggestedAction = 'تشغيل DCFT + Graph Pipeline';
      break;
      
    case QuestionType.TREND_ANALYSIS:
      reasoning = 'سؤال عن الاتجاهات - يحتاج مؤشرات وتحليل زمني';
      suggestedAction = 'تشغيل DCFT + Indices + Groq';
      break;
      
    case QuestionType.IMPACT_ASSESSMENT:
      reasoning = 'سؤال عن التأثير - يحتاج تحليل عميق';
      suggestedAction = 'تشغيل DCFT + Graph + Groq للتحليل الشامل';
      break;
      
    case QuestionType.COLLECTIVE_MOOD:
      reasoning = 'سؤال عن مزاج المجتمع - يحتاج مؤشرات حية';
      suggestedAction = 'عرض المؤشرات الحية (GMI, CFI, HRI)';
      break;
      
    case QuestionType.FACTUAL_QUESTION:
      reasoning = 'سؤال واقعي بسيط - لا يحتاج تحليل عاطفي';
      suggestedAction = 'البحث في قاعدة البيانات أو إجابة مباشرة';
      break;
      
    case QuestionType.DEFINITION:
      reasoning = 'سؤال عن تعريف - إجابة مباشرة متاحة';
      suggestedAction = 'عرض التعريف المباشر';
      break;
      
    case QuestionType.HOW_TO:
      reasoning = 'سؤال عن كيفية - يحتاج خطوات أو شرح';
      suggestedAction = 'عرض الخطوات والتعليمات';
      break;
      
    case QuestionType.TECHNICAL_HELP:
      reasoning = 'سؤال تقني - يحتاج مساعدة فورية';
      suggestedAction = 'عرض الحل التقني مباشرة';
      break;
      
    default:
      reasoning = 'السؤال غير واضح - قد يحتاج توضيح';
      suggestedAction = 'طلب توضيح من المستخدم';
  }
  
  return {
    questionType,
    needsAnalysis,
    needsIndices,
    needsGroq,
    priority,
    estimatedProcessingTime,
    directAnswer,
    detectedTopic: topic,
    detectedEntities: entities,
    language,
    confidence,
    reasoning,
    suggestedAction,
  };
}

/**
 * دالة مساعدة: هل يحتاج تحليل؟
 */
export function shouldAnalyze(result: QuestionUnderstandingResult): boolean {
  return result.needsAnalysis && result.confidence > 0.5;
}

/**
 * دالة مساعدة: هل يمكن الإجابة مباشرة؟
 */
export function canAnswerDirectly(result: QuestionUnderstandingResult): boolean {
  return !result.needsAnalysis && result.directAnswer !== undefined;
}

/**
 * دالة مساعدة: الحصول على الإجابة المباشرة
 */
export function getDirectAnswer(result: QuestionUnderstandingResult): string | null {
  return result.directAnswer || null;
}
