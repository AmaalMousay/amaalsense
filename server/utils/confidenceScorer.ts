/**
 * Confidence Scorer (Phase 92)
 * 
 * Calculates confidence levels for responses and displays them visually
 * Uses multiple factors: data quality, model certainty, source reliability
 */

export interface ConfidenceScore {
  overall: number; // 0-100
  level: "very_high" | "high" | "medium" | "low" | "very_low";
  icon: "🟢" | "🟡" | "🟠" | "🔴" | "⚫";
  factors: {
    dataQuality: number;
    modelCertainty: number;
    sourceReliability: number;
    contextClarity: number;
  };
  explanation: string;
}

/**
 * Calculate overall confidence score
 */
export function calculateConfidenceScore(
  dataQuality: number = 75,
  modelCertainty: number = 80,
  sourceReliability: number = 70,
  contextClarity: number = 85,
  language: string = "ar"
): ConfidenceScore {
  // Weighted average (all equal weight for now)
  const overall = Math.round(
    (dataQuality * 0.25) +
    (modelCertainty * 0.25) +
    (sourceReliability * 0.25) +
    (contextClarity * 0.25)
  );

  const level = getConfidenceLevel(overall);
  const icon = getConfidenceIcon(level);
  const explanation = getConfidenceExplanation(overall, level, language);

  return {
    overall,
    level,
    icon,
    factors: {
      dataQuality,
      modelCertainty,
      sourceReliability,
      contextClarity
    },
    explanation
  };
}

/**
 * Determine confidence level from score
 */
function getConfidenceLevel(score: number): "very_high" | "high" | "medium" | "low" | "very_low" {
  if (score >= 90) return "very_high";
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  if (score >= 25) return "low";
  return "very_low";
}

/**
 * Get confidence icon
 */
function getConfidenceIcon(level: string): "🟢" | "🟡" | "🟠" | "🔴" | "⚫" {
  switch (level) {
    case "very_high":
      return "🟢";
    case "high":
      return "🟡";
    case "medium":
      return "🟠";
    case "low":
      return "🔴";
    case "very_low":
      return "⚫";
    default:
      return "🟡";
  }
}

/**
 * Get confidence explanation
 */
function getConfidenceExplanation(
  score: number,
  level: string,
  language: string
): string {
  if (language === "ar") {
    const explanations: Record<string, string> = {
      very_high: `الثقة عالية جداً (${score}%) - هذه الإجابة مبنية على بيانات موثوقة وتحليل دقيق`,
      high: `الثقة عالية (${score}%) - هذه الإجابة موثوقة بشكل عام`,
      medium: `الثقة متوسطة (${score}%) - قد تحتاج هذه الإجابة إلى توضيح إضافي`,
      low: `الثقة منخفضة (${score}%) - يُنصح بالحذر من هذه الإجابة`,
      very_low: `الثقة منخفضة جداً (${score}%) - هذه الإجابة قد لا تكون موثوقة`
    };
    return explanations[level] || "";
  } else {
    const explanations: Record<string, string> = {
      very_high: `Very High Confidence (${score}%) - This answer is based on reliable data and accurate analysis`,
      high: `High Confidence (${score}%) - This answer is generally trustworthy`,
      medium: `Medium Confidence (${score}%) - This answer may need additional clarification`,
      low: `Low Confidence (${score}%) - Caution is advised with this answer`,
      very_low: `Very Low Confidence (${score}%) - This answer may not be reliable`
    };
    return explanations[level] || "";
  }
}

/**
 * Calculate data quality score
 * Based on: number of sources, data freshness, source diversity
 */
export function calculateDataQuality(
  sourceCount: number,
  dataAgeHours: number,
  sourceDiversity: number // 0-100
): number {
  // Source count factor (max 30 points)
  const sourceScore = Math.min(sourceCount * 5, 30);

  // Data freshness factor (max 40 points)
  // 0 hours = 40 points, 24 hours = 30 points, 168 hours (1 week) = 10 points
  let freshnessScore = 40;
  if (dataAgeHours > 0) {
    freshnessScore = Math.max(10, 40 - (dataAgeHours / 24) * 3);
  }

  // Source diversity factor (max 30 points)
  const diversityScore = (sourceDiversity / 100) * 30;

  return Math.round(sourceScore + freshnessScore + diversityScore);
}

/**
 * Calculate model certainty score
 * Based on: prediction confidence, agreement between models, entropy
 */
export function calculateModelCertainty(
  predictionConfidence: number, // 0-100
  modelAgreement: number, // 0-100 (how much models agree)
  entropy: number // 0-1 (lower is more certain)
): number {
  // Prediction confidence (40% weight)
  const confidenceScore = predictionConfidence * 0.4;

  // Model agreement (40% weight)
  const agreementScore = modelAgreement * 0.4;

  // Entropy (20% weight, inverted)
  const entropyScore = (1 - entropy) * 100 * 0.2;

  return Math.round(confidenceScore + agreementScore + entropyScore);
}

/**
 * Calculate source reliability score
 * Based on: source type, historical accuracy, fact-checking status
 */
export function calculateSourceReliability(
  sources: Array<{
    type: "news" | "academic" | "social_media" | "government" | "other";
    accuracy: number; // 0-100
    factChecked: boolean;
  }>
): number {
  if (sources.length === 0) return 0;

  const typeWeights: Record<string, number> = {
    government: 0.9,
    academic: 0.85,
    news: 0.7,
    social_media: 0.4,
    other: 0.5
  };

  let totalScore = 0;
  sources.forEach(source => {
    const typeScore = typeWeights[source.type] || 0.5;
    const accuracyScore = source.accuracy / 100;
    const factCheckBonus = source.factChecked ? 0.1 : 0;

    totalScore += (typeScore + accuracyScore + factCheckBonus) / 3;
  });

  return Math.round((totalScore / sources.length) * 100);
}

/**
 * Calculate context clarity score
 * Based on: question clarity, topic specificity, temporal clarity
 */
export function calculateContextClarity(
  questionClarity: number, // 0-100
  topicSpecificity: number, // 0-100
  temporalClarity: number // 0-100
): number {
  return Math.round(
    (questionClarity * 0.4) +
    (topicSpecificity * 0.35) +
    (temporalClarity * 0.25)
  );
}

/**
 * Generate confidence visualization
 */
export function generateConfidenceVisualization(score: ConfidenceScore): string {
  const barLength = Math.round(score.overall / 10);
  const bar = "█".repeat(barLength) + "░".repeat(10 - barLength);

  return `${score.icon} Confidence: [${bar}] ${score.overall}%`;
}

/**
 * Generate detailed confidence report
 */
export function generateConfidenceReport(
  score: ConfidenceScore,
  language: string = "ar"
): string {
  const factors = score.factors;

  if (language === "ar") {
    return `
📊 تقرير الثقة:
${score.icon} الثقة العامة: ${score.overall}% (${getArabicLevel(score.level)})

📈 تفاصيل العوامل:
- جودة البيانات: ${factors.dataQuality}%
- يقين النموذج: ${factors.modelCertainty}%
- موثوقية المصادر: ${factors.sourceReliability}%
- وضوح السياق: ${factors.contextClarity}%

💡 ${score.explanation}
    `;
  } else {
    return `
📊 Confidence Report:
${score.icon} Overall Confidence: ${score.overall}% (${score.level})

📈 Factor Details:
- Data Quality: ${factors.dataQuality}%
- Model Certainty: ${factors.modelCertainty}%
- Source Reliability: ${factors.sourceReliability}%
- Context Clarity: ${factors.contextClarity}%

💡 ${score.explanation}
    `;
  }
}

/**
 * Get Arabic level name
 */
function getArabicLevel(level: string): string {
  const levels: Record<string, string> = {
    very_high: "عالية جداً",
    high: "عالية",
    medium: "متوسطة",
    low: "منخفضة",
    very_low: "منخفضة جداً"
  };
  return levels[level] || "غير محدد";
}

/**
 * Determine if confidence is sufficient for action
 */
export function isConfidenceSufficient(
  score: ConfidenceScore,
  requiredLevel: "very_high" | "high" | "medium" | "low" = "high"
): boolean {
  const levels = ["very_low", "low", "medium", "high", "very_high"];
  const scoreIndex = levels.indexOf(score.level);
  const requiredIndex = levels.indexOf(requiredLevel);

  return scoreIndex >= requiredIndex;
}

/**
 * Get recommendation based on confidence
 */
export function getConfidenceRecommendation(
  score: ConfidenceScore,
  language: string = "ar"
): string {
  if (language === "ar") {
    if (score.overall >= 90) {
      return "✅ يمكنك الاعتماد على هذه الإجابة بثقة";
    } else if (score.overall >= 75) {
      return "👍 هذه الإجابة موثوقة بشكل عام";
    } else if (score.overall >= 50) {
      return "⚠️ يُنصح بالتحقق من مصادر إضافية";
    } else if (score.overall >= 25) {
      return "❌ هذه الإجابة قد لا تكون موثوقة - تجنب الاعتماد عليها";
    } else {
      return "🚫 هذه الإجابة غير موثوقة - لا تعتمد عليها";
    }
  } else {
    if (score.overall >= 90) {
      return "✅ You can rely on this answer with confidence";
    } else if (score.overall >= 75) {
      return "👍 This answer is generally trustworthy";
    } else if (score.overall >= 50) {
      return "⚠️ It's recommended to verify with additional sources";
    } else if (score.overall >= 25) {
      return "❌ This answer may not be reliable - avoid relying on it";
    } else {
      return "🚫 This answer is unreliable - do not rely on it";
    }
  }
}
