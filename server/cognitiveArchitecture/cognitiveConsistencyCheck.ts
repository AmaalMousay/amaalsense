import { t } from "../_core/i18n";

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
              description: t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.27.e98e6421', 'ar'),
              previousStatement: prevStmt,
              currentStatement: currentStmt,
              suggestion: t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.26.fb747397', 'ar'),
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
        description: t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.25.c649b334', 'ar'),
        previousStatement: `: ${currentTopic}`,
        currentStatement: `  : ${currentKeywords.slice(0, 5).join(', ')}`,
        suggestion: t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.24.174b331c', 'ar'),
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
        description: t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.23.c04ae227', 'ar'),
        previousStatement: ` : ${prevSentiment}`,
        currentStatement: ` : ${currentSentiment}`,
        suggestion: t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.22.9b66ce5d', 'ar'),
      };
    }

    return null;
  }

  /**
   * Extract key statements from response
   */
  private extractKeyStatements(response: string): string[] {
    // Split by sentence endings
    const sentences = response.split(/[.!?]/);
    
    // Filter for statements with strong assertions
    const assertionPatterns = [
      //,
      / /,
      //,
      / /,
      / /,
      / /,
      //,
      / /,
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
      { positive: /improving|positive|stable/i, negative: /worsening|negative|unstable/i },
      { positive: /increase|rising|higher/i, negative: /decrease|falling|lower/i },
      { positive: /safe|low risk/i, negative: /danger|high risk/i },
      { positive: /confidence|certainty/i, negative: /uncertainty|doubt/i },
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
      t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.21.aef2099d', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.20.aa7099e2', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.19.8ab80326', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.18.16dc1dd1', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.17.38486333', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.16.f3c3b73b', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.15.6be4d5a7', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.14.f60d1f66', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.13.bcd49587', 'ar'),
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
    const positiveWords = [t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.12.60cd6c3d', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.11.e01009da', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.10.3c9380a2', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.9.c4242fc2', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.8.ab4c7e3d', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.7.2eb748dc', 'ar')];
    const negativeWords = [t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.6.1cf83ec0', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.5.a24a5460', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.4.a5ed0453', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.3.f4fc67ca', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.2.b3af2cb5', 'ar'), t('auto.cognitiveArchitecture_cognitiveConsistencyCheck.1.9fa00bdb', 'ar')];

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
