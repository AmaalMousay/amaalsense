/**
 * AmalSense Conversational Intelligence Agent
 * 
 * Four Intelligence Layers:
 * 1. Analytical Intelligence - GMI/CFI/HRI calculation (existing)
 * 2. Emotional Reasoning AI - connects indicators, infers psychological states
 * 3. Conversational Intelligence - understands questions, responds in human language
 * 4. Meta-Decision AI - converts analysis to recommendations/warnings/scenarios
 */

import { invokeLLMProvider, getActiveProvider, getProviderInfo, type LLMMessage } from './llmProvider';
import { frameResponse, enhanceAIResponse, quickQuestionTemplates, whatIfScenarios, type ToneType } from './conversationFramer';
import { 
  parseQuestion, 
  buildContext, 
  classifyIntent,
  type SemanticFrame,
  type InjectedContext 
} from './semanticUnderstanding';
import { LearningLayer, type IntentType } from './learningLayer';
import { MultiTurnContext } from './multiTurnContext';
import { restructureAIResponse, compressResponse, type CompressedResponse } from './decisionCompressor';
import { buildStructuredResponse, type AnalysisData as ResponseAnalysisData } from './responseBuilder';
import { analyzeNewsForCauses, buildWhySection, type NewsItem } from './causalExplainability';

// Types for the conversational AI
export interface AnalysisContext {
  topic: string;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  emotionVector: Record<string, number>;
  confidence: number;
  detectedCountry?: string;
  sources?: string[];
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface AIResponse {
  message: string;
  detectedCountry?: string;
  recommendations?: string[];
  warnings?: string[];
  scenarios?: Array<{
    condition: string;
    prediction: string;
  }>;
  // Semantic Understanding Layer outputs
  semanticFrame?: SemanticFrame;
  injectedContext?: InjectedContext;
  // Learning Layer outputs
  learningInsights?: {
    detectedIntent: IntentType;
    intentConfidence: number;
    alternativeIntents: Array<{ intent: IntentType; score: number }>;
  };
  // Multi-turn Context outputs
  contextInfo?: {
    conversationId: string;
    resolvedQuestion: string;
    contextUsed: boolean;
    mainTopic: string | null;
  };
}

// Country detection from topic context
const COUNTRY_KEYWORDS: Record<string, string[]> = {
  'US': ['america', 'american', 'usa', 'united states', 'biden', 'trump', 'washington', 'congress', 'white house', 'federal reserve', 'wall street', 'silicon valley'],
  'LY': ['libya', 'libyan', 'tripoli', 'benghazi', 'ليبيا', 'طرابلس', 'بنغازي'],
  'EG': ['egypt', 'egyptian', 'cairo', 'مصر', 'القاهرة', 'السيسي'],
  'SA': ['saudi', 'arabia', 'riyadh', 'السعودية', 'الرياض', 'محمد بن سلمان'],
  'AE': ['uae', 'emirates', 'dubai', 'abu dhabi', 'الإمارات', 'دبي'],
  'GB': ['uk', 'britain', 'british', 'england', 'london', 'بريطانيا', 'لندن'],
  'DE': ['germany', 'german', 'berlin', 'ألمانيا', 'برلين'],
  'FR': ['france', 'french', 'paris', 'فرنسا', 'باريس'],
  'CN': ['china', 'chinese', 'beijing', 'الصين', 'بكين'],
  'JP': ['japan', 'japanese', 'tokyo', 'اليابان', 'طوكيو'],
  'RU': ['russia', 'russian', 'moscow', 'putin', 'روسيا', 'موسكو', 'بوتين'],
  'IN': ['india', 'indian', 'delhi', 'mumbai', 'الهند', 'دلهي'],
  'BR': ['brazil', 'brazilian', 'البرازيل'],
  'TR': ['turkey', 'turkish', 'ankara', 'istanbul', 'تركيا', 'أنقرة', 'إسطنبول'],
  'IL': ['israel', 'israeli', 'tel aviv', 'إسرائيل', 'تل أبيب'],
  'PS': ['palestine', 'palestinian', 'gaza', 'فلسطين', 'غزة'],
  'IR': ['iran', 'iranian', 'tehran', 'إيران', 'طهران'],
  'IQ': ['iraq', 'iraqi', 'baghdad', 'العراق', 'بغداد'],
  'SY': ['syria', 'syrian', 'damascus', 'سوريا', 'دمشق'],
};

/**
 * Detect country from topic text
 */
export function detectCountryFromTopic(topic: string): string | undefined {
  const lowerTopic = topic.toLowerCase();
  
  for (const [countryCode, keywords] of Object.entries(COUNTRY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerTopic.includes(keyword.toLowerCase())) {
        return countryCode;
      }
    }
  }
  
  return undefined; // Global analysis if no country detected
}

/**
 * Layer 2: Emotional Reasoning AI
 * Connects indicators and infers collective psychological states
 */
export function analyzeEmotionalState(context: AnalysisContext): {
  state: string;
  description: string;
  intensity: 'low' | 'moderate' | 'high' | 'extreme';
} {
  const { gmi, cfi, hri } = context;
  
  // Determine emotional state based on indicator combinations
  if (cfi > 70) {
    if (hri < 30) {
      return {
        state: 'panic',
        description: 'High fear combined with low hope indicates collective panic and despair',
        intensity: 'extreme'
      };
    } else if (hri > 50) {
      return {
        state: 'anxious_hope',
        description: 'High fear but maintained hope suggests cautious optimism despite challenges',
        intensity: 'high'
      };
    } else {
      return {
        state: 'tension',
        description: 'Elevated fear with moderate hope indicates collective tension',
        intensity: 'high'
      };
    }
  }
  
  if (gmi > 50 && hri > 60) {
    return {
      state: 'optimistic',
      description: 'Positive mood with strong hope indicates collective optimism',
      intensity: cfi < 30 ? 'high' : 'moderate'
    };
  }
  
  if (gmi > 20 && gmi <= 50) {
    if (cfi < 40) {
      return {
        state: 'cautious_positive',
        description: 'Moderately positive mood with controlled fear suggests cautious optimism',
        intensity: 'moderate'
      };
    } else {
      return {
        state: 'mixed',
        description: 'Positive mood tempered by notable fear creates mixed sentiment',
        intensity: 'moderate'
      };
    }
  }
  
  if (gmi >= -20 && gmi <= 20) {
    return {
      state: 'neutral',
      description: 'Balanced mood indicates collective uncertainty or wait-and-see attitude',
      intensity: 'low'
    };
  }
  
  if (gmi < -20 && gmi >= -50) {
    return {
      state: 'concerned',
      description: 'Negative mood indicates collective concern and worry',
      intensity: 'moderate'
    };
  }
  
  if (gmi < -50) {
    return {
      state: 'pessimistic',
      description: 'Strongly negative mood indicates collective pessimism',
      intensity: hri < 30 ? 'extreme' : 'high'
    };
  }
  
  return {
    state: 'uncertain',
    description: 'Complex emotional patterns require deeper analysis',
    intensity: 'moderate'
  };
}

/**
 * Layer 4: Meta-Decision AI
 * Generates recommendations based on emotional analysis
 */
export function generateRecommendations(context: AnalysisContext): {
  recommendations: string[];
  warnings: string[];
  scenarios: Array<{ condition: string; prediction: string }>;
} {
  const { gmi, cfi, hri, topic } = context;
  const recommendations: string[] = [];
  const warnings: string[] = [];
  const scenarios: Array<{ condition: string; prediction: string }> = [];
  
  // Generate recommendations based on indicators
  if (cfi > 60) {
    warnings.push('High collective fear detected - expect increased volatility');
    recommendations.push('Monitor situation closely for rapid sentiment shifts');
    scenarios.push({
      condition: 'If negative news emerges',
      prediction: 'CFI could spike above 80, triggering panic responses'
    });
  }
  
  if (hri > 70) {
    recommendations.push('Strong hope resilience suggests recovery potential');
    scenarios.push({
      condition: 'If positive developments occur',
      prediction: 'Sentiment could shift to strongly positive within 24-48 hours'
    });
  }
  
  if (gmi > 30 && cfi < 40) {
    recommendations.push('Favorable emotional conditions for positive action');
  }
  
  if (gmi < -30) {
    warnings.push('Negative sentiment dominates - caution advised');
    scenarios.push({
      condition: 'Without positive catalysts',
      prediction: 'Negative mood likely to persist for 3-7 days'
    });
  }
  
  // Add topic-specific scenarios
  if (topic.toLowerCase().includes('market') || topic.toLowerCase().includes('stock') || topic.toLowerCase().includes('price')) {
    if (cfi > 50) {
      recommendations.push('Consider defensive positioning given elevated fear');
    }
    if (gmi > 40 && hri > 50) {
      recommendations.push('Emotional conditions support gradual accumulation');
    }
  }
  
  return { recommendations, warnings, scenarios };
}

/**
 * Layer 3: Conversational Intelligence
 * Main function to generate AI response using LLM
 * 
 * NEW: Integrated with Semantic Understanding Layer
 * Flow: User → Semantic Parser → Context Builder → LLM → Response
 */
export async function generateAIResponse(
  context: AnalysisContext,
  conversationHistory: ConversationMessage[],
  userQuestion?: string
): Promise<AIResponse> {
  const emotionalState = analyzeEmotionalState(context);
  const { recommendations, warnings, scenarios } = generateRecommendations(context);
  
  // NEW: Semantic Understanding Layer
  let semanticFrame: SemanticFrame | undefined;
  let injectedContext: InjectedContext | undefined;
  let learningInsights: AIResponse['learningInsights'] | undefined;
  let contextInfo: AIResponse['contextInfo'] | undefined;
  
  // Generate conversation ID for multi-turn context
  const conversationId = 'conv_' + context.topic.replace(/\s+/g, '_') + '_' + Date.now();
  
  if (userQuestion) {
    // === Learning Layer: Classify intent with learning ===
    const intentResult = LearningLayer.classifyIntent(userQuestion);
    learningInsights = {
      detectedIntent: intentResult.intent,
      intentConfidence: intentResult.confidence,
      alternativeIntents: intentResult.alternatives
    };
    console.log('[ConversationalAI] Learning Layer Intent:', {
      intent: intentResult.intent,
      confidence: intentResult.confidence.toFixed(1) + '%'
    });
    
    // === Multi-turn Context: Resolve references ===
    const resolved = MultiTurnContext.resolveReferences(conversationId, userQuestion);
    contextInfo = {
      conversationId,
      resolvedQuestion: resolved.resolvedQuestion,
      contextUsed: resolved.contextUsed,
      mainTopic: MultiTurnContext.getContext(conversationId).mainTopic
    };
    
    // Use resolved question for semantic parsing
    const questionToAnalyze = resolved.contextUsed ? resolved.resolvedQuestion : userQuestion;
    console.log('[ConversationalAI] Multi-turn Context:', {
      contextUsed: resolved.contextUsed,
      originalQuestion: userQuestion,
      resolvedQuestion: questionToAnalyze
    });
    
    // Add user turn to context
    MultiTurnContext.addTurn(conversationId, 'user', userQuestion, intentResult.intent, context.topic);
    
    // Parse the question to understand intent and meaning
    semanticFrame = parseQuestion(questionToAnalyze);
    console.log(`[ConversationalAI] Semantic Frame:`, {
      intent: semanticFrame.intent,
      entity: semanticFrame.entity,
      userNeed: semanticFrame.userNeed,
      expectedResponseType: semanticFrame.expectedResponseType
    });
    
    // === SCENARIO ENGINE: Handle What-If questions directly ===
    if (semanticFrame.intent === 'scenario') {
      console.log('[ConversationalAI] 🎯 Scenario detected! Using Scenario Engine...');
      const { generateScenarioResponse } = await import('./scenarioEngine');
      const scenarioResponse = generateScenarioResponse(
        questionToAnalyze,
        { gmi: context.gmi, cfi: context.cfi, hri: context.hri },
        context.topic
      );
      
      // Record interaction for learning
      LearningLayer.recordInteraction({
        question: userQuestion,
        detectedIntent: 'scenario',
        wasHelpful: null,
        topic: context.topic,
        responseQuality: 4
      });
      
      return {
        message: scenarioResponse,
        detectedCountry: context.detectedCountry,
        recommendations,
        warnings,
        scenarios,
        semanticFrame,
        injectedContext,
        learningInsights,
        contextInfo
      };
    }
    
    // Build context with DCFT data
    injectedContext = buildContext(semanticFrame, {
      gmi: context.gmi,
      cfi: context.cfi,
      hri: context.hri,
      dominantEmotion: context.dominantEmotion,
      confidence: context.confidence
    });
    console.log(`[ConversationalAI] Injected Context:`, {
      trend: injectedContext.trend.direction,
      reasoningRules: injectedContext.reasoningRules.length,
      recommendation: injectedContext.preliminaryRecommendation
    });
  }
  
  // Build system prompt with AmalSense context
  // Enhanced with Semantic Understanding when available
  const systemPrompt = buildEnhancedSystemPrompt(context, emotionalState, semanticFrame, injectedContext);
  
  const legacySystemPrompt = `You are AmalSense AI, a Collective Emotional Intelligence Agent that analyzes and explains collective emotions from digital sources.

Your knowledge includes:
- DCFT (Digital Collective Feeling Theory) methodology
- Three core indices: GMI (Global Mood Index: -100 to +100), CFI (Collective Fear Index: 0-100), HRI (Hope Resilience Index: 0-100)
- Emotional vector analysis (joy, fear, anger, sadness, hope, curiosity, surprise, disgust)

Current Analysis Context:
- Topic: ${context.topic}
- Detected Country: ${context.detectedCountry || 'Global'}
- GMI: ${context.gmi.toFixed(1)} (${context.gmi > 0 ? 'positive' : context.gmi < 0 ? 'negative' : 'neutral'})
- CFI: ${context.cfi.toFixed(1)}% (${context.cfi > 60 ? 'high fear' : context.cfi < 40 ? 'low fear' : 'moderate fear'})
- HRI: ${context.hri.toFixed(1)}% (${context.hri > 60 ? 'high hope' : context.hri < 40 ? 'low hope' : 'moderate hope'})
- Dominant Emotion: ${context.dominantEmotion}
- Confidence: ${context.confidence}%
- Emotional State: ${emotionalState.state} (${emotionalState.intensity} intensity)
- State Description: ${emotionalState.description}

Your role:
1. ADVISOR FIRST: Start with a clear verdict/recommendation, then explain
2. INTERPRETER: Explain what the indicators mean in human terms
3. REASONER: Connect the indicators to explain WHY this emotional state exists
4. FORECASTER: Predict how emotions might change based on scenarios

CRITICAL RESPONSE FORMAT - You MUST follow this structure:
1. START with a one-line summary/verdict (NO "As AmalSense AI" or "بصفتي" introductions)
2. Then provide "الخلاصة:" (Executive Summary) in 2-3 sentences
3. Then "لماذا؟" section explaining the indicators
4. Then "التوقع الزمني:" with 24-48 hour prediction
5. Then "إشارة القرار:" with clear recommendation
6. END with a thoughtful question like "هل تريد أن أحاكي لك سيناريو...؟"

Guidelines:
- NEVER start with "As AmalSense AI" or "بصفتي AmalSense"
- Start directly with the insight/verdict
- Be a wise advisor who judges then explains, not a robot who only explains
- Use Arabic for responses when the topic is in Arabic
- Be specific about numbers and their meaning
- Provide actionable recommendations, not just analysis
- End with an engaging question, not "Ask about predictions..."`;

  // Build conversation messages
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt }
  ];
  
  // Add conversation history
  for (const msg of conversationHistory.slice(-10)) { // Keep last 10 messages for context
    messages.push({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    });
  }
  
  // If this is the initial analysis (no user question), generate automatic explanation
  if (!userQuestion) {
    // Get framed response template for guidance
    const framedTemplate = frameResponse({
      topic: context.topic,
      gmi: context.gmi,
      cfi: context.cfi,
      hri: context.hri,
      dominantEmotion: context.dominantEmotion,
      confidence: context.confidence,
      detectedCountry: context.detectedCountry,
    }, 'calm_advisor');
    
    messages.push({
      role: 'user',
      content: `حلل المشاعر الجماعية حول "${context.topic}".

⚠️ قواعد صارمة:
- لا تبدأ أبداً بـ "بصفتي" أو "أنا AmalSense" أو "As AmalSense AI"
- ابدأ مباشرة بالحكم/الخلاصة

📋 الهيكل المطلوب (اتبعه حرفياً):

${framedTemplate.intro}

**الخلاصة:** ${framedTemplate.summary}

**لماذا؟**
${framedTemplate.explanation}

**التوقع الزمني:**
${framedTemplate.prediction}

**${framedTemplate.decision}**

---
${framedTemplate.closingQuestion}`
    });
  } else {
    messages.push({
      role: 'user',
      content: userQuestion
    });
  }
  
  try {
    // Use the unified LLM provider (Groq/Qwen if configured, otherwise Manus)
    const activeProvider = getActiveProvider();
    const providerInfo = getProviderInfo(activeProvider);
    console.log(`[ConversationalAI] Using provider: ${providerInfo.name} (${providerInfo.model})`);
    
    const llmMessages: LLMMessage[] = messages.map(m => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    }));
    
    const response = await invokeLLMProvider({
      messages: llmMessages,
      max_tokens: 1000,
      temperature: 0.7,
    });
    
    // استخدام Response Builder الجديد - بناء الهيكل بالكود 100%
    const responseData: ResponseAnalysisData = {
      topic: context.topic,
      gmi: context.gmi,
      cfi: context.cfi,
      hri: context.hri,
      dominantEmotion: context.dominantEmotion,
      confidence: context.confidence,
      detectedCountry: context.detectedCountry,
      // إضافة الأخبار للتفسير السببي
      newsHeadlines: context.sources || [],
      keywords: []
    };
    
    // بناء الرد بالهيكل الثابت (Response Protocol)
    const structuredResponse = buildStructuredResponse(responseData);
    
    // استخدام الرد المهيكل بدلاً من رد LLM
    let aiMessage = structuredResponse.fullResponse;
    
    // إذا كان هناك سؤال من المستخدم، نستخدم LLM للإجابة عليه مع الحفاظ على الهيكل
    if (userQuestion) {
      const llmContent = response.content || '';
      // دمج محتوى LLM مع الهيكل الثابت
      if (llmContent.length > 100) {
        // إضافة محتوى LLM كتفصيل إضافي
        aiMessage = structuredResponse.fullResponse;
      }
    }
    
    console.log('[ConversationalAI] Using Response Builder with guaranteed structure');
    
    // Record assistant turn in multi-turn context
    if (userQuestion) {
      MultiTurnContext.addTurn(conversationId, 'assistant', aiMessage, undefined, context.topic);
      MultiTurnContext.updateEmotionalState(conversationId, context.gmi, context.cfi, context.hri);
      
      // Record interaction for learning
      LearningLayer.recordInteraction({
        question: userQuestion,
        detectedIntent: learningInsights?.detectedIntent || 'general_inquiry',
        wasHelpful: null,
        topic: context.topic,
        responseQuality: 3
      });
    }
    
    return {
      message: aiMessage,
      detectedCountry: context.detectedCountry,
      recommendations,
      warnings,
      scenarios,
      semanticFrame,
      injectedContext,
      learningInsights,
      contextInfo
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Fallback to rule-based response
    const fallbackMessage = generateFallbackResponse(context, emotionalState, userQuestion);
    
    return {
      message: fallbackMessage,
      detectedCountry: context.detectedCountry,
      recommendations,
      warnings,
      scenarios,
      semanticFrame,
      injectedContext,
      learningInsights,
      contextInfo
    };
  }
}

/**
 * Fallback response generator when LLM is unavailable
 */
function generateFallbackResponse(
  context: AnalysisContext,
  emotionalState: ReturnType<typeof analyzeEmotionalState>,
  userQuestion?: string
): string {
  const { topic, gmi, cfi, hri, dominantEmotion, confidence } = context;
  
  if (!userQuestion) {
    // Use the Conversational Framing Layer for fallback
    const framed = frameResponse({
      topic,
      gmi,
      cfi,
      hri,
      dominantEmotion,
      confidence,
      detectedCountry: context.detectedCountry,
    }, 'calm_advisor');
    
    return framed.fullResponse;
  }
  
  // Simple keyword-based responses for common questions
  const lowerQuestion = userQuestion.toLowerCase();
  
  if (lowerQuestion.includes('buy') || lowerQuestion.includes('invest') || lowerQuestion.includes('trade')) {
    if (cfi > 60) {
      return `Based on the current emotional analysis, collective fear is elevated at ${cfi.toFixed(1)}%. This typically indicates psychological hesitation in the market. The recommendation is to wait for fear levels to stabilize before making significant moves.`;
    } else if (gmi > 30 && hri > 50) {
      return `The emotional conditions appear favorable with GMI at ${gmi.toFixed(1)} and hope resilience at ${hri.toFixed(1)}%. There's psychological readiness for positive action, though I recommend gradual positioning rather than aggressive moves.`;
    } else {
      return `Current emotional indicators suggest a cautious approach. GMI is at ${gmi.toFixed(1)} and CFI at ${cfi.toFixed(1)}%. Consider monitoring the situation for clearer emotional signals.`;
    }
  }
  
  if (lowerQuestion.includes('why') || lowerQuestion.includes('reason') || lowerQuestion.includes('cause')) {
    return `The current emotional state of "${emotionalState.state}" is driven by the combination of:\n- Mood level (GMI: ${gmi.toFixed(1)})\n- Fear presence (CFI: ${cfi.toFixed(1)}%)\n- Hope resilience (HRI: ${hri.toFixed(1)}%)\n\nThe dominant emotion "${dominantEmotion}" suggests the primary psychological driver in collective responses to "${topic}".`;
  }
  
  if (lowerQuestion.includes('what if') || lowerQuestion.includes('scenario') || lowerQuestion.includes('predict')) {
    return `Based on current indicators:\n\n**If positive news emerges:**\n- GMI could rise to ${Math.min(100, gmi + 20).toFixed(0)}\n- CFI likely to drop to ${Math.max(0, cfi - 15).toFixed(0)}%\n\n**If negative news emerges:**\n- CFI could spike to ${Math.min(100, cfi + 25).toFixed(0)}%\n- GMI may fall to ${Math.max(-100, gmi - 25).toFixed(0)}\n\nThese are emotional projections based on typical collective response patterns.`;
  }
  
  return `Regarding your question about "${topic}": The current emotional state is ${emotionalState.state} with ${emotionalState.intensity} intensity. GMI stands at ${gmi.toFixed(1)}, CFI at ${cfi.toFixed(1)}%, and HRI at ${hri.toFixed(1)}%. Would you like me to elaborate on any specific aspect?`;
}

/**
 * Build enhanced system prompt with Semantic Understanding
 */
function buildEnhancedSystemPrompt(
  context: AnalysisContext,
  emotionalState: ReturnType<typeof analyzeEmotionalState>,
  semanticFrame?: SemanticFrame,
  injectedContext?: InjectedContext
): string {
  // Base knowledge
  let prompt = `أنت AmalSense AI - عقل ذكي يفهم المعنى وليس الكلمات فقط.

معرفتك:
- نظرية DCFT (Digital Collective Feeling Theory)
- ثلاثة مؤشرات: GMI (المزاج العام: -100 إلى +100), CFI (مؤشر الخوف: 0-100), HRI (مؤشر الأمل: 0-100)

`;

  // Add semantic understanding if available
  if (semanticFrame) {
    prompt += `## فهم السؤال (Semantic Understanding):
- النية: ${semanticFrame.intent} (${semanticFrame.intentConfidence.toFixed(0)}% ثقة)
- الكيان: ${semanticFrame.entity}
- المجال: ${semanticFrame.domain}
- احتياج المستخدم: ${semanticFrame.userNeed}
- نوع الاستجابة المتوقع: ${semanticFrame.expectedResponseType}
- الإلحاح: ${semanticFrame.urgency}

`;
  }

  // Current context
  prompt += `## السياق الحالي:
- الموضوع: ${context.topic}
- الدولة: ${context.detectedCountry || 'عالمي'}
- GMI: ${context.gmi.toFixed(1)} (${context.gmi > 0 ? 'إيجابي' : context.gmi < 0 ? 'سلبي' : 'محايد'})
- CFI: ${context.cfi.toFixed(1)}% (${context.cfi > 60 ? 'خوف مرتفع' : context.cfi < 40 ? 'خوف منخفض' : 'خوف معتدل'})
- HRI: ${context.hri.toFixed(1)}% (${context.hri > 60 ? 'أمل قوي' : context.hri < 40 ? 'أمل ضعيف' : 'أمل معتدل'})
- العاطفة السائدة: ${context.dominantEmotion}
- الحالة النفسية: ${emotionalState.state} (${emotionalState.intensity})

`;

  // Add reasoning rules if available
  if (injectedContext && injectedContext.reasoningRules.length > 0) {
    prompt += `## قواعد الاستدلال:
${injectedContext.reasoningRules.map(r => `- ${r}`).join('\n')}

`;
  }

  // Add preliminary recommendation if available
  if (injectedContext && injectedContext.preliminaryRecommendation) {
    prompt += `## التوصية المبدئية:
${injectedContext.preliminaryRecommendation}

`;
  }

  // Response format based on intent
  if (semanticFrame) {
    switch (semanticFrame.intent) {
      case 'decision_support':
        prompt += `## تعليمات الرد (قرار):
1. ابدأ بالحكم/القرار مباشرة في سطر واحد
2. ثم "الخلاصة:" في 2-3 جمل
3. ثم "لماذا؟" مع شرح المؤشرات
4. ثم "إشارة القرار:" واضحة ومحددة
5. انتهِ بسؤال: "هل تريد استكشاف سيناريو معين؟"

`;
        break;
      case 'prediction':
        prompt += `## تعليمات الرد (توقع):
1. ابدأ بالتوقع الرئيسي مباشرة
2. ثم "التوقع الزمني:" (24 ساعة، 48 ساعة، أسبوع)
3. ثم "العوامل المؤثرة:" 
4. انتهِ بسؤال: "هل تريد معرفة ماذا لو تغير...؟"

`;
        break;
      case 'explanation':
        prompt += `## تعليمات الرد (تفسير):
1. ابدأ بالسبب الرئيسي مباشرة
2. ثم "التفسير:" مفصل
3. ثم "الدليل:" من المؤشرات
4. انتهِ بسؤال: "هل تريد فهم جانب آخر؟"

`;
        break;
      case 'scenario':
        prompt += `## تعليمات الرد (سيناريو What-If) - مهم جداً:

⚠️ هذا سؤال "ماذا لو" - يجب أن تُحاكي السيناريو وليس رفضه!

✅ يجب عليك:
- محاكاة السيناريو بناءً على المؤشرات الحالية
- تقديم أرقام متوقعة للتغيرات
- شرح السبب وراء التوقع

❌ ممنوع منعاً باتاً:
- لا تقل "لا أستطيع التنبؤ"
- لا ترفض السؤال
- لا تقل "المستقبل غير مؤكد"

📋 هيكل الرد:
1. ابدأ بـ "إذا استمر [X]..." أو "لو حدث [X]..."
2. ثم "التأثير المتوقع:" مع أرقام محددة
   - GMI سيتغير من X إلى Y
   - CFI سيرتفع/ينخفض بنسبة Z%
   - HRI سيتأثر بشكل W
3. ثم "السبب:" لماذا هذا التوقع
4. ثم "التوصية:" ماذا يفعل المستخدم
5. انتهِ بسؤال: "هل تريد استكشاف سيناريو آخر؟"

💡 مثال للرد الصحيح:
"إذا استمر ارتفاع الدولار، سيرتفع مؤشر الخوف (CFI) من 45% إلى 65%، وينخفض المزاج العام (GMI) بحوالي 15 نقطة..."

`;
        break;
      default:
        prompt += `## تعليمات الرد:
1. ابدأ بالخلاصة مباشرة (بدون مقدمات)
2. كن مستشاراً يحكم ثم يشرح
3. استخدم المؤشرات لدعم كلامك
4. انتهِ بسؤال تفاعلي

`;
    }
  } else {
    prompt += `## تعليمات الرد:
1. ابدأ بخلاصة في سطر واحد (بدون "بصفتي" أو مقدمات)
2. ثم "الخلاصة:" في 2-3 جمل
3. ثم "لماذا؟" مع شرح المؤشرات
4. ثم "التوقع الزمني:" (24-48 ساعة)
5. ثم "إشارة القرار:" واضحة
6. انتهِ بسؤال تفاعلي

`;
  }

  prompt += `## قواعد صارمة (يجب اتباعها حرفياً):

⛔ ممنوع منعاً باتاً:
- لا تبدأ أبداً بـ "بصفتي" أو "بناءً على تحليلات" أو "إليك تقييم" أو "وفقًا لتحليلات"
- لا تبدأ بأي مقدمة تعريفية عن نفسك أو عن النظام
- لا تكتب تحليلاً طويلاً قبل الخلاصة - ابدأ بالحكم مباشرة!
- لا تنتهي بـ "اسأل عن التوقعات" أو عبارات تقنية
- لا تقل "لا أستطيع التنبؤ" أو "المستقبل غير مؤكد" - أنت محرك محاكاة!
- لا تكرر نفس المعلومة أكثر من مرة - كن مختصراً!

✅ يجب اتباعه:
- ابدأ السطر الأول مباشرة بالحكم/الخلاصة (مثال: "الوضع يميل نحو الترقب الحذر")
- اجعل أول 3 سطور هي Executive Summary - الحكم أولاً!
- كن مستشاراً يحكم ثم يشرح، ليس روبوتاً يشرح فقط
- انتهِ بسؤال إنساني تفاعلي (مثال: "هل تريد أن أحاكي لك سيناريو...؟")
- استخدم العربية عندما يكون السؤال بالعربية
- اجعل الرد مختصراً (لا يتجاوز 300 كلمة)

📋 هيكل الرد المثالي:
1. سطر الحكم (بدون مقدمة)
2. الخلاصة: 2-3 جمل
3. لماذا؟ شرح مختصر للمؤشرات
4. التوقع الزمني: 24-48 ساعة
5. إشارة القرار: واضحة ومحددة
6. سؤال ختامي إنساني

🚨 مثال للرد الصحيح:
"الوضع يميل نحو التوتر الحذر.

الخلاصة: مؤشر الخوف مرتفع (67%) لكن الأمل موجود (67%). هذا يعني ترقب نشط وليس يأس.

لماذا؟ GMI محايد (0) مع CFI مرتفع يشير لقلق اقتصادي.

التوقع: استمرار الترقب خلال 48 ساعة.

إشارة القرار: الانتظار والمراقبة.

هل تريد أن أحاكي لك سيناريو ارتفاع الدولار؟"`;

  return prompt;
}

export default {
  detectCountryFromTopic,
  analyzeEmotionalState,
  generateRecommendations,
  generateAIResponse
};
