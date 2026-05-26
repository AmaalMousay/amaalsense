/**
 * Autonomous Knowledge Researcher
 *
 * Reads public knowledge sources and stores compact knowledge chunks in the
 * AmalSense Knowledge Core. This agent is useful for expanding background
 * knowledge used by traders, researchers, journalists and decision makers.
 */

import { addEntry, storeKnowledgeObservation } from './vectorStore';

export const researcherState = {
  isReading: false,
  isContinuous: false,
  currentTopic: '',
  source: '',
  articlesRead: 0,
  lastRun: null as Date | null,
  error: null as string | null,
};

let continuousInterval: NodeJS.Timeout | null = null;

const DOMAINS = [
  'Trading',
  'Macroeconomics',
  'Market Microstructure',
  'Behavioral Finance',
  'Geopolitics',
  'Risk Management',
  'Journalism Verification',
  'Decision Science',
  'Social Psychology',
  'Energy Markets',
  'Monetary Policy',
  'Artificial Intelligence',
  'Statistics',
  'Law',
  'Public Health',
];

const ARXIV_CATEGORIES = ['q-fin', 'econ', 'cs.AI', 'stat.ML', 'physics.soc-ph'];

function chunkText(text: string, maxChunkLength: number = 1000): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if (current.length + sentence.length > maxChunkLength && current.length > 0) {
      chunks.push(current.trim());
      current = '';
    }
    current += `${sentence} `;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function fetchWikipediaArticle(): Promise<{ title: string; extract: string; url: string; domain: string } | null> {
  try {
    const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(domain)}&utf8=&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    const results = searchData.query?.search?.slice(0, 5) || [];
    if (results.length === 0) return null;

    const selected = results[Math.floor(Math.random() * results.length)];
    const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=false&explaintext=true&pageids=${selected.pageid}&origin=*`;
    const contentResponse = await fetch(contentUrl);
    const contentData = await contentResponse.json();
    const page = contentData.query?.pages?.[selected.pageid];
    if (!page?.extract || page.extract.length < 300) return null;
    return { title: page.title, extract: page.extract, url: `https://en.wikipedia.org/?curid=${selected.pageid}`, domain };
  } catch (error) {
    console.error('[AutonomousResearcher] Wikipedia fetch failed:', error);
    return null;
  }
}

async function fetchArxivArticle(): Promise<{ title: string; extract: string; url: string; domain: string } | null> {
  try {
    const category = ARXIV_CATEGORIES[Math.floor(Math.random() * ARXIV_CATEGORIES.length)];
    const url = `http://export.arxiv.org/api/query?search_query=cat:${category}&start=0&max_results=5&sortBy=lastUpdatedDate&sortOrder=desc`;
    const response = await fetch(url);
    const xml = await response.text();
    const entries = xml.split('<entry>').slice(1);
    if (entries.length === 0) return null;

    const entry = entries[Math.floor(Math.random() * entries.length)];
    const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/\n/g, ' ').trim();
    const summary = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.replace(/\n/g, ' ').trim();
    const articleUrl = entry.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.trim();
    if (!title || !summary || !articleUrl || summary.length < 300) return null;
    return { title, extract: summary, url: articleUrl, domain: category };
  } catch (error) {
    console.error('[AutonomousResearcher] arXiv fetch failed:', error);
    return null;
  }
}

async function fetchTargetedArticle(): Promise<{ title: string; extract: string; url: string; domain: string } | null> {
  if (Math.random() > 0.5) {
    const arxiv = await fetchArxivArticle();
    if (arxiv) {
      researcherState.source = 'arXiv';
      return arxiv;
    }
  }
  researcherState.source = 'Wikipedia';
  return fetchWikipediaArticle();
}

export async function triggerAutonomousResearch(): Promise<string> {
  if (researcherState.isReading) return 'Autonomous researcher is already running.';

  try {
    researcherState.isReading = true;
    researcherState.error = null;
    researcherState.currentTopic = 'Selecting research target';

    let article: { title: string; extract: string; url: string; domain: string } | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      article = await fetchTargetedArticle();
      if (article) break;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    if (!article) throw new Error('No suitable research article was found after multiple attempts.');

    researcherState.currentTopic = `${article.title} [${article.domain}]`;
    const chunks = chunkText(article.extract, 1000).slice(0, 5).filter(chunk => chunk.length >= 50);

    for (const chunk of chunks) {
      addEntry('scientific_rule', chunk, { topic: article.title, domain: article.domain, source: article.url, isAutonomous: true, timestamp: new Date() });
      storeKnowledgeObservation({
        sourceType: 'knowledge',
        sourceName: 'AutonomousResearcher',
        title: article.title,
        content: chunk,
        url: article.url,
        topic: article.title,
        eventType: 'autonomous_research',
        credibilityScore: article.url.includes('arxiv') ? 0.85 : 0.7,
        agentId: 'autonomous_researcher',
        agentNotes: [`Domain: ${article.domain}`],
      });
    }

    researcherState.articlesRead += 1;
    researcherState.lastRun = new Date();
    return `Autonomous researcher stored ${chunks.length} knowledge chunks from "${article.title}".`;
  } catch (error: any) {
    researcherState.error = error?.message || 'Unknown autonomous research error';
    return `Autonomous research failed: ${researcherState.error}`;
  } finally {
    researcherState.isReading = false;
  }
}

export function toggleContinuousReading(enable: boolean) {
  researcherState.isContinuous = enable;
  if (enable) {
    triggerAutonomousResearch();
    if (!continuousInterval) {
      continuousInterval = setInterval(() => {
        if (researcherState.isContinuous && !researcherState.isReading) triggerAutonomousResearch();
      }, 10 * 60 * 1000);
    }
  } else if (continuousInterval) {
    clearInterval(continuousInterval);
    continuousInterval = null;
  }
  return researcherState;
}
