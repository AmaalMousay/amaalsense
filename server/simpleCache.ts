/**
 * Simple Cache System - High Performance Caching
 * 
 * نظام caching بسيط وفعال بدون dependencies خارجية
 */

// ============================================================================
// Cache Entry Interface
// ============================================================================

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  hits: number;
  created: number;
}

// ============================================================================
// Simple Cache Class
// ============================================================================

export class SimpleCache<T = any> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    evictions: 0,
  };
  private maxSize: number;
  private defaultTTL: number;
  private cleanupInterval: any = null;

  constructor(maxSize: number = 1000, defaultTTL: number = 300) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    this.startCleanup();
  }

  /**
   * Get value from cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update hit count
    entry.hits++;
    this.stats.hits++;

    return entry.value;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T, ttl?: number): void {
    this.stats.sets++;

    // Check if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    const ttlSeconds = ttl || this.defaultTTL;
    const expiresAt = Date.now() + ttlSeconds * 1000;

    this.cache.set(key, {
      value,
      expiresAt,
      hits: 0,
      created: Date.now(),
    });
  }

  /**
   * Delete value from cache
   */
  delete(key: string): boolean {
    this.stats.deletes++;
    return this.cache.delete(key);
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Get or compute value
   */
  async getOrSet(
    key: string,
    compute: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    const value = await compute();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear by pattern
   */
  clearPattern(pattern: string): number {
    let count = 0;
    const keys = Array.from(this.cache.keys());
    for (const key of keys) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruTime = Infinity;

    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (entry.created < lruTime) {
        lruTime = entry.created;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      this.stats.evictions++;
    }
  }

  /**
   * Start cleanup interval
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval((): void => {
      const now = Date.now();
      let cleaned = 0;

      const entries = Array.from(this.cache.entries());
      for (const [key, entry] of entries) {
        if (entry.expiresAt < now) {
          this.cache.delete(key);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        console.log(`[Cache] Cleaned ${cleaned} expired entries`);
      }
    }, 60000); // Run every minute
  }

  /**
   * Stop cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : '0.00';

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      sets: this.stats.sets,
      deletes: this.stats.deletes,
      evictions: this.stats.evictions,
      hitRate: `${hitRate}%`,
      usage: `${((this.cache.size / this.maxSize) * 100).toFixed(2)}%`,
    };
  }

  /**
   * Get cache keys
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all cache data
   */
  getAll(): Record<string, T> {
    const data: Record<string, T> = {};
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (entry.expiresAt > Date.now()) {
        data[key] = entry.value;
      }
    }
    return data;
  }
}

// ============================================================================
// Specialized Caches
// ============================================================================

export class AnalysisCache extends SimpleCache {
  constructor() {
    super(500, 600); // 500 entries, 10 minutes TTL
  }

  getKey(topic: string, region?: string): string {
    return region ? `analysis:${topic}:${region}` : `analysis:${topic}`;
  }

  getAnalysis(topic: string, region?: string): any {
    return this.get(this.getKey(topic, region));
  }

  setAnalysis(topic: string, value: any, region?: string): void {
    this.set(this.getKey(topic, region), value);
  }

  clearAnalysis(topic?: string): number {
    if (topic) {
      return this.clearPattern(`analysis:${topic}`);
    }
    return this.clearPattern('analysis:');
  }
}

export class PredictionCache extends SimpleCache {
  constructor() {
    super(300, 1800); // 300 entries, 30 minutes TTL
  }

  getKey(metric: string, days: number): string {
    return `forecast:${metric}:${days}d`;
  }

  getForecast(metric: string, days: number): any {
    return this.get(this.getKey(metric, days));
  }

  setForecast(metric: string, days: number, value: any): void {
    this.set(this.getKey(metric, days), value);
  }

  clearForecasts(): number {
    return this.clearPattern('forecast:');
  }
}

export class UserCache extends SimpleCache {
  constructor() {
    super(1000, 3600); // 1000 entries, 1 hour TTL
  }

  getKey(userId: string, type: string): string {
    return `user:${userId}:${type}`;
  }

  getUserData(userId: string, type: string): any {
    return this.get(this.getKey(userId, type));
  }

  setUserData(userId: string, type: string, value: any): void {
    this.set(this.getKey(userId, type), value);
  }

  clearUserData(userId: string): number {
    return this.clearPattern(`user:${userId}:`);
  }
}

// ============================================================================
// Global Cache Instances
// ============================================================================

export const analysisCache = new AnalysisCache();
export const predictionCache = new PredictionCache();
export const userCache = new UserCache();
export const generalCache = new SimpleCache(2000, 300);

// ============================================================================
// Cache Middleware Helper
// ============================================================================

export async function withCache<T>(
  key: string,
  compute: () => Promise<T>,
  ttl?: number,
  cache: SimpleCache = generalCache
): Promise<T> {
  return cache.getOrSet(key, compute, ttl);
}

// ============================================================================
// Export
// ============================================================================

export const cacheSystem = {
  SimpleCache,
  AnalysisCache,
  PredictionCache,
  UserCache,
  analysisCache,
  predictionCache,
  userCache,
  generalCache,
  withCache,
};
