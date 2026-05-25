/**
 * Lightweight semantic embeddings for the AmalSense Knowledge Core.
 *
 * This is intentionally deterministic and dependency-free. It is not a neural
 * embedding model; it is a compact semantic hashing layer used for local RAG,
 * memory lookup, and agent knowledge recall when no paid vector database exists.
 */

const SEMANTIC_CATEGORIES: Record<string, string[]> = {
  market: ['market', 'price', 'trading', 'liquidity', 'spread', 'volatility', 'orderflow', 'breakout', 'support', 'resistance'],
  macro: ['inflation', 'interest', 'rates', 'currency', 'dollar', 'central', 'bank', 'gdp', 'recession', 'employment'],
  commodities: ['gold', 'silver', 'oil', 'brent', 'wti', 'gas', 'energy', 'commodity', 'xau', 'xag'],
  crypto: ['bitcoin', 'ethereum', 'crypto', 'stablecoin', 'blockchain', 'exchange', 'liquidation'],
  politics: ['government', 'election', 'policy', 'minister', 'parliament', 'sanctions', 'diplomacy', 'security'],
  society: ['society', 'public', 'community', 'protest', 'services', 'migration', 'housing', 'living'],
  journalism: ['news', 'headline', 'source', 'coverage', 'media', 'narrative', 'verification', 'rumor'],
  decision: ['decision', 'risk', 'response', 'policy', 'action', 'signal', 'priority', 'scenario'],
  science: ['physics', 'chemistry', 'biology', 'medicine', 'research', 'study', 'evidence', 'clinical'],
  law: ['law', 'legal', 'rights', 'court', 'treaty', 'regulation', 'compliance', 'violation'],
  emotion: ['fear', 'anger', 'sadness', 'hope', 'joy', 'curiosity', 'sentiment', 'mood', 'panic'],
  dcft: ['dcft', 'eventvector', 'resonance', 'polarity', 'intensity', 'uncertainty', 'gmi', 'cfi', 'hri'],
};

const CATEGORY_NAMES = Object.keys(SEMANTIC_CATEGORIES);
const EMBEDDING_DIM = CATEGORY_NAMES.length;

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[\p{L}\p{N}_]+/gu) || []).filter(token => token.length > 1);
}

export function generateEmbedding(text: string): number[] {
  const tokens = tokenize(text);
  const embedding = new Array(EMBEDDING_DIM).fill(0);

  CATEGORY_NAMES.forEach((category, index) => {
    const keywords = SEMANTIC_CATEGORIES[category];
    let score = 0;
    for (const token of tokens) {
      if (keywords.some(keyword => token === keyword || token.includes(keyword) || keyword.includes(token))) {
        score += 1;
      }
    }
    embedding[index] = tokens.length ? score / tokens.length : 0;
  });

  const magnitude = Math.sqrt(embedding.reduce((sum, value) => sum + value * value, 0));
  return magnitude > 0 ? embedding.map(value => value / magnitude) : embedding;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let index = 0; index < a.length; index++) {
    dot += a[index] * b[index];
    normA += a[index] * a[index];
    normB += b[index] * b[index];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dot / denominator;
}

export function findSimilar(
  queryEmbedding: number[],
  embeddings: Array<{ id: string; embedding: number[]; metadata?: Record<string, unknown> }>,
  topK: number = 5
): Array<{ id: string; similarity: number; metadata?: Record<string, unknown> }> {
  return embeddings
    .map(item => ({ id: item.id, similarity: cosineSimilarity(queryEmbedding, item.embedding), metadata: item.metadata }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

export function getEmbeddingDimension(): number {
  return EMBEDDING_DIM;
}

export function getSemanticCategories(): string[] {
  return [...CATEGORY_NAMES];
}
