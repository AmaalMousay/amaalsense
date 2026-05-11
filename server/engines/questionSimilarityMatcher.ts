/**
 * Question Similarity Matcher (Phase 91)
 * 
 * Detects semantically similar questions and enables cache reuse
 * Uses multiple similarity algorithms for robust matching
 */

export interface SimilarityMatch {
  isSimilar: boolean;
  similarityScore: number; // 0-100
  matchedQuestion: string | null;
  matchedResponseId: string | null;
  algorithm: "cosine" | "levenshtein" | "semantic" | "none";
  confidence: number; // 0-100
}

/**
 * Calculate similarity between two questions
 */
export function calculateQuestionSimilarity(
  question1: string,
  question2: string,
  language: string = "ar"
): SimilarityMatch {
  // Normalize questions
  const q1 = normalizeQuestion(question1, language);
  const q2 = normalizeQuestion(question2, language);

  // If identical after normalization
  if (q1 === q2) {
    return {
      isSimilar: true,
      similarityScore: 100,
      matchedQuestion: question2,
      matchedResponseId: null,
      algorithm: "cosine",
      confidence: 100
    };
  }

  // Try multiple algorithms
  const cosineSimilarity = calculateCosineSimilarity(q1, q2);
  const levenshteinSimilarity = calculateLevenshteinSimilarity(q1, q2);
  const semanticSimilarity = calculateSemanticSimilarity(q1, q2, language);

  // Weighted average (cosine: 40%, levenshtein: 30%, semantic: 30%)
  const finalScore = (cosineSimilarity * 0.4) + (levenshteinSimilarity * 0.3) + (semanticSimilarity * 0.3);

  // Determine which algorithm had the highest score
  const scores = [
    { score: cosineSimilarity, algo: "cosine" as const },
    { score: levenshteinSimilarity, algo: "levenshtein" as const },
    { score: semanticSimilarity, algo: "semantic" as const }
  ];
  const bestAlgo = scores.reduce((a, b) => a.score > b.score ? a : b).algo;

  return {
    isSimilar: finalScore >= 75, // 75% threshold
    similarityScore: Math.round(finalScore),
    matchedQuestion: finalScore >= 75 ? question2 : null,
    matchedResponseId: null,
    algorithm: bestAlgo,
    confidence: Math.round(Math.max(cosineSimilarity, levenshteinSimilarity, semanticSimilarity))
  };
}

/**
 * Normalize question for comparison
 */
function normalizeQuestion(question: string, language: string): string {
  let normalized = question.toLowerCase().trim();

  // Remove punctuation
  normalized = normalized.replace(/[!?.,;:]/g, "");

  // Remove extra spaces
  normalized = normalized.replace(/\s+/g, " ");

  // Remove common filler words
  if (language === "ar") {
    const fillers = ["هل", "ما", "كيف", "أين", "متى", "لماذا", "من", "ماذا"];
    fillers.forEach(filler => {
      normalized = normalized.replace(new RegExp(`^${filler}\\s+|\\s+${filler}\\s+`, "g"), " ");
    });
  } else {
    const fillers = ["do", "does", "did", "is", "are", "was", "were", "the", "a", "an"];
    fillers.forEach(filler => {
      normalized = normalized.replace(new RegExp(`^${filler}\\s+|\\s+${filler}\\s+`, "g"), " ");
    });
  }

  return normalized.trim();
}

/**
 * Calculate cosine similarity between two strings
 * Based on character n-grams
 */
function calculateCosineSimilarity(str1: string, str2: string): number {
  const n = 2; // bigrams
  
  const getNgrams = (s: string): Map<string, number> => {
    const ngrams = new Map<string, number>();
    for (let i = 0; i <= s.length - n; i++) {
      const gram = s.substring(i, i + n);
      ngrams.set(gram, (ngrams.get(gram) || 0) + 1);
    }
    return ngrams;
  };

  const ngrams1 = getNgrams(str1);
  const ngrams2 = getNgrams(str2);

  // Calculate dot product
  let dotProduct = 0;
  ngrams1.forEach((count1, gram) => {
    const count2 = ngrams2.get(gram) || 0;
    dotProduct += count1 * count2;
  });

  // Calculate magnitudes
  let sum1 = 0;
  ngrams1.forEach(count => {
    sum1 += count * count;
  });
  let sum2 = 0;
  ngrams2.forEach(count => {
    sum2 += count * count;
  });
  const magnitude1 = Math.sqrt(sum1);
  const magnitude2 = Math.sqrt(sum2);

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return (dotProduct / (magnitude1 * magnitude2)) * 100;
}

/**
 * Calculate Levenshtein distance similarity
 * Measures edit distance between two strings
 */
function calculateLevenshteinSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);

  if (maxLength === 0) return 100;

  return ((maxLength - distance) / maxLength) * 100;
}

/**
 * Calculate Levenshtein distance
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate semantic similarity based on keyword matching
 */
function calculateSemanticSimilarity(str1: string, str2: string, language: string): number {
  const keywords1 = extractKeywords(str1, language);
  const keywords2 = extractKeywords(str2, language);

  if (keywords1.length === 0 || keywords2.length === 0) return 0;

  // Calculate Jaccard similarity
  const intersection = keywords1.filter(k => keywords2.includes(k)).length;
  const union = new Set([...keywords1, ...keywords2]).size;

  return (intersection / union) * 100;
}

/**
 * Extract keywords from text
 */
function extractKeywords(text: string, language: string): string[] {
  const words = text.split(/\s+/);

  if (language === "ar") {
    // Remove common Arabic stop words
    const stopWords = ["في", "من", "إلى", "هذا", "ذلك", "التي", "الذي", "على", "عن", "مع", "بعد", "قبل"];
    return words.filter(w => w.length > 2 && !stopWords.includes(w));
  } else {
    // Remove common English stop words
    const stopWords = ["the", "a", "an", "in", "on", "at", "to", "for", "of", "and", "or", "but"];
    return words.filter(w => w.length > 2 && !stopWords.includes(w));
  }
}

/**
 * Find similar questions from a list
 */
export function findSimilarQuestions(
  question: string,
  questionsList: string[],
  threshold: number = 75,
  language: string = "ar"
): Array<{ question: string; similarity: number }> {
  const results: Array<{ question: string; similarity: number }> = [];

  for (const q of questionsList) {
    const match = calculateQuestionSimilarity(question, q, language);
    if (match.similarityScore >= threshold) {
      results.push({
        question: q,
        similarity: match.similarityScore
      });
    }
  }

  // Sort by similarity descending
  return results.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Generate cache key for a question
 */
export function generateQuestionCacheKey(question: string): string {
  // Simple hash function
  let hash = 0;
  const str = question.toLowerCase().trim();

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return `q_${Math.abs(hash).toString(16)}`;
}

/**
 * Check if a question should use cached response
 */
export function shouldUseCachedResponse(
  newQuestion: string,
  cachedQuestion: string,
  minSimilarity: number = 80
): boolean {
  const match = calculateQuestionSimilarity(newQuestion, cachedQuestion);
  return match.similarityScore >= minSimilarity;
}
