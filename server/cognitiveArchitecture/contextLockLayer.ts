import { t } from "../_core/i18n";

/**
 * Context Lock Layer
 * 
 * Purpose: Prevents context drift between follow-up questions
 * - Locks the core topic during a session
 * - Validates that follow-up questions stay within the same topic
 * - Prevents the AI from jumping to unrelated subjects
 */

export interface ContextLock {
  sessionId: string;
  coreTopic: string;
  country: string;
  domain: string;
  lockedAt: Date;
  expiresAt: Date;
}

export interface ContextValidation {
  isValid: boolean;
  reason?: string;
  suggestion?: string;
}

class ContextLockLayerClass {
  private locks: Map<string, ContextLock> = new Map();
  private readonly LOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes

  /**
   * Create a context lock for a new session
   */
  createLock(sessionId: string, coreTopic: string, country: string, domain: string): ContextLock {
    const now = new Date();
    const lock: ContextLock = {
      sessionId,
      coreTopic,
      country,
      domain,
      lockedAt: now,
      expiresAt: new Date(now.getTime() + this.LOCK_DURATION_MS),
    };

    this.locks.set(sessionId, lock);
    return lock;
  }

  /**
   * Get the current context lock for a session
   */
  getLock(sessionId: string): ContextLock | null {
    const lock = this.locks.get(sessionId);
    if (!lock) return null;

    // Check if expired
    if (new Date() > lock.expiresAt) {
      this.locks.delete(sessionId);
      return null;
    }

    return lock;
  }

  /**
   * Validate that a follow-up question stays within the locked context
   */
  validateContext(sessionId: string, newQuestion: string, newCountry: string): ContextValidation {
    const lock = this.getLock(sessionId);
    if (!lock) {
      // No lock exists - this is a new session
      return { isValid: true };
    }

    // Check if country changed
    if (newCountry && newCountry !== lock.country) {
      return {
        isValid: false,
        reason: `Country changed from ${lock.country} to ${newCountry}`,
        suggestion: `Continue discussing ${lock.coreTopic} in ${lock.country}, or start a new session for ${newCountry}`,
      };
    }

    // Check if topic drastically changed (simple keyword matching for now)
    const lockKeywords = this.extractKeywords(lock.coreTopic);
    const questionKeywords = this.extractKeywords(newQuestion);
    
    const overlap = lockKeywords.filter(kw => questionKeywords.includes(kw));
    const overlapRatio = overlap.length / Math.max(lockKeywords.length, 1);

    // If less than 20% keyword overlap, likely a different topic
    if (overlapRatio < 0.2 && questionKeywords.length > 2) {
      return {
        isValid: false,
        reason: `Topic changed from "${lock.coreTopic}" to unrelated question`,
        suggestion: `Continue discussing ${lock.coreTopic}, or explicitly start a new topic`,
      };
    }

    return { isValid: true };
  }

  /**
   * Update the core topic of an existing lock (when user explicitly changes topic)
   */
  updateLock(sessionId: string, newCoreTopic: string, newCountry?: string): void {
    const lock = this.getLock(sessionId);
    if (lock) {
      lock.coreTopic = newCoreTopic;
      if (newCountry) lock.country = newCountry;
      lock.lockedAt = new Date();
      lock.expiresAt = new Date(Date.now() + this.LOCK_DURATION_MS);
    }
  }

  /**
   * Clear a context lock (when user explicitly starts a new session)
   */
  clearLock(sessionId: string): void {
    this.locks.delete(sessionId);
  }

  /**
   * Extract keywords from a text (simple implementation)
   */
  private extractKeywords(text: string): string[] {
    // Remove common words and extract meaningful keywords
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
      'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
      'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that',
      'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
      'what', 'which', 'who', 'when', 'where', 'why', 'how',
      // Arabic stop words
      t('auto.cognitiveArchitecture_contextLockLayer.20.aef2099d', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.19.aa7099e2', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.18.8ab80326', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.17.16dc1dd1', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.16.38486333', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.15.f3c3b73b', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.14.6be4d5a7', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.13.f60d1f66', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.12.bcd49587', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.11.5a014748', 'ar'),
      t('auto.cognitiveArchitecture_contextLockLayer.10.d29a8d2f', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.9.07a0f9f0', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.8.a62caa1e', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.7.aa7099e2', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.6.657087a7', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.5.2d0d4abd', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.4.1e55b052', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.3.678c315f', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.2.1b78792e', 'ar'), t('auto.cognitiveArchitecture_contextLockLayer.1.7a898715', 'ar'),
    ]);

    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 10); // Top 10 keywords
  }

  /**
   * Get all active locks (for debugging/monitoring)
   */
  getActiveLocks(): ContextLock[] {
    const now = new Date();
    return Array.from(this.locks.values()).filter(lock => lock.expiresAt > now);
  }
}

export const ContextLockLayer = new ContextLockLayerClass();
