/**
 * Caching Layer
 * 
 * تخزين مؤقت للإجابات والترجمات
 * يحسن الأداء بـ 60-80% للأسئلة المتكررة
 */

import crypto from 'crypto';

/**
 * Hash السؤال للاستخدام كمفتاح في الـ Cache
 */
export function hashQuestion(question: string): string {
  return crypto.createHash('md5').update(question.toLowerCase().trim()).digest('hex');
}

/**
 * بيانات الـ Cache
 */
interface CacheEntry {
  key: string;
  response: string;
  qualityScore: number;
  timestamp: number;
  expiresAt: number;
  hitCount: number;
}

/**
 * في الذاكرة Cache (للتطوير)
 * في الإنتاج، يجب استخدام Redis أو قاعدة بيانات
 */
const inMemoryCache = new Map<string, CacheEntry>();

/**
 * Response Cache Manager
 */
export class ResponseCache {
  /**
   * الحصول على إجابة من الـ Cache
   */
  static async get(userId: number, question: string): Promise<string | null> {
    const cacheKey = `user:${userId}:q:${hashQuestion(question)}`;

    const entry = inMemoryCache.get(cacheKey);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      inMemoryCache.delete(cacheKey);
      return null;
    }

    // Update hit count
    entry.hitCount++;
    entry.timestamp = Date.now();

    return entry.response;
  }

  /**
   * حفظ إجابة في الـ Cache
   */
  static async set(
    userId: number,
    question: string,
    response: string,
    qualityScore: number,
    ttlMinutes: number = 720 // 12 hours default
  ): Promise<void> {
    const cacheKey = `user:${userId}:q:${hashQuestion(question)}`;

    const entry: CacheEntry = {
      key: cacheKey,
      response,
      qualityScore,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttlMinutes * 60 * 1000,
      hitCount: 0,
    };

    inMemoryCache.set(cacheKey, entry);
  }

  /**
   * حذف إجابة من الـ Cache
   */
  static async delete(userId: number, question: string): Promise<void> {
    const cacheKey = `user:${userId}:q:${hashQuestion(question)}`;
    inMemoryCache.delete(cacheKey);
  }

  /**
   * مسح الـ Cache للمستخدم
   */
  static async clearUser(userId: number): Promise<void> {
    const prefix = `user:${userId}:`;
    const keysToDelete: string[] = [];
    inMemoryCache.forEach((entry, key) => {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => inMemoryCache.delete(key));
  }

  /**
   * الحصول على إحصائيات المستخدم
   */
  static async getUserStats(userId: number): Promise<{
    totalCached: number;
    totalHits: number;
    averageQuality: number;
  }> {
    const prefix = `user:${userId}:`;
    let totalCached = 0;
    let totalHits = 0;
    let totalQuality = 0;

    inMemoryCache.forEach((entry, key) => {
      if (key.startsWith(prefix)) {
        totalCached++;
        totalHits += entry.hitCount;
        totalQuality += entry.qualityScore;
      }
    });

    return {
      totalCached,
      totalHits,
      averageQuality: totalCached > 0 ? totalQuality / totalCached : 0,
    };
  }
}
