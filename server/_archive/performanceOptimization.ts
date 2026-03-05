/**
 * Performance Optimization & Caching Strategies
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

/**
 * Advanced Cache Manager with TTL and Memory Management
 */
export class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxSize: number = 1000;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(maxSize: number = 1000, cleanupIntervalMs: number = 60000) {
    this.maxSize = maxSize;
    this.startCleanupInterval(cleanupIntervalMs);
  }

  /**
   * Set cache entry with TTL
   */
  public set<T>(key: string, data: T, ttlMs: number = 300000): void {
    // Check size limit
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  /**
   * Get cache entry if not expired
   */
  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if key exists and is valid
   */
  public has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete cache entry
   */
  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  public getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilizationPercent: (this.cache.size / this.maxSize) * 100
    };
  }

  /**
   * Evict oldest entry when cache is full
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

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
   * Start periodic cleanup of expired entries
   */
  private startCleanupInterval(intervalMs: number): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, intervalMs);
  }

  /**
   * Clean up expired entries
   */
  private cleanupExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    
    if (keysToDelete.length > 0) {
      console.log(`[Cache] Cleaned up ${keysToDelete.length} expired entries`);
    }
  }

  /**
   * Stop cleanup interval
   */
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

/**
 * Query Result Cache for Database Queries
 */
export class QueryCache {
  private cache: CacheManager;

  constructor(maxSize: number = 500) {
    this.cache = new CacheManager(maxSize);
  }

  /**
   * Generate cache key from query parameters
   */
  private generateKey(query: string, params: Record<string, any>): string {
    const paramStr = JSON.stringify(params);
    return `query:${query}:${paramStr}`;
  }

  /**
   * Get cached query result
   */
  public getQueryResult<T>(query: string, params: Record<string, any>): T | null {
    const key = this.generateKey(query, params);
    return this.cache.get<T>(key);
  }

  /**
   * Set cached query result
   */
  public setQueryResult<T>(
    query: string,
    params: Record<string, any>,
    result: T,
    ttlMs: number = 300000
  ): void {
    const key = this.generateKey(query, params);
    this.cache.set(key, result, ttlMs);
  }

  /**
   * Invalidate query cache by pattern
   */
  public invalidateByPattern(pattern: string): void {
    // Simple pattern matching - can be enhanced
    const keysToDelete: string[] = [];
    
    for (const key of this.cache['cache'].keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Get cache statistics
   */
  public getStats() {
    return this.cache.getStats();
  }

  /**
   * Clear all query cache
   */
  public clear(): void {
    this.cache.clear();
  }
}

/**
 * Database Query Optimization Utilities
 */
export class QueryOptimizer {
  /**
   * Create optimized index suggestions
   */
  public static suggestIndexes(queryPatterns: string[]): string[] {
    const suggestions: string[] = [];

    // Analyze query patterns and suggest indexes
    for (const pattern of queryPatterns) {
      if (pattern.includes('WHERE') && pattern.includes('country')) {
        suggestions.push('CREATE INDEX idx_country ON analyses(country)');
      }
      if (pattern.includes('WHERE') && pattern.includes('createdAt')) {
        suggestions.push('CREATE INDEX idx_created_at ON analyses(createdAt)');
      }
      if (pattern.includes('WHERE') && pattern.includes('topic')) {
        suggestions.push('CREATE INDEX idx_topic ON analyses(topic)');
      }
    }

    return [...new Set(suggestions)]; // Remove duplicates
  }

  /**
   * Optimize query with pagination
   */
  public static addPagination(
    query: string,
    page: number = 1,
    pageSize: number = 50
  ): { query: string; offset: number; limit: number } {
    const offset = (page - 1) * pageSize;
    return {
      query: `${query} LIMIT ${pageSize} OFFSET ${offset}`,
      offset,
      limit: pageSize
    };
  }

  /**
   * Batch query optimization
   */
  public static batchQueries(
    queries: string[],
    batchSize: number = 10
  ): string[][] {
    const batches: string[][] = [];
    
    for (let i = 0; i < queries.length; i += batchSize) {
      batches.push(queries.slice(i, i + batchSize));
    }

    return batches;
  }
}

/**
 * Response Compression Utilities
 */
export class ResponseCompressor {
  /**
   * Compress JSON response
   */
  public static compressJSON(data: any): string {
    // Remove unnecessary whitespace
    return JSON.stringify(data);
  }

  /**
   * Estimate response size
   */
  public static estimateSize(data: any): number {
    const json = JSON.stringify(data);
    return new Blob([json]).size;
  }

  /**
   * Truncate large responses
   */
  public static truncateResponse<T>(
    data: T[],
    maxSize: number = 100
  ): T[] {
    if (data.length > maxSize) {
      console.warn(`[Response] Truncating ${data.length} items to ${maxSize}`);
      return data.slice(0, maxSize);
    }
    return data;
  }
}

/**
 * Global Cache Instance
 */
export const globalCache = new CacheManager(1000);
export const queryCache = new QueryCache(500);

/**
 * Initialize Performance Monitoring
 */
export function initializePerformanceMonitoring() {
  // Log cache stats every minute
  setInterval(() => {
    const stats = globalCache.getStats();
    console.log('[Performance] Cache Stats:', stats);
  }, 60000);
}
