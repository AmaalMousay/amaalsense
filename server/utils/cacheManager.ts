/**
 * Cache Manager - In-memory caching system with TTL support
 * Reduces API calls and improves response times for repeated queries
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
  hits: number;
  source: string;
}

interface CacheStats {
  totalEntries: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  sources: Record<string, { entries: number; hits: number }>;
  memoryUsageEstimate: string;
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private totalHits = 0;
  private totalMisses = 0;
  private maxEntries = 500;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Run cleanup every 60 seconds
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Generate a cache key from query parameters
   */
  private generateKey(source: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(k => `${k}=${JSON.stringify(params[k])}`)
      .join("&");
    return `${source}:${sortedParams}`;
  }

  /**
   * Get cached data if available and not expired
   */
  get<T>(source: string, params: Record<string, any>): T | null {
    const key = this.generateKey(source, params);
    const entry = this.cache.get(key);

    if (!entry) {
      this.totalMisses++;
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Expired
      this.cache.delete(key);
      this.totalMisses++;
      return null;
    }

    entry.hits++;
    this.totalHits++;
    return entry.data as T;
  }

  /**
   * Store data in cache with TTL
   */
  set<T>(source: string, params: Record<string, any>, data: T, ttlMs: number): void {
    const key = this.generateKey(source, params);

    // Evict oldest entries if at capacity
    if (this.cache.size >= this.maxEntries) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
      hits: 0,
      source,
    });
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let removed = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        removed++;
      }
    }
    if (removed > 0) {
      console.log(`[Cache] Cleaned up ${removed} expired entries`);
    }
  }

  /**
   * Evict the oldest entries when cache is full
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const sources: Record<string, { entries: number; hits: number }> = {};

    for (const entry of this.cache.values()) {
      if (!sources[entry.source]) {
        sources[entry.source] = { entries: 0, hits: 0 };
      }
      sources[entry.source].entries++;
      sources[entry.source].hits += entry.hits;
    }

    const totalRequests = this.totalHits + this.totalMisses;
    return {
      totalEntries: this.cache.size,
      totalHits: this.totalHits,
      totalMisses: this.totalMisses,
      hitRate: totalRequests > 0 ? Math.round((this.totalHits / totalRequests) * 100) : 0,
      sources,
      memoryUsageEstimate: `~${Math.round(this.cache.size * 2)}KB`,
    };
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.totalHits = 0;
    this.totalMisses = 0;
  }

  /**
   * Clear cache for a specific source
   */
  clearSource(source: string): void {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.source === source) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Destroy the cache manager (cleanup interval)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cache.clear();
  }
}

// Singleton instance
export const cacheManager = new CacheManager();

// TTL Constants (in milliseconds)
export const CACHE_TTL = {
  GNEWS: 5 * 60 * 1000,       // 5 minutes for news
  NEWS_API: 5 * 60 * 1000,    // 5 minutes for news
  REDDIT: 3 * 60 * 1000,      // 3 minutes for social media
  MASTODON: 3 * 60 * 1000,    // 3 minutes for social media
  BLUESKY: 3 * 60 * 1000,     // 3 minutes for social media
  YOUTUBE: 5 * 60 * 1000,     // 5 minutes for YouTube
  TELEGRAM: 2 * 60 * 1000,    // 2 minutes for Telegram
  LLM_ANALYSIS: 10 * 60 * 1000, // 10 minutes for LLM analysis
  TOPIC_ANALYSIS: 5 * 60 * 1000, // 5 minutes for topic analysis
} as const;

/**
 * Wrapper function to cache any async function call
 */
export async function withCache<T>(
  source: string,
  params: Record<string, any>,
  ttlMs: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  // Check cache first
  const cached = cacheManager.get<T>(source, params);
  if (cached !== null) {
    console.log(`[Cache] HIT for ${source}`);
    return cached;
  }

  // Fetch fresh data
  console.log(`[Cache] MISS for ${source}, fetching...`);
  const data = await fetchFn();

  // Store in cache
  cacheManager.set(source, params, data, ttlMs);

  return data;
}
