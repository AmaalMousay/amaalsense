/**
 * Layer 14: General Knowledge Base Layer
 * 
 * Provides static facts and background context that the LLM might miss or
 * hallucinate about. This ensures the engine grounds its emotional analysis
 * in actual geographic, political, and economic facts.
 */

interface Fact {
  topic: string;
  category: 'geography' | 'economy' | 'politics' | 'demographics';
  content: string;
  contentEn: string;
}

// A simple static knowledge base for core topics/countries.
// In production, this would query a real database or external API (like Wikipedia).
const STATIC_KNOWLEDGE: Fact[] = [
  {
    topic: 'ليبيا',
    category: 'economy',
    content: 'يعتمد اقتصاد ليبيا بشكل شبه كامل على قطاع النفط والغاز، الذي يمثل حوالي 95% من عائدات التصدير.',
    contentEn: 'Libya\'s economy depends almost entirely on the oil and gas sector, which accounts for about 95% of export earnings.'
  },
  {
    topic: 'الذهب',
    category: 'economy',
    content: 'يعتبر الذهب ملاذاً آمناً للمستثمرين في أوقات الأزمات الجيوسياسية والتضخم الاقتصادي.',
    contentEn: 'Gold is considered a safe haven for investors during times of geopolitical crises and economic inflation.'
  },
  {
    topic: 'النفط',
    category: 'economy',
    content: 'أسعار النفط تتأثر بشدة بقرارات منظمة أوبك بلس والتوترات الجيوسياسية في الشرق الأوسط.',
    contentEn: 'Oil prices are heavily influenced by OPEC+ decisions and geopolitical tensions in the Middle East.'
  }
];

export interface KnowledgeResult {
  hasKnowledge: boolean;
  facts: string[];
}

/**
 * Retrieves relevant background knowledge based on the topic and keywords.
 */
export async function retrieveBackgroundKnowledge(
  topic: string,
  keywords: string[],
  language: 'ar' | 'en' = 'ar'
): Promise<KnowledgeResult> {
  const facts: string[] = [];
  
  // Search in static knowledge
  for (const item of STATIC_KNOWLEDGE) {
    if (item.topic === topic || keywords.includes(item.topic)) {
      facts.push(language === 'ar' ? item.content : item.contentEn);
    }
  }

  // TODO: Implement external API fetching (e.g., Wikipedia API) for broader knowledge
  
  return {
    hasKnowledge: facts.length > 0,
    facts
  };
}

/**
 * Formats the facts into a context string to be injected into the LLM prompt.
 */
export function formatKnowledgeForPrompt(result: KnowledgeResult, language: 'ar' | 'en' = 'ar'): string {
  if (!result.hasKnowledge) return "";

  const header = language === 'ar' ? "معلومات عامة مرجعية (General Knowledge):" : "Reference General Knowledge:";
  return `\n${header}\n` + result.facts.map(f => `- ${f}`).join('\n') + '\n';
}
