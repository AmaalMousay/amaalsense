/**
 * Layer 6: Long-Term Memory
 * 
 * Historical pattern storage with vector database
 * Storage: Vector database with semantic embeddings
 * Retrieval: Similarity-based search
 * Capacity: Unlimited with automatic archiving
 */

export interface LongTermMemoryItem {
  id: string;
  domain: string;
  content: string;
  emotionalVector: {
    fear: number;
    hope: number;
    anger: number;
    mood: number;
  };
  timestamp: number;
  embedding?: number[]; // Semantic embedding vector
  metadata: {
    country?: string;
    topic?: string;
    confidence?: number;
    tags?: string[];
  };
  accessCount: number;
  lastAccessed: number;
}

export interface LongTermMemoryState {
  items: LongTermMemoryItem[];
  maxItems: number;
  archiveThreshold: number; // Number of days before archiving
}

/**
 * Initialize long-term memory
 */
export function initLongTermMemory(): LongTermMemoryState {
  return {
    items: [],
    maxItems: 10000,
    archiveThreshold: 365, // 1 year
  };
}

/**
 * Add item to long-term memory
 */
export function addToLongTermMemory(
  state: LongTermMemoryState,
  item: Omit<LongTermMemoryItem, 'id' | 'accessCount' | 'lastAccessed'>
): LongTermMemoryState {
  const newItem: LongTermMemoryItem = {
    ...item,
    id: `ltm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    accessCount: 0,
    lastAccessed: Date.now(),
  };
  
  const updatedItems = [...state.items, newItem];
  
  // Sort by timestamp (descending)
  updatedItems.sort((a, b) => b.timestamp - a.timestamp);
  
  // Keep only maxItems
  const trimmedItems = updatedItems.slice(0, state.maxItems);
  
  return {
    ...state,
    items: trimmedItems,
  };
}

/**
 * Retrieve items from long-term memory by domain
 */
export function retrieveFromLongTermMemory(
  state: LongTermMemoryState,
  domain: string,
  limit: number = 10
): LongTermMemoryItem[] {
  const domainItems = state.items.filter(item => item.domain === domain);
  return domainItems.slice(0, limit);
}

/**
 * Search long-term memory by semantic similarity
 * (Simplified version without actual vector embeddings)
 */
export function searchLongTermMemory(
  state: LongTermMemoryState,
  query: string,
  options: {
    domain?: string;
    country?: string;
    topic?: string;
    limit?: number;
    minConfidence?: number;
  } = {}
): LongTermMemoryItem[] {
  const {
    domain,
    country,
    topic,
    limit = 10,
    minConfidence = 0,
  } = options;
  
  let results = state.items;
  
  // Filter by domain
  if (domain) {
    results = results.filter(item => item.domain === domain);
  }
  
  // Filter by country
  if (country) {
    results = results.filter(item => item.metadata.country === country);
  }
  
  // Filter by topic
  if (topic) {
    results = results.filter(item => item.metadata.topic === topic);
  }
  
  // Filter by confidence
  if (minConfidence > 0) {
    results = results.filter(item => 
      (item.metadata.confidence || 0) >= minConfidence
    );
  }
  
  // Simple keyword matching for query
  const queryLower = query.toLowerCase();
  const scoredResults = results.map(item => {
    const contentLower = item.content.toLowerCase();
    const queryWords = queryLower.split(/\s+/);
    let matchCount = 0;
    
    for (const word of queryWords) {
      if (contentLower.includes(word)) {
        matchCount++;
      }
    }
    
    const score = matchCount / queryWords.length;
    return { item, score };
  });
  
  // Sort by score (descending)
  scoredResults.sort((a, b) => b.score - a.score);
  
  // Return top N items
  return scoredResults
    .slice(0, limit)
    .map(r => r.item);
}

/**
 * Find similar patterns in long-term memory
 */
export function findSimilarPatterns(
  state: LongTermMemoryState,
  emotionalVector: {
    fear: number;
    hope: number;
    anger: number;
    mood: number;
  },
  options: {
    domain?: string;
    limit?: number;
    threshold?: number; // Similarity threshold (0-1)
  } = {}
): LongTermMemoryItem[] {
  const {
    domain,
    limit = 10,
    threshold = 0.7,
  } = options;
  
  let candidates = state.items;
  
  // Filter by domain
  if (domain) {
    candidates = candidates.filter(item => item.domain === domain);
  }
  
  // Calculate similarity scores
  const scoredItems = candidates.map(item => {
    const similarity = calculateEmotionalSimilarity(
      emotionalVector,
      item.emotionalVector
    );
    return { item, similarity };
  });
  
  // Filter by threshold
  const filtered = scoredItems.filter(s => s.similarity >= threshold);
  
  // Sort by similarity (descending)
  filtered.sort((a, b) => b.similarity - a.similarity);
  
  // Return top N items
  return filtered
    .slice(0, limit)
    .map(s => s.item);
}

/**
 * Calculate emotional similarity between two vectors
 * Returns a value between 0 and 1
 */
function calculateEmotionalSimilarity(
  v1: { fear: number; hope: number; anger: number; mood: number },
  v2: { fear: number; hope: number; anger: number; mood: number }
): number {
  // Normalize vectors to 0-1 range
  const normalize = (val: number) => (val + 100) / 200;
  
  const v1Norm = {
    fear: normalize(v1.fear),
    hope: normalize(v1.hope),
    anger: normalize(v1.anger),
    mood: normalize(v1.mood),
  };
  
  const v2Norm = {
    fear: normalize(v2.fear),
    hope: normalize(v2.hope),
    anger: normalize(v2.anger),
    mood: normalize(v2.mood),
  };
  
  // Calculate cosine similarity
  const dotProduct = 
    v1Norm.fear * v2Norm.fear +
    v1Norm.hope * v2Norm.hope +
    v1Norm.anger * v2Norm.anger +
    v1Norm.mood * v2Norm.mood;
  
  const magnitude1 = Math.sqrt(
    v1Norm.fear ** 2 +
    v1Norm.hope ** 2 +
    v1Norm.anger ** 2 +
    v1Norm.mood ** 2
  );
  
  const magnitude2 = Math.sqrt(
    v2Norm.fear ** 2 +
    v2Norm.hope ** 2 +
    v2Norm.anger ** 2 +
    v2Norm.mood ** 2
  );
  
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Archive old items
 */
export function archiveOldItems(
  state: LongTermMemoryState
): {
  state: LongTermMemoryState;
  archivedItems: LongTermMemoryItem[];
} {
  const now = Date.now();
  const archiveThresholdMs = state.archiveThreshold * 24 * 60 * 60 * 1000;
  
  const activeItems: LongTermMemoryItem[] = [];
  const archivedItems: LongTermMemoryItem[] = [];
  
  for (const item of state.items) {
    if ((now - item.timestamp) > archiveThresholdMs) {
      archivedItems.push(item);
    } else {
      activeItems.push(item);
    }
  }
  
  return {
    state: {
      ...state,
      items: activeItems,
    },
    archivedItems,
  };
}

/**
 * Get memory statistics
 */
export function getLongTermMemoryStats(state: LongTermMemoryState): {
  totalItems: number;
  itemsByDomain: Record<string, number>;
  itemsByCountry: Record<string, number>;
  oldestItem: number | null;
  newestItem: number | null;
  averageConfidence: number;
} {
  const itemsByDomain: Record<string, number> = {};
  const itemsByCountry: Record<string, number> = {};
  let oldestTimestamp: number | null = null;
  let newestTimestamp: number | null = null;
  let totalConfidence = 0;
  let confidenceCount = 0;
  
  for (const item of state.items) {
    // Count by domain
    itemsByDomain[item.domain] = (itemsByDomain[item.domain] || 0) + 1;
    
    // Count by country
    if (item.metadata.country) {
      const country = item.metadata.country;
      itemsByCountry[country] = (itemsByCountry[country] || 0) + 1;
    }
    
    // Track timestamps
    if (oldestTimestamp === null || item.timestamp < oldestTimestamp) {
      oldestTimestamp = item.timestamp;
    }
    if (newestTimestamp === null || item.timestamp > newestTimestamp) {
      newestTimestamp = item.timestamp;
    }
    
    // Track confidence
    if (item.metadata.confidence !== undefined) {
      totalConfidence += item.metadata.confidence;
      confidenceCount++;
    }
  }
  
  return {
    totalItems: state.items.length,
    itemsByDomain,
    itemsByCountry,
    oldestItem: oldestTimestamp,
    newestItem: newestTimestamp,
    averageConfidence: confidenceCount > 0 ? totalConfidence / confidenceCount : 0,
  };
}

/**
 * Increment access count for an item
 */
export function incrementLongTermAccessCount(
  state: LongTermMemoryState,
  itemId: string
): LongTermMemoryState {
  const updatedItems = state.items.map((item: LongTermMemoryItem) => {
    if (item.id === itemId) {
      return {
        ...item,
        accessCount: item.accessCount + 1,
        lastAccessed: Date.now(),
      };
    }
    return item;
  });
  
  return {
    ...state,
    items: updatedItems,
  };
}
