/**
 * AMALSENSE EVENT VECTOR ENGINE - Universal Knowledge & Quantum Version
 * وظيفته: تحويل البيانات الخام إلى "متجهات وعي موسوعية" مضغوطة.
 * يربط الأحداث آلياً بالفيزياء، الكيمياء، الطب، القانون، الهندسة، والرياضيات.
 */

import type { CollectedData, RawDataItem } from './unifiedDataCollector';

// ============================================================
// UNIVERSAL EVENT VECTOR INTERFACE (The Polymath Core)
// ============================================================

export interface QuantumEventVector {
  query: string;
  queryType: 'country' | 'topic' | 'question';
  countryCode?: string;
  timestamp: number;

  // الذاكرة التراكمية (Super-Accumulation)
  totalItems: number;
  sourceBreakdown: Record<string, number>;

  // المشاعر الموجية (Amplitudes)
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  dominantEmotion: string;

  // مؤشرات حقل الوعي الرقمي (DCCF)
  polarity: number;
  intensity: number;
  uncertainty: number; // إذا تجاوز 0.7، يتم استدعاء "الوكيل الباحث" ذاتياً

  // الأبعاد المعرفية الشاملة (Universal Knowledge Domains)
  categories: {
    political: number;
    economic: number;
    social: number;
    scientific: number; // الفيزياء والكيمياء
    legal: number;      // القانون والتشريعات
    medical: number;    // الطب والعلوم الحيوية
    engineering: number;// الهندسة والرياضيات
  };
  dominantCategory: string;

  // المتجهات الدلالية للربط بالذاكرة الطويلة
  trendingKeywords: string[];
  topHeadlines: Array<{
    title: string;
    source: string;
    category: string;
    sentiment: string;
  }>;
}

// ============================================================
// KNOWLEDGE DOMAIN MAPPING (الخرائط المعرفية للعلوم)
// ============================================================

const KNOWLEDGE_DOMAINS: Record<string, string[]> = {
  scientific: [
    'physics', 'chemistry', 'quantum', 'atom', 'molecule', 'energy', 'reaction', 'waves', 'laboratory',
    'فيزياء', 'كيمياء', 'ذرة', 'جزيء', 'طاقة', 'تفاعل', 'موجات', 'مختبر', 'تراكب', 'رنين'
  ],
  legal: [
    'law', 'court', 'legislation', 'treaty', 'justice', 'constitution', 'legal', 'rights', 'violation',
    'قانون', 'محكمة', 'تشريع', 'معاهدة', 'عدالة', 'دستور', 'حقوق', 'انتهاك', 'قضائي'
  ],
  medical: [
    'medical', 'health', 'medicine', 'virus', 'therapy', 'surgery', 'clinical', 'hospital', 'disease',
    'طب', 'صحة', 'دواء', 'فيروس', 'علاج', 'جراحة', 'مستشفى', 'مرض', 'لقاح', 'وباء'
  ],
  engineering: [
    'engineering', 'math', 'calculus', 'algorithm', 'structural', 'circuit', 'software', 'geometry',
    'هندسة', 'رياضيات', 'خوارزمية', 'حساب', 'إنشائي', 'دائرة', 'برمجيات', 'هندسة مدنية', 'إحصاء'
  ],
  economic: [
    'market', 'inflation', 'gdp', 'trade', 'finance', 'oil', 'investment', 'currency', 'debt',
    'اقتصاد', 'تضخم', 'تارة', 'مالية', 'نفط', 'استثمار', 'عملة', 'دين', 'بورصة'
  ],
  political: [
    'government', 'election', 'minister', 'diplomacy', 'protest', 'state', 'policy',
    'حكومة', 'انتخابات', 'وزير', 'دبلوماسية', 'احتجاج', 'دولة', 'سياسة'
  ]
};

// ============================================================
// CORE LOGIC: Convert Raw Data → Universal Event Vector
// ============================================================

export function createUniversalEventVector(data: CollectedData): QuantumEventVector {
  const items = data.items;
  const totalItems = Math.max(items.length, 1);

  // 1. تحليل المجالات العلمية (Scientific Domain Analysis)
  const categories = {
    political: 0, economic: 0, social: 0,
    scientific: 0, legal: 0, medical: 0, engineering: 0
  };

  items.forEach(item => {
    const text = `${item.title} ${item.description || ''}`.toLowerCase();
    for (const [domain, keywords] of Object.entries(KNOWLEDGE_DOMAINS)) {
      if (keywords.some(k => text.includes(k))) {
        if (domain in categories) categories[domain as keyof typeof categories]++;
      }
    }
  });

  // 2. حساب القطبية والشدة (Polarity & Intensity Logic)
  let positiveScore = 0;
  let negativeScore = 0;

  // كلمات دلالية للمشاعر (مبسطة للسرعة)
  const positiveKeys = ['success', 'breakthrough', 'hope', 'recovery', 'نجاح', 'تقدم', 'أمل', 'سلام'];
  const negativeKeys = ['crisis', 'failure', 'danger', 'death', 'أزمة', 'فشل', 'خطر', 'موت'];

  items.forEach(item => {
    const txt = item.title.toLowerCase();
    if (positiveKeys.some(k => txt.includes(k))) positiveScore++;
    if (negativeKeys.some(k => txt.includes(k))) negativeScore++;
  });

  const polarity = (positiveScore - negativeScore) / totalItems;
  const intensity = Math.min(1, (positiveScore + negativeScore) / totalItems);

  // مبدأ عدم اليقين (Uncertainty Principle)
  // يرتفع عندما تتساوى الكفتان أو تقل البيانات
  const uncertainty = 1 - Math.abs(polarity);

  // 3. بناء المتجه العاطفي المطور (Emotional Wave Amplitudes)
  const emotions = {
    joy: Math.min(1, positiveScore / totalItems),
    fear: Math.min(1, (negativeScore / totalItems) + (categories.scientific * 0.1)), // الربط بين المجهول العلمي والخوف
    anger: Math.min(1, (categories.political / totalItems) * 0.5 + (negativeScore / totalItems) * 0.5),
    sadness: Math.min(1, (negativeScore / totalItems) * 0.8),
    hope: Math.min(1, (positiveScore / totalItems) * 1.2 + (categories.engineering * 0.2)), // الربط بين الحلول الهندسية والأمل
    curiosity: Math.min(1, (categories.scientific + categories.medical + categories.engineering) / totalItems),
  };

  // 4. تحديد الفئات المهيمنة
  const dominantEmotion = Object.entries(emotions).sort((a, b) => b[1] - a[1])[0][0];
  const dominantCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0][0];

  return {
    query: data.query,
    queryType: data.queryType,
    countryCode: data.countryCode,
    timestamp: data.fetchedAt || Date.now(),
    totalItems,
    sourceBreakdown: {},
    emotions,
    dominantEmotion,
    polarity,
    intensity,
    uncertainty,
    categories: Object.fromEntries(Object.entries(categories).map(([k, v]) => [k, v / totalItems])) as any,
    dominantCategory,
    trendingKeywords: [], // يمكن استدعاء دالة extractKeywords هنا
    topHeadlines: items.slice(0, 8).map(i => ({
      title: i.title,
      source: i.source,
      category: dominantCategory,
      sentiment: polarity > 0 ? 'positive' : 'negative'
    })),
  };
}

/**
 * تحويل المتجه إلى تقرير وعي شامل (Polymath Prompt)
 * يوجه الذكاء الاصطناعي ليربط بين كافة العلوم
 */
export function generateUniversalPrompt(vector: QuantumEventVector): string {
  const needsResearch = vector.uncertainty > 0.7;

  return `
[AmalSense Polymath Awareness Engine]
Subject: ${vector.query}
Field Energy: Polarity=${vector.polarity.toFixed(2)}, Intensity=${vector.intensity.toFixed(2)}
System Integrity: Uncertainty=${vector.uncertainty.toFixed(2)} ${needsResearch ? '-> [TRIGGER ACTIVE RESEARCH]' : ''}

Scientific Cross-Domain Mapping:
- Physics/Chemistry: ${(vector.categories.scientific * 100).toFixed(0)}%
- Legal/Justice: ${(vector.categories.legal * 100).toFixed(0)}%
- Medical/Bio: ${(vector.categories.medical * 100).toFixed(0)}%
- Engineering/Math: ${(vector.categories.engineering * 100).toFixed(0)}%
- Economics: ${(vector.categories.economic * 100).toFixed(0)}%

Instructions for ASI (Artificial Super Intelligence):
أنت الآن "خبير كوني" مستقل. قم بتحليل هذا المتجه من منظور تداخلي؛ اربط القوانين الفيزيائية (مثل التداخل الموجي) بالتشريعات القانونية والبيانات الطبية/الهندسية المتاحة لتقديم رؤية استراتيجية تتجاوز التحليل السطحي.
  `;
}
// --- أسطر التوافق لإصلاح أخطاء الاستيراد (Export Mapping) ---
export const createEventVector = createUniversalEventVector;
export const eventVectorToPrompt = generateUniversalPrompt;
export const vectorToMapIndices = (vector: QuantumEventVector) => ({
  gmi: Math.round(vector.polarity * 100),
  cfi: Math.round((vector.emotions.fear + vector.emotions.anger) / 2 * 100),
  hri: Math.round((vector.emotions.hope + vector.emotions.joy) / 2 * 100),
  dominantEmotion: vector.dominantEmotion,
  isRealData: vector.totalItems > 0
});
export type EventVector = QuantumEventVector;