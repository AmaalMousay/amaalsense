/**
 * Data Cleaning Layer - طبقة تنظيف البيانات
 * 
 * تنظف البيانات قبل التحليل:
 * - حذف النصوص القصيرة
 * - حذف الإعلانات والسبام
 * - حذف التكرار
 * - تجاهل النصوص السطحية
 */

// أنماط الإعلانات والسبام
const SPAM_PATTERNS = [
  // إعلانات عربية
  /اشتر[يى]\s*الآن/gi,
  /عرض\s*خاص/gi,
  /خصم\s*\d+%/gi,
  /اتصل\s*بنا/gi,
  /للتواصل/gi,
  /واتساب|واتس/gi,
  /رابط\s*في\s*البايو/gi,
  /تابعونا/gi,
  /لمزيد\s*من\s*المعلومات/gi,
  /احجز\s*الآن/gi,
  
  // إعلانات إنجليزية
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
  
  // روابط مشبوهة
  /bit\.ly/gi,
  /tinyurl/gi,
  /goo\.gl/gi,
  
  // سبام عام
  /\$\$\$/gi,
  /💰{2,}/gi,
  /🔥{3,}/gi,
  /!!!{2,}/gi,
];

// كلمات سطحية (لا تحمل معنى عاطفي)
const SHALLOW_PATTERNS = [
  /^(ok|okay|yes|no|yeah|nope|lol|haha|hmm|wow)$/gi,
  /^[\u0600-\u06FF]{1,3}$/gi, // كلمات عربية قصيرة جداً
  /^[a-zA-Z]{1,3}$/gi, // كلمات إنجليزية قصيرة جداً
  /^[\d\s\.\,\!\?]+$/gi, // أرقام ورموز فقط
];

// كلمات توقف (Stop Words) عربية وإنجليزية
const STOP_WORDS = new Set([
  // عربية
  'في', 'من', 'إلى', 'على', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك',
  'التي', 'الذي', 'التى', 'الذى', 'هو', 'هي', 'هم', 'هن', 'نحن', 'أنا',
  'أنت', 'أنتم', 'كان', 'كانت', 'يكون', 'تكون', 'قد', 'لقد', 'ما', 'لا',
  'أن', 'إن', 'لن', 'لم', 'كل', 'بعض', 'أي', 'أو', 'و', 'ف', 'ب', 'ل',
  
  // إنجليزية
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
 * تنظيف نص واحد
 */
export function cleanText(text: string): CleaningResult {
  const originalText = text;
  let cleanedText = text.trim();
  
  // 1. إزالة الروابط
  cleanedText = cleanedText.replace(/https?:\/\/[^\s]+/gi, '');
  cleanedText = cleanedText.replace(/www\.[^\s]+/gi, '');
  
  // 2. إزالة mentions و hashtags الزائدة
  cleanedText = cleanedText.replace(/@\w+/g, '');
  cleanedText = cleanedText.replace(/#\w+/g, (match) => match.slice(1)); // احتفظ بالكلمة بدون #
  
  // 3. تنظيف المسافات والأسطر الزائدة
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
  
  // 4. حساب عدد الكلمات
  const words = cleanedText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // 5. حساب الكلمات ذات المعنى (بدون stop words)
  const meaningfulWords = words.filter(w => !STOP_WORDS.has(w.toLowerCase()));
  const meaningfulWordCount = meaningfulWords.length;
  
  // 6. فحص السبام
  let spamScore = 0;
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(originalText)) {
      spamScore += 15;
    }
  }
  spamScore = Math.min(100, spamScore);
  
  // 7. فحص النصوص السطحية
  let isShallow = false;
  for (const pattern of SHALLOW_PATTERNS) {
    if (pattern.test(cleanedText)) {
      isShallow = true;
      break;
    }
  }
  
  // 8. تحديد صلاحية النص
  let isValid = true;
  let rejectionReason: string | undefined;
  
  // رفض النصوص القصيرة جداً
  if (wordCount < 3) {
    isValid = false;
    rejectionReason = 'too_short';
  }
  // رفض النصوص بدون كلمات ذات معنى
  else if (meaningfulWordCount < 2) {
    isValid = false;
    rejectionReason = 'no_meaningful_words';
  }
  // رفض السبام
  else if (spamScore > 50) {
    isValid = false;
    rejectionReason = 'spam_detected';
  }
  // رفض النصوص السطحية
  else if (isShallow) {
    isValid = false;
    rejectionReason = 'shallow_content';
  }
  
  // 9. حساب جودة النص
  let qualityScore = 100;
  
  // خصم للنصوص القصيرة
  if (wordCount < 10) qualityScore -= 20;
  else if (wordCount < 20) qualityScore -= 10;
  
  // خصم للسبام
  qualityScore -= spamScore * 0.5;
  
  // خصم لقلة الكلمات ذات المعنى
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
 * تنظيف مجموعة من النصوص
 */
export function cleanTexts(texts: string[]): {
  validTexts: CleaningResult[];
  invalidTexts: CleaningResult[];
  stats: CleaningStats;
} {
  const results = texts.map(cleanText);
  
  const validTexts = results.filter(r => r.isValid);
  const invalidTexts = results.filter(r => !r.isValid);
  
  // إزالة التكرار من النصوص الصالحة
  const uniqueValidTexts = removeDuplicates(validTexts);
  
  // حساب الإحصائيات
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
 * إزالة التكرار باستخدام تشابه النصوص
 */
function removeDuplicates(results: CleaningResult[]): CleaningResult[] {
  const unique: CleaningResult[] = [];
  const seenTexts: string[] = [];
  
  for (const result of results) {
    // تطبيع النص للمقارنة
    const normalized = normalizeForComparison(result.cleanedText);
    
    // فحص التكرار الدقيق
    if (seenTexts.includes(normalized)) {
      continue;
    }
    
    // فحص التشابه مع النصوص السابقة
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
 * تطبيع النص للمقارنة
 */
function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, '') // إزالة الرموز
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * حساب تشابه نصين (Jaccard Similarity)
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
 * تصفية النصوص حسب الجودة
 */
export function filterByQuality(
  results: CleaningResult[],
  minQuality: number = 50
): CleaningResult[] {
  return results.filter(r => r.qualityScore >= minQuality);
}

/**
 * ترتيب النصوص حسب الجودة
 */
export function sortByQuality(results: CleaningResult[]): CleaningResult[] {
  return [...results].sort((a, b) => b.qualityScore - a.qualityScore);
}
