import { t } from "../_core/i18n";

/**
 * Cognitive Answer Gate Layer
 * 
 * Purpose: Decides whether to answer, search, or admit ignorance
 * - Prevents hallucination by admitting when information is insufficient
 * - Allows "cognitive silence" when appropriate
 * - Routes to additional data gathering when needed
 */

export type AnswerDecision =
  | 'answer_directly'       // Sufficient information to answer
  | 'search_more_data'      // Need more data before answering
  | 'admit_ignorance'       // Cannot answer - admit lack of knowledge
  | 'clarify_question'      // Question is ambiguous - ask for clarification
  | 'defer_to_expert';      // Question requires expert knowledge

export interface GateDecision {
  decision: AnswerDecision;
  confidence: number;
  reasoning: string;
  suggestedAction?: string;
}

export interface AnswerContext {
  question: string;
  availableData: {
    hasNews: boolean;
    hasSocialMedia: boolean;
    hasHistoricalData: boolean;
    dataQuality: 'high' | 'medium' | 'low';
    dataRecency: 'recent' | 'stale' | 'none';
  };
  questionComplexity: 'simple' | 'moderate' | 'complex';
  domainKnowledge: 'high' | 'medium' | 'low';
}

class CognitiveAnswerGateClass {
  /**
   * Decide whether and how to answer the question
   */
  makeDecision(context: AnswerContext): GateDecision {
    const { question, availableData, questionComplexity, domainKnowledge } = context;

    // Check if question is clear
    if (this.isAmbiguous(question)) {
      return {
        decision: 'clarify_question',
        confidence: 0.9,
        reasoning: t('auto.cognitiveArchitecture_cognitiveAnswerGate.28.6614e00c', 'ar'),
        suggestedAction: t('auto.cognitiveArchitecture_cognitiveAnswerGate.27.e807eda5', 'ar'),
      };
    }

    // Check if we have sufficient data
    const dataScore = this.calculateDataSufficiency(availableData);

    // For simple questions with good data - answer directly
    if (questionComplexity === 'simple' && dataScore >= 0.7) {
      return {
        decision: 'answer_directly',
        confidence: dataScore,
        reasoning: t('auto.cognitiveArchitecture_cognitiveAnswerGate.26.63b2e48c', 'ar'),
      };
    }

    // For complex questions with insufficient data - search more
    if (questionComplexity === 'complex' && dataScore < 0.5) {
      return {
        decision: 'search_more_data',
        confidence: 0.8,
        reasoning: t('auto.cognitiveArchitecture_cognitiveAnswerGate.25.15ba6789', 'ar'),
        suggestedAction: t('auto.cognitiveArchitecture_cognitiveAnswerGate.24.da1f851e', 'ar'),
      };
    }

    // Check if question requires expert knowledge we don't have
    if (domainKnowledge === 'low' && questionComplexity === 'complex') {
      return {
        decision: 'defer_to_expert',
        confidence: 0.85,
        reasoning: t('auto.cognitiveArchitecture_cognitiveAnswerGate.23.5051d6fa', 'ar'),
        suggestedAction: t('auto.cognitiveArchitecture_cognitiveAnswerGate.22.ccdd4efb', 'ar'),
      };
    }

    // Check if data is too stale or low quality
    if (availableData.dataRecency === 'stale' || availableData.dataQuality === 'low') {
      return {
        decision: 'admit_ignorance',
        confidence: 0.9,
        reasoning: t('auto.cognitiveArchitecture_cognitiveAnswerGate.21.773753d5', 'ar'),
        suggestedAction: t('auto.cognitiveArchitecture_cognitiveAnswerGate.20.b25da9e5', 'ar'),
      };
    }

    // Default: answer with available data but with appropriate confidence
    return {
      decision: 'answer_directly',
      confidence: dataScore,
      reasoning: t('auto.cognitiveArchitecture_cognitiveAnswerGate.19.79b95d1d', 'ar'),
    };
  }

  /**
   * Check if question is ambiguous
   */
  private isAmbiguous(question: string): boolean {
    // Check for vague pronouns without clear referents
    const vaguePronouns = /^(||||)/i;
    if (vaguePronouns.test(question.trim())) {
      return true;
    }

    // Check if question is too short to be clear
    if (question.trim().split(/\s+/).length < 3) {
      return true;
    }

    // Check for multiple question marks (confusion indicator)
    if ((question.match(/\?/g) || []).length > 2) {
      return true;
    }

    return false;
  }

  /**
   * Calculate data sufficiency score
   */
  private calculateDataSufficiency(availableData: AnswerContext['availableData']): number {
    let score = 0;

    // Data sources (30%)
    if (availableData.hasNews) score += 0.15;
    if (availableData.hasSocialMedia) score += 0.10;
    if (availableData.hasHistoricalData) score += 0.05;

    // Data quality (40%)
    const qualityScores = { high: 0.4, medium: 0.25, low: 0.1 };
    score += qualityScores[availableData.dataQuality];

    // Data recency (30%)
    const recencyScores = { recent: 0.3, stale: 0.15, none: 0 };
    score += recencyScores[availableData.dataRecency];

    return Math.min(1.0, score);
  }

  /**
   * Generate appropriate response based on gate decision
   */
  generateGateResponse(decision: GateDecision): string {
    switch (decision.decision) {
      case 'admit_ignorance':
        return t('auto.cognitiveArchitecture_cognitiveAnswerGate.18.7aa97bff', 'ar') +
               t('auto.cognitiveArchitecture_cognitiveAnswerGate.17.db86ff75', 'ar');

      case 'search_more_data':
        return t('auto.cognitiveArchitecture_cognitiveAnswerGate.16.24389dcb', 'ar') +
               t('auto.cognitiveArchitecture_cognitiveAnswerGate.15.9a2cb452', 'ar');

      case 'clarify_question':
        return t('auto.cognitiveArchitecture_cognitiveAnswerGate.14.49005b73', 'ar');

      case 'defer_to_expert':
        return t('auto.cognitiveArchitecture_cognitiveAnswerGate.13.1ec81d55', 'ar') +
               t('auto.cognitiveArchitecture_cognitiveAnswerGate.12.788eed8b', 'ar');

      case 'answer_directly':
      default:
        return ''; // Will proceed with normal answer
    }
  }

  /**
   * Check if we should block the answer (safety check)
   */
  shouldBlockAnswer(question: string, proposedAnswer: string): {
    shouldBlock: boolean;
    reason?: string;
  } {
    // Check for potential hallucination indicators
    const hallucinationIndicators = [
      / /i,
      //i,
      / /i,
      / /i,
    ];

    const hasUncertainty = hallucinationIndicators.some(pattern => pattern.test(proposedAnswer));

    // If answer is very uncertain, suggest admitting ignorance instead
    if (hasUncertainty && proposedAnswer.split(/\s+/).length < 20) {
      return {
        shouldBlock: true,
        reason: t('auto.cognitiveArchitecture_cognitiveAnswerGate.11.4dd95e45', 'ar'),
      };
    }

    // Check if answer contradicts the question
    if (this.answersWrongQuestion(question, proposedAnswer)) {
      return {
        shouldBlock: true,
        reason: t('auto.cognitiveArchitecture_cognitiveAnswerGate.10.002593e5', 'ar'),
      };
    }

    return { shouldBlock: false };
  }

  /**
   * Check if answer addresses a different question
   */
  private answersWrongQuestion(question: string, answer: string): boolean {
    // Extract key question words
    const questionKeywords = this.extractKeywords(question);
    const answerKeywords = this.extractKeywords(answer);

    // Check overlap
    const overlap = questionKeywords.filter(kw => answerKeywords.includes(kw));
    const overlapRatio = overlap.length / Math.max(questionKeywords.length, 1);

    // If less than 20% overlap, likely answering wrong question
    return overlapRatio < 0.2 && questionKeywords.length > 2;
  }

  /**
   * Extract keywords from text
   */
  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      t('auto.cognitiveArchitecture_cognitiveAnswerGate.9.aef2099d', 'ar'), t('auto.cognitiveArchitecture_cognitiveAnswerGate.8.aa7099e2', 'ar'), t('auto.cognitiveArchitecture_cognitiveAnswerGate.7.8ab80326', 'ar'), t('auto.cognitiveArchitecture_cognitiveAnswerGate.6.16dc1dd1', 'ar'), t('auto.cognitiveArchitecture_cognitiveAnswerGate.5.38486333', 'ar'), t('auto.cognitiveArchitecture_cognitiveAnswerGate.4.f3c3b73b', 'ar'), t('auto.cognitiveArchitecture_cognitiveAnswerGate.3.6be4d5a7', 'ar'), t('auto.cognitiveArchitecture_cognitiveAnswerGate.2.f60d1f66', 'ar'), t('auto.cognitiveArchitecture_cognitiveAnswerGate.1.bcd49587', 'ar'),
    ]);

    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 10);
  }
}

export const CognitiveAnswerGate = new CognitiveAnswerGateClass();
