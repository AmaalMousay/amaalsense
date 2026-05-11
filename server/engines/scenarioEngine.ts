/**
 * Scenario Engine - محرك محاكاة السيناريوهات المستقبلية
 * 
 * يحول AmalSense من "نظام يرفض التنبؤ" إلى "ذكاء يحاكي المستقبل"
 * 
 * المبدأ: بناءً على المؤشرات الحالية + الحدث المفترض = التوقع المحاكى
 */

export interface ScenarioInput {
  // المؤشرات الحالية
  currentGMI: number;
  currentCFI: number;
  currentHRI: number;
  
  // الحدث المفترض
  event: ScenarioEvent;
  
  // الإطار الزمني
  timeframe: '24h' | '48h' | '1week' | '1month';
  
  // السياق (اختياري)
  topic?: string;
  country?: string;
}

export type ScenarioEvent = 
  | 'dollar_rise'          // ارتفاع الدولار
  | 'dollar_fall'          // انخفاض الدولار
  | 'positive_news'        // أخبار إيجابية
  | 'negative_news'        // أخبار سلبية
  | 'political_crisis'     // أزمة سياسية
  | 'economic_improvement' // تحسن اقتصادي
  | 'security_threat'      // تهديد أمني
  | 'peace_agreement'      // اتفاق سلام
  | 'market_crash'         // انهيار سوق
  | 'market_rally'         // صعود سوق
  | 'oil_price_up'         // ارتفاع النفط
  | 'oil_price_down'       // انخفاض النفط
  | 'custom';              // حدث مخصص

export interface ScenarioOutput {
  // التوقعات
  predictedGMI: number;
  predictedCFI: number;
  predictedHRI: number;
  
  // التغييرات
  gmiChange: number;
  cfiChange: number;
  hriChange: number;
  
  // الاتجاه
  trend: 'improving' | 'declining' | 'volatile' | 'stable';
  
  // الثقة
  confidence: number;
  
  // التفسير
  explanation: string;
  
  // التوصية
  recommendation: string;
  
  // المخاطر
  risks: string[];
  
  // الفرص
  opportunities: string[];
}

// معاملات تأثير الأحداث على المؤشرات
const EVENT_IMPACTS: Record<ScenarioEvent, {
  gmiImpact: number;
  cfiImpact: number;
  hriImpact: number;
  volatility: number;
  description: string;
}> = {
  dollar_rise: {
    gmiImpact: -15,
    cfiImpact: +20,
    hriImpact: -10,
    volatility: 0.7,
    description: 'ارتفاع سعر الدولار يزيد القلق الاقتصادي ويقلل الأمل'
  },
  dollar_fall: {
    gmiImpact: +10,
    cfiImpact: -15,
    hriImpact: +12,
    volatility: 0.5,
    description: 'انخفاض الدولار يحسن المزاج ويقلل الخوف'
  },
  positive_news: {
    gmiImpact: +20,
    cfiImpact: -15,
    hriImpact: +18,
    volatility: 0.4,
    description: 'الأخبار الإيجابية ترفع المزاج والأمل وتقلل الخوف'
  },
  negative_news: {
    gmiImpact: -25,
    cfiImpact: +25,
    hriImpact: -15,
    volatility: 0.8,
    description: 'الأخبار السلبية تخفض المزاج وترفع الخوف'
  },
  political_crisis: {
    gmiImpact: -30,
    cfiImpact: +35,
    hriImpact: -20,
    volatility: 0.9,
    description: 'الأزمات السياسية تسبب قلقاً جماعياً حاداً'
  },
  economic_improvement: {
    gmiImpact: +25,
    cfiImpact: -20,
    hriImpact: +22,
    volatility: 0.3,
    description: 'التحسن الاقتصادي يعزز الثقة والتفاؤل'
  },
  security_threat: {
    gmiImpact: -35,
    cfiImpact: +40,
    hriImpact: -25,
    volatility: 0.95,
    description: 'التهديدات الأمنية تسبب خوفاً جماعياً شديداً'
  },
  peace_agreement: {
    gmiImpact: +40,
    cfiImpact: -30,
    hriImpact: +35,
    volatility: 0.2,
    description: 'اتفاقيات السلام تحدث تحولاً إيجابياً كبيراً'
  },
  market_crash: {
    gmiImpact: -40,
    cfiImpact: +45,
    hriImpact: -30,
    volatility: 0.95,
    description: 'انهيار الأسواق يسبب ذعراً جماعياً'
  },
  market_rally: {
    gmiImpact: +30,
    cfiImpact: -25,
    hriImpact: +25,
    volatility: 0.4,
    description: 'صعود الأسواق يعزز التفاؤل والثقة'
  },
  oil_price_up: {
    gmiImpact: -10,
    cfiImpact: +15,
    hriImpact: -8,
    volatility: 0.5,
    description: 'ارتفاع أسعار النفط يزيد القلق الاقتصادي'
  },
  oil_price_down: {
    gmiImpact: +8,
    cfiImpact: -10,
    hriImpact: +10,
    volatility: 0.4,
    description: 'انخفاض أسعار النفط يخفف الضغط الاقتصادي'
  },
  custom: {
    gmiImpact: 0,
    cfiImpact: 0,
    hriImpact: 0,
    volatility: 0.5,
    description: 'حدث مخصص - التأثير يعتمد على السياق'
  }
};

// معاملات الإطار الزمني
const TIMEFRAME_MULTIPLIERS: Record<string, number> = {
  '24h': 0.5,   // التأثير يكون نصف القوة في 24 ساعة
  '48h': 0.75,  // ثلاثة أرباع في 48 ساعة
  '1week': 1.0, // كامل التأثير في أسبوع
  '1month': 1.2 // قد يتضخم التأثير مع الوقت
};

/**
 * محاكاة سيناريو مستقبلي
 */
export function simulateScenario(input: ScenarioInput): ScenarioOutput {
  const impact = EVENT_IMPACTS[input.event];
  const timeMultiplier = TIMEFRAME_MULTIPLIERS[input.timeframe] || 1.0;
  
  // حساب التغييرات مع مراعاة الإطار الزمني
  const gmiChange = Math.round(impact.gmiImpact * timeMultiplier);
  const cfiChange = Math.round(impact.cfiImpact * timeMultiplier);
  const hriChange = Math.round(impact.hriImpact * timeMultiplier);
  
  // حساب القيم المتوقعة مع الحدود
  const predictedGMI = Math.max(-100, Math.min(100, input.currentGMI + gmiChange));
  const predictedCFI = Math.max(0, Math.min(100, input.currentCFI + cfiChange));
  const predictedHRI = Math.max(0, Math.min(100, input.currentHRI + hriChange));
  
  // تحديد الاتجاه
  let trend: ScenarioOutput['trend'] = 'stable';
  if (gmiChange > 10 && hriChange > 10) trend = 'improving';
  else if (gmiChange < -10 || cfiChange > 20) trend = 'declining';
  else if (impact.volatility > 0.7) trend = 'volatile';
  
  // حساب الثقة بناءً على التقلب والبيانات
  const confidence = Math.round((1 - impact.volatility * 0.5) * 100);
  
  // توليد التفسير
  const explanation = generateExplanation(input, impact, {
    gmiChange, cfiChange, hriChange, predictedGMI, predictedCFI, predictedHRI
  });
  
  // توليد التوصية
  const recommendation = generateRecommendation(predictedGMI, predictedCFI, predictedHRI, trend);
  
  // تحديد المخاطر والفرص
  const { risks, opportunities } = identifyRisksAndOpportunities(
    predictedGMI, predictedCFI, predictedHRI, input.event
  );
  
  return {
    predictedGMI,
    predictedCFI,
    predictedHRI,
    gmiChange,
    cfiChange,
    hriChange,
    trend,
    confidence,
    explanation,
    recommendation,
    risks,
    opportunities
  };
}

/**
 * توليد التفسير
 */
function generateExplanation(
  input: ScenarioInput,
  impact: typeof EVENT_IMPACTS[ScenarioEvent],
  changes: { gmiChange: number; cfiChange: number; hriChange: number; predictedGMI: number; predictedCFI: number; predictedHRI: number }
): string {
  const timeframeText: Record<string, string> = {
    '24h': 'خلال 24 ساعة',
    '48h': 'خلال 48 ساعة',
    '1week': 'خلال الأسبوع القادم',
    '1month': 'خلال الشهر القادم'
  };
  
  let explanation = `${impact.description}\n\n`;
  explanation += `**${timeframeText[input.timeframe]}:**\n`;
  
  // GMI
  if (changes.gmiChange !== 0) {
    const direction = changes.gmiChange > 0 ? 'يرتفع' : 'ينخفض';
    explanation += `- المزاج العام (GMI) ${direction} من ${input.currentGMI} إلى ${changes.predictedGMI} (${changes.gmiChange > 0 ? '+' : ''}${changes.gmiChange})\n`;
  }
  
  // CFI
  if (changes.cfiChange !== 0) {
    const direction = changes.cfiChange > 0 ? 'يرتفع' : 'ينخفض';
    explanation += `- مؤشر الخوف (CFI) ${direction} من ${input.currentCFI}% إلى ${changes.predictedCFI}% (${changes.cfiChange > 0 ? '+' : ''}${changes.cfiChange}%)\n`;
  }
  
  // HRI
  if (changes.hriChange !== 0) {
    const direction = changes.hriChange > 0 ? 'يرتفع' : 'ينخفض';
    explanation += `- مؤشر الأمل (HRI) ${direction} من ${input.currentHRI}% إلى ${changes.predictedHRI}% (${changes.hriChange > 0 ? '+' : ''}${changes.hriChange}%)\n`;
  }
  
  return explanation;
}

/**
 * توليد التوصية
 */
function generateRecommendation(
  predictedGMI: number,
  predictedCFI: number,
  predictedHRI: number,
  trend: ScenarioOutput['trend']
): string {
  if (trend === 'improving' && predictedCFI < 50) {
    return 'الظروف ستكون مواتية - يمكن التحرك بثقة معقولة';
  }
  
  if (trend === 'declining' && predictedCFI > 70) {
    return 'الحذر الشديد مطلوب - تأجيل القرارات الكبيرة حتى تستقر الأوضاع';
  }
  
  if (trend === 'volatile') {
    return 'توقع تقلبات عالية - المراقبة المستمرة ضرورية والمرونة في التخطيط';
  }
  
  if (predictedGMI > 30 && predictedHRI > 50) {
    return 'الوضع سيكون إيجابياً - فرصة للتحرك التدريجي';
  }
  
  if (predictedGMI < -30) {
    return 'الوضع سيكون صعباً - الانتظار والمراقبة هو الخيار الأمثل';
  }
  
  return 'المتابعة والتقييم المستمر - الوضع يحتاج مراقبة';
}

/**
 * تحديد المخاطر والفرص
 */
function identifyRisksAndOpportunities(
  predictedGMI: number,
  predictedCFI: number,
  predictedHRI: number,
  event: ScenarioEvent
): { risks: string[]; opportunities: string[] } {
  const risks: string[] = [];
  const opportunities: string[] = [];
  
  // المخاطر
  if (predictedCFI > 70) {
    risks.push('خوف جماعي مرتفع قد يؤدي لقرارات متسرعة');
  }
  if (predictedGMI < -40) {
    risks.push('مزاج سلبي حاد قد يستمر لفترة');
  }
  if (predictedHRI < 30) {
    risks.push('انخفاض الأمل قد يبطئ التعافي');
  }
  if (event === 'political_crisis' || event === 'security_threat') {
    risks.push('الأحداث قد تتصاعد وتزيد التأثير السلبي');
  }
  
  // الفرص
  if (predictedGMI > 30 && predictedCFI < 40) {
    opportunities.push('بيئة إيجابية للمبادرات الجديدة');
  }
  if (predictedHRI > 60) {
    opportunities.push('الأمل القوي يدعم التعافي السريع');
  }
  if (event === 'economic_improvement' || event === 'peace_agreement') {
    opportunities.push('فرصة لتحولات إيجابية طويلة المدى');
  }
  if (predictedCFI < 30) {
    opportunities.push('انخفاض الخوف يفتح المجال للتحرك بثقة');
  }
  
  return { risks, opportunities };
}

/**
 * اكتشاف نوع الحدث من النص
 */
export function detectEventFromText(text: string): ScenarioEvent {
  // لا نستخدم toLowerCase للنص العربي
  const lowerText = text.toLowerCase();
  
  // الدولار - البحث في النص الأصلي والمحول
  const hasDollar = text.includes('دولار') || lowerText.includes('dollar');
  const hasRise = text.includes('ارتفاع') || text.includes('يرتفع') || text.includes('ارتفع') || 
                  text.includes('استمر') || lowerText.includes('rise') || lowerText.includes('up');
  const hasFall = text.includes('انخفاض') || text.includes('ينخفض') || text.includes('انخفض') || 
                  lowerText.includes('fall') || lowerText.includes('down');
  
  if (hasDollar && hasRise) {
    return 'dollar_rise';
  }
  if (hasDollar && hasFall) {
    return 'dollar_fall';
  }
  
  // الأخبار
  if (lowerText.includes('أخبار إيجابية') || lowerText.includes('positive news') || lowerText.includes('تحسن')) {
    return 'positive_news';
  }
  if (lowerText.includes('أخبار سلبية') || lowerText.includes('negative news') || lowerText.includes('تدهور')) {
    return 'negative_news';
  }
  
  // السياسة
  if (lowerText.includes('أزمة سياسية') || lowerText.includes('political crisis') || lowerText.includes('صراع')) {
    return 'political_crisis';
  }
  if (lowerText.includes('سلام') || lowerText.includes('peace') || lowerText.includes('اتفاق')) {
    return 'peace_agreement';
  }
  
  // الأمن
  if (lowerText.includes('تهديد') || lowerText.includes('threat') || lowerText.includes('خطر أمني')) {
    return 'security_threat';
  }
  
  // الاقتصاد
  if (lowerText.includes('تحسن اقتصادي') || lowerText.includes('economic improvement') || lowerText.includes('نمو')) {
    return 'economic_improvement';
  }
  
  // السوق
  if (lowerText.includes('انهيار') || lowerText.includes('crash') || lowerText.includes('هبوط حاد')) {
    return 'market_crash';
  }
  if (lowerText.includes('صعود') || lowerText.includes('rally') || lowerText.includes('ارتفاع السوق')) {
    return 'market_rally';
  }
  
  // النفط
  if ((lowerText.includes('نفط') || lowerText.includes('oil')) && 
      (lowerText.includes('ارتفاع') || lowerText.includes('up'))) {
    return 'oil_price_up';
  }
  if ((lowerText.includes('نفط') || lowerText.includes('oil')) && 
      (lowerText.includes('انخفاض') || lowerText.includes('down'))) {
    return 'oil_price_down';
  }
  
  return 'custom';
}

/**
 * اكتشاف الإطار الزمني من النص
 */
export function detectTimeframeFromText(text: string): ScenarioInput['timeframe'] {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('24 ساعة') || lowerText.includes('غداً') || lowerText.includes('tomorrow') || lowerText.includes('24h')) {
    return '24h';
  }
  if (lowerText.includes('48 ساعة') || lowerText.includes('يومين') || lowerText.includes('48h')) {
    return '48h';
  }
  if (lowerText.includes('أسبوع') || lowerText.includes('week') || lowerText.includes('الأسبوع القادم')) {
    return '1week';
  }
  if (lowerText.includes('شهر') || lowerText.includes('month')) {
    return '1month';
  }
  
  return '1week'; // الافتراضي
}

/**
 * توليد رد السيناريو للـ AI
 */
export function generateScenarioResponse(
  question: string,
  currentIndicators: { gmi: number; cfi: number; hri: number },
  topic?: string
): string {
  const event = detectEventFromText(question);
  const timeframe = detectTimeframeFromText(question);
  
  const scenario = simulateScenario({
    currentGMI: currentIndicators.gmi,
    currentCFI: currentIndicators.cfi,
    currentHRI: currentIndicators.hri,
    event,
    timeframe,
    topic
  });
  
  // بناء الرد
  let response = `**محاكاة السيناريو:**\n\n`;
  response += scenario.explanation + '\n';
  
  response += `\n**التوصية:**\n${scenario.recommendation}\n`;
  
  if (scenario.risks.length > 0) {
    response += `\n**المخاطر المحتملة:**\n`;
    scenario.risks.forEach(risk => {
      response += `- ${risk}\n`;
    });
  }
  
  if (scenario.opportunities.length > 0) {
    response += `\n**الفرص المحتملة:**\n`;
    scenario.opportunities.forEach(opp => {
      response += `- ${opp}\n`;
    });
  }
  
  response += `\n**مستوى الثقة في هذا التوقع:** ${scenario.confidence}%`;
  response += `\n\n---\nهل تريد استكشاف سيناريو آخر أو معرفة المزيد عن العوامل المؤثرة؟`;
  
  return response;
}

export default {
  simulateScenario,
  detectEventFromText,
  detectTimeframeFromText,
  generateScenarioResponse
};
