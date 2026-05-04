/**
 * AMALSENSE RAG SYSTEM - Universal Knowledge Edition
 * يقوم هذا النظام بتوسيع وعي الذكاء الاصطناعي عبر استرجاع القواعد العلمية
 */

// استيراد الدوال مع التأكد من مطابقة الأسماء في vectorStore
import * as VectorStore from './vectorStore';
import { EngineResults } from '../orchestrator/engineSelector';

// تطوير هيكل السياق ليشمل المجالات العلمية
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

/**
 * بناء سياق موسوعي شامل للاستعلام
 */
export function buildRAGContext(
  query: string,
  options: {
    country?: string;
    maxResults?: number;
  } = {}
): RAGContext {
  const { country, maxResults = 5 } = options;

  const context: RAGContext = {
    relevantAnalyses: [],
    scientificKnowledge: [],
    relevantConversations: [],
    contextSummary: '',
  };

  // 1. البحث في التحليلات التاريخية
  const analysisResults = VectorStore.search(query, {
    type: 'analysis',
    country,
    topK: maxResults,
    minSimilarity: 0.25,
  });

  context.relevantAnalyses = analysisResults.map((r: any) => ({
    topic: r.entry.metadata.topic || 'Unknown',
    country: r.entry.metadata.country,
    gmi: r.entry.metadata.gmi as number || 0,
    cfi: r.entry.metadata.cfi as number || 0,
    hri: r.entry.metadata.hri as number || 0,
    emotionalState: r.entry.metadata.emotionalState as string || 'Unknown',
    timestamp: new Date(r.entry.metadata.timestamp),
    similarity: r.similarity,
  }));

  // 2. البحث في قاعدة المعرفة العلمية
  const scientificResults = VectorStore.search(query, {
    type: 'knowledge',
    topK: maxResults,
    minSimilarity: 0.3,
  });

  context.scientificKnowledge = scientificResults.map((r: any) => ({
    domain: (r.entry.metadata.domain as string) || 'General Science',
    content: r.entry.content,
    similarity: r.similarity,
  }));

  // 3. البحث في المحادثات السابقة
  const conversationResults = VectorStore.search(query, {
    type: 'conversation',
    topK: 3,
    minSimilarity: 0.4,
  });

  context.relevantConversations = conversationResults.map((r: any) => {
    const lines = r.entry.content.split('\n');
    return {
      question: lines.find((l: string) => l.startsWith('Q:'))?.replace('Q:', '').trim() || '',
      answer: lines.find((l: string) => l.startsWith('A:'))?.replace('A:', '').trim() || '',
      similarity: r.similarity
    };
  });

  context.contextSummary = buildUniversalContextSummary(context);

  return context;
}

/**
 * ملخص العقل الموسوعي
 */
function buildUniversalContextSummary(context: RAGContext): string {
  const parts: string[] = [];

  if (context.scientificKnowledge.length > 0) {
    parts.push('🧪 UNIVERSAL KNOWLEDGE CORE (Physics, Law, Medicine):');
    context.scientificKnowledge.forEach(k => {
      parts.push(`[Domain: ${k.domain}] ${k.content.substring(0, 300)}...`);
    });
    parts.push('');
  }

  if (context.relevantAnalyses.length > 0) {
    parts.push('📊 HISTORICAL EMOTIONAL DATA:');
    context.relevantAnalyses.slice(0, 3).forEach(a => {
      parts.push(`- ${a.topic} (${a.country}): GMI=${a.gmi}, State=${a.emotionalState}`);
    });
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * تخزين النتائج للـ RAG المستقبلي
 * تم تصحيح الحقول لتتوافق مع EngineResults المطورة
 */
export function storeForRAG(
  topic: string,
  country: string | undefined,
  engineResults: EngineResults
): void {
  // استخدام "vector" بدلاً من "dcft" للتوافق مع المحرك الجديد
  if (engineResults.vector) {
    VectorStore.storeAnalysis(topic, country, {
      gmi: engineResults.vector.polarity * 100 || 0,
      cfi: (engineResults.vector.emotions?.fear || 0) * 100,
      hri: (engineResults.vector.emotions?.hope || 0) * 100,
      emotionalState: engineResults.status || 'Analyzed',
      summary: engineResults.reasoning
    });
  }
}

export function formatRAGForPrompt(context: RAGContext): string {
  if (!context.contextSummary) return '';
  return `\n=== AMALSENSE KNOWLEDGE CONTEXT ===\n${context.contextSummary}\n==================================\n`;
}