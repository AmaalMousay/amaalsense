/**
 * Thinking Engine - AmalSense Brain
 * 
 * يحول AmalSense من "قالب يُملأ" إلى "عقل يفكر"
 * الرد يتشكل حسب نوع السؤال، ليس قالب ثابت
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
  type: 'summary' | 'judgment' | 'signal' | 'causes' | 'economic' | 'forecast' | 'insight' | 'comparison' | 'scenario' | 'question';
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
      /السبب الرئيسي/
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
      /قطاع اقتصادي/
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

  // استخراج الموضوع
  const topic = extractTopic(question);
  
  // استخراج الدولة
  const country = extractCountry(question);

  // تحديد ما يحتاجه الرد
  const requiresEconomicData = ['economic', 'decision'].includes(intent) && 
    /سعر|تداول|استثمار|شراء|بيع|ذهب|فضة|دولار|نفط|عقار/.test(q);
  
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
    confidence
  };
}

/**
 * استخراج الموضوع من السؤال
 */
function extractTopic(question: string): string {
  let topic = question;
  
  // إزالة كلمات الاستفهام من البداية
  topic = topic
    .replace(/^(هل|ما هو|ما هي|ما|كيف|لماذا|أيهما|ماذا لو|ماذا)\s*/i, '')
    .replace(/\?|؟/g, '')
    .trim();
  
  // إزالة "لو" و "إذا" من البداية ومن أي مكان
  topic = topic.replace(/^(لو|إذا|اذا|ذا)\s*/i, '').trim();
  topic = topic.replace(/\s+لو\s+/g, ' ').trim();  // إزالة "لو" من الوسط
  topic = topic.replace(/لو\s+/g, '').trim();  // إزالة "لو" من أي مكان
  
  // إزالة الكلمات الزائدة من البداية
  topic = topic
    .replace(/^(الوقت مناسب لل|الوقت مناسب ل|الوقت صح لل|الوقت صح ل|توا وقت)\s*/i, '')
    .replace(/^(يؤثر|تؤثر|سيؤثر|ستؤثر)\s*/i, '')
    .trim();
  
  // إضافة "ال" للكلمات التي تحتاجها
  if (topic.match(/^(استثمار|اقتصاد|تعليم|صحة|سياسة)\s/i)) {
    topic = 'ال' + topic;
  }
  
  // استخراج الموضوع الرئيسي من الجملة
  // مثال: "سعر الدولار إلى 7 دينار" -> "ارتفاع سعر الدولار"
  if (topic.includes('ارتفع') || topic.includes('يرتفع')) {
    topic = 'ارتفاع ' + topic.replace(/(ارتفع|يرتفع)\s*/gi, '');
  }
  if (topic.includes('انخفض') || topic.includes('ينخفض')) {
    topic = 'انخفاض ' + topic.replace(/(انخفض|ينخفض)\s*/gi, '');
  }
  
  // تنظيف الموضوع
  topic = topic
    .replace(/\s+/g, ' ')  // إزالة المسافات الزائدة
    .replace(/^(في|عن|على|من)\s+/i, '')  // إزالة حروف الجر من البداية
    .replace(/\s+(إلى|\u0627لى)\s+\d+.*$/i, '')  // إزالة "إلى 7 دينار" من النهاية
    .trim();
  
  // تقصير الموضوع إذا كان طويلاً
  if (topic.length > 60) {
    // أخذ أول جملة أو أول 60 حرف
    const firstPart = topic.split(/[،,]/)[0];
    topic = firstPart.length > 60 ? firstPart.substring(0, 60) + '...' : firstPart;
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
  
  // الخلاصة دائماً مطلوبة
  sections.push({ type: 'summary', required: true, maxWords: 40 });

  // إشارة القرار لمعظم الأسئلة (ماعدا العامة والأكاديمية)
  if (!['general', 'academic'].includes(analysis.intent)) {
    sections.push({ type: 'signal', required: true });
  }
  
  // الحكم للأسئلة القرارية فقط
  if (analysis.intent === 'decision') {
    sections.push({ type: 'judgment', required: true });
  }

  // الأسباب لمعظم الأسئلة (ماعدا العامة)
  if (!['general'].includes(analysis.intent)) {
    sections.push({ type: 'causes', required: true });
  }

  // البيانات الاقتصادية فقط للأسئلة الاقتصادية
  if (analysis.requiresEconomicData) {
    sections.push({ type: 'economic', required: true });
  }

  // المقارنة للأسئلة المقارنة
  if (analysis.requiresComparison) {
    sections.push({ type: 'comparison', required: true });
  }

  // السيناريو للأسئلة الافتراضية
  if (analysis.requiresScenario) {
    sections.push({ type: 'scenario', required: true });
  }

  // التوقع للأسئلة المستقبلية
  if (analysis.requiresForecast) {
    sections.push({ type: 'forecast', required: true });
  }

  // القراءة النفسية للأسئلة النفسية والعامة والصحفية
  if (['psychological', 'general', 'journalistic', 'academic'].includes(analysis.intent)) {
    sections.push({ type: 'insight', required: true });
  }

  // السؤال الختامي دائماً
  sections.push({ type: 'question', required: true });

  // تحديد النبرة
  let tone: DynamicResponseStructure['tone'] = 'analytical';
  if (analysis.intent === 'decision') tone = 'advisory';
  if (analysis.intent === 'journalistic') tone = 'journalistic';
  if (analysis.intent === 'academic') tone = 'academic';

  // تحديد الطول
  let maxLength = 250;
  if (analysis.requiresComparison) maxLength = 350;
  if (analysis.requiresScenario) maxLength = 300;
  if (analysis.intent === 'academic') maxLength = 400;

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
      case 'summary':
        parts.push(buildSummary(analysis, data));
        break;
      case 'judgment':
        parts.push(buildJudgment(analysis, data));
        break;
      case 'signal':
        parts.push(buildSignal(data));
        break;
      case 'causes':
        parts.push(buildCauses(analysis, data));
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
        parts.push(buildClosingQuestion(analysis));
        break;
    }
  }

  return parts.filter(p => p.length > 0).join('\n\n');
}

// دوال بناء الأقسام

function buildSummary(analysis: QuestionAnalysis, data: ResponseData): string {
  const topic = analysis.topic;
  const moodDescription = getMoodDescription(data.gmi, data.cfi, data.hri);
  
  // بناء خلاصة مخصصة حسب نوع السؤال
  if (analysis.intent === 'decision') {
    const recommendation = data.cfi > 60 ? 'الحذر مطلوب' : data.hri > 60 ? 'فرصة محتملة' : 'المراقبة أفضل';
    return `**الخلاصة:** ${topic} - ${recommendation}. ${moodDescription}`;
  }
  
  if (analysis.intent === 'scenario') {
    return `**الخلاصة:** في حال ${topic}، المزاج الجماعي سيتأثر بشكل ${data.cfi > 50 ? 'سلبي' : 'متباين'}. ${moodDescription}`;
  }
  
  if (analysis.intent === 'comparison') {
    return `**الخلاصة:** عند مقارنة ${topic}، الوضع النفسي ${moodDescription}`;
  }
  
  if (analysis.intent === 'psychological') {
    const psychState = data.cfi > 60 ? 'حالة توتر وقلق' : data.hri > 55 ? 'حالة ترقب مع أمل' : 'حالة محايدة مع حذر';
    return `**الخلاصة:** ${topic} - المجتمع في ${psychState}`;
  }
  
  if (analysis.intent === 'academic') {
    return `**الخلاصة:** ${topic} - إطار علمي لقياس المشاعر الجماعية`;
  }
  
  if (analysis.intent === 'journalistic') {
    const headline = data.cfi > 60 ? 'القلق يسيطر' : data.hri > 55 ? 'الأمل يتصاعد' : 'ترقب وانتظار';
    return `**الخلاصة:** ${topic} - العنوان: "${headline}" - ${moodDescription}`;
  }
  
  return `**الخلاصة:** ${topic} - ${moodDescription}`;
}

function buildJudgment(analysis: QuestionAnalysis, data: ResponseData): string {
  if (analysis.intent !== 'decision') return '';
  
  let judgment = '';
  if (data.cfi > 65) {
    judgment = 'الوضع يميل للخطر - الحذر مطلوب';
  } else if (data.hri > 60 && data.cfi < 50) {
    judgment = 'فرصة محتملة - لكن بحذر';
  } else {
    judgment = 'الوضع محايد - المراقبة أفضل من التسرع';
  }
  
  return `**الحكم:** ${judgment}`;
}

function buildSignal(data: ResponseData): string {
  let signal = '👁️ مراقبة';
  let description = 'الوضع يستدعي المتابعة';
  
  if (data.cfi > 70) {
    signal = '🚨 خطر';
    description = 'مستوى القلق مرتفع جداً';
  } else if (data.cfi > 55) {
    signal = '⚠️ حذر';
    description = 'توتر ملحوظ يستدعي الانتباه';
  } else if (data.hri > 65 && data.cfi < 45) {
    signal = '✅ إيجابية';
    description = 'المؤشرات تميل للتفاؤل';
  } else if (data.hri > 55) {
    signal = '📈 فرصة محتملة';
    description = 'الأمل موجود مع حذر';
  }
  
  return `**إشارة القرار:** ${signal} - ${description}`;
}

function buildCauses(analysis: QuestionAnalysis, data: ResponseData): string {
  const causes = data.causes || {};
  
  // عنوان مخصص حسب نوع السؤال
  let title = '**لماذا هذا الوضع؟**';
  if (analysis.intent === 'psychological') {
    title = '**العوامل النفسية:**';
  } else if (analysis.intent === 'academic') {
    title = '**المنهجية العلمية:**';
  } else if (analysis.intent === 'journalistic') {
    title = '**الأرقام الرئيسية:**';
  }
  
  const parts: string[] = [title];
  
  // إذا لم تكن هناك أسباب محددة، نولد أسباب بناءً على المؤشرات
  const hasCauses = Object.values(causes).some(arr => arr && arr.length > 0);
  
  if (!hasCauses) {
    // توليد أسباب بناءً على نوع السؤال
    const generatedCauses: string[] = [];
    
    if (analysis.intent === 'psychological') {
      // أسباب نفسية مخصصة
      generatedCauses.push(`• مؤشر الخوف الجماعي (CFI): ${data.cfi}% - ${data.cfi > 60 ? 'مرتفع' : data.cfi > 45 ? 'معتدل' : 'منخفض'}`);
      generatedCauses.push(`• مؤشر الأمل (HRI): ${data.hri}% - ${data.hri > 55 ? 'إيجابي' : data.hri > 40 ? 'محايد' : 'منخفض'}`);
      generatedCauses.push(`• المزاج العام (GMI): ${data.gmi}% - ${data.gmi > 50 ? 'يميل للإيجابية' : 'يميل للسلبية'}`);
      if (data.dominantEmotion) {
        generatedCauses.push(`• الشعور السائد: ${data.dominantEmotion}`);
      }
    } else if (analysis.intent === 'academic') {
      // معلومات أكاديمية
      generatedCauses.push('• النظرية: Digital Collective Field Theory (DCFT)');
      generatedCauses.push('• المصادر: أخبار + وسائل تواصل + بيانات اقتصادية');
      generatedCauses.push('• الخوارزمية: Transformers + VADER + تحليل عربي');
      generatedCauses.push(`• الدقة التقديرية: 75-85% للاتجاهات العامة`);
    } else if (analysis.intent === 'journalistic') {
      // أرقام صحفية
      generatedCauses.push(`• مؤشر المزاج العام: ${data.gmi}%`);
      generatedCauses.push(`• مؤشر الخوف: ${data.cfi}%`);
      generatedCauses.push(`• مؤشر الأمل: ${data.hri}%`);
      generatedCauses.push(`• الشعور السائد: ${data.dominantEmotion || 'الترقب'}`);
    } else {
      // أسباب عامة
      if (data.cfi > 60) {
        generatedCauses.push('• ارتفاع مستوى القلق الجماعي (مؤشر الخوف ' + data.cfi + '%)');
      }
      if (data.hri < 45) {
        generatedCauses.push('• تراجع مستوى التفاؤل (مؤشر الأمل ' + data.hri + '%)');
      }
      if (data.gmi < 40) {
        generatedCauses.push('• المزاج العام يميل للسلبية (مؤشر المزاج ' + data.gmi + '%)');
      }
      if (data.dominantEmotion && data.dominantEmotion !== 'neutral') {
        generatedCauses.push(`• الشعور السائد: ${data.dominantEmotion}`);
      }
    }
    
    if (generatedCauses.length > 0) {
      parts.push(generatedCauses.join('\n'));
    } else {
      parts.push('• المؤشرات في نطاق محايد - لا توجد عوامل ضغط واضحة');
    }
    return parts.join('\n');
  }
  
  // أسباب من سياق السؤال
  if (causes.contextual && causes.contextual.length > 0) {
    causes.contextual.forEach(c => parts.push(`• ${c}`));
  }
  
  if (causes.economic && causes.economic.length > 0) {
    parts.push(`**عوامل اقتصادية:**`);
    causes.economic.forEach(c => parts.push(`• ${c}`));
  }
  
  if (causes.media && causes.media.length > 0) {
    parts.push(`**عوامل إعلامية:**`);
    causes.media.forEach(c => parts.push(`• ${c}`));
  }
  
  if (causes.political && causes.political.length > 0) {
    parts.push(`**عوامل سياسية:**`);
    causes.political.forEach(c => parts.push(`• ${c}`));
  }
  
  return parts.join('\n');
}

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

function buildComparison(analysis: QuestionAnalysis, data: ResponseData): string {
  const topic = analysis.topic;
  const parts: string[] = ['**المقارنة:**'];
  
  // استخراج عناصر المقارنة من الموضوع
  const comparisonItems = extractComparisonItems(topic);
  
  if (comparisonItems.length >= 2) {
    const [item1, item2] = comparisonItems;
    
    // توليد مقارنة بناءً على المؤشرات
    const score1 = data.cfi > 55 ? 'أعلى قلقاً' : 'أكثر استقراراً';
    const score2 = data.hri > 55 ? 'أكثر تفاؤلاً' : 'أقل تفاؤلاً';
    
    parts.push(`| العنصر | الحالة النفسية | التوصية |`);
    parts.push(`|--------|-----------------|---------|`);
    parts.push(`| ${item1} | ${score1} | ${data.cfi > 55 ? 'حذر' : 'مراقبة'} |`);
    parts.push(`| ${item2} | ${score2} | ${data.hri > 55 ? 'فرصة' : 'انتظار'} |`);
    parts.push(``);
    parts.push(`**الخلاصة:** ${data.cfi > data.hri ? item1 + ' يحمل مخاطر أعلى' : item2 + ' يبدو أفضل نسبياً'}`);
  } else {
    // مقارنة عامة
    parts.push(`عند مقارنة ${topic}:`);
    parts.push(`• مستوى القلق: ${data.cfi > 55 ? 'مرتفع' : 'معتدل'} (${data.cfi}%)`);
    parts.push(`• مستوى الأمل: ${data.hri > 55 ? 'إيجابي' : 'محايد'} (${data.hri}%)`);
    parts.push(`• المزاج العام: ${data.gmi > 50 ? 'يميل للإيجابية' : 'يميل للسلبية'} (${data.gmi}%)`);
  }
  
  return parts.join('\n');
}

// دالة مساعدة لاستخراج عناصر المقارنة
function extractComparisonItems(topic: string): string[] {
  // البحث عن "أم" أو "و" للفصل
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

function buildScenario(analysis: QuestionAnalysis, data: ResponseData): string {
  const topic = analysis.topic;
  const impact = data.cfi > 50 ? 'سلبي' : 'متباين';
  
  return `**السيناريو المتوقع:**\nفي حال ${topic}:\n• التأثير النفسي: ${impact}\n• مستوى الخوف: ${data.cfi > 60 ? 'سيرتفع' : 'سيبقى مستقراً'}\n• مستوى الأمل: ${data.hri > 50 ? 'قد يتراجع مؤقتاً' : 'سيتأثر سلباً'}`;
}

function buildForecast(analysis: QuestionAnalysis, data: ResponseData): string {
  const trend = data.trend || 'مستقر';
  const timeframe = analysis.requiresScenario ? 'الفترة القادمة' : 'الأسبوع القادم';
  
  return `**التوقع الزمني:** خلال ${timeframe}: ${trend === 'up' ? 'تحسن تدريجي متوقع' : trend === 'down' ? 'استمرار الضغط' : 'استقرار نسبي مع حساسية للأخبار'}`;
}

function buildInsight(data: ResponseData): string {
  const emotion = data.dominantEmotion || 'الترقب';
  const insight = getInsightByEmotion(emotion, data.cfi, data.hri);
  
  // إضافة تفاصيل أكثر للقراءة النفسية
  const parts: string[] = [`**القراءة النفسية:**`];
  parts.push(insight);
  
  // إضافة ملاحظة إضافية بناءً على المؤشرات
  if (data.cfi > 60 && data.hri > 50) {
    parts.push(`الملفت: وجود خوف وأمل معاً يشير إلى مجتمع يقاوم ولا يستسلم.`);
  } else if (data.cfi > 65) {
    parts.push(`الملفت: القلق المرتفع قد يؤثر على القرارات اليومية والثقة في المستقبل.`);
  } else if (data.hri > 60) {
    parts.push(`الملفت: التفاؤل الموجود قد يكون مؤشراً على استعداد للتغيير الإيجابي.`);
  }
  
  return parts.join(' ');
}

function buildClosingQuestion(analysis: QuestionAnalysis): string {
  const questions: Record<QuestionIntent, string[]> = {
    decision: [
      'هل تريد تحليل سيناريو معين؟',
      'هل نركز على جانب محدد من القرار؟'
    ],
    scenario: [
      'هل تريد مقارنة مع سيناريو آخر؟',
      'هل نحلل التأثير على قطاع معين؟'
    ],
    comparison: [
      'هل تريد تفاصيل أكثر عن أحد الطرفين؟',
      'هل نضيف عنصر ثالث للمقارنة؟'
    ],
    explanation: [
      'هل تريد التعمق في سبب معين؟',
      'هل نربط هذا بأحداث أخرى؟'
    ],
    forecast: [
      'هل تريد توقع لفترة أطول؟',
      'هل نحلل سيناريو محدد؟'
    ],
    economic: [
      'هل تريد تحليل قطاع اقتصادي معين؟',
      'هل نقارن مع فترة سابقة؟'
    ],
    political: [
      'هل تريد ربط السياسة بالاقتصاد؟',
      'هل نحلل تأثير حدث سياسي معين؟'
    ],
    psychological: [
      'هل تريد فهم أعمق للحالة النفسية؟',
      'هل نقارن مع فترة سابقة؟'
    ],
    journalistic: [
      'هل تريد زاوية صحفية مختلفة؟',
      'هل نركز على قصة معينة؟'
    ],
    academic: [
      'هل تريد بيانات إحصائية أكثر؟',
      'هل نربط بدراسات مشابهة؟'
    ],
    general: [
      'هل تريد التعمق في جانب معين؟',
      'هل لديك سؤال متابعة؟'
    ]
  };
  
  const intentQuestions = questions[analysis.intent] || questions.general;
  const randomQuestion = intentQuestions[Math.floor(Math.random() * intentQuestions.length)];
  
  return randomQuestion;
}

// دوال مساعدة

function getMoodDescription(gmi: number, cfi: number, hri: number): string {
  if (cfi > 65) {
    return 'المزاج العام متوتر مع قلق واضح';
  } else if (hri > 60 && cfi < 50) {
    return 'المزاج العام إيجابي مع تفاؤل حذر';
  } else if (gmi > 55) {
    return 'المزاج العام محايد يميل للإيجابية';
  } else if (gmi < 45) {
    return 'المزاج العام محايد يميل للسلبية';
  } else {
    return 'المزاج العام في حالة ترقب وانتظار';
  }
}

function getInsightByEmotion(emotion: string, cfi: number, hri: number): string {
  const insights: Record<string, string> = {
    'الخوف': 'المجتمع في حالة دفاعية، يتجنب المخاطر ويترقب الأسوأ',
    'الأمل': 'رغم التحديات، هناك إيمان بإمكانية التحسن',
    'الفضول': 'المجتمع يراقب ويحلل، ينتظر إشارات واضحة قبل التحرك',
    'الغضب': 'هناك إحباط متراكم قد يتحول لفعل إذا استمر الضغط',
    'الحزن': 'المجتمع في حالة استيعاب لخسائر أو تغييرات صعبة',
    'الترقب': 'حالة انتظار مشحونة، المجتمع جاهز للتفاعل مع أي تطور'
  };
  
  return insights[emotion] || 'المجتمع في حالة معقدة تجمع بين مشاعر متعددة';
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
