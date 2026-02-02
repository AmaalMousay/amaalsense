/**
 * Decision Compression Layer
 * 
 * يحول الردود الطويلة التحليلية إلى ردود استشارية قصيرة وحاسمة
 * 
 * المشكلة: AmalSense يفهم الواقع ممتاز لكن لا يصدر حكم واضح
 * الحل: ضغط الرد واستخراج الحكم ووضعه في البداية
 */

export interface AnalysisData {
  topic: string;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  confidence: number;
}

export interface CompressedResponse {
  // الخلاصة - سطر واحد حاسم
  judgment: string;
  // إشارة القرار النفسية
  decisionSignal: string;
  // لماذا - شرح مختصر
  reasoning: string;
  // التوقع الزمني
  timeframe: string;
  // السؤال الختامي
  closingQuestion: string;
  // الرد الكامل المُعاد هيكلته
  fullResponse: string;
}

/**
 * استخراج الحكم من المؤشرات
 */
export function extractJudgment(data: AnalysisData): string {
  const { gmi, cfi, hri, topic } = data;
  
  // حالات الحكم الواضح
  if (cfi > 70 && hri < 30) {
    return `الوضع في ${topic} يتجه نحو أزمة نفسية جماعية - خوف مرتفع وأمل منخفض.`;
  }
  
  if (cfi > 60 && hri > 60) {
    return `${topic}: حالة توتر مرتفع مع ترقب نشط - ليس استقراراً حقيقياً.`;
  }
  
  if (gmi > 40 && cfi < 30) {
    return `${topic}: مزاج إيجابي واضح مع ثقة جماعية - بيئة مواتية للتحرك.`;
  }
  
  if (gmi < -40 && cfi > 60) {
    return `${topic}: مزاج سلبي حاد مع خوف مرتفع - وقت الحذر الشديد.`;
  }
  
  if (Math.abs(gmi) < 20 && cfi > 50 && hri > 50) {
    return `${topic}: حالة انتظار حذر - المجتمع يراقب ولم يحسم موقفه.`;
  }
  
  if (gmi > 20 && hri > 60) {
    return `${topic}: تفاؤل حذر مع أمل قوي - فرصة للمبادرات الإيجابية.`;
  }
  
  if (gmi < -20 && hri < 40) {
    return `${topic}: تشاؤم سائد مع أمل ضعيف - مرحلة صعبة تحتاج صبر.`;
  }
  
  // الحالة الافتراضية
  return `${topic}: حالة مختلطة تحتاج مراقبة - لا إشارات حاسمة حالياً.`;
}

/**
 * استخراج إشارة القرار
 */
export function extractDecisionSignal(data: AnalysisData): string {
  const { gmi, cfi, hri } = data;
  
  // إشارات واضحة
  if (cfi > 70) {
    return '⚠️ إشارة تحذير: الخوف الجماعي مرتفع جداً - تجنب القرارات الكبيرة.';
  }
  
  if (cfi > 60 && hri > 60) {
    return '⏳ إشارة انتظار: المجتمع في وضع ترقب - انتظر إشارات أوضح.';
  }
  
  if (gmi > 30 && cfi < 40) {
    return '✅ إشارة إيجابية: البيئة النفسية مواتية للتحرك.';
  }
  
  if (gmi < -30 && cfi > 50) {
    return '🛑 إشارة سلبية: المزاج العام سيء - وقت الحذر.';
  }
  
  if (hri > 70 && cfi < 50) {
    return '💡 إشارة أمل: الثقة في التحسن موجودة - فرصة للتفاؤل الحذر.';
  }
  
  // الافتراضي
  return '📊 إشارة محايدة: لا توجد إشارات حاسمة - راقب التطورات.';
}

/**
 * توليد التفسير المختصر
 */
export function generateReasoning(data: AnalysisData): string {
  const { gmi, cfi, hri, dominantEmotion } = data;
  
  const parts: string[] = [];
  
  // GMI
  if (gmi > 30) {
    parts.push(`المزاج العام إيجابي (GMI: ${gmi.toFixed(0)})`);
  } else if (gmi < -30) {
    parts.push(`المزاج العام سلبي (GMI: ${gmi.toFixed(0)})`);
  } else {
    parts.push(`المزاج العام محايد (GMI: ${gmi.toFixed(0)})`);
  }
  
  // CFI
  if (cfi > 60) {
    parts.push(`الخوف مرتفع (CFI: ${cfi.toFixed(0)}%) → قلق وعدم يقين`);
  } else if (cfi < 30) {
    parts.push(`الخوف منخفض (CFI: ${cfi.toFixed(0)}%) → ثقة نسبية`);
  } else {
    parts.push(`الخوف متوسط (CFI: ${cfi.toFixed(0)}%)`);
  }
  
  // HRI
  if (hri > 60) {
    parts.push(`الأمل قوي (HRI: ${hri.toFixed(0)}%) → قدرة على التكيف`);
  } else if (hri < 30) {
    parts.push(`الأمل ضعيف (HRI: ${hri.toFixed(0)}%) → إحباط سائد`);
  } else {
    parts.push(`الأمل متوسط (HRI: ${hri.toFixed(0)}%)`);
  }
  
  // العاطفة المسيطرة
  const emotionMap: Record<string, string> = {
    'fear': 'الخوف المسيطر يعني مراقبة وحذر',
    'hope': 'الأمل المسيطر يعني تطلع للتحسن',
    'curiosity': 'الفضول المسيطر يعني ترقب وانتظار إشارات',
    'anger': 'الغضب المسيطر يعني استياء من الوضع الحالي',
    'joy': 'الفرح المسيطر يعني رضا عن التطورات',
    'sadness': 'الحزن المسيطر يعني خيبة أمل'
  };
  
  if (emotionMap[dominantEmotion.toLowerCase()]) {
    parts.push(emotionMap[dominantEmotion.toLowerCase()]);
  }
  
  return parts.join(' • ');
}

/**
 * توليد التوقع الزمني
 */
export function generateTimeframe(data: AnalysisData): string {
  const { gmi, cfi, hri } = data;
  
  // حالات التغير السريع
  if (cfi > 70 || Math.abs(gmi) > 50) {
    return 'خلال 24-48 ساعة: احتمال تغير سريع في المزاج العام بناءً على أي أخبار جديدة.';
  }
  
  // حالات الاستقرار النسبي
  if (cfi > 50 && hri > 50) {
    return 'خلال الأسبوع القادم: استمرار حالة الترقب مع حساسية عالية لأي تطورات.';
  }
  
  // حالات التحسن المحتمل
  if (gmi > 20 && hri > 60) {
    return 'خلال الأيام القادمة: احتمال تحسن تدريجي إذا استمرت الأخبار الإيجابية.';
  }
  
  // حالات التدهور المحتمل
  if (gmi < -20 && cfi > 60) {
    return 'خلال الأيام القادمة: خطر تدهور إضافي إذا ظهرت أخبار سلبية.';
  }
  
  // الافتراضي
  return 'خلال 48-72 ساعة: الوضع قابل للتغير - يُنصح بالمتابعة المستمرة.';
}

/**
 * توليد السؤال الختامي
 */
export function generateClosingQuestion(data: AnalysisData): string {
  const { cfi, hri, topic } = data;
  
  const questions = [
    `هل تريد أن أحاكي لك ماذا يحدث نفسياً لو استمر هذا الوضع شهراً؟`,
    `هل تحب أن أوضح لك السيناريو الأفضل والأسوأ لـ ${topic}؟`,
    `هل تريد معرفة العوامل التي قد تغير هذا الوضع؟`,
    `هل تحب أن أقارن هذا الوضع بفترات سابقة مشابهة؟`,
  ];
  
  // اختيار سؤال مناسب للحالة
  if (cfi > 60) {
    return `هل تريد أن أحاكي لك ماذا يحدث لو انخفض الخوف الجماعي؟`;
  }
  
  if (hri > 60) {
    return `هل تحب أن أوضح لك كيف يمكن تعزيز هذا الأمل؟`;
  }
  
  // سؤال عشوائي من القائمة
  return questions[Math.floor(Math.random() * questions.length)];
}

/**
 * ضغط الرد الكامل
 */
export function compressResponse(
  rawResponse: string,
  data: AnalysisData
): CompressedResponse {
  const judgment = extractJudgment(data);
  const decisionSignal = extractDecisionSignal(data);
  const reasoning = generateReasoning(data);
  const timeframe = generateTimeframe(data);
  const closingQuestion = generateClosingQuestion(data);
  
  // بناء الرد المُعاد هيكلته
  const fullResponse = `**${judgment}**

**إشارة القرار:**
${decisionSignal}

**لماذا؟**
${reasoning}

**التوقع الزمني:**
${timeframe}

---
${closingQuestion}`;
  
  return {
    judgment,
    decisionSignal,
    reasoning,
    timeframe,
    closingQuestion,
    fullResponse
  };
}

/**
 * إعادة هيكلة رد LLM الخام
 */
export function restructureAIResponse(
  rawResponse: string,
  data: AnalysisData
): string {
  // إذا كان الرد قصيراً جداً، استخدم الضغط الكامل
  if (rawResponse.length < 200) {
    return compressResponse(rawResponse, data).fullResponse;
  }
  
  // إزالة المقدمات الروبوتية
  let cleaned = rawResponse;
  const roboticPatterns = [
    /^بناءً? على تحليلات محركات AmalSense[,،]?\s*/i,
    /^بناءً? على تحليلات[,،]?\s*/i,
    /^إليك تقييم[,،]?\s*/i,
    /^وفقًا لتحليلات[,،]?\s*/i,
    /^بصفتي AmalSense[,،]?\s*/i,
    /^As AmalSense AI[,،]?\s*/i,
  ];
  
  for (const pattern of roboticPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }
  
  // استخراج الحكم
  const judgment = extractJudgment(data);
  const decisionSignal = extractDecisionSignal(data);
  const closingQuestion = generateClosingQuestion(data);
  
  // التحقق من وجود سؤال ختامي
  const hasClosingQuestion = cleaned.includes('هل تريد') || 
                             cleaned.includes('هل تحب') ||
                             cleaned.includes('Would you like');
  
  // بناء الرد النهائي
  let finalResponse = `**${judgment}**\n\n`;
  
  // إضافة إشارة القرار إذا لم تكن موجودة
  if (!cleaned.includes('إشارة') && !cleaned.includes('signal')) {
    finalResponse += `**إشارة القرار:**\n${decisionSignal}\n\n`;
  }
  
  // إضافة المحتوى المنظف (مع تقليص الطول)
  const maxLength = 500;
  if (cleaned.length > maxLength) {
    // استخراج أهم الفقرات
    const paragraphs = cleaned.split('\n\n').filter(p => p.trim().length > 0);
    const importantParagraphs = paragraphs.slice(0, 3);
    cleaned = importantParagraphs.join('\n\n');
  }
  
  finalResponse += cleaned;
  
  // إضافة السؤال الختامي إذا لم يكن موجوداً
  if (!hasClosingQuestion) {
    finalResponse += `\n\n---\n${closingQuestion}`;
  }
  
  return finalResponse.trim();
}

export default {
  extractJudgment,
  extractDecisionSignal,
  generateReasoning,
  generateTimeframe,
  generateClosingQuestion,
  compressResponse,
  restructureAIResponse
};
