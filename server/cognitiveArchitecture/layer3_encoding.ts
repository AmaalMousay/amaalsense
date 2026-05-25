import { t } from "../_core/i18n";

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
  cleaned = cleaned.replace(/\u060C/g, ',');
  cleaned = cleaned.replace(/\u061F/g, '?');
  
  // Remove repeated punctuation
  cleaned = cleaned.replace(/([.!?])\1+/g, '$1');
  
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
  // Alef variations → 
  normalized = normalized.replace(/[\u0623\u0625\u0622\u0627]/g, '\u0627');
  
  // Taa marbuta →  in some contexts
  // normalized = normalized.replace(/\u0629/g, '\u0647');
  
  // Yaa variations
  normalized = normalized.replace(/\u0649/g, '\u064A');
  
  // Remove tatweel (kashida)
  normalized = normalized.replace(/\u0640/g, '');
  
  // Remove diacritics (tashkeel)
  normalized = normalized.replace(/[\u064B-\u065F]/g, '');
  
  // Normalize numbers
  // Arabic-Indic to Western
  const arabicNums = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
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
  const tokens = text.split(/[\s.!,?;:]+/);
  
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
    if (/||||/.test(text)) {
      dialect = 'egyptian';
    }
    // Gulf markers
    else if (/|||/.test(text)) {
      dialect = 'gulf';
    }
    // Levantine markers
    else if (/|||/.test(text)) {
      dialect = 'levantine';
    }
    // Maghrebi markers
    else if (/||/.test(text)) {
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
    { pattern: /|USD|\$/gi, type: 'currency' as EntityType },
    { pattern: /|EUR|€/gi, type: 'currency' as EntityType },
    { pattern: /|EGP/gi, type: 'currency' as EntityType },
    { pattern: /|SAR/gi, type: 'currency' as EntityType },
    { pattern: /|LYD/gi, type: 'currency' as EntityType },
  ];
  
  // Commodity patterns
  const commodityPatterns = [
    { pattern: /|gold/gi, type: 'commodity' as EntityType },
    { pattern: /|silver/gi, type: 'commodity' as EntityType },
    { pattern: /||oil/gi, type: 'commodity' as EntityType },
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
      words: [t('auto.cognitiveArchitecture_layer3_encoding.74.6d38c2ea', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.73.16c73be6', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.72.7b2d8f16', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.71.2efcd729', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.70.866ae2e3', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.69.5f94a3f8', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.68.c09eeb5c', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.67.8b8e7c7f', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.66.8009605b', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.65.25e94d3e', 'ar')],
      weight: 0.9
    },
    financial: {
      words: [t('auto.cognitiveArchitecture_layer3_encoding.64.23163ab2', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.63.d76ed4f3', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.62.25b08751', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.61.02782624', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.60.db2f097a', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.59.efb0540f', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.58.f879f70c', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.57.13b18cf0', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.56.a6f9d332', 'ar')],
      weight: 0.9
    },
    emotional: {
      words: [t('auto.cognitiveArchitecture_layer3_encoding.55.1cf83ec0', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.54.60cd6c3d', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.53.a24a5460', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.52.e01009da', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.51.bd853fe0', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.50.8e7bd750', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.49.c50b9879', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.48.d4c54e2f', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.47.189c48a2', 'ar')],
      weight: 0.8
    },
    decision: {
      words: [t('auto.cognitiveArchitecture_layer3_encoding.46.c48e5f78', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.45.bf3a3673', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.44.95bef856', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.43.2c473ed6', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.42.d906ee67', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.41.7f6eeca0', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.40.4de47ee7', 'ar')],
      weight: 0.85
    },
    temporal: {
      words: [t('auto.cognitiveArchitecture_layer3_encoding.39.7b94973f', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.38.b76444a3', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.37.d5da7943', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.36.b9028253', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.35.492a5598', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.34.f91a7c98', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.33.7bab3f86', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.32.6e7ac8da', 'ar')],
      weight: 0.6
    },
    media: {
      words: [t('auto.cognitiveArchitecture_layer3_encoding.31.c1d6b74e', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.30.71960207', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.29.a3104b1b', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.28.74d6e2cc', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.27.6c1732f8', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.26.4de47ee7', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.25.8102193b', 'ar')],
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
  const positiveMarkers = [t('auto.cognitiveArchitecture_layer3_encoding.24.60cd6c3d', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.23.e01009da', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.22.a6f465eb', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.21.25e94d3e', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.20.ab4c7e3d', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.19.3c9380a2', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.18.c4242fc2', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.17.ab5f38a7', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.16.3f289306', 'ar')];
  const negativeMarkers = [t('auto.cognitiveArchitecture_layer3_encoding.15.1cf83ec0', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.14.a24a5460', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.13.e990bd85', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.12.98df46fb', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.11.a5ed0453', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.10.f4fc67ca', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.9.5349080f', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.8.38a8a76e', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.7.417cc6aa', 'ar')];
  const uncertaintyMarkers = [t('auto.cognitiveArchitecture_layer3_encoding.6.5aaaa319', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.5.5230cf99', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.4.74553005', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.3.c7e5e248', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.2.c50b9879', 'ar'), t('auto.cognitiveArchitecture_layer3_encoding.1.01eb31df', 'ar')];
  
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
  const isQuestion = /[?]/.test(text) || 
    /^(|||||||||)/.test(text);
  
  // Detect command
  const isCommand = /^(|||| )/.test(text);
  
  // Detect exclamation
  const isExclamation = /!/.test(text);
  
  // Determine type
  let type: 'question' | 'statement' | 'command' | 'exclamation';
  if (isQuestion) type = 'question';
  else if (isCommand) type = 'command';
  else if (isExclamation) type = 'exclamation';
  else type = 'statement';
  
  // Detect negation
  const hasNegation = / || | | | |/.test(text);
  
  // Detect comparison
  const hasComparison = /|||||| | /.test(text);
  
  // Detect condition
  const hasCondition = /| || | /.test(text);
  
  // Determine complexity
  const clauseCount = (text.match(/[,;]/g) || []).length + 1;
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
