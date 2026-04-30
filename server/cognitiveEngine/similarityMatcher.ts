/**
 * Layer 12: Similarity Matching Layer
 * 
 * This layer matches the current question with previously asked questions
 * to speed up responses, reuse known data, and maintain consistency.
 */

interface StoredQuestion {
  id: string;
  question: string;
  answer: string;
  topic: string;
  timestamp: number;
}

// In a real scenario, this would be a Redis cache or a DB table
// For now, we simulate an in-memory cache of past questions
const questionHistoryCache: StoredQuestion[] = [];

export interface SimilarityResult {
  hasSimilar: boolean;
  similarQuestion?: StoredQuestion;
  similarityScore: number;
}

/**
 * Calculates a simple Jaccard-like similarity between two strings based on words
 */
function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  
  if (words1.size === 0 && words2.size === 0) return 1.0;
  if (words1.size === 0 || words2.size === 0) return 0.0;
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Finds the most similar previously asked question.
 */
export async function findSimilarQuestion(
  currentQuestion: string,
  topic: string,
  threshold: number = 0.75
): Promise<SimilarityResult> {
  let bestMatch: StoredQuestion | undefined = undefined;
  let highestScore = 0;

  // Only check questions from the last 24 hours to ensure relevance
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();
  
  const relevantHistory = questionHistoryCache.filter(
    q => (now - q.timestamp) < ONE_DAY_MS && (q.topic === topic || topic === 'موضوع عام')
  );

  for (const stored of relevantHistory) {
    const score = calculateTextSimilarity(currentQuestion, stored.question);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = stored;
    }
  }

  const isSimilar = highestScore >= threshold;

  return {
    hasSimilar: isSimilar,
    similarQuestion: isSimilar ? bestMatch : undefined,
    similarityScore: highestScore
  };
}

/**
 * Stores a question and its answer for future similarity matching.
 */
export async function storeQuestionResult(
  question: string,
  answer: string,
  topic: string
): Promise<void> {
  const newEntry: StoredQuestion = {
    id: Math.random().toString(36).substring(7),
    question,
    answer,
    topic,
    timestamp: Date.now()
  };
  
  questionHistoryCache.push(newEntry);
  
  // Keep cache size manageable
  if (questionHistoryCache.length > 1000) {
    questionHistoryCache.shift(); // remove oldest
  }
}
