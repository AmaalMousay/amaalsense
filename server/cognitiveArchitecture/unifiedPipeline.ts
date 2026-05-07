/**
 * UNIFIED PIPELINE - The Accumulative ASI Orchestrator (V4.8)
 * يربط طبقات الوعي والتحكم لتقديم استجابة موحدة ومعالجة الأخطاء التقنية.
 */

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

class UnifiedPipelineClass {
  async process(input: UnifiedPipelineInput): Promise<UnifiedPipelineOutput> {
    const { question, sessionId, country, conversationHistory } = input;

    // ✅ إصلاح الخطأ 37: التأكد من تمرير string وليس undefined
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

    // ✅ إصلاح الخطأ 60: إضافة الحقول الناقصة (newsItems, emotionData) لتطابق PipelineInput
    const pipelineInput: PipelineInput = {
      question,
      topic: input.domain || 'general',
      country: safeCountry,
      sessionId: sessionId || "active-session",
      userRole: input.userRole,
      // نمرر الأخبار من بيانات الشبكة إذا وجدت، أو مصفوفة فارغة
      newsItems: input.newsItems || (networkData as any)?.newsItems || [],
      // نمرر بيانات المشاعر من الشبكة، أو قيم افتراضية
      emotionData: input.emotionData || (networkData as any)?.emotionData || {
        fear: 0.1, hope: 0.5, anger: 0.1, gmi: 0.5, cfi: 0.1, hri: 0.5
      },
      networkContext: networkData,
      conversationHistory: conversationHistory?.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
    };

    const pipelineOutput = await runIntelligentPipeline(pipelineInput);

    // تأمين الحصول على النص النهائي
    const finalAnswer = pipelineOutput.formattedResponse ||
      (typeof pipelineOutput.response === 'string' ? pipelineOutput.response : "Synthesizing consciousness...");

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