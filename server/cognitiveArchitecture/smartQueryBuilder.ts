import { t } from "../_core/i18n";
/**
 * Smart Query Builder
 * 
 * Converts user questions into intelligent search queries.
 * This is the "eyes" of AmalSense - it determines what data to look for.
 * 
 * Problem it solves:
 * - User asks: "       "
 * - Old system: searched for random keywords or fetched general news
 * - New system: extracts "  " + "" and searches specifically
 */

import { invokeLLM } from '../_core/llm';

export interface SmartQuery {
  // Primary search terms (most important)
  primaryTerms: string[];
  
  // Secondary terms (context)
  secondaryTerms: string[];
  
  // Country/region if mentioned
  country?: string;
  
  // Language for search
  language: 'ar' | 'en' | 'both';
  
  // Combined query strings ready for search
  searchQueries: {
    arabic: string[];
    english: string[];
  };
  
  // Topic domain for filtering
  domain: string;
}

/**
 * Extract smart search queries from user question
 * Uses LLM to understand the question and extract relevant search terms
 */
export async function buildSmartQuery(question: string): Promise<SmartQuery> {
  console.log('[SmartQueryBuilder] Building query for:', question.substring(0, 50));
  
  try {
    // Use LLM to extract search terms
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: t('auto.cognitiveArchitecture_smartQueryBuilder.115.bfad0feb', 'ar')
        },
        {
          role: 'user',
          content: question
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'query_extraction',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              primaryTerms: { type: 'array', items: { type: 'string' } },
              secondaryTerms: { type: 'array', items: { type: 'string' } },
              country: { type: ['string', 'null'] },
              domain: { type: 'string' },
              englishTerms: { type: 'array', items: { type: 'string' } }
            },
            required: ['primaryTerms', 'secondaryTerms', 'country', 'domain', 'englishTerms'],
            additionalProperties: false
          }
        }
      }
    });
    
    const content = response.choices[0].message.content;
    const extracted = JSON.parse(typeof content === 'string' ? content : '{}');
    
    // Build search queries
    const arabicQueries = buildArabicQueries(extracted.primaryTerms, extracted.secondaryTerms, extracted.country);
    const englishQueries = buildEnglishQueries(extracted.englishTerms, extracted.country);
    
    const result: SmartQuery = {
      primaryTerms: extracted.primaryTerms || [],
      secondaryTerms: extracted.secondaryTerms || [],
      country: extracted.country || undefined,
      language: 'both',
      searchQueries: {
        arabic: arabicQueries,
        english: englishQueries
      },
      domain: extracted.domain || 'society'
    };
    
    console.log('[SmartQueryBuilder] Built query:', {
      primaryTerms: result.primaryTerms,
      country: result.country,
      arabicQueries: result.searchQueries.arabic,
      englishQueries: result.searchQueries.english
    });
    
    return result;
    
  } catch (error) {
    console.error('[SmartQueryBuilder] LLM extraction failed, using fallback:', error);
    return buildFallbackQuery(question);
  }
}

/**
 * Build Arabic search queries
 */
function buildArabicQueries(primary: string[], secondary: string[], country?: string | null): string[] {
  const queries: string[] = [];
  
  // Primary term alone
  if (primary.length > 0) {
    queries.push(primary.join(' '));
  }
  
  // Primary + country
  if (primary.length > 0 && country) {
    queries.push(`${primary.join(' ')} ${country}`);
  }
  
  // Primary + secondary
  if (primary.length > 0 && secondary.length > 0) {
    queries.push(`${primary[0]} ${secondary[0]}`);
  }
  
  return queries.filter(q => q.trim().length > 0);
}

/**
 * Build English search queries
 */
function buildEnglishQueries(terms: string[], country?: string | null): string[] {
  const queries: string[] = [];
  
  if (terms.length > 0) {
    queries.push(terms.join(' '));
    
    if (country) {
      // Map Arabic country names to English
      const countryMap: Record<string, string> = {
        '': 'Libya',
        '': 'Egypt',
        '': 'Saudi Arabia',
        '': 'UAE',
        '': 'Jordan',
        '': 'Lebanon',
        '': 'Syria',
        '': 'Iraq',
        '': 'Palestine',
        '': 'Tunisia',
        '': 'Morocco',
        '': 'Algeria'
      };
      
      const englishCountry = countryMap[country] || country;
      queries.push(`${terms.join(' ')} ${englishCountry}`);
    }
  }
  
  return queries.filter(q => q.trim().length > 0);
}

/**
 * Fallback query builder (no LLM)
 * Used when LLM is unavailable or fails
 */
function buildFallbackQuery(question: string): SmartQuery {
  console.log('[SmartQueryBuilder] Using fallback extraction');
  
  // Simple keyword extraction
  const arabicKeywords = extractArabicKeywords(question);
  const country = detectCountry(question);
  const domain = detectDomain(question);
  
  // Translate common terms
  const englishTerms = translateToEnglish(arabicKeywords);
  
  return {
    primaryTerms: arabicKeywords.slice(0, 3),
    secondaryTerms: arabicKeywords.slice(3),
    country,
    language: 'both',
    searchQueries: {
      arabic: [arabicKeywords.join(' ')],
      english: [englishTerms.join(' ')]
    },
    domain
  };
}

/**
 * Extract Arabic keywords from text
 */
function extractArabicKeywords(text: string): string[] {
  // Remove question words and common words
  const stopWords = [
    t('auto.cognitiveArchitecture_smartQueryBuilder.114.2500c161', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.113.a62caa1e', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.112.913ff299', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.111.dc0f9a10', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.110.daa59aa1', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.109.d87c6b36', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.108.861d9c3d', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.107.aa7099e2', 'ar'),
    t('auto.cognitiveArchitecture_smartQueryBuilder.106.aef2099d', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.105.16dc1dd1', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.104.8ab80326', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.103.38486333', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.102.f3c3b73b', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.101.9a3aec0e', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.100.6be4d5a7', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.99.f60d1f66', 'ar'),
    t('auto.cognitiveArchitecture_smartQueryBuilder.98.2d0d4abd', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.97.657087a7', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.96.5c528d9f', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.95.d045bef8', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.94.5230cf99', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.93.1e55b052', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.92.678c315f', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.91.5f7cccfb', 'ar'),
    t('auto.cognitiveArchitecture_smartQueryBuilder.90.667aa81c', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.89.d2624f52', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.88.304117b6', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.87.5bb2f0c8', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.86.8b5123a2', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.85.4b4f75b8', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.84.66dcc319', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.83.0e6c0388', 'ar')
  ];
  
  // Split and filter
  const words = text
    .replace(/[?!.,]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .filter(word => !stopWords.includes(word));
  
  return words.slice(0, 6);
}

/**
 * Detect country from text
 */
function detectCountry(text: string): string | undefined {
  const countries: Record<string, string> = {
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.82.251aff72', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.81.251aff72', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.80.251aff72', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.79.9f5f187b', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.78.9f5f187b', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.77.9f5f187b', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.76.cd8d189f', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.75.cd8d189f', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.74.9bc10b8c', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.73.9bc10b8c', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.72.bdd0aaf6', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.71.bdd0aaf6', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.70.aec612ef', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.69.aec612ef', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.68.1166d28b', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.67.1166d28b', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.66.4b74973d', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.65.4b74973d', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.64.1b5fbac6', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.63.1b5fbac6', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.62.ba84e974', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.61.ba84e974', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.60.94b11d17', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.59.94b11d17', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.58.cd77976e', 'ar'),
    '': t('auto.cognitiveArchitecture_smartQueryBuilder.57.cd77976e', 'ar')
  };
  
  for (const [key, value] of Object.entries(countries)) {
    if (text.includes(key)) {
      return value;
    }
  }
  
  return undefined;
}

/**
 * Detect domain from text
 */
function detectDomain(text: string): string {
  const domainKeywords: Record<string, string[]> = {
    politics: [t('auto.cognitiveArchitecture_smartQueryBuilder.56.4d8b589c', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.55.26a57968', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.54.d9b242e6', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.53.52d79bae', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.52.b80d3d91', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.51.5ef70e19', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.50.854382ce', 'ar')],
    economy: [t('auto.cognitiveArchitecture_smartQueryBuilder.49.6d38c2ea', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.48.b1941eb0', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.47.a09cec5c', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.46.23163ab2', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.45.d76ed4f3', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.44.25b08751', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.43.27d9d4af', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.42.8b8e7c7f', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.41.db2f097a', 'ar')],
    health: [t('auto.cognitiveArchitecture_smartQueryBuilder.40.72c707a2', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.39.46191a15', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.38.51f4011d', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.37.aae445ae', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.36.dc7cff7f', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.35.98b7356c', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.34.ad5a18db', 'ar')],
    education: [t('auto.cognitiveArchitecture_smartQueryBuilder.33.a0eee03f', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.32.29fbcd7b', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.31.44ee4b4e', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.30.7601e075', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.29.4e95c87b', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.28.22a23f98', 'ar')],
    technology: [t('auto.cognitiveArchitecture_smartQueryBuilder.27.e204e82f', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.26.16cdd488', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.25.ec6d9289', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.24.0daf322c', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.23.56cc4abe', 'ar')],
    society: [t('auto.cognitiveArchitecture_smartQueryBuilder.22.2d5572e2', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.21.e915fc2f', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.20.08ea38f8', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.19.cfc84215', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.18.02150244', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.17.1b8fcc32', 'ar')],
    security: [t('auto.cognitiveArchitecture_smartQueryBuilder.16.b5ae7ef3', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.15.4a79ffc6', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.14.393955e1', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.13.b2155e1c', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.12.6f820943', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.11.b0366353', 'ar')],
    environment: [t('auto.cognitiveArchitecture_smartQueryBuilder.10.6d54e22b', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.9.34b71f22', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.8.3aa1ddb3', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.7.ac19a8d6', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.6.31cc2a40', 'ar')],
    law: [t('auto.cognitiveArchitecture_smartQueryBuilder.5.d1ec9be1', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.4.2109a5cd', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.3.b5d852b0', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.2.3891d076', 'ar'), t('auto.cognitiveArchitecture_smartQueryBuilder.1.499e0392', 'ar')]
  };
  
  const lowerText = text.toLowerCase();
  
  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return domain;
      }
    }
  }
  
  return 'society';
}

/**
 * Translate Arabic keywords to English
 */
function translateToEnglish(arabicWords: string[]): string[] {
  const translations: Record<string, string> = {
    '': 'migration',
    '': 'illegal',
    '': 'immigration',
    '': 'prices',
    '': 'gold',
    '': 'silver',
    '': 'dollar',
    '': 'economy',
    '': 'politics',
    '': 'elections',
    '': 'conflict',
    '': 'war',
    '': 'peace',
    '': 'education',
    '': 'health',
    '': 'environment',
    '': 'technology',
    '': 'security',
    '': 'Libya',
    '': 'Egypt',
    '': 'fuel',
    '': 'subsidy',
    '': 'lifting',
    '': 'rise',
    '': 'decline'
  };
  
  return arabicWords
    .map(word => translations[word] || word)
    .filter(word => /^[a-zA-Z\s]+$/.test(word));
}

/**
 * Filter news items to ensure relevance to the query
 */
export function filterRelevantNews<T extends { title: string; description?: string }>(
  items: T[],
  query: SmartQuery
): T[] {
  const allTerms = [
    ...query.primaryTerms,
    ...query.secondaryTerms,
    ...(query.country ? [query.country] : []),
    ...query.searchQueries.arabic,
    ...query.searchQueries.english
  ].map(t => t.toLowerCase());
  
  return items.filter(item => {
    const text = `${item.title} ${item.description || ''}`.toLowerCase();
    
    // Item must contain at least one primary term
    const hasPrimaryTerm = query.primaryTerms.some(term => 
      text.includes(term.toLowerCase())
    );
    
    // Or at least 2 of any terms
    const matchCount = allTerms.filter(term => text.includes(term)).length;
    
    return hasPrimaryTerm || matchCount >= 2;
  });
}
