/**
 * Causal Explainability Layer
 * 
 * يربط المشاعر بأسباب واقعية ملموسة من البيانات
 * 
 * الفرق الجوهري:
 * - قبل: "الخوف مرتفع" (وصف نفسي)
 * - بعد: "الخوف مرتفع بسبب: ارتفاع الدولار، نقص السيولة" (ذكاء تحليلي)
 */

import { invokeLLMProvider, type LLMMessage } from './llmProvider';

export interface NewsItem {
  title: string;
  source?: string;
  date?: string;
  sentiment?: number;
}

export interface CausalAnalysis {
  primaryCauses: string[];
  economicFactors: string[];
  mediaFactors: string[];
  politicalFactors: string[];
  socialFactors: string[];
  keywordsDetected: string[];
  confidenceLevel: number;
  rawEvidence: string[];
}

// الكلمات المفتاحية المرتبطة بكل نوع من العوامل
const KEYWORD_CATEGORIES = {
  economic: {
    ar: ['دولار', 'سعر', 'غلاء', 'أسعار', 'سيولة', 'رواتب', 'معيشة', 'تضخم', 'بنك', 'صرف', 
         'اقتصاد', 'ميزانية', 'نفط', 'إيرادات', 'عجز', 'دين', 'قرض', 'فائدة', 'استثمار',
         'بطالة', 'وظائف', 'تجارة', 'استيراد', 'تصدير', 'جمارك', 'ضرائب'],
    en: ['dollar', 'price', 'inflation', 'economy', 'salary', 'bank', 'oil', 'budget', 
         'unemployment', 'trade', 'investment', 'debt', 'revenue']
  },
  media: {
    ar: ['أخبار', 'إعلام', 'تصريح', 'بيان', 'مؤتمر', 'صحفي', 'تقرير', 'تحقيق', 
         'مصادر', 'كشف', 'فضيحة', 'تسريب'],
    en: ['news', 'media', 'statement', 'report', 'press', 'leak', 'scandal']
  },
  political: {
    ar: ['سياسة', 'حكومة', 'برلمان', 'انتخابات', 'أزمة', 'صراع', 'وزير', 'رئيس',
         'قرار', 'قانون', 'تعيين', 'إقالة', 'اتفاق', 'مفاوضات', 'حوار', 'مصالحة',
         'انقسام', 'توحيد', 'شرعية', 'سلطة'],
    en: ['politics', 'government', 'parliament', 'election', 'crisis', 'minister', 
         'president', 'law', 'agreement', 'negotiation']
  },
  social: {
    ar: ['مجتمع', 'شعب', 'احتجاج', 'مظاهرة', 'إضراب', 'مواطن', 'خدمات', 'كهرباء',
         'ماء', 'صحة', 'تعليم', 'أمن', 'جريمة', 'حادث', 'كارثة'],
    en: ['society', 'protest', 'strike', 'citizen', 'services', 'electricity', 
         'water', 'health', 'education', 'security', 'crime']
  },
  security: {
    ar: ['أمن', 'عسكري', 'جيش', 'ميليشيا', 'سلاح', 'اشتباك', 'قتال', 'ضحايا',
         'إرهاب', 'تفجير', 'اغتيال', 'خطف', 'حرب'],
    en: ['security', 'military', 'army', 'militia', 'weapon', 'clash', 'terrorism',
         'bombing', 'war', 'casualties']
  }
};

// قوالب الأسباب لكل فئة
const CAUSE_TEMPLATES = {
  economic: {
    high_fear: [
      'تذبذب حاد في سعر الصرف',
      'ارتفاع ملحوظ في أسعار السلع الأساسية',
      'نقص السيولة النقدية في الأسواق',
      'تأخر صرف الرواتب والمستحقات',
      'تراجع القوة الشرائية للمواطنين',
      'مخاوف من انهيار اقتصادي'
    ],
    moderate_fear: [
      'عدم استقرار في الأسواق المالية',
      'قلق من ارتفاع الأسعار',
      'ترقب لقرارات اقتصادية مهمة'
    ],
    positive: [
      'استقرار نسبي في سعر الصرف',
      'تحسن في المؤشرات الاقتصادية',
      'توقعات بتحسن الوضع المعيشي'
    ]
  },
  media: {
    negative: [
      'كثافة الأخبار السلبية في الإعلام',
      'عناوين تحذيرية ومثيرة للقلق',
      'خطاب إعلامي متشائم',
      'تغطية مكثفة للأزمات والمشاكل',
      'انتشار الشائعات والأخبار غير الموثقة'
    ],
    neutral: [
      'تغطية إعلامية متوازنة',
      'متابعة إعلامية للتطورات'
    ],
    positive: [
      'تغطية إيجابية للإنجازات',
      'خطاب إعلامي متفائل'
    ]
  },
  political: {
    negative: [
      'انسداد سياسي مستمر',
      'غياب حلول واضحة للأزمة',
      'تصريحات متوترة بين الأطراف',
      'عدم استقرار مؤسسي',
      'صراعات داخلية على السلطة',
      'فشل المفاوضات والحوارات'
    ],
    neutral: [
      'ترقب لتطورات سياسية',
      'حوارات جارية بين الأطراف'
    ],
    positive: [
      'تقدم في المسار السياسي',
      'اتفاقات وتفاهمات جديدة',
      'استقرار مؤسسي نسبي'
    ]
  },
  social: {
    negative: [
      'قلق اجتماعي متزايد',
      'توتر في الشارع',
      'مخاوف معيشية حقيقية',
      'تدهور في الخدمات الأساسية',
      'ارتفاع معدلات الجريمة'
    ],
    neutral: [
      'ترقب اجتماعي للتطورات'
    ],
    positive: [
      'تحسن في الخدمات',
      'استقرار اجتماعي نسبي'
    ]
  }
};

/**
 * تحليل النص لاستخراج الكلمات المفتاحية
 */
export function extractKeywords(text: string): { category: string; keywords: string[] }[] {
  const results: { category: string; keywords: string[] }[] = [];
  const lowerText = text.toLowerCase();
  
  for (const [category, words] of Object.entries(KEYWORD_CATEGORIES)) {
    const found: string[] = [];
    
    // البحث في الكلمات العربية
    for (const word of words.ar) {
      if (text.includes(word)) {
        found.push(word);
      }
    }
    
    // البحث في الكلمات الإنجليزية
    for (const word of words.en) {
      if (lowerText.includes(word)) {
        found.push(word);
      }
    }
    
    if (found.length > 0) {
      results.push({ category, keywords: Array.from(new Set(found)) });
    }
  }
  
  return results;
}

/**
 * تحليل الأخبار لاستخراج الأسباب
 */
export function analyzeNewsForCauses(
  news: NewsItem[],
  gmi: number,
  cfi: number,
  hri: number
): CausalAnalysis {
  const analysis: CausalAnalysis = {
    primaryCauses: [],
    economicFactors: [],
    mediaFactors: [],
    politicalFactors: [],
    socialFactors: [],
    keywordsDetected: [],
    confidenceLevel: 0,
    rawEvidence: []
  };
  
  // جمع كل النصوص
  const allText = news.map(n => n.title).join(' ');
  
  // استخراج الكلمات المفتاحية
  const keywordResults = extractKeywords(allText);
  
  for (const result of keywordResults) {
    result.keywords.forEach(k => {
      if (!analysis.keywordsDetected.includes(k)) {
        analysis.keywordsDetected.push(k);
      }
    });
  }
  
  // تحديد مستوى الخطورة
  const fearLevel = cfi > 60 ? 'high_fear' : cfi > 40 ? 'moderate_fear' : 'positive';
  const sentimentLevel = gmi < -20 ? 'negative' : gmi > 20 ? 'positive' : 'neutral';
  
  // استخراج العوامل الاقتصادية
  const economicKeywords = keywordResults.find(r => r.category === 'economic');
  if (economicKeywords && economicKeywords.keywords.length > 0) {
    const templates = CAUSE_TEMPLATES.economic[fearLevel] || CAUSE_TEMPLATES.economic.moderate_fear;
    analysis.economicFactors = templates.slice(0, Math.min(3, templates.length));
    
    // إضافة أدلة خام
    news.forEach(n => {
      if (economicKeywords.keywords.some(k => n.title.includes(k))) {
        analysis.rawEvidence.push(n.title);
      }
    });
  }
  
  // استخراج العوامل الإعلامية
  const mediaKeywords = keywordResults.find(r => r.category === 'media');
  if (mediaKeywords || news.length > 0) {
    const templates = CAUSE_TEMPLATES.media[sentimentLevel] || CAUSE_TEMPLATES.media.neutral;
    analysis.mediaFactors = templates.slice(0, 2);
  }
  
  // استخراج العوامل السياسية
  const politicalKeywords = keywordResults.find(r => r.category === 'political');
  if (politicalKeywords && politicalKeywords.keywords.length > 0) {
    const templates = CAUSE_TEMPLATES.political[sentimentLevel] || CAUSE_TEMPLATES.political.neutral;
    analysis.politicalFactors = templates.slice(0, 2);
  }
  
  // استخراج العوامل الاجتماعية
  const socialKeywords = keywordResults.find(r => r.category === 'social');
  if (socialKeywords || cfi > 50) {
    const templates = CAUSE_TEMPLATES.social[sentimentLevel] || CAUSE_TEMPLATES.social.neutral;
    analysis.socialFactors = templates.slice(0, 2);
  }
  
  // تحديد الأسباب الرئيسية
  if (analysis.economicFactors.length > 0) {
    analysis.primaryCauses.push(...analysis.economicFactors.slice(0, 2));
  }
  if (analysis.politicalFactors.length > 0) {
    analysis.primaryCauses.push(analysis.politicalFactors[0]);
  }
  
  // حساب مستوى الثقة
  const totalFactors = analysis.economicFactors.length + analysis.mediaFactors.length +
                       analysis.politicalFactors.length + analysis.socialFactors.length;
  analysis.confidenceLevel = Math.min(90, 40 + (totalFactors * 10) + (analysis.rawEvidence.length * 5));
  
  return analysis;
}

/**
 * استخراج الأسباب باستخدام LLM (للحالات المعقدة)
 */
export async function extractCausesWithLLM(
  news: NewsItem[],
  topic: string,
  gmi: number,
  cfi: number
): Promise<string[]> {
  if (news.length === 0) {
    return [];
  }
  
  try {
    const newsText = news.slice(0, 10).map(n => `- ${n.title}`).join('\n');
    
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: `أنت محلل أسباب. استخرج 3-5 أسباب واقعية ملموسة من الأخبار التالية.

قواعد:
- كل سبب في سطر منفصل
- ابدأ كل سبب بـ "•"
- اذكر أسباب واقعية فقط (أحداث، قرارات، أرقام)
- لا تذكر مشاعر أو وصف نفسي
- اجعل كل سبب جملة قصيرة (5-10 كلمات)`
      },
      {
        role: 'user',
        content: `الموضوع: ${topic}
المزاج العام: ${gmi > 0 ? 'إيجابي' : gmi < 0 ? 'سلبي' : 'محايد'}
مستوى الخوف: ${cfi}%

الأخبار:
${newsText}

استخرج الأسباب الواقعية:`
      }
    ];
    
    const response = await invokeLLMProvider({
      messages,
      max_tokens: 300,
      temperature: 0.3
    });
    
    const causes = (response.content || '')
      .split('\n')
      .filter(line => line.trim().startsWith('•'))
      .map(line => line.replace('•', '').trim())
      .filter(line => line.length > 0);
    
    return causes;
  } catch (error) {
    console.error('[CausalExplainability] LLM extraction failed:', error);
    return [];
  }
}

/**
 * بناء فقرة "لماذا؟" الكاملة
 */
export function buildWhySection(analysis: CausalAnalysis): string {
  let section = '**لماذا هذا المزاج؟**\n\n';
  section += 'تم رصد هذا التوتر العاطفي بسبب:\n\n';
  
  if (analysis.economicFactors.length > 0) {
    section += '**عوامل اقتصادية:**\n';
    analysis.economicFactors.forEach(f => section += `• ${f}\n`);
    section += '\n';
  }
  
  if (analysis.mediaFactors.length > 0) {
    section += '**عوامل إعلامية:**\n';
    analysis.mediaFactors.forEach(f => section += `• ${f}\n`);
    section += '\n';
  }
  
  if (analysis.politicalFactors.length > 0) {
    section += '**عوامل سياسية:**\n';
    analysis.politicalFactors.forEach(f => section += `• ${f}\n`);
    section += '\n';
  }
  
  if (analysis.socialFactors.length > 0) {
    section += '**عوامل اجتماعية:**\n';
    analysis.socialFactors.forEach(f => section += `• ${f}\n`);
    section += '\n';
  }
  
  // إضافة الأدلة الخام إذا وجدت
  if (analysis.rawEvidence.length > 0) {
    section += '**أدلة من الأخبار:**\n';
    analysis.rawEvidence.slice(0, 3).forEach(e => section += `> "${e}"\n`);
  }
  
  return section;
}

export default {
  extractKeywords,
  analyzeNewsForCauses,
  extractCausesWithLLM,
  buildWhySection
};
