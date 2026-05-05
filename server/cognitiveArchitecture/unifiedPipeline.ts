import { CognitiveControlLayer } from './cognitiveControlLayer';
import { ContextLockLayer } from './contextLockLayer';
import { KnowledgeEngine } from './knowledgeEngine';
import { DialogicalConsciousness } from './dialogicalConsciousness';
import { CognitiveConsistencyCheck } from './cognitiveConsistencyCheck';
import { CognitiveAnswerGate } from './cognitiveAnswerGate';
import { runIntelligentPipeline, type PipelineInput } from './intelligentPipeline';
import { getAggregatedNetworkData } from '../networkEngine';

export interface UnifiedPipelineInput {
  question: string;
  sessionId: string;
  country?: string;
  domain?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  userRole?: string;
}

export interface UnifiedPipelineOutput {
  answer: string;
  metadata: {
    questionType: string;
    cognitivePathway: string;
    contextLocked: boolean;
    isGrounded: boolean;
    networkInjected: boolean;
    confidence: number;
  };
}

class UnifiedPipelineClass {
  async process(input: UnifiedPipelineInput): Promise<UnifiedPipelineOutput> {
    const { question, sessionId, country, conversationHistory } = input;

    const contextCheck = ContextLockLayer.validateContext(sessionId, question, country || 'global');
    if (!contextCheck.isValid) {
      return this.handleViolation("Context Drift", contextCheck.reason);
    }

    const classification = CognitiveControlLayer.classifyQuestion(question, conversationHistory);
    const networkData = await getAggregatedNetworkData(question, country);

    const gateDecision = CognitiveAnswerGate.makeDecision({
      question,
      availableData: {
        hasNews: !!networkData,
        hasSocialMedia: false,
        hasHistoricalData: true,
        dataQuality: 'high',
        dataRecency: 'recent' // تم إصلاح الخطأ هنا من real-time إلى recent
      },
      questionComplexity: classification.type === 'analytical' ? 'complex' : 'moderate',
      domainKnowledge: 'medium'
    });

    if (gateDecision.decision !== 'answer_directly') {
      return this.handleViolation("Information Gap", "Insufficient real-time vectors.");
    }

    const pipelineInput: PipelineInput = {
      question,
      sessionId: sessionId || "active-session",
      userRole: input.userRole,
      networkContext: networkData, // سيعمل بعد تعديل Interface PipelineInput
      conversationHistory: conversationHistory?.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
    };

    const pipelineOutput = await runIntelligentPipeline(pipelineInput);
    const finalAnswer = typeof pipelineOutput.response === 'string'
      ? pipelineOutput.response
      : "Analyzing quantum vectors...";

    const consistencyCheck = CognitiveConsistencyCheck.checkConsistency(
      sessionId,
      finalAnswer,
      conversationHistory?.map(m => m.content) || [],
      input.domain || "general" // تم إصلاح الخطأ هنا بإضافة الوسيط الرابع
    );

    DialogicalConsciousness.updateDialogue(sessionId, question, finalAnswer);

    return {
      answer: finalAnswer,
      metadata: {
        questionType: classification.type,
        cognitivePathway: classification.pathway,
        contextLocked: true,
        isGrounded: consistencyCheck.isConsistent,
        networkInjected: true,
        confidence: consistencyCheck.confidenceScore
      }
    };
  }

  private handleViolation(type: string, reason: string): UnifiedPipelineOutput {
    return {
      answer: `[Protocol] ${type}: ${reason}`,
      metadata: { questionType: 'violation', cognitivePathway: 'blocked', contextLocked: false, isGrounded: false, networkInjected: false, confidence: 0 }
    };
  }
}

export const UnifiedPipeline = new UnifiedPipelineClass();