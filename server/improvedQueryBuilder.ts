import { z } from 'zod';
import { detectLanguage } from './languageAwareHandler';

/**
 * Improved Query Builder
 * Handles multi-term queries and maintains language consistency
 */

interface QueryBuilderInput {
  question: string;
  language?: string;
  maxTerms?: number;
}

interface BuiltQuery {
  originalQuestion: string;
  language: string;
  primaryTerms: string[];
  secondaryTerms: string[];
  filters: {
    timeRange?: string;
    region?: string;
    sentiment?: string;
  };
  queryString: string;
  confidence: number;
}

export const improveQueryBuilder = (input: QueryBuilderInput): BuiltQuery => {
  const language = input.language || detectLanguage(input.question);
  const maxTerms = input.maxTerms || 5;
  
  // Extract key terms from question
  const terms = extractTerms(input.question, language);
  const primaryTerms = terms.slice(0, Math.min(3, maxTerms));
  const secondaryTerms = terms.slice(3, maxTerms);
  
  // Extract filters
  const filters = extractFilters(input.question, language);
  
  // Build query string maintaining language
  const queryString = buildQueryString(primaryTerms, secondaryTerms, language);
  
  // Calculate confidence based on term extraction quality
  const confidence = calculateConfidence(primaryTerms, secondaryTerms, filters);
  
  return {
    originalQuestion: input.question,
    language,
    primaryTerms,
    secondaryTerms,
    filters,
    queryString,
    confidence,
  };
};

const extractTerms = (question: string, language: string): string[] => {
  // Language-specific term extraction
  const stopWords = getStopWords(language);
  
  // Split into words and filter
  let words: string[] = [];
  
  if (language === 'ar') {
    // Arabic word splitting
    words = question.match(/[\u0600-\u06FF]+/g) || [];
  } else if (language === 'zh') {
    // Chinese character splitting
    words = question.match(/[\u4E00-\u9FFF]/g) || [];
  } else {
    // Latin-based languages
    words = question.toLowerCase().match(/\b\w+\b/g) || [];
  }
  
  // Filter out stop words and short words
  const terms = words
    .filter(w => !stopWords.has(w.toLowerCase()))
    .filter(w => w.length > 2)
    .filter((w, i, arr) => arr.indexOf(w) === i); // unique
  
  return terms;
};

const getStopWords = (language: string): Set<string> => {
  const stopWordsMap: Record<string, Set<string>> = {
    en: new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
      'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might',
    ]),
    ar: new Set([
      'ال', 'و', 'في', 'من', 'إلى', 'عن', 'على', 'هذا', 'ذلك', 'التي',
      'الذي', 'اللذان', 'هو', 'هي', 'هم', 'هن', 'أن', 'إن', 'كان', 'كانت',
      'ليس', 'ليست', 'لا', 'لم', 'لن', 'قد', 'قد', 'كل', 'بعض', 'أي',
    ]),
    fr: new Set([
      'le', 'la', 'les', 'de', 'du', 'et', 'est', 'que', 'pour', 'avec', 'par',
      'un', 'une', 'des', 'à', 'au', 'aux', 'en', 'ce', 'qui', 'que', 'où',
      'est', 'sont', 'était', 'étaient', 'être', 'avoir', 'faire',
    ]),
    es: new Set([
      'el', 'la', 'los', 'las', 'de', 'y', 'es', 'que', 'para', 'con', 'por',
      'un', 'una', 'unos', 'unas', 'a', 'al', 'en', 'este', 'ese', 'aquel',
      'es', 'son', 'era', 'eran', 'ser', 'estar', 'haber', 'tener',
    ]),
    de: new Set([
      'der', 'die', 'das', 'und', 'ist', 'ein', 'eine', 'zu', 'von', 'mit',
      'den', 'dem', 'des', 'ein', 'einen', 'einem', 'einen', 'in', 'auf',
      'bin', 'bist', 'sind', 'war', 'waren', 'sein', 'haben', 'hat',
    ]),
    zh: new Set([
      '的', '一', '是', '在', '不', '了', '有', '和', '人', '这', '中',
      '大', '为', '上', '个', '国', '我', '以', '要', '他', '时', '来',
    ]),
    ja: new Set([
      'の', 'に', 'は', 'を', 'た', 'が', 'で', 'て', 'と', 'し', 'れ',
      'さ', 'ある', 'いる', 'も', 'する', 'から', 'な', 'こと', 'として',
    ]),
  };
  
  return stopWordsMap[language] || stopWordsMap['en'];
};

const extractFilters = (question: string, language: string): Record<string, string> => {
  const filters: Record<string, string> = {};
  
  // Time range detection
  const timePatterns: Record<string, RegExp> = {
    en: /(?:last|past|in the|during the|over the)\s+(hour|day|week|month|year|24\s*hours|7\s*days|30\s*days)/i,
    ar: /(?:خلال|في|خلاله)\s+(ساعة|يوم|أسبوع|شهر|سنة|24\s*ساعة|7\s*أيام|30\s*يوم)/i,
    fr: /(?:dernier|passé|au cours|pendant|sur)\s+(heure|jour|semaine|mois|année|24\s*heures|7\s*jours|30\s*jours)/i,
  };
  
  const timePattern = timePatterns[language] || timePatterns['en'];
  const timeMatch = question.match(timePattern);
  if (timeMatch) {
    filters.timeRange = timeMatch[0];
  }
  
  // Region detection
  const regions = ['middle east', 'north africa', 'europe', 'asia', 'americas', 'africa',
                   'الشرق الأوسط', 'شمال أفريقيا', 'أوروبا', 'آسيا', 'أفريقيا',
                   'moyen-orient', 'afrique du nord', 'europe', 'asie', 'amérique'];
  
  for (const region of regions) {
    if (question.toLowerCase().includes(region.toLowerCase())) {
      filters.region = region;
      break;
    }
  }
  
  return filters;
};

const buildQueryString = (primary: string[], secondary: string[], language: string): string => {
  // Build query maintaining language
  const allTerms = [...primary, ...secondary];
  
  if (language === 'ar') {
    // Arabic query format
    return allTerms.join(' و');
  } else if (language === 'zh') {
    // Chinese query format
    return allTerms.join('');
  } else {
    // Latin-based languages
    return allTerms.join(' AND ');
  }
};

const calculateConfidence = (primary: string[], secondary: string[], filters: Record<string, string>): number => {
  let confidence = 0.5; // base confidence
  
  // More primary terms = higher confidence
  confidence += Math.min(0.3, primary.length * 0.1);
  
  // Secondary terms add confidence
  confidence += Math.min(0.1, secondary.length * 0.05);
  
  // Filters add confidence
  confidence += Object.keys(filters).length * 0.05;
  
  return Math.min(1, confidence);
};

export const validateQuery = (query: BuiltQuery): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!query.primaryTerms || query.primaryTerms.length === 0) {
    errors.push('No primary terms extracted');
  }
  
  if (query.confidence < 0.3) {
    errors.push('Query confidence too low');
  }
  
  if (!query.language) {
    errors.push('Language not detected');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

export const improvedQueryBuilderRouter = {
  improveQueryBuilder,
  validateQuery,
};
