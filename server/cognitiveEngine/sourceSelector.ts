/**
 * Source Selector
 * 
 * This layer decides WHERE to look for information based on the question.
 * It's like a librarian who knows exactly which shelf has the answer.
 * 
 * Philosophy:
 * - Not all questions need all data
 * - The right source depends on the question type
 * - Quality over quantity - only fetch what's relevant
 */

import { type DeepQuestion, type SourceType } from './questionUnderstanding';

// Data from each source
export interface SourceData {
  emotionIndicators?: EmotionIndicators;
  economicData?: EconomicDataPacket;
  news?: NewsPacket;
  historicalData?: HistoricalPacket;
  expertKnowledge?: ExpertKnowledgePacket;
  comparisonData?: ComparisonPacket;
  scenarioModels?: ScenarioPacket;
}

// Emotion indicators from DCFT engine
export interface EmotionIndicators {
  gmi: number;           // General Mood Index (0-100)
  cfi: number;           // Collective Fear Index (0-100)
  hri: number;           // Hope-Resilience Index (0-100)
  dominantEmotion: string;
  emotionBreakdown: Record<string, number>;
  trend: 'rising' | 'falling' | 'stable';
  confidence: number;
}

// Economic data packet
export interface EconomicDataPacket {
  currencies: Array<{
    code: string;
    name: string;
    rate: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  commodities: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  indices?: Array<{
    symbol: string;
    name: string;
    value: number;
    change: number;
  }>;
  relevantTo: string; // Which topic this data is relevant to
}

// News packet
export interface NewsPacket {
  headlines: Array<{
    title: string;
    source: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    relevance: number; // 0-1
    timestamp: Date;
  }>;
  summary: string;
  mainThemes: string[];
  impactAssessment: 'high' | 'medium' | 'low';
}

// Historical data packet
export interface HistoricalPacket {
  dataPoints: Array<{
    date: Date;
    value: number;
    event?: string;
  }>;
  trend: 'bullish' | 'bearish' | 'sideways';
  volatility: 'high' | 'medium' | 'low';
  keyLevels: {
    support: number[];
    resistance: number[];
  };
  patterns: string[];
}

// Expert knowledge packet
export interface ExpertKnowledgePacket {
  insights: Array<{
    insight: string;
    confidence: number;
    source: string;
  }>;
  riskFactors: string[];
  opportunities: string[];
  recommendations: string[];
}

// Comparison data packet
export interface ComparisonPacket {
  items: Array<{
    name: string;
    metrics: Record<string, number | string>;
    pros: string[];
    cons: string[];
    score: number;
  }>;
  winner?: string;
  criteria: string[];
}

// Scenario models packet
export interface ScenarioPacket {
  scenarios: Array<{
    name: string;
    description: string;
    probability: number;
    impact: 'positive' | 'negative' | 'neutral';
    triggers: string[];
    outcomes: string[];
  }>;
  baseCase: string;
  recommendation: string;
}

/**
 * Select and fetch data from required sources
 */
export async function selectAndFetchSources(
  question: DeepQuestion,
  existingData?: Partial<SourceData>
): Promise<SourceData> {
  const { requiredSources, surface, deep } = question;
  const result: SourceData = {};
  
  // Fetch from each required source
  for (const source of requiredSources) {
    switch (source) {
      case 'emotion_indicators':
        result.emotionIndicators = existingData?.emotionIndicators || 
          await fetchEmotionIndicators(surface.topic);
        break;
        
      case 'economic_data':
        result.economicData = existingData?.economicData ||
          await fetchEconomicData(surface.topic);
        break;
        
      case 'news':
        result.news = await fetchNews(surface.topic, surface.keywords);
        break;
        
      case 'historical':
        result.historicalData = await fetchHistoricalData(surface.topic);
        break;
        
      case 'expert_knowledge':
        result.expertKnowledge = generateExpertKnowledge(surface.topic, deep.realIntent);
        break;
        
      case 'comparison_data':
        result.comparisonData = generateComparisonData(surface.topic, surface.keywords);
        break;
        
      case 'scenario_models':
        result.scenarioModels = generateScenarios(surface.topic, result.emotionIndicators);
        break;
    }
  }
  
  return result;
}

/**
 * Fetch emotion indicators (from existing DCFT engine)
 */
async function fetchEmotionIndicators(topic: string): Promise<EmotionIndicators> {
  // This would integrate with existing DCFT engine
  // For now, return structured placeholder
  return {
    gmi: 45,
    cfi: 62,
    hri: 55,
    dominantEmotion: 'الترقب',
    emotionBreakdown: {
      'الخوف': 25,
      'الأمل': 20,
      'الترقب': 30,
      'القلق': 15,
      'التفاؤل': 10
    },
    trend: 'stable',
    confidence: 0.75
  };
}

/**
 * Fetch economic data (from existing economic service)
 */
async function fetchEconomicData(topic: string): Promise<EconomicDataPacket> {
  // This would integrate with existing economic data service
  // For now, return structured placeholder
  return {
    currencies: [
      { code: 'USD', name: 'الدولار الأمريكي', rate: 1.00, change: 0.0, trend: 'stable' },
      { code: 'EUR', name: 'اليورو', rate: 0.92, change: -0.2, trend: 'down' },
    ],
    commodities: [
      { symbol: 'XAU', name: 'الذهب', price: 2650, change: -1.5, trend: 'down' },
      { symbol: 'XAG', name: 'الفضة', price: 31.50, change: -2.1, trend: 'down' },
    ],
    relevantTo: topic
  };
}

/**
 * Fetch relevant news
 */
async function fetchNews(topic: string, keywords: string[]): Promise<NewsPacket> {
  // This would integrate with news APIs
  // For now, generate contextual news based on topic
  const newsTemplates: Record<string, NewsPacket> = {
    'الذهب': {
      headlines: [
        { title: 'الفيدرالي يلمح لاستمرار رفع الفائدة', source: 'رويترز', sentiment: 'negative', relevance: 0.9, timestamp: new Date() },
        { title: 'الدولار يواصل قوته أمام العملات الرئيسية', source: 'بلومبرج', sentiment: 'negative', relevance: 0.85, timestamp: new Date() },
        { title: 'محللون: الذهب قد يجد دعماً عند مستويات 2600', source: 'CNBC', sentiment: 'neutral', relevance: 0.8, timestamp: new Date() },
      ],
      summary: 'الأسواق تترقب قرارات الفيدرالي مع استمرار الضغط على المعادن الثمينة',
      mainThemes: ['الفائدة', 'الدولار', 'التضخم'],
      impactAssessment: 'high'
    },
    'الفضة': {
      headlines: [
        { title: 'تباطؤ الطلب الصناعي يضغط على الفضة', source: 'رويترز', sentiment: 'negative', relevance: 0.9, timestamp: new Date() },
        { title: 'قطاع الطاقة الشمسية يواجه تحديات في الصين', source: 'بلومبرج', sentiment: 'negative', relevance: 0.8, timestamp: new Date() },
      ],
      summary: 'الفضة تتأثر بتباطؤ الطلب الصناعي وقوة الدولار',
      mainThemes: ['الطلب الصناعي', 'الطاقة الشمسية', 'الصين'],
      impactAssessment: 'medium'
    },
    'الدولار': {
      headlines: [
        { title: 'الدولار يصعد لأعلى مستوى في 3 أشهر', source: 'رويترز', sentiment: 'positive', relevance: 0.95, timestamp: new Date() },
        { title: 'توقعات برفع الفائدة الأمريكية مرة أخرى', source: 'CNBC', sentiment: 'positive', relevance: 0.9, timestamp: new Date() },
      ],
      summary: 'الدولار يستفيد من توقعات استمرار التشديد النقدي',
      mainThemes: ['الفائدة', 'الفيدرالي', 'التضخم'],
      impactAssessment: 'high'
    },
    'الإعلام': {
      headlines: [
        { title: 'دراسة: وسائل التواصل تضخم المخاوف الاقتصادية', source: 'BBC', sentiment: 'negative', relevance: 0.9, timestamp: new Date() },
        { title: 'خبراء: الإعلام يلعب دوراً في تشكيل توقعات السوق', source: 'الجزيرة', sentiment: 'neutral', relevance: 0.85, timestamp: new Date() },
      ],
      summary: 'الإعلام يؤثر بشكل كبير على المشاعر الجماعية والقرارات الاقتصادية',
      mainThemes: ['التأثير النفسي', 'التضخيم الإعلامي', 'صناعة الرأي'],
      impactAssessment: 'medium'
    }
  };
  
  // Find matching news or generate generic
  for (const [key, news] of Object.entries(newsTemplates)) {
    if (topic.includes(key)) {
      return news;
    }
  }
  
  // Generic news
  return {
    headlines: [
      { title: `تطورات جديدة في ${topic}`, source: 'وكالات', sentiment: 'neutral', relevance: 0.7, timestamp: new Date() },
    ],
    summary: `الأسواق تتابع التطورات المتعلقة بـ ${topic}`,
    mainThemes: [topic],
    impactAssessment: 'medium'
  };
}

/**
 * Fetch historical data
 */
async function fetchHistoricalData(topic: string): Promise<HistoricalPacket> {
  // This would integrate with historical data APIs
  return {
    dataPoints: [],
    trend: 'sideways',
    volatility: 'medium',
    keyLevels: {
      support: [],
      resistance: []
    },
    patterns: []
  };
}

/**
 * Generate expert knowledge based on topic
 */
function generateExpertKnowledge(topic: string, intent: string): ExpertKnowledgePacket {
  const knowledgeBase: Record<string, ExpertKnowledgePacket> = {
    'الذهب': {
      insights: [
        { insight: 'الذهب يتحرك عكسياً مع الدولار في 80% من الحالات', confidence: 0.9, source: 'تحليل تاريخي' },
        { insight: 'رفع الفائدة يضغط على الذهب لأنه لا يدر عائداً', confidence: 0.95, source: 'نظرية اقتصادية' },
        { insight: 'الذهب ملاذ آمن في أوقات عدم اليقين الجيوسياسي', confidence: 0.85, source: 'سلوك تاريخي' },
      ],
      riskFactors: [
        'استمرار رفع الفائدة الأمريكية',
        'قوة الدولار المستمرة',
        'تراجع التضخم'
      ],
      opportunities: [
        'مستويات دعم قوية تاريخياً',
        'الطلب الآسيوي على الذهب',
        'عدم اليقين الجيوسياسي'
      ],
      recommendations: [
        'المراقبة والانتظار لإشارات أوضح',
        'الدخول التدريجي عند مستويات الدعم',
        'تنويع المحفظة'
      ]
    },
    'الإعلام': {
      insights: [
        { insight: 'الإعلام يضخم المشاعر الجماعية بنسبة 40-60% عن الواقع', confidence: 0.8, source: 'دراسات نفسية' },
        { insight: 'العناوين السلبية تنتشر أسرع بـ 6 مرات من الإيجابية', confidence: 0.85, source: 'تحليل سلوكي' },
        { insight: 'التعرض المستمر للأخبار يزيد القلق بنسبة 30%', confidence: 0.75, source: 'أبحاث نفسية' },
      ],
      riskFactors: [
        'التضخيم الإعلامي للأزمات',
        'انتشار المعلومات المضللة',
        'تأثير غرف الصدى'
      ],
      opportunities: [
        'فهم التأثير الإعلامي يمنح ميزة تحليلية',
        'التمييز بين الضجيج والإشارة الحقيقية',
        'استخدام المشاعر الجماعية كمؤشر معاكس'
      ],
      recommendations: [
        'تنويع مصادر المعلومات',
        'التحقق من الأخبار قبل التفاعل',
        'فصل المشاعر عن القرارات'
      ]
    }
  };
  
  // Find matching knowledge
  for (const [key, knowledge] of Object.entries(knowledgeBase)) {
    if (topic.includes(key)) {
      return knowledge;
    }
  }
  
  // Generic knowledge
  return {
    insights: [
      { insight: `${topic} يتأثر بعوامل متعددة محلية وعالمية`, confidence: 0.7, source: 'تحليل عام' },
    ],
    riskFactors: ['عدم اليقين العام', 'التقلبات السوقية'],
    opportunities: ['فرص التعلم والفهم'],
    recommendations: ['البحث والتعمق قبل اتخاذ القرارات']
  };
}

/**
 * Generate comparison data
 */
function generateComparisonData(topic: string, keywords: string[]): ComparisonPacket {
  // Generate comparison based on topic
  if (topic.includes('الذهب') || topic.includes('الفضة')) {
    return {
      items: [
        {
          name: 'الذهب',
          metrics: { 'السعر': '$2650', 'التغير': '-1.5%', 'التقلب': 'متوسط' },
          pros: ['ملاذ آمن', 'سيولة عالية', 'تاريخ طويل'],
          cons: ['لا يدر عائداً', 'يتأثر بالفائدة'],
          score: 7.5
        },
        {
          name: 'الفضة',
          metrics: { 'السعر': '$31.50', 'التغير': '-2.1%', 'التقلب': 'عالي' },
          pros: ['استخدام صناعي', 'سعر أقل للدخول', 'إمكانية ارتفاع أكبر'],
          cons: ['تقلب أعلى', 'يتأثر بالاقتصاد الصناعي'],
          score: 6.8
        }
      ],
      winner: 'يعتمد على أهدافك الاستثمارية',
      criteria: ['الأمان', 'العائد المحتمل', 'السيولة', 'التقلب']
    };
  }
  
  return {
    items: [],
    criteria: []
  };
}

/**
 * Generate scenario models
 */
function generateScenarios(topic: string, indicators?: EmotionIndicators): ScenarioPacket {
  const cfi = indicators?.cfi || 50;
  const hri = indicators?.hri || 50;
  
  // Base scenarios on emotional indicators
  const scenarios: ScenarioPacket['scenarios'] = [
    {
      name: 'السيناريو الإيجابي',
      description: `تحسن الوضع في ${topic} مع تراجع المخاوف`,
      probability: hri > 60 ? 0.4 : 0.25,
      impact: 'positive',
      triggers: ['تحسن البيانات الاقتصادية', 'أخبار إيجابية', 'تراجع التوترات'],
      outcomes: ['ارتفاع الثقة', 'تحسن المؤشرات', 'فرص جديدة']
    },
    {
      name: 'السيناريو السلبي',
      description: `تفاقم الوضع في ${topic} مع زيادة القلق`,
      probability: cfi > 60 ? 0.35 : 0.2,
      impact: 'negative',
      triggers: ['بيانات سلبية', 'أزمات جديدة', 'تصاعد التوترات'],
      outcomes: ['زيادة الخوف', 'تراجع المؤشرات', 'ضغط على القرارات']
    },
    {
      name: 'السيناريو المحايد',
      description: `استمرار الوضع الحالي مع تذبذب محدود`,
      probability: 0.4,
      impact: 'neutral',
      triggers: ['غياب محفزات قوية', 'ترقب الأسواق'],
      outcomes: ['استقرار نسبي', 'فرصة للمراقبة والتخطيط']
    }
  ];
  
  return {
    scenarios,
    baseCase: 'السيناريو المحايد',
    recommendation: cfi > 60 ? 'الحذر والمراقبة' : hri > 60 ? 'فرصة للتفاؤل الحذر' : 'الانتظار والتقييم'
  };
}

export {
  fetchEmotionIndicators,
  fetchEconomicData,
  fetchNews,
  generateExpertKnowledge,
  generateScenarios
};
