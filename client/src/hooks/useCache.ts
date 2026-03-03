/**
 * INTELLIGENT CACHING HOOK
 * 
 * يوفر نظام تخزين مؤقت ذكي مع localStorage
 * Provides intelligent caching system with localStorage
 */

import { useCallback, useEffect, useState } from 'react';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  tags?: string[];
}

interface UseCacheOptions {
  ttl?: number; // Default TTL in milliseconds (default: 5 minutes)
  maxSize?: number; // Maximum cache size in entries
  namespace?: string; // Cache namespace prefix
}

class CacheManager {
  private namespace: string;
  private maxSize: number;
  private defaultTTL: number;

  constructor(namespace: string = 'amalsense_cache', maxSize: number = 100, defaultTTL: number = 5 * 60 * 1000) {
    this.namespace = namespace;
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  private getKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  set<T>(key: string, data: T, ttl: number = this.defaultTTL, tags: string[] = []): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
        tags
      };

      const fullKey = this.getKey(key);
      localStorage.setItem(fullKey, JSON.stringify(entry));

      // Cleanup old entries if cache is too large
      this.cleanup();
    } catch (err) {
      console.error('Cache set error:', err);
    }
  }

  get<T>(key: string): T | null {
    try {
      const fullKey = this.getKey(key);
      const item = localStorage.getItem(fullKey);

      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      const now = Date.now();
      const age = now - entry.timestamp;

      // Check if entry has expired
      if (age > entry.ttl) {
        localStorage.removeItem(fullKey);
        return null;
      }

      return entry.data;
    } catch (err) {
      console.error('Cache get error:', err);
      return null;
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  remove(key: string): void {
    try {
      const fullKey = this.getKey(key);
      localStorage.removeItem(fullKey);
    } catch (err) {
      console.error('Cache remove error:', err);
    }
  }

  invalidateByTag(tag: string): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.namespace)) {
          const item = localStorage.getItem(key);
          if (item) {
            try {
              const entry: CacheEntry<any> = JSON.parse(item);
              if (entry.tags && entry.tags.includes(tag)) {
                localStorage.removeItem(key);
              }
            } catch (err) {
              // Skip invalid entries
            }
          }
        }
      });
    } catch (err) {
      console.error('Cache invalidate error:', err);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.namespace)) {
          localStorage.removeItem(key);
        }
      });
    } catch (err) {
      console.error('Cache clear error:', err);
    }
  }

  private cleanup(): void {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(this.namespace));

      if (keys.length > this.maxSize) {
        // Remove oldest entries
        const entries = keys
          .map(key => {
            const item = localStorage.getItem(key);
            if (!item) return null;

            try {
              const entry: CacheEntry<any> = JSON.parse(item);
              return { key, timestamp: entry.timestamp };
            } catch {
              return null;
            }
          })
          .filter(Boolean)
          .sort((a, b) => (a?.timestamp || 0) - (b?.timestamp || 0));

        const toRemove = entries.slice(0, entries.length - this.maxSize);
        toRemove.forEach(entry => {
          if (entry) localStorage.removeItem(entry.key);
        });
      }
    } catch (err) {
      console.error('Cache cleanup error:', err);
    }
  }
}

// Global cache instance
let globalCacheManager: CacheManager | null = null;

function getCacheManager(options: UseCacheOptions = {}): CacheManager {
  if (!globalCacheManager) {
    globalCacheManager = new CacheManager(
      options.namespace || 'amalsense_cache',
      options.maxSize || 100,
      options.ttl || 5 * 60 * 1000
    );
  }
  return globalCacheManager;
}

/**
 * Hook for caching data with automatic expiration
 */
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseCacheOptions & { enabled?: boolean } = {}
) {
  const { enabled = true, ttl = 5 * 60 * 1000, ...cacheOptions } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cache = getCacheManager(cacheOptions);

  const fetch = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    // Check cache first
    if (!forceRefresh) {
      const cached = cache.get<T>(key);
      if (cached !== null) {
        setData(cached);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      cache.set(key, result, ttl);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, ttl, enabled, cache]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const invalidate = useCallback(() => {
    cache.remove(key);
    setData(null);
  }, [key, cache]);

  const refresh = useCallback(() => {
    fetch(true);
  }, [fetch]);

  return {
    data,
    isLoading,
    error,
    invalidate,
    refresh
  };
}

/**
 * Hook for caching with tag-based invalidation
 */
export function useCacheWithTags<T>(
  key: string,
  fetcher: () => Promise<T>,
  tags: string[] = [],
  options: UseCacheOptions = {}
) {
  const cache = getCacheManager(options);

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    // Check cache
    const cached = cache.get<T>(key);
    if (cached !== null) {
      setData(cached);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      cache.set(key, result, options.ttl || 5 * 60 * 1000, tags);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, tags, cache, options.ttl]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const invalidateByTag = useCallback((tag: string) => {
    cache.invalidateByTag(tag);
    setData(null);
  }, [cache]);

  return {
    data,
    isLoading,
    error,
    invalidateByTag
  };
}

/**
 * Hook for managing cache globally
 */
export function useCacheManager(options: UseCacheOptions = {}) {
  const cache = getCacheManager(options);

  const set = useCallback(<T,>(key: string, data: T, ttl?: number, tags?: string[]) => {
    cache.set(key, data, ttl, tags);
  }, [cache]);

  const get = useCallback(<T,>(key: string) => {
    return cache.get<T>(key);
  }, [cache]);

  const has = useCallback((key: string) => {
    return cache.has(key);
  }, [cache]);

  const remove = useCallback((key: string) => {
    cache.remove(key);
  }, [cache]);

  const invalidateByTag = useCallback((tag: string) => {
    cache.invalidateByTag(tag);
  }, [cache]);

  const clear = useCallback(() => {
    cache.clear();
  }, [cache]);

  return {
    set,
    get,
    has,
    remove,
    invalidateByTag,
    clear
  };
}

/**
 * Hook combining analysis data with caching
 */
export function useCachedAnalysisData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseCacheOptions = {}
) {
  return useCache(key, fetcher, {
    ...options,
    ttl: options.ttl || 10 * 60 * 1000, // 10 minutes default for analysis data
    namespace: 'amalsense_analysis'
  });
}
