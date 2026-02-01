/**
 * Embeddings Service
 * 
 * Converts text into vector representations for semantic search.
 * Uses a simple but effective approach without external dependencies.
 * 
 * In production, this could be replaced with:
 * - OpenAI Embeddings API
 * - Sentence Transformers
 * - Cohere Embeddings
 */

// Simple word embeddings based on semantic similarity
// This is a lightweight approach that works without external APIs

// Semantic categories for embedding
const SEMANTIC_CATEGORIES = {
  // Emotions
  positive_emotion: ['happy', 'joy', 'hope', 'optimism', 'confident', 'success', 'win', 'سعادة', 'فرح', 'أمل', 'تفاؤل', 'نجاح'],
  negative_emotion: ['fear', 'anger', 'sad', 'worry', 'panic', 'crisis', 'خوف', 'غضب', 'حزن', 'قلق', 'أزمة', 'ذعر'],
  neutral_emotion: ['calm', 'stable', 'neutral', 'balanced', 'هدوء', 'استقرار', 'محايد', 'متوازن'],
  
  // Domains
  economy: ['economy', 'market', 'stock', 'price', 'trade', 'investment', 'اقتصاد', 'سوق', 'أسهم', 'سعر', 'تجارة', 'استثمار'],
  politics: ['politics', 'government', 'election', 'policy', 'law', 'سياسة', 'حكومة', 'انتخابات', 'قانون'],
  war: ['war', 'conflict', 'military', 'attack', 'defense', 'حرب', 'صراع', 'عسكري', 'هجوم', 'دفاع'],
  health: ['health', 'disease', 'hospital', 'medicine', 'صحة', 'مرض', 'مستشفى', 'دواء'],
  
  // Risk levels
  high_risk: ['danger', 'critical', 'urgent', 'emergency', 'خطر', 'حرج', 'طوارئ', 'عاجل'],
  low_risk: ['safe', 'secure', 'stable', 'normal', 'آمن', 'مستقر', 'طبيعي'],
  
  // Time
  past: ['yesterday', 'last', 'previous', 'history', 'أمس', 'سابق', 'تاريخ'],
  present: ['today', 'now', 'current', 'اليوم', 'الآن', 'حالي'],
  future: ['tomorrow', 'next', 'future', 'forecast', 'غدا', 'قادم', 'مستقبل', 'توقع'],
  
  // Actions
  buy: ['buy', 'purchase', 'invest', 'acquire', 'شراء', 'استثمار', 'اقتناء'],
  sell: ['sell', 'exit', 'divest', 'بيع', 'خروج'],
  wait: ['wait', 'hold', 'observe', 'monitor', 'انتظار', 'مراقبة', 'ترقب'],
  
  // Indicators
  gmi: ['gmi', 'mood', 'sentiment', 'مزاج', 'شعور'],
  cfi: ['cfi', 'fear', 'anxiety', 'خوف', 'قلق'],
  hri: ['hri', 'hope', 'resilience', 'أمل', 'صمود'],
};

// Embedding dimension (number of semantic categories)
const EMBEDDING_DIM = Object.keys(SEMANTIC_CATEGORIES).length;

/**
 * Generate embedding vector for text
 */
export function generateEmbedding(text: string): number[] {
  const normalizedText = text.toLowerCase();
  const words = normalizedText.split(/\s+/);
  
  const embedding: number[] = new Array(EMBEDDING_DIM).fill(0);
  
  Object.entries(SEMANTIC_CATEGORIES).forEach(([category, keywords], index) => {
    let score = 0;
    for (const word of words) {
      for (const keyword of keywords) {
        if (word.includes(keyword) || keyword.includes(word)) {
          score += 1;
        }
      }
    }
    // Normalize by text length
    embedding[index] = score / Math.max(words.length, 1);
  });
  
  // Normalize the vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= magnitude;
    }
  }
  
  return embedding;
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embedding dimensions must match');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;
  
  return dotProduct / denominator;
}

/**
 * Find most similar embeddings from a collection
 */
export function findSimilar(
  queryEmbedding: number[],
  embeddings: Array<{ id: string; embedding: number[]; metadata?: Record<string, unknown> }>,
  topK: number = 5
): Array<{ id: string; similarity: number; metadata?: Record<string, unknown> }> {
  const similarities = embeddings.map(item => ({
    id: item.id,
    similarity: cosineSimilarity(queryEmbedding, item.embedding),
    metadata: item.metadata,
  }));
  
  // Sort by similarity descending
  similarities.sort((a, b) => b.similarity - a.similarity);
  
  // Return top K
  return similarities.slice(0, topK);
}

/**
 * Get embedding dimension
 */
export function getEmbeddingDimension(): number {
  return EMBEDDING_DIM;
}

/**
 * Get semantic category names
 */
export function getSemanticCategories(): string[] {
  return Object.keys(SEMANTIC_CATEGORIES);
}
