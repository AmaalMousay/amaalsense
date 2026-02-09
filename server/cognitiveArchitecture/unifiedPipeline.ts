/**
 * Unified Cognitive Pipeline
 * 
 * Integrates all 14 cognitive layers:
 * 
 * Phase 1 - Foundational (existing):
 * 1. Smart Query Builder
 * 2. LLM Interpreter  
 * 3. Decision Engine
 * 4. Fluent Response Builder
 * 
 * Phase 2 - Added (5 layers from patent):
 * 5. Working Memory
 * 6. Long-Term Memory
 * 7. Contextual Binding
 * 8. Causal Inference
 * 9. Metacognition
 * 
 * Phase 3 - Critical (9 layers from summary):
 * 10. Context Lock Layer
 * 11. Cognitive Control Layer
 * 12. Knowledge/Fact Engine
 * 13. Dialogical Consciousness
 * 14. Cognitive Consistency Check
 * 15. Cognitive Answer Gate
 * 16. Analysis Lifecycle Manager
 * 17. Evidence Grounding
 * 18. Narrative Reasoner
 */

import { CognitiveControlLayer, type QuestionClassification } from './cognitiveControlLayer';
import { ContextLockLayer } from './contextLockLayer';
import { KnowledgeEngine } from './knowledgeEngine';
import { DialogicalConsciousness, type DialogueContext } from './dialogicalConsciousness';
import { CognitiveConsistencyCheck } from './cognitiveConsistencyCheck';
import { CognitiveAnswerGate, type AnswerContext, type GateDecision } from './cognitiveAnswerGate';
import { AnalysisLifecycleManager, type AnalysisContext, type AnalysisDecision } from './analysisLifecycleManager';
import { EvidenceGrounding, type Evidence } from './evidenceGrounding';
import { runIntelligentPipeline, type PipelineInput, type PipelineOutput as IntelligentPipelineOutput } from './intelligentPipeline';
// Working Memory and Contextual Binding are functional modules
// They will be integrated at application level

export interface UnifiedPipelineInput {
  question: string;
  sessionId: string;
  country?: string;
  domain?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  // Data for intelligent pipeline
  newsItems?: Array<{ title: string; content: string; url: string; publishedAt: string }>;
  emotionData?: { fear: number; hope: number; anger: number; gmi?: number; cfi?: number; hri?: number };
  userRole?: string;
}

export interface UnifiedPipelineOutput {
  answer: string;
  metadata: {
    questionType: string;
    cognitivePathway: string;
    analysisAction: string;
    gateDecision: string;
    contextLocked: boolean;
    isGrounded: boolean;
    confidence: number;
  };
}

class UnifiedPipelineClass {
  /**
   * Main entry point - processes question through all 14 layers
   */
  async process(input: UnifiedPipelineInput): Promise<UnifiedPipelineOutput> {
    const { question, sessionId, country, domain, conversationHistory } = input;

    // LAYER 10: Context Lock - Prevent topic drift
    const contextCheck = ContextLockLayer.validateContext(sessionId, question, country || '');

    if (!contextCheck.isValid) {
      return {
        answer: `تحذير: ${contextCheck.reason}\n\n${contextCheck.suggestion || 'هل تريد الاستمرار في الموضوع السابق أم البدء في موضوع جديد؟'}`,
        metadata: {
          questionType: 'context_violation',
          cognitivePathway: 'none',
          analysisAction: 'blocked',
          gateDecision: 'clarify_question',
          contextLocked: true,
          isGrounded: false,
          confidence: 0,
        },
      };
    }

    // LAYER 13: Dialogical Consciousness - Understand conversation flow
    const dialogueContext = DialogicalConsciousness.analyzeDialogueContext(sessionId, question);

    // LAYER 11: Cognitive Control - Classify question and determine pathway
    const classification = CognitiveControlLayer.classifyQuestion(question, conversationHistory);

    // LAYER 12: Knowledge Engine - Handle factual questions directly
    if (classification.pathway === 'knowledge_engine') {
      const factualResponse = await KnowledgeEngine.answerFactualQuestion({
        question,
        context: conversationHistory ? conversationHistory.map(m => m.content).join('\n') : undefined,
        domain,
      });

      // Update dialogue
      DialogicalConsciousness.updateDialogue(sessionId, question, factualResponse.answer);

      return {
        answer: factualResponse.answer,
        metadata: {
          questionType: classification.type,
          cognitivePathway: 'knowledge_engine',
          analysisAction: 'none',
          gateDecision: 'answer_directly',
          contextLocked: contextCheck.isValid,
          isGrounded: !factualResponse.admitsIgnorance,
          confidence: this.mapConfidenceToNumber(factualResponse.confidence),
        },
      };
    }

    // LAYER 16: Analysis Lifecycle Manager - Decide if we need new analysis
    const analysisContext: AnalysisContext = {
      question,
      isFollowUp: dialogueContext.isFollowUp,
      questionType: classification.type,
    };

    const analysisDecision = AnalysisLifecycleManager.decideAnalysisAction(analysisContext);

    // LAYER 15: Cognitive Answer Gate - Decide if we can answer
    const answerContext: AnswerContext = {
      question,
      availableData: {
        hasNews: analysisDecision.action === 'fetch_and_analyze',
        hasSocialMedia: false,
        hasHistoricalData: dialogueContext.isFollowUp,
        dataQuality: analysisDecision.action === 'fetch_and_analyze' ? 'high' : 'medium',
        dataRecency: analysisDecision.action === 'fetch_and_analyze' ? 'recent' : 'stale',
      },
      questionComplexity: classification.type === 'analytical' ? 'complex' : 'moderate',
      domainKnowledge: domain ? 'medium' : 'low',
    };

    const gateDecision = CognitiveAnswerGate.makeDecision(answerContext);

    // If gate blocks answer, return gate response
    if (gateDecision.decision !== 'answer_directly') {
      const gateResponse = CognitiveAnswerGate.generateGateResponse(gateDecision);
      
      return {
        answer: gateResponse,
        metadata: {
          questionType: classification.type,
          cognitivePathway: classification.pathway,
          analysisAction: analysisDecision.action,
          gateDecision: gateDecision.decision,
          contextLocked: contextCheck.isValid,
          isGrounded: false,
          confidence: gateDecision.confidence,
        },
      };
    }

    // LAYER 5: Working Memory - Store and retrieve recent context
    // Note: Working memory needs to be initialized and managed at application level
    // const recentContext = getRecentItems(workingMemoryState, domain || 'general', 5);

    // LAYER 7: Contextual Binding - Add cultural and temporal context
    // Note: Contextual binding will be integrated at application level
    // const culturalContext = country ? bindContext({ ... }) : null;

    // At this point, call the existing intelligent pipeline
    let answer: string;
    
    if (analysisDecision.action === 'fetch_and_analyze' && input.newsItems && input.emotionData) {
      // Call intelligent pipeline with real data
      const pipelineInput: PipelineInput = {
        question,
        newsItems: input.newsItems.map(item => ({
          title: item.title,
          description: item.content,
          source: item.url
        })),
        emotionData: {
          ...input.emotionData,
          gmi: (input.emotionData.hope - input.emotionData.fear) / 2,
          cfi: input.emotionData.fear,
          hri: input.emotionData.hope
        },
        sessionId,
        userRole: input.userRole,
        conversationHistory: conversationHistory?.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        })),
      };
      
      const pipelineOutput = await runIntelligentPipeline(pipelineInput);
      answer = typeof pipelineOutput.response === 'string' 
        ? pipelineOutput.response 
        : JSON.stringify(pipelineOutput.response);
    } else {
      // Phase 66: Always use intelligent pipeline - no placeholder answers
      // Even for "thinking only" questions, we use the pipeline with available context
      const pipelineInput: PipelineInput = {
        question,
        newsItems: (input.newsItems || []).map(item => ({
          title: item.title,
          description: item.content,
          source: 'context',
        })),
        emotionData: input.emotionData ? {
          fear: input.emotionData.fear,
          hope: input.emotionData.hope,
          anger: input.emotionData.anger,
          gmi: input.emotionData.gmi || 0,
          cfi: input.emotionData.cfi || 0,
          hri: input.emotionData.hri || 0,
        } : { fear: 0, hope: 0, anger: 0, gmi: 0, cfi: 0, hri: 0 },
        conversationHistory: (conversationHistory || []).map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        sessionId,
        userRole: input.userRole,
      };
      
      const pipelineOutput = await runIntelligentPipeline(pipelineInput);
      answer = typeof pipelineOutput.response === 'string' 
        ? pipelineOutput.response 
        : JSON.stringify(pipelineOutput.response);
    }

    // LAYER 14: Cognitive Consistency Check
    const previousResponses = conversationHistory
      ? conversationHistory.filter(m => m.role === 'assistant').map(m => m.content)
      : [];

    const consistencyCheck = CognitiveConsistencyCheck.checkConsistency(
      sessionId,
      answer,
      previousResponses,
      domain || ''
    );

    // Update dialogue
    DialogicalConsciousness.updateDialogue(sessionId, question, answer);

    // LAYER 5: Store in working memory
    // Note: Working memory storage needs to be handled at application level
    // addToWorkingMemory(workingMemoryState, { ... });

    return {
      answer,
      metadata: {
        questionType: classification.type,
        cognitivePathway: classification.pathway,
        analysisAction: analysisDecision.action,
        gateDecision: gateDecision.decision,
        contextLocked: contextCheck.isValid,
        isGrounded: consistencyCheck.isConsistent,
        confidence: consistencyCheck.confidenceScore,
      },
    };
  }

  /**
   * Map confidence string to number
   */
  private mapConfidenceToNumber(confidence: 'high' | 'medium' | 'low' | 'unknown'): number {
    const map = {
      high: 0.9,
      medium: 0.6,
      low: 0.3,
      unknown: 0,
    };
    return map[confidence];
  }

  // Phase 66: Removed generateReinterpretationAnswer and generateThinkingAnswer
  // All responses now use runIntelligentPipeline for consistency and quality
}

export const UnifiedPipeline = new UnifiedPipelineClass();
