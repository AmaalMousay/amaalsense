/**
 * Cognitive Answer Gate Layer
 *
 * Decides whether AmalSense should answer, search for more data, ask for
 * clarification, admit ignorance, or defer to an expert. This is an internal
 * safety gate used by the central processing path.
 */

export type AnswerDecision =
  | 'answer_directly'
  | 'search_more_data'
  | 'admit_ignorance'
  | 'clarify_question'
  | 'defer_to_expert';

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
   * Decide whether and how to answer the user question
   */
  makeDecision(context: AnswerContext): GateDecision {
    const { question, availableData, questionComplexity, domainKnowledge } = context;

    if (this.isAmbiguous(question)) {
      return {
        decision: 'clarify_question',
        confidence: 0.9,
        reasoning: 'The question is ambiguous or too short to answer clearly.',
        suggestedAction: 'Ask a focused clarification question.',
      };
    }

    const dataScore = this.calculateDataSufficiency(availableData);

    if (questionComplexity === 'simple' && dataScore >= 0.7) {
      return {
        decision: 'answer_directly',
        confidence: dataScore,
        reasoning: 'Simple question with sufficient available data.',
      };
    }

    if (questionComplexity === 'complex' && dataScore < 0.5) {
      return {
        decision: 'search_more_data',
        confidence: 0.8,
        reasoning: 'Complex question needs more evidence before answering.',
        suggestedAction: 'Collect more data before final analysis.',
      };
    }

    if (domainKnowledge === 'low' && questionComplexity === 'complex') {
      return {
        decision: 'defer_to_expert',
        confidence: 0.85,
        reasoning: 'Question requires expert knowledge not available in current context.',
        suggestedAction: 'Use Knowledge Core or an expert source.',
      };
    }

    if (availableData.dataRecency === 'stale' || availableData.dataQuality === 'low') {
      return {
        decision: 'admit_ignorance',
        confidence: 0.9,
        reasoning: 'Available data is stale or of low quality.',
        suggestedAction: 'State the limitation clearly in the response.',
      };
    }

    return {
      decision: 'answer_directly',
      confidence: dataScore,
      reasoning: 'Available evidence is sufficient for a bounded answer.',
    };
  }

  /**
   * Check if the question is ambiguous
   */
  private isAmbiguous(question: string): boolean {
    const trimmed = question.trim();
    if (trimmed.split(/\s+/).length < 3) return true;
    if (/^(it|this|that|same|again|and)$/i.test(trimmed)) return true;
    if ((trimmed.match(/\?/g) || []).length > 2) return true;
    return false;
  }

  /**
   * Calculate a data-sufficiency score from available-data flags
   */
  private calculateDataSufficiency(availableData: AnswerContext['availableData']): number {
    let score = 0;
    if (availableData.hasNews) score += 0.2;
    if (availableData.hasSocialMedia) score += 0.15;
    if (availableData.hasHistoricalData) score += 0.15;
    const qualityScores = { high: 0.3, medium: 0.2, low: 0.05 };
    score += qualityScores[availableData.dataQuality];
    const recencyScores = { recent: 0.2, stale: 0.1, none: 0 };
    score += recencyScores[availableData.dataRecency];
    return Math.min(1, score);
  }

  /**
   * Generate a natural-language response that reflects the gate decision
   */
  generateGateResponse(decision: GateDecision): string {
    switch (decision.decision) {
      case 'admit_ignorance':
        return 'I do not have enough reliable information to answer this accurately.';
      case 'search_more_data':
        return 'Let me search for more information on this topic.';
      case 'clarify_question':
        return 'Could you clarify your question so I can give you a more accurate answer?';
      case 'defer_to_expert':
        return 'This question may require expert-level knowledge beyond my current reach.';
      case 'answer_directly':
      default:
        return '';
    }
  }

  /**
   * Final safety check: block the answer if it appears hallucinated
   */
  shouldBlockAnswer(question: string, proposedAnswer: string): { shouldBlock: boolean; reason?: string } {
    const answerWords = this.extractKeywords(proposedAnswer);
    if (answerWords.length < 4 && /maybe|unknown|unclear|not sure/i.test(proposedAnswer)) {
      return { shouldBlock: true, reason: 'Answer is too uncertain and too short.' };
    }
    if (this.answersWrongQuestion(question, proposedAnswer)) {
      return { shouldBlock: true, reason: 'Answer appears weakly related to the question.' };
    }
    return { shouldBlock: false };
  }

  private answersWrongQuestion(question: string, answer: string): boolean {
    const questionKeywords = this.extractKeywords(question);
    if (questionKeywords.length < 3) return false;
    const answerKeywords = this.extractKeywords(answer);
    const overlap = questionKeywords.filter((kw) => answerKeywords.includes(kw)).length;
    return overlap / questionKeywords.length < 0.15;
  }

  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to',
      'for', 'of', 'is', 'are', 'was', 'were', 'this', 'that', 'what',
      'which', 'who', 'when', 'where', 'why', 'how',
    ]);
    return (text.toLowerCase().match(/[\p{L}\p{N}_]+/gu) || [])
      .filter((word) => word.length > 2 && !stopWords.has(word))
      .slice(0, 12);
  }
}

export const CognitiveAnswerGate = new CognitiveAnswerGateClass();
