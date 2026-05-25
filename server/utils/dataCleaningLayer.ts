import { t } from "../_core/i18n";

/**
 * Data Cleaning Layer -   
 * 
 *    :
 * -   
 * -   
 * -  
 * -   
 */

//   
const SPAM_PATTERNS = [
  //  
  /[]\s*/gi,
  /\s*/gi,
  /\s*\d+%/gi,
  /\s*/gi,
  //gi,
  /|/gi,
  /\s*\s*/gi,
  //gi,
  /\s*\s*/gi,
  /\s*/gi,
  
  //  
  /buy\s*now/gi,
  /click\s*here/gi,
  /limited\s*offer/gi,
  /\d+%\s*off/gi,
  /free\s*shipping/gi,
  /subscribe\s*now/gi,
  /link\s*in\s*bio/gi,
  /follow\s*us/gi,
  /dm\s*for\s*(more|details)/gi,
  /promo\s*code/gi,
  
  //  
  /bit\.ly/gi,
  /tinyurl/gi,
  /goo\.gl/gi,
  
  //  
  /\$\$\$/gi,
  /💰{2,}/gi,
  /🔥{3,}/gi,
  /!!!{2,}/gi,
];

//   (   )
const SHALLOW_PATTERNS = [
  /^(ok|okay|yes|no|yeah|nope|lol|haha|hmm|wow)$/gi,
  /^[\u0600-\u06FF]{1,3}$/gi, //    
  /^[a-zA-Z]{1,3}$/gi, //    
  /^[\d\s\.\,\!\?]+$/gi, //   
];

//   (Stop Words)  
const STOP_WORDS = new Set([
  // 
  t('auto.utils_dataCleaningLayer.42.aef2099d', 'ar'), t('auto.utils_dataCleaningLayer.41.aa7099e2', 'ar'), t('auto.utils_dataCleaningLayer.40.8ab80326', 'ar'), t('auto.utils_dataCleaningLayer.39.16dc1dd1', 'ar'), t('auto.utils_dataCleaningLayer.38.38486333', 'ar'), t('auto.utils_dataCleaningLayer.37.f3c3b73b', 'ar'), t('auto.utils_dataCleaningLayer.36.6be4d5a7', 'ar'), t('auto.utils_dataCleaningLayer.35.f60d1f66', 'ar'), t('auto.utils_dataCleaningLayer.34.bcd49587', 'ar'), t('auto.utils_dataCleaningLayer.33.5a014748', 'ar'),
  t('auto.utils_dataCleaningLayer.32.07a0f9f0', 'ar'), t('auto.utils_dataCleaningLayer.31.d29a8d2f', 'ar'), t('auto.utils_dataCleaningLayer.30.0fdd37e0', 'ar'), t('auto.utils_dataCleaningLayer.29.cf8d2dee', 'ar'), t('auto.utils_dataCleaningLayer.28.1b78792e', 'ar'), t('auto.utils_dataCleaningLayer.27.7a898715', 'ar'), t('auto.utils_dataCleaningLayer.26.b3efb3b5', 'ar'), t('auto.utils_dataCleaningLayer.25.84b05c09', 'ar'), t('auto.utils_dataCleaningLayer.24.79a366ce', 'ar'), t('auto.utils_dataCleaningLayer.23.941ddf4b', 'ar'),
  t('auto.utils_dataCleaningLayer.22.4ab1332c', 'ar'), t('auto.utils_dataCleaningLayer.21.b28d8868', 'ar'), t('auto.utils_dataCleaningLayer.20.1e55b052', 'ar'), t('auto.utils_dataCleaningLayer.19.2a9096ec', 'ar'), t('auto.utils_dataCleaningLayer.18.678c315f', 'ar'), t('auto.utils_dataCleaningLayer.17.7160aa46', 'ar'), t('auto.utils_dataCleaningLayer.16.5230cf99', 'ar'), t('auto.utils_dataCleaningLayer.15.72682b6c', 'ar'), t('auto.utils_dataCleaningLayer.14.a62caa1e', 'ar'), t('auto.utils_dataCleaningLayer.13.5c528d9f', 'ar'),
  t('auto.utils_dataCleaningLayer.12.2d0d4abd', 'ar'), t('auto.utils_dataCleaningLayer.11.657087a7', 'ar'), t('auto.utils_dataCleaningLayer.10.f9d2f7c9', 'ar'), t('auto.utils_dataCleaningLayer.9.a8941dde', 'ar'), t('auto.utils_dataCleaningLayer.8.b1a93b00', 'ar'), t('auto.utils_dataCleaningLayer.7.5042ea0a', 'ar'), t('auto.utils_dataCleaningLayer.6.aec02460', 'ar'), t('auto.utils_dataCleaningLayer.5.d2624f52', 'ar'), t('auto.utils_dataCleaningLayer.4.304117b6', 'ar'), t('auto.utils_dataCleaningLayer.3.5bb2f0c8', 'ar'), t('auto.utils_dataCleaningLayer.2.8b5123a2', 'ar'), t('auto.utils_dataCleaningLayer.1.4b4f75b8', 'ar'),
  
  // 
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
  'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'under', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'and', 'but', 'if', 'or',
  'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with',
  'about', 'against', 'between', 'into', 'through', 'during', 'before',
  'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
  'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once',
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you',
  'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his',
  'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself',
  'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
  'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
]);

export interface CleaningResult {
  originalText: string;
  cleanedText: string;
  isValid: boolean;
  rejectionReason?: string;
  qualityScore: number; // 0-100
  wordCount: number;
  meaningfulWordCount: number;
  spamScore: number; // 0-100 (higher = more spam)
}

export interface CleaningStats {
  totalProcessed: number;
  accepted: number;
  rejected: number;
  rejectionReasons: Record<string, number>;
  averageQualityScore: number;
}

/**
 *   
 */
export function cleanText(text: string): CleaningResult {
  const originalText = text;
  let cleanedText = text.trim();
  
  // 1.  
  cleanedText = cleanedText.replace(/https?:\/\/[^\s]+/gi, '');
  cleanedText = cleanedText.replace(/www\.[^\s]+/gi, '');
  
  // 2.  mentions  hashtags 
  cleanedText = cleanedText.replace(/@\w+/g, '');
  cleanedText = cleanedText.replace(/#\w+/g, (match) => match.slice(1)); //    #
  
  // 3.    
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
  
  // 4.   
  const words = cleanedText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // 5.     ( stop words)
  const meaningfulWords = words.filter(w => !STOP_WORDS.has(w.toLowerCase()));
  const meaningfulWordCount = meaningfulWords.length;
  
  // 6.  
  let spamScore = 0;
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(originalText)) {
      spamScore += 15;
    }
  }
  spamScore = Math.min(100, spamScore);
  
  // 7.   
  let isShallow = false;
  for (const pattern of SHALLOW_PATTERNS) {
    if (pattern.test(cleanedText)) {
      isShallow = true;
      break;
    }
  }
  
  // 8.   
  let isValid = true;
  let rejectionReason: string | undefined;
  
  //    
  if (wordCount < 3) {
    isValid = false;
    rejectionReason = 'too_short';
  }
  //      
  else if (meaningfulWordCount < 2) {
    isValid = false;
    rejectionReason = 'no_meaningful_words';
  }
  //  
  else if (spamScore > 50) {
    isValid = false;
    rejectionReason = 'spam_detected';
  }
  //   
  else if (isShallow) {
    isValid = false;
    rejectionReason = 'shallow_content';
  }
  
  // 9.   
  let qualityScore = 100;
  
  //   
  if (wordCount < 10) qualityScore -= 20;
  else if (wordCount < 20) qualityScore -= 10;
  
  //  
  qualityScore -= spamScore * 0.5;
  
  //     
  const meaningfulRatio = meaningfulWordCount / wordCount;
  if (meaningfulRatio < 0.3) qualityScore -= 30;
  else if (meaningfulRatio < 0.5) qualityScore -= 15;
  
  qualityScore = Math.max(0, Math.min(100, qualityScore));
  
  return {
    originalText,
    cleanedText,
    isValid,
    rejectionReason,
    qualityScore,
    wordCount,
    meaningfulWordCount,
    spamScore,
  };
}

/**
 *    
 */
export function cleanTexts(texts: string[]): {
  validTexts: CleaningResult[];
  invalidTexts: CleaningResult[];
  stats: CleaningStats;
} {
  const results = texts.map(cleanText);
  
  const validTexts = results.filter(r => r.isValid);
  const invalidTexts = results.filter(r => !r.isValid);
  
  //     
  const uniqueValidTexts = removeDuplicates(validTexts);
  
  //  
  const rejectionReasons: Record<string, number> = {};
  for (const invalid of invalidTexts) {
    const reason = invalid.rejectionReason || 'unknown';
    rejectionReasons[reason] = (rejectionReasons[reason] || 0) + 1;
  }
  
  const averageQualityScore = uniqueValidTexts.length > 0
    ? uniqueValidTexts.reduce((sum, r) => sum + r.qualityScore, 0) / uniqueValidTexts.length
    : 0;
  
  const stats: CleaningStats = {
    totalProcessed: texts.length,
    accepted: uniqueValidTexts.length,
    rejected: texts.length - uniqueValidTexts.length,
    rejectionReasons,
    averageQualityScore,
  };
  
  console.log(`[DataCleaning] Processed ${stats.totalProcessed} texts: ${stats.accepted} accepted, ${stats.rejected} rejected`);
  
  return {
    validTexts: uniqueValidTexts,
    invalidTexts,
    stats,
  };
}

/**
 *     
 */
function removeDuplicates(results: CleaningResult[]): CleaningResult[] {
  const unique: CleaningResult[] = [];
  const seenTexts: string[] = [];
  
  for (const result of results) {
    //   
    const normalized = normalizeForComparison(result.cleanedText);
    
    //   
    if (seenTexts.includes(normalized)) {
      continue;
    }
    
    //     
    let isDuplicate = false;
    for (const seen of seenTexts) {
      if (calculateSimilarity(normalized, seen) > 0.85) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      seenTexts.push(normalized);
      unique.push(result);
    }
  }
  
  return unique;
}

/**
 *   
 */
function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, '') //  
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 *    (Jaccard Similarity)
 */
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.split(/\s+/);
  const words2 = text2.split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  let intersectionCount = 0;
  for (const word of words1) {
    if (set2.has(word)) {
      intersectionCount++;
    }
  }
  
  const unionCount = new Set([...words1, ...words2]).size;
  
  return unionCount > 0 ? intersectionCount / unionCount : 0;
}

/**
 *    
 */
export function filterByQuality(
  results: CleaningResult[],
  minQuality: number = 50
): CleaningResult[] {
  return results.filter(r => r.qualityScore >= minQuality);
}

/**
 *    
 */
export function sortByQuality(results: CleaningResult[]): CleaningResult[] {
  return [...results].sort((a, b) => b.qualityScore - a.qualityScore);
}
