/**
 * AmalSense Knowledge Core
 *
 * Stores analyses, source observations, EventVectors, research notes and domain
 * knowledge for local RAG. This is the long-term memory layer used by agents,
 * traders, researchers, journalists and decision makers.
 */

import fs from 'fs';
import path from 'path';
import { generateEmbedding, findSimilar } from './embeddings';

export type EntryType =
  | 'analysis'
  | 'conversation'
  | 'knowledge'
  | 'event_vector'
  | 'source_observation'
  | 'scientific_rule'
  | 'legal_statute'
  | 'feedback';

export interface VectorEntry {
  id: string;
  type: EntryType;
  content: string;
  embedding: number[];
  metadata: {
    topic?: string;
    domain?: string;
    country?: string;
    countryCode?: string;
    timestamp: Date | string;
    gmi?: number;
    cfi?: number;
    hri?: number;
    emotionalState?: string;
    userId?: string;
    sourceType?: string;
    sourceName?: string;
    url?: string;
    credibilityScore?: number;
    [key: string]: any;
  };
}

export interface SearchResult {
  entry: VectorEntry;
  similarity: number;
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

const DB_FILE = path.join(process.cwd(), 'server', 'knowledge', 'vector_db.json');
const MAX_ENTRIES = 5000;
const TRIM_TO_ENTRIES = 4000;

let vectorStore: VectorEntry[] = [];
let idCounter = 0;

function normalizeTimestamp(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

function loadFromDisk(): void {
  try {
    if (!fs.existsSync(DB_FILE)) return;
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data) as VectorEntry[];
    vectorStore = parsed.map(entry => ({
      ...entry,
      metadata: { ...entry.metadata, timestamp: normalizeTimestamp(entry.metadata.timestamp) },
    }));
    idCounter = vectorStore.length;
    console.log(`[KnowledgeCore] Loaded ${vectorStore.length} entries.`);
  } catch (error) {
    console.error('[KnowledgeCore] Failed to load local vector database:', error);
  }
}

function saveToDisk(): void {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(vectorStore), 'utf-8');
  } catch (error) {
    console.error('[KnowledgeCore] Failed to save local vector database:', error);
  }
}

function findDuplicate(type: EntryType, content: string, metadata: Record<string, any>): VectorEntry | undefined {
  const url = metadata.url || metadata.sourceUrl;
  if (url) return vectorStore.find(entry => entry.type === type && (entry.metadata.url === url || entry.metadata.sourceUrl === url));
  return vectorStore.find(entry => entry.type === type && entry.content === content);
}

export function addEntry(type: EntryType, content: string, metadata: Record<string, any> = {}): VectorEntry {
  const duplicate = findDuplicate(type, content, metadata);
  if (duplicate) {
    duplicate.metadata = {
      ...duplicate.metadata,
      ...metadata,
      timestamp: normalizeTimestamp(duplicate.metadata.timestamp),
      lastSeenAt: new Date(),
      seenCount: Number(duplicate.metadata.seenCount || 1) + 1,
    };
    saveToDisk();
    return duplicate;
  }

  const entry: VectorEntry = {
    id: `${type}_${++idCounter}_${Date.now()}`,
    type,
    content,
    embedding: generateEmbedding(content),
    metadata: { ...metadata, timestamp: normalizeTimestamp(metadata.timestamp) },
  };

  vectorStore.push(entry);
  if (vectorStore.length > MAX_ENTRIES) vectorStore = vectorStore.slice(-TRIM_TO_ENTRIES);
  saveToDisk();
  return entry;
}

export function search(
  query: string,
  options: { type?: EntryType; country?: string; topK?: number; minSimilarity?: number } = {}
): SearchResult[] {
  const { type, country, topK = 5, minSimilarity = 0.3 } = options;
  let candidates = vectorStore;
  if (type) candidates = candidates.filter(entry => entry.type === type);
  if (country) {
    const normalizedCountry = country.toLowerCase();
    candidates = candidates.filter(entry => String(entry.metadata.country || entry.metadata.countryCode || '').toLowerCase() === normalizedCountry);
  }
  if (candidates.length === 0) return [];

  const queryEmbedding = generateEmbedding(query);
  return findSimilar(queryEmbedding, candidates.map(entry => ({ id: entry.id, embedding: entry.embedding })), topK)
    .filter(result => result.similarity >= minSimilarity)
    .map(result => ({ entry: candidates.find(entry => entry.id === result.id)!, similarity: result.similarity }));
}

export function storeAnalysis(topic: string, country: string | undefined, analysisResult: any): VectorEntry {
  const content = `Analysis topic=${topic}; state=${analysisResult.emotionalState || 'unknown'}; gmi=${analysisResult.gmi ?? 'n/a'}; cfi=${analysisResult.cfi ?? 'n/a'}; hri=${analysisResult.hri ?? 'n/a'}`;
  return addEntry('analysis', content, { topic, country, ...analysisResult });
}

export function storeConversation(userId: string, question: string, answer: string, topic?: string, country?: string): VectorEntry {
  return addEntry('conversation', `Question: ${question}\nAnswer: ${answer}`, { userId, topic, country });
}

export function getRecentAnalyses(country: string, limit: number = 10): VectorEntry[] {
  const normalizedCountry = country.toLowerCase();
  return vectorStore
    .filter(entry => entry.type === 'analysis' && String(entry.metadata.country || entry.metadata.countryCode || '').toLowerCase() === normalizedCountry)
    .sort((a, b) => normalizeTimestamp(b.metadata.timestamp).getTime() - normalizeTimestamp(a.metadata.timestamp).getTime())
    .slice(0, limit);
}

export function storeKnowledgeObservation(input: KnowledgeObservationInput): VectorEntry {
  const content = [input.title, input.content, input.topic ? `Topic: ${input.topic}` : '', input.countryCode ? `Country: ${input.countryCode}` : '']
    .filter(Boolean)
    .join('\n');

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
  return addEntry('event_vector', content, { ...metadata, topic, eventVector, timestamp: metadata.timestamp || new Date() });
}

export function searchKnowledgeCore(query: string, options: { country?: string; topK?: number; minSimilarity?: number } = {}): SearchResult[] {
  const topK = options.topK ?? 8;
  const minSimilarity = options.minSimilarity ?? 0.22;
  return [
    ...search(query, { type: 'source_observation', country: options.country, topK, minSimilarity }),
    ...search(query, { type: 'event_vector', country: options.country, topK, minSimilarity }),
    ...search(query, { type: 'knowledge', country: options.country, topK, minSimilarity }),
    ...search(query, { type: 'scientific_rule', country: options.country, topK, minSimilarity }),
  ].sort((a, b) => b.similarity - a.similarity).slice(0, topK);
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

const SEED_KNOWLEDGE: Array<{ domain: string; topic: string; content: string }> = [
  {
    domain: 'Trading',
    topic: 'Emotional market field',
    content: 'For traders, AmalSense treats news and social signals as market-moving emotional fields. CFI reflects fear pressure, HRI reflects resilience or hope, and GMI reflects broad collective mood. These indicators are not trade signals by themselves; they are context for risk management, confirmation, and event interpretation.',
  },
  {
    domain: 'Trading',
    topic: 'Risk-off interpretation',
    content: 'A high fear index with negative polarity can indicate risk-off behavior. It may matter for gold, oil, currency pairs, crypto and indices when the underlying event is macroeconomic, geopolitical or liquidity related.',
  },
  {
    domain: 'Research',
    topic: 'EventVector methodology',
    content: 'An EventVector compresses an event into topic, region, source, emotion, polarity, intensity, uncertainty, credibility and memory links. Researchers can use it to compare emotional patterns across time, countries and event categories.',
  },
  {
    domain: 'Journalism',
    topic: 'Narrative and amplification',
    content: 'For journalists, AmalSense separates event evidence from emotional amplification. A story may be factually real while its media framing increases collective fear, anger or uncertainty.',
  },
  {
    domain: 'DecisionMaking',
    topic: 'Policy and crisis monitoring',
    content: 'For decision makers, AmalSense helps monitor collective pressure, uncertainty, resilience and early-warning changes across regions. The system should report confidence and limitations instead of pretending certainty.',
  },
  {
    domain: 'DCFT',
    topic: 'Digital Consciousness Field Theory',
    content: 'DCFT models collective digital emotion as a field influenced by source credibility, reach, time decay and affective vectors. GMI, CFI and HRI are field-level indicators derived from aggregated signals.',
  },
];

export function initializeKnowledge(): void {
  for (const item of SEED_KNOWLEDGE) {
    addEntry('knowledge', item.content, { domain: item.domain, topic: item.topic });
  }
}

initializeKnowledge();

export function getStats() {
  const uniqueArticles = new Set(vectorStore.filter(entry => entry.type === 'scientific_rule').map(entry => entry.metadata.topic)).size;
  return { ...getKnowledgeCoreStats(), uniqueArticlesRead: uniqueArticles };
}

loadFromDisk();
initializeKnowledge();
