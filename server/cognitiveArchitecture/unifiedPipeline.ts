/**
 * UNIFIED PIPELINE - The Accumulative ASI Orchestrator (V4.8)
 *          .
 */

import { CognitiveControlLayer } from './cognitiveControlLayer';
import { ContextLockLayer } from './contextLockLayer';
import { KnowledgeEngine } from './layer6_knowledgeBase';
import { DialogicalConsciousness } from './dialogicalConsciousness';
import { CognitiveConsistencyCheck } from './cognitiveConsistencyCheck';
import { CognitiveAnswerGate } from './cognitiveAnswerGate';
import { composeNaturalAnswer } from '../engines/responseBuilder';
import { getAggregatedNetworkData } from '../engines/networkEngine';

export interface UnifiedPipelineInput {
  question: string;
  sessionId: string;
  country?: string;
  domain?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  userRole?: string;
  newsItems?: any[];
  emotionData?: any;
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
    analysisAction: string;
    gateDecision: string;
  };
}

function consistencyScoreFromGate(decision: string): number {
  return decision === 'answer_directly' ? 80 : 45;
}

class UnifiedPipelineClass {
  async process(input: UnifiedPipelineInput): Promise<UnifiedPipelineOutput> {
    const { question, sessionId, country, conversationHistory } = input;

    // ✅   37:    string  undefined
    const safeCountry = country || 'global';
    const contextCheck = ContextLockLayer.validateContext(sessionId, question, safeCountry);

    if (!contextCheck.isValid) {
      return this.handleViolation("Context Drift", contextCheck.reason || "Unauthorized context shift.");
    }

    const classification = CognitiveControlLayer.classifyQuestion(question, conversationHistory);
    const networkData = await getAggregatedNetworkData(question, safeCountry);

    const gateDecision = CognitiveAnswerGate.makeDecision({
      question,
      availableData: {
        hasNews: !!networkData,
        hasSocialMedia: false,
        hasHistoricalData: true,
        dataQuality: 'high',
        dataRecency: 'recent'
      },
      questionComplexity: classification.type === 'analytical' ? 'complex' : 'moderate',
      domainKnowledge: 'medium'
    });

    if (gateDecision.decision !== 'answer_directly') {
      return this.handleViolation("Information Gap", "Insufficient real-time vectors.");
    }

    const emotionData = input.emotionData || (networkData as any)?.emotionData || {
      fear: 0.1, hope: 0.5, anger: 0.1, gmi: 0.5, cfi: 0.1, hri: 0.5
    };

    const finalAnswer = await composeNaturalAnswer({
      question,
      language: /[^\x00-\x7F]/.test(question) ? 'ar' : 'en',
      intent: classification.type,
      route: 'analysis',
      eventVector: (networkData as any)?.eventVector,
      indices: { gmi: emotionData.gmi, cfi: emotionData.cfi, hri: emotionData.hri },
      emotions: emotionData,
      evidence: (input.newsItems || (networkData as any)?.newsItems || []).slice(0, 6).map((item: any) => ({
        title: item.title || item.description || String(item),
        source: item.source,
        url: item.url,
      })),
      memory: networkData,
      confidence: consistencyScoreFromGate(gateDecision.decision),
      limitations: !networkData ? ['No live network context was available.'] : [],
    });

    const consistencyCheck = CognitiveConsistencyCheck.checkConsistency(
      sessionId,
      finalAnswer,
      conversationHistory?.map(m => m.content) || [],
      input.domain || "general"
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
        confidence: consistencyCheck.confidenceScore,
        analysisAction: classification.pathway,
        gateDecision: gateDecision.decision
      }
    };
  }

  private handleViolation(type: string, reason: string): UnifiedPipelineOutput {
    return {
      answer: `[Protocol] ${type}: ${reason}`,
      metadata: { 
        questionType: 'violation', 
        cognitivePathway: 'blocked', 
        contextLocked: false, 
        isGrounded: false, 
        networkInjected: false, 
        confidence: 0,
        analysisAction: 'block',
        gateDecision: 'violation'
      }
    };
  }
}

export const UnifiedPipeline = new UnifiedPipelineClass();