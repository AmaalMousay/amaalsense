/**
 * Evidence Grounding Layer
 * 
 * Purpose: Links analysis to actual data (news headlines, real text)
 * - Ensures reasons come from real evidence, not abstract numbers
 * - Provides citations and sources
 * - Prevents disconnection between data and interpretation
 */

export interface Evidence {
  type: 'news_headline' | 'social_post' | 'historical_data' | 'expert_quote';
  content: string;
  source: string;
  timestamp: Date;
  relevance: number; // 0-1
  sentiment?: string;
}

export interface GroundedStatement {
  claim: string;
  evidence: Evidence[];
  confidence: number;
  isGrounded: boolean;
}

export interface GroundingReport {
  totalStatements: number;
  groundedStatements: number;
  ungroundedStatements: number;
  groundingScore: number;
  weaklyGroundedClaims: string[];
}

class EvidenceGroundingClass {
  /**
   * Ground a response in actual evidence
   */
  groundResponse(
    response: string,
    availableEvidence: Evidence[]
  ): {
    groundedResponse: string;
    groundingReport: GroundingReport;
  } {
    // Extract claims from response
    const claims = this.extractClaims(response);

    // Ground each claim
    const groundedStatements: GroundedStatement[] = claims.map(claim =>
      this.groundClaim(claim, availableEvidence)
    );

    // Build grounding report
    const groundingReport = this.buildGroundingReport(groundedStatements);

    // Enhance response with evidence citations
    const groundedResponse = this.enhanceWithCitations(response, groundedStatements);

    return {
      groundedResponse,
      groundingReport,
    };
  }

  /**
   * Ground a single claim in evidence
   */
  groundClaim(claim: string, availableEvidence: Evidence[]): GroundedStatement {
    // Find relevant evidence for this claim
    const relevantEvidence = this.findRelevantEvidence(claim, availableEvidence);

    // Calculate grounding confidence
    const confidence = this.calculateGroundingConfidence(relevantEvidence);

    return {
      claim,
      evidence: relevantEvidence,
      confidence,
      isGrounded: confidence >= 0.5,
    };
  }

  /**
   * Extract claims from response
   */
  private extractClaims(response: string): string[] {
    // Split by sentences
    const sentences = response.split(/[.!?؟]/);

    // Filter for factual claims (statements, not questions or greetings)
    const claims = sentences
      .map(s => s.trim())
      .filter(s => s.length > 10)
      .filter(s => !this.isQuestion(s))
      .filter(s => !this.isGreeting(s));

    return claims;
  }

  /**
   * Find evidence relevant to a claim
   */
  private findRelevantEvidence(claim: string, availableEvidence: Evidence[]): Evidence[] {
    // Extract keywords from claim
    const claimKeywords = this.extractKeywords(claim);

    // Score each evidence by relevance
    const scoredEvidence = availableEvidence.map(evidence => {
      const evidenceKeywords = this.extractKeywords(evidence.content);
      const overlap = claimKeywords.filter(kw => evidenceKeywords.includes(kw));
      const relevance = overlap.length / Math.max(claimKeywords.length, 1);

      return {
        ...evidence,
        relevance,
      };
    });

    // Return top 3 most relevant pieces of evidence
    return scoredEvidence
      .filter(e => e.relevance > 0.2)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 3);
  }

  /**
   * Calculate grounding confidence
   */
  private calculateGroundingConfidence(evidence: Evidence[]): number {
    if (evidence.length === 0) return 0;

    // Average relevance of evidence
    const avgRelevance = evidence.reduce((sum, e) => sum + e.relevance, 0) / evidence.length;

    // Bonus for multiple pieces of evidence
    const evidenceBonus = Math.min(0.2, evidence.length * 0.1);

    return Math.min(1.0, avgRelevance + evidenceBonus);
  }

  /**
   * Build grounding report
   */
  private buildGroundingReport(groundedStatements: GroundedStatement[]): GroundingReport {
    const totalStatements = groundedStatements.length;
    const groundedCount = groundedStatements.filter(s => s.isGrounded).length;
    const ungroundedCount = totalStatements - groundedCount;

    const weaklyGroundedClaims = groundedStatements
      .filter(s => s.confidence > 0 && s.confidence < 0.5)
      .map(s => s.claim);

    const groundingScore = totalStatements > 0 ? groundedCount / totalStatements : 0;

    return {
      totalStatements,
      groundedStatements: groundedCount,
      ungroundedStatements: ungroundedCount,
      groundingScore,
      weaklyGroundedClaims,
    };
  }

  /**
   * Enhance response with evidence citations
   */
  private enhanceWithCitations(response: string, groundedStatements: GroundedStatement[]): string {
    let enhanced = response;

    // For each grounded statement, add citation if confidence is high
    for (const statement of groundedStatements) {
      if (statement.confidence >= 0.7 && statement.evidence.length > 0) {
        const topEvidence = statement.evidence[0];
        const citation = `\n\n*المصدر: ${topEvidence.source}*`;
        
        // Add citation after the claim (simple approach)
        enhanced = enhanced.replace(statement.claim, statement.claim + citation);
      }
    }

    return enhanced;
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
   * Check if sentence is a question
   */
  private isQuestion(sentence: string): boolean {
    return /[?؟]/.test(sentence) || /^(what|who|when|where|why|how|ما|من|متى|أين|لماذا|كيف)/i.test(sentence);
  }

  /**
   * Check if sentence is a greeting
   */
  private isGreeting(sentence: string): boolean {
    const greetingPatterns = [
      /^(hello|hi|hey|مرحبا|أهلا|السلام)/i,
      /^(thank|شكرا)/i,
      /^(goodbye|bye|وداعا)/i,
    ];

    return greetingPatterns.some(pattern => pattern.test(sentence));
  }

  /**
   * Validate that response is grounded in evidence
   */
  validateGrounding(groundingReport: GroundingReport): {
    isValid: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];

    // Check grounding score
    if (groundingReport.groundingScore < 0.5) {
      warnings.push(`درجة التأريض منخفضة: ${(groundingReport.groundingScore * 100).toFixed(0)}%`);
    }

    // Check for ungrounded statements
    if (groundingReport.ungroundedStatements > groundingReport.totalStatements / 2) {
      warnings.push(`عدد كبير من الادعاءات غير المدعومة بأدلة: ${groundingReport.ungroundedStatements}`);
    }

    // Check for weakly grounded claims
    if (groundingReport.weaklyGroundedClaims.length > 0) {
      warnings.push(`ادعاءات ضعيفة التأريض: ${groundingReport.weaklyGroundedClaims.length}`);
    }

    return {
      isValid: warnings.length === 0,
      warnings,
    };
  }
}

export const EvidenceGrounding = new EvidenceGroundingClass();
