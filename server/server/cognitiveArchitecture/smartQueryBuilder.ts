/**
 * Smart Query Builder
 *
 * Converts user questions into concise search queries. This layer helps the data
 * collectors decide what to look for, but it does not fetch data and it does not
 * write responses.
 */

import { smartJsonChat } from '../_core/llm';

export interface SmartQuery {
  primaryTerms: string[];
  secondaryTerms: string[];
  country?: string;
  language: 'ar' | 'en' | 'both';
  searchQueries: {
    arabic: string[];
    english: string[];
  };
  domain: string;
}

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  trading: ['gold', 'oil', 'forex', 'crypto', 'market', 'trading', 'bitcoin', 'dollar'],
  economy: ['economy', 'inflation', 'rates', 'currency', 'gdp', 'jobs', 'bank'],
  politics: ['government', 'election', 'policy', 'parliament', 'minister', 'security'],
  society: ['society', 'public', 'services', 'protest', 'community', 'living'],
  health: ['health', 'hospital', 'virus', 'disease', 'medicine'],
  technology: ['technology', 'ai', 'software', 'digital', 'cyber'],
};

const COUNTRY_KEYWORDS: Record<string, string[]> = {
  Libya: ['libya', 'tripoli', 'benghazi'],
  Egypt: ['egypt', 'cairo'],
  'Saudi Arabia': ['saudi', 'riyadh'],
  UAE: ['uae', 'dubai', 'abu dhabi'],
  USA: ['usa', 'america', 'united states'],
  Global: ['global', 'world', 'international'],
};

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[\p{L}\p{N}_]+/gu) || []).filter(token => token.length > 2);
}

function detectDomain(text: string): string {
  const lower = text.toLowerCase();
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    if (keywords.some(keyword => lower.includes(keyword))) return domain;
  }
  return 'general';
}

function detectCountry(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const [country, keywords] of Object.entries(COUNTRY_KEYWORDS)) {
    if (keywords.some(keyword => lower.includes(keyword))) return country === 'Global' ? undefined : country;
  }
  return undefined;
}

function buildQueries(primary: string[], secondary: string[], country?: string): string[] {
  const base = primary.length ? primary.join(' ') : secondary.join(' ');
  const queries = [base, country ? `${base} ${country}` : '', primary[0] && secondary[0] ? `${primary[0]} ${secondary[0]}` : ''];
  return queries.map(query => query.trim()).filter(Boolean);
}

function fallbackQuery(question: string): SmartQuery {
  const tokens = tokenize(question);
  const country = detectCountry(question);
  const domain = detectDomain(question);
  const primaryTerms = tokens.slice(0, 4);
  const secondaryTerms = tokens.slice(4, 8);
  const english = buildQueries(primaryTerms, secondaryTerms, country);
  return { primaryTerms, secondaryTerms, country, language: 'both', searchQueries: { arabic: [], english }, domain };
}

export async function buildSmartQuery(question: string): Promise<SmartQuery> {
  try {
    const extracted = await smartJsonChat(
      'Extract concise search terms from the question. Return JSON with primaryTerms, secondaryTerms, country, domain, and englishTerms. Use English search terms only.',
      question,
      'question_understanding'
    );

    const primaryTerms = Array.isArray(extracted.primaryTerms) ? extracted.primaryTerms.map(String).slice(0, 5) : [];
    const secondaryTerms = Array.isArray(extracted.secondaryTerms) ? extracted.secondaryTerms.map(String).slice(0, 5) : [];
    const englishTerms = Array.isArray(extracted.englishTerms) ? extracted.englishTerms.map(String).slice(0, 6) : primaryTerms;
    const country = typeof extracted.country === 'string' && extracted.country.trim() ? extracted.country.trim() : detectCountry(question);
    const domain = typeof extracted.domain === 'string' ? extracted.domain : detectDomain(question);
    const english = buildQueries(englishTerms.length ? englishTerms : primaryTerms, secondaryTerms, country);
    if (english.length === 0) return fallbackQuery(question);

    return { primaryTerms, secondaryTerms, country, language: 'both', searchQueries: { arabic: [], english }, domain };
  } catch {
    return fallbackQuery(question);
  }
}

export function filterRelevantNews<T extends { title: string; description?: string }>(news: T[], query: SmartQuery, minScore: number = 0.2): T[] {
  const terms = [...query.primaryTerms, ...query.secondaryTerms].map(term => term.toLowerCase());
  if (terms.length === 0) return news;

  return news
    .map(item => {
      const text = `${item.title} ${item.description || ''}`.toLowerCase();
      const score = terms.filter(term => text.includes(term)).length / terms.length;
      return { item, score };
    })
    .filter(result => result.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .map(result => result.item);
}
