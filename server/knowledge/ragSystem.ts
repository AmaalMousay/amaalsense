/**
 * RAG System (Retrieval Augmented Generation)
 * 
 * This system enhances LLM responses by:
 * 1. Retrieving relevant past analyses
 * 2. Finding similar questions/answers
 * 3. Injecting context into prompts
 * 
 * The result: LLM answers based on YOUR data, not its training data.
 */

import { search, storeAnalysis, storeConversation, getRecentAnalyses, type SearchResult } from './vectorStore';
import type { EngineResults } from '../orchestrator/engineSelector';

// RAG context for LLM
export interface RAGContext {
  relevantAnalyses: Array<{
    topic: string;
    country?: string;
    gmi: number;
    cfi: number;
    hri: number;
    emotionalState: string;
    timestamp: Date;
    similarity: number;
  }>;
  relevantConversations: Array<{
    question: string;
    answer: string;
    similarity: number;
  }>;
  knowledgeBase: Array<{
    content: string;
    similarity: number;
  }>;
  contextSummary: string;
}

/**
 * Build RAG context for a query
 */
export function buildRAGContext(
  query: string,
  options: {
    country?: string;
    includeAnalyses?: boolean;
    includeConversations?: boolean;
    includeKnowledge?: boolean;
    maxResults?: number;
  } = {}
): RAGContext {
  const {
    country,
    includeAnalyses = true,
    includeConversations = true,
    includeKnowledge = true,
    maxResults = 5,
  } = options;
  
  const context: RAGContext = {
    relevantAnalyses: [],
    relevantConversations: [],
    knowledgeBase: [],
    contextSummary: '',
  };
  
  // Search for relevant analyses
  if (includeAnalyses) {
    const analysisResults = search(query, {
      type: 'analysis',
      country,
      topK: maxResults,
      minSimilarity: 0.2,
    });
    
    context.relevantAnalyses = analysisResults.map(r => ({
      topic: r.entry.metadata.topic || 'Unknown',
      country: r.entry.metadata.country,
      gmi: r.entry.metadata.gmi as number || 0,
      cfi: r.entry.metadata.cfi as number || 0,
      hri: r.entry.metadata.hri as number || 0,
      emotionalState: r.entry.metadata.emotionalState as string || 'Unknown',
      timestamp: new Date(r.entry.metadata.timestamp),
      similarity: r.similarity,
    }));
  }
  
  // Search for relevant conversations
  if (includeConversations) {
    const conversationResults = search(query, {
      type: 'conversation',
      topK: maxResults,
      minSimilarity: 0.3,
    });
    
    context.relevantConversations = conversationResults.map(r => {
      const lines = r.entry.content.split('\n');
      const question = lines.find(l => l.startsWith('Q:'))?.replace('Q:', '').trim() || '';
      const answer = lines.find(l => l.startsWith('A:'))?.replace('A:', '').trim() || '';
      return { question, answer, similarity: r.similarity };
    });
  }
  
  // Search knowledge base
  if (includeKnowledge) {
    const knowledgeResults = search(query, {
      type: 'knowledge',
      topK: maxResults,
      minSimilarity: 0.2,
    });
    
    context.knowledgeBase = knowledgeResults.map(r => ({
      content: r.entry.content,
      similarity: r.similarity,
    }));
  }
  
  // Build context summary
  context.contextSummary = buildContextSummary(context);
  
  return context;
}

/**
 * Build a summary of the RAG context for LLM
 */
function buildContextSummary(context: RAGContext): string {
  const parts: string[] = [];
  
  if (context.relevantAnalyses.length > 0) {
    parts.push('RELEVANT PAST ANALYSES:');
    for (const analysis of context.relevantAnalyses.slice(0, 3)) {
      const date = analysis.timestamp.toISOString().split('T')[0];
      parts.push(`- ${analysis.topic} (${analysis.country || 'Global'}, ${date}): GMI=${analysis.gmi}, CFI=${analysis.cfi}, State=${analysis.emotionalState}`);
    }
    parts.push('');
  }
  
  if (context.knowledgeBase.length > 0) {
    parts.push('RELEVANT KNOWLEDGE:');
    for (const knowledge of context.knowledgeBase.slice(0, 2)) {
      parts.push(knowledge.content.split('\n').slice(0, 3).join(' '));
    }
    parts.push('');
  }
  
  if (context.relevantConversations.length > 0) {
    parts.push('SIMILAR PAST QUESTIONS:');
    for (const conv of context.relevantConversations.slice(0, 2)) {
      parts.push(`Q: ${conv.question.substring(0, 100)}...`);
      parts.push(`A: ${conv.answer.substring(0, 150)}...`);
    }
  }
  
  return parts.join('\n');
}

/**
 * Store analysis results for future RAG
 */
export function storeForRAG(
  topic: string,
  country: string | undefined,
  engineResults: EngineResults
): void {
  if (engineResults.dcft) {
    storeAnalysis(topic, country, {
      gmi: engineResults.dcft.gmi,
      cfi: engineResults.dcft.cfi,
      hri: engineResults.dcft.hri,
      emotionalState: engineResults.dcft.emotionalState,
      summary: engineResults.meta?.interpretation,
    });
  }
}

/**
 * Store conversation for future RAG
 */
export function storeConversationForRAG(
  userId: string,
  question: string,
  answer: string,
  topic?: string,
  country?: string
): void {
  storeConversation(userId, question, answer, topic, country);
}

/**
 * Format RAG context for LLM prompt
 */
export function formatRAGForPrompt(context: RAGContext): string {
  if (!context.contextSummary) {
    return '';
  }
  
  return `
=== HISTORICAL CONTEXT (from AmalSense database) ===
${context.contextSummary}
=== END HISTORICAL CONTEXT ===

Use this historical context to provide more accurate and grounded responses.
If the historical data is relevant, reference it in your answer.
`;
}

/**
 * Get trend analysis from historical data
 */
export function getTrendFromHistory(
  country: string,
  days: number = 7
): {
  trend: 'improving' | 'stable' | 'declining';
  averageGMI: number;
  averageCFI: number;
  dataPoints: number;
} | null {
  const analyses = getRecentAnalyses(country, 20);
  
  if (analyses.length < 2) {
    return null;
  }
  
  // Filter by date range
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const recentAnalyses = analyses.filter(a => 
    new Date(a.metadata.timestamp) >= cutoffDate
  );
  
  if (recentAnalyses.length < 2) {
    return null;
  }
  
  // Calculate averages
  const gmiValues = recentAnalyses.map(a => a.metadata.gmi as number || 0);
  const cfiValues = recentAnalyses.map(a => a.metadata.cfi as number || 0);
  
  const averageGMI = gmiValues.reduce((a, b) => a + b, 0) / gmiValues.length;
  const averageCFI = cfiValues.reduce((a, b) => a + b, 0) / cfiValues.length;
  
  // Determine trend (compare first half to second half)
  const midpoint = Math.floor(gmiValues.length / 2);
  const firstHalfGMI = gmiValues.slice(0, midpoint).reduce((a, b) => a + b, 0) / midpoint;
  const secondHalfGMI = gmiValues.slice(midpoint).reduce((a, b) => a + b, 0) / (gmiValues.length - midpoint);
  
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  const change = secondHalfGMI - firstHalfGMI;
  if (change > 5) trend = 'improving';
  else if (change < -5) trend = 'declining';
  
  return {
    trend,
    averageGMI: Math.round(averageGMI * 10) / 10,
    averageCFI: Math.round(averageCFI * 10) / 10,
    dataPoints: recentAnalyses.length,
  };
}
