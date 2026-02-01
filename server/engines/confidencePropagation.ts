/**
 * Confidence Propagation System
 * 
 * وظيفته:
 * - كل Engine يرجّع engineConfidence: 0-100
 * - حساب overallConfidence كمتوسط مرجح
 * - توريث الثقة عبر الـ Engines
 */

// أنواع الثقة
export interface EngineConfidence {
  engineName: string;
  confidence: number; // 0-100
  factors: ConfidenceFactor[];
}

export interface ConfidenceFactor {
  name: string;
  value: number; // 0-1
  weight: number; // 0-1
  description: string;
}

export interface OverallConfidence {
  score: number; // 0-100
  level: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  engineConfidences: EngineConfidence[];
  explanation: string;
}

// أوزان الـ Engines في حساب الثقة الإجمالية
export const engineWeights: Record<string, number> = {
  contextClassification: 0.15,
  emotionFusion: 0.30,
  emotionalDynamics: 0.20,
  driverDetection: 0.15,
  explainableInsight: 0.20,
};

/**
 * حساب ثقة Engine التصنيف السياقي
 */
export function calculateContextConfidence(
  textLength: number,
  keywordsFound: number,
  languageDetected: boolean,
  domainClear: boolean
): EngineConfidence {
  const factors: ConfidenceFactor[] = [
    {
      name: 'textLength',
      value: Math.min(textLength / 500, 1), // أفضل مع نص أطول
      weight: 0.2,
      description: 'طول النص يؤثر على دقة التصنيف'
    },
    {
      name: 'keywordsFound',
      value: Math.min(keywordsFound / 10, 1),
      weight: 0.3,
      description: 'عدد الكلمات المفتاحية المكتشفة'
    },
    {
      name: 'languageDetected',
      value: languageDetected ? 1 : 0.3,
      weight: 0.2,
      description: 'هل تم اكتشاف اللغة بنجاح'
    },
    {
      name: 'domainClear',
      value: domainClear ? 1 : 0.5,
      weight: 0.3,
      description: 'وضوح المجال (سياسة، اقتصاد، إلخ)'
    }
  ];
  
  const confidence = calculateWeightedConfidence(factors);
  
  return {
    engineName: 'contextClassification',
    confidence,
    factors
  };
}

/**
 * حساب ثقة Engine دمج المشاعر
 */
export function calculateFusionConfidence(
  sourceCount: number,
  sourceQuality: number, // 0-1
  agreementLevel: number, // 0-1 (مدى اتفاق المصادر)
  emotionClarity: number // 0-1 (وضوح المشاعر)
): EngineConfidence {
  const factors: ConfidenceFactor[] = [
    {
      name: 'sourceCount',
      value: Math.min(sourceCount / 20, 1),
      weight: 0.25,
      description: 'عدد المصادر المحللة'
    },
    {
      name: 'sourceQuality',
      value: sourceQuality,
      weight: 0.30,
      description: 'جودة وموثوقية المصادر'
    },
    {
      name: 'agreementLevel',
      value: agreementLevel,
      weight: 0.25,
      description: 'مدى اتفاق المصادر على المشاعر'
    },
    {
      name: 'emotionClarity',
      value: emotionClarity,
      weight: 0.20,
      description: 'وضوح المشاعر المكتشفة'
    }
  ];
  
  const confidence = calculateWeightedConfidence(factors);
  
  return {
    engineName: 'emotionFusion',
    confidence,
    factors
  };
}

/**
 * حساب ثقة Engine الديناميكيات
 */
export function calculateDynamicsConfidence(
  historicalDataPoints: number,
  timeSpan: number, // بالساعات
  trendConsistency: number // 0-1
): EngineConfidence {
  const factors: ConfidenceFactor[] = [
    {
      name: 'historicalDataPoints',
      value: Math.min(historicalDataPoints / 50, 1),
      weight: 0.40,
      description: 'عدد نقاط البيانات التاريخية'
    },
    {
      name: 'timeSpan',
      value: Math.min(timeSpan / 168, 1), // أسبوع كامل = 1
      weight: 0.30,
      description: 'الفترة الزمنية المغطاة'
    },
    {
      name: 'trendConsistency',
      value: trendConsistency,
      weight: 0.30,
      description: 'اتساق الترند'
    }
  ];
  
  const confidence = calculateWeightedConfidence(factors);
  
  return {
    engineName: 'emotionalDynamics',
    confidence,
    factors
  };
}

/**
 * حساب ثقة Engine اكتشاف الأسباب
 */
export function calculateDriverConfidence(
  keywordsExtracted: number,
  causesIdentified: number,
  narrativeClarity: number // 0-1
): EngineConfidence {
  const factors: ConfidenceFactor[] = [
    {
      name: 'keywordsExtracted',
      value: Math.min(keywordsExtracted / 15, 1),
      weight: 0.30,
      description: 'عدد الكلمات المفتاحية المستخرجة'
    },
    {
      name: 'causesIdentified',
      value: Math.min(causesIdentified / 5, 1),
      weight: 0.35,
      description: 'عدد الأسباب المحددة'
    },
    {
      name: 'narrativeClarity',
      value: narrativeClarity,
      weight: 0.35,
      description: 'وضوح السردية'
    }
  ];
  
  const confidence = calculateWeightedConfidence(factors);
  
  return {
    engineName: 'driverDetection',
    confidence,
    factors
  };
}

/**
 * حساب ثقة Engine التفسير
 */
export function calculateInsightConfidence(
  inputConfidence: number, // ثقة الـ Engines السابقة
  explanationLength: number,
  actionableInsights: number
): EngineConfidence {
  const factors: ConfidenceFactor[] = [
    {
      name: 'inputConfidence',
      value: inputConfidence / 100,
      weight: 0.40,
      description: 'ثقة البيانات المدخلة'
    },
    {
      name: 'explanationLength',
      value: Math.min(explanationLength / 200, 1),
      weight: 0.30,
      description: 'شمولية التفسير'
    },
    {
      name: 'actionableInsights',
      value: Math.min(actionableInsights / 5, 1),
      weight: 0.30,
      description: 'عدد الرؤى القابلة للتنفيذ'
    }
  ];
  
  const confidence = calculateWeightedConfidence(factors);
  
  return {
    engineName: 'explainableInsight',
    confidence,
    factors
  };
}

/**
 * حساب الثقة المرجحة من العوامل
 */
function calculateWeightedConfidence(factors: ConfidenceFactor[]): number {
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const factor of factors) {
    weightedSum += factor.value * factor.weight;
    totalWeight += factor.weight;
  }
  
  const confidence = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
  return Math.round(confidence);
}

/**
 * حساب الثقة الإجمالية من جميع الـ Engines
 */
export function calculateOverallConfidence(
  engineConfidences: EngineConfidence[]
): OverallConfidence {
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const ec of engineConfidences) {
    const weight = engineWeights[ec.engineName] || 0.1;
    weightedSum += ec.confidence * weight;
    totalWeight += weight;
  }
  
  const score = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  
  // تحديد المستوى
  let level: OverallConfidence['level'];
  if (score >= 80) level = 'very_high';
  else if (score >= 65) level = 'high';
  else if (score >= 50) level = 'medium';
  else if (score >= 35) level = 'low';
  else level = 'very_low';
  
  // توليد التفسير
  const explanation = generateConfidenceExplanation(score, level, engineConfidences);
  
  return {
    score,
    level,
    engineConfidences,
    explanation
  };
}

/**
 * توليد تفسير الثقة
 */
function generateConfidenceExplanation(
  score: number,
  level: OverallConfidence['level'],
  engineConfidences: EngineConfidence[]
): string {
  const levelDescriptions: Record<OverallConfidence['level'], string> = {
    very_high: 'ثقة عالية جداً في النتائج',
    high: 'ثقة عالية في النتائج',
    medium: 'ثقة متوسطة في النتائج',
    low: 'ثقة منخفضة في النتائج',
    very_low: 'ثقة منخفضة جداً في النتائج'
  };
  
  // إيجاد أضعف Engine
  const weakest = engineConfidences.reduce((min, ec) => 
    ec.confidence < min.confidence ? ec : min
  , engineConfidences[0]);
  
  // إيجاد أقوى Engine
  const strongest = engineConfidences.reduce((max, ec) => 
    ec.confidence > max.confidence ? ec : max
  , engineConfidences[0]);
  
  let explanation = `${levelDescriptions[level]} (${score}%). `;
  
  if (weakest && weakest.confidence < 50) {
    explanation += `نقطة ضعف: ${weakest.engineName} (${weakest.confidence}%). `;
  }
  
  if (strongest && strongest.confidence > 70) {
    explanation += `نقطة قوة: ${strongest.engineName} (${strongest.confidence}%).`;
  }
  
  return explanation;
}

/**
 * تقييم سريع للثقة (للاستخدام البسيط)
 */
export function quickConfidenceScore(
  sourceCount: number,
  textLength: number,
  historicalData: boolean
): number {
  let score = 50; // نقطة البداية
  
  // المصادر
  score += Math.min(sourceCount * 3, 20);
  
  // طول النص
  score += Math.min(textLength / 50, 15);
  
  // البيانات التاريخية
  if (historicalData) score += 15;
  
  return Math.min(Math.round(score), 100);
}
