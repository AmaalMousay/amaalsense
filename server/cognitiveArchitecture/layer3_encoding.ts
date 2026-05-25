/**
 * Layer 3: Language Encoding
 *
 * Converts raw text into a structured representation: cleaned text, normalized
 * text, tokens, language signal, entities, keywords, sentiment hints and text
 * structure. This layer prepares input for the central network and does not
 * generate final answers.
 */

export interface RawText {
  text: string;
  source?: string;
  language?: string;
}

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

export type EntityType = 'person' | 'organization' | 'location' | 'currency' | 'commodity' | 'date' | 'number' | 'percentage';

export interface Entity {
  text: string;
  type: EntityType;
  confidence: number;
  position: { start: number; end: number };
}

export interface Keyword {
  word: string;
  weight: number;
  category: string;
}

export interface SentimentHint {
  polarity: 'positive' | 'negative' | 'neutral' | 'mixed';
  intensity: number;
  markers: string[];
}

export interface TextStructure {
  type: 'question' | 'statement' | 'command' | 'exclamation';
  hasNegation: boolean;
  hasComparison: boolean;
  hasCondition: boolean;
  complexity: 'simple' | 'compound' | 'complex';
}

const STOPWORDS = new Set(['the', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'with', 'from', 'what', 'why', 'how', 'when', 'where', 'who', 'is', 'are', 'do', 'does']);

const KEYWORD_CATEGORIES: Record<string, string[]> = {
  market: ['market', 'price', 'gold', 'oil', 'stock', 'currency', 'dollar', 'bitcoin', 'crypto', 'inflation', 'rates'],
  politics: ['government', 'election', 'policy', 'minister', 'parliament', 'security', 'sanction'],
  social: ['public', 'society', 'community', 'protest', 'services', 'migration', 'living'],
  risk: ['risk', 'danger', 'crisis', 'fear', 'uncertainty', 'collapse', 'threat'],
  opportunity: ['hope', 'growth', 'recovery', 'agreement', 'peace', 'improvement', 'stability'],
  knowledge: ['research', 'study', 'evidence', 'law', 'science', 'medicine', 'report'],
};

function cleanText(text: string): string {
  return text
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\S+@\S+\.\S+/g, '')
    .replace(/#(\S+)/g, '$1')
    .replace(/@\S+/g, '')
    .replace(/\u060C/g, ',')
    .replace(/\u061F/g, '?')
    .replace(/([.!?])\1+/g, '$1')
    .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '')
    .replace(/[\u2600-\u26FF]/g, '')
    .replace(/[\u2700-\u27BF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeText(text: string): string {
  let normalized = text.toLowerCase();
  normalized = normalized.replace(/[\u0623\u0625\u0622\u0627]/g, '\u0627');
  normalized = normalized.replace(/\u0649/g, '\u064A');
  normalized = normalized.replace(/\u0640/g, '');
  normalized = normalized.replace(/[\u064B-\u065F]/g, '');
  const arabicNums = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
  const westernNums = '0123456789';
  for (let index = 0; index < 10; index++) {
    normalized = normalized.replace(new RegExp(arabicNums[index], 'g'), westernNums[index]);
  }
  return normalized.trim();
}

function tokenize(text: string): string[] {
  return (text.match(/[\p{L}\p{N}_]+/gu) || []).filter(token => token.length > 1);
}

function detectLanguage(text: string): DetectedLanguage {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
  const total = arabicChars + englishChars;
  if (total === 0) return { code: 'unknown', confidence: 0 };
  const arabicRatio = arabicChars / total;
  if (arabicRatio > 0.8) return { code: 'ar', confidence: arabicRatio };
  if (arabicRatio < 0.2) return { code: 'en', confidence: 1 - arabicRatio };
  return { code: 'mixed', confidence: Math.max(arabicRatio, 1 - arabicRatio) };
}

function pushEntity(entities: Entity[], text: string, type: EntityType, fullText: string, confidence = 0.8): void {
  const start = fullText.indexOf(text);
  entities.push({ text, type, confidence, position: { start: Math.max(0, start), end: Math.max(0, start) + text.length } });
}

function extractEntities(text: string): Entity[] {
  const entities: Entity[] = [];
  const currencyMatches = text.match(/\b(usd|eur|gbp|jpy|dollar|euro|gold|oil|bitcoin|btc|eth)\b/gi) || [];
  for (const item of currencyMatches) pushEntity(entities, item, /gold|oil|bitcoin|btc|eth/i.test(item) ? 'commodity' : 'currency', text);

  const percentMatches = text.match(/\b\d+(?:\.\d+)?%/g) || [];
  for (const item of percentMatches) pushEntity(entities, item, 'percentage', text, 0.9);

  const numberMatches = text.match(/\b\d+(?:\.\d+)?\b/g) || [];
  for (const item of numberMatches.slice(0, 10)) pushEntity(entities, item, 'number', text, 0.7);

  const locations = ['libya', 'egypt', 'usa', 'america', 'china', 'russia', 'europe', 'middle east', 'tripoli', 'cairo'];
  for (const location of locations) {
    if (text.includes(location)) pushEntity(entities, location, 'location', text, 0.85);
  }

  return entities;
}

function extractKeywords(tokens: string[]): Keyword[] {
  const counts = new Map<string, number>();
  for (const token of tokens) {
    if (STOPWORDS.has(token) || token.length < 3) continue;
    counts.set(token, (counts.get(token) || 0) + 1);
  }

  return [...counts.entries()]
    .map(([word, count]) => {
      const category = Object.entries(KEYWORD_CATEGORIES).find(([, words]) => words.includes(word))?.[0] || 'general';
      return { word, weight: count, category };
    })
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 12);
}

function detectSentiment(text: string): SentimentHint {
  const positive = ['hope', 'growth', 'success', 'recovery', 'peace', 'agreement', 'improvement', 'stability'];
  const negative = ['fear', 'risk', 'crisis', 'war', 'death', 'collapse', 'danger', 'inflation', 'conflict'];
  const markers = [...positive, ...negative].filter(marker => text.includes(marker));
  const positiveCount = positive.filter(marker => text.includes(marker)).length;
  const negativeCount = negative.filter(marker => text.includes(marker)).length;
  const polarity: SentimentHint['polarity'] = positiveCount && negativeCount ? 'mixed' : positiveCount ? 'positive' : negativeCount ? 'negative' : 'neutral';
  const intensity = Math.min(1, (positiveCount + negativeCount) / 6);
  return { polarity, intensity, markers };
}

function analyzeStructure(text: string): TextStructure {
  const type: TextStructure['type'] = text.endsWith('?') ? 'question' : text.endsWith('!') ? 'exclamation' : /^(please|show|tell|analyze|compare)\b/.test(text) ? 'command' : 'statement';
  const hasNegation = /\b(no|not|never|without|cannot|can't|won't)\b/.test(text);
  const hasComparison = /\b(compare|versus|vs|better|worse|than)\b/.test(text);
  const hasCondition = /\b(if|when|unless|assuming|scenario)\b/.test(text);
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;
  const complexity: TextStructure['complexity'] = sentenceCount > 2 ? 'complex' : text.includes(',') || text.includes(';') ? 'compound' : 'simple';
  return { type, hasNegation, hasComparison, hasCondition, complexity };
}

export function encode(input: RawText): EncodedText {
  const cleaned = cleanText(input.text);
  const normalized = normalizeText(cleaned);
  const tokens = tokenize(normalized);
  return {
    original: input.text,
    cleaned,
    normalized,
    tokens,
    language: detectLanguage(normalized),
    entities: extractEntities(normalized),
    keywords: extractKeywords(tokens),
    sentiment: detectSentiment(normalized),
    structure: analyzeStructure(normalized),
  };
}

export function quickEncode(text: string): { language: DetectedLanguage; keywords: string[]; entities: string[]; structure: TextStructure } {
  const encoded = encode({ text });
  return {
    language: encoded.language,
    keywords: encoded.keywords.map(keyword => keyword.word),
    entities: encoded.entities.map(entity => entity.text),
    structure: encoded.structure,
  };
}
