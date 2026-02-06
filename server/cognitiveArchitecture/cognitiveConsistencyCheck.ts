/**
 * Cognitive Consistency Check Layer
 * 
 * Purpose: Prevents contradictions in responses within the same session
 * - Compares current response with previous responses
 * - Detects logical contradictions
 * - Ensures internal consistency
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
    currentTopic: string
  ): ConsistencyCheckResult {
    if (previousResponses.length === 0) {
      // No previous responses - automatically consistent
      return {
        isConsistent: true,
        violations: [],
        confidenceScore: 1.0,
      };
    }

    const violations: ConsistencyViolation[] = [];

    // Check for contradictions
    const contradictions = this.detectContradictions(currentResponse, previousResponses);
    violations.push(...contradictions);

    // Check for topic drift
    const topicDrift = this.detectTopicDrift(currentResponse, previousResponses, currentTopic);
    if (topicDrift) {
      violations.push(topicDrift);
    }

    // Check for inconsistent sentiment
    const sentimentInconsistency = this.detectSentimentInconsistency(currentResponse, previousResponses);
    if (sentimentInconsistency) {
      violations.push(sentimentInconsistency);
    }

    // Calculate confidence score
    const confidenceScore = this.calculateConsistencyScore(violations);

    return {
      isConsistent: violations.length === 0 || violations.every(v => v.severity === 'low'),
      violations,
      confidenceScore,
    };
  }

  /**
   * Detect logical contradictions between current and previous responses
   */
  private detectContradictions(currentResponse: string, previousResponses: string[]): ConsistencyViolation[] {
    const violations: ConsistencyViolation[] = [];

    // Extract key statements from current response
    const currentStatements = this.extractKeyStatements(currentResponse);

    // Compare with previous responses
    for (const prevResponse of previousResponses.slice(-3)) {
      const prevStatements = this.extractKeyStatements(prevResponse);

      for (const currentStmt of currentStatements) {
        for (const prevStmt of prevStatements) {
          if (this.areContradictory(currentStmt, prevStmt)) {
            violations.push({
              type: 'contradiction',
              severity: 'high',
              description: 'تناقض منطقي بين الرد الحالي والرد السابق',
              previousStatement: prevStmt,
              currentStatement: currentStmt,
              suggestion: 'راجع الحكم السابق أو وضح التغيير في الموقف',
            });
          }
        }
      }
    }

    return violations;
  }

  /**
   * Detect topic drift (response talks about different topic)
   */
  private detectTopicDrift(currentResponse: string, previousResponses: string[], currentTopic: string): ConsistencyViolation | null {
    // Extract keywords from current response
    const currentKeywords = this.extractKeywords(currentResponse);
    const topicKeywords = this.extractKeywords(currentTopic);

    // Calculate overlap
    const overlap = currentKeywords.filter(kw => topicKeywords.includes(kw));
    const overlapRatio = overlap.length / Math.max(topicKeywords.length, 1);

    // If less than 30% overlap, likely topic drift
    if (overlapRatio < 0.3 && currentKeywords.length > 3) {
      return {
        type: 'context_drift',
        severity: 'medium',
        description: 'الرد خرج عن الموضوع الأساسي',
        previousStatement: `الموضوع: ${currentTopic}`,
        currentStatement: `الرد يتحدث عن: ${currentKeywords.slice(0, 5).join(', ')}`,
        suggestion: 'ارجع للموضوع الأساسي أو وضح العلاقة',
      };
    }

    return null;
  }

  /**
   * Detect inconsistent sentiment (e.g., hopeful then pessimistic without explanation)
   */
  private detectSentimentInconsistency(currentResponse: string, previousResponses: string[]): ConsistencyViolation | null {
    if (previousResponses.length === 0) return null;

    const currentSentiment = this.extractSentiment(currentResponse);
    const prevSentiment = this.extractSentiment(previousResponses[previousResponses.length - 1]);

    // Check for drastic sentiment shift
    if (this.isDrasticSentimentShift(currentSentiment, prevSentiment)) {
      return {
        type: 'inconsistency',
        severity: 'low',
        description: 'تغيير مفاجئ في النبرة العاطفية',
        previousStatement: `النبرة السابقة: ${prevSentiment}`,
        currentStatement: `النبرة الحالية: ${currentSentiment}`,
        suggestion: 'وضح سبب التغيير في النبرة',
      };
    }

    return null;
  }

  /**
   * Extract key statements from response
   */
  private extractKeyStatements(response: string): string[] {
    // Split by sentence endings
    const sentences = response.split(/[.!?؟]/);
    
    // Filter for statements with strong assertions
    const assertionPatterns = [
      /يجب/,
      /لا يجب/,
      /ينبغي/,
      /لا ينبغي/,
      /من الضروري/,
      /من المهم/,
      /بالتأكيد/,
      /بالتأكيد لا/,
    ];

    return sentences
      .filter(s => assertionPatterns.some(p => p.test(s)))
      .map(s => s.trim())
      .filter(s => s.length > 10);
  }

  /**
   * Check if two statements are contradictory
   */
  private areContradictory(stmt1: string, stmt2: string): boolean {
    // Simple contradiction detection
    const negationPairs = [
      { positive: /يجب/, negative: /لا يجب/ },
      { positive: /ينبغي/, negative: /لا ينبغي/ },
      { positive: /من الضروري/, negative: /ليس من الضروري/ },
      { positive: /مفيد/, negative: /ضار/ },
      { positive: /آمن/, negative: /خطير/ },
    ];

    for (const { positive, negative } of negationPairs) {
      if ((positive.test(stmt1) && negative.test(stmt2)) ||
          (negative.test(stmt1) && positive.test(stmt2))) {
        // Check if they're talking about the same thing
        const keywords1 = this.extractKeywords(stmt1);
        const keywords2 = this.extractKeywords(stmt2);
        const overlap = keywords1.filter(kw => keywords2.includes(kw));
        
        if (overlap.length >= 2) {
          return true;
        }
      }
    }

    return false;
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

  /**
   * Extract sentiment from response
   */
  private extractSentiment(response: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['أمل', 'تفاؤل', 'إيجابي', 'جيد', 'تحسن', 'نجاح'];
    const negativeWords = ['خوف', 'قلق', 'سلبي', 'سيء', 'تدهور', 'فشل'];

    const lowerResponse = response.toLowerCase();
    const positiveCount = positiveWords.filter(w => lowerResponse.includes(w)).length;
    const negativeCount = negativeWords.filter(w => lowerResponse.includes(w)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Check if sentiment shift is drastic
   */
  private isDrasticSentimentShift(current: string, previous: string): boolean {
    return (
      (current === 'positive' && previous === 'negative') ||
      (current === 'negative' && previous === 'positive')
    );
  }

  /**
   * Calculate consistency score based on violations
   */
  private calculateConsistencyScore(violations: ConsistencyViolation[]): number {
    if (violations.length === 0) return 1.0;

    const severityWeights = {
      low: 0.1,
      medium: 0.3,
      high: 0.5,
    };

    const totalPenalty = violations.reduce((sum, v) => sum + severityWeights[v.severity], 0);
    return Math.max(0, 1 - totalPenalty);
  }
}

export const CognitiveConsistencyCheck = new CognitiveConsistencyCheckClass();
