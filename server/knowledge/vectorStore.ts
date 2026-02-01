/**
 * Vector Store
 * 
 * In-memory vector database for storing and retrieving:
 * - Analysis history
 * - Conversation context
 * - Knowledge base entries
 * 
 * This enables RAG (Retrieval Augmented Generation) by:
 * 1. Storing past analyses as vectors
 * 2. Finding similar past analyses for context
 * 3. Grounding LLM responses in real data
 */

import { generateEmbedding, cosineSimilarity, findSimilar } from './embeddings';

// Types of entries in the vector store
export type EntryType = 'analysis' | 'conversation' | 'knowledge' | 'feedback';

// Vector store entry
export interface VectorEntry {
  id: string;
  type: EntryType;
  content: string;
  embedding: number[];
  metadata: {
    topic?: string;
    country?: string;
    timestamp: Date;
    gmi?: number;
    cfi?: number;
    hri?: number;
    emotionalState?: string;
    userId?: string;
    [key: string]: unknown;
  };
}

// Search result
export interface SearchResult {
  entry: VectorEntry;
  similarity: number;
}

// In-memory storage
let vectorStore: VectorEntry[] = [];
let idCounter = 0;

/**
 * Add entry to vector store
 */
export function addEntry(
  type: EntryType,
  content: string,
  metadata: VectorEntry['metadata']
): VectorEntry {
  const id = `${type}_${++idCounter}_${Date.now()}`;
  const embedding = generateEmbedding(content);
  
  const entry: VectorEntry = {
    id,
    type,
    content,
    embedding,
    metadata: {
      ...metadata,
      timestamp: metadata.timestamp || new Date(),
    },
  };
  
  vectorStore.push(entry);
  
  // Keep store size manageable (max 1000 entries)
  if (vectorStore.length > 1000) {
    // Remove oldest entries
    vectorStore = vectorStore.slice(-800);
  }
  
  console.log(`[VectorStore] Added entry: ${id}, type: ${type}, store size: ${vectorStore.length}`);
  
  return entry;
}

/**
 * Search for similar entries
 */
export function search(
  query: string,
  options: {
    type?: EntryType;
    country?: string;
    topK?: number;
    minSimilarity?: number;
  } = {}
): SearchResult[] {
  const { type, country, topK = 5, minSimilarity = 0.3 } = options;
  
  // Filter by type and country if specified
  let candidates = vectorStore;
  if (type) {
    candidates = candidates.filter(e => e.type === type);
  }
  if (country) {
    candidates = candidates.filter(e => 
      e.metadata.country?.toLowerCase() === country.toLowerCase()
    );
  }
  
  if (candidates.length === 0) {
    return [];
  }
  
  // Generate query embedding
  const queryEmbedding = generateEmbedding(query);
  
  // Find similar entries
  const similar = findSimilar(
    queryEmbedding,
    candidates.map(e => ({ id: e.id, embedding: e.embedding })),
    topK
  );
  
  // Map back to full entries and filter by minimum similarity
  return similar
    .filter(s => s.similarity >= minSimilarity)
    .map(s => ({
      entry: candidates.find(e => e.id === s.id)!,
      similarity: s.similarity,
    }));
}

/**
 * Store analysis result
 */
export function storeAnalysis(
  topic: string,
  country: string | undefined,
  analysisResult: {
    gmi: number;
    cfi: number;
    hri: number;
    emotionalState: string;
    summary?: string;
  }
): VectorEntry {
  const content = `
Topic: ${topic}
Country: ${country || 'Global'}
GMI: ${analysisResult.gmi}
CFI: ${analysisResult.cfi}
HRI: ${analysisResult.hri}
State: ${analysisResult.emotionalState}
${analysisResult.summary ? `Summary: ${analysisResult.summary}` : ''}
  `.trim();
  
  return addEntry('analysis', content, {
    topic,
    country,
    timestamp: new Date(),
    gmi: analysisResult.gmi,
    cfi: analysisResult.cfi,
    hri: analysisResult.hri,
    emotionalState: analysisResult.emotionalState,
  });
}

/**
 * Store conversation turn
 */
export function storeConversation(
  userId: string,
  question: string,
  answer: string,
  topic?: string,
  country?: string
): VectorEntry {
  const content = `
Q: ${question}
A: ${answer}
  `.trim();
  
  return addEntry('conversation', content, {
    userId,
    topic,
    country,
    timestamp: new Date(),
  });
}

/**
 * Store knowledge entry
 */
export function storeKnowledge(
  content: string,
  metadata: Record<string, unknown> = {}
): VectorEntry {
  return addEntry('knowledge', content, {
    ...metadata,
    timestamp: new Date(),
  });
}

/**
 * Get recent analyses for a country
 */
export function getRecentAnalyses(
  country: string,
  limit: number = 10
): VectorEntry[] {
  return vectorStore
    .filter(e => 
      e.type === 'analysis' && 
      e.metadata.country?.toLowerCase() === country.toLowerCase()
    )
    .sort((a, b) => 
      new Date(b.metadata.timestamp).getTime() - new Date(a.metadata.timestamp).getTime()
    )
    .slice(0, limit);
}

/**
 * Get conversation history for a user
 */
export function getConversationHistory(
  userId: string,
  limit: number = 20
): VectorEntry[] {
  return vectorStore
    .filter(e => e.type === 'conversation' && e.metadata.userId === userId)
    .sort((a, b) => 
      new Date(b.metadata.timestamp).getTime() - new Date(a.metadata.timestamp).getTime()
    )
    .slice(0, limit);
}

/**
 * Get store statistics
 */
export function getStats(): {
  total: number;
  byType: Record<EntryType, number>;
  byCountry: Record<string, number>;
} {
  const byType: Record<EntryType, number> = {
    analysis: 0,
    conversation: 0,
    knowledge: 0,
    feedback: 0,
  };
  
  const byCountry: Record<string, number> = {};
  
  for (const entry of vectorStore) {
    byType[entry.type]++;
    if (entry.metadata.country) {
      byCountry[entry.metadata.country] = (byCountry[entry.metadata.country] || 0) + 1;
    }
  }
  
  return {
    total: vectorStore.length,
    byType,
    byCountry,
  };
}

/**
 * Clear all entries (for testing)
 */
export function clearStore(): void {
  vectorStore = [];
  idCounter = 0;
  console.log('[VectorStore] Store cleared');
}

/**
 * Initialize with base knowledge
 */
export function initializeKnowledge(): void {
  // Add base knowledge about AmalSense indicators
  const baseKnowledge = [
    {
      content: `GMI (Global Mood Index) ranges from -100 to +100. 
Positive values indicate optimistic collective mood.
Negative values indicate pessimistic collective mood.
GMI > 30: Strong positive sentiment
GMI 10-30: Cautiously optimistic
GMI -10 to 10: Neutral
GMI -30 to -10: Cautiously pessimistic
GMI < -30: Strong negative sentiment`,
      metadata: { category: 'indicator', name: 'GMI' },
    },
    {
      content: `CFI (Collective Fear Index) ranges from 0 to 100.
Higher values indicate more fear/anxiety in the collective.
CFI < 30: Low fear, confident environment
CFI 30-50: Moderate concern
CFI 50-70: Elevated fear, caution advised
CFI > 70: High fear, potential panic`,
      metadata: { category: 'indicator', name: 'CFI' },
    },
    {
      content: `HRI (Hope Resilience Index) ranges from 0 to 100.
Measures the collective's belief in positive outcomes.
HRI > 60: Strong hope, belief in recovery
HRI 40-60: Moderate hope
HRI < 40: Low hope, pessimistic outlook`,
      metadata: { category: 'indicator', name: 'HRI' },
    },
    {
      content: `DCFT (Digital Collective Feeling Theory) is the theoretical framework behind AmalSense.
It models collective emotions as a dynamic field that can be measured and analyzed.
Key concepts:
- Emotional resonance: How emotions spread through the collective
- Affective vectors: Multi-dimensional emotion representation
- Emotional phases: Patterns in collective emotional states`,
      metadata: { category: 'theory', name: 'DCFT' },
    },
  ];
  
  for (const knowledge of baseKnowledge) {
    storeKnowledge(knowledge.content, knowledge.metadata);
  }
  
  console.log('[VectorStore] Base knowledge initialized');
}

// Initialize on module load
initializeKnowledge();
