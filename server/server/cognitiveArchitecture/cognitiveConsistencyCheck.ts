/**
 * Cognitive Consistency Check Layer
 *
 * Detects contradictions and context drift between the current answer and
 * recent conversation history. Used as a lightweight final safety check.
 */

export interface ConsistencyViolation {
  type: 'contradiction' | 'inconsistency' | 'context_drift';
  severity: 'low' | 'medium' | 'high';
  description: string;
  previousStatement: string;
  currentStatement: string;
  suggestion: string;
}

export interface ConsistencyCheckResult {
  isConsistent: boolean;
  violations: ConsistencyViolation[];
  confidenceScore: number;
}

class CognitiveConsistencyCheckClass {
  /**
   * Check if a new response is consistent with previous responses in the session
   */
  checkConsistency(
    sessionId: string,
    currentResponse: string,
    previousResponses: string[],
    currentTopic: string,
  ): ConsistencyCheckResult {
    const violations: ConsistencyViolation[] = [];

    // Check for contradictions against the last 5 responses
    const contradictions = this.detectContradictions(currentResponse, previousResponses);
    violations.push(...contradictions);

    // Check for topic drift
    const topicDrift = this.detectTopicDrift(currentResponse, currentTopic);
    if (topicDrift) violations.push(topicDrift);

    // Calculate confidence score
    const confidenceScore = this.calculateConsistencyScore(violations);

    return {
      isConsistent: violations.length === 0 || violations.every((v) => v.severity === 'low'),
      violations,
      confidenceScore,
    };
  }

  private detectContradictions(currentResponse: string, previousResponses: string[]): ConsistencyViolation[] {
    const violations: ConsistencyViolation[] = [];

    for (const prevResponse of previousResponses.slice(-5)) {
      if (this.areContradictory(prevResponse, currentResponse)) {
        violations.push({
          type: 'contradiction',
          severity: 'high',
          description: 'Current response may contradict a previous response.',
          previousStatement: prevResponse.slice(0, 240),
          currentStatement: currentResponse.slice(0, 240),
          suggestion: 'State uncertainty or reconcile the two claims.',
        });
      }
    }

    return violations;
  }

  private detectTopicDrift(currentResponse: string, currentTopic: string): ConsistencyViolation | null {
    if (!currentTopic || currentTopic.length < 2) return null;

    const topicKeywords = this.extractKeywords(currentTopic);
    if (topicKeywords.length === 0) return null;

    const responseKeywords = this.extractKeywords(currentResponse);
    const overlap = topicKeywords.filter((kw) => responseKeywords.includes(kw));
    const overlapRatio = overlap.length / Math.max(topicKeywords.length, 1);

    if (overlapRatio < 0.2 && responseKeywords.length > 3) {
      return {
        type: 'context_drift',
        severity: 'medium',
        description: 'Current response may have drifted away from the active topic.',
        previousStatement: `Topic: ${currentTopic}`,
        currentStatement: `Response keywords: ${responseKeywords.slice(0, 5).join(', ')}`,
        suggestion: 'Bring the answer back to the requested topic.',
      };
    }

    return null;
  }

  private areContradictory(first: string, second: string): boolean {
    const pairs = [
      { positive: /improving|positive|stable|safe|low risk/i, negative: /worsening|negative|unstable|danger|high risk/i },
      { positive: /increase|rising|higher/i, negative: /decrease|falling|lower/i },
      { positive: /confirmed|certain|clear/i, negative: /uncertain|unknown|unclear/i },
    ];

    return pairs.some(
      (pair) =>
        (pair.positive.test(first) && pair.negative.test(second)) ||
        (pair.negative.test(first) && pair.positive.test(second)),
    );
  }

  private calculateConsistencyScore(violations: ConsistencyViolation[]): number {
    if (violations.length === 0) return 1;
    const penalty = violations.reduce((sum, v) => sum + (v.severity === 'high' ? 0.35 : v.severity === 'medium' ? 0.2 : 0.1), 0);
    return Math.max(0, 1 - penalty);
  }

  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were',
      'this', 'that', 'what', 'which', 'who', 'when', 'where', 'why', 'how',
    ]);
    return (text.toLowerCase().match(/[\p{L}\p{N}_]+/gu) || [])
      .filter((word) => word.length > 2 && !stopWords.has(word))
      .slice(0, 12);
  }
}

export const CognitiveConsistencyCheck = new CognitiveConsistencyCheckClass();