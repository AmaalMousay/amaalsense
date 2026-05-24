/**
 * AMALSENSE UNIVERSAL VECTOR STORE
 * مستودع المتجهات المطور لتخزين المعارف الكونية
 */

import { generateEmbedding, cosineSimilarity, findSimilar } from './embeddings';
import fs from 'fs';
import path from 'path';

export type EntryType = 'analysis' | 'conversation' | 'knowledge' | 'event_vector' | 'source_observation' | 'scientific_rule' | 'legal_statute' | 'feedback';

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

const DB_FILE = path.join(process.cwd(), 'server', 'knowledge', 'vector_db.json');

// تحميل الذاكرة السابقة إن وجدت
try {
  if (fs.existsSync(DB_FILE)) {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    vectorStore = JSON.parse(data);
    idCounter = vectorStore.length;
    console.log(`[VectorStore] Loaded ${vectorStore.length} entries from disk.`);
  }
} catch (e) {
  console.error('[VectorStore] Failed to load db:', e);
}


function normalizeTimestamp(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return new Date();
}

function findDuplicate(type: EntryType, content: string, metadata: any): VectorEntry | undefined {
  const url = metadata?.url || metadata?.sourceUrl;
  if (url) {
    return vectorStore.find(entry => entry.type === type && (entry.metadata.url === url || entry.metadata.sourceUrl === url));
  }
  return vectorStore.find(entry => entry.type === type && entry.content === content);
}

function saveToDisk() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(vectorStore), 'utf-8');
  } catch (e) {
    console.error('[VectorStore] Failed to save db:', e);
  }
}

/**
 * 1. دالة إضافة مدخل (Exported)
 */
export function addEntry(
  type: EntryType,
  content: string,
  metadata: any
): VectorEntry {
  const duplicate = findDuplicate(type, content, metadata);
  if (duplicate) {
    duplicate.metadata = {
      ...duplicate.metadata,
      ...metadata,
      lastSeenAt: new Date(),
      seenCount: Number(duplicate.metadata.seenCount || 1) + 1,
      timestamp: normalizeTimestamp(duplicate.metadata.timestamp),
    };
    saveToDisk();
    return duplicate;
  }

  const id = `${type}_${++idCounter}_${Date.now()}`;
  const embedding = generateEmbedding(content);

  const entry: VectorEntry = {
    id,
    type,
    content,
    embedding,
    metadata: {
      ...metadata,
      timestamp: normalizeTimestamp(metadata.timestamp),
    },
  };

  vectorStore.push(entry);

  if (vectorStore.length > 2000) {
    vectorStore = vectorStore.slice(-1500); // زيادة سعة الذاكرة
  }

  // حفظ التغييرات على القرص
  saveToDisk();

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
    .sort((a, b) => normalizeTimestamp(b.metadata.timestamp).getTime() - normalizeTimestamp(a.metadata.timestamp).getTime())
    .slice(0, limit);
}


export interface KnowledgeObservationInput {
  sourceType: 'news' | 'social' | 'official' | 'trend' | 'knowledge' | 'analysis';
  sourceName: string;
  title: string;
  content?: string;
  url?: string;
  countryCode?: string;
  topic?: string;
  eventType?: string;
  credibilityScore?: number;
  emotionVector?: Record<string, number>;
  eventVector?: unknown;
  quantumState?: unknown;
  agentId?: string;
  agentNotes?: string[];
  observedAt?: Date | string | number;
  raw?: unknown;
}

export function storeKnowledgeObservation(input: KnowledgeObservationInput): VectorEntry {
  const content = [
    input.title,
    input.content,
    input.topic ? `Topic: ${input.topic}` : '',
    input.countryCode ? `Country: ${input.countryCode}` : '',
  ].filter(Boolean).join('\n');

  return addEntry('source_observation', content, {
    sourceType: input.sourceType,
    sourceName: input.sourceName,
    url: input.url,
    country: input.countryCode,
    countryCode: input.countryCode,
    topic: input.topic,
    eventType: input.eventType,
    credibilityScore: input.credibilityScore ?? 0.5,
    emotionalState: input.emotionVector ? Object.entries(input.emotionVector).sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0] : undefined,
    emotionVector: input.emotionVector,
    eventVector: input.eventVector,
    quantumState: input.quantumState,
    agentId: input.agentId || 'system_collector',
    agentNotes: input.agentNotes || [],
    raw: input.raw,
    timestamp: input.observedAt || new Date(),
    lastSeenAt: new Date(),
    seenCount: 1,
  });
}

export function storeEventVectorKnowledge(topic: string, eventVector: unknown, metadata: Record<string, any> = {}): VectorEntry {
  const content = `EventVector knowledge for ${topic}: ${JSON.stringify(eventVector).slice(0, 1500)}`;
  return addEntry('event_vector', content, {
    ...metadata,
    topic,
    eventVector,
    timestamp: metadata.timestamp || new Date(),
  });
}

export function searchKnowledgeCore(query: string, options: { country?: string; topK?: number; minSimilarity?: number } = {}): SearchResult[] {
  const topK = options.topK ?? 8;
  const minSimilarity = options.minSimilarity ?? 0.22;
  const results = [
    ...search(query, { type: 'source_observation', country: options.country, topK, minSimilarity }),
    ...search(query, { type: 'event_vector', country: options.country, topK, minSimilarity }),
    ...search(query, { type: 'knowledge', country: options.country, topK, minSimilarity }),
  ];
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

export function getKnowledgeCoreStats() {
  const byType: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  const byCountry: Record<string, number> = {};
  for (const entry of vectorStore) {
    byType[entry.type] = (byType[entry.type] || 0) + 1;
    const source = entry.metadata.sourceName || entry.metadata.sourceType;
    if (source) bySource[source] = (bySource[source] || 0) + 1;
    const country = entry.metadata.countryCode || entry.metadata.country;
    if (country) byCountry[country] = (byCountry[country] || 0) + 1;
  }
  return { totalEntries: vectorStore.length, byType, bySource, byCountry };
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

export function getStats() {
  const uniqueArticles = new Set(vectorStore.filter(e => e.type === 'scientific_rule').map(e => e.metadata.topic)).size;
  return { totalEntries: vectorStore.length, uniqueArticlesRead: uniqueArticles };
}