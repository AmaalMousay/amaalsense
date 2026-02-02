/**
 * AmalSense Response Builder
 * 
 * يبني الرد بهيكل ثابت 100% بالكود
 * LLM يُستخدم فقط لتحسين المحتوى، ليس للهيكل
 * 
 * الهيكل الرسمي (Response Protocol):
 * 1. Executive Summary (الخلاصة)
 * 2. Decision Signal (إشارة القرار)
 * 3. Why? (الاستدلال السببي) - مع أسباب واقعية
 * 4. Time Forecast (التوقع الزمني)
 * 5. Psychological Insight (القراءة النفسية)
 * 6. Closing Question (سؤال ختامي)
 */

import { invokeLLMProvider, type LLMMessage } from './llmProvider';
import {
  buildTemplateContext,
  buildTemplateContextWithProfile,
  buildTemplateStyle,
  generateDynamicIntro,
  generateDynamicClosing,
  adjustContentLength,
  formatNumbers,
  type TemplateContext,
  type TemplateStyle,
  type UserProfileContext
} from './dynamicTemplate';

export interface AnalysisData {
  topic: string;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  confidence: number;
  detectedCountry?: string;
  // البيانات المصدرية للتفسير السببي
  newsHeadlines?: string[];
  keywords?: string[];
  sources?: string[];
  // بيانات السياق الديناميكي
  turnCount?: number;
  previousTopics?: string[];
  questionsAsked?: string[];
  userQuestion?: string;
  // بروفايل المستخدم المحفوظ
  userProfile?: UserProfileContext;
}

export interface CausalFactors {
  economic: string[];
  media: string[];
  political: string[];
  social: string[];
}

export interface StructuredResponse {
  executiveSummary: string;
  decisionSignal: string;
  decisionSignalIcon: string;
  causalFactors: CausalFactors;
  timeforecast: string;
  psychologicalInsight: string;
  closingQuestion: string;
  fullResponse: string;
}

// إشارات القرار المتاحة
type DecisionSignalType = 'watch' | 'gradual_entry' | 'caution' | 'high_risk' | 'opportunity';

const DECISION_SIGNALS: Record<DecisionSignalType, { ar: string; icon: string }> = {
  'watch': { ar: 'مراقبة', icon: '👁️' },
  'gradual_entry': { ar: 'دخول تدريجي', icon: '📈' },
  'caution': { ar: 'حذر', icon: '⚠️' },
  'high_risk': { ar: 'خطر مرتفع', icon: '🚨' },
  'opportunity': { ar: 'فرصة', icon: '✅' }
};

// الكلمات المفتاحية للتفسير السببي
const CAUSAL_KEYWORDS = {
  economic: {
    keywords: ['دولار', 'سعر', 'غلاء', 'أسعار', 'سيولة', 'رواتب', 'معيشة', 'تضخم', 'بنك', 'صرف', 'اقتصاد', 'dollar', 'price', 'inflation', 'economy'],
    factors: [
      'تذبذب سعر الصرف',
      'ارتفاع أسعار السلع الأساسية',
      'نقص السيولة النقدية',
      'تأخر صرف الرواتب',
      'ضعف القوة الشرائية',
      'عدم استقرار الأسواق'
    ]
  },
  media: {
    keywords: ['أخبار', 'إعلام', 'تصريح', 'بيان', 'news', 'media', 'statement'],
    factors: [
      'كثافة الأخبار السلبية',
      'عناوين تحذيرية متكررة',
      'خطاب إعلامي متشائم',
      'تغطية مكثفة للأزمات',
      'انتشار الشائعات'
    ]
  },
  political: {
    keywords: ['سياسة', 'حكومة', 'برلمان', 'انتخابات', 'أزمة', 'صراع', 'politics', 'government', 'crisis'],
    factors: [
      'انسداد سياسي',
      'غياب حلول واضحة',
      'تصريحات متوترة',
      'عدم استقرار مؤسسي',
      'صراعات داخلية'
    ]
  },
  social: {
    keywords: ['مجتمع', 'شعب', 'احتجاج', 'مظاهرة', 'society', 'protest'],
    factors: [
      'قلق اجتماعي متزايد',
      'توتر في الشارع',
      'مخاوف معيشية',
      'عدم الثقة في المستقبل'
    ]
  }
};

/**
 * 1. توليد الخلاصة التنفيذية
 */
export function generateExecutiveSummary(data: AnalysisData): string {
  const { topic, gmi, cfi, hri } = data;
  
  // تحديد الحالة العامة
  let state = '';
  let description = '';
  
  if (cfi > 70 && hri < 30) {
    state = 'أزمة نفسية';
    description = 'خوف مرتفع مع يأس سائد';
  } else if (cfi > 60 && hri > 60) {
    state = 'توتر حذر مع ترقب نشط';
    description = 'ليس استقراراً حقيقياً';
  } else if (cfi > 60 && hri < 50) {
    state = 'قلق متصاعد';
    description = 'الخوف يتغلب على الأمل';
  } else if (gmi > 30 && cfi < 40) {
    state = 'تفاؤل حذر';
    description = 'مزاج إيجابي مع ثقة نسبية';
  } else if (gmi < -30 && cfi > 50) {
    state = 'تشاؤم سائد';
    description = 'مزاج سلبي مع قلق مرتفع';
  } else if (Math.abs(gmi) < 20 && cfi > 40 && hri > 40) {
    state = 'انتظار حذر';
    description = 'المجتمع يراقب ولم يحسم موقفه';
  } else {
    state = 'حالة مختلطة';
    description = 'لا إشارات حاسمة واضحة';
  }
  
  return `الوضع في ${topic} يُنظر إليه نفسياً كحالة **${state}** - ${description}.`;
}

/**
 * 2. تحديد إشارة القرار
 */
export function determineDecisionSignal(data: AnalysisData): { type: DecisionSignalType; text: string; icon: string } {
  const { gmi, cfi, hri } = data;
  
  let type: DecisionSignalType;
  let context = '';
  
  if (cfi > 75) {
    type = 'high_risk';
    context = 'الخوف الجماعي في مستويات خطرة';
  } else if (cfi > 60 && hri > 60) {
    type = 'watch';
    context = 'المجتمع في وضع انتظار دفاعي، وليس في حالة طمأنينة';
  } else if (cfi > 60 && hri < 50) {
    type = 'caution';
    context = 'القلق يتفوق على الأمل، يُنصح بالحذر';
  } else if (gmi > 30 && cfi < 40) {
    type = 'opportunity';
    context = 'البيئة النفسية مواتية للتحرك';
  } else if (gmi > 20 && hri > 50) {
    type = 'gradual_entry';
    context = 'إشارات إيجابية تدعم التحرك التدريجي';
  } else if (gmi < -30) {
    type = 'caution';
    context = 'المزاج السلبي يستدعي الحذر';
  } else {
    type = 'watch';
    context = 'لا توجد إشارات حاسمة، يُنصح بالمراقبة';
  }
  
  const signal = DECISION_SIGNALS[type];
  return {
    type,
    text: `${signal.icon} **${signal.ar}**: ${context}`,
    icon: signal.icon
  };
}

/**
 * 3. استخراج العوامل السببية من البيانات
 */
export function extractCausalFactors(data: AnalysisData): CausalFactors {
  const { topic, cfi, hri, gmi, newsHeadlines = [], keywords = [] } = data;
  
  const factors: CausalFactors = {
    economic: [],
    media: [],
    political: [],
    social: []
  };
  
  // دمج الكلمات المفتاحية من العناوين والكلمات
  const allText = [...newsHeadlines, ...keywords, topic].join(' ').toLowerCase();
  
  // البحث عن العوامل الاقتصادية
  const hasEconomicKeywords = CAUSAL_KEYWORDS.economic.keywords.some(k => allText.includes(k));
  if (hasEconomicKeywords || cfi > 50) {
    // اختيار عوامل مناسبة بناءً على المؤشرات
    if (cfi > 60) {
      factors.economic.push('تذبذب سعر الصرف');
      factors.economic.push('ارتفاع أسعار السلع الأساسية');
    }
    if (cfi > 50 && hri < 60) {
      factors.economic.push('ضعف القوة الشرائية');
    }
    if (allText.includes('سيولة') || allText.includes('رواتب')) {
      factors.economic.push('نقص السيولة النقدية');
    }
  }
  
  // البحث عن العوامل الإعلامية
  const hasMediaKeywords = CAUSAL_KEYWORDS.media.keywords.some(k => allText.includes(k));
  if (hasMediaKeywords || newsHeadlines.length > 0) {
    if (cfi > 50) {
      factors.media.push('كثافة الأخبار السلبية');
      factors.media.push('عناوين تحذيرية متكررة');
    }
    if (gmi < 0) {
      factors.media.push('خطاب إعلامي متشائم');
    }
  }
  
  // البحث عن العوامل السياسية
  const hasPoliticalKeywords = CAUSAL_KEYWORDS.political.keywords.some(k => allText.includes(k));
  if (hasPoliticalKeywords) {
    factors.political.push('عدم استقرار مؤسسي');
    if (cfi > 60) {
      factors.political.push('غياب حلول واضحة');
    }
  }
  
  // البحث عن العوامل الاجتماعية
  if (cfi > 60 && hri < 50) {
    factors.social.push('قلق اجتماعي متزايد');
    factors.social.push('مخاوف معيشية');
  }
  
  // إضافة عوامل افتراضية إذا لم نجد شيء
  if (factors.economic.length === 0 && factors.media.length === 0 && 
      factors.political.length === 0 && factors.social.length === 0) {
    if (cfi > 50) {
      factors.economic.push('عدم يقين اقتصادي عام');
    }
    if (gmi < 0) {
      factors.social.push('مزاج جماعي سلبي');
    }
    factors.media.push('تغطية إعلامية مكثفة');
  }
  
  return factors;
}

/**
 * 4. توليد التوقع الزمني
 */
export function generateTimeforecast(data: AnalysisData): string {
  const { gmi, cfi, hri } = data;
  
  let timeframe = '';
  let prediction = '';
  
  if (cfi > 70 || Math.abs(gmi) > 50) {
    timeframe = 'خلال 24-48 ساعة';
    prediction = 'احتمال تغير سريع في المزاج العام بناءً على أي تطورات جديدة';
  } else if (cfi > 60 && hri > 50) {
    timeframe = 'خلال الأسبوع القادم';
    prediction = 'استمرار حالة الترقب مع حساسية عالية لأي خبر اقتصادي أو سياسي';
  } else if (gmi > 20 && hri > 60) {
    timeframe = 'خلال الأيام القادمة';
    prediction = 'احتمال تحسن تدريجي إذا استمرت الأخبار الإيجابية';
  } else if (gmi < -20 && cfi > 50) {
    timeframe = 'خلال الأيام القادمة';
    prediction = 'خطر تدهور إضافي إذا ظهرت أخبار سلبية';
  } else {
    timeframe = 'خلال 48-72 ساعة';
    prediction = 'الوضع قابل للتغير، يُنصح بالمتابعة المستمرة';
  }
  
  return `**${timeframe}**: ${prediction}`;
}

/**
 * 5. توليد القراءة النفسية
 */
export function generatePsychologicalInsight(data: AnalysisData): string {
  const { gmi, cfi, hri, dominantEmotion } = data;
  
  const insights: string[] = [];
  
  // بناءً على المؤشرات
  if (cfi > 60 && hri > 60) {
    insights.push('المجتمع في مرحلة ترقّب مشحون، لا هروب ولا اندفاع');
  }
  
  if (cfi > 70 && hri < 40) {
    insights.push('المزاج يعكس قلق وجودي أكثر من أزمة مالية فقط');
  }
  
  if (gmi > 30 && cfi < 40) {
    insights.push('هناك ثقة جماعية تدعم التحرك الإيجابي');
  }
  
  if (Math.abs(gmi) < 15 && cfi > 50) {
    insights.push('حالة انتظار دفاعي - المجتمع يراقب قبل أن يتحرك');
  }
  
  // بناءً على العاطفة المسيطرة
  const emotionInsights: Record<string, string> = {
    'fear': 'الخوف المسيطر يشير إلى حاجة للطمأنة والوضوح',
    'hope': 'الأمل المسيطر يعكس إيماناً بإمكانية التحسن',
    'curiosity': 'الفضول المسيطر يعني أن المجتمع يبحث عن إجابات',
    'anger': 'الغضب المسيطر يعكس إحباطاً من الوضع الراهن',
    'sadness': 'الحزن المسيطر يشير إلى خيبة أمل جماعية'
  };
  
  if (emotionInsights[dominantEmotion.toLowerCase()]) {
    insights.push(emotionInsights[dominantEmotion.toLowerCase()]);
  }
  
  // اختيار أفضل قراءة
  return insights.length > 0 ? insights[0] : 'المجتمع في حالة انتظار وترقب للتطورات القادمة';
}

/**
 * 6. توليد السؤال الختامي
 */
export function generateClosingQuestion(data: AnalysisData): string {
  const { topic, cfi, hri, gmi } = data;
  
  const questions = [
    `هل تحب أحاكي ماذا يحدث نفسياً لو استمر هذا الوضع شهراً؟`,
    `هل نركز على جانب معين من ${topic}؟`,
    `هل تريد مقارنة هذا الوضع بفترة سابقة؟`,
    `هل نحلل تأثير حدث معين على المزاج العام؟`
  ];
  
  // اختيار سؤال مناسب للحالة
  if (cfi > 65) {
    return `هل تحب أحاكي ماذا يحدث لو انخفض الخوف الجماعي؟`;
  }
  
  if (hri > 65) {
    return `هل تريد معرفة كيف يمكن تعزيز هذا الأمل؟`;
  }
  
  if (gmi < -20) {
    return `هل تحب أستكشف سيناريو التحسن المحتمل؟`;
  }
  
  // سؤال عشوائي
  return questions[Math.floor(Math.random() * questions.length)];
}

/**
 * بناء الرد الكامل بالهيكل الديناميكي
 */
export function buildStructuredResponse(data: AnalysisData): StructuredResponse {
  // بناء السياق الديناميكي - مع دعم User Profile
  let templateContext: TemplateContext;
  
  if (data.userProfile) {
    // استخدام بروفايل المستخدم المحفوظ
    templateContext = buildTemplateContextWithProfile(
      data.turnCount || 1,
      data.previousTopics || [],
      data.topic,
      data.questionsAsked || [],
      data.cfi,
      data.gmi,
      data.userQuestion,
      data.userProfile
    );
    console.log('[ResponseBuilder] Using saved user profile:', {
      savedLevel: data.userProfile.userLevel,
      conversationCount: data.userProfile.conversationCount,
      messageCount: data.userProfile.messageCount
    });
  } else {
    // الطريقة القديمة - اكتشاف المستوى من السياق
    templateContext = buildTemplateContext(
      data.turnCount || 1,
      data.previousTopics || [],
      data.topic,
      data.questionsAsked || [],
      data.cfi,
      data.gmi,
      data.userQuestion
    );
  }
  
  // بناء أسلوب القالب
  const templateStyle = buildTemplateStyle(templateContext);
  
  console.log('[ResponseBuilder] Context:', {
    userLevel: templateContext.userLevel,
    conversationDepth: templateContext.conversationDepth,
    emotionalState: templateContext.emotionalState,
    responseLength: templateStyle.responseLength,
    tone: templateStyle.tone
  });
  
  // 1. الخلاصة التنفيذية
  let executiveSummary = generateExecutiveSummary(data);
  
  // 2. إشارة القرار
  const decisionSignalResult = determineDecisionSignal(data);
  
  // 3. العوامل السببية
  const causalFactors = extractCausalFactors(data);
  
  // 4. التوقع الزمني
  const timeforecast = generateTimeforecast(data);
  
  // 5. القراءة النفسية
  let psychologicalInsight = generatePsychologicalInsight(data);
  
  // 6. السؤال الختامي - ديناميكي حسب السياق
  const closingQuestion = generateDynamicClosing(templateContext, templateStyle);
  
  // تطبيق الأسلوب الديناميكي
  if (templateStyle.responseLength === 'short') {
    executiveSummary = adjustContentLength(executiveSummary, templateStyle);
    psychologicalInsight = adjustContentLength(psychologicalInsight, templateStyle);
  }
  
  // تنسيق الأرقام حسب مستوى المستخدم
  if (!templateStyle.includeNumbers) {
    executiveSummary = formatNumbers(executiveSummary, templateStyle);
  }
  
  // المقدمة الديناميكية
  const dynamicIntro = generateDynamicIntro(templateContext, data.topic);
  
  // بناء فقرة "لماذا؟"
  let whySection = '**لماذا هذا المزاج؟**\n\n';
  whySection += 'هذا التوتر ناتج أساسًا عن:\n\n';
  
  if (causalFactors.economic.length > 0) {
    whySection += '**عوامل اقتصادية:**\n';
    causalFactors.economic.forEach(f => whySection += `• ${f}\n`);
    whySection += '\n';
  }
  
  if (causalFactors.media.length > 0) {
    whySection += '**عوامل إعلامية:**\n';
    causalFactors.media.forEach(f => whySection += `• ${f}\n`);
    whySection += '\n';
  }
  
  if (causalFactors.political.length > 0) {
    whySection += '**عوامل سياسية:**\n';
    causalFactors.political.forEach(f => whySection += `• ${f}\n`);
    whySection += '\n';
  }
  
  if (causalFactors.social.length > 0) {
    whySection += '**عوامل اجتماعية:**\n';
    causalFactors.social.forEach(f => whySection += `• ${f}\n`);
    whySection += '\n';
  }
  
  // بناء الرد الكامل - ديناميكي حسب السياق
  let fullResponse = '';
  
  // إضافة المقدمة الديناميكية إذا وجدت
  if (dynamicIntro) {
    fullResponse += dynamicIntro;
  }
  
  // الهيكل يتغير حسب عمق المحادثة
  if (templateContext.conversationDepth === 'deep_conversation') {
    // رد مختصر للحوار العميق
    fullResponse += `**الخلاصة:** ${executiveSummary}

`;
    fullResponse += `**إشارة القرار:** ${decisionSignalResult.text}

`;
    fullResponse += `**التوقع:** ${timeforecast}

`;
    fullResponse += closingQuestion;
  } else if (templateContext.conversationDepth === 'follow_up') {
    // رد متوسط للمتابعة
    fullResponse += `**الخلاصة:** ${executiveSummary}

`;
    fullResponse += `**إشارة القرار:** ${decisionSignalResult.text}

---

`;
    fullResponse += whySection;
    fullResponse += `---

**التوقع الزمني:** ${timeforecast}

`;
    fullResponse += closingQuestion;
  } else {
    // رد كامل للرسالة الأولى
    fullResponse += `**الخلاصة:**
${executiveSummary}

`;
    fullResponse += `**إشارة القرار:**
${decisionSignalResult.text}

---

`;
    fullResponse += whySection;
    fullResponse += `---

**التوقع الزمني:**
${timeforecast}

`;
    fullResponse += `**القراءة النفسية:**
${psychologicalInsight}

---

`;
    fullResponse += closingQuestion;
  }
  
  return {
    executiveSummary,
    decisionSignal: decisionSignalResult.text,
    decisionSignalIcon: decisionSignalResult.icon,
    causalFactors,
    timeforecast,
    psychologicalInsight,
    closingQuestion,
    fullResponse
  };
}

/**
 * تحسين الرد باستخدام LLM (اختياري)
 */
export async function enhanceWithLLM(
  structuredResponse: StructuredResponse,
  data: AnalysisData
): Promise<string> {
  try {
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: `أنت محرر لغوي. مهمتك تحسين صياغة النص التالي دون تغيير الهيكل أو المحتوى.
        
قواعد:
- حافظ على نفس الهيكل بالضبط
- حسّن الصياغة فقط
- لا تضف معلومات جديدة
- لا تحذف أي قسم
- اجعل اللغة أكثر سلاسة`
      },
      {
        role: 'user',
        content: structuredResponse.fullResponse
      }
    ];
    
    const response = await invokeLLMProvider({
      messages,
      max_tokens: 800,
      temperature: 0.3
    });
    
    return response.content || structuredResponse.fullResponse;
  } catch (error) {
    console.error('[ResponseBuilder] LLM enhancement failed, using original:', error);
    return structuredResponse.fullResponse;
  }
}

export default {
  generateExecutiveSummary,
  determineDecisionSignal,
  extractCausalFactors,
  generateTimeforecast,
  generatePsychologicalInsight,
  generateClosingQuestion,
  buildStructuredResponse,
  enhanceWithLLM
};
