/**
 * Cognitive Engine - The Brain of AmalSense
 * 
 * This is the main entry point that orchestrates all cognitive layers:
 * 1. Question Understanding - Understand what the user really wants
 * 2. Cognitive Routing - Decide WHICH MIND to activate (not where to search)
 * 3. Context Building - Build knowledge from engine outputs
 * 4. Intelligent Narration - Explain like a wise consultant
 * 
 * Philosophy:
 * - This is NOT Machine Learning, it's Cognitive System Design
 * - We build a MIND that thinks, not a model that predicts
 * - LLM is just a language tool, the thinking happens here
 * - We don't "search the world" - we "interpret the world"
 */

import { understandQuestion, type DeepQuestion } from './questionUnderstanding';
import { 
  routeQuestion, 
  activateEngines, 
  type CognitiveOutput, 
  type EmotionIndicators,
  type RouterDecision 
} from './cognitiveRouter';
import { buildKnowledgeFromCognitive, type KnowledgePacket } from './contextBuilder';
import { narrateResponse, adaptToExpertise, addEmotionalSupport, type NarratedResponse } from './intelligentNarrator';

// The complete cognitive response
export interface CognitiveResponse {
  // The final text response
  text: string;
  
  // Structured sections for UI
  sections: {
    summary: string;
    causes: string;
    decision: string;
    recommendation: string;
    closingQuestion: string;
  };
  
  // Metadata
  metadata: {
    questionType: string;
    realIntent: string;
    confidence: number;
    processingPath: string[];
    enginesActivated: string[];
  };
  
  // For debugging/transparency
  understanding?: DeepQuestion;
  knowledge?: KnowledgePacket;
  routerDecision?: RouterDecision;
}

/**
 * Main cognitive processing function
 * Takes a question and returns an intelligent response
 */
export async function cognitiveProcess(
  question: string,
  existingIndicators?: EmotionIndicators,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<CognitiveResponse> {
  const processingPath: string[] = [];
  
  // Step 1: Understand the question deeply
  processingPath.push('Question Understanding');
  const understanding = understandQuestion(question, conversationHistory);
  
  // Step 2: Route to appropriate cognitive engines (NOT external sources!)
  processingPath.push('Cognitive Routing');
  const routerDecision = routeQuestion(understanding);
  
  // Step 3: Activate the selected cognitive engines
  processingPath.push('Engine Activation');
  const cognitiveOutput = await activateEngines(
    routerDecision,
    understanding,
    existingIndicators
  );
  
  // Step 4: Build knowledge packet from engine outputs
  processingPath.push('Context Building');
  const knowledge = buildKnowledgeFromCognitive(understanding, cognitiveOutput);
  
  // Step 5: Narrate the response intelligently
  processingPath.push('Intelligent Narration');
  let narratedResponse = narrateResponse(understanding, knowledge);
  
  // Step 6: Adapt to user expertise
  narratedResponse.text = adaptToExpertise(
    narratedResponse.text,
    understanding.context.userExpertise
  );
  
  // Step 7: Add emotional support if needed
  narratedResponse.text = addEmotionalSupport(
    narratedResponse.text,
    understanding.deep.emotionalNeed
  );
  
  // Build structured response
  return {
    text: narratedResponse.text,
    sections: {
      summary: narratedResponse.sections.opening,
      causes: extractCausesSection(narratedResponse.sections.body),
      decision: narratedResponse.sections.decision,
      recommendation: extractRecommendation(knowledge.decision),
      closingQuestion: narratedResponse.sections.closing
    },
    metadata: {
      questionType: understanding.surface.questionType,
      realIntent: understanding.deep.realIntent,
      confidence: knowledge.currentState.confidence,
      processingPath,
      enginesActivated: [
        routerDecision.primaryEngine,
        ...routerDecision.supportingEngines
      ]
    },
    understanding,
    knowledge,
    routerDecision
  };
}

/**
 * Extract causes section from body
 */
function extractCausesSection(body: string): string {
  const match = body.match(/\*\*لماذا هذا الوضع\?\*\*[\s\S]*?(?=\*\*|$)/);
  return match ? match[0] : '';
}

/**
 * Extract recommendation from decision
 */
function extractRecommendation(decision: KnowledgePacket['decision']): string {
  return `${decision.recommendation}\n\nالسبب: ${decision.reasoning}`;
}

/**
 * Quick cognitive response - for simple questions
 */
export async function quickCognitiveResponse(
  question: string,
  indicators?: EmotionIndicators
): Promise<string> {
  const response = await cognitiveProcess(question, indicators);
  return response.text;
}

// Re-export types for external use
export type {
  DeepQuestion,
  KnowledgePacket,
  NarratedResponse,
  EmotionIndicators,
  CognitiveOutput,
  RouterDecision
};

// Re-export individual functions for testing/debugging
export {
  understandQuestion,
  routeQuestion,
  activateEngines,
  buildKnowledgeFromCognitive,
  narrateResponse
};
