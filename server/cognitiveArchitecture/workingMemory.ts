/**
 * Layer 5: Working Memory
 * 
 * Short-term information storage with 24-hour retention
 * Capacity: Last 100 data points per domain
 * Structure: Temporal queue with priority indexing
 */

export interface MemoryItem {
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
  priority: number; // 0-100
  accessCount: number;
}

export interface WorkingMemoryState {
  items: Map<string, MemoryItem[]>; // domain -> items
  maxItemsPerDomain: number;
  retentionHours: number;
}

/**
 * Initialize working memory
 */
export function initWorkingMemory(): WorkingMemoryState {
  return {
    items: new Map(),
    maxItemsPerDomain: 100,
    retentionHours: 24,
  };
}

/**
 * Add item to working memory
 */
export function addToWorkingMemory(
  state: WorkingMemoryState,
  item: Omit<MemoryItem, 'id' | 'accessCount'>
): WorkingMemoryState {
  const domain = item.domain;
  const domainItems = state.items.get(domain) || [];
  
  // Create new item with ID
  const newItem: MemoryItem = {
    ...item,
    id: `${domain}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    accessCount: 0,
  };
  
  // Add to domain items
  const updatedItems = [...domainItems, newItem];
  
  // Sort by priority (descending) and timestamp (descending)
  updatedItems.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return b.timestamp - a.timestamp;
  });
  
  // Keep only maxItemsPerDomain items
  const trimmedItems = updatedItems.slice(0, state.maxItemsPerDomain);
  
  // Update state
  const newItems = new Map(state.items);
  newItems.set(domain, trimmedItems);
  
  return {
    ...state,
    items: newItems,
  };
}

/**
 * Retrieve items from working memory
 */
export function retrieveFromWorkingMemory(
  state: WorkingMemoryState,
  domain: string,
  limit: number = 10
): MemoryItem[] {
  const domainItems = state.items.get(domain) || [];
  
  // Filter out expired items (older than retentionHours)
  const now = Date.now();
  const retentionMs = state.retentionHours * 60 * 60 * 1000;
  
  const validItems = domainItems.filter(item => {
    return (now - item.timestamp) < retentionMs;
  });
  
  // Return top N items by priority
  return validItems.slice(0, limit);
}

/**
 * Search working memory by content similarity
 */
export function searchWorkingMemory(
  state: WorkingMemoryState,
  query: string,
  domain?: string,
  limit: number = 5
): MemoryItem[] {
  const queryLower = query.toLowerCase();
  const results: Array<{ item: MemoryItem; score: number }> = [];
  
  // Get domains to search
  const domainsToSearch = domain 
    ? [domain] 
    : Array.from(state.items.keys());
  
  // Search across domains
  for (const d of domainsToSearch) {
    const items = retrieveFromWorkingMemory(state, d, 100);
    
    for (const item of items as MemoryItem[]) {
      const contentLower = item.content.toLowerCase();
      
      // Simple keyword matching score
      const queryWords = queryLower.split(/\s+/);
      let matchCount = 0;
      
      for (const word of queryWords) {
        if (contentLower.includes(word)) {
          matchCount++;
        }
      }
      
      if (matchCount > 0) {
        const score = (matchCount / queryWords.length) * 100;
        results.push({ item, score });
      }
    }
  }
  
  // Sort by score (descending) and return top N
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit).map(r => r.item);
}

/**
 * Clean up expired items from working memory
 */
export function cleanupWorkingMemory(
  state: WorkingMemoryState
): WorkingMemoryState {
  const now = Date.now();
  const retentionMs = state.retentionHours * 60 * 60 * 1000;
  
  const newItems = new Map<string, MemoryItem[]>();
  
  for (const [domain, items] of Array.from(state.items.entries())) {
    const validItems = items.filter(item => {
      return (now - item.timestamp) < retentionMs;
    });
    
    if (validItems.length > 0) {
      newItems.set(domain, validItems);
    }
  }
  
  return {
    ...state,
    items: newItems,
  };
}

/**
 * Get memory statistics
 */
export function getMemoryStats(state: WorkingMemoryState): {
  totalItems: number;
  itemsByDomain: Record<string, number>;
  oldestItem: number | null;
  newestItem: number | null;
} {
  let totalItems = 0;
  const itemsByDomain: Record<string, number> = {};
  let oldestTimestamp: number | null = null;
  let newestTimestamp: number | null = null;
  
  for (const [domain, items] of Array.from(state.items.entries())) {
    totalItems += items.length;
    itemsByDomain[domain] = items.length;
    
    for (const item of items as MemoryItem[]) {
      if (oldestTimestamp === null || item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
      }
      if (newestTimestamp === null || item.timestamp > newestTimestamp) {
        newestTimestamp = item.timestamp;
      }
    }
  }
  
  return {
    totalItems,
    itemsByDomain,
    oldestItem: oldestTimestamp,
    newestItem: newestTimestamp,
  };
}

/**
 * Increment access count for an item
 */
export function incrementAccessCount(
  state: WorkingMemoryState,
  itemId: string
): WorkingMemoryState {
  const newItems = new Map<string, MemoryItem[]>();
  
  for (const [domain, items] of Array.from(state.items.entries())) {
    const updatedItems = items.map((item: MemoryItem) => {
      if (item.id === itemId) {
        return {
          ...item,
          accessCount: item.accessCount + 1,
        };
      }
      return item;
    });
    newItems.set(domain, updatedItems);
  }
  
  return {
    ...state,
    items: newItems,
  };
}
