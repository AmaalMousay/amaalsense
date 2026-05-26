/**
 * Research & Academic Knowledge Service
 *
 * Connects AmalSense to real academic sources:
 *   - PubMed (medical / health research)
 *   - arXiv (physics, math, AI, computer science)
 *   - Open Library (books)
 *   - Google Books API
 *
 * This is the "Knowledge Layer" — it links news events to scientific research,
 * giving AmalSense the ability to explain WHY something matters beyond the headline.
 *
 * All sources are free, no API key required (except Google Books which is optional).
 */

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  source: 'PubMed' | 'arXiv' | 'OpenLibrary' | 'GoogleBooks';
  url: string;
  publishedDate: string;
  categories: string[];
  relevanceScore: number;
}

// ================================================================
// PubMed (National Library of Medicine)
// Largest medical research database, free API
// ================================================================

const PUBMED_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

/**
 * Search PubMed for medical / health research papers
 */
export async function searchPubMed(
  query: string,
  maxResults: number = 10,
): Promise<ResearchPaper[]> {
  try {
    // Step 1: Search for IDs
    const searchUrl = `${PUBMED_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json`;
    const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(10000) });
    if (!searchRes.ok) return [];
    const searchData = await searchRes.json();
    const ids: string[] = searchData?.esearchresult?.idlist || [];
    if (ids.length === 0) return [];

    // Step 2: Fetch details
    const fetchUrl = `${PUBMED_BASE}/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
    const fetchRes = await fetch(fetchUrl, { signal: AbortSignal.timeout(10000) });
    if (!fetchRes.ok) return [];
    const fetchData = await fetchRes.json();
    const results = fetchData?.result || {};

    return ids
      .map((id: string) => {
        const r = results[id];
        if (!r) return null;
        return {
          id: `pubmed_${id}`,
          title: r.title || '',
          authors: (r.authors || []).map((a: any) => a.name || ''),
          summary: r.source || r.elocationid || '',
          source: 'PubMed' as const,
          url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
          publishedDate: r.pubdate || '',
          categories: [(r.source || '').toLowerCase()],
          relevanceScore: 85,
        };
      })
      .filter(Boolean) as ResearchPaper[];
  } catch {
    return [];
  }
}

/**
 * Get papers related to a health/medical topic
 */
export async function searchMedicalResearch(
  topic: string,
  maxResults: number = 5,
): Promise<ResearchPaper[]> {
  return searchPubMed(topic, maxResults);
}

// ================================================================
// arXiv (Open access to 2M+ scholarly articles)
// Physics, Mathematics, Computer Science, Quantitative Biology, etc.
// ================================================================

const ARXIV_BASE = 'http://export.arxiv.org/api/query';

/**
 * Search arXiv for scientific papers
 */
export async function searchArXiv(
  query: string,
  maxResults: number = 10,
  category?: string,
): Promise<ResearchPaper[]> {
  try {
    const catFilter = category ? `+cat:${category}` : '';
    const url = `${ARXIV_BASE}?search_query=all:${encodeURIComponent(query)}${catFilter}&start=0&max_results=${maxResults}&sortBy=relevance&sortOrder=desc`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return [];
    const xml = await res.text();

    const entries = xml.split('<entry>').slice(1);
    return entries.slice(0, maxResults).map((entry: string) => {
      const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/\n/g, ' ').trim() || '';
      const summary = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.replace(/\n/g, ' ').trim() || '';
      const id = entry.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.trim() || '';
      const published = entry.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim() || '';
      const authorMatches = [...entry.matchAll(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g)];
      const authors = authorMatches.map((m) => m[1].trim());

      return {
        id: `arxiv_${id.split('/').pop() || title.slice(0, 20)}`,
        title,
        authors,
        summary: summary.slice(0, 800),
        source: 'arXiv' as const,
        url: id,
        publishedDate: published,
        categories: category ? [category] : [],
        relevanceScore: 80,
      };
    }).filter((p: ResearchPaper) => p.title);
  } catch {
    return [];
  }
}

// ================================================================
// Open Library (Free books database)
// ================================================================

const OPENLIB_BASE = 'https://openlibrary.org';

/**
 * Search Open Library for books
 */
export async function searchBooks(
  query: string,
  maxResults: number = 5,
): Promise<ResearchPaper[]> {
  try {
    const url = `${OPENLIB_BASE}/search.json?q=${encodeURIComponent(query)}&limit=${maxResults}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.docs || []).slice(0, maxResults).map((d: any) => ({
      id: `book_${d.key?.replace('/', '_') || d.title?.slice(0, 20)}`,
      title: d.title || '',
      authors: d.author_name || [],
      summary: d.first_sentence?.[0] || d.subject?.slice(0, 3)?.join(', ') || '',
      source: 'OpenLibrary' as const,
      url: `https://openlibrary.org${d.key || ''}`,
      publishedDate: d.first_publish_year?.toString() || '',
      categories: (d.subject || []).slice(0, 5),
      relevanceScore: 70,
    }));
  } catch {
    return [];
  }
}

// ================================================================
// Unified Search — all knowledge sources
// ================================================================

/**
 * Search ALL knowledge sources for a given topic
 * Returns combined results sorted by relevance
 */
export async function searchAllKnowledge(
  query: string,
  maxResults: number = 15,
): Promise<ResearchPaper[]> {
  const results = await Promise.allSettled([
    searchArXiv(query, Math.ceil(maxResults / 3)),
    searchPubMed(query, Math.ceil(maxResults / 3)),
    searchBooks(query, Math.ceil(maxResults / 3)),
  ]);

  const papers: ResearchPaper[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') papers.push(...r.value);
  }

  return papers.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, maxResults);
}

// ================================================================
// Convert to RawDataItem for the unified data pipeline
// ================================================================

export function paperToRawDataItem(
  paper: ResearchPaper,
): import('./unifiedDataCollector').RawDataItem | null {
  if (!paper.title) return null;
  return {
    id: paper.id,
    timestamp: new Date(paper.publishedDate || Date.now()).getTime(),
    title: paper.title,
    description: paper.summary.slice(0, 500),
    source: paper.source,
    sourceType: 'analysis',
    platform: paper.source,
    url: paper.url,
    publishedAt: paper.publishedDate || new Date().toISOString(),
    language: 'en',
    region: 'global',
    topic: 'other',
    intensity: paper.relevanceScore / 100,
    trustScore: paper.source === 'PubMed' ? 95 : paper.source === 'arXiv' ? 85 : 70,
  };
}
