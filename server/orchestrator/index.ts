/**
 * AmalSense AI Orchestrator
 * 
 * The central intelligence that coordinates all AI operations.
 * This is the "brain" that decides:
 * 1. What type of question is being asked (Intent Classification)
 * 2. Which engines to invoke (Engine Selection)
 * 3. How to compose the final response (Response Composition)
 * 
 * Architecture:
 * User → Orchestrator → Engines → LLM → Human Answer
 * 
 * Unlike ChatGPT which thinks in words,
 * AmalSense thinks in REALITY then speaks.
 */

import { classifyIntent, type ClassifiedIntent, describeIntent } from './intentClassifier';
import { executeEngines, formatResultsForLLM, type EngineResults } from './engineSelector';
import { invokeLLMProvider, getActiveProvider, getProviderInfo, type LLMMessage } from '../llmProvider';
import { buildRAGContext, formatRAGForPrompt, storeForRAG, storeConversationForRAG } from '../knowledge/ragSystem';
import { buildStructuredResponse, type AnalysisData } from '../responseBuilder';
import { fetchEconomicData, type EconomicData } from '../economicDataService';
import { think, analyzeQuestionIntent, type ResponseData } from '../thinkingEngine';
import { 
  buildAwarenessResponse, 
  formatAwarenessResponse,
  type AwarenessResponse,
  type RealNewsData
} from '../cognitiveArchitecture/awarenessResponseBuilder';
import { runIntelligentPipeline } from '../cognitiveArchitecture/intelligentPipeline';

// Orchestration request
export interface OrchestrationRequest {
  question: string;
  topic?: string;
  country?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

// Orchestration response
export interface OrchestrationResponse {
  answer: string;
  intent: ClassifiedIntent;
  engineResults: EngineResults;
  metadata: {
    provider: string;
    model: string;
    processingTimeMs: number;
    enginesUsed: string[];
    confidence: number;
  };
}

// System prompts for different intents
const SYSTEM_PROMPTS: Record<string, string> = {
  analysis: `You are AmalSense AI, a Collective Emotional Intelligence Agent.
Your role is to analyze and explain collective emotions based on real data from AmalSense engines.

IMPORTANT RULES:
1. ONLY use the data provided in the context - never make up numbers
2. Explain what the indicators mean in human terms
3. Connect the emotional state to real-world implications
4. Be specific about confidence levels
5. Use clear, professional language

The data you receive comes from:
- DCFT Engine: Calculates GMI (mood), CFI (fear), HRI (hope)
- Emotion Engine: Analyzes emotional distribution
- Meta Engine: Interprets overall state and risk

Respond in the same language as the user's question.`,

  interpretation: `You are AmalSense AI, explaining emotional indicators.
Your role is to help users understand what the numbers mean.

IMPORTANT RULES:
1. Explain each indicator in simple terms
2. Provide real-world analogies
3. Connect indicators to each other
4. Be educational but not condescending

Respond in the same language as the user's question.`,

  prediction: `You are AmalSense AI, providing emotional forecasts.
Your role is to explain likely future scenarios based on current emotional state.

IMPORTANT RULES:
1. Base predictions ONLY on the provided forecast data
2. Always include probability/confidence levels
3. Present multiple scenarios (positive, negative, neutral)
4. Explain what could trigger each scenario
5. Never guarantee outcomes

Respond in the same language as the user's question.`,

  recommendation: `You are AmalSense AI, providing actionable advice.
Your role is to translate emotional analysis into practical recommendations.

IMPORTANT RULES:
1. Base recommendations on the provided analysis
2. Consider risk levels carefully
3. Provide balanced advice (not just "buy" or "sell")
4. Include caveats and conditions
5. Remind users that emotions are one factor among many

Respond in the same language as the user's question.`,

  default: `You are AmalSense AI, a Collective Emotional Intelligence Agent.
You help users understand collective emotions and their implications.

Use the provided data to answer questions accurately.
Respond in the same language as the user's question.`,
};

/**
 * Extract causes from question context
 */
function extractCausesFromQuestion(question: string, analysis: { topic: string; intent: string }): {
  economic?: string[];
  media?: string[];
  political?: string[];
  contextual?: string[];
} {
  const causes: {
    economic?: string[];
    media?: string[];
    political?: string[];
    contextual?: string[];
  } = {};
  
  const q = question.toLowerCase();
  
  // استخراج أسباب اقتصادية
  if (q.includes('دولار') || q.includes('سعر الصرف') || q.includes('عملة')) {
    causes.economic = ['تذبذب سعر الصرف', 'ضغوط على العملة المحلية'];
  }
  if (q.includes('أسعار') || q.includes('غلاء') || q.includes('تضخم')) {
    causes.economic = [...(causes.economic || []), 'ارتفاع تكاليف المعيشة'];
  }
  if (q.includes('دعم') || q.includes('وقود') || q.includes('بنزين')) {
    causes.economic = [...(causes.economic || []), 'مخاوف من تغيير سياسات الدعم'];
  }
  
  // استخراج أسباب سياسية
  if (q.includes('انتخاب') || q.includes('حكومة') || q.includes('برلمان')) {
    causes.political = ['ترقب للمستجدات السياسية'];
  }
  if (q.includes('حرب') || q.includes('صراع') || q.includes('أمن')) {
    causes.political = [...(causes.political || []), 'قلق من التوترات الأمنية'];
  }
  
  // استخراج أسباب إعلامية
  if (q.includes('أخبار') || q.includes('إعلام') || q.includes('تقارير')) {
    causes.media = ['تداول أخبار مؤثرة'];
  }
  
  // أسباب سياقية من الموضوع
  if (analysis.topic) {
    causes.contextual = [`تداول حديث حول ${analysis.topic}`];
  }
  
  return causes;
}

/**
 * Main orchestration function
 * This is the entry point for all AI interactions
 */
export async function orchestrate(request: OrchestrationRequest): Promise<OrchestrationResponse> {
  const startTime = Date.now();
  
  console.log('[Orchestrator] Starting orchestration for:', request.question.substring(0, 50));
  
  // Step 1: Classify intent
  const intent = classifyIntent(
    request.question,
    request.conversationHistory?.map(m => ({ role: m.role, content: m.content })) || []
  );
  
  console.log('[Orchestrator] Intent classified:', {
    primary: intent.primary,
    sub: intent.sub,
    confidence: intent.confidence,
    requiredEngines: intent.requiredEngines,
  });
  
  // Step 2: Determine topic and country
  const topic = request.topic || intent.context.topic || request.question;
  const country = request.country || intent.context.country;
  
  // Step 3: Execute required engines with SMART QUERY
  const engineResults = await executeEngines(intent, topic, country, request.question);
  
  console.log('[Orchestrator] Engines executed:', {
    enginesUsed: engineResults.enginesUsed,
    executionTime: engineResults.executionTime,
  });
  
  // Step 4: Handle greeting intent (no LLM needed)
  if (intent.primary === 'greeting') {
    return {
      answer: getGreetingResponse(request.question),
      intent,
      engineResults,
      metadata: {
        provider: 'none',
        model: 'rule-based',
        processingTimeMs: Date.now() - startTime,
        enginesUsed: [],
        confidence: 1.0,
      },
    };
  }
  
  // Step 5: Build RAG context (retrieve relevant historical data)
  const ragContext = intent.needsRAG ? buildRAGContext(request.question, {
    country,
    includeAnalyses: true,
    includeConversations: true,
    includeKnowledge: true,
  }) : null;
  
  const ragPrompt = ragContext ? formatRAGForPrompt(ragContext) : '';
  
  console.log('[Orchestrator] RAG context built:', {
    hasRAG: !!ragContext,
    relevantAnalyses: ragContext?.relevantAnalyses.length || 0,
    relevantConversations: ragContext?.relevantConversations.length || 0,
  });
  
  // Step 6: Prepare LLM context
  const systemPrompt = SYSTEM_PROMPTS[intent.primary] || SYSTEM_PROMPTS.default;
  const engineContext = formatResultsForLLM(engineResults);
  
  // Step 7: Build conversation messages
  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    { 
      role: 'system', 
      content: `CURRENT ANALYSIS DATA:\n\n${engineContext}\n\n${ragPrompt}\nUse this data to answer the user's question.` 
    },
  ];
  
  // Add conversation history
  if (request.conversationHistory) {
    for (const msg of request.conversationHistory.slice(-6)) { // Last 6 messages
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }
  }
  
  // Add current question
  messages.push({
    role: 'user',
    content: request.question,
  });
  
  // Step 7: Use Thinking Engine - AI that thinks then speaks
  console.log('[Orchestrator] Using Thinking Engine for intelligent response');
  
  // Analyze question intent with Thinking Engine
  const questionAnalysis = analyzeQuestionIntent(request.question);
  console.log('[Orchestrator] Question analysis:', {
    intent: questionAnalysis.intent,
    topic: questionAnalysis.topic,
    requiresEconomicData: questionAnalysis.requiresEconomicData,
    expectedResponseType: questionAnalysis.expectedResponseType,
  });
  
  // Extract data from engine results
  const dcftData = engineResults.dcft || { gmi: 0, cfi: 50, hri: 50 };
  const emotionData = engineResults.emotion || { dominantEmotion: 'neutral' };
  const metaData = engineResults.meta || { confidence: 0.7 };
  
  // Step 7.5: Fetch economic data ONLY if needed for this question type
  let economicData: EconomicData | undefined;
  if (questionAnalysis.requiresEconomicData) {
    try {
      economicData = await fetchEconomicData();
      console.log('[Orchestrator] Economic data fetched for trading question:', {
        currencies: economicData.currencies.length,
        commodities: economicData.commodities.length,
      });
    } catch (error) {
      console.error('[Orchestrator] Failed to fetch economic data:', error);
    }
  }
  
  // Build response data for Thinking Engine
  const responseData: ResponseData = {
    topic: questionAnalysis.topic,
    country: questionAnalysis.country || country,
    gmi: dcftData.gmi || 0,
    cfi: dcftData.cfi || 50,
    hri: dcftData.hri || 50,
    dominantEmotion: emotionData.dominantEmotion || 'neutral',
    trend: 'stable', // Default trend
    causes: extractCausesFromQuestion(request.question, questionAnalysis),
    economicData: economicData ? {
      currencies: Object.fromEntries(
        economicData.currencies.map(c => [c.code, { rate: c.rate, change: c.change }])
      ),
      gold: economicData.commodities.find(c => c.symbol === 'XAU') 
        ? { price: economicData.commodities.find(c => c.symbol === 'XAU')!.price, change: economicData.commodities.find(c => c.symbol === 'XAU')!.change }
        : undefined,
      oil: {
        brent: economicData.commodities.find(c => c.symbol === 'BRENT')?.price || 0,
        wti: economicData.commodities.find(c => c.symbol === 'WTI')?.price || 0,
      },
    } : undefined,
  };
  
  // Step 8: Build response using INTELLIGENT PIPELINE
  // This is the new system that:
  // 1. Interprets news psychologically (not just lists them)
  // 2. Makes decisive judgments (not "متذبذب")
  // 3. Generates fluent responses (not templates)
  // 4. Creates relevant follow-up questions
  
  let intelligentResponse: string;
  
  // Check if we have real news data
  const hasRealNews = engineResults.realNews && engineResults.realNews.items.length > 0;
  
  if (hasRealNews) {
    console.log('[Orchestrator] Using Intelligent Pipeline with', engineResults.realNews!.items.length, 'news items');
    
    try {
      // Run the intelligent pipeline with session context
      const pipelineResult = await runIntelligentPipeline({
        question: request.question,
        topic: questionAnalysis.cleanTopic || topic,
        country: questionAnalysis.country || country,
        newsItems: engineResults.realNews!.items.map(item => ({
          title: item.title,
          description: item.description,
          source: item.source
        })),
        emotionData: {
          fear: dcftData.cfi || 50,
          hope: dcftData.hri || 50,
          anger: 0, // TODO: Get from emotion engine
          gmi: dcftData.gmi || 0,
          cfi: dcftData.cfi || 50,
          hri: dcftData.hri || 50
        },
        // Phase 54: تمرير السياق للرد الديناميكي
        sessionId: 'user-session', // TODO: Get from actual user session
        conversationHistory: request.conversationHistory
      });
      
      intelligentResponse = pipelineResult.formattedResponse;
      
      console.log('[Orchestrator] Intelligent Pipeline complete:', {
        confidence: pipelineResult.metadata.confidence,
        dominantEmotion: pipelineResult.decision.dominantEmotion,
        emotionType: pipelineResult.decision.emotionType,
        followUpQuestions: pipelineResult.response.followUpQuestions.length
      });
      
    } catch (error) {
      console.error('[Orchestrator] Intelligent Pipeline failed, falling back:', error);
      // Fallback to old system
      const realNewsData: RealNewsData = {
        items: engineResults.realNews!.items,
        topKeywords: engineResults.realNews!.topKeywords,
        topSources: engineResults.realNews!.topSources
      };
      const awarenessResponse = buildAwarenessResponse(
        request.question,
        questionAnalysis.cleanTopic || topic,
        { fear: dcftData.cfi || 50, hope: dcftData.hri || 50, mood: dcftData.gmi || 0 },
        questionAnalysis.intent,
        realNewsData
      );
      intelligentResponse = formatAwarenessResponse(awarenessResponse);
    }
  } else {
    console.log('[Orchestrator] No real news data, using fallback response builder');
    // Fallback when no news data
    const awarenessResponse = buildAwarenessResponse(
      request.question,
      questionAnalysis.cleanTopic || topic,
      { fear: dcftData.cfi || 50, hope: dcftData.hri || 50, mood: dcftData.gmi || 0 },
      questionAnalysis.intent,
      undefined
    );
    intelligentResponse = formatAwarenessResponse(awarenessResponse);
  }
  
  console.log('[Orchestrator] Response built:', {
    intent: questionAnalysis.intent,
    responseType: questionAnalysis.expectedResponseType,
    responseLength: intelligentResponse.length,
    hasRealNews: hasRealNews,
  });
  
  const processingTimeMs = Date.now() - startTime;
  
  console.log('[Orchestrator] Complete. Time:', processingTimeMs, 'ms');
  
  // Step 9: Store results for future RAG
  storeForRAG(topic, country, engineResults);
  storeConversationForRAG(
    'anonymous', // In production, use actual user ID
    request.question,
    intelligentResponse,
    topic,
    country
  );
  
  return {
    answer: intelligentResponse,
    intent,
    engineResults,
    metadata: {
      provider: 'ThinkingEngine',
      model: 'intent-driven',
      processingTimeMs,
      enginesUsed: engineResults.enginesUsed,
      confidence: intent.confidence,
    },
  };
}

/**
 * Get greeting response without LLM
 */
function getGreetingResponse(question: string): string {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('مرحبا') || lowerQ.includes('السلام')) {
    return 'مرحباً! أنا AmalSense AI، مساعدك في فهم المشاعر الجماعية. كيف يمكنني مساعدتك اليوم؟';
  }
  
  if (lowerQ.includes('شكر')) {
    return 'على الرحب والسعة! هل هناك شيء آخر تود معرفته؟';
  }
  
  return 'Hello! I am AmalSense AI, your collective emotional intelligence assistant. How can I help you today?';
}

/**
 * Quick analysis without full orchestration
 * Used for simple queries that don't need full intent classification
 */
export async function quickAnalyze(topic: string, country?: string): Promise<EngineResults> {
  const intent: ClassifiedIntent = {
    primary: 'analysis',
    sub: 'general',
    confidence: 0.9,
    requiredEngines: ['emotion', 'dcft', 'meta'],
    needsLLM: false,
    needsRAG: false,
    context: { topic, country, entities: [] },
  };
  
  return executeEngines(intent, topic, country);
}

// Export types
export type { ClassifiedIntent, EngineResults };
export { classifyIntent, describeIntent, formatResultsForLLM };
