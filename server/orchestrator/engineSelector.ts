/**
 * AMALSENSE UNIVERSAL ENGINE SELECTOR
 * المنسق الرئيسي الذي يربط الأخبار، العلوم، والذكاء الاصطناعي المجاني.
 */

import { buildRAGContext, formatRAGForPrompt } from '../knowledge/ragSystem';
import { createUniversalEventVector, generateUniversalPrompt } from '../engines/eventVectorEngine';
import { analyzeEventVectorWithUniversalModel } from '../utils/eventVectorReasoning';
import { tool_validateScientificFact } from '../agents/agentTools';

// ============================================
// 1. INTERFACES (إصلاح أخطاء التيرمينال)
// ============================================

export interface RealNewsItem {
  title: string;
  description: string;
  source: string;
  url?: string;
  publishedAt: Date;
}

export interface EngineResults {
  vector: any;
  reasoning: string;
  scienceContext: any[];
  executionTime: number;
  status: string;
  enginesUsed: string[];
  dcft?: { gmi: number; cfi: number; hri: number };
  emotion?: { dominantEmotion: string; emotions: Record<string, number> };
  meta?: { confidence: number };
  realNews?: {
    items: RealNewsItem[];
    topKeywords: string[];
    topSources: string[];
  };
}

// ============================================
// 2. MAIN EXECUTION
// ============================================

/**
 * تنفيذ المعالجة الشاملة: (بيانات -> متجه -> معرفة -> ذكاء اصطناعي)
 */
export async function executeEngines(
  intent: any,
  topic: string,
  country?: string,
  question?: string
): Promise<EngineResults> {
  const startTime = Date.now();
  console.log(`[EngineSelector] 🚀 Starting Universal Processing for: ${topic}`);

  try {
    // 1. جلب البيانات الخام (الأخبار والمصادر)
    const rawData = await fetchRealNewsData(topic, country, question);

    // 2. تحويل البيانات إلى "متجه حدث موسوعي" (Event Vector)
    const vector = createUniversalEventVector(rawData as any);

    // 3. استدعاء "الذاكرة الطويلة" RAG لجلب الحقائق العلمية المرتبطة
    const ragContext = buildRAGContext(topic); // تم تعديل النداء ليتوافق مع النوع المحدث
    const scienceInjection = formatRAGForPrompt(ragContext);

    // 4. التحقق العلمي (Evaluator Logic) - الطبقة 15/24
    const scientificCheck = await tool_validateScientificFact(topic, vector.dominantCategory);

    // 5. التفكير النهائي عبر المحرك المجاني
    const reasoning = await analyzeEventVectorWithUniversalModel(vector, 'ar');

    const executionTime = Date.now() - startTime;

    return {
      vector,
      reasoning,
      scienceContext: ragContext.scientificKnowledge,
      executionTime,
      status: scientificCheck.isValid ? 'Validated' : 'Needs Review',
      enginesUsed: ['news', 'dcft', 'rag', 'science'],
      dcft: {
        gmi: Math.round(vector.polarity * 100),
        cfi: Math.round((vector.emotions.fear + vector.emotions.anger) / 2 * 100),
        hri: Math.round((vector.emotions.hope + vector.emotions.joy) / 2 * 100),
      },
      emotion: {
        dominantEmotion: vector.dominantEmotion,
        emotions: vector.emotions,
      },
      meta: {
        confidence: 1 - vector.uncertainty,
      },
      realNews: { 
        items: rawData.items,
        topKeywords: vector.trendingKeywords || [],
        topSources: [...new Set(rawData.items.map(i => i.source))]
      }
    };

  } catch (error) {
    console.error('[EngineSelector] ❌ Critical Error in Universal Engine:', error);
    throw error;
  }
}

// ============================================
// 3. DATA COLLECTION (EXPORTED FOR RAG)
// ============================================

/**
 * دالة جلب الأخبار الحقيقية - يجب تصديرها لإصلاح أخطاء التيرمينال
 */
export async function fetchRealNewsData(
  topic: string,
  country?: string,
  question?: string
): Promise<{ items: RealNewsItem[] }> {
  try {
    // هنا نستخدم الخدمات المتوفرة في AmalSense لجلب البيانات
    const { searchGNews } = await import('../services/gnewsService');
    const articles = await searchGNews({ query: topic, country, max: 10 });

    return {
      items: articles.map((a: any) => ({
        title: a.title,
        description: a.description || '',
        source: a.source?.name || 'GNews',
        url: a.url,
        publishedAt: new Date(a.publishedAt)
      }))
    };
  } catch (error) {
    console.error('[EngineSelector] Error fetching real news:', error);
    return { items: [] };
  }
}

/**
 * تنسيق النتائج للذكاء الاصطناعي
 */
export function formatResultsForLLM(results: EngineResults): string {
  return `
[Engine Analysis Result]
Topic: ${results.vector?.query || 'Unknown'}
Status: ${results.status}
Reasoning: ${results.reasoning}

[Indicators]
GMI (Mood): ${results.dcft?.gmi || 0}
CFI (Fear): ${results.dcft?.cfi || 50}
HRI (Hope): ${results.dcft?.hri || 50}
Dominant Emotion: ${results.emotion?.dominantEmotion || 'Neutral'}

[News Context]
${results.realNews?.items.slice(0, 3).map(i => `- ${i.title} (${i.source})`).join('\n') || 'No recent news available.'}
  `;
}