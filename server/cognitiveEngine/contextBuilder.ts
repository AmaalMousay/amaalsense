/**
 * Context Builder
 * 
 * This layer takes raw data from sources and builds a "knowledge packet"
 * that the Intelligent Narrator can use to construct a response.
 * 
 * Philosophy:
 * - Raw data is noise, context is signal
 * - Connect dots between different data points
 * - Build causal chains: "Because X happened, Y is the result"
 * - Filter irrelevant information
 */

import { type DeepQuestion } from './questionUnderstanding';
import { type CognitiveOutput, type EmotionIndicators, type EngineOutput } from './cognitiveRouter';

// Legacy types for backward compatibility
interface NewsPacket {
  headlines: Array<{ title: string; relevance: number; sentiment: string }>;
}

interface ExpertKnowledgePacket {
  insights: Array<{ insight: string; source: string; confidence: number }>;
  riskFactors: string[];
  opportunities: string[];
}

// Source data can come from either old system or new Cognitive Router
interface SourceData {
  emotionIndicators?: EmotionIndicators;
  news?: NewsPacket;
  expertKnowledge?: ExpertKnowledgePacket;
  economicData?: any;
  scenarioModels?: any;
  comparisonData?: any;
}

// The knowledge packet that will be used to generate the response
export interface KnowledgePacket {
  // Core understanding
  core: {
    topic: string;
    questionType: string;
    realIntent: string;
    emotionalNeed: string;
  };
  
  // The current state
  currentState: {
    summary: string;           // One sentence summary
    moodDescription: string;   // Human description of mood
    trend: string;             // What's happening
    confidence: number;        // How confident we are
  };
  
  // Causal analysis
  causes: {
    primary: CausalChain[];    // Main causes
    secondary: CausalChain[];  // Contributing factors
    summary: string;           // "This is happening because..."
  };
  
  // Implications
  implications: {
    shortTerm: string[];       // What this means now
    longTerm: string[];        // What this might mean later
    forUser: string;           // What this means for the user specifically
  };
  
  // Decision support
  decision: {
    signal: 'positive' | 'negative' | 'neutral' | 'caution';
    recommendation: string;
    reasoning: string;
    risks: string[];
    opportunities: string[];
  };
  
  // Scenarios (if applicable)
  scenarios?: {
    best: ScenarioSummary;
    worst: ScenarioSummary;
    likely: ScenarioSummary;
  };
  
  // Comparison (if applicable)
  comparison?: {
    items: string[];
    winner?: string;
    reasoning: string;
  };
  
  // Follow-up
  followUp: {
    implicitAnswers: string[];  // Answers to unasked questions
    suggestedQuestions: string[]; // Smart follow-up questions
  };
}

interface CausalChain {
  cause: string;           // What happened
  effect: string;          // What it caused
  explanation: string;     // Why this connection exists
  confidence: number;      // How confident we are
}

interface ScenarioSummary {
  name: string;
  probability: number;
  description: string;
  triggers: string[];
}

/**
 * Build knowledge packet from question understanding and source data
 */
export function buildKnowledgePacket(
  question: DeepQuestion,
  sourceData: SourceData
): KnowledgePacket {
  const { surface, deep } = question;
  
  // Build core understanding
  const core = {
    topic: surface.topic,
    questionType: surface.questionType,
    realIntent: deep.realIntent,
    emotionalNeed: deep.emotionalNeed
  };
  
  // Build current state description
  const currentState = buildCurrentState(surface.topic, sourceData.emotionIndicators);
  
  // Build causal analysis
  const causes = buildCausalAnalysis(surface.topic, sourceData, deep.realIntent);
  
  // Build implications
  const implications = buildImplications(surface.topic, currentState, causes, deep.realIntent);
  
  // Build decision support
  const decision = buildDecisionSupport(
    sourceData.emotionIndicators,
    sourceData.expertKnowledge,
    deep.realIntent
  );
  
  // Build scenarios if needed
  const scenarios = sourceData.scenarioModels ? buildScenarioSummary(sourceData.scenarioModels) : undefined;
  
  // Build comparison if needed
  const comparison = sourceData.comparisonData?.items.length 
    ? buildComparisonSummary(sourceData.comparisonData)
    : undefined;
  
  // Build follow-up
  const followUp = buildFollowUp(deep.implicitQuestions, surface.topic, currentState);
  
  return {
    core,
    currentState,
    causes,
    implications,
    decision,
    scenarios,
    comparison,
    followUp
  };
}

/**
 * Build current state description
 */
function buildCurrentState(
  topic: string,
  indicators?: EmotionIndicators
): KnowledgePacket['currentState'] {
  const gmi = indicators?.gmi || 50;
  const cfi = indicators?.cfi || 50;
  const hri = indicators?.hri || 50;
  
  // Generate mood description
  let moodDescription: string;
  let summary: string;
  let trend: string;
  
  if (cfi > 65) {
    moodDescription = 'حالة قلق وتوتر واضحة';
    summary = `المزاج العام تجاه ${topic} يميل للسلبية مع مستويات خوف مرتفعة`;
    trend = 'الاتجاه سلبي مع ترقب حذر';
  } else if (hri > 65) {
    moodDescription = 'حالة تفاؤل وأمل';
    summary = `المزاج العام تجاه ${topic} إيجابي مع مستويات أمل مرتفعة`;
    trend = 'الاتجاه إيجابي مع تفاؤل حذر';
  } else if (cfi > 55 && hri > 55) {
    moodDescription = 'حالة مقاومة - خوف وأمل معاً';
    summary = `المزاج العام تجاه ${topic} معقد - خوف وأمل في آن واحد`;
    trend = 'حالة ترقب مع مقاومة نفسية';
  } else {
    moodDescription = 'حالة حياد وترقب';
    summary = `المزاج العام تجاه ${topic} محايد نسبياً`;
    trend = 'استقرار مع ترقب للتطورات';
  }
  
  return {
    summary,
    moodDescription,
    trend,
    confidence: indicators?.confidence || 0.7
  };
}

/**
 * Build causal analysis - connect causes to effects
 */
function buildCausalAnalysis(
  topic: string,
  sourceData: SourceData,
  realIntent: string
): KnowledgePacket['causes'] {
  const primary: CausalChain[] = [];
  const secondary: CausalChain[] = [];
  
  // Extract causes from news
  if (sourceData.news) {
    for (const headline of sourceData.news.headlines) {
      if (headline.relevance > 0.8) {
        primary.push({
          cause: headline.title,
          effect: headline.sentiment === 'negative' ? 'ضغط سلبي على المشاعر' : 
                  headline.sentiment === 'positive' ? 'دعم إيجابي للمشاعر' : 'تأثير محدود',
          explanation: `هذا الخبر يؤثر على ${topic} لأنه يغير توقعات المستثمرين والمتابعين`,
          confidence: headline.relevance
        });
      } else {
        secondary.push({
          cause: headline.title,
          effect: 'تأثير ثانوي',
          explanation: 'عامل مساهم لكن ليس رئيسي',
          confidence: headline.relevance
        });
      }
    }
  }
  
  // Add expert knowledge causes
  if (sourceData.expertKnowledge) {
    for (const insight of sourceData.expertKnowledge.insights) {
      if (insight.confidence > 0.8) {
        primary.push({
          cause: insight.insight,
          effect: 'تأثير على القرارات والتوقعات',
          explanation: `معرفة خبراء: ${insight.source}`,
          confidence: insight.confidence
        });
      }
    }
  }
  
  // Add economic causes if relevant
  if (sourceData.economicData) {
    const commodities = sourceData.economicData.commodities;
    for (const commodity of commodities) {
      if (Math.abs(commodity.change) > 1) {
        secondary.push({
          cause: `${commodity.name} ${commodity.change > 0 ? 'ارتفع' : 'انخفض'} بنسبة ${Math.abs(commodity.change).toFixed(1)}%`,
          effect: commodity.change > 0 ? 'ضغط صعودي' : 'ضغط هبوطي',
          explanation: 'تحركات السوق تؤثر على المشاعر الجماعية',
          confidence: 0.85
        });
      }
    }
  }
  
  // Build summary
  const summary = primary.length > 0
    ? `هذا الوضع ناتج بشكل رئيسي عن: ${primary.slice(0, 2).map(c => c.cause).join('، ')}`
    : 'الوضع الحالي نتيجة تفاعل عوامل متعددة';
  
  return { primary, secondary, summary };
}

/**
 * Build implications - what does this mean?
 */
function buildImplications(
  topic: string,
  currentState: KnowledgePacket['currentState'],
  causes: KnowledgePacket['causes'],
  realIntent: string
): KnowledgePacket['implications'] {
  const shortTerm: string[] = [];
  const longTerm: string[] = [];
  let forUser: string;
  
  // Short term implications
  if (currentState.moodDescription.includes('قلق')) {
    shortTerm.push('توقع استمرار التقلبات على المدى القصير');
    shortTerm.push('قرارات متسرعة قد تكون مكلفة');
  } else if (currentState.moodDescription.includes('تفاؤل')) {
    shortTerm.push('فرص محتملة للمتحركين مبكراً');
    shortTerm.push('الحذر من الإفراط في التفاؤل');
  } else {
    shortTerm.push('فترة مناسبة للمراقبة والتخطيط');
    shortTerm.push('انتظار إشارات أوضح قبل التحرك');
  }
  
  // Long term implications
  longTerm.push('الاتجاهات طويلة المدى تتشكل من تراكم القرارات الحالية');
  longTerm.push('فهم الأسباب يساعد في التنبؤ بالمستقبل');
  
  // For user specifically
  switch (realIntent) {
    case 'make_decision':
      forUser = 'إذا كنت تفكر في اتخاذ قرار، الوقت الحالي يتطلب حذراً وتقييماً دقيقاً';
      break;
    case 'understand_cause':
      forUser = 'فهم هذه الأسباب يمنحك رؤية أوضح للوضع ويساعدك في التخطيط';
      break;
    case 'predict_future':
      forUser = 'التوقعات تعتمد على استمرار العوامل الحالية، وأي تغيير قد يغير المسار';
      break;
    case 'assess_risk':
      forUser = 'المخاطر موجودة لكنها قابلة للإدارة بالتخطيط السليم';
      break;
    default:
      forUser = 'هذه المعلومات تساعدك على فهم الصورة الكاملة';
  }
  
  return { shortTerm, longTerm, forUser };
}

/**
 * Build decision support
 */
function buildDecisionSupport(
  indicators?: EmotionIndicators,
  expertKnowledge?: ExpertKnowledgePacket,
  realIntent?: string
): KnowledgePacket['decision'] {
  const cfi = indicators?.cfi || 50;
  const hri = indicators?.hri || 50;
  
  // Determine signal
  let signal: KnowledgePacket['decision']['signal'];
  let recommendation: string;
  let reasoning: string;
  
  if (cfi > 70) {
    signal = 'caution';
    recommendation = 'الانتظار والمراقبة - الخوف مرتفع جداً';
    reasoning = 'عندما يكون الخوف مرتفعاً، القرارات المتسرعة غالباً ما تكون خاطئة';
  } else if (cfi > 60 && hri > 60) {
    signal = 'neutral';
    recommendation = 'المراقبة مع الاستعداد - مشاعر متضاربة';
    reasoning = 'وجود خوف وأمل معاً يشير لحالة ترقب، انتظر إشارة أوضح';
  } else if (hri > 65) {
    signal = 'positive';
    recommendation = 'فرصة للتفاؤل الحذر';
    reasoning = 'الأمل مرتفع لكن الحذر مطلوب دائماً';
  } else if (cfi > 55) {
    signal = 'caution';
    recommendation = 'الحذر مطلوب - قلق ملحوظ';
    reasoning = 'مستوى القلق يستدعي التريث';
  } else {
    signal = 'neutral';
    recommendation = 'وضع محايد - مناسب للتخطيط';
    reasoning = 'لا توجد إشارات قوية في أي اتجاه';
  }
  
  // Get risks and opportunities from expert knowledge
  const risks = expertKnowledge?.riskFactors || ['عدم اليقين العام'];
  const opportunities = expertKnowledge?.opportunities || ['فرصة للتعلم والفهم'];
  
  return {
    signal,
    recommendation,
    reasoning,
    risks,
    opportunities
  };
}

/**
 * Build scenario summary
 */
function buildScenarioSummary(scenarioModels: any): KnowledgePacket['scenarios'] {
  const scenarios = scenarioModels.scenarios || [];
  
  const best = scenarios.find((s: any) => s.impact === 'positive') || {
    name: 'السيناريو الإيجابي',
    probability: 0.25,
    description: 'تحسن الوضع',
    triggers: ['أخبار إيجابية']
  };
  
  const worst = scenarios.find((s: any) => s.impact === 'negative') || {
    name: 'السيناريو السلبي',
    probability: 0.25,
    description: 'تفاقم الوضع',
    triggers: ['أخبار سلبية']
  };
  
  const likely = scenarios.find((s: any) => s.impact === 'neutral') || {
    name: 'السيناريو المحايد',
    probability: 0.5,
    description: 'استمرار الوضع الحالي',
    triggers: ['غياب محفزات قوية']
  };
  
  return {
    best: { name: best.name, probability: best.probability, description: best.description, triggers: best.triggers },
    worst: { name: worst.name, probability: worst.probability, description: worst.description, triggers: worst.triggers },
    likely: { name: likely.name, probability: likely.probability, description: likely.description, triggers: likely.triggers }
  };
}

/**
 * Build comparison summary
 */
function buildComparisonSummary(comparisonData: any): KnowledgePacket['comparison'] {
  return {
    items: comparisonData.items.map((i: any) => i.name),
    winner: comparisonData.winner,
    reasoning: `المقارنة بناءً على: ${comparisonData.criteria?.join('، ') || 'معايير متعددة'}`
  };
}

/**
 * Build follow-up suggestions
 */
function buildFollowUp(
  implicitQuestions: string[],
  topic: string,
  currentState: KnowledgePacket['currentState']
): KnowledgePacket['followUp'] {
  // Generate answers to implicit questions
  const implicitAnswers: string[] = [];
  for (const q of implicitQuestions.slice(0, 2)) {
    if (q.includes('مؤقت')) {
      implicitAnswers.push('الوضع الحالي يعتمد على استمرار العوامل المؤثرة، وقد يتغير مع تغير الظروف');
    } else if (q.includes('مخاطر')) {
      implicitAnswers.push('المخاطر موجودة لكنها قابلة للإدارة بالتخطيط والحذر');
    }
  }
  
  // Generate smart follow-up questions
  const suggestedQuestions = [
    `هل نحلل ${topic} بشكل أعمق؟`,
    `ماذا لو تغيرت الظروف الحالية؟`,
    `ما هي أفضل استراتيجية للتعامل مع هذا الوضع؟`
  ];
  
  return {
    implicitAnswers,
    suggestedQuestions
  };
}

/**
 * Build knowledge packet from Cognitive Router output (NEW WAY)
 * This is the preferred method - uses internal engines instead of external sources
 */
function buildKnowledgeFromCognitive(
  question: DeepQuestion,
  cognitiveOutput: CognitiveOutput
): KnowledgePacket {
  const { surface, deep } = question;
  const { outputs, combinedInsights, emotionIndicators } = cognitiveOutput;
  
  // Build core understanding
  const core = {
    topic: surface.topic,
    questionType: surface.questionType,
    realIntent: deep.realIntent,
    emotionalNeed: deep.emotionalNeed
  };
  
  // Build current state from emotion indicators
  const currentState = buildCurrentState(surface.topic, emotionIndicators);
  
  // Build causes from engine insights
  const causes = buildCausesFromEngines(outputs, surface.topic);
  
  // Build implications
  const implications = buildImplications(surface.topic, currentState, causes, deep.realIntent);
  
  // Build decision from decision engine output
  const decisionOutput = outputs.find(o => o.engine === 'decision_engine');
  const decision = buildDecisionFromEngine(decisionOutput, emotionIndicators);
  
  // Build scenarios from scenario engine
  const scenarioOutput = outputs.find(o => o.engine === 'scenario_engine');
  const scenarios = scenarioOutput ? buildScenariosFromEngine(scenarioOutput) : undefined;
  
  // Build comparison from comparison engine
  const comparisonOutput = outputs.find(o => o.engine === 'comparison_engine');
  const comparison = comparisonOutput ? buildComparisonFromEngine(comparisonOutput) : undefined;
  
  // Build follow-up with smart questions
  const followUp = buildSmartFollowUp(deep.implicitQuestions, surface.topic, currentState, cognitiveOutput);
  
  return {
    core,
    currentState,
    causes,
    implications,
    decision,
    scenarios,
    comparison,
    followUp
  };
}

/**
 * Build causes from cognitive engine outputs
 */
function buildCausesFromEngines(
  outputs: EngineOutput[],
  topic: string
): KnowledgePacket['causes'] {
  const primary: CausalChain[] = [];
  const secondary: CausalChain[] = [];
  
  // Get insights from explanation engine first
  const explanationOutput = outputs.find(o => o.engine === 'explanation_engine');
  if (explanationOutput) {
    for (const insight of explanationOutput.insights) {
      primary.push({
        cause: insight,
        effect: 'تأثير على المشاعر والقرارات',
        explanation: 'هذا العامل يؤثر بشكل مباشر على الوضع الحالي',
        confidence: explanationOutput.confidence
      });
    }
  }
  
  // Get insights from economic engine
  const economicOutput = outputs.find(o => o.engine === 'economic_engine');
  if (economicOutput) {
    for (const insight of economicOutput.insights) {
      secondary.push({
        cause: insight,
        effect: 'تأثير اقتصادي',
        explanation: 'عامل اقتصادي مساهم',
        confidence: economicOutput.confidence
      });
    }
  }
  
  // Get insights from media bias engine
  const mediaOutput = outputs.find(o => o.engine === 'media_bias_engine');
  if (mediaOutput) {
    for (const insight of mediaOutput.insights) {
      secondary.push({
        cause: insight,
        effect: 'تأثير إعلامي',
        explanation: 'تأثير الإعلام على المشاعر',
        confidence: mediaOutput.confidence
      });
    }
  }
  
  // Build summary
  const summary = primary.length > 0
    ? `هذا الوضع ناتج بشكل رئيسي عن: ${primary.slice(0, 2).map(c => c.cause).join('، ')}`
    : 'الوضع الحالي نتيجة تفاعل عوامل متعددة';
  
  return { primary, secondary, summary };
}

/**
 * Build decision from decision engine output
 */
function buildDecisionFromEngine(
  decisionOutput: EngineOutput | undefined,
  indicators: EmotionIndicators
): KnowledgePacket['decision'] {
  if (decisionOutput?.data) {
    const { recommendation, signal } = decisionOutput.data;
    return {
      signal: signal || 'neutral',
      recommendation: recommendation || 'المراقبة والانتظار',
      reasoning: decisionOutput.reasoning,
      risks: decisionOutput.insights.filter(i => i.includes('مخاطر') || i.includes('خطر')),
      opportunities: decisionOutput.insights.filter(i => i.includes('فرص') || i.includes('أمل'))
    };
  }
  
  // Fallback to indicator-based decision
  return buildDecisionSupport(indicators, undefined, undefined);
}

/**
 * Build scenarios from scenario engine output
 */
function buildScenariosFromEngine(
  scenarioOutput: EngineOutput
): KnowledgePacket['scenarios'] {
  const insights = scenarioOutput.insights;
  
  return {
    best: {
      name: 'السيناريو الأفضل',
      probability: 0.25,
      description: insights.find(i => i.includes('الأفضل')) || 'تحسن الوضع',
      triggers: ['أخبار إيجابية']
    },
    worst: {
      name: 'السيناريو الأسوأ',
      probability: 0.25,
      description: insights.find(i => i.includes('الأسوأ')) || 'تفاقم الوضع',
      triggers: ['أخبار سلبية']
    },
    likely: {
      name: 'السيناريو الأرجح',
      probability: 0.5,
      description: insights.find(i => i.includes('الأرجح')) || 'استمرار الوضع',
      triggers: ['غياب محفزات قوية']
    }
  };
}

/**
 * Build comparison from comparison engine output
 */
function buildComparisonFromEngine(
  comparisonOutput: EngineOutput
): KnowledgePacket['comparison'] {
  return {
    items: comparisonOutput.insights.filter(i => i.includes('مقارنة')),
    reasoning: comparisonOutput.reasoning
  };
}

/**
 * Build smart follow-up questions based on cognitive output
 */
function buildSmartFollowUp(
  implicitQuestions: string[],
  topic: string,
  currentState: KnowledgePacket['currentState'],
  cognitiveOutput: CognitiveOutput
): KnowledgePacket['followUp'] {
  const implicitAnswers: string[] = [];
  
  // Answer implicit questions from combined insights
  for (const q of implicitQuestions.slice(0, 2)) {
    const relevantInsight = cognitiveOutput.combinedInsights.find(i => 
      i.toLowerCase().includes(q.split(' ')[0].toLowerCase())
    );
    if (relevantInsight) {
      implicitAnswers.push(relevantInsight);
    }
  }
  
  // Generate smart follow-up questions based on engines activated
  const suggestedQuestions: string[] = [];
  const { decision } = cognitiveOutput;
  
  // Based on primary engine
  switch (decision.primaryEngine) {
    case 'decision_engine':
      suggestedQuestions.push(`ما المخاطر المحتملة إذا اتخذت هذا القرار؟`);
      suggestedQuestions.push(`ماذا لو انتظرت أسبوعًا قبل القرار؟`);
      break;
    case 'explanation_engine':
      suggestedQuestions.push(`هل هذه الأسباب مؤقتة أم دائمة؟`);
      suggestedQuestions.push(`كيف يمكن التعامل مع هذه العوامل؟`);
      break;
    case 'scenario_engine':
      suggestedQuestions.push(`ما الذي يمكن أن يغير هذا السيناريو؟`);
      suggestedQuestions.push(`كيف أستعد للسيناريو الأسوأ؟`);
      break;
    case 'economic_engine':
      suggestedQuestions.push(`هل نحلل العلاقة بين ${topic} والدولار؟`);
      suggestedQuestions.push(`ما تأثير قرارات الفيدرالي على هذا؟`);
      break;
    case 'media_bias_engine':
      suggestedQuestions.push(`كيف أميز بين الخبر الحقيقي والتضخيم الإعلامي؟`);
      suggestedQuestions.push(`ما المصادر الأكثر موثوقية؟`);
      break;
    default:
      suggestedQuestions.push(`هل نحلل ${topic} بشكل أعمق؟`);
      suggestedQuestions.push(`ماذا لو تغيرت الظروف الحالية؟`);
  }
  
  return {
    implicitAnswers,
    suggestedQuestions: suggestedQuestions.slice(0, 2)
  };
}

export {
  buildCurrentState,
  buildCausalAnalysis,
  buildImplications,
  buildDecisionSupport,
  buildKnowledgeFromCognitive
};
