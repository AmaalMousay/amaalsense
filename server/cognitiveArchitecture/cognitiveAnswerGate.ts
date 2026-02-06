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
        reasoning: 'السؤال غير واضح أو يحتمل تفسيرات متعددة',
        suggestedAction: 'اطلب من المستخدم توضيح السؤال',
      };
    }

    // Check if we have sufficient data
    const dataScore = this.calculateDataSufficiency(availableData);

    // For simple questions with good data - answer directly
    if (questionComplexity === 'simple' && dataScore >= 0.7) {
      return {
        decision: 'answer_directly',
        confidence: dataScore,
        reasoning: 'السؤال بسيط والبيانات كافية للإجابة',
      };
    }

    // For complex questions with insufficient data - search more
    if (questionComplexity === 'complex' && dataScore < 0.5) {
      return {
        decision: 'search_more_data',
        confidence: 0.8,
        reasoning: 'السؤال معقد والبيانات الحالية غير كافية',
        suggestedAction: 'اجمع المزيد من البيانات قبل الإجابة',
      };
    }

    // Check if question requires expert knowledge we don't have
    if (domainKnowledge === 'low' && questionComplexity === 'complex') {
      return {
        decision: 'defer_to_expert',
        confidence: 0.85,
        reasoning: 'السؤال يتطلب معرفة متخصصة خارج نطاق النظام',
        suggestedAction: 'اقترح استشارة خبير في المجال',
      };
    }

    // Check if data is too stale or low quality
    if (availableData.dataRecency === 'stale' || availableData.dataQuality === 'low') {
      return {
        decision: 'admit_ignorance',
        confidence: 0.9,
        reasoning: 'البيانات المتاحة قديمة أو ذات جودة منخفضة',
        suggestedAction: 'اعترف بعدم وجود معلومات حديثة موثوقة',
      };
    }

    // Default: answer with available data but with appropriate confidence
    return {
      decision: 'answer_directly',
      confidence: dataScore,
      reasoning: 'البيانات المتاحة كافية للإجابة مع بعض التحفظات',
    };
  }

  /**
   * Check if question is ambiguous
   */
  private isAmbiguous(question: string): boolean {
    // Check for vague pronouns without clear referents
    const vaguePronouns = /^(هذا|ذلك|هو|هي|ذاك)/i;
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
        return 'عذراً، لا أملك معلومات كافية أو حديثة للإجابة على هذا السؤال بثقة. ' +
               'أفضل الاعتراف بعدم المعرفة بدلاً من تقديم معلومات غير دقيقة.';

      case 'search_more_data':
        return 'للإجابة على هذا السؤال بشكل دقيق، أحتاج إلى جمع المزيد من البيانات. ' +
               'هل يمكنك إعطائي بعض الوقت لتحليل مصادر إضافية؟';

      case 'clarify_question':
        return 'السؤال غير واضح بالنسبة لي. هل يمكنك إعادة صياغته أو إضافة المزيد من التفاصيل؟';

      case 'defer_to_expert':
        return 'هذا السؤال يتطلب معرفة متخصصة خارج نطاق قدراتي الحالية. ' +
               'أنصح باستشارة خبير في المجال للحصول على إجابة دقيقة.';

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
      /أعتقد أن/i,
      /ربما/i,
      /من المحتمل/i,
      /قد يكون/i,
    ];

    const hasUncertainty = hallucinationIndicators.some(pattern => pattern.test(proposedAnswer));

    // If answer is very uncertain, suggest admitting ignorance instead
    if (hasUncertainty && proposedAnswer.split(/\s+/).length < 20) {
      return {
        shouldBlock: true,
        reason: 'الإجابة تحتوي على عدم يقين كبير - من الأفضل الاعتراف بعدم المعرفة',
      };
    }

    // Check if answer contradicts the question
    if (this.answersWrongQuestion(question, proposedAnswer)) {
      return {
        shouldBlock: true,
        reason: 'الإجابة لا تتعلق بالسؤال المطروح',
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
      'في', 'من', 'إلى', 'على', 'عن', 'مع', 'هذا', 'هذه', 'ذلك',
    ]);

    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 10);
  }
}

export const CognitiveAnswerGate = new CognitiveAnswerGateClass();
