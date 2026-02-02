/**
 * Semantic Understanding Layer
 * تحويل AmalSense من "نظام يرد على الكلمات" إلى "عقل يفهم المعنى"
 * 
 * Understanding = Intent + Context + Reasoning Rules
 * 
 * الطبقات:
 * 1. Intent Extraction (فهم النية)
 * 2. Semantic Framing (إطار المعنى)
 * 3. Context Injection (حقن السياق)
 */

// ==================== TYPES ====================

export type IntentType = 
  | 'decision_support' | 'information' | 'prediction' | 'comparison' 
  | 'recommendation' | 'scenario' | 'explanation' | 'sentiment'
  | 'risk_assessment' | 'opportunity' | 'general';

export type DomainType = 
  | 'finance' | 'crypto' | 'commodities' | 'politics' 
  | 'economy' | 'social' | 'technology' | 'general';

export type TimeHorizon = 'immediate' | 'short_term' | 'medium_term' | 'long_term' | 'unspecified';
export type RiskSensitivity = 'conservative' | 'moderate' | 'aggressive' | 'unknown';
export type DirectionType = 'up' | 'down' | 'stable' | 'volatile' | 'unknown';

export interface SemanticFrame {
  intent: IntentType;
  intentConfidence: number;
  entity: string;
  entityType: 'asset' | 'market' | 'country' | 'event' | 'concept' | 'unknown';
  domain: DomainType;
  direction: DirectionType;
  timeHorizon: TimeHorizon;
  riskSensitivity: RiskSensitivity;
  userNeed: string;
  expectedResponseType: 'verdict' | 'explanation' | 'data' | 'recommendation' | 'scenario';
  keywords: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  urgency: 'high' | 'medium' | 'low';
  originalQuestion: string;
  normalizedQuestion: string;
}

export interface InjectedContext {
  currentIndicators: {
    gmi: number;
    cfi: number;
    hri: number;
    dominantEmotion: string;
    confidence: number;
  };
  trend: {
    direction: 'improving' | 'declining' | 'stable';
    momentum: number;
    volatility: number;
  };
  historicalContext: {
    yesterday: { gmi: number; cfi: number; hri: number } | null;
    lastWeek: { gmi: number; cfi: number; hri: number } | null;
    change24h: number;
    change7d: number;
  };
  reasoningRules: string[];
  preliminaryRecommendation: string;
}

// ==================== INTENT CLASSIFIER ====================

const INTENT_KEYWORDS: Record<IntentType, string[]> = {
  decision_support: [
    'فرصة', 'خطر', 'أشتري', 'أبيع', 'أدخل', 'أخرج', 'استثمر',
    'opportunity', 'risk', 'buy', 'sell', 'invest', 'enter', 'exit',
    'هل الوقت مناسب', 'قرار', 'decision', 'should i'
  ],
  prediction: [
    'سيحدث', 'التوقعات', 'المستقبل', 'غداً', 'الأسبوع القادم', 'تتوقع',
    'predict', 'forecast', 'future', 'tomorrow', 'next week', 'expect', 'will happen'
  ],
  comparison: [
    'مقارنة', 'بالأمس', 'الأسبوع الماضي', 'تغير', 'اختلف',
    'compare', 'yesterday', 'last week', 'changed', 'versus'
  ],
  recommendation: [
    'نصيحة', 'تقترح', 'توصي', 'ماذا تنصح', 'ما رأيك',
    'recommend', 'suggest', 'advise', 'what should'
  ],
  scenario: [
    'ماذا لو', 'لو حدث', 'إذا', 'سيناريو', 'افتراض',
    'what if', 'scenario', 'suppose', 'assume'
  ],
  explanation: [
    'لماذا', 'السبب', 'كيف', 'اشرح', 'فسر',
    'why', 'reason', 'how', 'explain', 'because'
  ],
  sentiment: [
    'شعور', 'مشاعر', 'رأي الناس', 'الجمهور',
    'sentiment', 'feeling', 'opinion', 'people think'
  ],
  risk_assessment: [
    'مخاطر', 'خطورة', 'تحذير', 'حذر',
    'risk', 'danger', 'warning', 'caution'
  ],
  opportunity: [
    'فرص', 'إيجابي', 'مكاسب', 'ربح',
    'opportunity', 'positive', 'gain', 'profit'
  ],
  information: [
    'ما هو', 'ما هي', 'معلومات', 'تفاصيل',
    'what is', 'information', 'details', 'tell me'
  ],
  general: []
};

export function classifyIntent(question: string): { intent: IntentType; confidence: number } {
  const lowerQuestion = question.toLowerCase();
  const scores: Record<IntentType, number> = {
    decision_support: 0, prediction: 0, comparison: 0, recommendation: 0,
    scenario: 0, explanation: 0, sentiment: 0, risk_assessment: 0,
    opportunity: 0, information: 0, general: 0.1
  };
  
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerQuestion.includes(keyword.toLowerCase())) {
        scores[intent as IntentType] += 1;
      }
    }
  }
  
  // Pattern matching
  if (lowerQuestion.startsWith('هل') || lowerQuestion.startsWith('should')) {
    scores.decision_support += 0.5;
  }
  if (lowerQuestion.startsWith('لماذا') || lowerQuestion.startsWith('why')) {
    scores.explanation += 0.5;
  }
  if (lowerQuestion.includes('ماذا لو') || lowerQuestion.includes('what if')) {
    scores.scenario += 1;
  }
  
  let maxIntent: IntentType = 'general';
  let maxScore = 0;
  
  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxIntent = intent as IntentType;
    }
  }
  
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? Math.min(95, (maxScore / totalScore) * 100 + 30) : 50;
  
  return { intent: maxIntent, confidence };
}

// ==================== SEMANTIC PARSER ====================

const DOMAIN_KEYWORDS: Record<DomainType, string[]> = {
  finance: ['سوق', 'أسهم', 'بورصة', 'stock', 'market', 'shares'],
  crypto: ['بيتكوين', 'إيثريوم', 'كريبتو', 'bitcoin', 'ethereum', 'crypto'],
  commodities: ['ذهب', 'فضة', 'نفط', 'gold', 'silver', 'oil', 'metal'],
  politics: ['سياسة', 'حكومة', 'انتخابات', 'politics', 'government'],
  economy: ['اقتصاد', 'تضخم', 'فائدة', 'economy', 'inflation'],
  social: ['مجتمع', 'ناس', 'social', 'people'],
  technology: ['تقنية', 'tech', 'ai', 'ذكاء اصطناعي'],
  general: []
};

const DIRECTION_KEYWORDS: Record<DirectionType, string[]> = {
  up: ['صعود', 'ارتفاع', 'زيادة', 'up', 'rise', 'increase', 'higher'],
  down: ['هبوط', 'انخفاض', 'تراجع', 'down', 'fall', 'decrease', 'drop', 'lower'],
  stable: ['مستقر', 'ثابت', 'stable', 'steady'],
  volatile: ['متقلب', 'volatile', 'unstable'],
  unknown: []
};

function extractEntity(question: string): { entity: string; entityType: SemanticFrame['entityType'] } {
  const lowerQuestion = question.toLowerCase();
  
  const assets: Record<string, string> = {
    'gold': 'gold', 'ذهب': 'gold',
    'silver': 'silver', 'فضة': 'silver',
    'oil': 'oil', 'نفط': 'oil',
    'bitcoin': 'bitcoin', 'بيتكوين': 'bitcoin',
    'dollar': 'dollar', 'دولار': 'dollar',
  };
  
  for (const [keyword, entity] of Object.entries(assets)) {
    if (lowerQuestion.includes(keyword)) {
      return { entity, entityType: 'asset' };
    }
  }
  
  const countries: Record<string, string> = {
    'libya': 'libya', 'ليبيا': 'libya',
    'egypt': 'egypt', 'مصر': 'egypt',
    'saudi': 'saudi arabia', 'السعودية': 'saudi arabia',
    'usa': 'usa', 'أمريكا': 'usa', 'america': 'usa',
  };
  
  for (const [keyword, entity] of Object.entries(countries)) {
    if (lowerQuestion.includes(keyword)) {
      return { entity, entityType: 'country' };
    }
  }
  
  return { entity: 'unknown', entityType: 'unknown' };
}

function detectDomain(question: string): DomainType {
  const lowerQuestion = question.toLowerCase();
  
  // Check commodities first (more specific)
  for (const keyword of DOMAIN_KEYWORDS.commodities) {
    if (lowerQuestion.includes(keyword.toLowerCase())) {
      return 'commodities';
    }
  }
  
  // Then check other domains
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    if (domain === 'commodities') continue;
    for (const keyword of keywords) {
      if (lowerQuestion.includes(keyword.toLowerCase())) {
        return domain as DomainType;
      }
    }
  }
  return 'general';
}

function detectDirection(question: string): DirectionType {
  const lowerQuestion = question.toLowerCase();
  for (const [direction, keywords] of Object.entries(DIRECTION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerQuestion.includes(keyword.toLowerCase())) {
        return direction as DirectionType;
      }
    }
  }
  return 'unknown';
}

function detectTimeHorizon(question: string): TimeHorizon {
  const lowerQuestion = question.toLowerCase();
  
  if (['الآن', 'حالياً', 'now', 'currently', 'today', 'اليوم'].some(k => lowerQuestion.includes(k))) {
    return 'immediate';
  }
  if (['غداً', 'tomorrow', 'هذا الأسبوع', 'this week'].some(k => lowerQuestion.includes(k))) {
    return 'short_term';
  }
  if (['الأسبوع القادم', 'next week', 'الشهر', 'month'].some(k => lowerQuestion.includes(k))) {
    return 'medium_term';
  }
  if (['السنة', 'year', 'long term'].some(k => lowerQuestion.includes(k))) {
    return 'long_term';
  }
  return 'unspecified';
}

function determineExpectedResponseType(intent: IntentType): SemanticFrame['expectedResponseType'] {
  switch (intent) {
    case 'decision_support':
    case 'recommendation':
      return 'verdict';
    case 'explanation':
    case 'information':
      return 'explanation';
    case 'prediction':
    case 'comparison':
      return 'data';
    case 'scenario':
      return 'scenario';
    default:
      return 'explanation';
  }
}

function determineUserNeed(intent: IntentType, entity: string): string {
  switch (intent) {
    case 'decision_support':
      return `يحتاج قرار واضح بخصوص ${entity}`;
    case 'prediction':
      return `يريد معرفة توقعات ${entity}`;
    case 'comparison':
      return `يريد مقارنة ${entity} مع فترات سابقة`;
    case 'recommendation':
      return `يطلب نصيحة بخصوص ${entity}`;
    case 'scenario':
      return `يريد استكشاف سيناريوهات ${entity}`;
    case 'explanation':
      return `يريد فهم سبب حالة ${entity}`;
    default:
      return `يريد معلومات عن ${entity}`;
  }
}

function extractKeywords(question: string): string[] {
  const stopWords = ['هل', 'ما', 'ماذا', 'كيف', 'لماذا', 'في', 'على', 'إلى',
    'is', 'what', 'how', 'why', 'the', 'a', 'an', 'in', 'on', 'to'];
  
  const words = question.toLowerCase().split(/\s+/);
  return words.filter(word => 
    word.length > 2 && 
    !stopWords.includes(word) &&
    !/^[؟?!.,;:]+$/.test(word)
  );
}

export function parseQuestion(question: string): SemanticFrame {
  const { intent, confidence: intentConfidence } = classifyIntent(question);
  const { entity, entityType } = extractEntity(question);
  const domain = detectDomain(question);
  const direction = detectDirection(question);
  const timeHorizon = detectTimeHorizon(question);
  const expectedResponseType = determineExpectedResponseType(intent);
  const userNeed = determineUserNeed(intent, entity);
  const keywords = extractKeywords(question);
  
  // Sentiment detection
  const positiveWords = ['فرصة', 'ربح', 'opportunity', 'profit', 'gain'];
  const negativeWords = ['خطر', 'خسارة', 'risk', 'loss', 'danger'];
  
  const hasPositive = positiveWords.some(w => question.toLowerCase().includes(w));
  const hasNegative = negativeWords.some(w => question.toLowerCase().includes(w));
  
  let sentiment: SemanticFrame['sentiment'] = 'neutral';
  if (hasPositive && hasNegative) sentiment = 'mixed';
  else if (hasPositive) sentiment = 'positive';
  else if (hasNegative) sentiment = 'negative';
  
  // Urgency detection
  const urgencyWords = ['الآن', 'فوراً', 'عاجل', 'now', 'immediately', 'urgent'];
  const urgency = urgencyWords.some(w => question.toLowerCase().includes(w)) ? 'high' : 'medium';
  
  return {
    intent, intentConfidence, entity, entityType, domain, direction,
    timeHorizon, riskSensitivity: 'unknown', userNeed, expectedResponseType,
    keywords, sentiment, urgency, originalQuestion: question,
    normalizedQuestion: question.trim().toLowerCase()
  };
}

// ==================== CONTEXT BUILDER ====================

export function buildContext(
  semanticFrame: SemanticFrame,
  indicators: { gmi: number; cfi: number; hri: number; dominantEmotion: string; confidence: number }
): InjectedContext {
  // Trend direction
  let trendDirection: InjectedContext['trend']['direction'] = 'stable';
  if (indicators.hri > 60 && indicators.cfi < 50) {
    trendDirection = 'improving';
  } else if (indicators.cfi > 70 || indicators.gmi < -30) {
    trendDirection = 'declining';
  }
  
  const momentum = (indicators.hri - indicators.cfi) / 100;
  const volatility = Math.abs(indicators.gmi) > 50 || indicators.cfi > 70 ? 0.8 : 0.4;
  
  // Historical context (simulated)
  const yesterdayGmi = indicators.gmi + (Math.random() * 20 - 10);
  const lastWeekGmi = indicators.gmi + (Math.random() * 40 - 20);
  
  // Reasoning rules
  const reasoningRules = buildReasoningRules(semanticFrame, indicators);
  const preliminaryRecommendation = generatePreliminaryRecommendation(semanticFrame, indicators);
  
  return {
    currentIndicators: indicators,
    trend: { direction: trendDirection, momentum, volatility },
    historicalContext: {
      yesterday: { gmi: yesterdayGmi, cfi: indicators.cfi - 5, hri: indicators.hri + 3 },
      lastWeek: { gmi: lastWeekGmi, cfi: indicators.cfi + 10, hri: indicators.hri - 5 },
      change24h: indicators.gmi - yesterdayGmi,
      change7d: indicators.gmi - lastWeekGmi
    },
    reasoningRules,
    preliminaryRecommendation
  };
}

function buildReasoningRules(
  frame: SemanticFrame,
  indicators: { gmi: number; cfi: number; hri: number }
): string[] {
  const rules: string[] = [];
  
  if (indicators.cfi > 70) {
    rules.push('الخوف الجماعي مرتفع جداً - يجب الحذر في القرارات');
  }
  if (indicators.hri > 70) {
    rules.push('الأمل الجماعي قوي - هناك توقعات إيجابية');
  }
  if (Math.abs(indicators.gmi) < 20) {
    rules.push('المزاج العام محايد - لا يوجد إجماع واضح');
  }
  
  if (frame.intent === 'decision_support') {
    if (indicators.cfi > 60 && indicators.hri > 60) {
      rules.push('حالة انقسام: الخوف والأمل مرتفعان معاً - المراقبة أفضل من التحرك');
    }
    if (indicators.gmi > 30 && indicators.cfi < 40) {
      rules.push('ظروف مواتية: مزاج إيجابي مع خوف منخفض - يمكن التحرك بحذر');
    }
  }
  
  return rules;
}

function generatePreliminaryRecommendation(
  frame: SemanticFrame,
  indicators: { gmi: number; cfi: number; hri: number }
): string {
  if (frame.intent === 'decision_support') {
    if (indicators.cfi > 70) {
      return 'الانتظار والمراقبة - الخوف مرتفع جداً';
    }
    if (indicators.gmi > 40 && indicators.cfi < 40 && indicators.hri > 50) {
      return 'الظروف مواتية للتحرك التدريجي';
    }
    if (indicators.cfi > 60 && indicators.hri > 60) {
      return 'حالة ترقب - المراقبة أو الدخول التدريجي فقط';
    }
    return 'تقييم الوضع يتطلب مزيداً من المعلومات';
  }
  
  if (frame.intent === 'prediction') {
    if (indicators.hri > indicators.cfi) {
      return 'الاتجاه العام يميل للتحسن';
    }
    if (indicators.cfi > indicators.hri) {
      return 'الاتجاه العام يميل للحذر';
    }
    return 'الاتجاه غير واضح - يعتمد على التطورات';
  }
  
  return '';
}

export default {
  classifyIntent,
  parseQuestion,
  buildContext
};
