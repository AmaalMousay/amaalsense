/**
 * Intelligent Pipeline - The Accumulative ASI Orchestrator
 * Orchestrates Smart Query, Memory consultation, and Humanized Response.
 */

import { buildSmartQuery, type SmartQuery } from './smartQueryBuilder';
import {
  interpretNewsCauses,
  makeEmotionalDecision,
  type InterpretedCauses,
  type DecisionResult
} from './llmInterpreter';
import {
  buildFluentResponse,
  type FluentResponse
} from './fluentResponseBuilder';
import {
  detectCognitivePattern,
  type CognitiveOutput,
  COGNITIVE_PATTERNS
} from './humanCognitiveLayer';
import { getFullContext } from './sessionContext';
import { determineResponseStructure, type ResponseStructure } from './dynamicResponseEngine';
import { applyConsultantStyle } from './narrativeStyleEngine';
import { smartInvokeLLM } from '../smartLLM';
import { getCumulativeInsight } from '../engines/learningStore'; // الربط بالذاكرة التراكمية

export interface PipelineInput {
  question: string;
  topic?: string;
  country?: string;
  newsItems: Array<{
    title: string;
    description?: string;
    source: string;
  }>;
  emotionData: {
    fear: number;
    hope: number;
    anger: number;
    gmi: number;
    cfi: number;
    hri: number;
  };
  sessionId?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  userRole?: string;
  networkContext?: any;
}

export interface PipelineOutput {
  formattedResponse: string;
  response: FluentResponse;
  interpretation: InterpretedCauses;
  decision: DecisionResult;
  cognitivePattern: CognitiveOutput;
  smartQuery?: SmartQuery;
  metadata: {
    newsAnalyzed: number;
    sourcesUsed: number;
    confidence: number;
    processingSteps: string[];
    cognitivePatternName: string;
    memoryRecall?: string; // أضفنا مؤشر استرجاع الذاكرة
  };
}

/**
 * Modern Humanized Formatter with Memory Injection
 * يدمج المعلومات اللحظية مع البصيرة التراكمية في سرد واحد
 */
async function generateHumanNarrative(
  response: FluentResponse,
  networkContext?: any,
  deepMemory?: any
): Promise<string> {
  // بناء سياق الذاكرة إذا وجد
  const memoryContext = deepMemory && typeof deepMemory !== 'string'
    ? `Recall from deep memory: Based on ${deepMemory.observationsCount} previous observations, the field shows ${deepMemory.totalIntensity} intensity.`
    : "Field context: This is a fresh vector observation.";

  const prompt = `
    As AmalSense ASI, synthesize this into a professional English narrative:
    - Current Analysis: ${response.summary}
    - Historical Memory: ${memoryContext}
    - Underlying Causes: ${response.whySection || response.causesSection}
    - Physical Context: ${JSON.stringify(networkContext || "Stable field")}
    
    Task: Write a single, fluid, conscious paragraph. No headers. No labels. 
    Connect the past (memory) with the present (news) to provide a unified insight.
  `;

  const result = await smartInvokeLLM({ prompt: prompt });
  return typeof result === 'string' ? result : result?.text || response.summary;
}

export async function runIntelligentPipeline(input: PipelineInput): Promise<PipelineOutput> {
  console.log('[IntelligentPipeline] Processing query with Memory Sync:', input.question.substring(0, 50));

  const processingSteps: string[] = [];
  const sessionId = input.sessionId || 'default';
  const { session, effectiveContext } = getFullContext(sessionId, input.question);

  const isFollowUp = effectiveContext.isFollowUp;
  const questionNumber = effectiveContext.questionNumber;

  // Step 1: Logic & Structure
  const responseStructure = determineResponseStructure({
    questionIntent: session.questionHistory[session.questionHistory.length - 1]?.intent || { type: 'what', isFollowUp: false, requiresContext: false },
    questionNumber,
    userRole: input.userRole || 'general',
    isFollowUp,
    hasContext: !!effectiveContext.topic
  });
  processingSteps.push('Session Context & Structure Defined');

  // Step 2: Cumulative Memory Recall (الفكرة التراكمية)
  processingSteps.push('Recalling Deep Memory Store');
  const deepMemory = getCumulativeInsight(input.topic || 'general');

  // Step 3: Real-time Interpretation
  const interpretation = await interpretNewsCauses(input.newsItems, input.question, input.emotionData);
  const decision = await makeEmotionalDecision(input.question, interpretation, input.emotionData);
  const cognitivePattern = await detectCognitivePattern({
    question: input.question,
    interpretation,
    decision,
    emotionData: input.emotionData
  });
  processingSteps.push('Cognitive Patterns & Decisions Resolved');

  // Step 4: Build Response Components
  const response = await buildFluentResponse({
    question: input.question,
    interpretedCauses: interpretation,
    decision,
    emotionData: input.emotionData,
    newsCount: input.newsItems.length,
    sourcesCount: new Set(input.newsItems.map(n => n.source)).size,
    cognitivePattern,
    isFollowUp,
    questionNumber,
    responseStructure,
    sessionContext: { ...effectiveContext, deepMemory } // حقن الذاكرة في السياق
  });

  // Step 5: Final Humanized Synthesis (past + present)
  let formattedResponse = await generateHumanNarrative(response, input.networkContext, deepMemory);
  formattedResponse = applyConsultantStyle(formattedResponse);

  return {
    formattedResponse,
    response,
    interpretation,
    decision,
    cognitivePattern,
    metadata: {
      newsAnalyzed: input.newsItems.length,
      sourcesUsed: new Set(input.newsItems.map(n => n.source)).size,
      confidence: interpretation.confidence,
      processingSteps,
      cognitivePatternName: COGNITIVE_PATTERNS[cognitivePattern.primaryPattern].nameEn,
      memoryRecall: deepMemory && typeof deepMemory !== 'string' ? `${deepMemory.observationsCount} nodes` : 'Fresh'
    }
  };
}

export async function quickResponse(question: string, cached?: InterpretedCauses): Promise<string> {
  return cached ? cached.summary : `Accessing cognitive vectors for: ${question}`;
}