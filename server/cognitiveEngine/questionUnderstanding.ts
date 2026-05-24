import { smartJsonChat, smartInvokeLLM } from '../_core/llm';
import { invokeLLM } from '../_core/llm';

// Types of questions
export type QuestionType = 
  | 'why'           // لماذا - seeking causes
  | 'what'          // ما/ماذا - seeking information
  | 'how'           // كيف - seeking process/method
  | 'should'        // هل يجب - seeking recommendation
  | 'will'          // هل سيحدث - seeking prediction
  | 'compare'       // مقارنة - seeking comparison
  | 'what_if'       // ماذا لو - seeking scenario
  | 'when'          // متى - seeking timing
  | 'who'           // من - seeking actors
  | 'explain'       // اشرح - seeking explanation
  | 'greeting'      // تحية - greetings/social talk
  | 'general';      // General inquiry

// What the user really wants
export type RealIntent = 
  | 'make_decision'     // They need to decide something
  | 'understand_cause'  // They want to understand why
  | 'predict_future'    // They want to know what will happen
  | 'assess_risk'       // They want to know the risks
  | 'find_opportunity'  // They're looking for opportunities
  | 'validate_belief'   // They want confirmation of their belief
  | 'learn_concept'     // They want to learn/understand
  | 'compare_options'   // They're comparing choices
  | 'get_reassurance'   // They're worried and need comfort
  | 'socialize'         // Greetings, small talk, pleasantries
  | 'explore_scenario'; // They're exploring possibilities

// Emotional state of the asker
export type EmotionalNeed = 
  | 'anxious'       // Worried, needs reassurance
  | 'curious'       // Just curious, wants to learn
  | 'urgent'        // Needs answer NOW
  | 'skeptical'     // Doubting, needs proof
  | 'hopeful'       // Looking for good news
  | 'confused'      // Doesn't understand, needs clarity
  | 'decisive'      // Ready to act, needs direction
  | 'neutral';      // No strong emotion

// Types of data sources
export type SourceType = 
  | 'emotion_indicators'  // GMI, CFI, HRI
  | 'economic_data'       // Currencies, commodities
  | 'news'                // Recent news
  | 'historical'          // Past data/trends
  | 'expert_knowledge'    // Domain knowledge
  | 'comparison_data'     // Data for comparison
  | 'scenario_models';    // What-if models

// How to structure the response
export interface ResponseStrategy {
  style: 'analytical' | 'advisory' | 'educational' | 'reassuring' | 'comparative';
  depth: 'brief' | 'detailed' | 'comprehensive';
  includeData: boolean;
  includeRecommendation: boolean;
  includeScenarios: boolean;
  tone: 'formal' | 'conversational' | 'urgent';
}

// What the user is really asking
export interface DeepQuestion {
  // The literal question
  surface: {
    text: string;           // Original question text
    topic: string;          // Main topic (ذهب، دولار، تعليم...)
    questionType: QuestionType;
    keywords: string[];
  };
  
  // What they really want to know
  deep: {
    realIntent: RealIntent;      // What they actually want
    implicitQuestions: string[]; // Questions they didn't ask but need answered
    emotionalNeed: EmotionalNeed; // Are they worried? Curious? Deciding?
    urgency: 'immediate' | 'planning' | 'learning';
  };
  
  // Context clues
  context: {
    isFollowUp: boolean;         // Part of a conversation?
    previousTopic?: string;      // What were we talking about?
    userExpertise: 'beginner' | 'intermediate' | 'expert';
    language: 'ar' | 'en';
  };
  
  // What sources we need
  requiredSources: SourceType[];
  
  // How to respond
  responseStrategy: ResponseStrategy;
}


/**
 * Understand a question deeply using AI
 */
export async function understandQuestion(
  question: string,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<DeepQuestion> {
  const systemPrompt = `You are the AmalSense Cognitive Analyzer. Your task is to analyze a user's question and extract its deep meaning, intent, and emotional context.
  Respond ONLY with a valid JSON object matching this structure:
  {
    "surface": {
      "text": "string",
      "topic": "string (the main subject, e.g., Gold, Dollar, Elections)",
      "questionType": "why | what | how | should | will | compare | what_if | when | who | explain | greeting | general",
      "keywords": ["string"]
    },
    "deep": {
      "realIntent": "make_decision | understand_cause | predict_future | assess_risk | find_opportunity | validate_belief | learn_concept | compare_options | get_reassurance | socialize | explore_scenario",
      "implicitQuestions": ["string (questions they didn't ask but are relevant)"],
      "emotionalNeed": "anxious | curious | urgent | skeptical | hopeful | confused | decisive | neutral",
      "urgency": "immediate | planning | learning"
    },
    "context": {
      "isFollowUp": boolean,
      "previousTopic": "string | null",
      "userExpertise": "beginner | intermediate | expert",
      "language": "ar | en"
    },
    "requiredSources": ["emotion_indicators", "economic_data", "news", "historical", "expert_knowledge", "comparison_data", "scenario_models"],
    "responseStrategy": {
      "style": "analytical | advisory | educational | reassuring | comparative",
      "depth": "brief | detailed | comprehensive",
      "includeData": boolean,
      "includeRecommendation": boolean,
      "includeScenarios": boolean,
      "tone": "formal | conversational | urgent"
    }
  }`;

  const userMessage = `Analyze this question: "${question}"
  ${conversationHistory ? `Conversation History Summary: ${conversationHistory.map(m => m.content).join(' | ')}` : ''}`;

  try {
    const analysis = await smartJsonChat(systemPrompt, userMessage, 'question_understanding');
    
    // Fallback/Validation
    return {
      surface: {
        text: question,
        topic: analysis.surface?.topic || 'General',
        questionType: analysis.surface?.questionType || 'general',
        keywords: analysis.surface?.keywords || []
      },
      deep: {
        realIntent: analysis.deep?.realIntent || 'learn_concept',
        implicitQuestions: analysis.deep?.implicitQuestions || [],
        emotionalNeed: analysis.deep?.emotionalNeed || 'neutral',
        urgency: analysis.deep?.urgency || 'learning'
      },
      context: {
        isFollowUp: conversationHistory ? conversationHistory.length > 0 : false,
        previousTopic: analysis.context?.previousTopic || null,
        userExpertise: analysis.context?.userExpertise || 'beginner',
        language: analysis.context?.language || (/[a-zA-Z]/.test(question) ? 'en' : 'ar')
      },
      requiredSources: analysis.requiredSources || ['emotion_indicators'],
      responseStrategy: analysis.responseStrategy || {
        style: 'analytical',
        depth: 'detailed',
        includeData: true,
        includeRecommendation: true,
        includeScenarios: false,
        tone: 'conversational'
      }
    };
  } catch (error) {
    console.error('LLM Question Understanding failed, falling back to basic analysis:', error);
    // Return a basic structure if AI fails
    return {
      surface: { text: question, topic: 'General', questionType: 'general', keywords: [] },
      deep: { realIntent: 'learn_concept', implicitQuestions: [], emotionalNeed: 'neutral', urgency: 'learning' },
      context: { isFollowUp: false, userExpertise: 'beginner', language: 'ar' },
      requiredSources: ['emotion_indicators'],
      responseStrategy: { style: 'analytical', depth: 'detailed', includeData: true, includeRecommendation: false, includeScenarios: false, tone: 'conversational' }
    };
  }
}

/**
 * استخراج الموضوع الأساسي من النص
 */
export function extractTopic(text: string): string {
  // منطق بسيط لاستخراج الموضوع الأساسي
  const topics = text.split(' ').filter(word => word.length > 4);
  return topics[0] || 'General';
}


// =============================================================================
// LAYER 4 COMPATIBILITY: LAYER-1 QUESTION UNDERSTANDING
// =============================================================================

/**
 * LAYER 1: Question Understanding
 * 
 * الطبقة الأولى - فهم السؤال فقط
 * الوظيفة الوحيدة: فهم السؤال وإرساله للمحرك الموحد
 * 
 * لا تقوم بـ:
 * - تحليل العواطف
 * - توليد الإجابات
 * - أي معالجة أخرى
 * 
 * فقط تفهم السؤال وتستخرج المعلومات الأساسية
 */

export interface Layer1Output {
  // المعلومات الأساسية
  originalQuestion: string;
  language: string;
  questionType: Layer1QuestionType;
  
  // الكيانات المستخرجة
  entities: {
    topics: string[];
    people: string[];
    locations: string[];
    organizations: string[];
  };
  
  // فحوصات أساسية
  hasFactualError: boolean;
  factualErrorDescription?: string;
  
  // حالة السؤال
  clarificationNeeded: boolean;
  clarificationReason?: string;
  
  // معلومات الثقة
  confidence: number; // 0-100
  
  // معلومات إضافية
  timeContext?: string; // "past", "present", "future"
  geographicContext?: {
    countryCode?: string;
    locationName?: string;
    region?: string;
  };
  isComparative: boolean;
  isOpinionBased: boolean;
  
  // للمحرك الموحد
  readyForAnalysis: boolean;
  suggestedAnalysisType?: AnalysisType;
}

export type Layer1QuestionType = 
  | "sentiment" // رأي الناس
  | "factual" // حقيقة معينة
  | "opinion" // رأي شخصي
  | "trend" // اتجاه عام
  | "comparison" // مقارنة
  | "explanation" // شرح
  | "prediction" // توقع
  | "recommendation" // توصية
  | "other";

export type AnalysisType =
  | "emotion_analysis"
  | "trend_detection"
  | "sentiment_analysis"
  | "fact_checking"
  | "comparison_analysis"
  | "direct_answer";

/**
 * Layer 1: فهم السؤال فقط
 * 
 * الإدخال: السؤال من المستخدم
 * الإخراج: معلومات مفصلة عن السؤال
 * 
 * لا تقوم بـ:
 * - تحليل العواطف
 * - توليد الإجابات
 * - استدعاء طبقات أخرى
 */
export async function layer1QuestionUnderstanding(
  question: string,
  language: string = "ar"
): Promise<Layer1Output> {
  try {
    // استخدم LLM لفهم السؤال فقط
    const response = await smartInvokeLLM({
      messages: [
        {
          role: "system",
          content: `أنت محلل أسئلة متخصص. وظيفتك الوحيدة هي فهم السؤال واستخراج المعلومات الأساسية.
          
لا تقوم بـ:
- تحليل العواطف
- توليد الإجابات
- أي معالجة أخرى

فقط افهم السؤال واستخرج:
1. نوع السؤال (questionType): أحد هذه القيم: sentiment, factual, opinion, trend, comparison, explanation, prediction, recommendation, other
2. الكيانات (entities): كائن يحتوي على topics, people, locations, organizations (كل منها مصفوفة نصوص)
3. hasFactualError: هل يحتوي على خطأ معلوماتي؟ (true/false)
4. factualErrorDescription: وصف الخطأ (نص فارغ إذا لا يوجد)
5. clarificationNeeded: هل يحتاج توضيح؟ (true/false)
6. clarificationReason: سبب التوضيح (نص فارغ إذا لا يحتاج)
7. timeContext: السياق الزمني (past/present/future)
8. geographicContext: السياق الجغرافي
9. isComparative: هل مقارنة؟ (true/false)
10. isOpinionBased: هل رأي؟ (true/false)
11. confidence: نسبة الثقة (0-100)

أجب بـ JSON فقط بدون أي نص إضافي.`
        },
        {
          role: "user",
          content: `السؤال: "${question}"
اللغة: ${language}

استخرج المعلومات الأساسية عن هذا السؤال فقط. أجب بـ JSON.`
        }
      ],
      response_format: { type: "json_object" } as any
    }, 'question_understanding');

    // استخرج النتيجة من الرد
    const content = response.choices[0].message.content;
    let analysisData;
    
    if (typeof content === "string") {
      analysisData = JSON.parse(content);
    } else {
      analysisData = content;
    }

    // حدد نوع التحليل المقترح
    const suggestedAnalysisType = determineSuggestedAnalysisType(
      analysisData.questionType,
      analysisData.isOpinionBased
    );

    // تحقق من الاستعداد للتحليل
    const readyForAnalysis = !analysisData.clarificationNeeded && !analysisData.hasFactualError;

    return {
      originalQuestion: question,
      language,
      questionType: analysisData.questionType,
      entities: analysisData.entities,
      hasFactualError: analysisData.hasFactualError,
      factualErrorDescription: analysisData.factualErrorDescription,
      clarificationNeeded: analysisData.clarificationNeeded,
      clarificationReason: analysisData.clarificationReason,
      confidence: Math.round(analysisData.confidence * 100) / 100,
      timeContext: analysisData.timeContext,
      geographicContext: analysisData.geographicContext,
      isComparative: analysisData.isComparative,
      isOpinionBased: analysisData.isOpinionBased,
      readyForAnalysis,
      suggestedAnalysisType
    };
  } catch (error) {
    console.error("Layer 1 Error:", error);
    
    // إذا فشل LLM، استخدم fallback بسيط
    return getLayer1Fallback(question, language);
  }
}

/**
 * حدد نوع التحليل المقترح بناءً على نوع السؤال
 */
function determineSuggestedAnalysisType(
  questionType: Layer1QuestionType,
  isOpinionBased: boolean
): AnalysisType {
  if (questionType === "sentiment" || isOpinionBased) {
    return "emotion_analysis";
  } else if (questionType === "trend") {
    return "trend_detection";
  } else if (questionType === "factual") {
    return "fact_checking";
  } else if (questionType === "comparison") {
    return "comparison_analysis";
  } else if (questionType === "opinion") {
    return "sentiment_analysis";
  } else {
    return "direct_answer";
  }
}

/**
 * Fallback بسيط إذا فشل LLM
 */
function getLayer1Fallback(
  question: string,
  language: string
): Layer1Output {
  const isArabic = language === "ar";
  
  // كشف بسيط لنوع السؤال
  let questionType: Layer1QuestionType = "other";
  if (question.includes("رأي") || question.includes("يشعر") || question.includes("opinion")) {
    questionType = "sentiment";
  } else if (question.includes("هل") || question.includes("is")) {
    questionType = "factual";
  } else if (question.includes("لماذا") || question.includes("why")) {
    questionType = "explanation";
  }

  return {
    isOpinionBased: questionType === "sentiment",
    originalQuestion: question,
    language,
    questionType,
    entities: {
      topics: [],
      people: [],
      locations: [],
      organizations: []
    },
    hasFactualError: false,
    clarificationNeeded: false,
    confidence: 60,
    geographicContext: {
      countryCode: isArabic ? 'GLOBAL' : 'GLOBAL',
      locationName: isArabic ? 'عالمي' : 'Global'
    },
    isComparative: false,
    readyForAnalysis: true,
    suggestedAnalysisType: determineSuggestedAnalysisType(questionType, false)
  };
}

/**
 * تحقق من جودة السؤال
 */
export function validateQuestionQuality(output: Layer1Output): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (output.hasFactualError) {
    issues.push(`خطأ معلوماتي: ${output.factualErrorDescription || "غير محدد"}`);
  }

  if (output.clarificationNeeded) {
    issues.push(`يحتاج توضيح: ${output.clarificationReason || "السؤال غير واضح"}`);
  }

  if (output.confidence < 50) {
    issues.push(`ثقة منخفضة: ${output.confidence}%`);
  }

  if (!output.entities.topics || output.entities.topics.length === 0) {
    issues.push("لم يتم استخراج مواضيع من السؤال");
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * تحويل Layer 1 Output إلى صيغة قابلة للقراءة
 */
export function formatLayer1Output(output: Layer1Output): string {
  const lines: string[] = [];

  lines.push("📋 تحليل السؤال (Layer 1):");
  lines.push(`السؤال: ${output.originalQuestion}`);
  lines.push(`اللغة: ${output.language}`);
  lines.push(`نوع السؤال: ${output.questionType}`);
  lines.push(`الثقة: ${output.confidence}%`);

  if (output.entities.topics.length > 0) {
    lines.push(`المواضيع: ${output.entities.topics.join(", ")}`);
  }

  if (output.entities.people.length > 0) {
    lines.push(`الأشخاص: ${output.entities.people.join(", ")}`);
  }

  if (output.entities.locations.length > 0) {
    lines.push(`الأماكن: ${output.entities.locations.join(", ")}`);
  }

  if (output.hasFactualError) {
    lines.push(`⚠️ خطأ معلوماتي: ${output.factualErrorDescription}`);
  }

  if (output.clarificationNeeded) {
    lines.push(`❓ يحتاج توضيح: ${output.clarificationReason}`);
  }

  lines.push(`جاهز للتحليل: ${output.readyForAnalysis ? "✅" : "❌"}`);
  lines.push(`نوع التحليل المقترح: ${output.suggestedAnalysisType}`);

  return lines.join("\n");
}


// =============================================================================
// SEMANTIC QUESTION UNDERSTANDING
// =============================================================================

/**
 * Semantic Understanding Layer
 * تحويل AmalSense من "نظام يرد على الكلمات" إلى "عقل يفهم المعنى"
 * 
 * Understanding = Intent + Context + Reasoning Rules
 * 
 * الطبقات:
 * 1. Intent Extraction (فهم النية)
 * 2. Semantic Framing (إطار المعنى)
 * 3. Context Injection (حقن السياق)
 */

// ==================== TYPES ====================

export type IntentType = 
  | 'decision_support' | 'information' | 'prediction' | 'comparison' 
  | 'recommendation' | 'scenario' | 'explanation' | 'sentiment'
  | 'risk_assessment' | 'opportunity' | 'general';

export type DomainType = 
  | 'finance' | 'crypto' | 'commodities' | 'politics' 
  | 'economy' | 'social' | 'technology' | 'general';

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
    yesterday: { gmi: number; cfi: number; hri: number } | null;
    lastWeek: { gmi: number; cfi: number; hri: number } | null;
    change24h: number;
    change7d: number;
  };
  reasoningRules: string[];
  preliminaryRecommendation: string;
}

// ==================== INTENT CLASSIFIER ====================

const INTENT_KEYWORDS: Record<IntentType, string[]> = {
  decision_support: [
    'فرصة', 'خطر', 'أشتري', 'أبيع', 'أدخل', 'أخرج', 'استثمر',
    'opportunity', 'risk', 'buy', 'sell', 'invest', 'enter', 'exit',
    'هل الوقت مناسب', 'قرار', 'decision', 'should i'
  ],
  prediction: [
    'سيحدث', 'التوقعات', 'المستقبل', 'غداً', 'الأسبوع القادم', 'تتوقع',
    'predict', 'forecast', 'future', 'tomorrow', 'next week', 'expect', 'will happen'
  ],
  comparison: [
    'مقارنة', 'بالأمس', 'الأسبوع الماضي', 'تغير', 'اختلف',
    'compare', 'yesterday', 'last week', 'changed', 'versus'
  ],
  recommendation: [
    'نصيحة', 'تقترح', 'توصي', 'ماذا تنصح', 'ما رأيك',
    'recommend', 'suggest', 'advise', 'what should'
  ],
  scenario: [
    'ماذا لو', 'لو حدث', 'سيناريو', 'افتراض',
    'what if', 'scenario', 'suppose', 'assume',
    'لو استمر', 'لو ارتفع', 'لو انخفض', 'لو تغير',
    'إذا استمر', 'إذا ارتفع', 'إذا انخفض',
    'كيف سيتغير', 'سيتغير', 'ماذا سيحدث لو',
    'خلال الأسبوع القادم', 'كيف سيكون'
  ],
  explanation: [
    'لماذا', 'السبب', 'كيف', 'اشرح', 'فسر',
    'why', 'reason', 'how', 'explain', 'because'
  ],
  sentiment: [
    'شعور', 'مشاعر', 'رأي الناس', 'الجمهور',
    'sentiment', 'feeling', 'opinion', 'people think'
  ],
  risk_assessment: [
    'مخاطر', 'خطورة', 'تحذير', 'حذر',
    'risk', 'danger', 'warning', 'caution'
  ],
  opportunity: [
    'فرص', 'إيجابي', 'مكاسب', 'ربح',
    'opportunity', 'positive', 'gain', 'profit'
  ],
  information: [
    'ما هو', 'ما هي', 'معلومات', 'تفاصيل',
    'what is', 'information', 'details', 'tell me'
  ],
  general: []
};

export function classifyIntent(question: string): { intent: IntentType; confidence: number } {
  const lowerQuestion = question.toLowerCase();
  const scores: Record<IntentType, number> = {
    decision_support: 0, prediction: 0, comparison: 0, recommendation: 0,
    scenario: 0, explanation: 0, sentiment: 0, risk_assessment: 0,
    opportunity: 0, information: 0, general: 0.1
  };
  
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerQuestion.includes(keyword.toLowerCase())) {
        scores[intent as IntentType] += 1;
      }
    }
  }
  
  // Pattern matching
  if (lowerQuestion.startsWith('هل') || lowerQuestion.startsWith('should')) {
    scores.decision_support += 0.5;
  }
  if (lowerQuestion.startsWith('لماذا') || lowerQuestion.startsWith('why')) {
    scores.explanation += 0.5;
  }
  
  // === ENHANCED SCENARIO DETECTION ===
  // اكتشاف أسئلة What-If بشكل أفضل
  if (lowerQuestion.includes('ماذا لو') || lowerQuestion.includes('what if')) {
    scores.scenario += 2; // زيادة الوزن
  }
  // "لو" + فعل استمراري
  if (lowerQuestion.includes('لو استمر') || lowerQuestion.includes('إذا استمر')) {
    scores.scenario += 2;
  }
  // سؤال عن التغير المستقبلي
  if (lowerQuestion.includes('كيف سيتغير') || lowerQuestion.includes('كيف سيكون')) {
    scores.scenario += 1.5;
  }
  // الإطار الزمني المستقبلي مع الشرط
  if ((lowerQuestion.includes('الأسبوع القادم') || lowerQuestion.includes('next week')) &&
      (lowerQuestion.includes('لو') || lowerQuestion.includes('إذا') || lowerQuestion.includes('سيتغير'))) {
    scores.scenario += 2;
  }
  // المزاج الجماعي + التغير
  if ((lowerQuestion.includes('المزاج') || lowerQuestion.includes('mood')) &&
      (lowerQuestion.includes('سيتغير') || lowerQuestion.includes('يتغير') || lowerQuestion.includes('change'))) {
    scores.scenario += 1.5;
  }
  
  let maxIntent: IntentType = 'general';
  let maxScore = 0;
  
  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxIntent = intent as IntentType;
    }
  }
  
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? Math.min(95, (maxScore / totalScore) * 100 + 30) : 50;
  
  return { intent: maxIntent, confidence };
}

// ==================== SEMANTIC PARSER ====================

const DOMAIN_KEYWORDS: Record<DomainType, string[]> = {
  finance: ['سوق', 'أسهم', 'بورصة', 'stock', 'market', 'shares'],
  crypto: ['بيتكوين', 'إيثريوم', 'كريبتو', 'bitcoin', 'ethereum', 'crypto'],
  commodities: ['ذهب', 'فضة', 'نفط', 'gold', 'silver', 'oil', 'metal'],
  politics: ['سياسة', 'حكومة', 'انتخابات', 'politics', 'government'],
  economy: ['اقتصاد', 'تضخم', 'فائدة', 'economy', 'inflation'],
  social: ['مجتمع', 'ناس', 'social', 'people'],
  technology: ['تقنية', 'tech', 'ai', 'ذكاء اصطناعي'],
  general: []
};

const DIRECTION_KEYWORDS: Record<DirectionType, string[]> = {
  up: ['صعود', 'ارتفاع', 'زيادة', 'up', 'rise', 'increase', 'higher'],
  down: ['هبوط', 'انخفاض', 'تراجع', 'down', 'fall', 'decrease', 'drop', 'lower'],
  stable: ['مستقر', 'ثابت', 'stable', 'steady'],
  volatile: ['متقلب', 'volatile', 'unstable'],
  unknown: []
};

function extractEntity(question: string): { entity: string; entityType: SemanticFrame['entityType'] } {
  const lowerQuestion = question.toLowerCase();
  
  const assets: Record<string, string> = {
    'gold': 'gold', 'ذهب': 'gold',
    'silver': 'silver', 'فضة': 'silver',
    'oil': 'oil', 'نفط': 'oil',
    'bitcoin': 'bitcoin', 'بيتكوين': 'bitcoin',
    'dollar': 'dollar', 'دولار': 'dollar',
  };
  
  for (const [keyword, entity] of Object.entries(assets)) {
    if (lowerQuestion.includes(keyword)) {
      return { entity, entityType: 'asset' };
    }
  }
  
  const countries: Record<string, string> = {
    'libya': 'libya', 'ليبيا': 'libya',
    'egypt': 'egypt', 'مصر': 'egypt',
    'saudi': 'saudi arabia', 'السعودية': 'saudi arabia',
    'usa': 'usa', 'أمريكا': 'usa', 'america': 'usa',
  };
  
  for (const [keyword, entity] of Object.entries(countries)) {
    if (lowerQuestion.includes(keyword)) {
      return { entity, entityType: 'country' };
    }
  }
  
  return { entity: 'unknown', entityType: 'unknown' };
}

function detectDomain(question: string): DomainType {
  const lowerQuestion = question.toLowerCase();
  
  // Check commodities first (more specific)
  for (const keyword of DOMAIN_KEYWORDS.commodities) {
    if (lowerQuestion.includes(keyword.toLowerCase())) {
      return 'commodities';
    }
  }
  
  // Then check other domains
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    if (domain === 'commodities') continue;
    for (const keyword of keywords) {
      if (lowerQuestion.includes(keyword.toLowerCase())) {
        return domain as DomainType;
      }
    }
  }
  return 'general';
}

function detectDirection(question: string): DirectionType {
  const lowerQuestion = question.toLowerCase();
  for (const [direction, keywords] of Object.entries(DIRECTION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerQuestion.includes(keyword.toLowerCase())) {
        return direction as DirectionType;
      }
    }
  }
  return 'unknown';
}

function detectTimeHorizon(question: string): TimeHorizon {
  const lowerQuestion = question.toLowerCase();
  
  if (['الآن', 'حالياً', 'now', 'currently', 'today', 'اليوم'].some(k => lowerQuestion.includes(k))) {
    return 'immediate';
  }
  if (['غداً', 'tomorrow', 'هذا الأسبوع', 'this week'].some(k => lowerQuestion.includes(k))) {
    return 'short_term';
  }
  if (['الأسبوع القادم', 'next week', 'الشهر', 'month'].some(k => lowerQuestion.includes(k))) {
    return 'medium_term';
  }
  if (['السنة', 'year', 'long term'].some(k => lowerQuestion.includes(k))) {
    return 'long_term';
  }
  return 'unspecified';
}

function determineExpectedResponseType(intent: IntentType): SemanticFrame['expectedResponseType'] {
  switch (intent) {
    case 'decision_support':
    case 'recommendation':
      return 'verdict';
    case 'explanation':
    case 'information':
      return 'explanation';
    case 'prediction':
    case 'comparison':
      return 'data';
    case 'scenario':
      return 'scenario';
    default:
      return 'explanation';
  }
}

function determineUserNeed(intent: IntentType, entity: string): string {
  switch (intent) {
    case 'decision_support':
      return `يحتاج قرار واضح بخصوص ${entity}`;
    case 'prediction':
      return `يريد معرفة توقعات ${entity}`;
    case 'comparison':
      return `يريد مقارنة ${entity} مع فترات سابقة`;
    case 'recommendation':
      return `يطلب نصيحة بخصوص ${entity}`;
    case 'scenario':
      return `يريد استكشاف سيناريوهات ${entity}`;
    case 'explanation':
      return `يريد فهم سبب حالة ${entity}`;
    default:
      return `يريد معلومات عن ${entity}`;
  }
}

function extractSemanticKeywords(question: string): string[] {
  const stopWords = ['هل', 'ما', 'ماذا', 'كيف', 'لماذا', 'في', 'على', 'إلى',
    'is', 'what', 'how', 'why', 'the', 'a', 'an', 'in', 'on', 'to'];
  
  const words = question.toLowerCase().split(/\s+/);
  return words.filter(word => 
    word.length > 2 && 
    !stopWords.includes(word) &&
    !/^[؟?!.,;:]+$/.test(word)
  );
}

export function parseQuestion(question: string): SemanticFrame {
  const { intent, confidence: intentConfidence } = classifyIntent(question);
  const { entity, entityType } = extractEntity(question);
  const domain = detectDomain(question);
  const direction = detectDirection(question);
  const timeHorizon = detectTimeHorizon(question);
  const expectedResponseType = determineExpectedResponseType(intent);
  const userNeed = determineUserNeed(intent, entity);
  const keywords = extractSemanticKeywords(question);
  
  // Sentiment detection
  const positiveWords = ['فرصة', 'ربح', 'opportunity', 'profit', 'gain'];
  const negativeWords = ['خطر', 'خسارة', 'risk', 'loss', 'danger'];
  
  const hasPositive = positiveWords.some(w => question.toLowerCase().includes(w));
  const hasNegative = negativeWords.some(w => question.toLowerCase().includes(w));
  
  let sentiment: SemanticFrame['sentiment'] = 'neutral';
  if (hasPositive && hasNegative) sentiment = 'mixed';
  else if (hasPositive) sentiment = 'positive';
  else if (hasNegative) sentiment = 'negative';
  
  // Urgency detection
  const urgencyWords = ['الآن', 'فوراً', 'عاجل', 'now', 'immediately', 'urgent'];
  const urgency = urgencyWords.some(w => question.toLowerCase().includes(w)) ? 'high' : 'medium';
  
  return {
    intent, intentConfidence, entity, entityType, domain, direction,
    timeHorizon, riskSensitivity: 'unknown', userNeed, expectedResponseType,
    keywords, sentiment, urgency, originalQuestion: question,
    normalizedQuestion: question.trim().toLowerCase()
  };
}

// ==================== CONTEXT BUILDER ====================

export function buildContext(
  semanticFrame: SemanticFrame,
  indicators: { gmi: number; cfi: number; hri: number; dominantEmotion: string; confidence: number }
): InjectedContext {
  // Trend direction
  let trendDirection: InjectedContext['trend']['direction'] = 'stable';
  if (indicators.hri > 60 && indicators.cfi < 50) {
    trendDirection = 'improving';
  } else if (indicators.cfi > 70 || indicators.gmi < -30) {
    trendDirection = 'declining';
  }
  
  const momentum = (indicators.hri - indicators.cfi) / 100;
  const volatility = Math.abs(indicators.gmi) > 50 || indicators.cfi > 70 ? 0.8 : 0.4;
  
  // Historical context (simulated)
  const yesterdayGmi = indicators.gmi + (Math.random() * 20 - 10);
  const lastWeekGmi = indicators.gmi + (Math.random() * 40 - 20);
  
  // Reasoning rules
  const reasoningRules = buildReasoningRules(semanticFrame, indicators);
  const preliminaryRecommendation = generatePreliminaryRecommendation(semanticFrame, indicators);
  
  return {
    currentIndicators: indicators,
    trend: { direction: trendDirection, momentum, volatility },
    historicalContext: {
      yesterday: { gmi: yesterdayGmi, cfi: indicators.cfi - 5, hri: indicators.hri + 3 },
      lastWeek: { gmi: lastWeekGmi, cfi: indicators.cfi + 10, hri: indicators.hri - 5 },
      change24h: indicators.gmi - yesterdayGmi,
      change7d: indicators.gmi - lastWeekGmi
    },
    reasoningRules,
    preliminaryRecommendation
  };
}

function buildReasoningRules(
  frame: SemanticFrame,
  indicators: { gmi: number; cfi: number; hri: number }
): string[] {
  const rules: string[] = [];
  
  if (indicators.cfi > 70) {
    rules.push('الخوف الجماعي مرتفع جداً - يجب الحذر في القرارات');
  }
  if (indicators.hri > 70) {
    rules.push('الأمل الجماعي قوي - هناك توقعات إيجابية');
  }
  if (Math.abs(indicators.gmi) < 20) {
    rules.push('المزاج العام محايد - لا يوجد إجماع واضح');
  }
  
  if (frame.intent === 'decision_support') {
    if (indicators.cfi > 60 && indicators.hri > 60) {
      rules.push('حالة انقسام: الخوف والأمل مرتفعان معاً - المراقبة أفضل من التحرك');
    }
    if (indicators.gmi > 30 && indicators.cfi < 40) {
      rules.push('ظروف مواتية: مزاج إيجابي مع خوف منخفض - يمكن التحرك بحذر');
    }
  }
  
  return rules;
}

function generatePreliminaryRecommendation(
  frame: SemanticFrame,
  indicators: { gmi: number; cfi: number; hri: number }
): string {
  if (frame.intent === 'decision_support') {
    if (indicators.cfi > 70) {
      return 'الانتظار والمراقبة - الخوف مرتفع جداً';
    }
    if (indicators.gmi > 40 && indicators.cfi < 40 && indicators.hri > 50) {
      return 'الظروف مواتية للتحرك التدريجي';
    }
    if (indicators.cfi > 60 && indicators.hri > 60) {
      return 'حالة ترقب - المراقبة أو الدخول التدريجي فقط';
    }
    return 'تقييم الوضع يتطلب مزيداً من المعلومات';
  }
  
  if (frame.intent === 'prediction') {
    if (indicators.hri > indicators.cfi) {
      return 'الاتجاه العام يميل للتحسن';
    }
    if (indicators.cfi > indicators.hri) {
      return 'الاتجاه العام يميل للحذر';
    }
    return 'الاتجاه غير واضح - يعتمد على التطورات';
  }
  
  return '';
}



// =============================================================================
// QUESTION CLARIFICATION HELPERS
// =============================================================================

/**
 * Layer 11: Clarification Check Layer
 * 
 * This layer analyzes the user's question to determine if it is ambiguous,
 * missing context, or too broad. If ambiguity is detected, it generates
 * clarification questions to ask the user.
 */

export interface ClarificationResult {
  isAmbiguous: boolean;
  ambiguityScore: number; // 0 to 1 (1 being extremely ambiguous)
  missingElements: string[];
  clarificationQuestions: string[];
}

/**
 * Evaluates the ambiguity of a question and generates clarification questions if needed.
 */
export function evaluateAmbiguity(
  question: string,
  deepUnderstanding: DeepQuestion
): ClarificationResult {
  // 0. Immediate bypass for greetings
  if (deepUnderstanding.surface.questionType === 'greeting') {
    return {
      isAmbiguous: false,
      ambiguityScore: 0,
      missingElements: [],
      clarificationQuestions: []
    };
  }

  let ambiguityScore = 0;
  const missingElements: string[] = [];
  const clarificationQuestions: string[] = [];
  const language = deepUnderstanding.context.language;

  // 1. Check for lack of specific topic
  if (deepUnderstanding.surface.topic === 'موضوع عام' || deepUnderstanding.surface.topic.length < 2) {
    ambiguityScore += 0.4;
    missingElements.push('Topic');
    clarificationQuestions.push(
      language === 'ar' 
        ? 'عن أي موضوع أو قطاع بالتحديد تسأل؟ (مثال: الذهب، النفط، الاقتصاد)'
        : 'Which specific topic or sector are you asking about? (e.g., Gold, Oil, Economy)'
    );
  }

  // 2. Check for broad timeframe in prediction or analysis questions
  const needsTimeframe = ['will', 'when', 'compare', 'why'].includes(deepUnderstanding.surface.questionType);
  const hasTimeframe = /(اليوم|غداً|أمس|شهر|سنة|عام|أسبوع|مستقبل|ماضي|today|tomorrow|yesterday|month|year|week|future|past)/i.test(question);
  
  if (needsTimeframe && !hasTimeframe) {
    ambiguityScore += 0.2;
    missingElements.push('Timeframe');
    clarificationQuestions.push(
      language === 'ar'
        ? 'هل تقصد المدى القصير (أيام) أم المدى الطويل (أشهر/سنوات)؟'
        : 'Do you mean the short-term (days) or long-term (months/years)?'
    );
  }

  // 3. Check for lack of clear geographic or domain context
  const hasGeographicContext = /(عالم|دولي|محلي|بلد|دولة|منطقة|شرق الأوسط|أوروبا|أمريكا|global|local|country|region|middle east|europe|america)/i.test(question) || deepUnderstanding.surface.topic.includes('أمريكا') || deepUnderstanding.surface.topic.includes('السعودية');
  
  if (!hasGeographicContext && ['make_decision', 'assess_risk', 'understand_cause'].includes(deepUnderstanding.deep.realIntent)) {
    ambiguityScore += 0.2;
    missingElements.push('Geographic Context');
    clarificationQuestions.push(
      language === 'ar'
        ? 'هل تسأل عن التأثير المحلي أم العالمي؟'
        : 'Are you asking about the local or global impact?'
    );
  }

  // 4. Decision questions without specific assets
  if (deepUnderstanding.deep.realIntent === 'make_decision' && missingElements.includes('Topic')) {
    ambiguityScore += 0.3; // Very ambiguous decision
    clarificationQuestions.push(
      language === 'ar'
        ? 'ما هو الأصل أو الاستثمار الذي تفكر فيه؟'
        : 'What specific asset or investment are you considering?'
    );
  }

  // 5. Unclear "What-If" scenario
  if (deepUnderstanding.surface.questionType === 'what_if' && question.length < 15) {
    ambiguityScore += 0.5;
    missingElements.push('Scenario Details');
    clarificationQuestions.push(
      language === 'ar'
        ? 'يرجى توضيح السيناريو أكثر. ماذا تفترض أن يحدث؟'
        : 'Please clarify the scenario. What are you assuming will happen?'
    );
  }

  // Normalize score
  ambiguityScore = Math.min(1.0, ambiguityScore);
  const isAmbiguous = ambiguityScore >= 0.5;

  // Filter unique questions just in case
  const uniqueQuestions = [...new Set(clarificationQuestions)];

  return {
    isAmbiguous,
    ambiguityScore,
    missingElements,
    clarificationQuestions: isAmbiguous ? uniqueQuestions : [] // Only return questions if it's actually ambiguous
  };
}

/**
 * Formats the clarification response if the question is too ambiguous.
 */
export function formatClarificationResponse(result: ClarificationResult, language: 'ar' | 'en' = 'ar'): string {
  if (!result.isAmbiguous || result.clarificationQuestions.length === 0) {
    return '';
  }

  if (language === 'ar') {
    return `سؤالك مثير للاهتمام، لكن لكي أعطيك تحليلاً دقيقاً من (AmalSense)، أحتاج إلى بعض التوضيح:\n\n` + 
           result.clarificationQuestions.map(q => `- ${q}`).join('\n');
  } else {
    return `Your question is interesting, but to give you an accurate analysis from AmalSense, I need some clarification:\n\n` + 
           result.clarificationQuestions.map(q => `- ${q}`).join('\n');
  }
}


// =============================================================================
// ADVANCED QUESTION CLARIFICATION DIALOG
// =============================================================================

/**
 * Question Clarification Layer (Phase 90)
 * 
 * Detects ambiguous or unclear questions and generates clarification requests
 * to ensure the user's intent is properly understood before analysis
 */

export interface ClarificationRequest {
  isAmbiguous: boolean;
  ambiguityType: "vague" | "incomplete" | "multiple_meanings" | "context_missing" | "clear";
  clarificationQuestions: string[];
  suggestedInterpretations: string[];
  confidence: number; // 0-100
}

/**
 * Detect if a question is ambiguous and needs clarification
 */
export async function detectAmbiguity(question: string, language: string = "ar"): Promise<ClarificationRequest> {
  try {
    // Quick heuristic checks first
    const heuristicResult = performHeuristicCheck(question, language);
    if (heuristicResult.confidence > 85) {
      return heuristicResult;
    }

    // Use LLM for deeper analysis
    const llmPrompt = buildClarificationPrompt(question, language);
    
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an expert at identifying ambiguous questions. Analyze the following question and determine if it needs clarification. 
          
          Respond with a JSON object containing:
          - isAmbiguous: boolean
          - ambiguityType: one of "vague", "incomplete", "multiple_meanings", "context_missing", "clear"
          - clarificationQuestions: array of 2-3 questions to clarify
          - suggestedInterpretations: array of 2-3 possible interpretations
          - confidence: number between 0-100`
        },
        {
          role: "user",
          content: llmPrompt
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "ambiguity_detection",
          strict: true,
          schema: {
            type: "object",
            properties: {
              isAmbiguous: { type: "boolean" },
              ambiguityType: { 
                type: "string",
                enum: ["vague", "incomplete", "multiple_meanings", "context_missing", "clear"]
              },
              clarificationQuestions: { 
                type: "array",
                items: { type: "string" },
                minItems: 1,
                maxItems: 3
              },
              suggestedInterpretations: {
                type: "array",
                items: { type: "string" },
                minItems: 1,
                maxItems: 3
              },
              confidence: { type: "number", minimum: 0, maximum: 100 }
            },
            required: ["isAmbiguous", "ambiguityType", "clarificationQuestions", "suggestedInterpretations", "confidence"],
            additionalProperties: false
          }
        }
      }
    });

    // Parse response
    const content = response.choices[0].message.content;
    if (typeof content === "string") {
      const parsed = JSON.parse(content);
      return {
        isAmbiguous: parsed.isAmbiguous,
        ambiguityType: parsed.ambiguityType,
        clarificationQuestions: parsed.clarificationQuestions,
        suggestedInterpretations: parsed.suggestedInterpretations,
        confidence: parsed.confidence
      };
    }

    return heuristicResult;
  } catch (error) {
    console.error("Error in detectAmbiguity:", error);
    // Fallback to heuristic
    return performHeuristicCheck(question, language);
  }
}

/**
 * Perform quick heuristic checks for ambiguity
 */
function performHeuristicCheck(question: string, language: string): ClarificationRequest {
  const lowerQuestion = question.toLowerCase();
  
  // Check for vague questions
  const vaguePatterns = [
    /ما رأي.*الناس[؟?]?$/,  // "What do people think?" (Arabic)
    /what.*people.*think/i,  // English
    /ما الأفضل[؟?]?$/,  // "What's best?" (Arabic)
    /what.*best/i,  // English
    /كيف.*الناس[؟?]?$/,  // "How are people?" (Arabic)
    /how.*people/i  // English
  ];

  const isVague = vaguePatterns.some(pattern => pattern.test(lowerQuestion));
  
  if (isVague) {
    return {
      isAmbiguous: true,
      ambiguityType: "vague",
      clarificationQuestions: language === "ar" 
        ? [
            "هل تقصد رأي الناس حول موضوع معين؟",
            "ما هو الموضوع الذي تريد معرفة رأي الناس فيه؟",
            "هل تريد تحليل عام أم تحليل لمنطقة جغرافية محددة؟"
          ]
        : [
            "Do you mean people's opinion about a specific topic?",
            "What is the topic you want to know people's opinion about?",
            "Do you want a general analysis or for a specific geographic region?"
          ],
      suggestedInterpretations: language === "ar"
        ? [
            "رأي الناس حول موضوع سياسي",
            "رأي الناس حول موضوع اقتصادي",
            "رأي الناس حول موضوع اجتماعي"
          ]
        : [
            "People's opinion about a political topic",
            "People's opinion about an economic topic",
            "People's opinion about a social topic"
          ],
      confidence: 90
    };
  }

  // Check for incomplete questions
  const incompletePatterns = [
    /[؟?]$/,  // Ends with question mark but very short
    /^(من|ما|كيف|أين|متى|لماذا)\s*[؟?]?$/i,  // Single word question (Arabic)
    /^(who|what|how|where|when|why)\s*\??$/i  // Single word question (English)
  ];

  const isIncomplete = question.length < 10 && incompletePatterns.some(pattern => pattern.test(lowerQuestion));
  
  if (isIncomplete) {
    return {
      isAmbiguous: true,
      ambiguityType: "incomplete",
      clarificationQuestions: language === "ar"
        ? [
            "يرجى توضيح سؤالك بشكل أكثر تفصيلاً",
            "ما هو الموضوع الذي تريد تحليله؟",
            "هل تريد معرفة المشاعر أم الآراء أم الاتجاهات؟"
          ]
        : [
            "Please clarify your question in more detail",
            "What is the topic you want to analyze?",
            "Do you want to know emotions, opinions, or trends?"
          ],
      suggestedInterpretations: language === "ar"
        ? ["سؤال غير واضح - يحتاج توضيح"]
        : ["Unclear question - needs clarification"],
      confidence: 85
    };
  }

  // No ambiguity detected
  return {
    isAmbiguous: false,
    ambiguityType: "clear",
    clarificationQuestions: [],
    suggestedInterpretations: [],
    confidence: 95
  };
}

/**
 * Build clarification prompt for LLM
 */
function buildClarificationPrompt(question: string, language: string): string {
  if (language === "ar") {
    return `السؤال: "${question}"
    
    هل هذا السؤال غامض أو يحتاج توضيح؟ إذا كان غامضاً، اقترح أسئلة توضيحية وتفسيرات محتملة.`;
  }
  
  return `Question: "${question}"
  
  Is this question ambiguous or needs clarification? If it is, suggest clarification questions and possible interpretations.`;
}

/**
 * Generate a clarification dialog response
 */
export async function generateClarificationDialog(
  question: string,
  clarification: ClarificationRequest,
  language: string = "ar"
): Promise<string> {
  if (!clarification.isAmbiguous) {
    return "";
  }

  const typeMessages = {
    ar: {
      vague: "السؤال الذي طرحته عام جداً ويحتاج توضيح",
      incomplete: "السؤال ناقص ويحتاج معلومات إضافية",
      multiple_meanings: "السؤال قد يعني عدة أشياء مختلفة",
      context_missing: "السؤال يفتقد السياق اللازم للإجابة الدقيقة",
      clear: "السؤال واضح"
    },
    en: {
      vague: "Your question is too general and needs clarification",
      incomplete: "Your question is incomplete and needs more information",
      multiple_meanings: "Your question could mean several different things",
      context_missing: "Your question is missing the context needed for an accurate answer",
      clear: "Your question is clear"
    }
  };

  const messages = language === "ar" ? typeMessages.ar : typeMessages.en;
  const typeMessage = messages[clarification.ambiguityType as keyof typeof messages];

  let dialog = `${typeMessage}.\n\n`;
  
  if (clarification.clarificationQuestions.length > 0) {
    dialog += language === "ar" ? "هل تقصد:\n" : "Did you mean:\n";
    clarification.clarificationQuestions.forEach((q, i) => {
      dialog += `${i + 1}. ${q}\n`;
    });
  }

  return dialog;
}


// =============================================================================
// QUESTION SIMILARITY AND CACHE HELPERS
// =============================================================================

/**
 * Question Similarity Matcher (Phase 91)
 * 
 * Detects semantically similar questions and enables cache reuse
 * Uses multiple similarity algorithms for robust matching
 */

export interface SimilarityMatch {
  isSimilar: boolean;
  similarityScore: number; // 0-100
  matchedQuestion: string | null;
  matchedResponseId: string | null;
  algorithm: "cosine" | "levenshtein" | "semantic" | "none";
  confidence: number; // 0-100
}

/**
 * Calculate similarity between two questions
 */
export function calculateQuestionSimilarity(
  question1: string,
  question2: string,
  language: string = "ar"
): SimilarityMatch {
  // Normalize questions
  const q1 = normalizeQuestion(question1, language);
  const q2 = normalizeQuestion(question2, language);

  // If identical after normalization
  if (q1 === q2) {
    return {
      isSimilar: true,
      similarityScore: 100,
      matchedQuestion: question2,
      matchedResponseId: null,
      algorithm: "cosine",
      confidence: 100
    };
  }

  // Try multiple algorithms
  const cosineSimilarity = calculateCosineSimilarity(q1, q2);
  const levenshteinSimilarity = calculateLevenshteinSimilarity(q1, q2);
  const semanticSimilarity = calculateSemanticSimilarity(q1, q2, language);

  // Weighted average (cosine: 40%, levenshtein: 30%, semantic: 30%)
  const finalScore = (cosineSimilarity * 0.4) + (levenshteinSimilarity * 0.3) + (semanticSimilarity * 0.3);

  // Determine which algorithm had the highest score
  const scores = [
    { score: cosineSimilarity, algo: "cosine" as const },
    { score: levenshteinSimilarity, algo: "levenshtein" as const },
    { score: semanticSimilarity, algo: "semantic" as const }
  ];
  const bestAlgo = scores.reduce((a, b) => a.score > b.score ? a : b).algo;

  return {
    isSimilar: finalScore >= 75, // 75% threshold
    similarityScore: Math.round(finalScore),
    matchedQuestion: finalScore >= 75 ? question2 : null,
    matchedResponseId: null,
    algorithm: bestAlgo,
    confidence: Math.round(Math.max(cosineSimilarity, levenshteinSimilarity, semanticSimilarity))
  };
}

/**
 * Normalize question for comparison
 */
function normalizeQuestion(question: string, language: string): string {
  let normalized = question.toLowerCase().trim();

  // Remove punctuation
  normalized = normalized.replace(/[!?.,;:]/g, "");

  // Remove extra spaces
  normalized = normalized.replace(/\s+/g, " ");

  // Remove common filler words
  if (language === "ar") {
    const fillers = ["هل", "ما", "كيف", "أين", "متى", "لماذا", "من", "ماذا"];
    fillers.forEach(filler => {
      normalized = normalized.replace(new RegExp(`^${filler}\\s+|\\s+${filler}\\s+`, "g"), " ");
    });
  } else {
    const fillers = ["do", "does", "did", "is", "are", "was", "were", "the", "a", "an"];
    fillers.forEach(filler => {
      normalized = normalized.replace(new RegExp(`^${filler}\\s+|\\s+${filler}\\s+`, "g"), " ");
    });
  }

  return normalized.trim();
}

/**
 * Calculate cosine similarity between two strings
 * Based on character n-grams
 */
function calculateCosineSimilarity(str1: string, str2: string): number {
  const n = 2; // bigrams
  
  const getNgrams = (s: string): Map<string, number> => {
    const ngrams = new Map<string, number>();
    for (let i = 0; i <= s.length - n; i++) {
      const gram = s.substring(i, i + n);
      ngrams.set(gram, (ngrams.get(gram) || 0) + 1);
    }
    return ngrams;
  };

  const ngrams1 = getNgrams(str1);
  const ngrams2 = getNgrams(str2);

  // Calculate dot product
  let dotProduct = 0;
  ngrams1.forEach((count1, gram) => {
    const count2 = ngrams2.get(gram) || 0;
    dotProduct += count1 * count2;
  });

  // Calculate magnitudes
  let sum1 = 0;
  ngrams1.forEach(count => {
    sum1 += count * count;
  });
  let sum2 = 0;
  ngrams2.forEach(count => {
    sum2 += count * count;
  });
  const magnitude1 = Math.sqrt(sum1);
  const magnitude2 = Math.sqrt(sum2);

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return (dotProduct / (magnitude1 * magnitude2)) * 100;
}

/**
 * Calculate Levenshtein distance similarity
 * Measures edit distance between two strings
 */
function calculateLevenshteinSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);

  if (maxLength === 0) return 100;

  return ((maxLength - distance) / maxLength) * 100;
}

/**
 * Calculate Levenshtein distance
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate semantic similarity based on keyword matching
 */
function calculateSemanticSimilarity(str1: string, str2: string, language: string): number {
  const keywords1 = extractSimilarityKeywords(str1, language);
  const keywords2 = extractSimilarityKeywords(str2, language);

  if (keywords1.length === 0 || keywords2.length === 0) return 0;

  // Calculate Jaccard similarity
  const intersection = keywords1.filter(k => keywords2.includes(k)).length;
  const union = new Set([...keywords1, ...keywords2]).size;

  return (intersection / union) * 100;
}

/**
 * Extract keywords from text
 */
function extractSimilarityKeywords(text: string, language: string): string[] {
  const words = text.split(/\s+/);

  if (language === "ar") {
    // Remove common Arabic stop words
    const stopWords = ["في", "من", "إلى", "هذا", "ذلك", "التي", "الذي", "على", "عن", "مع", "بعد", "قبل"];
    return words.filter(w => w.length > 2 && !stopWords.includes(w));
  } else {
    // Remove common English stop words
    const stopWords = ["the", "a", "an", "in", "on", "at", "to", "for", "of", "and", "or", "but"];
    return words.filter(w => w.length > 2 && !stopWords.includes(w));
  }
}

/**
 * Find similar questions from a list
 */
export function findSimilarQuestions(
  question: string,
  questionsList: string[],
  threshold: number = 75,
  language: string = "ar"
): Array<{ question: string; similarity: number }> {
  const results: Array<{ question: string; similarity: number }> = [];

  for (const q of questionsList) {
    const match = calculateQuestionSimilarity(question, q, language);
    if (match.similarityScore >= threshold) {
      results.push({
        question: q,
        similarity: match.similarityScore
      });
    }
  }

  // Sort by similarity descending
  return results.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Generate cache key for a question
 */
export function generateQuestionCacheKey(question: string): string {
  // Simple hash function
  let hash = 0;
  const str = question.toLowerCase().trim();

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return `q_${Math.abs(hash).toString(16)}`;
}

/**
 * Check if a question should use cached response
 */
export function shouldUseCachedResponse(
  newQuestion: string,
  cachedQuestion: string,
  minSimilarity: number = 80
): boolean {
  const match = calculateQuestionSimilarity(newQuestion, cachedQuestion);
  return match.similarityScore >= minSimilarity;
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
};
