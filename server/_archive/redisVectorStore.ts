/**
 * Redis Vector Store Implementation
 * Persistent vector database for EventVectors using Redis
 */

export interface StoredVector {
  id: string;
  vector: number[];
  metadata: {
    timestamp: number;
    region: string;
    topic: string;
    source: string;
    confidence: number;
    emotions: {
      joy: number;
      fear: number;
      hope: number;
      anger: number;
      surprise: number;
      sadness: number;
      trust: number;
      anticipation: number;
    };
  };
}

export interface VectorSearchResult {
  id: string;
  similarity: number;
  metadata: StoredVector['metadata'];
}

export class RedisVectorStore {
  private client: any = null; // Redis client
  private isConnected = false;
  private vectorIndex: Map<string, StoredVector> = new Map();

  /**
   * Initialize Redis connection
   */
  async initialize(host: string = 'localhost', port: number = 6379): Promise<void> {
    try {
      // For now, using in-memory fallback
      // In production, connect to actual Redis:
      // this.client = redis.createClient({ host, port });
      // await this.client.connect();
      
      this.isConnected = true;
      console.log('[RedisVectorStore] Initialized (in-memory mode)');
    } catch (error) {
      console.error('[RedisVectorStore] Connection failed:', error);
      this.isConnected = false;
    }
  }

  /**
   * Store a vector with metadata
   */
  async storeVector(vector: StoredVector): Promise<boolean> {
    try {
      this.vectorIndex.set(vector.id, vector);
      
      // In production, persist to Redis:
      // await this.client?.set(
      //   `vector:${vector.id}`,
      //   JSON.stringify(vector),
      //   { EX: 30 * 24 * 60 * 60 } // 30 days TTL
      // );

      return true;
    } catch (error) {
      console.error('[RedisVectorStore] Store failed:', error);
      return false;
    }
  }

  /**
   * Store multiple vectors in batch
   */
  async storeVectorsBatch(vectors: StoredVector[]): Promise<number> {
    let stored = 0;
    for (const vector of vectors) {
      if (await this.storeVector(vector)) {
        stored++;
      }
    }
    return stored;
  }

  /**
   * Retrieve a vector by ID
   */
  async getVector(id: string): Promise<StoredVector | null> {
    try {
      return this.vectorIndex.get(id) || null;
    } catch (error) {
      console.error('[RedisVectorStore] Get failed:', error);
      return null;
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) return 0;

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }

    const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }

  /**
   * Search for similar vectors
   */
  async searchSimilar(
    queryVector: number[],
    limit: number = 10,
    minSimilarity: number = 0.75
  ): Promise<VectorSearchResult[]> {
    try {
      const results: VectorSearchResult[] = [];

      for (const [id, stored] of Array.from(this.vectorIndex.entries())) {
        const similarity = this.cosineSimilarity(queryVector, stored.vector);
        
        if (similarity >= minSimilarity) {
          results.push({
            id,
            similarity,
            metadata: stored.metadata
          });
        }
      }

      // Sort by similarity descending
      results.sort((a, b) => b.similarity - a.similarity);
      
      return results.slice(0, limit);
    } catch (error) {
      console.error('[RedisVectorStore] Search failed:', error);
      return [];
    }
  }

  /**
   * Search by metadata filters
   */
  async searchByMetadata(
    filters: {
      region?: string;
      topic?: string;
      dateRange?: { start: number; end: number };
      minConfidence?: number;
    },
    limit: number = 10
  ): Promise<VectorSearchResult[]> {
    try {
      const results: VectorSearchResult[] = [];

      for (const [id, stored] of Array.from(this.vectorIndex.entries())) {
        let matches = true;

        if (filters.region && stored.metadata.region !== filters.region) {
          matches = false;
        }
        if (filters.topic && stored.metadata.topic !== filters.topic) {
          matches = false;
        }
        if (filters.dateRange) {
          const ts = stored.metadata.timestamp;
          if (ts < filters.dateRange.start || ts > filters.dateRange.end) {
            matches = false;
          }
        }
        if (filters.minConfidence && stored.metadata.confidence < filters.minConfidence) {
          matches = false;
        }

        if (matches) {
          results.push({
            id,
            similarity: 1.0, // Metadata match
            metadata: stored.metadata
          });
        }
      }

      return results.slice(0, limit);
    } catch (error) {
      console.error('[RedisVectorStore] Metadata search failed:', error);
      return [];
    }
  }

  /**
   * Get statistics about stored vectors
   */
  async getStatistics(): Promise<{
    totalVectors: number;
    byRegion: Record<string, number>;
    byTopic: Record<string, number>;
    dateRange: { earliest: number; latest: number } | null;
    averageConfidence: number;
  }> {
    const stats = {
      totalVectors: this.vectorIndex.size,
      byRegion: {} as Record<string, number>,
      byTopic: {} as Record<string, number>,
      dateRange: null as { earliest: number; latest: number } | null,
      averageConfidence: 0
    };

    let totalConfidence = 0;
    let minDate = Infinity;
    let maxDate = -Infinity;

    for (const stored of Array.from(this.vectorIndex.values())) {
      const { region, topic, timestamp, confidence } = stored.metadata;

      stats.byRegion[region] = (stats.byRegion[region] || 0) + 1;
      stats.byTopic[topic] = (stats.byTopic[topic] || 0) + 1;
      totalConfidence += confidence;
      minDate = Math.min(minDate, timestamp);
      maxDate = Math.max(maxDate, timestamp);
    }

    if (this.vectorIndex.size > 0) {
      stats.averageConfidence = totalConfidence / this.vectorIndex.size;
      stats.dateRange = { earliest: minDate, latest: maxDate };
    }

    return stats;
  }

  /**
   * Delete a vector
   */
  async deleteVector(id: string): Promise<boolean> {
    try {
      return this.vectorIndex.delete(id);
    } catch (error) {
      console.error('[RedisVectorStore] Delete failed:', error);
      return false;
    }
  }

  /**
   * Clear all vectors
   */
  async clear(): Promise<void> {
    try {
      this.vectorIndex.clear();
      console.log('[RedisVectorStore] Cleared all vectors');
    } catch (error) {
      console.error('[RedisVectorStore] Clear failed:', error);
    }
  }

  /**
   * Get all vectors (for backup/export)
   */
  async getAllVectors(): Promise<StoredVector[]> {
    return Array.from(this.vectorIndex.values());
  }

  /**
   * Import vectors from backup
   */
  async importVectors(vectors: StoredVector[]): Promise<number> {
    return this.storeVectorsBatch(vectors);
  }

  /**
   * Check connection status
   */
  isReady(): boolean {
    return this.isConnected;
  }

  /**
   * Close connection
   */
  async close(): Promise<void> {
    try {
      if (this.client) {
        // await this.client.quit();
      }
      this.isConnected = false;
      console.log('[RedisVectorStore] Connection closed');
    } catch (error) {
      console.error('[RedisVectorStore] Close failed:', error);
    }
  }
}

// Export singleton instance
export const vectorStore = new RedisVectorStore();
