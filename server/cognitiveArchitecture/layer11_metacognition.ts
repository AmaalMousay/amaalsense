/**
 * Layer 11: Metacognition (Self-Awareness)
 * 
 * In Human Brain: Thinking about thinking, self-evaluation, confidence assessment
 * In AmalSense: Evaluates quality of analysis, confidence levels, identifies biases
 * 
 * This is the "consciousness" layer - the system that watches the system
 */

// ============================================
// TYPES
// ============================================

export interface MetacognitiveAssessment {
  // Overall confidence in the response
  overallConfidence: number;  // 0-1
  confidenceLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  
  // Data quality assessment
  dataQuality: DataQualityAssessment;
  
  // Reasoning quality assessment
  reasoningQuality: ReasoningQualityAssessment;
  
  // Potential biases detected
  biases: DetectedBias[];
  
  // Limitations of this analysis
  limitations: string[];
  
  // Suggestions for improvement
  suggestions: string[];
  
  // Should we ask for more information?
  needsMoreInfo: boolean;
  infoNeeded?: string[];
  
  // Self-critique
  selfCritique: string;
}

export interface DataQualityAssessment {
  score: number;  // 0-1
  factors: {
    recency: number;      // How recent is the data?
    completeness: number; // Do we have all needed data?
    reliability: number;  // How reliable are the sources?
    relevance: number;    // How relevant to the question?
  };
  issues: string[];
}

export interface ReasoningQualityAssessment {
  score: number;  // 0-1
  factors: {
    logicalCoherence: number;   // Is the reasoning logical?
    evidenceSupport: number;    // Is it supported by evidence?
    alternativesConsidered: number; // Did we consider alternatives?
    uncertaintyAcknowledged: number; // Did we acknowledge uncertainty?
  };
  issues: string[];
}

export interface DetectedBias {
  type: BiasType;
  description: string;
  severity: 'low' | 'medium' | 'high';
  mitigation?: string;
}

export type BiasType = 
  | 'recency_bias'           // Over-weighting recent events
  | 'confirmation_bias'      // Seeking confirming evidence
  | 'availability_bias'      // Over-weighting easily recalled info
  | 'anchoring_bias'         // Over-relying on first piece of info
  | 'optimism_bias'          // Underestimating risks
  | 'pessimism_bias'         // Overestimating risks
  | 'herd_mentality'         // Following the crowd
  | 'authority_bias'         // Over-trusting authority sources
  | 'data_insufficiency'     // Not enough data to conclude
  | 'oversimplification';    // Making complex things too simple

// ============================================
// MAIN METACOGNITION FUNCTION
// ============================================

/**
 * Perform metacognitive assessment of an analysis
 */
export function assessAnalysis(context: {
  question: string;
  topic: string;
  indicators: { gmi?: number; cfi?: number; hri?: number };
  sourcesUsed: string[];
  enginesActivated: string[];
  causalChainsUsed: number;
  knowledgeItemsUsed: number;
  responseLength: number;
  hasDecisionSignal: boolean;
  hasRecommendation: boolean;
}): MetacognitiveAssessment {
  
  // Assess data quality
  const dataQuality = assessDataQuality(context);
  
  // Assess reasoning quality
  const reasoningQuality = assessReasoningQuality(context);
  
  // Detect biases
  const biases = detectBiases(context);
  
  // Identify limitations
  const limitations = identifyLimitations(context);
  
  // Generate suggestions
  const suggestions = generateSuggestions(context, dataQuality, reasoningQuality);
  
  // Calculate overall confidence
  const overallConfidence = calculateOverallConfidence(
    dataQuality.score,
    reasoningQuality.score,
    biases.length
  );
  
  // Determine confidence level
  const confidenceLevel = getConfidenceLevel(overallConfidence);
  
  // Check if more info needed
  const { needsMoreInfo, infoNeeded } = checkInfoNeeds(context, dataQuality);
  
  // Generate self-critique
  const selfCritique = generateSelfCritique(
    overallConfidence,
    biases,
    limitations,
    context
  );
  
  return {
    overallConfidence,
    confidenceLevel,
    dataQuality,
    reasoningQuality,
    biases,
    limitations,
    suggestions,
    needsMoreInfo,
    infoNeeded,
    selfCritique
  };
}

// ============================================
// ASSESSMENT FUNCTIONS
// ============================================

function assessDataQuality(context: {
  indicators: { gmi?: number; cfi?: number; hri?: number };
  sourcesUsed: string[];
  knowledgeItemsUsed: number;
}): DataQualityAssessment {
  const issues: string[] = [];
  
  // Recency - do we have current data?
  let recency = 0.7; // Default assumption
  if (context.indicators.gmi !== undefined) {
    recency = 0.9; // We have live indicators
  }
  
  // Completeness - do we have all indicators?
  let completeness = 0;
  if (context.indicators.gmi !== undefined) completeness += 0.33;
  if (context.indicators.cfi !== undefined) completeness += 0.33;
  if (context.indicators.hri !== undefined) completeness += 0.34;
  
  if (completeness < 0.5) {
    issues.push('بعض المؤشرات الأساسية غير متوفرة');
  }
  
  // Reliability - based on sources
  let reliability = 0.6; // Base reliability
  if (context.sourcesUsed.length > 0) {
    reliability = Math.min(0.9, 0.6 + context.sourcesUsed.length * 0.1);
  }
  
  // Relevance - based on knowledge items used
  let relevance = Math.min(1, context.knowledgeItemsUsed / 5);
  if (context.knowledgeItemsUsed === 0) {
    issues.push('لم يتم استخدام معرفة محددة للموضوع');
    relevance = 0.3;
  }
  
  const score = (recency + completeness + reliability + relevance) / 4;
  
  return {
    score,
    factors: { recency, completeness, reliability, relevance },
    issues
  };
}

function assessReasoningQuality(context: {
  enginesActivated: string[];
  causalChainsUsed: number;
  hasDecisionSignal: boolean;
  hasRecommendation: boolean;
  responseLength: number;
}): ReasoningQualityAssessment {
  const issues: string[] = [];
  
  // Logical coherence - based on engines used
  let logicalCoherence = Math.min(1, context.enginesActivated.length / 4);
  if (context.enginesActivated.length < 2) {
    issues.push('تحليل سطحي - محركات قليلة مفعّلة');
  }
  
  // Evidence support - based on causal chains
  let evidenceSupport = Math.min(1, context.causalChainsUsed / 3);
  if (context.causalChainsUsed === 0) {
    issues.push('لا توجد سلاسل سببية تدعم الاستنتاج');
    evidenceSupport = 0.2;
  }
  
  // Alternatives considered - check for scenario engine
  let alternativesConsidered = 0.5;
  if (context.enginesActivated.includes('scenario_engine')) {
    alternativesConsidered = 0.9;
  }
  
  // Uncertainty acknowledged - based on response completeness
  let uncertaintyAcknowledged = 0.5;
  if (context.hasDecisionSignal && context.hasRecommendation) {
    uncertaintyAcknowledged = 0.8;
  }
  
  const score = (logicalCoherence + evidenceSupport + alternativesConsidered + uncertaintyAcknowledged) / 4;
  
  return {
    score,
    factors: { logicalCoherence, evidenceSupport, alternativesConsidered, uncertaintyAcknowledged },
    issues
  };
}

function detectBiases(context: {
  question: string;
  indicators: { gmi?: number; cfi?: number; hri?: number };
  sourcesUsed: string[];
}): DetectedBias[] {
  const biases: DetectedBias[] = [];
  
  // Check for data insufficiency
  if (context.sourcesUsed.length < 2) {
    biases.push({
      type: 'data_insufficiency',
      description: 'الاعتماد على مصادر محدودة قد يؤدي لرؤية غير مكتملة',
      severity: 'medium',
      mitigation: 'البحث عن مصادر إضافية للتحقق'
    });
  }
  
  // Check for recency bias
  if (context.question.includes('الآن') || context.question.includes('اليوم')) {
    biases.push({
      type: 'recency_bias',
      description: 'التركيز على الأحداث الأخيرة قد يتجاهل الأنماط طويلة المدى',
      severity: 'low',
      mitigation: 'مراجعة السياق التاريخي'
    });
  }
  
  // Check for extreme indicators (might indicate herd mentality in data)
  if (context.indicators.cfi && context.indicators.cfi > 80) {
    biases.push({
      type: 'herd_mentality',
      description: 'مؤشر الخوف مرتفع جداً - قد يعكس ذعر جماعي مبالغ فيه',
      severity: 'medium',
      mitigation: 'التحقق من الأسباب الحقيقية وراء الخوف'
    });
  }
  
  if (context.indicators.hri && context.indicators.hri > 80) {
    biases.push({
      type: 'optimism_bias',
      description: 'مؤشر الأمل مرتفع جداً - قد يعكس تفاؤل مفرط',
      severity: 'medium',
      mitigation: 'مراجعة المخاطر المحتملة'
    });
  }
  
  return biases;
}

function identifyLimitations(context: {
  topic: string;
  indicators: { gmi?: number; cfi?: number; hri?: number };
  knowledgeItemsUsed: number;
}): string[] {
  const limitations: string[] = [];
  
  // General limitations
  limitations.push('التحليل يعتمد على البيانات المتاحة وقت الاستعلام');
  
  // Missing indicators
  if (context.indicators.gmi === undefined) {
    limitations.push('مؤشر المزاج العام غير متوفر');
  }
  if (context.indicators.cfi === undefined) {
    limitations.push('مؤشر الخوف الجماعي غير متوفر');
  }
  if (context.indicators.hri === undefined) {
    limitations.push('مؤشر الأمل غير متوفر');
  }
  
  // Knowledge limitations
  if (context.knowledgeItemsUsed < 3) {
    limitations.push('المعرفة المتوفرة عن هذا الموضوع محدودة');
  }
  
  // Prediction limitations
  limitations.push('التوقعات المستقبلية تحمل درجة من عدم اليقين');
  
  return limitations;
}

function generateSuggestions(
  context: { question: string; topic: string },
  dataQuality: DataQualityAssessment,
  reasoningQuality: ReasoningQualityAssessment
): string[] {
  const suggestions: string[] = [];
  
  if (dataQuality.score < 0.6) {
    suggestions.push('يُنصح بالبحث عن مصادر إضافية للتحقق');
  }
  
  if (reasoningQuality.score < 0.6) {
    suggestions.push('يُنصح بتحليل أعمق للعوامل المؤثرة');
  }
  
  if (dataQuality.factors.recency < 0.7) {
    suggestions.push('التحقق من أحدث التطورات قبل اتخاذ قرار');
  }
  
  return suggestions;
}

function calculateOverallConfidence(
  dataQuality: number,
  reasoningQuality: number,
  biasCount: number
): number {
  // Base confidence from data and reasoning
  let confidence = (dataQuality * 0.4 + reasoningQuality * 0.4);
  
  // Penalty for biases
  const biasPenalty = Math.min(0.3, biasCount * 0.1);
  confidence -= biasPenalty;
  
  // Add base confidence
  confidence += 0.2;
  
  return Math.max(0.1, Math.min(1, confidence));
}

function getConfidenceLevel(confidence: number): 'very_low' | 'low' | 'medium' | 'high' | 'very_high' {
  if (confidence < 0.3) return 'very_low';
  if (confidence < 0.5) return 'low';
  if (confidence < 0.7) return 'medium';
  if (confidence < 0.85) return 'high';
  return 'very_high';
}

function checkInfoNeeds(
  context: { question: string; topic: string },
  dataQuality: DataQualityAssessment
): { needsMoreInfo: boolean; infoNeeded?: string[] } {
  const infoNeeded: string[] = [];
  
  if (dataQuality.factors.completeness < 0.5) {
    infoNeeded.push('مؤشرات إضافية عن الموضوع');
  }
  
  if (dataQuality.factors.relevance < 0.5) {
    infoNeeded.push('معلومات أكثر تحديداً عن السياق');
  }
  
  // Check if question is too vague
  if (context.question.length < 20) {
    infoNeeded.push('تفاصيل أكثر عن السؤال');
  }
  
  return {
    needsMoreInfo: infoNeeded.length > 0,
    infoNeeded: infoNeeded.length > 0 ? infoNeeded : undefined
  };
}

function generateSelfCritique(
  confidence: number,
  biases: DetectedBias[],
  limitations: string[],
  context: { question: string; topic: string }
): string {
  const parts: string[] = [];
  
  // Confidence statement
  if (confidence < 0.5) {
    parts.push('هذا التحليل يحمل درجة عالية من عدم اليقين');
  } else if (confidence < 0.7) {
    parts.push('هذا التحليل معقول لكنه يحتاج تحقق إضافي');
  } else {
    parts.push('هذا التحليل مدعوم بشكل جيد بالبيانات المتاحة');
  }
  
  // Bias acknowledgment
  if (biases.length > 0) {
    const highSeverity = biases.filter(b => b.severity === 'high');
    if (highSeverity.length > 0) {
      parts.push(`تحذير: ${highSeverity[0].description}`);
    }
  }
  
  // Key limitation
  if (limitations.length > 2) {
    parts.push('ملاحظة: هناك عدة قيود على هذا التحليل');
  }
  
  return parts.join('. ');
}

// ============================================
// CONFIDENCE DISPLAY HELPERS
// ============================================

/**
 * Get confidence indicator for display
 */
export function getConfidenceIndicator(assessment: MetacognitiveAssessment): {
  emoji: string;
  label: string;
  color: string;
} {
  switch (assessment.confidenceLevel) {
    case 'very_high':
      return { emoji: '🟢', label: 'ثقة عالية جداً', color: 'green' };
    case 'high':
      return { emoji: '🟢', label: 'ثقة عالية', color: 'green' };
    case 'medium':
      return { emoji: '🟡', label: 'ثقة متوسطة', color: 'yellow' };
    case 'low':
      return { emoji: '🟠', label: 'ثقة منخفضة', color: 'orange' };
    case 'very_low':
      return { emoji: '🔴', label: 'ثقة منخفضة جداً', color: 'red' };
  }
}

/**
 * Format assessment for display
 */
export function formatAssessmentForDisplay(assessment: MetacognitiveAssessment): string {
  const indicator = getConfidenceIndicator(assessment);
  const parts: string[] = [];
  
  parts.push(`${indicator.emoji} ${indicator.label} (${Math.round(assessment.overallConfidence * 100)}%)`);
  
  if (assessment.biases.length > 0) {
    parts.push(`\n⚠️ تنبيهات: ${assessment.biases.map(b => b.description).join('، ')}`);
  }
  
  if (assessment.selfCritique) {
    parts.push(`\n💭 ${assessment.selfCritique}`);
  }
  
  return parts.join('');
}

/**
 * Should we show confidence to user?
 */
export function shouldShowConfidence(assessment: MetacognitiveAssessment): boolean {
  // Always show if confidence is low or there are significant biases
  if (assessment.confidenceLevel === 'low' || assessment.confidenceLevel === 'very_low') {
    return true;
  }
  
  if (assessment.biases.some(b => b.severity === 'high')) {
    return true;
  }
  
  // Show for medium confidence
  if (assessment.confidenceLevel === 'medium') {
    return true;
  }
  
  return false;
}
