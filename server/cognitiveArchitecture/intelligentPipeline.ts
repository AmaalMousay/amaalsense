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
  formatFluentResponse,
  type FluentResponse 
} from './fluentResponseBuilder';

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
  
  // Smart query used
  smartQuery?: SmartQuery;
  
  // Metadata
  metadata: {
    newsAnalyzed: number;
    sourcesUsed: number;
    confidence: number;
    processingSteps: string[];
  };
}

/**
 * Run the intelligent pipeline
 * This is the main entry point for generating intelligent responses
 */
export async function runIntelligentPipeline(input: PipelineInput): Promise<PipelineOutput> {
  console.log('[IntelligentPipeline] Starting pipeline for:', input.question.substring(0, 50));
  
  const processingSteps: string[] = [];
  
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
  
  // Step 4: Build fluent response
  const response = await buildFluentResponse({
    question: input.question,
    interpretedCauses: interpretation,
    decision,
    emotionData: input.emotionData,
    newsCount: input.newsItems.length,
    sourcesCount: new Set(input.newsItems.map(n => n.source)).size
  });
  processingSteps.push('Response Built');
  
  // Format the response
  const formattedResponse = formatFluentResponse(response);
  
  console.log('[IntelligentPipeline] Pipeline complete');
  
  return {
    formattedResponse,
    response,
    interpretation,
    decision,
    smartQuery,
    metadata: {
      newsAnalyzed: input.newsItems.length,
      sourcesUsed: new Set(input.newsItems.map(n => n.source)).size,
      confidence: interpretation.confidence,
      processingSteps
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
