/**
 * Cognitive Router
 * 
 * This is NOT a "Source Selector" that searches external sources.
 * This is a "Mind Router" that decides WHICH INTERNAL ENGINE to activate.
 * 
 * Philosophy:
 * - AmalSense doesn't "search the world" - it "interprets the world"
 * - We don't fetch information - we activate cognitive engines
 * - Each engine is a specialized "mind" for a specific type of thinking
 * 
 * Key Difference:
 * - Source Selector: "Where do I search?" → Information Retrieval
 * - Cognitive Router: "How do I think?" → Cognitive Reasoning
 */

import { type DeepQuestion } from './questionUnderstanding';

// Helper function to detect topic domain
function detectTopicDomain(topic: string): string {
  const economicKeywords = ['ذهب', 'فضة', 'دولار', 'نفط', 'سوق', 'استثمار', 'تداول', 'عملة', 'بورصة', 'أسهم'];
  const mediaKeywords = ['إعلام', 'أخبار', 'صحافة', 'تلفزيون', 'سوشيال', 'تويتر', 'فيسبوك'];
  const politicalKeywords = ['سياسة', 'حكومة', 'انتخابات', 'رئيس', 'برلمان', 'حرب', 'صراع'];
  const socialKeywords = ['مجتمع', 'شباب', 'تعليم', 'صحة', 'عمل', 'بطالة'];
  
  if (economicKeywords.some(k => topic.includes(k))) return 'economic';
  if (mediaKeywords.some(k => topic.includes(k))) return 'media';
  if (politicalKeywords.some(k => topic.includes(k))) return 'political';
  if (socialKeywords.some(k => topic.includes(k))) return 'social';
  return 'general';
}

// Helper function to extract entities for comparison
function extractEntities(topic: string): string[] {
  // Look for comparison patterns
  const vsMatch = topic.match(/(.+?)\s*(?:أم|أو|مقابل|vs|ضد)\s*(.+)/i);
  if (vsMatch) {
    return [vsMatch[1].trim(), vsMatch[2].trim()];
  }
  
  // Look for "و" connector
  const andMatch = topic.match(/(.+?)\s*و\s*(.+)/i);
  if (andMatch) {
    return [andMatch[1].trim(), andMatch[2].trim()];
  }
  
  return [topic];
}

// Internal cognitive engines
export type CognitiveEngine = 
  | 'emotion_engine'      // Analyzes emotional states
  | 'trend_engine'        // Analyzes direction and momentum
  | 'economic_engine'     // Analyzes financial/trading context
  | 'media_bias_engine'   // Analyzes media influence
  | 'social_pattern_engine' // Analyzes collective behavior
  | 'decision_engine'     // Analyzes should/shouldn't questions
  | 'comparison_engine'   // Compares multiple options
  | 'scenario_engine'     // Simulates what-if scenarios
  | 'explanation_engine'; // Explains why things happen

// Engine output - what each engine produces
export interface EngineOutput {
  engine: CognitiveEngine;
  insights: string[];
  confidence: number;
  reasoning: string;
  data?: Record<string, any>;
}

// Router decision - which engines to activate
export interface RouterDecision {
  primaryEngine: CognitiveEngine;
  supportingEngines: CognitiveEngine[];
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
}

// Emotion indicators (from existing system)
export interface EmotionIndicators {
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  emotionBreakdown?: Record<string, number>;
  trend?: 'rising' | 'falling' | 'stable';
  confidence?: number;
}

// Combined output from all activated engines
export interface CognitiveOutput {
  decision: RouterDecision;
  outputs: EngineOutput[];
  combinedInsights: string[];
  emotionIndicators: EmotionIndicators;
}

/**
 * Route the question to appropriate cognitive engines
 * This is the "brain's decision center" - it decides HOW to think
 */
export function routeQuestion(question: DeepQuestion): RouterDecision {
  const { surface, deep, context } = question;
  
  // Map question intent to primary engine
  const primaryEngine = selectPrimaryEngine(deep.realIntent, surface.questionType);
  
  // Select supporting engines based on topic and context
  const topicDomain = detectTopicDomain(surface.topic);
  const urgency = deep.urgency; // urgency is in deep, not context
  const supportingEngines = selectSupportingEngines(
    primaryEngine,
    topicDomain,
    urgency
  );
  
  // Build reasoning for transparency
  const reasoning = buildRoutingReasoning(primaryEngine, supportingEngines, deep.realIntent);
  
  return {
    primaryEngine,
    supportingEngines,
    reasoning,
    priority: urgency === 'immediate' ? 'high' : 
              urgency === 'planning' ? 'medium' : 'low'
  };
}

/**
 * Select the primary cognitive engine based on intent
 */
function selectPrimaryEngine(
  realIntent: string,
  questionType: string
): CognitiveEngine {
  // Intent-based routing
  const intentToEngine: Record<string, CognitiveEngine> = {
    'make_decision': 'decision_engine',
    'understand_cause': 'explanation_engine',
    'predict_future': 'scenario_engine',
    'compare_options': 'comparison_engine',
    'assess_risk': 'decision_engine',
    'understand_mood': 'emotion_engine',
    'track_trend': 'trend_engine',
    'analyze_media': 'media_bias_engine',
    'understand_society': 'social_pattern_engine'
  };
  
  // Question type fallback
  const typeToEngine: Record<string, CognitiveEngine> = {
    'should': 'decision_engine',
    'why': 'explanation_engine',
    'what_if': 'scenario_engine',
    'compare': 'comparison_engine',
    'how': 'explanation_engine',
    'when': 'trend_engine',
    'what': 'emotion_engine'
  };
  
  return intentToEngine[realIntent] || typeToEngine[questionType] || 'emotion_engine';
}

/**
 * Select supporting engines based on context
 */
function selectSupportingEngines(
  primaryEngine: CognitiveEngine,
  topicDomain: string,
  urgency: string
): CognitiveEngine[] {
  const supporting: CognitiveEngine[] = [];
  
  // Always include emotion engine for context
  if (primaryEngine !== 'emotion_engine') {
    supporting.push('emotion_engine');
  }
  
  // Economic topics need economic engine
  if (['economic', 'trading', 'financial'].includes(topicDomain)) {
    if (primaryEngine !== 'economic_engine') {
      supporting.push('economic_engine');
    }
    supporting.push('trend_engine');
  }
  
  // Media topics need media bias engine
  if (['media', 'news', 'journalism'].includes(topicDomain)) {
    if (primaryEngine !== 'media_bias_engine') {
      supporting.push('media_bias_engine');
    }
  }
  
  // Decision questions need risk assessment
  if (primaryEngine === 'decision_engine') {
    supporting.push('scenario_engine');
  }
  
  // Urgent questions need trend context
  if (urgency === 'immediate' && primaryEngine !== 'trend_engine') {
    supporting.push('trend_engine');
  }
  
  return Array.from(new Set(supporting)); // Remove duplicates
}

/**
 * Build reasoning explanation for transparency
 */
function buildRoutingReasoning(
  primary: CognitiveEngine,
  supporting: CognitiveEngine[],
  intent: string
): string {
  const engineNames: Record<CognitiveEngine, string> = {
    'emotion_engine': 'محرك المشاعر',
    'trend_engine': 'محرك الاتجاهات',
    'economic_engine': 'المحرك الاقتصادي',
    'media_bias_engine': 'محرك تحليل الإعلام',
    'social_pattern_engine': 'محرك الأنماط الاجتماعية',
    'decision_engine': 'محرك القرارات',
    'comparison_engine': 'محرك المقارنات',
    'scenario_engine': 'محرك السيناريوهات',
    'explanation_engine': 'محرك التفسير'
  };
  
  const primaryName = engineNames[primary];
  const supportingNames = supporting.map(e => engineNames[e]).join('، ');
  
  return `تم تفعيل ${primaryName} كمحرك رئيسي بناءً على نية السؤال (${intent}). ` +
         (supporting.length > 0 ? `المحركات الداعمة: ${supportingNames}.` : '');
}

/**
 * Activate cognitive engines and collect outputs
 */
export async function activateEngines(
  decision: RouterDecision,
  question: DeepQuestion,
  indicators?: EmotionIndicators
): Promise<CognitiveOutput> {
  const outputs: EngineOutput[] = [];
  
  // Default indicators if not provided
  const emotionIndicators: EmotionIndicators = indicators || {
    gmi: 50,
    cfi: 50,
    hri: 50,
    dominantEmotion: 'الترقب',
    trend: 'stable',
    confidence: 0.7
  };
  
  // Activate primary engine
  const primaryOutput = await runEngine(
    decision.primaryEngine,
    question,
    emotionIndicators
  );
  outputs.push(primaryOutput);
  
  // Activate supporting engines
  for (const engine of decision.supportingEngines) {
    const output = await runEngine(engine, question, emotionIndicators);
    outputs.push(output);
  }
  
  // Combine insights from all engines
  const combinedInsights = combineInsights(outputs);
  
  return {
    decision,
    outputs,
    combinedInsights,
    emotionIndicators
  };
}

/**
 * Run a specific cognitive engine
 */
async function runEngine(
  engine: CognitiveEngine,
  question: DeepQuestion,
  indicators: EmotionIndicators
): Promise<EngineOutput> {
  switch (engine) {
    case 'emotion_engine':
      return runEmotionEngine(question, indicators);
    case 'trend_engine':
      return runTrendEngine(question, indicators);
    case 'economic_engine':
      return runEconomicEngine(question, indicators);
    case 'media_bias_engine':
      return runMediaBiasEngine(question, indicators);
    case 'social_pattern_engine':
      return runSocialPatternEngine(question, indicators);
    case 'decision_engine':
      return runDecisionEngine(question, indicators);
    case 'comparison_engine':
      return runComparisonEngine(question, indicators);
    case 'scenario_engine':
      return runScenarioEngine(question, indicators);
    case 'explanation_engine':
      return runExplanationEngine(question, indicators);
    default:
      return runEmotionEngine(question, indicators);
  }
}

// ============================================
// Individual Engine Implementations
// ============================================

function runEmotionEngine(
  question: DeepQuestion,
  indicators: EmotionIndicators
): EngineOutput {
  const { gmi, cfi, hri, dominantEmotion } = indicators;
  const insights: string[] = [];
  
  // Analyze emotional state
  if (cfi > 60) {
    insights.push('مستوى القلق مرتفع - هذا يشير إلى توتر جماعي واضح');
  } else if (cfi < 40) {
    insights.push('مستوى القلق منخفض - هناك هدوء نسبي');
  }
  
  if (hri > 60) {
    insights.push('الأمل مرتفع - المجتمع يحتفظ بنظرة إيجابية رغم التحديات');
  } else if (hri < 40) {
    insights.push('الأمل منخفض - هناك إحباط أو يأس ملحوظ');
  }
  
  if (gmi > 30) {
    insights.push('المزاج العام إيجابي');
  } else if (gmi < -30) {
    insights.push('المزاج العام سلبي');
  } else {
    insights.push('المزاج العام محايد - حالة ترقب وانتظار');
  }
  
  // Combined emotional state
  if (cfi > 60 && hri > 60) {
    insights.push('حالة نفسية معقدة: خوف وأمل معاً - مجتمع يقاوم ولا يستسلم');
  }
  
  return {
    engine: 'emotion_engine',
    insights,
    confidence: indicators.confidence || 0.75,
    reasoning: `تحليل المؤشرات: GMI=${gmi.toFixed(0)}, CFI=${cfi.toFixed(0)}%, HRI=${hri.toFixed(0)}%`,
    data: { gmi, cfi, hri, dominantEmotion }
  };
}

function runTrendEngine(
  question: DeepQuestion,
  indicators: EmotionIndicators
): EngineOutput {
  const { trend, gmi, cfi } = indicators;
  const insights: string[] = [];
  
  if (trend === 'rising') {
    insights.push('الاتجاه تصاعدي - المشاعر تتحسن');
    if (gmi > 0) {
      insights.push('التفاؤل في ازدياد');
    }
  } else if (trend === 'falling') {
    insights.push('الاتجاه تنازلي - المشاعر تتراجع');
    if (cfi > 50) {
      insights.push('القلق في تصاعد');
    }
  } else {
    insights.push('الاتجاه مستقر - لا تغييرات كبيرة');
  }
  
  return {
    engine: 'trend_engine',
    insights,
    confidence: 0.7,
    reasoning: `تحليل الاتجاه: ${trend || 'stable'}`,
    data: { trend }
  };
}

function runEconomicEngine(
  question: DeepQuestion,
  indicators: EmotionIndicators
): EngineOutput {
  const { topic } = question.surface;
  const insights: string[] = [];
  
  // Economic context based on topic
  const economicKeywords = ['ذهب', 'فضة', 'دولار', 'نفط', 'سوق', 'استثمار', 'تداول', 'عملة'];
  const isEconomicTopic = economicKeywords.some(k => topic.includes(k));
  
  if (isEconomicTopic) {
    // Interest rate context
    insights.push('ارتفاع أسعار الفائدة عالمياً يضغط على الأصول');
    
    // Dollar strength
    if (topic.includes('ذهب') || topic.includes('فضة')) {
      insights.push('قوة الدولار الأمريكي تقلل جاذبية المعادن الثمينة');
    }
    
    // Market sentiment
    if (indicators.cfi > 60) {
      insights.push('القلق المرتفع يدفع المستثمرين للحذر');
    }
    
    // Hope indicator for opportunities
    if (indicators.hri > 50) {
      insights.push('وجود أمل يشير إلى توقعات بتحسن قادم');
    }
  }
  
  return {
    engine: 'economic_engine',
    insights,
    confidence: isEconomicTopic ? 0.8 : 0.5,
    reasoning: 'تحليل السياق الاقتصادي والمالي',
    data: { isEconomicTopic }
  };
}

function runMediaBiasEngine(
  question: DeepQuestion,
  indicators: EmotionIndicators
): EngineOutput {
  const insights: string[] = [];
  
  // Media influence analysis
  insights.push('العناوين السلبية تنتشر أسرع بـ 6 مرات من الإيجابية');
  insights.push('الإعلام يميل لتضخيم الأزمات لجذب الانتباه');
  
  if (indicators.cfi > 60) {
    insights.push('ارتفاع الخوف قد يكون مضخماً إعلامياً');
  }
  
  insights.push('التمييز بين الضجيج الإعلامي والإشارة الحقيقية مهم');
  
  return {
    engine: 'media_bias_engine',
    insights,
    confidence: 0.75,
    reasoning: 'تحليل تأثير الإعلام على المشاعر الجماعية'
  };
}

function runSocialPatternEngine(
  question: DeepQuestion,
  indicators: EmotionIndicators
): EngineOutput {
  const insights: string[] = [];
  const { cfi, hri, gmi } = indicators;
  
  // Social pattern analysis
  if (cfi > 60 && hri > 50) {
    insights.push('المجتمع في حالة مقاومة - يواجه الخوف بالأمل');
  } else if (cfi > 60 && hri < 40) {
    insights.push('المجتمع في حالة انكماش - الخوف يسيطر');
  } else if (cfi < 40 && hri > 60) {
    insights.push('المجتمع في حالة تفاؤل - الأمل يقود');
  }
  
  // Collective behavior
  if (gmi > 30) {
    insights.push('السلوك الجماعي يميل للإيجابية والتفاعل');
  } else if (gmi < -30) {
    insights.push('السلوك الجماعي يميل للانسحاب والحذر');
  }
  
  return {
    engine: 'social_pattern_engine',
    insights,
    confidence: 0.7,
    reasoning: 'تحليل الأنماط الاجتماعية والسلوك الجماعي'
  };
}

function runDecisionEngine(
  question: DeepQuestion,
  indicators: EmotionIndicators
): EngineOutput {
  const insights: string[] = [];
  const { cfi, hri, gmi } = indicators;
  
  // Decision recommendation based on indicators
  let recommendation: string;
  let signal: 'positive' | 'negative' | 'neutral' | 'caution';
  
  if (cfi > 70) {
    recommendation = 'تأجيل القرارات الكبيرة - القلق مرتفع جداً';
    signal = 'negative';
  } else if (cfi > 50 && hri > 50) {
    recommendation = 'الحذر مطلوب مع استعداد للفرص';
    signal = 'caution';
  } else if (hri > 60 && cfi < 50) {
    recommendation = 'بيئة مناسبة للقرارات المدروسة';
    signal = 'positive';
  } else {
    recommendation = 'المراقبة والانتظار - الوضع غير واضح';
    signal = 'neutral';
  }
  
  insights.push(recommendation);
  
  // Risk assessment
  if (cfi > 60) {
    insights.push('المخاطر: القلق المرتفع قد يؤدي لقرارات متسرعة');
  }
  if (hri > 60) {
    insights.push('الفرص: الأمل المرتفع يشير لإمكانية تحسن');
  }
  
  return {
    engine: 'decision_engine',
    insights,
    confidence: 0.75,
    reasoning: 'تحليل بيئة القرار بناءً على المؤشرات النفسية',
    data: { recommendation, signal }
  };
}

function runComparisonEngine(
  question: DeepQuestion,
  indicators: EmotionIndicators
): EngineOutput {
  const entities = extractEntities(question.surface.topic);
  const insights: string[] = [];
  
  if (entities.length >= 2) {
    insights.push(`مقارنة بين: ${entities.join(' و ')}`);
    insights.push('كل خيار له مميزات وعيوب تعتمد على السياق');
  }
  
  // Add emotional context to comparison
  if (indicators.cfi > 60) {
    insights.push('في ظل القلق الحالي، الخيار الأكثر أماناً قد يكون الأفضل');
  }
  
  return {
    engine: 'comparison_engine',
    insights,
    confidence: 0.7,
    reasoning: 'مقارنة الخيارات المطروحة'
  };
}

function runScenarioEngine(
  question: DeepQuestion,
  indicators: EmotionIndicators
): EngineOutput {
  const insights: string[] = [];
  const { cfi, hri } = indicators;
  
  // Best case scenario
  insights.push('السيناريو الأفضل: تحسن المؤشرات وعودة الثقة');
  
  // Worst case scenario
  insights.push('السيناريو الأسوأ: تفاقم القلق وانهيار الأمل');
  
  // Most likely scenario
  if (cfi > 50 && hri > 50) {
    insights.push('السيناريو الأرجح: استمرار حالة الترقب مع تقلبات');
  } else if (cfi > 60) {
    insights.push('السيناريو الأرجح: استمرار الضغط النفسي');
  } else if (hri > 60) {
    insights.push('السيناريو الأرجح: تحسن تدريجي');
  }
  
  return {
    engine: 'scenario_engine',
    insights,
    confidence: 0.65,
    reasoning: 'محاكاة السيناريوهات المحتملة'
  };
}

function runExplanationEngine(
  question: DeepQuestion,
  indicators: EmotionIndicators
): EngineOutput {
  const { topic } = question.surface;
  const topicDomain = detectTopicDomain(topic);
  const insights: string[] = [];
  
  // Build explanation based on domain
  if (topicDomain === 'economic') {
    insights.push('الأسباب الاقتصادية: تحركات الفائدة، قوة العملات، العرض والطلب');
    insights.push('الفيدرالي الأمريكي يؤثر على الأسواق العالمية');
    insights.push('قوة الدولار تضغط على السلع المسعرة بالدولار');
  } else if (topicDomain === 'media') {
    insights.push('الإعلام يضخم المشاعر الجماعية');
    insights.push('العناوين المثيرة تنتشر أسرع من المحتوى المتوازن');
    insights.push('غرف الصدى تعزز المشاعر السائدة');
  } else if (topicDomain === 'political') {
    insights.push('الأحداث السياسية تؤثر على الثقة العامة');
    insights.push('عدم اليقين السياسي يرفع القلق الجماعي');
  } else {
    insights.push('المشاعر الجماعية تتأثر بعوامل متعددة');
    insights.push('السياق المحلي والعالمي يشكلان الحالة النفسية');
  }
  
  // Add indicator-based explanation
  if (indicators.cfi > 60) {
    insights.push('ارتفاع القلق ناتج عن تراكم أخبار سلبية وعدم يقين');
  }
  if (indicators.hri > 60) {
    insights.push('الأمل المرتفع يعكس مرونة المجتمع وقدرته على التكيف');
  }
  
  return {
    engine: 'explanation_engine',
    insights,
    confidence: 0.75,
    reasoning: 'تفسير الأسباب والعوامل المؤثرة'
  };
}

/**
 * Combine insights from all engines
 */
function combineInsights(outputs: EngineOutput[]): string[] {
  const allInsights: string[] = [];
  
  // Prioritize by confidence
  const sorted = [...outputs].sort((a, b) => b.confidence - a.confidence);
  
  for (const output of sorted) {
    // Take top 2-3 insights from each engine
    const topInsights = output.insights.slice(0, 3);
    allInsights.push(...topInsights);
  }
  
  // Remove duplicates and limit total
  return Array.from(new Set(allInsights)).slice(0, 8);
}

// All functions are already exported above
