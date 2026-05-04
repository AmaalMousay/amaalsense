/**
 * AMALSENSE UNIVERSAL ENGINE SELECTOR
 * المنسق الرئيسي الذي يربط الأخبار، العلوم، والذكاء الاصطناعي المجاني.
 */

import { buildRAGContext, formatRAGForPrompt } from '../knowledge/ragSystem';
import { createUniversalEventVector, generateUniversalPrompt } from '../eventVectorEngine';
import { analyzeEventVectorWithUniversalModel } from '../eventVectorReasoning';
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
  realNews?: {
    items: RealNewsItem[];
  };
}

// ============================================
// 2. MAIN EXECUTION
// ============================================

/**
 * تنفيذ المعالجة الشاملة: (بيانات -> متجه -> معرفة -> ذكاء اصطناعي)
 */
export async function executeUniversalEngine(
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
      realNews: { items: rawData.items }
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
    const { searchGNews } = await import('../gnewsService');
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