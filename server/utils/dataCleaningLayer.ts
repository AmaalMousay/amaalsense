/**
 * Data Cleaning Layer
 *
 * Cleans raw text before it enters collectors, EventVector processing, or RAG.
 * It detects spam, very shallow content, duplicates, and low-information text.
 */

export interface CleaningResult {
  originalText: string;
  cleanedText: string;
  isValid: boolean;
  rejectionReason?: string;
  qualityScore: number;
  wordCount: number;
  meaningfulWordCount: number;
  spamScore: number;
}

export interface CleaningStats {
  totalProcessed: number;
  accepted: number;
  rejected: number;
  rejectionReasons: Record<string, number>;
  averageQualityScore: number;
}

const SPAM_PATTERNS = [
  /\b(buy now|click here|limited offer|subscribe|promo|discount|free money)\b/i,
  /(.)\1{8,}/,
  /https?:\/\/\S+\s+https?:\/\/\S+/i,
];

const SHALLOW_PATTERNS = [
  /^\s*$/, /^.{1,12}$/, /^(ok|yes|no|hi|hello|test)$/i,
];

const STOP_WORDS = new Set(['the', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'with', 'from', 'is', 'are', 'was', 'were', 'this', 'that', 'what', 'how', 'why']);

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function stripNoise(text: string): string {
  return normalizeWhitespace(
    text
      .replace(/<[^>]*>/g, ' ')
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/\S+@\S+\.\S+/g, ' ')
      .replace(/#(\S+)/g, '$1')
      .replace(/@\S+/g, ' ')
  );
}

function scoreSpam(text: string): number {
  let score = 0;
  for (const pattern of SPAM_PATTERNS) if (pattern.test(text)) score += 35;
  return Math.min(100, score);
}

function normalizeForComparison(text: string): string {
  return stripNoise(text).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').trim();
}

function calculateSimilarity(text1: string, text2: string): number {
  const set1 = new Set(normalizeForComparison(text1).split(/\s+/).filter(Boolean));
  const set2 = new Set(normalizeForComparison(text2).split(/\s+/).filter(Boolean));
  if (set1.size === 0 && set2.size === 0) return 1;
  const intersection = [...set1].filter(word => set2.has(word)).length;
  const union = new Set([...set1, ...set2]).size;
  return union === 0 ? 0 : intersection / union;
}

export function cleanText(text: string): CleaningResult {
  const originalText = text;
  const cleanedText = stripNoise(text);
  const words = cleanedText.split(/\s+/).filter(Boolean);
  const meaningfulWords = words.filter(word => !STOP_WORDS.has(word.toLowerCase()) && word.length > 2);
  const spamScore = scoreSpam(text);

  let isValid = true;
  let rejectionReason: string | undefined;
  if (SHALLOW_PATTERNS.some(pattern => pattern.test(cleanedText))) {
    isValid = false;
    rejectionReason = 'too_shallow';
  } else if (spamScore >= 70) {
    isValid = false;
    rejectionReason = 'spam';
  } else if (meaningfulWords.length < 3) {
    isValid = false;
    rejectionReason = 'low_information';
  }

  const lengthScore = Math.min(35, meaningfulWords.length * 4);
  const densityScore = words.length ? (meaningfulWords.length / words.length) * 35 : 0;
  const spamPenalty = spamScore * 0.4;
  const qualityScore = Math.round(Math.max(0, Math.min(100, lengthScore + densityScore + 30 - spamPenalty)));

  return { originalText, cleanedText, isValid, rejectionReason, qualityScore, wordCount: words.length, meaningfulWordCount: meaningfulWords.length, spamScore };
}

function removeDuplicates(results: CleaningResult[]): CleaningResult[] {
  const accepted: CleaningResult[] = [];
  for (const result of results) {
    if (accepted.some(existing => calculateSimilarity(existing.cleanedText, result.cleanedText) >= 0.9)) continue;
    accepted.push(result);
  }
  return accepted;
}

export function cleanTexts(texts: string[]): { results: CleaningResult[]; validTexts: string[]; stats: CleaningStats } {
  const results = texts.map(cleanText);
  const valid = removeDuplicates(results.filter(result => result.isValid));
  const rejectionReasons: Record<string, number> = {};
  for (const result of results.filter(result => !result.isValid)) {
    const reason = result.rejectionReason || 'unknown';
    rejectionReasons[reason] = (rejectionReasons[reason] || 0) + 1;
  }
  const averageQualityScore = valid.length ? valid.reduce((sum, result) => sum + result.qualityScore, 0) / valid.length : 0;
  return {
    results,
    validTexts: valid.map(result => result.cleanedText),
    stats: { totalProcessed: texts.length, accepted: valid.length, rejected: texts.length - valid.length, rejectionReasons, averageQualityScore },
  };
}

export function filterByQuality(results: CleaningResult[], minQualityScore: number = 50): CleaningResult[] {
  return results.filter(result => result.isValid && result.qualityScore >= minQualityScore);
}

export function sortByQuality(results: CleaningResult[]): CleaningResult[] {
  return [...results].sort((a, b) => b.qualityScore - a.qualityScore);
}
