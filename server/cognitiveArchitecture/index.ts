/**
 * AmalSense Cognitive Architecture
 * 
 * Complete 11-Layer Cognitive System
 * Modeled after human brain cognitive functions
 * 
 * Layers:
 * 1. Sensory Perception (Data Ingestion) - External
 * 2. Attention (Signal Filtering)
 * 3. Encoding (NLP Preprocessing)
 * 4. Comprehension (Intent Detection) - From cognitiveEngine
 * 5. Working Memory (Conversation State)
 * 6. Long-term Memory (Knowledge Base)
 * 7. Emotional Appraisal (DCFT) - From emotionEngine
 * 8. Social Cognition (Collective Intelligence) - From trendEngine
 * 9. Reasoning (Thinking Engine) - From cognitiveEngine
 * 10. Executive Function (Meta-Decision) - From cognitiveEngine
 * 11. Metacognition (Self-Evaluation)
 */

// Import all layers
import { filterSignals, type AttentionSignal } from './layer2_attention';
import { 
  buildAwarenessResponse, 
  formatAwarenessResponse,
  TOPIC_CAUSES_DATABASE,
  type AwarenessResponse 
} from './awarenessResponseBuilder';
import { encode, type EncodedText } from './layer3_encoding';
import { 
  getWorkingMemory, 
  addTurn, 
  getConversationContext,
  type WorkingMemoryState 
} from './layer5_workingMemory';
import { 
  getTopicKnowledge, 
  findCausesFor, 
  findEffectsOf,
  getApplicableRules,
  getRelevantPatterns,
  buildExplanationChain,
  type CausalRelation,
  type ExpertRule,
  type HistoricalPattern
} from './layer6_knowledgeBase';
import { 
  assessAnalysis, 
  getConfidenceIndicator,
  formatAssessmentForDisplay,
  shouldShowConfidence,
  type MetacognitiveAssessment 
} from './layer11_metacognition';

// Import from existing cognitiveEngine
import { understandQuestion, type DeepQuestion } from '../cognitiveEngine/questionUnderstanding';
import { routeQuestion, activateEngines, type RouterDecision, type CognitiveOutput as RouterOutput } from '../cognitiveEngine/cognitiveRouter';

// ============================================
// MAIN COGNITIVE PIPELINE
// ============================================

export interface CognitiveInput {
  question: string;
  sessionId: string;
  userId?: string;
  indicators?: {
    gmi?: number;
    cfi?: number;
    hri?: number;
  };
  newsContext?: string[];
  economicData?: any;
}

export interface CognitiveOutput {
  // Main response
  response: string;
  
  // Structured components
  summary: string;
  causes: string[];
  decision: {
    signal: string;
    recommendation: string;
    confidence: number;
  };
  closingQuestion: string;
  
  // Metacognitive info
  metacognition: {
    confidence: number;
    confidenceLevel: string;
    selfCritique: string;
    showConfidence: boolean;
  };
  
  // Debug info (for development)
  debug?: {
    understanding: DeepQuestion;
    route: RouterDecision;
    knowledgeUsed: number;
    enginesActivated: string[];
  };
}

/**
 * Main cognitive processing pipeline
 * Processes a question through all 11 layers
 */
export async function processCognitively(input: CognitiveInput): Promise<CognitiveOutput> {
  const { question, sessionId, userId, indicators, newsContext, economicData } = input;
  
  // ========== LAYER 2: ATTENTION ==========
  // Filter and prioritize incoming signals
  const rawSignals = newsContext?.map((text, i) => ({
    id: `news-${i}`,
    content: text,
    source: 'news' as const,
    timestamp: new Date()
  })) || [];
  const filteredSignals = filterSignals(rawSignals);
  
  // ========== LAYER 3: ENCODING ==========
  // Encode the question into structured representation
  const encodedQuestion = encode({ text: question });
  
  // ========== LAYER 4: COMPREHENSION ==========
  // Deep understanding of the question
  const understanding = understandQuestion(question);
  const topic = understanding.surface.topic;
  const realIntent = understanding.deep.realIntent;
  
  // ========== LAYER 5: WORKING MEMORY ==========
  // Get conversation context
  const conversationContext = getConversationContext(sessionId);
  
  // Add this turn to memory
  addTurn(sessionId, 'user', question, {
    intent: realIntent,
    topic: topic,
    entities: encodedQuestion.entities.map(e => e.text),
    sentiment: encodedQuestion.sentiment.polarity
  });
  
  // ========== LAYER 6: KNOWLEDGE BASE ==========
  // Retrieve relevant knowledge
  const topicKnowledge = getTopicKnowledge(topic);
  const causes = findCausesFor(topic);
  const explanationChain = buildExplanationChain(topic);
  const applicableRules = getApplicableRules({
    cfi: indicators?.cfi,
    hri: indicators?.hri,
    gmi: indicators?.gmi,
    topic: topic
  });
  const relevantPatterns = getRelevantPatterns({
    topic: topic,
    cfi: indicators?.cfi
  });
  
  // ========== LAYER 9: REASONING ==========
  // Route to appropriate cognitive engines
  const route = routeQuestion(understanding);
  
  // ========== LAYER 10: EXECUTIVE FUNCTION ==========
  // Build the response using all gathered information
  const response = buildIntelligentResponse({
    understanding,
    encodedQuestion,
    conversationContext,
    topicKnowledge,
    causes,
    explanationChain,
    applicableRules,
    relevantPatterns,
    route,
    indicators,
    filteredSignals
  });
  
  // ========== LAYER 11: METACOGNITION ==========
  // Assess the quality of our analysis
  const metacognition = assessAnalysis({
    question,
    topic: topic,
    indicators: indicators || {},
    sourcesUsed: filteredSignals.map((s) => s.original.source),
    enginesActivated: [route.primaryEngine, ...route.supportingEngines],
    causalChainsUsed: explanationChain.chain.length,
    knowledgeItemsUsed: causes.length + applicableRules.length + relevantPatterns.length,
    responseLength: response.fullResponse.length,
    hasDecisionSignal: !!response.decision.signal,
    hasRecommendation: !!response.decision.recommendation
  });
  
  // Add assistant response to memory
  addTurn(sessionId, 'assistant', response.summary, {
    topic: topic
  });
  
  return {
    response: response.fullResponse,
    summary: response.summary,
    causes: response.causes,
    decision: {
      signal: response.decision.signal,
      recommendation: response.decision.recommendation,
      confidence: metacognition.overallConfidence
    },
    closingQuestion: response.closingQuestion,
    metacognition: {
      confidence: metacognition.overallConfidence,
      confidenceLevel: metacognition.confidenceLevel,
      selfCritique: metacognition.selfCritique,
      showConfidence: shouldShowConfidence(metacognition)
    },
    debug: {
      understanding,
      route,
      knowledgeUsed: causes.length + applicableRules.length + relevantPatterns.length,
      enginesActivated: [route.primaryEngine, ...route.supportingEngines]
    }
  };
}

// ============================================
// INTELLIGENT RESPONSE BUILDER
// ============================================

interface ResponseBuildContext {
  understanding: DeepQuestion;
  encodedQuestion: EncodedText;
  conversationContext: ReturnType<typeof getConversationContext>;
  topicKnowledge: ReturnType<typeof getTopicKnowledge>;
  causes: CausalRelation[];
  explanationChain: ReturnType<typeof buildExplanationChain>;
  applicableRules: ExpertRule[];
  relevantPatterns: HistoricalPattern[];
  route: RouterDecision;
  indicators?: { gmi?: number; cfi?: number; hri?: number };
  filteredSignals: AttentionSignal[];
}

interface BuiltResponse {
  fullResponse: string;
  summary: string;
  causes: string[];
  decision: {
    signal: string;
    recommendation: string;
  };
  closingQuestion: string;
}

function buildIntelligentResponse(context: ResponseBuildContext): BuiltResponse {
  const { understanding, causes, explanationChain, applicableRules, relevantPatterns, indicators, conversationContext } = context;
  
  const topic = understanding.surface.topic;
  const realIntent = understanding.deep.realIntent;
  
  // ========== استخدام AwarenessResponseBuilder الجديد ==========
  // بناء الرد بفلسفة What → Why → So what
  const awarenessResponse = buildAwarenessResponse(
    understanding.surface.text || topic,
    topic,
    {
      fear: indicators?.cfi || 50,
      hope: indicators?.hri || 50,
      mood: indicators?.gmi || 0
    },
    realIntent
  );
  
  // تنسيق الرد
  const formattedResponse = formatAwarenessResponse(awarenessResponse);
  
  // استخراج الأسباب للتصدير
  const extractedCauses = awarenessResponse.why.causes;
  
  // بناء إشارة القرار
  const decision = buildDecisionSignal(understanding, indicators, applicableRules);
  
  return {
    fullResponse: formattedResponse,
    summary: awarenessResponse.what.summary,
    causes: extractedCauses,
    decision,
    closingQuestion: awarenessResponse.closingQuestion
  };
}

function buildSummary(
  understanding: DeepQuestion,
  indicators?: { gmi?: number; cfi?: number; hri?: number },
  conversationContext?: ReturnType<typeof getConversationContext>
): string {
  const topic = understanding.surface.topic;
  const intent = understanding.deep.realIntent;
  
  // Build contextual summary based on intent
  let summary = '';
  
  if (intent === 'understand_cause') {
    summary = `بالنظر إلى ${topic}، هناك عدة عوامل متشابكة تفسر الوضع الحالي. `;
  } else if (intent === 'make_decision') {
    summary = `فيما يتعلق بقرار ${topic}، الوضع يتطلب تقييماً دقيقاً للمعطيات. `;
  } else if (intent === 'predict_future') {
    summary = `التوقعات المتعلقة بـ${topic} تعتمد على عدة متغيرات. `;
  } else if (intent === 'compare_options') {
    summary = `عند المقارنة في موضوع ${topic}، هناك اعتبارات مهمة. `;
  } else {
    summary = `${topic} موضوع يستحق التحليل من عدة زوايا. `;
  }
  
  // Add indicator context if available
  if (indicators) {
    if (indicators.cfi && indicators.cfi > 60) {
      summary += 'المؤشرات تظهر مستوى قلق ملحوظ في السوق. ';
    } else if (indicators.hri && indicators.hri > 60) {
      summary += 'هناك تفاؤل نسبي في المؤشرات الحالية. ';
    }
  }
  
  // Add follow-up context
  if (conversationContext?.isFollowUp) {
    summary += 'بناءً على ما ناقشناه سابقاً، ';
  }
  
  return summary;
}

function buildDecisionSignal(
  understanding: DeepQuestion,
  indicators?: { gmi?: number; cfi?: number; hri?: number },
  rules?: ExpertRule[]
): { signal: string; recommendation: string } {
  let signal = '';
  let recommendation = '';
  
  // Use applicable rules for decision
  const actionableRules = rules?.filter(r => r.actionable) || [];
  if (actionableRules.length > 0) {
    signal = `📊 ${actionableRules[0].conclusion}`;
  }
  
  // Build signal based on indicators
  if (indicators) {
    const cfi = indicators.cfi || 50;
    const hri = indicators.hri || 50;
    
    if (cfi > 70 && hri > 60) {
      signal = signal || '📈 الموقف: مراقبة مع استعداد للفرص';
      recommendation = '• الخوف المرتفع مع وجود أمل قد يشير لفرصة\n• لكن الحذر مطلوب - لا تتسرع';
    } else if (cfi > 70) {
      signal = signal || '⚠️ الموقف: حذر شديد';
      recommendation = '• تجنب القرارات الكبيرة حالياً\n• انتظر هدوء المؤشرات';
    } else if (hri > 70) {
      signal = signal || '🟢 الموقف: تفاؤل حذر';
      recommendation = '• الأجواء إيجابية لكن راقب المخاطر\n• لا تفرط في التفاؤل';
    } else {
      signal = signal || '🟡 الموقف: مراقبة';
      recommendation = '• الوضع غير واضح\n• انتظر إشارات أوضح قبل التحرك';
    }
  }
  
  // Default based on intent
  if (!signal && understanding.deep.realIntent === 'make_decision') {
    signal = '💭 الموقف: يحتاج تقييم أعمق';
    recommendation = '• اجمع معلومات إضافية\n• استشر مصادر متعددة';
  }
  
  return { signal, recommendation };
}

function buildClosingQuestion(
  understanding: DeepQuestion,
  conversationContext: ReturnType<typeof getConversationContext>
): string {
  const topic = understanding.surface.topic;
  const intent = understanding.deep.realIntent;
  
  // Smart closing questions based on context
  const questions: Record<string, string[]> = {
    'understand_cause': [
      `هل نتعمق في أحد هذه الأسباب بالتفصيل؟`,
      `هل تريد فهم العلاقة بين ${topic} وعامل محدد؟`,
      `ما الجانب الذي يهمك أكثر في ${topic}؟`
    ],
    'make_decision': [
      `هل نحلل المخاطر والفرص بالتفصيل؟`,
      `ما السيناريو الذي يقلقك أكثر؟`,
      `هل تريد مقارنة بين الخيارات المتاحة؟`
    ],
    'predict_future': [
      `هل نستكشف سيناريوهات مختلفة؟`,
      `ما الأفق الزمني الذي يهمك؟`,
      `هل تريد معرفة المؤشرات التي يجب مراقبتها؟`
    ],
    'compare_options': [
      `هل نركز على جانب معين من المقارنة؟`,
      `ما المعيار الأهم بالنسبة لك؟`,
      `هل تريد تحليل كل خيار على حدة؟`
    ]
  };
  
  const intentQuestions = questions[intent] || questions['understand_cause'];
  
  // If follow-up, use more contextual question
  if (conversationContext.isFollowUp && conversationContext.currentTopic) {
    return `هل نواصل التعمق في ${conversationContext.currentTopic}، أم ننتقل لجانب آخر؟`;
  }
  
  // Random selection for variety
  const index = Math.floor(Math.random() * intentQuestions.length);
  return intentQuestions[index];
}

function generateFallbackCauses(topic: string, indicators?: { gmi?: number; cfi?: number; hri?: number }): string[] {
  const causes: string[] = [];
  
  // Generic causes based on topic keywords
  if (topic.includes('ذهب') || topic.includes('فضة')) {
    causes.push('**تحركات أسعار الفائدة العالمية** - تؤثر مباشرة على جاذبية المعادن الثمينة');
    causes.push('**قوة أو ضعف الدولار** - علاقة عكسية تاريخية مع الذهب');
    causes.push('**التوترات الجيوسياسية** - تدفع المستثمرين للملاذات الآمنة');
  } else if (topic.includes('دولار') || topic.includes('عملة')) {
    causes.push('**قرارات الفيدرالي الأمريكي** - المحرك الرئيسي لقيمة الدولار');
    causes.push('**فروقات أسعار الفائدة** - تجذب رؤوس الأموال');
    causes.push('**البيانات الاقتصادية الأمريكية** - تؤثر على التوقعات');
  } else if (topic.includes('إعلام') || topic.includes('أخبار')) {
    causes.push('**التضخيم الإعلامي** - العناوين السلبية تنتشر أسرع');
    causes.push('**دورة الأخبار السريعة** - تخلق ضغطاً نفسياً مستمراً');
    causes.push('**التحيز في التغطية** - بعض الزوايا تُبرز أكثر من غيرها');
  } else {
    causes.push('**العوامل الاقتصادية الكلية** - تؤثر على المزاج العام');
    causes.push('**التطورات المحلية والعالمية** - تشكل السياق');
    causes.push('**ديناميكيات السوق** - العرض والطلب والتوقعات');
  }
  
  // Add indicator-based cause
  if (indicators?.cfi && indicators.cfi > 60) {
    causes.push('**ارتفاع مؤشر الخوف الجماعي** - يعكس قلقاً واسعاً في السوق');
  }
  
  return causes.slice(0, 3);
}

// ============================================
// EXPORTS
// ============================================

// Import new components
import { SessionContextManager, getFullContext } from './sessionContext';
import { DynamicResponseEngine, determineResponseStructure } from './dynamicResponseEngine';
import { NarrativeStyleEngine, generateStyleInstructions, applyConsultantStyle } from './narrativeStyleEngine';
import { EnhancedPipeline, executeEnhancedPipeline } from './enhancedPipeline';

export {
  // Layer 2
  filterSignals,
  type AttentionSignal,
  
  // Layer 3
  encode,
  type EncodedText,
  
  // Layer 5
  getWorkingMemory,
  addTurn,
  getConversationContext,
  type WorkingMemoryState,
  
  // Layer 6
  getTopicKnowledge,
  findCausesFor,
  findEffectsOf,
  getApplicableRules,
  getRelevantPatterns,
  buildExplanationChain,
  
  // Layer 11
  assessAnalysis,
  getConfidenceIndicator,
  formatAssessmentForDisplay,
  shouldShowConfidence,
  type MetacognitiveAssessment,
  
  // New Components - Session Context
  SessionContextManager,
  getFullContext,
  
  // New Components - Dynamic Response
  DynamicResponseEngine,
  determineResponseStructure,
  
  // New Components - Narrative Style
  NarrativeStyleEngine,
  generateStyleInstructions,
  applyConsultantStyle,
  
  // New Components - Enhanced Pipeline
  EnhancedPipeline,
  executeEnhancedPipeline
};



// ============================================
// Phase 59: Patent Layers (5 layers)
// ============================================
export * from './workingMemory';
export * from './longTermMemory';
export * from './contextualBinding';
export * from './causalInference';
export * from './metacognition';
export * from './perceptionLayer';

// ============================================
// Phase 60: Critical Layers (8 layers)
// ============================================
export * from './contextLockLayer';
export * from './cognitiveControlLayer';
export * from './knowledgeEngine';
export * from './dialogicalConsciousness';
export * from './cognitiveConsistencyCheck';
export * from './cognitiveAnswerGate';
export * from './analysisLifecycleManager';
export * from './evidenceGrounding';

// ============================================
// Unified Pipeline (integrates all 14 layers)
// ============================================
export * from './unifiedPipeline';
