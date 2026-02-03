/**
 * Thinking Engine v2 - AmalSense Consultant Brain
 * 
 * تحول من "شاعر يوصف" إلى "مستشار يحلل ويوصي"
 * 
 * كل رد يجب أن يجعل المستخدم يقول:
 * "فهمت الوضع + عرفت شن أعمل"
 * وليس فقط "كلام حلو"
 */

// أنواع النوايا/الأسئلة
export type QuestionIntent = 
  | 'decision'      // هل أشتري؟ هل الوقت مناسب؟
  | 'scenario'      // ماذا لو؟ ماذا سيحدث؟
  | 'comparison'    // أيهما أفضل؟ الفرق بين؟
  | 'explanation'   // لماذا؟ ما السبب؟
  | 'forecast'      // ما التوقع؟ كيف سيتغير؟
  | 'economic'      // أسعار، تداول، استثمار
  | 'political'     // سياسة، انتخابات، حكومة
  | 'psychological' // مشاعر، حالة نفسية، وعي
  | 'journalistic'  // قصة، تقرير، ملخص
  | 'academic'      // بحث، إحصاء، علمي
  | 'general';      // سؤال عام

// هيكل تحليل السؤال
export interface QuestionAnalysis {
  intent: QuestionIntent;
  subIntent?: string;
  topic: string;
  country?: string;
  requiresEconomicData: boolean;
  requiresComparison: boolean;
  requiresScenario: boolean;
  requiresForecast: boolean;
  expectedResponseType: 'judgment' | 'analysis' | 'simulation' | 'comparison' | 'story';
  confidence: number;
  // جديد: استخراج الكيانات من السؤال
  entities: {
    assets?: string[];      // ذهب، فضة، دولار، عقار
    timeframe?: string;     // أسبوع، شهر، سنة
    action?: string;        // شراء، بيع، انتظار
  };
}

// هيكل الرد الديناميكي
export interface DynamicResponseStructure {
  sections: ResponseSection[];
  tone: 'advisory' | 'analytical' | 'journalistic' | 'academic';
  maxLength: number;
  includeEconomicData: boolean;
  includeComparison: boolean;
  includeScenario: boolean;
}

export interface ResponseSection {
  type: 'analysis' | 'causes' | 'signal' | 'recommendation' | 'economic' | 'forecast' | 'insight' | 'comparison' | 'scenario' | 'question';
  required: boolean;
  maxWords?: number;
}

/**
 * Intent Analyzer - يفهم نوع السؤال
 */
export function analyzeQuestionIntent(question: string): QuestionAnalysis {
  const q = question.toLowerCase();
  
  // كلمات مفتاحية لكل نوع
  const patterns = {
    decision: [
      /هل (الوقت|الآن|توا) (مناسب|صح|جيد)/,
      /هل (أشتري|أبيع|أستثمر|أدخل)/,
      /فرصة (استثمار|شراء|بيع)/,
      /أم (إشارة خطر|علامة خطر)/,
      /فقاعة أم نمو/,
      /استقرار أم توتر/,
      /أم (الانتظار|ننتظر)/
    ],
    scenario: [
      /ماذا (لو|سيحدث|يحدث)/,
      /لو (استمر|ارتفع|انخفض|حدث|تم)/,
      /ماذا (إذا|اذا)/,
      /سيناريو/,
      /لو أُعلن/,
      /لو حدث/
    ],
    comparison: [
      /أيهما (أكثر|أفضل|أسوأ)/,
      /الفرق بين/,
      /مقارنة/,
      /أم .* أعلى/,
      /مختلف عن/,
      /أقوى من/
    ],
    explanation: [
      /لماذا/,
      /ما السبب/,
      /ما أكثر عامل/,
      /ما الذي يسبب/,
      /السبب الرئيسي/,
      /أسباب/,
      /بسبب/
    ],
    forecast: [
      /كيف سيتغير/,
      /ما التوقع/,
      /خلال (الشهر|الأسبوع|الأيام)/,
      /في تصاعد أم تراجع/,
      /يتحسن أم يتدهور/,
      /مستقر أم متقلب/
    ],
    economic: [
      /سعر (الدولار|الذهب|الفضة|النفط)/,
      /أسعار/,
      /تداول/,
      /استثمار/,
      /سوق (عقاري|مالي)/,
      /تضخم/,
      /ركود/,
      /اقتصاد/,
      /قطاع اقتصادي/,
      /انخفض|ارتفع/,
      /ذهب|فضة|دولار|نفط/
    ],
    political: [
      /سياس/,
      /انتخابات/,
      /حكوم/,
      /خطاب سياسي/,
      /انقسام/,
      /سلطة/
    ],
    psychological: [
      /حالة نفسية/,
      /الحالة النفسية/,
      /مشاعر/,
      /خائف/,
      /متوتر/,
      /إنكار أم/,
      /قبول أم/,
      /انهيار أم تكيف/,
      /صدمة/,
      /ذاكرة عاطفية/,
      /نوع الخوف/,
      /مستوى الثقة/,
      /مستعد للتغيير/,
      /المرونة النفسية/,
      /أمل حقيقي/,
      /وجودي أم مالي/
    ],
    journalistic: [
      /كيف يشعر/,
      /القصة/,
      /ما الذي يقلق/,
      /بجملة واحدة/,
      /صف/,
      /تحول/,
      /ملخص/,
      /أعطني/,
      /أهم 3/,
      /أهم ثلاث/,
      /كيف أكتب/,
      /الزاوية الصحفية/,
      /الأرقام التي يجب/,
      /تقرير/
    ],
    academic: [
      /إحصائي/,
      /ارتباط/,
      /مؤشر تنبؤي/,
      /دوري/,
      /قياس/,
      /نمط/,
      /نظرية DCFT/,
      /كيف يتم حساب/,
      /الفرق بين CFI/,
      /الفرق بين HRI/,
      /مصادر البيانات/,
      /تحليل المشاعر/,
      /دقة التنبؤات/,
      /يختلف AmalSense/,
      /GMI/,
      /CFI/,
      /HRI/
    ]
  };

  // تحديد النية الأساسية
  let intent: QuestionIntent = 'general';
  let confidence = 0.5;

  // أولوية لـ explanation إذا كان السؤال يبدأ بـ "لماذا"
  if (/^لماذا|لماذا/.test(q)) {
    intent = 'explanation';
    confidence = 0.9;
  } else {
    for (const [intentType, patternList] of Object.entries(patterns)) {
      for (const pattern of patternList) {
        if (pattern.test(q)) {
          intent = intentType as QuestionIntent;
          confidence = 0.85;
          break;
        }
      }
      if (confidence > 0.5) break;
    }
  }

  // استخراج الموضوع
  const topic = extractTopic(question);
  
  // استخراج الدولة
  const country = extractCountry(question);
  
  // استخراج الكيانات
  const entities = extractEntities(question);

  // تحديد ما يحتاجه الرد
  const requiresEconomicData = ['economic', 'decision', 'explanation'].includes(intent) && 
    /سعر|تداول|استثمار|شراء|بيع|ذهب|فضة|دولار|نفط|عقار|انخفض|ارتفع/.test(q);
  
  const requiresComparison = intent === 'comparison' || /أيهما|مقارنة|الفرق|مختلف/.test(q);
  
  const requiresScenario = intent === 'scenario' || /ماذا لو|لو استمر|سيناريو/.test(q);
  
  const requiresForecast = ['forecast', 'scenario'].includes(intent) || 
    /سيتغير|التوقع|خلال|تصاعد|تراجع/.test(q);

  // نوع الرد المتوقع
  let expectedResponseType: QuestionAnalysis['expectedResponseType'] = 'analysis';
  if (intent === 'decision') expectedResponseType = 'judgment';
  if (intent === 'scenario') expectedResponseType = 'simulation';
  if (intent === 'comparison') expectedResponseType = 'comparison';
  if (intent === 'journalistic') expectedResponseType = 'story';

  return {
    intent,
    topic,
    country,
    requiresEconomicData,
    requiresComparison,
    requiresScenario,
    requiresForecast,
    expectedResponseType,
    confidence,
    entities
  };
}

/**
 * استخراج الكيانات من السؤال
 */
function extractEntities(question: string): QuestionAnalysis['entities'] {
  const entities: QuestionAnalysis['entities'] = {};
  const q = question.toLowerCase();
  
  // استخراج الأصول المالية
  const assetPatterns = [
    { pattern: /ذهب/, name: 'الذهب' },
    { pattern: /فضة/, name: 'الفضة' },
    { pattern: /دولار/, name: 'الدولار' },
    { pattern: /نفط/, name: 'النفط' },
    { pattern: /عقار/, name: 'العقارات' },
    { pattern: /أسهم/, name: 'الأسهم' },
  ];
  
  entities.assets = assetPatterns
    .filter(p => p.pattern.test(q))
    .map(p => p.name);
  
  // استخراج الإطار الزمني
  if (/أسبوع/.test(q)) entities.timeframe = 'أسبوع';
  else if (/شهر/.test(q)) entities.timeframe = 'شهر';
  else if (/سنة|عام/.test(q)) entities.timeframe = 'سنة';
  else if (/يوم/.test(q)) entities.timeframe = 'يوم';
  
  // استخراج الفعل المطلوب
  if (/شراء|أشتري|اشتري/.test(q)) entities.action = 'شراء';
  else if (/بيع|أبيع|ابيع/.test(q)) entities.action = 'بيع';
  else if (/انتظار|انتظر|أنتظر/.test(q)) entities.action = 'انتظار';
  else if (/استثمار|أستثمر/.test(q)) entities.action = 'استثمار';
  
  return entities;
}

/**
 * استخراج الموضوع من السؤال
 */
function extractTopic(question: string): string {
  let topic = question;
  
  // إزالة علامات الاستفهام والتعجب
  topic = topic.replace(/[؟?!\.]+$/, '').trim();
  
  // إزالة كلمات السؤال من البداية
  const questionWords = [
    /^هل\s+/,
    /^ما\s+(هو|هي|هم|هن)?\s*/,
    /^ماذا\s+/,
    /^كيف\s+/,
    /^لماذا\s+/,
    /^أين\s+/,
    /^متى\s+/,
    /^من\s+/,
    /^أي\s+/,
    /^أيهما\s+/,
  ];
  
  for (const pattern of questionWords) {
    topic = topic.replace(pattern, '');
  }
  
  // إزالة كلمات إضافية
  topic = topic.replace(/^(الوقت|الآن|توا)\s+(مناسب|صح|جيد)\s+(ل|لـ)?\s*/, '');
  topic = topic.replace(/^(أشتري|أبيع|أستثمر)\s+(في\s+)?/, '');
  topic = topic.replace(/^(لو|إذا)\s+/, '');
  
  // تنظيف المسافات
  topic = topic.replace(/\s+/g, ' ').trim();
  
  // إذا كان الموضوع قصير جداً، استخدم السؤال الأصلي
  if (topic.length < 5) {
    topic = question.replace(/[؟?!\.]+$/, '').trim();
  }
  
  return topic;
}

/**
 * استخراج الدولة من السؤال
 */
function extractCountry(question: string): string | undefined {
  const countries: Record<string, string> = {
    'ليبيا': 'LY',
    'مصر': 'EG',
    'تونس': 'TN',
    'الجزائر': 'DZ',
    'المغرب': 'MA',
    'السعودية': 'SA',
    'الإمارات': 'AE',
    'طرابلس': 'LY',
    'بنغازي': 'LY',
    'القاهرة': 'EG'
  };

  for (const [name, code] of Object.entries(countries)) {
    if (question.includes(name)) {
      return code;
    }
  }
  return undefined;
}

/**
 * Response Composer - يختار شكل الرد المناسب
 */
export function composeResponseStructure(analysis: QuestionAnalysis): DynamicResponseStructure {
  const sections: ResponseSection[] = [];
  
  // 1. التحليل المبني على البيانات - دائماً أولاً
  sections.push({ type: 'analysis', required: true, maxWords: 60 });

  // 2. الأسباب - لمعظم الأسئلة
  if (!['general'].includes(analysis.intent)) {
    sections.push({ type: 'causes', required: true });
  }

  // 3. إشارة القرار - واضحة وعملية
  if (!['academic'].includes(analysis.intent)) {
    sections.push({ type: 'signal', required: true });
  }
  
  // 4. التوصية العملية - للأسئلة القرارية والاقتصادية
  if (['decision', 'economic', 'explanation'].includes(analysis.intent)) {
    sections.push({ type: 'recommendation', required: true });
  }

  // 5. البيانات الاقتصادية - فقط للأسئلة الاقتصادية
  if (analysis.requiresEconomicData) {
    sections.push({ type: 'economic', required: true });
  }

  // 6. المقارنة - للأسئلة المقارنة
  if (analysis.requiresComparison) {
    sections.push({ type: 'comparison', required: true });
  }

  // 7. السيناريو - للأسئلة الافتراضية
  if (analysis.requiresScenario) {
    sections.push({ type: 'scenario', required: true });
  }

  // 8. التوقع - للأسئلة المستقبلية
  if (analysis.requiresForecast) {
    sections.push({ type: 'forecast', required: true });
  }

  // 9. القراءة النفسية - للأسئلة النفسية والعامة
  if (['psychological', 'general', 'journalistic', 'academic'].includes(analysis.intent)) {
    sections.push({ type: 'insight', required: true });
  }

  // 10. السؤال الختامي الذكي - دائماً
  sections.push({ type: 'question', required: true });

  // تحديد النبرة
  let tone: DynamicResponseStructure['tone'] = 'analytical';
  if (analysis.intent === 'decision') tone = 'advisory';
  if (analysis.intent === 'journalistic') tone = 'journalistic';
  if (analysis.intent === 'academic') tone = 'academic';

  // تحديد الطول
  let maxLength = 300;
  if (analysis.requiresComparison) maxLength = 400;
  if (analysis.requiresScenario) maxLength = 350;
  if (analysis.intent === 'academic') maxLength = 450;

  return {
    sections,
    tone,
    maxLength,
    includeEconomicData: analysis.requiresEconomicData,
    includeComparison: analysis.requiresComparison,
    includeScenario: analysis.requiresScenario
  };
}

/**
 * بناء الرد الديناميكي
 */
export interface ResponseData {
  topic: string;
  country?: string;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  trend: string;
  causes?: {
    economic?: string[];
    media?: string[];
    political?: string[];
    contextual?: string[];
  };
  economicData?: {
    currencies?: Record<string, { rate: number; change: number }>;
    gold?: { price: number; change: number };
    oil?: { brent: number; wti: number };
  };
  news?: Array<{ title: string; source: string }>;
}

export function buildDynamicResponse(
  analysis: QuestionAnalysis,
  structure: DynamicResponseStructure,
  data: ResponseData
): string {
  const parts: string[] = [];

  for (const section of structure.sections) {
    switch (section.type) {
      case 'analysis':
        parts.push(buildAnalysis(analysis, data));
        break;
      case 'causes':
        parts.push(buildCauses(analysis, data));
        break;
      case 'signal':
        parts.push(buildSignal(analysis, data));
        break;
      case 'recommendation':
        parts.push(buildRecommendation(analysis, data));
        break;
      case 'economic':
        if (structure.includeEconomicData && data.economicData) {
          parts.push(buildEconomicSection(data.economicData));
        }
        break;
      case 'comparison':
        if (structure.includeComparison) {
          parts.push(buildComparison(analysis, data));
        }
        break;
      case 'scenario':
        if (structure.includeScenario) {
          parts.push(buildScenario(analysis, data));
        }
        break;
      case 'forecast':
        parts.push(buildForecast(analysis, data));
        break;
      case 'insight':
        parts.push(buildInsight(data));
        break;
      case 'question':
        parts.push(buildClosingQuestion(analysis, data));
        break;
    }
  }

  return parts.filter(p => p.length > 0).join('\n\n');
}

// ============================================
// دوال بناء الأقسام - النسخة الجديدة (مستشار)
// ============================================

/**
 * بناء التحليل المبني على البيانات
 * يسرد ويشرح: "بناءً على البيانات، نلاحظ أن..."
 */
function buildAnalysis(analysis: QuestionAnalysis, data: ResponseData): string {
  const topic = analysis.topic;
  
  // بناء تحليل مبني على البيانات الفعلية
  const parts: string[] = [];
  
  // الجملة الافتتاحية - تعتمد على نوع السؤال
  if (analysis.intent === 'explanation') {
    parts.push(`**التحليل:**`);
    parts.push(`بناءً على قراءة المؤشرات، نلاحظ أن ${topic} يرتبط بعدة عوامل:`);
  } else if (analysis.intent === 'decision') {
    parts.push(`**التحليل:**`);
    parts.push(`بناءً على البيانات الحالية، ${topic} يظهر ${data.cfi > 55 ? 'مستوى قلق مرتفع' : data.hri > 55 ? 'مؤشرات إيجابية' : 'حالة ترقب'}.`);
  } else if (analysis.intent === 'economic') {
    parts.push(`**التحليل:**`);
    parts.push(`من الناحية النفسية الجماعية، ${topic} يعكس ${getMoodDescription(data.gmi, data.cfi, data.hri)}.`);
  } else {
    parts.push(`**التحليل:**`);
    parts.push(`${topic} - ${getMoodDescription(data.gmi, data.cfi, data.hri)}.`);
  }
  
  // إضافة الأرقام الداعمة
  parts.push(`المؤشرات: الخوف ${data.cfi}% | الأمل ${data.hri}% | المزاج العام ${data.gmi}%`);
  
  return parts.join('\n');
}

/**
 * بناء قسم الأسباب - أسباب فعلية وليس وصف
 */
function buildCauses(analysis: QuestionAnalysis, data: ResponseData): string {
  const causes = data.causes || {};
  const parts: string[] = ['**لماذا هذا الوضع؟**'];
  
  // استخراج الأصول من السؤال لتحديد الأسباب المناسبة
  const assets = analysis.entities?.assets || [];
  const hasGold = assets.includes('الذهب');
  const hasSilver = assets.includes('الفضة');
  const hasDollar = assets.includes('الدولار');
  const hasOil = assets.includes('النفط');
  
  // أسباب اقتصادية حقيقية بناءً على الأصول
  const economicCauses: string[] = [];
  
  if (hasGold || hasSilver) {
    economicCauses.push('ارتفاع أسعار الفائدة عالمياً يضغط على المعادن الثمينة');
    economicCauses.push('قوة الدولار الأمريكي تجعل الذهب أقل جاذبية');
    if (hasSilver) {
      economicCauses.push('تباطؤ الطلب الصناعي على الفضة');
    }
  }
  
  if (hasDollar) {
    economicCauses.push('سياسات الفيدرالي الأمريكي تؤثر على قيمة الدولار');
    economicCauses.push('الفجوة بين السعر الرسمي والموازي تخلق قلقاً');
  }
  
  if (hasOil) {
    economicCauses.push('تقلبات أسعار النفط تؤثر على الإيرادات');
    economicCauses.push('قرارات أوبك+ تحدد اتجاه السوق');
  }
  
  // إذا لم تكن هناك أصول محددة، نعطي أسباب عامة
  if (economicCauses.length === 0) {
    if (data.cfi > 60) {
      economicCauses.push('عدم اليقين الاقتصادي يرفع مستوى القلق');
    }
    if (data.hri < 45) {
      economicCauses.push('غياب أخبار إيجابية يضعف التفاؤل');
    }
    if (data.gmi < 45) {
      economicCauses.push('الضغوط المعيشية تؤثر على المزاج العام');
    }
  }
  
  // إضافة الأسباب من السياق
  if (causes.contextual && causes.contextual.length > 0) {
    causes.contextual.forEach(c => economicCauses.push(c));
  }
  if (causes.economic && causes.economic.length > 0) {
    causes.economic.forEach(c => economicCauses.push(c));
  }
  if (causes.political && causes.political.length > 0) {
    causes.political.forEach(c => economicCauses.push(c));
  }
  
  // تنسيق الأسباب
  if (economicCauses.length > 0) {
    // أخذ أول 3 أسباب فقط
    const topCauses = economicCauses.slice(0, 3);
    topCauses.forEach((cause, i) => {
      parts.push(`${i + 1}. ${cause}`);
    });
  } else {
    parts.push('المؤشرات في نطاق محايد - لا توجد ضغوط واضحة حالياً');
  }
  
  return parts.join('\n');
}

/**
 * بناء إشارة القرار - واضحة وعملية
 */
function buildSignal(analysis: QuestionAnalysis, data: ResponseData): string {
  const parts: string[] = ['**إشارة القرار:**'];
  
  // تحديد الموقف بناءً على المؤشرات
  let position = '';
  let reasoning = '';
  let emoji = '';
  
  if (data.cfi > 70) {
    position = 'تجنب المخاطر';
    reasoning = 'مستوى القلق مرتفع جداً';
    emoji = '🚨';
  } else if (data.cfi > 55 && data.hri < 50) {
    position = 'مراقبة وانتظار';
    reasoning = 'التوتر يفوق التفاؤل';
    emoji = '⚠️';
  } else if (data.hri > 60 && data.cfi < 50) {
    position = 'فرصة للدخول التدريجي';
    reasoning = 'المؤشرات تميل للإيجابية';
    emoji = '✅';
  } else if (data.hri > 55) {
    position = 'مراقبة مع استعداد';
    reasoning = 'الأمل موجود لكن الحذر مطلوب';
    emoji = '📈';
  } else {
    position = 'مراقبة';
    reasoning = 'الوضع محايد';
    emoji = '👁️';
  }
  
  parts.push(`${emoji} **الموقف:** ${position}`);
  parts.push(`**السبب:** ${reasoning} (خوف ${data.cfi}% | أمل ${data.hri}%)`);
  
  return parts.join('\n');
}

/**
 * بناء التوصية العملية - ماذا يفعل المستخدم؟
 */
function buildRecommendation(analysis: QuestionAnalysis, data: ResponseData): string {
  const parts: string[] = ['**التوصية:**'];
  
  const assets = analysis.entities?.assets || [];
  const action = analysis.entities?.action;
  
  // توصية مخصصة بناءً على الأصول والمؤشرات
  if (data.cfi > 65) {
    parts.push('• تأجيل القرارات الكبيرة حتى تهدأ المؤشرات');
    parts.push('• إذا كنت مستثمراً، حافظ على السيولة');
  } else if (data.hri > 60 && data.cfi < 50) {
    if (assets.includes('الذهب') || assets.includes('الفضة')) {
      parts.push('• الدخول التدريجي قد يكون مناسباً');
      parts.push('• لا تضع كل رأس المال دفعة واحدة');
    } else {
      parts.push('• الوقت قد يكون مناسباً للتحرك');
      parts.push('• ابدأ بخطوات صغيرة وراقب النتائج');
    }
  } else {
    parts.push('• المراقبة أفضل من التسرع حالياً');
    parts.push('• انتظر إشارات أوضح قبل اتخاذ قرار');
  }
  
  return parts.join('\n');
}

/**
 * بناء قسم البيانات الاقتصادية
 */
function buildEconomicSection(economicData: ResponseData['economicData']): string {
  if (!economicData) return '';
  
  const parts: string[] = ['**المؤشرات الاقتصادية:**'];
  
  if (economicData.currencies) {
    const currencies = Object.entries(economicData.currencies)
      .map(([code, data]) => {
        const arrow = data.change > 0 ? '↑' : data.change < 0 ? '↓' : '→';
        return `${code}: ${data.rate.toFixed(2)} ${arrow}${Math.abs(data.change).toFixed(1)}%`;
      })
      .join(' | ');
    parts.push(currencies);
  }
  
  if (economicData.gold) {
    const arrow = economicData.gold.change > 0 ? '↑' : '↓';
    parts.push(`الذهب: $${economicData.gold.price} ${arrow}${Math.abs(economicData.gold.change).toFixed(1)}%`);
  }
  
  if (economicData.oil) {
    parts.push(`النفط: برنت $${economicData.oil.brent} | WTI $${economicData.oil.wti}`);
  }
  
  return parts.join('\n');
}

/**
 * بناء المقارنة
 */
function buildComparison(analysis: QuestionAnalysis, data: ResponseData): string {
  const topic = analysis.topic;
  const parts: string[] = ['**المقارنة:**'];
  
  const comparisonItems = extractComparisonItems(topic);
  
  if (comparisonItems.length >= 2) {
    const [item1, item2] = comparisonItems;
    
    parts.push(`| العنصر | الحالة النفسية | التوصية |`);
    parts.push(`|--------|-----------------|---------|`);
    parts.push(`| ${item1} | ${data.cfi > 55 ? 'قلق أعلى' : 'أكثر استقراراً'} | ${data.cfi > 55 ? 'حذر' : 'مراقبة'} |`);
    parts.push(`| ${item2} | ${data.hri > 55 ? 'تفاؤل أكثر' : 'أقل تفاؤلاً'} | ${data.hri > 55 ? 'فرصة' : 'انتظار'} |`);
    parts.push(``);
    parts.push(`**الخلاصة:** ${data.cfi > data.hri ? item1 + ' يحمل مخاطر أعلى' : item2 + ' يبدو أفضل نسبياً'}`);
  } else {
    parts.push(`عند مقارنة ${topic}:`);
    parts.push(`• مستوى القلق: ${data.cfi}% (${data.cfi > 55 ? 'مرتفع' : 'معتدل'})`);
    parts.push(`• مستوى الأمل: ${data.hri}% (${data.hri > 55 ? 'إيجابي' : 'محايد'})`);
  }
  
  return parts.join('\n');
}

function extractComparisonItems(topic: string): string[] {
  const patterns = [
    /(.+?)\s+أم\s+(.+)/,
    /(.+?)\s+و\s+(.+)/,
    /بين\s+(.+?)\s+و\s*(.+)/,
    /(.+?)\s+مقابل\s+(.+)/
  ];
  
  for (const pattern of patterns) {
    const match = topic.match(pattern);
    if (match) {
      return [match[1].trim(), match[2].trim()];
    }
  }
  
  return [];
}

/**
 * بناء السيناريو
 */
function buildScenario(analysis: QuestionAnalysis, data: ResponseData): string {
  const topic = analysis.topic;
  
  const parts: string[] = ['**السيناريو المتوقع:**'];
  parts.push(`في حال ${topic}:`);
  parts.push(`• التأثير النفسي: ${data.cfi > 50 ? 'سلبي - ارتفاع القلق' : 'متباين'}`);
  parts.push(`• مستوى الخوف: ${data.cfi > 60 ? 'سيرتفع أكثر' : 'سيبقى مستقراً نسبياً'}`);
  parts.push(`• مستوى الأمل: ${data.hri > 50 ? 'قد يتراجع مؤقتاً' : 'سيتأثر سلباً'}`);
  
  return parts.join('\n');
}

/**
 * بناء التوقع
 */
function buildForecast(analysis: QuestionAnalysis, data: ResponseData): string {
  const trend = data.trend || 'stable';
  const timeframe = analysis.entities?.timeframe || 'الأسبوع القادم';
  
  let forecast = '';
  if (trend === 'up' || data.hri > 55) {
    forecast = 'تحسن تدريجي متوقع إذا استمرت المؤشرات الإيجابية';
  } else if (trend === 'down' || data.cfi > 60) {
    forecast = 'استمرار الضغط مع احتمال تقلبات';
  } else {
    forecast = 'استقرار نسبي مع حساسية للأخبار';
  }
  
  return `**التوقع:** خلال ${timeframe}: ${forecast}`;
}

/**
 * بناء القراءة النفسية
 */
function buildInsight(data: ResponseData): string {
  const emotion = data.dominantEmotion || 'الترقب';
  const insight = getInsightByEmotion(emotion, data.cfi, data.hri);
  
  return `**القراءة النفسية:** ${insight}`;
}

/**
 * بناء السؤال الختامي الذكي
 */
function buildClosingQuestion(analysis: QuestionAnalysis, data: ResponseData): string {
  const assets = analysis.entities?.assets || [];
  
  // أسئلة ذكية ومحددة بناءً على السياق
  const smartQuestions: Record<QuestionIntent, () => string> = {
    decision: () => {
      if (assets.length > 0) {
        return `هل نحلل تأثير استمرار هذا الاتجاه على ${assets[0]} خلال أسبوع؟`;
      }
      return 'هل نحلل سيناريو معين لقرارك؟';
    },
    explanation: () => {
      if (assets.length >= 2) {
        return `هل نركز على ${assets[0]} أم ${assets[1]}؟`;
      }
      return 'هل نتعمق في أحد هذه الأسباب؟';
    },
    scenario: () => 'هل نحلل السيناريو المعاكس؟',
    comparison: () => 'هل نضيف عنصر ثالث للمقارنة؟',
    forecast: () => 'هل نحلل ماذا يحدث لو تغيرت الظروف؟',
    economic: () => {
      if (assets.length > 0) {
        return `هل نحلل العلاقة بين ${assets[0]} والمزاج العام؟`;
      }
      return 'هل نحلل قطاع اقتصادي محدد؟';
    },
    political: () => 'هل نربط السياسة بالاقتصاد؟',
    psychological: () => 'هل نتعمق في أحد المؤشرات النفسية؟',
    journalistic: () => 'هل نركز على زاوية صحفية محددة؟',
    academic: () => 'هل نشرح منهجية القياس بالتفصيل؟',
    general: () => 'هل لديك سؤال محدد أكثر؟'
  };
  
  const questionFn = smartQuestions[analysis.intent] || smartQuestions.general;
  return questionFn();
}

// ============================================
// دوال مساعدة
// ============================================

function getMoodDescription(gmi: number, cfi: number, hri: number): string {
  if (cfi > 65) {
    return 'حالة توتر وقلق واضح';
  } else if (hri > 60 && cfi < 50) {
    return 'حالة تفاؤل حذر';
  } else if (gmi > 55) {
    return 'حالة محايدة تميل للإيجابية';
  } else if (gmi < 45) {
    return 'حالة محايدة تميل للسلبية';
  } else {
    return 'حالة ترقب وانتظار';
  }
}

function getInsightByEmotion(emotion: string, cfi: number, hri: number): string {
  const insights: Record<string, string> = {
    'الخوف': 'المجتمع في حالة دفاعية، يتجنب المخاطر ويترقب.',
    'الأمل': 'رغم التحديات، هناك إيمان بإمكانية التحسن.',
    'الفضول': 'المجتمع يراقب ويحلل، ينتظر إشارات واضحة.',
    'الغضب': 'إحباط متراكم قد يتحول لفعل إذا استمر الضغط.',
    'الحزن': 'المجتمع في حالة استيعاب لتغييرات صعبة.',
    'الترقب': 'حالة انتظار مشحونة، المجتمع جاهز للتفاعل.'
  };
  
  let base = insights[emotion] || 'المجتمع في حالة معقدة تجمع بين مشاعر متعددة.';
  
  // إضافة ملاحظة بناءً على المؤشرات
  if (cfi > 60 && hri > 50) {
    base += ' الملفت: وجود خوف وأمل معاً يشير إلى مجتمع يقاوم.';
  }
  
  return base;
}

/**
 * الدالة الرئيسية - Thinking Engine
 */
export function think(question: string, data: ResponseData): string {
  // 1. تحليل السؤال
  const analysis = analyzeQuestionIntent(question);
  
  // 2. تحديد هيكل الرد
  const structure = composeResponseStructure(analysis);
  
  // 3. إضافة الموضوع للبيانات
  data.topic = analysis.topic;
  data.country = analysis.country;
  
  // 4. بناء الرد الديناميكي
  const response = buildDynamicResponse(analysis, structure, data);
  
  return response;
}

export { analyzeQuestionIntent as analyzeIntent };
