/**
 * Layer 3: NLP Preprocessing (Encoding)
 * 
 * In Human Brain: Converts sensory signals into internal symbols/representations
 * In AmalSense: Tokenization, cleaning, normalization, entity extraction
 * 
 * This transforms raw text into structured, processable representations
 */

// Raw input text
export interface RawText {
  text: string;
  source?: string;
  language?: string;
}

// Encoded/processed text
export interface EncodedText {
  original: string;
  cleaned: string;
  normalized: string;
  tokens: string[];
  language: DetectedLanguage;
  entities: Entity[];
  keywords: Keyword[];
  sentiment: SentimentHint;
  structure: TextStructure;
}

export interface DetectedLanguage {
  code: 'ar' | 'en' | 'mixed' | 'unknown';
  confidence: number;
  dialect?: 'msa' | 'egyptian' | 'gulf' | 'levantine' | 'maghrebi';
}

export interface Entity {
  text: string;
  type: EntityType;
  confidence: number;
  position: { start: number; end: number };
}

export type EntityType = 
  | 'person'
  | 'organization'
  | 'location'
  | 'currency'
  | 'commodity'
  | 'date'
  | 'number'
  | 'percentage';

export interface Keyword {
  word: string;
  weight: number;
  category: string;
}

export interface SentimentHint {
  polarity: 'positive' | 'negative' | 'neutral' | 'mixed';
  intensity: number; // 0-1
  markers: string[];
}

export interface TextStructure {
  type: 'question' | 'statement' | 'command' | 'exclamation';
  hasNegation: boolean;
  hasComparison: boolean;
  hasCondition: boolean;
  complexity: 'simple' | 'compound' | 'complex';
}

/**
 * Main encoding function - transforms raw text to structured representation
 */
export function encode(input: RawText): EncodedText {
  const { text } = input;
  
  // Step 1: Clean text
  const cleaned = cleanText(text);
  
  // Step 2: Normalize
  const normalized = normalizeText(cleaned);
  
  // Step 3: Tokenize
  const tokens = tokenize(normalized);
  
  // Step 4: Detect language
  const language = detectLanguage(normalized);
  
  // Step 5: Extract entities
  const entities = extractEntities(normalized);
  
  // Step 6: Extract keywords
  const keywords = extractKeywords(tokens);
  
  // Step 7: Detect sentiment hints
  const sentiment = detectSentiment(normalized);
  
  // Step 8: Analyze structure
  const structure = analyzeStructure(normalized);
  
  return {
    original: text,
    cleaned,
    normalized,
    tokens,
    language,
    entities,
    keywords,
    sentiment,
    structure
  };
}

/**
 * Clean text - remove noise, fix common issues
 */
function cleanText(text: string): string {
  let cleaned = text;
  
  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Remove URLs
  cleaned = cleaned.replace(/https?:\/\/\S+/g, '');
  
  // Remove email addresses
  cleaned = cleaned.replace(/\S+@\S+\.\S+/g, '');
  
  // Remove hashtags but keep the word
  cleaned = cleaned.replace(/#(\S+)/g, '$1');
  
  // Remove mentions
  cleaned = cleaned.replace(/@\S+/g, '');
  
  // Fix Arabic punctuation
  cleaned = cleaned.replace(/،/g, '،');
  cleaned = cleaned.replace(/؟/g, '؟');
  
  // Remove repeated punctuation
  cleaned = cleaned.replace(/([.!?،؟])\1+/g, '$1');
  
  // Remove emojis (keep text clean)
  cleaned = cleaned.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '');
  cleaned = cleaned.replace(/[\u2600-\u26FF]/g, '');
  cleaned = cleaned.replace(/[\u2700-\u27BF]/g, '');
  
  return cleaned.trim();
}

/**
 * Normalize text - standardize variations
 */
function normalizeText(text: string): string {
  let normalized = text;
  
  // Normalize Arabic characters
  // Alef variations → ا
  normalized = normalized.replace(/[أإآ]/g, 'ا');
  
  // Taa marbuta → ه in some contexts
  // normalized = normalized.replace(/ة/g, 'ه');
  
  // Yaa variations
  normalized = normalized.replace(/ى/g, 'ي');
  
  // Remove tatweel (kashida)
  normalized = normalized.replace(/ـ/g, '');
  
  // Remove diacritics (tashkeel)
  normalized = normalized.replace(/[\u064B-\u065F]/g, '');
  
  // Normalize numbers
  // Arabic-Indic to Western
  const arabicNums = '٠١٢٣٤٥٦٧٨٩';
  const westernNums = '0123456789';
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replace(new RegExp(arabicNums[i], 'g'), westernNums[i]);
  }
  
  return normalized;
}

/**
 * Tokenize text into words
 */
function tokenize(text: string): string[] {
  // Split on whitespace and punctuation
  const tokens = text.split(/[\s،؟.!,?;:]+/);
  
  // Filter empty tokens and very short ones
  return tokens.filter(t => t.length > 1);
}

/**
 * Detect language and dialect
 */
function detectLanguage(text: string): DetectedLanguage {
  // Count Arabic vs English characters
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
  const totalChars = arabicChars + englishChars;
  
  if (totalChars === 0) {
    return { code: 'unknown', confidence: 0 };
  }
  
  const arabicRatio = arabicChars / totalChars;
  
  let code: 'ar' | 'en' | 'mixed' | 'unknown';
  let confidence: number;
  
  if (arabicRatio > 0.8) {
    code = 'ar';
    confidence = arabicRatio;
  } else if (arabicRatio < 0.2) {
    code = 'en';
    confidence = 1 - arabicRatio;
  } else {
    code = 'mixed';
    confidence = 0.5;
  }
  
  // Detect Arabic dialect (simplified)
  let dialect: 'msa' | 'egyptian' | 'gulf' | 'levantine' | 'maghrebi' | undefined;
  
  if (code === 'ar') {
    // Egyptian markers
    if (/ده|دي|كده|ازاي|عايز/.test(text)) {
      dialect = 'egyptian';
    }
    // Gulf markers
    else if (/شلون|وايد|زين|خوش/.test(text)) {
      dialect = 'gulf';
    }
    // Levantine markers
    else if (/هيك|كيف|شو|هلق/.test(text)) {
      dialect = 'levantine';
    }
    // Maghrebi markers
    else if (/كيفاش|واش|بزاف/.test(text)) {
      dialect = 'maghrebi';
    }
    // Default to MSA
    else {
      dialect = 'msa';
    }
  }
  
  return { code, confidence, dialect };
}

/**
 * Extract named entities
 */
function extractEntities(text: string): Entity[] {
  const entities: Entity[] = [];
  
  // Currency patterns
  const currencyPatterns = [
    { pattern: /دولار|USD|\$/gi, type: 'currency' as EntityType },
    { pattern: /يورو|EUR|€/gi, type: 'currency' as EntityType },
    { pattern: /جنيه|EGP/gi, type: 'currency' as EntityType },
    { pattern: /ريال|SAR/gi, type: 'currency' as EntityType },
    { pattern: /دينار|LYD/gi, type: 'currency' as EntityType },
  ];
  
  // Commodity patterns
  const commodityPatterns = [
    { pattern: /ذهب|gold/gi, type: 'commodity' as EntityType },
    { pattern: /فضة|silver/gi, type: 'commodity' as EntityType },
    { pattern: /نفط|بترول|oil/gi, type: 'commodity' as EntityType },
  ];
  
  // Number patterns
  const numberPattern = /\d+([.,]\d+)?%?/g;
  
  // Extract currencies
  for (const { pattern, type } of [...currencyPatterns, ...commodityPatterns]) {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type,
        confidence: 0.9,
        position: { start: match.index, end: match.index + match[0].length }
      });
    }
  }
  
  // Extract numbers and percentages
  let match;
  while ((match = numberPattern.exec(text)) !== null) {
    const isPercentage = match[0].includes('%');
    entities.push({
      text: match[0],
      type: isPercentage ? 'percentage' : 'number',
      confidence: 0.95,
      position: { start: match.index, end: match.index + match[0].length }
    });
  }
  
  return entities;
}

/**
 * Extract keywords with weights
 */
function extractKeywords(tokens: string[]): Keyword[] {
  const keywordCategories: Record<string, { words: string[]; weight: number }> = {
    economic: {
      words: ['اقتصاد', 'سوق', 'تداول', 'استثمار', 'أسهم', 'سندات', 'فائدة', 'تضخم', 'ركود', 'نمو'],
      weight: 0.9
    },
    financial: {
      words: ['دولار', 'ذهب', 'فضة', 'نفط', 'عملة', 'صرف', 'بنك', 'مركزي', 'فيدرالي'],
      weight: 0.9
    },
    emotional: {
      words: ['خوف', 'أمل', 'قلق', 'تفاؤل', 'تشاؤم', 'غضب', 'حيرة', 'ثقة', 'شك'],
      weight: 0.8
    },
    decision: {
      words: ['شراء', 'بيع', 'انتظار', 'قرار', 'توصية', 'نصيحة', 'رأي'],
      weight: 0.85
    },
    temporal: {
      words: ['الآن', 'اليوم', 'غداً', 'أسبوع', 'شهر', 'سنة', 'مستقبل', 'ماضي'],
      weight: 0.6
    },
    media: {
      words: ['إعلام', 'أخبار', 'صحافة', 'تقرير', 'تحليل', 'رأي', 'مقال'],
      weight: 0.7
    }
  };
  
  const keywords: Keyword[] = [];
  
  for (const token of tokens) {
    for (const [category, { words, weight }] of Object.entries(keywordCategories)) {
      if (words.some(w => token.includes(w) || w.includes(token))) {
        keywords.push({
          word: token,
          weight,
          category
        });
        break;
      }
    }
  }
  
  return keywords;
}

/**
 * Detect sentiment hints from text
 */
function detectSentiment(text: string): SentimentHint {
  const positiveMarkers = ['أمل', 'تفاؤل', 'ارتفاع', 'نمو', 'تحسن', 'إيجابي', 'جيد', 'ممتاز', 'فرصة'];
  const negativeMarkers = ['خوف', 'قلق', 'انخفاض', 'تراجع', 'سلبي', 'سيء', 'خطر', 'أزمة', 'انهيار'];
  const uncertaintyMarkers = ['ربما', 'قد', 'محتمل', 'غير واضح', 'حيرة', 'تردد'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  let uncertainCount = 0;
  const foundMarkers: string[] = [];
  
  for (const marker of positiveMarkers) {
    if (text.includes(marker)) {
      positiveCount++;
      foundMarkers.push(marker);
    }
  }
  
  for (const marker of negativeMarkers) {
    if (text.includes(marker)) {
      negativeCount++;
      foundMarkers.push(marker);
    }
  }
  
  for (const marker of uncertaintyMarkers) {
    if (text.includes(marker)) {
      uncertainCount++;
      foundMarkers.push(marker);
    }
  }
  
  // Determine polarity
  let polarity: 'positive' | 'negative' | 'neutral' | 'mixed';
  let intensity: number;
  
  const total = positiveCount + negativeCount;
  
  if (total === 0) {
    polarity = 'neutral';
    intensity = 0;
  } else if (positiveCount > 0 && negativeCount > 0) {
    polarity = 'mixed';
    intensity = Math.min(1, total / 5);
  } else if (positiveCount > negativeCount) {
    polarity = 'positive';
    intensity = Math.min(1, positiveCount / 3);
  } else {
    polarity = 'negative';
    intensity = Math.min(1, negativeCount / 3);
  }
  
  return { polarity, intensity, markers: foundMarkers };
}

/**
 * Analyze text structure
 */
function analyzeStructure(text: string): TextStructure {
  // Detect question
  const isQuestion = /[؟?]/.test(text) || 
    /^(هل|ما|ماذا|كيف|لماذا|متى|أين|من|كم|أي)/.test(text);
  
  // Detect command
  const isCommand = /^(اشتر|بع|انتظر|افعل|لا تفعل)/.test(text);
  
  // Detect exclamation
  const isExclamation = /!/.test(text);
  
  // Determine type
  let type: 'question' | 'statement' | 'command' | 'exclamation';
  if (isQuestion) type = 'question';
  else if (isCommand) type = 'command';
  else if (isExclamation) type = 'exclamation';
  else type = 'statement';
  
  // Detect negation
  const hasNegation = /لا |ليس|لم |لن |ما |غير |بدون/.test(text);
  
  // Detect comparison
  const hasComparison = /أفضل|أسوأ|أكثر|أقل|مقارنة|بين|أم |أو /.test(text);
  
  // Detect condition
  const hasCondition = /إذا|لو |عندما|في حال|متى ما/.test(text);
  
  // Determine complexity
  const clauseCount = (text.match(/[،,;]/g) || []).length + 1;
  let complexity: 'simple' | 'compound' | 'complex';
  if (clauseCount === 1 && !hasCondition) complexity = 'simple';
  else if (clauseCount <= 3) complexity = 'compound';
  else complexity = 'complex';
  
  return {
    type,
    hasNegation,
    hasComparison,
    hasCondition,
    complexity
  };
}

/**
 * Quick encode for simple use cases
 */
export function quickEncode(text: string): {
  tokens: string[];
  language: string;
  sentiment: string;
  type: string;
} {
  const encoded = encode({ text });
  return {
    tokens: encoded.tokens,
    language: encoded.language.code,
    sentiment: encoded.sentiment.polarity,
    type: encoded.structure.type
  };
}
