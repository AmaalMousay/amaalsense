/**
 * AmalSense RAG System
 *
 * Retrieves relevant market, event-vector, scientific and historical memory from
 * the local Knowledge Core. It is used to ground natural responses for traders,
 * researchers, journalists and decision makers.
 */

import * as VectorStore from './vectorStore';
import type { EngineResults } from '../orchestrator/engineSelector';

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
  scientificKnowledge: Array<{
    domain: string;
    content: string;
    similarity: number;
  }>;
  relevantConversations: Array<{
    question: string;
    answer: string;
    similarity: number;
  }>;
  contextSummary: string;
}

export function buildRAGContext(
  query: string,
  options: {
    country?: string;
    maxResults?: number;
    includeAnalyses?: boolean;
    includeConversations?: boolean;
    includeKnowledge?: boolean;
  } = {}
): RAGContext {
  const { country, maxResults = 5 } = options;
  const includeAnalyses = options.includeAnalyses !== false;
  const includeConversations = options.includeConversations !== false;
  const includeKnowledge = options.includeKnowledge !== false;

  const context: RAGContext = { relevantAnalyses: [], scientificKnowledge: [], relevantConversations: [], contextSummary: '' };

  if (includeAnalyses) {
    const analysisResults = VectorStore.search(query, { type: 'analysis', country, topK: maxResults, minSimilarity: 0.25 });
    context.relevantAnalyses = analysisResults.map(result => ({
      topic: result.entry.metadata.topic || 'Unknown',
      country: result.entry.metadata.country,
      gmi: Number(result.entry.metadata.gmi || 0),
      cfi: Number(result.entry.metadata.cfi || 0),
      hri: Number(result.entry.metadata.hri || 0),
      emotionalState: String(result.entry.metadata.emotionalState || 'Unknown'),
      timestamp: new Date(result.entry.metadata.timestamp),
      similarity: result.similarity,
    }));
  }

  if (includeKnowledge) {
    const knowledgeResults = VectorStore.searchKnowledgeCore(query, { country, topK: maxResults, minSimilarity: 0.22 });
    context.scientificKnowledge = knowledgeResults.map(result => ({
      domain: String(result.entry.metadata.domain || result.entry.metadata.sourceType || 'Knowledge Core'),
      content: result.entry.content,
      similarity: result.similarity,
    }));
  }

  if (includeConversations) {
    const conversationResults = VectorStore.search(query, { type: 'conversation', topK: 3, minSimilarity: 0.4 });
    context.relevantConversations = conversationResults.map(result => {
      const content = result.entry.content;
      const question = content.match(/Question:\s*(.*)/)?.[1] || content.match(/Q:\s*(.*)/)?.[1] || '';
      const answer = content.match(/Answer:\s*(.*)/)?.[1] || content.match(/A:\s*(.*)/)?.[1] || '';
      return { question, answer, similarity: result.similarity };
    });
  }

  context.contextSummary = buildUniversalContextSummary(context);
  return context;
}

function buildUniversalContextSummary(context: RAGContext): string {
  const parts: string[] = [];

  if (context.scientificKnowledge.length > 0) {
    parts.push('KNOWLEDGE CORE:');
    for (const item of context.scientificKnowledge.slice(0, 5)) {
      parts.push(`[${item.domain}] ${item.content.slice(0, 320)}`);
    }
  }

  if (context.relevantAnalyses.length > 0) {
    parts.push('HISTORICAL EMOTIONAL FIELD:');
    for (const item of context.relevantAnalyses.slice(0, 3)) {
      parts.push(`${item.topic}${item.country ? ` (${item.country})` : ''}: GMI=${item.gmi}, CFI=${item.cfi}, HRI=${item.hri}, state=${item.emotionalState}`);
    }
  }

  if (context.relevantConversations.length > 0) {
    parts.push('RELATED PRIOR CONVERSATIONS:');
    for (const item of context.relevantConversations.slice(0, 2)) {
      parts.push(`Q: ${item.question} | A: ${item.answer}`.slice(0, 320));
    }
  }

  return parts.join('\n');
}

export function storeForRAG(topic: string, country: string | undefined, engineResults: EngineResults): void {
  if (!engineResults.vector) return;
  VectorStore.storeAnalysis(topic, country, {
    gmi: Number(engineResults.vector.polarity || 0) * 100,
    cfi: Number(engineResults.vector.emotions?.fear || 0) * 100,
    hri: Number(engineResults.vector.emotions?.hope || 0) * 100,
    emotionalState: engineResults.status || 'Analyzed',
    summary: engineResults.reasoning,
    eventVector: engineResults.vector,
  });
}

export function formatRAGForPrompt(context: RAGContext): string {
  if (!context.contextSummary) return '';
  return `\n=== AMALSENSE KNOWLEDGE CONTEXT ===\n${context.contextSummary}\n==================================\n`;
}

export function storeConversationForRAG(userId: string, question: string, answer: string, topic: string, country?: string): void {
  VectorStore.storeConversation(userId, question, answer, topic, country);
}
