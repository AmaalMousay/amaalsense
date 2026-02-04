/**
 * Intelligent Pipeline
 * 
 * The main orchestrator that connects all cognitive components:
 * 1. Smart Query Builder - understands what to search for
 * 2. LLM Interpreter - understands what the news means
 * 3. Decision Engine - makes decisive judgments
 * 4. Fluent Response Builder - speaks naturally
 * 
 * This replaces the old template-based system with a truly intelligent one.
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
  type CognitivePattern,
  COGNITIVE_PATTERNS
} from './humanCognitiveLayer';
// المكونات الجديدة - Phase 54
import { getFullContext } from './sessionContext';
import { determineResponseStructure, generateFormattingInstructions, type ResponseStructure } from './dynamicResponseEngine';
import { generateStyleInstructions, applyConsultantStyle, generateConsultantQuestions } from './narrativeStyleEngine';

/**
 * Format FluentResponse object to string
 */
function formatResponseAsString(response: FluentResponse): string {
  const parts: string[] = [];
  
  if (response.summary) {
    parts.push(`الخلاصة: ${response.summary}`);
  }
  
  if (response.whySection) {
    parts.push(`\nلماذا هذا المزاج؟ ${response.whySection}`);
  }
  
  if (response.causesSection) {
    parts.push(`\nالأسباب الرئيسية: ${response.causesSection}`);
  }
  
  if (response.meaningSection) {
    parts.push(`\nماذا يعني للمجتمع؟ ${response.meaningSection}`);
  }
  
  if (response.cognitiveInsight) {
    parts.push(`\nكيف يفكر الناس؟ ${response.cognitiveInsight}`);
  }
  
  if (response.recommendationSection) {
    parts.push(`\nالتوصية: ${response.recommendationSection}`);
  }
  
  if (response.followUpQuestions && response.followUpQuestions.length > 0) {
    parts.push(`\nأسئلة للاستكشاف:`);
    response.followUpQuestions.forEach((q, i) => {
      parts.push(`${i + 1}. ${q}`);
    });
  }
  
  return parts.join('\n');
}

/**
 * اختصار رد المتابعة
 * لأن سؤال المتابعة لا يحتاج تحليل كامل
 */
function shortenFollowUpResponse(response: string, maxLength: 'short' | 'medium' | 'long'): string {
  const lines = response.split('\n');
  
  if (maxLength === 'short') {
    // فقط الخلاصة والتوصية
    const summary = lines.find(l => l.includes('الخلاصة'));
    const recommendation = lines.find(l => l.includes('التوصية'));
    const questions = lines.filter(l => l.match(/^\d+\./));
    
    const parts: string[] = [];
    if (summary) parts.push(summary);
    if (recommendation) parts.push(recommendation);
    if (questions.length > 0) {
      parts.push('\n**أسئلة للاستكشاف:**');
      parts.push(...questions.slice(0, 2));
    }
    
    return parts.join('\n');
  }
  
  if (maxLength === 'medium') {
    // حذف قسم "كيف يفكر الناس" و"ماذا يعني للمجتمع"
    const filtered = lines.filter(l => {
      if (l.includes('كيف يفكر الناس')) return false;
      if (l.includes('النمط المعرفي:')) return false;
      if (l.includes('السؤال الداخلي:')) return false;
      if (l.includes('ماذا يعني هذا للمجتمع')) return false;
      return true;
    });
    return filtered.join('\n');
  }
  
  return response;
}

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
  // المعلمات الجديدة - Phase 54
  sessionId?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  userRole?: string;
}

export interface PipelineOutput {
  // The formatted response text
  formattedResponse: string;
  
  // Structured response for UI
  response: FluentResponse;
  
  // Interpretation details
  interpretation: InterpretedCauses;
  
  // Decision details
  decision: DecisionResult;
  
  // Human cognitive pattern - HOW people are THINKING
  cognitivePattern: CognitiveOutput;
  
  // Smart query used
  smartQuery?: SmartQuery;
  
  // Metadata
  metadata: {
    newsAnalyzed: number;
    sourcesUsed: number;
    confidence: number;
    processingSteps: string[];
    cognitivePatternName: string;
  };
}

/**
 * Run the intelligent pipeline
 * This is the main entry point for generating intelligent responses
 */
export async function runIntelligentPipeline(input: PipelineInput): Promise<PipelineOutput> {
  console.log('[IntelligentPipeline] Starting pipeline for:', input.question.substring(0, 50));
  
  const processingSteps: string[] = [];
  
  // Step 0: الحصول على السياق من Session Context
  const sessionId = input.sessionId || 'default';
  const { session, effectiveContext } = getFullContext(sessionId, input.question);
  
  // تحديد هل هذا سؤال متابعة
  const isFollowUp = effectiveContext.isFollowUp;
  const questionNumber = effectiveContext.questionNumber;
  
  console.log('[IntelligentPipeline] Session context:', {
    isFollowUp,
    questionNumber,
    country: effectiveContext.country,
    topic: effectiveContext.topic
  });
  
  // Step 0.5: تحديد هيكل الرد بناء على نوع السؤال
  const lastIntent = session.questionHistory[session.questionHistory.length - 1]?.intent;
  const responseStructure = determineResponseStructure({
    questionIntent: lastIntent || { type: 'what', isFollowUp: false, requiresContext: false },
    questionNumber,
    userRole: input.userRole || 'general',
    isFollowUp,
    hasContext: !!effectiveContext.topic
  });
  
  console.log('[IntelligentPipeline] Response structure:', {
    format: responseStructure.format,
    maxLength: responseStructure.maxLength,
    isFollowUp
  });
  processingSteps.push('Session Context Loaded');
  
  // Step 1: Build smart query (for logging/debugging)
  let smartQuery: SmartQuery | undefined;
  try {
    smartQuery = await buildSmartQuery(input.question);
    processingSteps.push('Smart Query Built');
    console.log('[IntelligentPipeline] Smart query:', smartQuery.primaryTerms);
  } catch (error) {
    console.error('[IntelligentPipeline] Smart query failed:', error);
  }
  
  // Step 2: Interpret news causes
  const interpretation = await interpretNewsCauses(
    input.newsItems,
    input.question,
    {
      fear: input.emotionData.fear,
      hope: input.emotionData.hope,
      anger: input.emotionData.anger
    }
  );
  processingSteps.push('News Interpreted');
  console.log('[IntelligentPipeline] Interpretation:', {
    causes: interpretation.psychologicalCauses.length,
    tone: interpretation.emotionalTone
  });
  
  // Step 3: Make emotional decision
  const decision = await makeEmotionalDecision(
    input.question,
    interpretation,
    input.emotionData
  );
  processingSteps.push('Decision Made');
  console.log('[IntelligentPipeline] Decision:', {
    emotion: decision.dominantEmotion,
    type: decision.emotionType
  });
  
  // Step 4: Detect cognitive pattern - HOW people are THINKING
  // This is the Human Cognitive Layer - it determines the thinking pattern
  const cognitivePattern = await detectCognitivePattern({
    question: input.question,
    interpretation,
    decision,
    emotionData: input.emotionData
  });
  processingSteps.push('Cognitive Pattern Detected');
  
  const patternInfo = COGNITIVE_PATTERNS[cognitivePattern.primaryPattern];
  console.log('[IntelligentPipeline] Cognitive Pattern:', {
    pattern: cognitivePattern.primaryPattern,
    nameAr: patternInfo.nameAr,
    innerQuestion: cognitivePattern.innerQuestion,
    confidence: cognitivePattern.confidence
  });
  
  // Step 5: Build fluent response WITH cognitive pattern AND session context
  const response = await buildFluentResponse({
    question: input.question,
    interpretedCauses: interpretation,
    decision,
    emotionData: input.emotionData,
    newsCount: input.newsItems.length,
    sourcesCount: new Set(input.newsItems.map(n => n.source)).size,
    cognitivePattern,
    // المعلمات الجديدة - Phase 54
    isFollowUp,
    questionNumber,
    responseStructure,
    sessionContext: effectiveContext
  });
  processingSteps.push('Response Built');
  
  // Format the response - استخدام أسلوب المستشار
  // Phase 57: Response is already formatted by buildFluentResponse with Perception Layer
  let formattedResponse = formatResponseAsString(response);
  
  // تطبيق أسلوب المستشار على الرد
  formattedResponse = applyConsultantStyle(formattedResponse);
  
  // إذا كان سؤال متابعة، اختصر الرد
  if (isFollowUp && responseStructure.maxLength !== 'long') {
    formattedResponse = shortenFollowUpResponse(formattedResponse, responseStructure.maxLength);
  }
  
  console.log('[IntelligentPipeline] Pipeline complete');
  
  return {
    formattedResponse,
    response,
    interpretation,
    decision,
    cognitivePattern,
    smartQuery,
    metadata: {
      newsAnalyzed: input.newsItems.length,
      sourcesUsed: new Set(input.newsItems.map(n => n.source)).size,
      confidence: interpretation.confidence,
      processingSteps,
      cognitivePatternName: patternInfo.nameAr
    }
  };
}

/**
 * Quick response for simple questions
 * Uses cached interpretations when available
 */
export async function quickResponse(
  question: string,
  cachedInterpretation?: InterpretedCauses
): Promise<string> {
  if (cachedInterpretation) {
    return cachedInterpretation.summary;
  }
  
  return `جاري تحليل: ${question}`;
}
