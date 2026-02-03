/**
 * Smart Query Builder
 * 
 * Converts user questions into intelligent search queries.
 * This is the "eyes" of AmalSense - it determines what data to look for.
 * 
 * Problem it solves:
 * - User asks: "هل الهجرة غير الشرعية من ليبيا تعكس خوفاً؟"
 * - Old system: searched for random keywords or fetched general news
 * - New system: extracts "الهجرة غير الشرعية" + "ليبيا" and searches specifically
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
          content: `أنت محلل أسئلة. مهمتك استخراج كلمات البحث من سؤال المستخدم.

قواعد:
1. استخرج الموضوع الرئيسي (مثل: الهجرة غير الشرعية، أسعار الذهب، الانتخابات)
2. استخرج الدولة أو المنطقة إن وُجدت
3. استخرج الكلمات المفتاحية المهمة
4. ترجم الكلمات للإنجليزية أيضاً للبحث الشامل

أجب بـ JSON فقط بهذا الشكل:
{
  "primaryTerms": ["الموضوع الرئيسي"],
  "secondaryTerms": ["كلمات إضافية"],
  "country": "الدولة أو null",
  "domain": "politics|economy|health|education|technology|society|security|environment|law",
  "englishTerms": ["English translations"]
}`
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
        'ليبيا': 'Libya',
        'مصر': 'Egypt',
        'السعودية': 'Saudi Arabia',
        'الإمارات': 'UAE',
        'الأردن': 'Jordan',
        'لبنان': 'Lebanon',
        'سوريا': 'Syria',
        'العراق': 'Iraq',
        'فلسطين': 'Palestine',
        'تونس': 'Tunisia',
        'المغرب': 'Morocco',
        'الجزائر': 'Algeria'
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
    'هل', 'ما', 'ماذا', 'لماذا', 'كيف', 'متى', 'أين', 'من',
    'في', 'على', 'إلى', 'عن', 'مع', 'بين', 'هذا', 'هذه',
    'أن', 'إن', 'لا', 'نعم', 'قد', 'كان', 'يكون', 'سيكون',
    'أم', 'أو', 'و', 'ف', 'ب', 'ل', 'ك', 'ال'
  ];
  
  // Split and filter
  const words = text
    .replace(/[؟?!.,،]/g, '')
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
    'ليبيا': 'ليبيا',
    'الليبي': 'ليبيا',
    'الليبية': 'ليبيا',
    'مصر': 'مصر',
    'المصري': 'مصر',
    'المصرية': 'مصر',
    'السعودية': 'السعودية',
    'السعودي': 'السعودية',
    'الإمارات': 'الإمارات',
    'الإماراتي': 'الإمارات',
    'الأردن': 'الأردن',
    'الأردني': 'الأردن',
    'لبنان': 'لبنان',
    'اللبناني': 'لبنان',
    'سوريا': 'سوريا',
    'السوري': 'سوريا',
    'العراق': 'العراق',
    'العراقي': 'العراق',
    'فلسطين': 'فلسطين',
    'الفلسطيني': 'فلسطين',
    'تونس': 'تونس',
    'التونسي': 'تونس',
    'المغرب': 'المغرب',
    'المغربي': 'المغرب',
    'الجزائر': 'الجزائر',
    'الجزائري': 'الجزائر'
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
    politics: ['سياسي', 'سياسة', 'انتخابات', 'حكومة', 'برلمان', 'رئيس', 'وزير'],
    economy: ['اقتصاد', 'اقتصادي', 'أسعار', 'دولار', 'ذهب', 'فضة', 'بورصة', 'تضخم', 'عملة'],
    health: ['صحة', 'صحي', 'مرض', 'وباء', 'مستشفى', 'طبي', 'علاج'],
    education: ['تعليم', 'تعليمي', 'مدرسة', 'جامعة', 'طلاب', 'امتحان'],
    technology: ['تكنولوجيا', 'تقنية', 'ذكاء اصطناعي', 'إنترنت', 'رقمي'],
    society: ['اجتماعي', 'مجتمع', 'هجرة', 'شباب', 'أسرة', 'زواج'],
    security: ['أمن', 'أمني', 'صراع', 'حرب', 'عسكري', 'إرهاب'],
    environment: ['بيئة', 'بيئي', 'مناخ', 'تلوث', 'طاقة'],
    law: ['قانون', 'قانوني', 'قضاء', 'محكمة', 'عدالة']
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
    'هجرة': 'migration',
    'غير': 'illegal',
    'شرعية': 'immigration',
    'أسعار': 'prices',
    'ذهب': 'gold',
    'فضة': 'silver',
    'دولار': 'dollar',
    'اقتصاد': 'economy',
    'سياسة': 'politics',
    'انتخابات': 'elections',
    'صراع': 'conflict',
    'حرب': 'war',
    'سلام': 'peace',
    'تعليم': 'education',
    'صحة': 'health',
    'بيئة': 'environment',
    'تكنولوجيا': 'technology',
    'أمن': 'security',
    'ليبيا': 'Libya',
    'مصر': 'Egypt',
    'وقود': 'fuel',
    'دعم': 'subsidy',
    'رفع': 'lifting',
    'ارتفاع': 'rise',
    'انخفاض': 'decline'
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
