/**
 * Context Lock Layer
 *
 * Prevents context drift in follow-up questions. The central network can use
 * this layer to keep a session focused unless the user clearly changes topic.
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
  private locks = new Map<string, ContextLock>();
  private readonly lockDurationMs = 30 * 60 * 1000; // 30 minutes

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
      expiresAt: new Date(now.getTime() + this.lockDurationMs),
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
    if (!lock) return { isValid: true };

    if (newCountry && newCountry !== 'global' && newCountry !== lock.country) {
      return {
        isValid: false,
        reason: `Country changed from ${lock.country} to ${newCountry}`,
        suggestion: `Continue the current topic or start a new session for ${newCountry}.`,
      };
    }

    const lockKeywords = this.extractKeywords(lock.coreTopic);
    const questionKeywords = this.extractKeywords(newQuestion);
    const overlap = lockKeywords.filter((kw) => questionKeywords.includes(kw));
    const overlapRatio = overlap.length / Math.max(lockKeywords.length, 1);

    if (lockKeywords.length > 2 && questionKeywords.length > 2 && overlapRatio < 0.2) {
      return {
        isValid: false,
        reason: `Question appears unrelated to locked topic "${lock.coreTopic}".`,
        suggestion: 'Confirm whether you want to switch topics.',
      };
    }

    return { isValid: true };
  }

  /**
   * Update an existing lock when the user explicitly changes topic
   */
  updateLock(sessionId: string, newCoreTopic: string, newCountry?: string): void {
    const lock = this.getLock(sessionId);
    if (!lock) return;
    lock.coreTopic = newCoreTopic;
    if (newCountry) lock.country = newCountry;
    lock.lockedAt = new Date();
    lock.expiresAt = new Date(Date.now() + this.lockDurationMs);
  }

  /**
   * Clear a context lock
   */
  clearLock(sessionId: string): void {
    this.locks.delete(sessionId);
  }

  /**
   * Get all active locks (for debugging / monitoring)
   */
  getActiveLocks(): ContextLock[] {
    const now = new Date();
    return [...this.locks.values()].filter((lock) => lock.expiresAt > now);
  }

  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'this',
      'that', 'what', 'which', 'who', 'when', 'where', 'why', 'how',
    ]);
    return (text.toLowerCase().match(/[\p{L}\p{N}_]+/gu) || [])
      .filter((word) => word.length > 2 && !stopWords.has(word))
      .slice(0, 12);
  }
}

export const ContextLockLayer = new ContextLockLayerClass();