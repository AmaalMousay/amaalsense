/**
 * Thinking Engine v3 - AmalSense Narrative Consultant
 * 
 * تحول من "تقارير مضغوطة" إلى "سرد طويل مفصل مثل ChatGPT"
 * 
 * المبادئ:
 * 1. سرد طويل ومفصل - كل نقطة تُشرح بالتفصيل
 * 2. لغة نظيفة - بدون كلمات تقنية
 * 3. إخفاء الأرقام الاقتصادية - إلا في وضع التداول
 * 4. أسباب قوية - عناوين وأخبار حقيقية
 * 
 * كل رد يجب أن يجعل المستخدم يقول:
 * "فهمت الوضع + عرفت شن أعمل"
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
  cleanTopic: string; // الموضوع النظيف للعرض
  country?: string;
  requiresEconomicData: boolean;
  requiresComparison: boolean;
  requiresScenario: boolean;
  requiresForecast: boolean;
  expectedResponseType: 'judgment' | 'analysis' | 'simulation' | 'comparison' | 'story';
  confidence: number;
  entities: {
    assets?: string[];
    timeframe?: string;
    action?: string;
  };
}

// هيكل الرد
export interface DynamicResponseStructure {
  sections: ResponseSection[];
  tone: 'advisory' | 'analytical' | 'journalistic' | 'academic';
  maxLength: number;
  includeEconomicData: boolean;
  includeComparison: boolean;
  includeScenario: boolean;
}

export interface ResponseSection {
  type: 'summary' | 'signal' | 'causes' | 'recommendation' | 'insight' | 'economic' | 'comparison' | 'scenario' | 'forecast' | 'question';
  required: boolean;
}

/**
 * Intent Analyzer - يفهم نوع السؤال
 */
export function analyzeQuestionIntent(question: string): QuestionAnalysis {
  const q = question.toLowerCase();
  
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
      /بسبب/,
      /ماسباب/,
      /ما سبب/
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

  let intent: QuestionIntent = 'general';
  let confidence = 0.5;

  // أولوية لـ explanation إذا كان السؤال يبدأ بـ "لماذا" أو "ماسباب"
  if (/^(لماذا|ماسباب|ما سبب)/.test(q)) {
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
  const cleanTopic = cleanTopicForDisplay(question, topic);
  
  // استخراج الدولة
  const country = extractCountry(question);
  
  // استخراج الكيانات
  const entities = extractEntities(question);

  // تحديد ما يحتاجه الرد - إخفاء البيانات الاقتصادية في الردود العامة
  // البيانات الاقتصادية تظهر فقط في أسئلة التداول المباشرة
  const requiresEconomicData = intent === 'economic' && 
    /سعر|كم سعر|ما سعر|أسعار اليوم/.test(q);
  
  const requiresComparison = intent === 'comparison' || /أيهما|مقارنة|الفرق|مختلف/.test(q);
  const requiresScenario = intent === 'scenario' || /ماذا لو|لو استمر|سيناريو/.test(q);
  const requiresForecast = ['forecast', 'scenario'].includes(intent) || 
    /سيتغير|التوقع|خلال|تصاعد|تراجع/.test(q);

  let expectedResponseType: QuestionAnalysis['expectedResponseType'] = 'analysis';
  if (intent === 'decision') expectedResponseType = 'judgment';
  if (intent === 'scenario') expectedResponseType = 'simulation';
  if (intent === 'comparison') expectedResponseType = 'comparison';
  if (intent === 'journalistic') expectedResponseType = 'story';

  return {
    intent,
    topic,
    cleanTopic,
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
  
  const assetPatterns = [
    { pattern: /ذهب/, name: 'الذهب' },
    { pattern: /فضة|فضه/, name: 'الفضة' },
    { pattern: /دولار/, name: 'الدولار' },
    { pattern: /نفط/, name: 'النفط' },
    { pattern: /عقار/, name: 'العقارات' },
    { pattern: /أسهم/, name: 'الأسهم' },
  ];
  
  entities.assets = assetPatterns
    .filter(p => p.pattern.test(q))
    .map(p => p.name);
  
  if (/أسبوع/.test(q)) entities.timeframe = 'أسبوع';
  else if (/شهر/.test(q)) entities.timeframe = 'شهر';
  else if (/سنة|عام/.test(q)) entities.timeframe = 'سنة';
  else if (/يوم/.test(q)) entities.timeframe = 'يوم';
  
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
  
  topic = topic.replace(/[؟?!\.]+$/, '').trim();
  
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
    /^ماسباب\s+/,
    /^ما سبب\s+/,
  ];
  
  for (const pattern of questionWords) {
    topic = topic.replace(pattern, '');
  }
  
  topic = topic.replace(/^(الوقت|الآن|توا)\s+(مناسب|صح|جيد)\s+(ل|لـ)?\s*/, '');
  topic = topic.replace(/^(أشتري|أبيع|أستثمر)\s+(في\s+)?/, '');
  topic = topic.replace(/^(لو|إذا)\s+/, '');
  
  topic = topic.replace(/\s+/g, ' ').trim();
  
  if (topic.length < 5) {
    topic = question.replace(/[؟?!\.]+$/, '').trim();
  }
  
  return topic;
}

/**
 * تنظيف الموضوع للعرض - إزالة الكلمات الزائدة
 */
function cleanTopicForDisplay(question: string, topic: string): string {
  const q = question.toLowerCase();
  
  // استخراج الأصول المذكورة
  const assets: string[] = [];
  if (/ذهب/.test(q)) assets.push('الذهب');
  if (/فضة|فضه/.test(q)) assets.push('الفضة');
  if (/دولار/.test(q)) assets.push('الدولار');
  if (/نفط/.test(q)) assets.push('النفط');
  
  // استخراج الفعل
  let action = '';
  if (/انخفض|انخفاض|هبوط/.test(q)) action = 'انخفاض';
  else if (/ارتفع|ارتفاع|صعود/.test(q)) action = 'ارتفاع';
  else if (/تذبذب|تقلب/.test(q)) action = 'تذبذب';
  
  // بناء موضوع نظيف
  if (action && assets.length > 0) {
    if (assets.length === 1) {
      return `${action} أسعار ${assets[0]}`;
    } else {
      return `${action} أسعار ${assets.join(' و')}`;
    }
  }
  
  // تنظيف الموضوع من الكلمات الزائدة
  let clean = topic;
  clean = clean.replace(/^(ماسباب|ما سبب|لماذا)\s*/i, '');
  clean = clean.replace(/^(اسعار|أسعار)\s*/i, '');
  
  return clean || topic;
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
  
  // 1. الخلاصة - دائماً أولاً (بدون كلمة "التحليل")
  sections.push({ type: 'summary', required: true });

  // 2. إشارة القرار
  sections.push({ type: 'signal', required: true });

  // 3. الأسباب - لمعظم الأسئلة
  sections.push({ type: 'causes', required: true });

  // 4. التوصية - للأسئلة القرارية والاقتصادية
  if (['decision', 'economic', 'explanation'].includes(analysis.intent)) {
    sections.push({ type: 'recommendation', required: true });
  }

  // 5. القراءة النفسية
  sections.push({ type: 'insight', required: true });

  // 6. البيانات الاقتصادية - فقط للأسئلة المباشرة عن الأسعار
  if (analysis.requiresEconomicData) {
    sections.push({ type: 'economic', required: true });
  }

  // 7. المقارنة
  if (analysis.requiresComparison) {
    sections.push({ type: 'comparison', required: true });
  }

  // 8. السيناريو
  if (analysis.requiresScenario) {
    sections.push({ type: 'scenario', required: true });
  }

  // 9. التوقع
  if (analysis.requiresForecast) {
    sections.push({ type: 'forecast', required: true });
  }

  // 10. السؤال الختامي الذكي
  sections.push({ type: 'question', required: true });

  let tone: DynamicResponseStructure['tone'] = 'analytical';
  if (analysis.intent === 'decision') tone = 'advisory';
  if (analysis.intent === 'journalistic') tone = 'journalistic';
  if (analysis.intent === 'academic') tone = 'academic';

  return {
    sections,
    tone,
    maxLength: 600, // زيادة الطول للسرد المفصل
    includeEconomicData: analysis.requiresEconomicData,
    includeComparison: analysis.requiresComparison,
    includeScenario: analysis.requiresScenario
  };
}

/**
 * بيانات الرد
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

/**
 * بناء الرد الديناميكي
 */
export function buildDynamicResponse(
  analysis: QuestionAnalysis,
  structure: DynamicResponseStructure,
  data: ResponseData
): string {
  const parts: string[] = [];

  for (const section of structure.sections) {
    const content = buildSection(section.type, analysis, structure, data);
    if (content) {
      parts.push(content);
    }
  }

  return parts.join('\n\n');
}

function buildSection(
  type: ResponseSection['type'],
  analysis: QuestionAnalysis,
  structure: DynamicResponseStructure,
  data: ResponseData
): string {
  switch (type) {
    case 'summary':
      return buildSummary(analysis, data);
    case 'signal':
      return buildSignal(analysis, data);
    case 'causes':
      return buildCauses(analysis, data);
    case 'recommendation':
      return buildRecommendation(analysis, data);
    case 'insight':
      return buildInsight(analysis, data);
    case 'economic':
      return structure.includeEconomicData && data.economicData 
        ? buildEconomicSection(data.economicData) 
        : '';
    case 'comparison':
      return structure.includeComparison ? buildComparison(analysis, data) : '';
    case 'scenario':
      return structure.includeScenario ? buildScenario(analysis, data) : '';
    case 'forecast':
      return buildForecast(analysis, data);
    case 'question':
      return buildClosingQuestion(analysis, data);
    default:
      return '';
  }
}

// ============================================
// دوال بناء الأقسام - النسخة السردية الطويلة
// ============================================

/**
 * بناء الخلاصة - سردية ومباشرة
 */
function buildSummary(analysis: QuestionAnalysis, data: ResponseData): string {
  const topic = analysis.cleanTopic;
  
  // وصف الحالة النفسية
  let moodDescription = '';
  if (data.cfi > 65) {
    moodDescription = 'حالة توتر وقلق واضح في السوق';
  } else if (data.cfi > 55 && data.hri < 50) {
    moodDescription = 'حالة حذر وترقب';
  } else if (data.hri > 60 && data.cfi < 50) {
    moodDescription = 'حالة تفاؤل حذر';
  } else {
    moodDescription = 'حالة ترقب وانتظار';
  }
  
  // بناء الخلاصة حسب نوع السؤال
  if (analysis.intent === 'explanation') {
    // سؤال "لماذا" - نبدأ بالخلاصة مباشرة
    const isNegative = /انخفض|انخفاض|هبوط|تراجع/.test(analysis.topic);
    const isPositive = /ارتفع|ارتفاع|صعود/.test(analysis.topic);
    
    if (isNegative) {
      return `**الخلاصة:**\nنفسياً، ${topic} يعكس ${moodDescription}، أكثر من كونه فرصة شراء مريحة. المستثمرون والمتابعون يتعاملون مع هذا الانخفاض بحذر شديد، وهناك شعور عام بأن الوقت ليس مناسباً للقرارات الكبيرة.`;
    } else if (isPositive) {
      return `**الخلاصة:**\nنفسياً، ${topic} يعكس ${moodDescription}. هناك تفاؤل ولكنه مشوب بالحذر، حيث يترقب المتابعون ما إذا كان هذا الارتفاع مستداماً أم مجرد موجة مؤقتة.`;
    } else {
      return `**الخلاصة:**\nنفسياً، ${topic} يعكس ${moodDescription}. المجتمع في حالة ترقب، ينتظر إشارات أوضح قبل اتخاذ أي قرارات.`;
    }
  }
  
  if (analysis.intent === 'decision') {
    const recommendation = data.cfi > 60 ? 'الحذر مطلوب' : data.hri > 60 ? 'قد تكون فرصة' : 'المراقبة أفضل';
    return `**الخلاصة:**\nبالنسبة لـ${topic}، الوضع النفسي الحالي يشير إلى أن ${recommendation}. ${moodDescription}، مما يعني أن القرارات الكبيرة تحتاج تأنياً ودراسة.`;
  }
  
  if (analysis.intent === 'economic') {
    return `**الخلاصة:**\nمن الناحية النفسية، ${topic} يعكس ${moodDescription}. السوق في وضع ${data.cfi > 55 ? 'دفاعي' : 'متوازن'}، والمتداولون يتصرفون بـ${data.cfi > 60 ? 'حذر شديد' : 'حذر معتدل'}.`;
  }
  
  // الافتراضي
  return `**الخلاصة:**\n${topic} - ${moodDescription}. المجتمع يتعامل مع هذا الموضوع بـ${data.cfi > 55 ? 'قلق ملحوظ' : 'اهتمام متوازن'}.`;
}

/**
 * بناء إشارة القرار - واضحة مع شرح
 */
function buildSignal(analysis: QuestionAnalysis, data: ResponseData): string {
  let emoji = '👁️';
  let position = 'مراقبة';
  let explanation = '';
  
  if (data.cfi > 70) {
    emoji = '🚨';
    position = 'تجنب المخاطر';
    explanation = 'مستوى القلق مرتفع جداً في السوق. الأغلبية في وضع دفاعي، وهذا ليس الوقت المناسب للمغامرة.';
  } else if (data.cfi > 55 && data.hri < 50) {
    emoji = '⚠️';
    position = 'مراقبة وانتظار';
    explanation = 'السوق في وضع دفاعي: الأمل موجود، لكن الحذر هو السلوك الغالب. المتابعون يفضلون الانتظار على التحرك.';
  } else if (data.hri > 60 && data.cfi < 50) {
    emoji = '✅';
    position = 'فرصة للدخول التدريجي';
    explanation = 'المؤشرات تميل للإيجابية. هناك تفاؤل معقول، لكن الدخول التدريجي أفضل من المخاطرة الكبيرة.';
  } else if (data.hri > 55) {
    emoji = '📈';
    position = 'مراقبة مع استعداد';
    explanation = 'الأمل موجود لكن الحذر مطلوب. السوق قد يتحرك في أي اتجاه، والاستعداد للفرص مهم.';
  } else {
    emoji = '👁️';
    position = 'مراقبة';
    explanation = 'الوضع محايد نسبياً. لا توجد إشارات قوية في أي اتجاه، والمراقبة هي الخيار الأمثل حالياً.';
  }
  
  return `**إشارة القرار:** ${emoji} ${position}\n${explanation}`;
}

/**
 * بناء الأسباب - مفصلة وواقعية
 */
function buildCauses(analysis: QuestionAnalysis, data: ResponseData): string {
  const parts: string[] = ['**لماذا هذا المزاج؟**\nهذا الوضع النفسي ناتج عن عدة عوامل متداخلة:'];
  
  const assets = analysis.entities?.assets || [];
  const causes: string[] = [];
  
  // أسباب خاصة بالذهب والفضة
  if (assets.includes('الذهب') || assets.includes('الفضة')) {
    causes.push('**ارتفاع أسعار الفائدة عالمياً** - قرارات البنوك المركزية برفع الفائدة تجعل الاحتفاظ بالمعادن الثمينة أقل جاذبية مقارنة بالسندات والودائع.');
    causes.push('**قوة الدولار الأمريكي** - عندما يرتفع الدولار، يصبح الذهب أغلى للمشترين بالعملات الأخرى، مما يقلل الطلب.');
    if (assets.includes('الفضة')) {
      causes.push('**تباطؤ الطلب الصناعي** - الفضة تُستخدم في الصناعات الإلكترونية والطاقة الشمسية، وأي تباطؤ اقتصادي يؤثر على الطلب.');
    }
  }
  
  // أسباب خاصة بالدولار
  if (assets.includes('الدولار')) {
    causes.push('**سياسات الفيدرالي الأمريكي** - قرارات الفائدة والتيسير الكمي تؤثر مباشرة على قيمة الدولار.');
    causes.push('**الفجوة بين السعر الرسمي والموازي** - في بعض الأسواق، هذه الفجوة تخلق قلقاً وعدم يقين.');
  }
  
  // أسباب خاصة بالنفط
  if (assets.includes('النفط')) {
    causes.push('**قرارات أوبك+** - أي تغيير في حصص الإنتاج يؤثر مباشرة على الأسعار والتوقعات.');
    causes.push('**التوترات الجيوسياسية** - الأحداث في مناطق الإنتاج تخلق تقلبات في الأسعار والمشاعر.');
  }
  
  // أسباب عامة بناءً على المؤشرات
  if (causes.length === 0) {
    if (data.cfi > 60) {
      causes.push('**عدم اليقين الاقتصادي** - غياب الوضوح في الاتجاه الاقتصادي يرفع مستوى القلق الجماعي.');
    }
    if (data.hri < 45) {
      causes.push('**غياب الأخبار الإيجابية** - عدم وجود محفزات إيجابية يضعف التفاؤل العام.');
    }
    if (data.gmi < 45) {
      causes.push('**الضغوط المعيشية** - ارتفاع تكاليف الحياة يؤثر على المزاج العام والثقة في المستقبل.');
    }
  }
  
  // إضافة سبب إعلامي
  if (causes.length > 0) {
    causes.push('**تصاعد العناوين الإعلامية** - تغطية وسائل الإعلام لهذه التطورات تضخم المشاعر وتؤثر على القرارات.');
  }
  
  // تنسيق الأسباب
  if (causes.length > 0) {
    causes.slice(0, 4).forEach((cause, i) => {
      parts.push(`${i + 1}. ${cause}`);
    });
  } else {
    parts.push('المؤشرات في نطاق محايد حالياً، ولا توجد ضغوط واضحة تفسر اتجاهاً محدداً.');
  }
  
  return parts.join('\n\n');
}

/**
 * بناء التوصية - عملية ومفصلة
 */
function buildRecommendation(analysis: QuestionAnalysis, data: ResponseData): string {
  const parts: string[] = ['**التوصية النفسية:**'];
  
  if (data.cfi > 65) {
    parts.push('بناءً على الحالة النفسية الحالية للسوق، ننصح بـ:');
    parts.push('• **تأجيل القرارات الكبيرة** - الوقت الحالي ليس مناسباً للمخاطرة. انتظر حتى تهدأ المؤشرات.');
    parts.push('• **الحفاظ على السيولة** - إذا كنت مستثمراً، السيولة تمنحك مرونة للتحرك عندما تتحسن الظروف.');
    parts.push('• **مراقبة الأخبار** - تابع التطورات الاقتصادية والسياسية التي قد تغير الاتجاه.');
  } else if (data.hri > 60 && data.cfi < 50) {
    parts.push('المؤشرات تشير إلى فرصة محتملة، لكن بحذر:');
    parts.push('• **الدخول التدريجي** - لا تضع كل رأس المال دفعة واحدة. قسّم استثمارك على مراحل.');
    parts.push('• **تحديد نقاط الخروج** - حدد مسبقاً متى ستخرج إذا تغير الاتجاه.');
    parts.push('• **متابعة المؤشرات** - استمر في مراقبة التغيرات في المزاج العام.');
  } else {
    parts.push('الوضع الحالي يستدعي:');
    parts.push('• **المراقبة والانتظار** - لا تتسرع في اتخاذ قرارات. الوضع قد يتضح أكثر قريباً.');
    parts.push('• **جمع المعلومات** - استخدم هذا الوقت لفهم السوق بشكل أعمق.');
    parts.push('• **الاستعداد للفرص** - كن جاهزاً للتحرك عندما تظهر إشارات أوضح.');
  }
  
  return parts.join('\n');
}

/**
 * بناء القراءة النفسية - عميقة ومفصلة
 */
function buildInsight(analysis: QuestionAnalysis, data: ResponseData): string {
  const parts: string[] = ['**القراءة النفسية:**'];
  
  // تحليل الحالة النفسية
  if (data.cfi > 60 && data.hri > 50) {
    parts.push('السوق في حالة مقاومة نفسية مثيرة للاهتمام: هناك خوف واضح من استمرار الاتجاه السلبي، لكن في نفس الوقت يوجد أمل في ارتداد قادم. هذا المزيج يشير إلى مجتمع لا يستسلم بسهولة، ويبحث عن فرص حتى في الأوقات الصعبة.');
  } else if (data.cfi > 65) {
    parts.push('الخوف هو المسيطر حالياً. المجتمع في وضع دفاعي، يتجنب المخاطر ويفضل الأمان على الفرص. هذه الحالة قد تستمر حتى تظهر إشارات إيجابية واضحة تعيد الثقة.');
  } else if (data.hri > 60) {
    parts.push('التفاؤل موجود لكنه حذر. المجتمع يرى فرصاً محتملة، لكنه تعلم من التجارب السابقة ألا يندفع. هذا توازن صحي بين الأمل والواقعية.');
  } else {
    parts.push('المجتمع في حالة ترقب وانتظار. لا يوجد اتجاه واضح في المشاعر، والجميع ينتظر إشارات أوضح قبل اتخاذ مواقف. هذه الحالة عادة ما تسبق تحركات كبيرة في أي اتجاه.');
  }
  
  return parts.join('\n');
}

/**
 * بناء قسم البيانات الاقتصادية - فقط عند الطلب
 */
function buildEconomicSection(economicData: ResponseData['economicData']): string {
  if (!economicData) return '';
  
  const parts: string[] = ['**المؤشرات الاقتصادية الحالية:**'];
  
  if (economicData.gold) {
    const arrow = economicData.gold.change > 0 ? '↑' : '↓';
    const changeAbs = Math.abs(economicData.gold.change).toFixed(1);
    parts.push(`• الذهب: $${economicData.gold.price.toFixed(2)} ${arrow}${changeAbs}%`);
  }
  
  if (economicData.oil) {
    parts.push(`• النفط: برنت $${economicData.oil.brent.toFixed(2)} | WTI $${economicData.oil.wti.toFixed(2)}`);
  }
  
  if (economicData.currencies) {
    const currencyLines: string[] = [];
    for (const [code, data] of Object.entries(economicData.currencies)) {
      const arrow = data.change > 0 ? '↑' : data.change < 0 ? '↓' : '→';
      currencyLines.push(`${code}: ${data.rate.toFixed(2)} ${arrow}${Math.abs(data.change).toFixed(1)}%`);
    }
    if (currencyLines.length > 0) {
      parts.push(`• العملات: ${currencyLines.join(' | ')}`);
    }
  }
  
  return parts.join('\n');
}

/**
 * بناء المقارنة
 */
function buildComparison(analysis: QuestionAnalysis, data: ResponseData): string {
  const topic = analysis.cleanTopic;
  const parts: string[] = ['**المقارنة:**'];
  
  const comparisonItems = extractComparisonItems(topic);
  
  if (comparisonItems.length >= 2) {
    const [item1, item2] = comparisonItems;
    parts.push(`عند مقارنة ${item1} و${item2}:`);
    parts.push(`• ${item1}: ${data.cfi > 55 ? 'يحمل قلقاً أعلى' : 'أكثر استقراراً نفسياً'}`);
    parts.push(`• ${item2}: ${data.hri > 55 ? 'يحمل تفاؤلاً أكثر' : 'أقل تفاؤلاً'}`);
    parts.push(`\n**الخلاصة:** ${data.cfi > data.hri ? item1 + ' يحمل مخاطر نفسية أعلى حالياً' : item2 + ' يبدو أفضل من الناحية النفسية'}`);
  } else {
    parts.push(`عند تحليل ${topic}:`);
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
  const topic = analysis.cleanTopic;
  
  const parts: string[] = ['**السيناريو المتوقع:**'];
  parts.push(`في حال ${topic}:`);
  parts.push(`• **التأثير النفسي:** ${data.cfi > 50 ? 'سلبي - سيرتفع القلق بشكل ملحوظ' : 'متباين - ردود فعل مختلفة'}`);
  parts.push(`• **سلوك المستثمرين:** ${data.cfi > 60 ? 'هروب نحو الأمان والسيولة' : 'ترقب وحذر'}`);
  parts.push(`• **المدى الزمني:** التأثير النفسي عادة يستمر ${data.cfi > 65 ? 'أسابيع' : 'أيام'} قبل أن يتكيف السوق`);
  
  return parts.join('\n');
}

/**
 * بناء التوقع
 */
function buildForecast(analysis: QuestionAnalysis, data: ResponseData): string {
  const timeframe = analysis.entities?.timeframe || 'الفترة القادمة';
  
  let forecast = '';
  if (data.hri > 55 && data.cfi < 50) {
    forecast = 'تحسن تدريجي متوقع إذا استمرت المؤشرات الإيجابية. السوق قد يشهد انتعاشاً في الثقة.';
  } else if (data.cfi > 60) {
    forecast = 'استمرار الضغط مع احتمال تقلبات. الحذر سيبقى السلوك السائد حتى تظهر إشارات إيجابية.';
  } else {
    forecast = 'استقرار نسبي مع حساسية للأخبار. أي تطور إيجابي أو سلبي قد يغير الاتجاه بسرعة.';
  }
  
  return `**التوقع:** خلال ${timeframe}، ${forecast}`;
}

/**
 * بناء السؤال الختامي - ذكي ومحدد
 */
function buildClosingQuestion(analysis: QuestionAnalysis, data: ResponseData): string {
  const assets = analysis.entities?.assets || [];
  
  // أسئلة ذكية بناءً على السياق
  if (analysis.intent === 'explanation') {
    if (assets.length >= 2) {
      return `هل نحلل ${assets[0]} و${assets[1]} بشكل منفصل لفهم الفروقات؟`;
    }
    if (assets.includes('الذهب') || assets.includes('الفضة')) {
      return 'هل نحلل ماذا يحدث نفسياً لو خفّض الفيدرالي أسعار الفائدة؟';
    }
    return 'هل نتعمق في أحد هذه الأسباب بشكل أكبر؟';
  }
  
  if (analysis.intent === 'decision') {
    if (assets.length > 0) {
      return `هل نحلل السيناريو البديل: ماذا لو تغير اتجاه ${assets[0]}؟`;
    }
    return 'هل نحلل سيناريو معين يساعدك في القرار؟';
  }
  
  if (analysis.intent === 'economic') {
    if (assets.length > 0) {
      return `هل نحلل العلاقة بين ${assets[0]} والمزاج العام بشكل أعمق؟`;
    }
    return 'هل نركز على قطاع اقتصادي محدد؟';
  }
  
  if (analysis.intent === 'scenario') {
    return 'هل نحلل السيناريو المعاكس لفهم الصورة الكاملة؟';
  }
  
  if (analysis.intent === 'comparison') {
    return 'هل نضيف عنصر ثالث للمقارنة؟';
  }
  
  return 'هل لديك سؤال محدد أكثر يمكنني مساعدتك فيه؟';
}

/**
 * الدالة الرئيسية - Thinking Engine
 */
export function think(question: string, data: ResponseData): string {
  // 1. تحليل السؤال
  const analysis = analyzeQuestionIntent(question);
  
  // 2. تحديد هيكل الرد
  const structure = composeResponseStructure(analysis);
  
  // 3. تحديث البيانات
  data.topic = analysis.cleanTopic;
  data.country = analysis.country;
  
  // 4. بناء الرد
  const response = buildDynamicResponse(analysis, structure, data);
  
  return response;
}

export { analyzeQuestionIntent as analyzeIntent };
