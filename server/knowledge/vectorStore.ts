/**
 * AMALSENSE UNIVERSAL VECTOR STORE
 * مستودع المتجهات المطور لتخزين المعارف الكونية
 */

import { generateEmbedding, cosineSimilarity, findSimilar } from './embeddings';

export type EntryType = 'analysis' | 'conversation' | 'knowledge' | 'scientific_rule' | 'legal_statute' | 'feedback';

export interface VectorEntry {
  id: string;
  type: EntryType;
  content: string;
  embedding: number[];
  metadata: {
    topic?: string;
    domain?: string;
    country?: string;
    timestamp: Date;
    gmi?: number;
    cfi?: number;
    hri?: number;
    emotionalState?: string;
    userId?: string;
    [key: string]: any;
  };
}

export interface SearchResult {
  entry: VectorEntry;
  similarity: number;
}

// الذاكرة المؤقتة للمتجهات
let vectorStore: VectorEntry[] = [];
let idCounter = 0;

/**
 * 1. دالة إضافة مدخل (Exported)
 */
export function addEntry(
  type: EntryType,
  content: string,
  metadata: any
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

  if (vectorStore.length > 1500) {
    vectorStore = vectorStore.slice(-1200);
  }

  return entry;
}

/**
 * 2. دالة البحث الأساسية (التي تظهر فيها الأخطاء)
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

  let candidates = vectorStore;
  if (type) candidates = candidates.filter(e => e.type === type);
  if (country) candidates = candidates.filter(e => e.metadata.country?.toLowerCase() === country.toLowerCase());

  if (candidates.length === 0) return [];

  const queryEmbedding = generateEmbedding(query);

  // استخدام findSimilar المستوردة
  const similar = findSimilar(
    queryEmbedding,
    candidates.map(e => ({ id: e.id, embedding: e.embedding })),
    topK
  );

  return similar
    .filter(s => s.similarity >= minSimilarity)
    .map(s => ({
      entry: candidates.find(e => e.id === s.id)!,
      similarity: s.similarity,
    }));
}

/**
 * 3. دالة تخزين التحليلات (Exported)
 */
export function storeAnalysis(
  topic: string,
  country: string | undefined,
  analysisResult: any
): VectorEntry {
  const content = `Topic: ${topic} | State: ${analysisResult.emotionalState} | GMI: ${analysisResult.gmi}`;
  return addEntry('analysis', content, {
    topic,
    country,
    ...analysisResult
  });
}

/**
 * 4. دالة تخزين المحادثات (Exported)
 */
export function storeConversation(
  userId: string,
  question: string,
  answer: string,
  topic?: string,
  country?: string
): VectorEntry {
  return addEntry('conversation', `Q: ${question} A: ${answer}`, {
    userId, topic, country
  });
}

/**
 * 5. دالة جلب التحليلات الأخيرة (Exported)
 */
export function getRecentAnalyses(country: string, limit: number = 10): VectorEntry[] {
  return vectorStore
    .filter(e => e.type === 'analysis' && e.metadata.country?.toLowerCase() === country.toLowerCase())
    .sort((a, b) => b.metadata.timestamp.getTime() - a.metadata.timestamp.getTime())
    .slice(0, limit);
}

/**
 * تهيئة قاعدة المعرفة
 */
export function initializeKnowledge(): void {
  addEntry('knowledge', 'AmalSense DCFT framework and quantum resonance.', { domain: 'Theory' });
  console.log('[VectorStore] System Initialized');
}

// تنفيذ التهيئة
initializeKnowledge();