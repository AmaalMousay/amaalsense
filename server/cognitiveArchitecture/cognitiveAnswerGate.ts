/**
 * Cognitive Answer Gate Layer
 *
 * Internal safety gate that decides whether to answer, search for more data,
 * admit lack of knowledge, ask for clarification, or defer to an expert.
 * This layer is used by the central network engine before composing answers.
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
   * Decide whether and how to answer the question.
   */
  makeDecision(context: AnswerContext): GateDecision {
    const { question, availableData, questionComplexity, domainKnowledge } = context;

    if (this.isAmbiguous(question)) {
      return {
        decision: 'clarify_question',
        confidence: 0.9,
        reasoning: 'The question is ambiguous or too short.',
        suggestedAction: 'Ask a focused clarification question.',
      };
    }

    const dataScore = this.calculateDataSufficiency(availableData);

    if (questionComplexity === 'simple' && dataScore >= 0.7) {
      return {
        decision: 'answer_directly',
        confidence: dataScore,
        reasoning: 'The question is simple and available data is sufficient.',
      };
    }

    if (questionComplexity === 'complex' && dataScore < 0.5) {
      return {
        decision: 'search_more_data',
        confidence: 0.8,
        reasoning: 'The question is complex and needs more evidence.',
        suggestedAction: 'Collect more data before final analysis.',
      };
    }

    if (domainKnowledge === 'low' && questionComplexity === 'complex') {
      return {
        decision: 'defer_to_expert',
        confidence: 0.85,
        reasoning: 'The question requires expert knowledge that is not currently available.',
        suggestedAction: 'Use Knowledge Core or an expert source.',
      };
    }

    if (availableData.dataRecency === 'stale' || availableData.dataQuality === 'low') {
      return {
        decision: 'admit_ignorance',
        confidence: 0.9,
        reasoning: 'Available data is stale or low quality.',
        suggestedAction: 'State the limitation clearly.',
      };
    }

    return {
      decision: 'answer_directly',
      confidence: dataScore,
      reasoning: 'Available evidence is sufficient for a bounded answer.',
    };
  }

  /**
   * Generate response string for non-answer decisions.
   */
  generateGateResponse(decision: GateDecision): string {
    switch (decision.decision) {
      case 'admit_ignorance':
        return 'I cannot provide a reliable answer with the available information. The data is limited or outdated.';
      case 'search_more_data':
        return 'I need to gather more current information before I can give a meaningful answer.';
      case 'clarify_question':
        return 'Could you please clarify your question? It seems ambiguous or too brief.';
      case 'defer_to_expert':
        return 'This question requires specialized knowledge that I do not have access to at this moment.';
      case 'answer_directly':
      default:
        return '';
    }
  }

  /**
   * Check whether the answer should be blocked (safety check).
   */
  shouldBlockAnswer(question: string, proposedAnswer: string): {
    shouldBlock: boolean;
    reason?: string;
  } {
    const uncertaintyPattern = /\b(maybe|perhaps|possibly|unknown|unclear|not sure)\b/i;
    const hasHighUncertainty = uncertaintyPattern.test(proposedAnswer);

    if (hasHighUncertainty && proposedAnswer.split(/\s+/).length < 20) {
      return {
        shouldBlock: true,
        reason: 'The proposed answer is too uncertain and too short.',
      };
    }

    if (this.answersWrongQuestion(question, proposedAnswer)) {
      return {
        shouldBlock: true,
        reason: 'The proposed answer appears to address a different question.',
      };
    }

    return { shouldBlock: false };
  }

  private isAmbiguous(question: string): boolean {
    const trimmed = question.trim();
    if (trimmed.split(/\s+/).length < 3) return true;
    if (/^(it|this|that|same|again)$/i.test(trimmed)) return true;
    if ((trimmed.match(/\?/g) || []).length > 2) return true;
    return false;
  }

  private calculateDataSufficiency(data: AnswerContext['availableData']): number {
    let score = 0;
    if (data.hasNews) score += 0.15;
    if (data.hasSocialMedia) score += 0.1;
    if (data.hasHistoricalData) score += 0.05;
    const qualityMap = { high: 0.4, medium: 0.25, low: 0.1 };
    score += qualityMap[data.dataQuality];
    const recencyMap = { recent: 0.3, stale: 0.15, none: 0 };
    score += recencyMap[data.dataRecency];
    return Math.min(1.0, score);
  }

  private answersWrongQuestion(question: string, answer: string): boolean {
    const qKeywords = this.extractKeywords(question);
    const aKeywords = this.extractKeywords(answer);
    if (qKeywords.length < 2) return false;
    const overlap = qKeywords.filter(kw => aKeywords.includes(kw));
    return overlap.length / qKeywords.length < 0.2;
  }

  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were',
      'this', 'that', 'it', 'its', 'they', 'them', 'we', 'you',
    ]);
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 10);
  }
}

export const CognitiveAnswerGate = new CognitiveAnswerGateClass();
