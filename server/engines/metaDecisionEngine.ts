/**
 * Meta Decision Engine - العقل الأعلى للمنصة
 * يحول الأرقام والمؤشرات إلى قرار نهائي واضح للمستخدم
 */

export interface MetaDecision {
  // الحالة النهائية
  finalState: 'very_positive' | 'positive_cautious' | 'neutral' | 'negative_cautious' | 'very_negative';
  finalStateAr: string;
  finalStateEn: string;
  
  // الملخص البشري
  humanSummaryAr: string;
  humanSummaryEn: string;
  
  // إشارة العمل
  actionSignal: 'opportunity' | 'watch' | 'caution' | 'warning' | 'danger';
  actionSignalAr: string;
  actionSignalEn: string;
  
  // مستوى الخطورة
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskLevelAr: string;
  riskLevelEn: string;
  
  // نسبة الثقة
  confidence: number;
  confidenceGrade: string;
  
  // التوقع
  forecast48h: string;
  forecast48hAr: string;
  
  // تفسير المؤشرات
  gmiExplanationAr: string;
  gmiExplanationEn: string;
  hriExplanationAr: string;
  hriExplanationEn: string;
  cfiExplanationAr: string;
  cfiExplanationEn: string;
  
  // الأسباب الرئيسية (نقاط)
  mainReasonsAr: string[];
  mainReasonsEn: string[];
}

interface AnalysisInput {
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  dominantEmotionScore: number;
  topic: string;
  country: string;
  domain?: string;
  sensitivity?: string;
  keywords?: string[];
}

/**
 * تحديد الحالة النهائية بناءً على المؤشرات
 */
function determineFinalState(gmi: number, cfi: number, hri: number): MetaDecision['finalState'] {
  // GMI هو المؤشر الرئيسي
  if (gmi >= 50) {
    return 'very_positive';
  } else if (gmi >= 20) {
    // إيجابي لكن نتحقق من الخوف
    if (cfi > 60) {
      return 'positive_cautious';
    }
    return 'positive_cautious';
  } else if (gmi >= -20) {
    return 'neutral';
  } else if (gmi >= -50) {
    return 'negative_cautious';
  } else {
    return 'very_negative';
  }
}

/**
 * تحديد إشارة العمل
 */
function determineActionSignal(gmi: number, cfi: number, hri: number): MetaDecision['actionSignal'] {
  if (gmi >= 40 && cfi < 40 && hri > 60) {
    return 'opportunity';
  } else if (gmi >= 20 && cfi < 60) {
    return 'watch';
  } else if (gmi >= 0 || cfi < 70) {
    return 'caution';
  } else if (cfi >= 70 || gmi < -30) {
    return 'warning';
  } else {
    return 'danger';
  }
}

/**
 * تحديد مستوى الخطورة
 */
function determineRiskLevel(cfi: number, gmi: number): MetaDecision['riskLevel'] {
  if (cfi >= 80 || gmi <= -60) {
    return 'critical';
  } else if (cfi >= 60 || gmi <= -30) {
    return 'high';
  } else if (cfi >= 40 || gmi <= 0) {
    return 'medium';
  } else {
    return 'low';
  }
}

/**
 * توليد الملخص البشري
 */
function generateHumanSummary(
  finalState: MetaDecision['finalState'],
  gmi: number,
  cfi: number,
  hri: number,
  topic: string,
  dominantEmotion: string
): { ar: string; en: string } {
  const emotionMapAr: Record<string, string> = {
    joy: 'الفرح',
    hope: 'الأمل',
    fear: 'الخوف',
    anger: 'الغضب',
    sadness: 'الحزن',
    curiosity: 'الفضول',
    calm: 'الهدوء',
    surprise: 'المفاجأة'
  };
  
  const emotionAr = emotionMapAr[dominantEmotion] || dominantEmotion;
  
  switch (finalState) {
    case 'very_positive':
      return {
        ar: `المزاج العام إيجابي جداً تجاه "${topic}". الناس متفائلة بشكل واضح مع مستوى ${emotionAr} مرتفع. التوقع: استمرار التحسن.`,
        en: `The general mood is very positive towards "${topic}". People are clearly optimistic with high ${dominantEmotion}. Expectation: continued improvement.`
      };
    case 'positive_cautious':
      return {
        ar: `المزاج العام إيجابي حذر تجاه "${topic}". الناس متفائلة لكن مع قلق متوسط (${cfi.toFixed(0)}%). التوقع: تحسن تدريجي وليس قفزة حادة.`,
        en: `The general mood is cautiously positive towards "${topic}". People are optimistic but with moderate concern (${cfi.toFixed(0)}%). Expectation: gradual improvement, not a sharp jump.`
      };
    case 'neutral':
      return {
        ar: `المزاج العام محايد تجاه "${topic}". الناس منقسمة بين التفاؤل والقلق. التوقع: استقرار مع مراقبة التطورات.`,
        en: `The general mood is neutral towards "${topic}". People are divided between optimism and concern. Expectation: stability with monitoring developments.`
      };
    case 'negative_cautious':
      return {
        ar: `المزاج العام سلبي حذر تجاه "${topic}". يوجد قلق واضح (${cfi.toFixed(0)}%) مع بعض الأمل (${hri.toFixed(0)}%). التوقع: حذر مع إمكانية التحسن.`,
        en: `The general mood is cautiously negative towards "${topic}". There is clear concern (${cfi.toFixed(0)}%) with some hope (${hri.toFixed(0)}%). Expectation: caution with possibility of improvement.`
      };
    case 'very_negative':
      return {
        ar: `المزاج العام سلبي جداً تجاه "${topic}". يوجد خوف وقلق مرتفع (${cfi.toFixed(0)}%). التوقع: وضع صعب يحتاج متابعة دقيقة.`,
        en: `The general mood is very negative towards "${topic}". There is high fear and concern (${cfi.toFixed(0)}%). Expectation: difficult situation requiring close monitoring.`
      };
  }
}

/**
 * توليد تفسير المؤشرات
 */
function generateIndexExplanations(gmi: number, cfi: number, hri: number, keywords: string[] = []): {
  gmiAr: string; gmiEn: string;
  hriAr: string; hriEn: string;
  cfiAr: string; cfiEn: string;
} {
  // GMI
  let gmiAr: string, gmiEn: string;
  if (gmi >= 30) {
    gmiAr = `إيجابي → الكلمات السائدة تشير إلى تفاؤل وفرص`;
    gmiEn = `Positive → Dominant words indicate optimism and opportunities`;
  } else if (gmi >= 0) {
    gmiAr = `محايد مائل للإيجابية → مزيج من التفاؤل والحذر`;
    gmiEn = `Neutral-positive → Mix of optimism and caution`;
  } else if (gmi >= -30) {
    gmiAr = `محايد مائل للسلبية → قلق أكثر من التفاؤل`;
    gmiEn = `Neutral-negative → More concern than optimism`;
  } else {
    gmiAr = `سلبي → الكلمات السائدة تشير إلى قلق ومخاوف`;
    gmiEn = `Negative → Dominant words indicate concern and fears`;
  }
  
  // HRI
  let hriAr: string, hriEn: string;
  if (hri >= 60) {
    hriAr = `مرتفع → الناس متفائلة بالمستقبل`;
    hriEn = `High → People are optimistic about the future`;
  } else if (hri >= 40) {
    hriAr = `متوسط → أمل معتدل مع بعض التحفظ`;
    hriEn = `Medium → Moderate hope with some reservation`;
  } else {
    hriAr = `منخفض → تشاؤم واضح تجاه المستقبل`;
    hriEn = `Low → Clear pessimism about the future`;
  }
  
  // CFI
  let cfiAr: string, cfiEn: string;
  if (cfi >= 70) {
    cfiAr = `مرتفع جداً → خوف وقلق شديد من الوضع`;
    cfiEn = `Very high → Severe fear and concern about the situation`;
  } else if (cfi >= 50) {
    cfiAr = `متوسط → قلق موجود لكن ليس طاغي`;
    cfiEn = `Medium → Concern exists but not overwhelming`;
  } else if (cfi >= 30) {
    cfiAr = `منخفض → قلق محدود والثقة مرتفعة`;
    cfiEn = `Low → Limited concern and high confidence`;
  } else {
    cfiAr = `منخفض جداً → ثقة عالية وقلق شبه معدوم`;
    cfiEn = `Very low → High confidence and almost no concern`;
  }
  
  return { gmiAr, gmiEn, hriAr, hriEn, cfiAr, cfiEn };
}

/**
 * توليد الأسباب الرئيسية
 */
function generateMainReasons(
  gmi: number,
  cfi: number,
  hri: number,
  dominantEmotion: string,
  keywords: string[] = []
): { ar: string[]; en: string[] } {
  const reasonsAr: string[] = [];
  const reasonsEn: string[] = [];
  
  // سبب GMI
  if (gmi >= 20) {
    reasonsAr.push(`المزاج العام إيجابي (GMI: ${gmi.toFixed(1)}+) مما يشير إلى تفاؤل عام`);
    reasonsEn.push(`Overall mood is positive (GMI: ${gmi.toFixed(1)}+) indicating general optimism`);
  } else if (gmi <= -20) {
    reasonsAr.push(`المزاج العام سلبي (GMI: ${gmi.toFixed(1)}) مما يشير إلى قلق عام`);
    reasonsEn.push(`Overall mood is negative (GMI: ${gmi.toFixed(1)}) indicating general concern`);
  } else {
    reasonsAr.push(`المزاج العام محايد (GMI: ${gmi.toFixed(1)}) مع انقسام في الآراء`);
    reasonsEn.push(`Overall mood is neutral (GMI: ${gmi.toFixed(1)}) with divided opinions`);
  }
  
  // سبب CFI
  if (cfi >= 60) {
    reasonsAr.push(`مستوى الخوف مرتفع (CFI: ${cfi.toFixed(1)}%) مما يستدعي الحذر`);
    reasonsEn.push(`Fear level is high (CFI: ${cfi.toFixed(1)}%) requiring caution`);
  } else if (cfi <= 40) {
    reasonsAr.push(`مستوى الخوف منخفض (CFI: ${cfi.toFixed(1)}%) مما يدل على ثقة`);
    reasonsEn.push(`Fear level is low (CFI: ${cfi.toFixed(1)}%) indicating confidence`);
  }
  
  // سبب HRI
  if (hri >= 60) {
    reasonsAr.push(`مؤشر الأمل مرتفع (HRI: ${hri.toFixed(1)}%) مما يدعم التفاؤل`);
    reasonsEn.push(`Hope index is high (HRI: ${hri.toFixed(1)}%) supporting optimism`);
  } else if (hri <= 40) {
    reasonsAr.push(`مؤشر الأمل منخفض (HRI: ${hri.toFixed(1)}%) مما يشير إلى تشاؤم`);
    reasonsEn.push(`Hope index is low (HRI: ${hri.toFixed(1)}%) indicating pessimism`);
  }
  
  // الشعور السائد
  const emotionMapAr: Record<string, string> = {
    joy: 'الفرح',
    hope: 'الأمل',
    fear: 'الخوف',
    anger: 'الغضب',
    sadness: 'الحزن',
    curiosity: 'الفضول',
    calm: 'الهدوء'
  };
  const emotionAr = emotionMapAr[dominantEmotion] || dominantEmotion;
  reasonsAr.push(`الشعور السائد هو ${emotionAr} مما يؤثر على القرارات`);
  reasonsEn.push(`Dominant emotion is ${dominantEmotion} which affects decisions`);
  
  return { ar: reasonsAr, en: reasonsEn };
}

/**
 * المحرك الرئيسي - يحول المؤشرات إلى قرار نهائي
 */
export function generateMetaDecision(input: AnalysisInput): MetaDecision {
  const { gmi, cfi, hri, dominantEmotion, dominantEmotionScore, topic, country, keywords = [] } = input;
  
  // تحديد الحالة النهائية
  const finalState = determineFinalState(gmi, cfi, hri);
  
  // تحديد إشارة العمل
  const actionSignal = determineActionSignal(gmi, cfi, hri);
  
  // تحديد مستوى الخطورة
  const riskLevel = determineRiskLevel(cfi, gmi);
  
  // حساب الثقة
  const confidence = Math.min(95, Math.max(50, 70 + (100 - Math.abs(gmi - 50)) / 5));
  
  // توليد الملخص البشري
  const humanSummary = generateHumanSummary(finalState, gmi, cfi, hri, topic, dominantEmotion);
  
  // توليد تفسير المؤشرات
  const explanations = generateIndexExplanations(gmi, cfi, hri, keywords);
  
  // توليد الأسباب
  const reasons = generateMainReasons(gmi, cfi, hri, dominantEmotion, keywords);
  
  // ترجمات الحالات
  const finalStateLabels: Record<MetaDecision['finalState'], { ar: string; en: string }> = {
    very_positive: { ar: 'إيجابي جداً', en: 'Very Positive' },
    positive_cautious: { ar: 'إيجابي حذر', en: 'Cautiously Positive' },
    neutral: { ar: 'محايد', en: 'Neutral' },
    negative_cautious: { ar: 'سلبي حذر', en: 'Cautiously Negative' },
    very_negative: { ar: 'سلبي جداً', en: 'Very Negative' }
  };
  
  const actionSignalLabels: Record<MetaDecision['actionSignal'], { ar: string; en: string }> = {
    opportunity: { ar: 'فرصة', en: 'Opportunity' },
    watch: { ar: 'مراقبة', en: 'Watch' },
    caution: { ar: 'حذر', en: 'Caution' },
    warning: { ar: 'تحذير', en: 'Warning' },
    danger: { ar: 'خطر', en: 'Danger' }
  };
  
  const riskLevelLabels: Record<MetaDecision['riskLevel'], { ar: string; en: string }> = {
    low: { ar: 'منخفض', en: 'Low' },
    medium: { ar: 'متوسط', en: 'Medium' },
    high: { ar: 'مرتفع', en: 'High' },
    critical: { ar: 'حرج', en: 'Critical' }
  };
  
  // توقع 48 ساعة
  let forecast48hAr: string, forecast48hEn: string;
  if (gmi >= 30 && hri >= 50) {
    forecast48hAr = 'استمرار التحسن';
    forecast48hEn = 'Continued improvement';
  } else if (gmi >= 0) {
    forecast48hAr = 'تحسن تدريجي';
    forecast48hEn = 'Gradual improvement';
  } else if (gmi >= -30) {
    forecast48hAr = 'استقرار مع مراقبة';
    forecast48hEn = 'Stability with monitoring';
  } else {
    forecast48hAr = 'وضع صعب يحتاج متابعة';
    forecast48hEn = 'Difficult situation needs follow-up';
  }
  
  // تحديد درجة الثقة
  let confidenceGrade: string;
  if (confidence >= 85) confidenceGrade = 'A';
  else if (confidence >= 75) confidenceGrade = 'B+';
  else if (confidence >= 65) confidenceGrade = 'B';
  else if (confidence >= 55) confidenceGrade = 'C';
  else confidenceGrade = 'D';
  
  return {
    finalState,
    finalStateAr: finalStateLabels[finalState].ar,
    finalStateEn: finalStateLabels[finalState].en,
    humanSummaryAr: humanSummary.ar,
    humanSummaryEn: humanSummary.en,
    actionSignal,
    actionSignalAr: actionSignalLabels[actionSignal].ar,
    actionSignalEn: actionSignalLabels[actionSignal].en,
    riskLevel,
    riskLevelAr: riskLevelLabels[riskLevel].ar,
    riskLevelEn: riskLevelLabels[riskLevel].en,
    confidence,
    confidenceGrade,
    forecast48h: forecast48hEn,
    forecast48hAr,
    gmiExplanationAr: explanations.gmiAr,
    gmiExplanationEn: explanations.gmiEn,
    hriExplanationAr: explanations.hriAr,
    hriExplanationEn: explanations.hriEn,
    cfiExplanationAr: explanations.cfiAr,
    cfiExplanationEn: explanations.cfiEn,
    mainReasonsAr: reasons.ar,
    mainReasonsEn: reasons.en
  };
}
