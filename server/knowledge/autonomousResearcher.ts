/**
 * Autonomous Knowledge Researcher
 *
 * Reads public knowledge sources and stores compact knowledge chunks in the
 * AmalSense Knowledge Core. This agent is useful for expanding background
 * knowledge used by traders, researchers, journalists and decision makers.
 */

import { addEntry, storeKnowledgeObservation } from './vectorStore';
import { searchArXiv, searchPubMed } from '../services/researchService';

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
  'Artificial Intelligence',
  'Machine Learning',
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

async function fetchFromResearch(): Promise<{ title: string; extract: string; url: string; domain: string } | null> {
  try {
    const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    // Try arXiv first (scientific papers)
    const arxivResults = await searchArXiv(domain, 3);
    if (arxivResults.length > 0) {
      const paper = arxivResults[0];
      return { title: paper.title, extract: paper.summary, url: paper.url, domain };
    }
    // Fallback to PubMed
    const pubmedResults = await searchPubMed(domain, 3);
    if (pubmedResults.length > 0) {
      const paper = pubmedResults[0];
      return { title: paper.title, extract: paper.summary, url: paper.url, domain: 'Medical' };
    }
    return null;
  } catch (error) {
    console.error('[AutonomousResearcher] Research fetch failed:', error);
    return null;
  }
}

async function fetchArxivArticle(): Promise<{ title: string; extract: string; url: string; domain: string } | null> {
  return fetchFromResearch();
}

async function fetchTargetedArticle(): Promise<{ title: string; extract: string; url: string; domain: string } | null> {
  if (Math.random() > 0.5) {
    // Use research service directly
    const arxiv = await fetchFromResearch();
    if (arxiv) {
      researcherState.source = 'arXiv';
      return arxiv;
    }
  }
  researcherState.source = 'None';
  return null;
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
