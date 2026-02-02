/**
 * Conversational Framing Layer
 * تحويل AmalSense من "نظام يشرح" إلى "عقل يحكم ثم يشرح"
 * 
 * القالب الذهبي:
 * [ افتتاحية بشرية ] → [ خلاصة ] → [ تفسير ] → [ توقع ] → [ إشارة قرار ] → [ سؤال إنساني ختامي ]
 */

export type ToneType = 'calm_advisor' | 'analytical' | 'news_style';

export interface FramedResponse {
  intro: string;
  summary: string;
  explanation: string;
  prediction: string;
  decision: string;
  closingQuestion: string;
  fullResponse: string;
}

export interface AnalysisData {
  topic: string;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  emotionVector?: Record<string, number>;
  confidence: number;
  detectedCountry?: string;
}

// قوالب الافتتاحية حسب النبرة
const introTemplates: Record<ToneType, string[]> = {
  calm_advisor: [
    "الصورة العامة حالياً تشير إلى {mood_description}.",
    "بناءً على تحليل المشاعر الجماعية، الوضع الحالي يعكس {mood_description}.",
    "التحليل العاطفي الجماعي يكشف عن {mood_description}.",
  ],
  analytical: [
    "البيانات العاطفية تعكس {mood_description}.",
    "المؤشرات الحالية تُظهر {mood_description}.",
    "التحليل الكمي للمشاعر يشير إلى {mood_description}.",
  ],
  news_style: [
    "المزاج الجماعي تجاه {topic} اليوم يميل إلى {mood_description}.",
    "الحالة العاطفية السائدة حول {topic} تتسم بـ {mood_description}.",
    "رصد المشاعر الجماعية يكشف {mood_description} تجاه {topic}.",
  ],
};

// قوالب الأسئلة الختامية
const closingQuestions: string[] = [
  "هل تريد أن أحاكي لك سيناريو ماذا يحدث لو تغيرت الظروف؟",
  "هل يهمك معرفة كيف يمكن أن يتغير هذا التقييم خلال الأيام القادمة؟",
  "أستطيع تحليل سيناريوهات مختلفة لو تحب.",
  "هل تريد معرفة المزيد عن العوامل المؤثرة في هذا التقييم؟",
  "هل تحب أن أقارن هذا الوضع مع فترات سابقة؟",
];

// قوالب إشارات القرار
const decisionTemplates = {
  positive_strong: [
    "إشارة القرار: الوضع إيجابي ومناسب للتحرك بثقة.",
    "التوصية: الظروف مواتية للمضي قدماً.",
  ],
  positive_moderate: [
    "إشارة القرار: الوضع إيجابي مع الحذر المعقول.",
    "التوصية: يمكن التحرك مع المتابعة المستمرة.",
  ],
  neutral_watch: [
    "إشارة القرار: المراقبة والانتظار هو الخيار الأمثل حالياً.",
    "التوصية: الترقب مع الاستعداد للتحرك عند وضوح الاتجاه.",
  ],
  negative_caution: [
    "إشارة القرار: الحذر مطلوب، تجنب القرارات المتسرعة.",
    "التوصية: الانتظار حتى تتحسن المؤشرات.",
  ],
  negative_strong: [
    "إشارة القرار: الوضع يستدعي الحذر الشديد.",
    "التوصية: تأجيل أي قرارات كبيرة حتى تستقر الأوضاع.",
  ],
};

// وصف المزاج بناءً على المؤشرات
function getMoodDescription(gmi: number, cfi: number, hri: number): string {
  if (gmi > 50 && cfi < 30) {
    return "تفاؤل جماعي قوي وثقة عالية";
  } else if (gmi > 30 && cfi < 50) {
    return "إيجابية معتدلة مع بعض الحذر";
  } else if (gmi > 0 && gmi <= 30) {
    return "حالة إيجابية طفيفة مع ترقب";
  } else if (gmi === 0 || (gmi > -10 && gmi < 10)) {
    if (cfi > 60 && hri > 60) {
      return "حالة ترقب حذر - انقسام بين الخوف والأمل";
    } else if (cfi > 60) {
      return "حياد مشوب بالقلق";
    } else if (hri > 60) {
      return "حياد مع تفاؤل حذر";
    }
    return "حالة محايدة وترقب";
  } else if (gmi < 0 && gmi >= -30) {
    return "سلبية طفيفة مع قلق متزايد";
  } else if (gmi < -30 && gmi >= -50) {
    return "قلق جماعي ملحوظ";
  } else {
    return "حالة سلبية قوية وخوف جماعي";
  }
}

// تحديد نوع القرار
function getDecisionType(gmi: number, cfi: number, hri: number): keyof typeof decisionTemplates {
  if (gmi > 50 && cfi < 30 && hri > 60) {
    return 'positive_strong';
  } else if (gmi > 20 && cfi < 50) {
    return 'positive_moderate';
  } else if (gmi >= -20 && gmi <= 20) {
    return 'neutral_watch';
  } else if (gmi < -20 && gmi >= -50) {
    return 'negative_caution';
  } else {
    return 'negative_strong';
  }
}

// توليد التوقع الزمني
function generatePrediction(gmi: number, cfi: number, hri: number, dominantEmotion: string): string {
  const timeframes = {
    short: "خلال 24-48 ساعة القادمة",
    medium: "خلال الأسبوع القادم",
  };
  
  let prediction = "";
  
  if (cfi > 60 && hri > 60) {
    prediction = `${timeframes.short} من المتوقع استمرار حالة الترقب والانقسام، مع احتمال تحسن طفيف إذا لم تظهر أخبار سلبية.`;
  } else if (gmi > 30) {
    prediction = `${timeframes.short} من المرجح استمرار الاتجاه الإيجابي مع احتمال تعزيز الثقة.`;
  } else if (gmi < -30) {
    prediction = `${timeframes.short} قد يستمر الضغط السلبي، مع مراقبة أي محفزات للتعافي.`;
  } else {
    prediction = `${timeframes.short} من المتوقع استقرار نسبي مع تأثر بأي أخبار جديدة.`;
  }
  
  return prediction;
}

// توليد التفسير
function generateExplanation(data: AnalysisData): string {
  const { gmi, cfi, hri, dominantEmotion } = data;
  
  let explanation = "";
  
  // تفسير CFI
  if (cfi > 70) {
    explanation += `مستوى الخوف مرتفع جداً (CFI ${cfi}) → قلق جماعي واضح. `;
  } else if (cfi > 50) {
    explanation += `مستوى الخوف مرتفع (CFI ${cfi}) → حذر ملحوظ. `;
  } else if (cfi > 30) {
    explanation += `مستوى الخوف معتدل (CFI ${cfi}) → يقظة طبيعية. `;
  } else {
    explanation += `مستوى الخوف منخفض (CFI ${cfi}) → هدوء نسبي. `;
  }
  
  // تفسير HRI
  if (hri > 70) {
    explanation += `مستوى الأمل قوي جداً (HRI ${hri}) → تفاؤل بالتعافي. `;
  } else if (hri > 50) {
    explanation += `مستوى الأمل جيد (HRI ${hri}) → توقعات إيجابية. `;
  } else if (hri > 30) {
    explanation += `مستوى الأمل معتدل (HRI ${hri}) → حذر متفائل. `;
  } else {
    explanation += `مستوى الأمل منخفض (HRI ${hri}) → تشاؤم سائد. `;
  }
  
  // تفسير GMI
  if (gmi === 0 || (gmi > -10 && gmi < 10)) {
    explanation += `المزاج العام محايد (GMI ${gmi}) → لا يوجد إجماع جماعي واضح.`;
  } else if (gmi > 0) {
    explanation += `المزاج العام إيجابي (GMI ${gmi > 0 ? '+' : ''}${gmi}) → ميل نحو التفاؤل.`;
  } else {
    explanation += `المزاج العام سلبي (GMI ${gmi}) → ميل نحو القلق.`;
  }
  
  return explanation;
}

// الدالة الرئيسية لتأطير الرد
export function frameResponse(
  data: AnalysisData,
  tone: ToneType = 'calm_advisor'
): FramedResponse {
  const { topic, gmi, cfi, hri, dominantEmotion } = data;
  
  // اختيار قالب الافتتاحية
  const introTemplate = introTemplates[tone][Math.floor(Math.random() * introTemplates[tone].length)];
  const moodDescription = getMoodDescription(gmi, cfi, hri);
  const intro = introTemplate
    .replace('{mood_description}', moodDescription)
    .replace('{topic}', topic);
  
  // توليد الخلاصة
  const summary = generateExecutiveSummary(data);
  
  // توليد التفسير
  const explanation = generateExplanation(data);
  
  // توليد التوقع
  const prediction = generatePrediction(gmi, cfi, hri, dominantEmotion);
  
  // اختيار إشارة القرار
  const decisionType = getDecisionType(gmi, cfi, hri);
  const decision = decisionTemplates[decisionType][Math.floor(Math.random() * decisionTemplates[decisionType].length)];
  
  // اختيار السؤال الختامي
  const closingQuestion = closingQuestions[Math.floor(Math.random() * closingQuestions.length)];
  
  // تجميع الرد الكامل
  const fullResponse = `${intro}

**الخلاصة:** ${summary}

**لماذا؟**
${explanation}

**التوقع الزمني:**
${prediction}

**${decision}**

---
${closingQuestion}`;
  
  return {
    intro,
    summary,
    explanation,
    prediction,
    decision,
    closingQuestion,
    fullResponse,
  };
}

// توليد الملخص التنفيذي
function generateExecutiveSummary(data: AnalysisData): string {
  const { topic, gmi, cfi, hri } = data;
  
  if (cfi > 60 && hri > 60 && Math.abs(gmi) < 20) {
    return `${topic} يُنظر إليه عاطفياً كحالة ترقب حذر، وليس كفرصة واضحة ولا كخطر مباشر. الموقف الجماعي يميل إلى المراقبة.`;
  } else if (gmi > 40) {
    return `${topic} يحظى بنظرة إيجابية قوية من الجمهور، مع ثقة عالية وتوقعات متفائلة.`;
  } else if (gmi > 20) {
    return `${topic} يُنظر إليه بإيجابية معتدلة، مع بعض الحذر الطبيعي.`;
  } else if (gmi < -40) {
    return `${topic} يواجه موجة قلق جماعي قوية، مع مخاوف واضحة وتشاؤم سائد.`;
  } else if (gmi < -20) {
    return `${topic} يُنظر إليه بسلبية، مع قلق متزايد وحذر من التطورات.`;
  } else {
    return `${topic} في حالة ترقب جماعي، بدون اتجاه واضح - الجمهور ينتظر إشارات أوضح.`;
  }
}

// دالة لتحويل الرد الخام من LLM إلى رد مؤطر - Decision Compression Layer
export function enhanceAIResponse(
  rawResponse: string,
  data: AnalysisData,
  tone: ToneType = 'calm_advisor'
): string {
  const framed = frameResponse(data, tone);
  
  let enhancedResponse = rawResponse;
  
  // إزالة جميع الافتتاحيات الروبوتية (موسعة)
  const roboticIntros = [
    /^بصفتي AmalSense AI[,،]?\s*/gi,
    /^As AmalSense AI[,،]?\s*/gi,
    /^I am AmalSense[,،]?\s*/gi,
    /^أنا AmalSense[,،]?\s*/gi,
    /^بصفتي [\w\s]+[,،]?\s*/gi,
    /^As an? [\w\s]+ AI[,،]?\s*/gi,
    /^أنا نظام[,،]?\s*/gi,
    /^أنا مساعد[,،]?\s*/gi,
    /^I'm [\w\s]+[,،]?\s*/gi,
    /^بناءً على تحليلي[,،]?\s*/gi,
    /^Based on my analysis[,،]?\s*/gi,
  ];
  
  for (const pattern of roboticIntros) {
    enhancedResponse = enhancedResponse.replace(pattern, '');
  }
  
  // إزالة النهايات التقنية
  const roboticEndings = [
    /Ask about predictions.*$/gi,
    /Ask about scenarios.*$/gi,
    /Feel free to ask.*$/gi,
    /Let me know if.*$/gi,
    /لا تتردد في السؤال.*$/gi,
  ];
  
  for (const pattern of roboticEndings) {
    enhancedResponse = enhancedResponse.replace(pattern, '');
  }
  
  // التأكد من بداية إنسانية - إضافة الخلاصة إذا لزم
  const goodStarts = ['الصورة', 'البيانات', 'المزاج', 'التحليل', 'الخلاصة', 'الوضع', 'الحالة', 'المؤشرات', 'التوقع', 'الترقب', 'The', 'Current', 'Based'];
  const hasGoodStart = goodStarts.some(start => enhancedResponse.trim().startsWith(start));
  
  if (!hasGoodStart) {
    // إضافة الخلاصة في البداية
    enhancedResponse = `${framed.summary}\n\n${enhancedResponse}`;
  }
  
  // التأكد من وجود سؤال ختامي إنساني
  const hasHumanQuestion = enhancedResponse.includes('هل تريد') || 
                          enhancedResponse.includes('هل تحب') ||
                          enhancedResponse.includes('هل يهمك') ||
                          enhancedResponse.includes('Would you like');
  
  if (!hasHumanQuestion) {
    enhancedResponse = `${enhancedResponse.trim()}\n\n---\n${framed.closingQuestion}`;
  }
  
  return enhancedResponse.trim();
}

// قوالب الأسئلة السريعة
export const quickQuestionTemplates = {
  predictions: "ما هي التوقعات للأيام القادمة؟",
  risks: "ما هي المخاطر المحتملة؟",
  opportunities: "هل هناك فرص يجب الانتباه لها؟",
  recommendation: "ما هي توصيتك؟",
  comparison: "كيف يقارن هذا بالأمس؟",
  whatIf: "ماذا لو تغيرت الظروف؟",
};

// سيناريوهات What-If
export const whatIfScenarios = {
  positive_news: "ماذا لو ظهرت أخبار إيجابية؟",
  negative_news: "ماذا لو ظهرت أخبار سلبية؟",
  time_week: "كيف سيكون الوضع بعد أسبوع؟",
  market_change: "ماذا لو تغير اتجاه السوق؟",
};

// توليد التوقعات الزمنية المفصلة
export function generateTimeBasedPredictions(data: AnalysisData): {
  hours24: string;
  hours48: string;
  week: string;
  trend: 'improving' | 'stable' | 'declining';
} {
  const { gmi, cfi, hri } = data;
  
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  
  // تحديد الاتجاه
  if (hri > 60 && cfi < 50) {
    trend = 'improving';
  } else if (cfi > 70 || gmi < -30) {
    trend = 'declining';
  }
  
  // توقع 24 ساعة
  let hours24 = '';
  if (trend === 'improving') {
    hours24 = `خلال 24 ساعة: من المتوقع تحسن طفيف في المزاج العام (GMI قد يرتفع إلى ${Math.min(100, gmi + 10).toFixed(0)})`;
  } else if (trend === 'declining') {
    hours24 = `خلال 24 ساعة: قد يستمر الضغط السلبي (CFI قد يصل إلى ${Math.min(100, cfi + 10).toFixed(0)}%)`;
  } else {
    hours24 = `خلال 24 ساعة: من المتوقع استقرار نسبي مع تأثر بأي أخبار جديدة`;
  }
  
  // توقع 48 ساعة
  let hours48 = '';
  if (trend === 'improving') {
    hours48 = `خلال 48 ساعة: إذا استمر الاتجاه الإيجابي، قد نرى GMI عند ${Math.min(100, gmi + 20).toFixed(0)} وانخفاض CFI إلى ${Math.max(0, cfi - 15).toFixed(0)}%`;
  } else if (trend === 'declining') {
    hours48 = `خلال 48 ساعة: بدون محفزات إيجابية، قد يستمر الضغط مع احتمال وصول GMI إلى ${Math.max(-100, gmi - 15).toFixed(0)}`;
  } else {
    hours48 = `خلال 48 ساعة: الوضع مرهون بالتطورات - أي خبر إيجابي أو سلبي سيحدد الاتجاه`;
  }
  
  // توقع أسبوع
  let week = '';
  if (trend === 'improving') {
    week = `خلال أسبوع: الاتجاه العام إيجابي، مع احتمال تعزيز الثقة إذا لم تظهر عوامل سلبية`;
  } else if (trend === 'declining') {
    week = `خلال أسبوع: يحتاج الوضع إلى محفز إيجابي للتعافي، وإلا قد يستمر الضغط`;
  } else {
    week = `خلال أسبوع: الوضع يعتمد على التطورات - مراقبة الأخبار والمؤشرات ضرورية`;
  }
  
  return { hours24, hours48, week, trend };
}

// مقارنة مع فترات سابقة (محاكاة)
export function generateComparison(data: AnalysisData): {
  vsYesterday: string;
  vsLastWeek: string;
  trendDirection: 'up' | 'down' | 'stable';
} {
  const { gmi, cfi, hri } = data;
  
  // محاكاة بيانات سابقة (في التطبيق الحقيقي ستأتي من قاعدة البيانات)
  const yesterdayGmi = gmi + (Math.random() * 20 - 10);
  const lastWeekGmi = gmi + (Math.random() * 40 - 20);
  
  const gmiChange = gmi - yesterdayGmi;
  const weeklyChange = gmi - lastWeekGmi;
  
  let trendDirection: 'up' | 'down' | 'stable' = 'stable';
  if (gmiChange > 5) trendDirection = 'up';
  else if (gmiChange < -5) trendDirection = 'down';
  
  const vsYesterday = gmiChange > 0 
    ? `مقارنة بالأمس: تحسن بـ ${gmiChange.toFixed(0)} نقطة ↑`
    : gmiChange < 0 
    ? `مقارنة بالأمس: انخفاض بـ ${Math.abs(gmiChange).toFixed(0)} نقطة ↓`
    : `مقارنة بالأمس: مستقر`;
  
  const vsLastWeek = weeklyChange > 0 
    ? `مقارنة بالأسبوع الماضي: تحسن بـ ${weeklyChange.toFixed(0)} نقطة ↑`
    : weeklyChange < 0 
    ? `مقارنة بالأسبوع الماضي: انخفاض بـ ${Math.abs(weeklyChange).toFixed(0)} نقطة ↓`
    : `مقارنة بالأسبوع الماضي: مستقر`;
  
  return { vsYesterday, vsLastWeek, trendDirection };
}
