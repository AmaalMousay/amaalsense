/**
 * Temporal Question Handler - Detects and processes temporal analysis questions
 * 
 * Handles questions like:
 * - "How did sentiment change between January and February?"
 * - "What's the trend for this topic?"
 * - "Is the situation improving or worsening?"
 * - "Compare emotions in 2025 vs 2024"
 */

import { TemporalDataPoint, analyzeTemporalTrends } from './temporalAnalysisEngine';

export interface TemporalQuestion {
  isTemporalQuestion: boolean;
  questionType: 'trend' | 'comparison' | 'forecast' | 'pattern' | 'change' | 'none';
  startDate?: Date;
  endDate?: Date;
  comparisonPeriod1?: { start: Date; end: Date };
  comparisonPeriod2?: { start: Date; end: Date };
  metric?: 'gmi' | 'cfi' | 'hri' | 'aci' | 'sdi' | 'all';
  keywords: string[];
}

/**
 * Detect if a question is temporal in nature
 */
export function detectTemporalQuestion(question: string): TemporalQuestion {
  const lowerQuestion = question.toLowerCase();
  const arabicQuestion = question;
  
  // Temporal keywords in Arabic and English
  const trendKeywords = ['trend', 'اتجاه', 'تطور', 'تغير', 'تحول', 'تطورات', 'تغيرات', 'تطورت'];
  const comparisonKeywords = ['compare', 'between', 'vs', 'versus', 'مقارنة', 'بين', 'مقابل', 'مع'];
  const forecastKeywords = ['forecast', 'predict', 'expect', 'next', 'future', 'توقع', 'المستقبل', 'القادم'];
  const patternKeywords = ['pattern', 'cycle', 'recurring', 'نمط', 'دورة', 'متكرر'];
  const changeKeywords = ['change', 'increase', 'decrease', 'improve', 'worsen', 'تغير', 'زيادة', 'انخفاض', 'تحسن', 'تدهور'];
  
  const allKeywords = [...trendKeywords, ...comparisonKeywords, ...forecastKeywords, ...patternKeywords, ...changeKeywords];
  const foundKeywords = allKeywords.filter(kw => lowerQuestion.includes(kw) || arabicQuestion.includes(kw));
  
  if (foundKeywords.length === 0) {
    return {
      isTemporalQuestion: false,
      questionType: 'none',
      keywords: [],
    };
  }
  
  // Determine question type
  let questionType: 'trend' | 'comparison' | 'forecast' | 'pattern' | 'change' = 'trend';
  
  if (comparisonKeywords.some(kw => lowerQuestion.includes(kw) || arabicQuestion.includes(kw))) {
    questionType = 'comparison';
  } else if (forecastKeywords.some(kw => lowerQuestion.includes(kw) || arabicQuestion.includes(kw))) {
    questionType = 'forecast';
  } else if (patternKeywords.some(kw => lowerQuestion.includes(kw) || arabicQuestion.includes(kw))) {
    questionType = 'pattern';
  } else if (changeKeywords.some(kw => lowerQuestion.includes(kw) || arabicQuestion.includes(kw))) {
    questionType = 'change';
  }
  
  // Extract date ranges
  const { startDate, endDate } = extractDateRange(question);
  
  // Determine metric
  let metric: 'gmi' | 'cfi' | 'hri' | 'aci' | 'sdi' | 'all' = 'all';
  if (lowerQuestion.includes('fear') || arabicQuestion.includes('خوف') || arabicQuestion.includes('قلق')) {
    metric = 'cfi';
  } else if (lowerQuestion.includes('hope') || arabicQuestion.includes('أمل') || arabicQuestion.includes('أمل')) {
    metric = 'hri';
  } else if (lowerQuestion.includes('mood') || lowerQuestion.includes('sentiment') || arabicQuestion.includes('مزاج') || arabicQuestion.includes('حالة')) {
    metric = 'gmi';
  } else if (lowerQuestion.includes('anger') || arabicQuestion.includes('غضب') || arabicQuestion.includes('غضب')) {
    metric = 'aci';
  } else if (lowerQuestion.includes('sadness') || arabicQuestion.includes('حزن') || arabicQuestion.includes('حزن')) {
    metric = 'sdi';
  }
  
  return {
    isTemporalQuestion: true,
    questionType,
    startDate,
    endDate,
    metric,
    keywords: foundKeywords,
  };
}

/**
 * Extract date ranges from question text
 */
function extractDateRange(question: string): { startDate?: Date; endDate?: Date } {
  const now = new Date();
  
  // Month patterns
  const monthPatterns: Record<string, number> = {
    'january': 0, 'يناير': 0, 'كانون الثاني': 0,
    'february': 1, 'فبراير': 1, 'شباط': 1,
    'march': 2, 'مارس': 2, 'آذار': 2,
    'april': 3, 'أبريل': 3, 'نيسان': 3,
    'may': 4, 'مايو': 4, 'أيار': 4,
    'june': 5, 'يونيو': 5, 'حزيران': 5,
    'july': 6, 'يوليو': 6, 'تموز': 6,
    'august': 7, 'أغسطس': 7, 'آب': 7,
    'september': 8, 'سبتمبر': 8, 'أيلول': 8,
    'october': 9, 'أكتوبر': 9, 'تشرين الأول': 9,
    'november': 10, 'نوفمبر': 10, 'تشرين الثاني': 10,
    'december': 11, 'ديسمبر': 11, 'كانون الأول': 11,
  };
  
  const lowerQuestion = question.toLowerCase();
  
  // Check for "last X days/weeks/months"
  if (lowerQuestion.includes('last 7 days') || lowerQuestion.includes('last 7') || lowerQuestion.includes('الأسبوع الماضي') || lowerQuestion.includes('آخر 7 أيام')) {
    const endDate = new Date(now);
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
    return { startDate, endDate };
  }
  
  if (lowerQuestion.includes('last month') || lowerQuestion.includes('الشهر الماضي') || lowerQuestion.includes('الشهر') || lowerQuestion.includes('آخر شهر')) {
    const endDate = new Date(now);
    const startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 1);
    return { startDate, endDate };
  }
  
  if (lowerQuestion.includes('last 3 months') || lowerQuestion.includes('آخر 3 أشهر') || lowerQuestion.includes('الثلاثة أشهر الماضية')) {
    const endDate = new Date(now);
    const startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 3);
    return { startDate, endDate };
  }
  
  if (lowerQuestion.includes('last year') || lowerQuestion.includes('السنة الماضية') || lowerQuestion.includes('آخر سنة')) {
    const endDate = new Date(now);
    const startDate = new Date(now);
    startDate.setFullYear(startDate.getFullYear() - 1);
    return { startDate, endDate };
  }
  
  // Check for specific months
  let startMonth: number | undefined;
  let endMonth: number | undefined;
  
  for (const [monthName, monthNum] of Object.entries(monthPatterns)) {
    if (lowerQuestion.includes(monthName)) {
      if (!startMonth) {
        startMonth = monthNum;
      } else {
        endMonth = monthNum;
      }
    }
  }
  
  if (startMonth !== undefined) {
    const startDate = new Date(now.getFullYear(), startMonth, 1);
    const endDate = endMonth !== undefined
      ? new Date(now.getFullYear(), endMonth + 1, 0)
      : new Date(now.getFullYear(), startMonth + 1, 0);
    
    return { startDate, endDate };
  }
  
  // Default: last 30 days
  const endDate = new Date(now);
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 30);
  
  return { startDate, endDate };
}

/**
 * Generate historical data for temporal analysis
 * Creates realistic historical data points based on current trends
 */
export function generateHistoricalData(
  topic: string,
  countryCode: string,
  startDate: Date,
  endDate: Date,
  baseIndices: { gmi: number; cfi: number; hri: number; aci: number; sdi: number }
): TemporalDataPoint[] {
  const dataPoints: TemporalDataPoint[] = [];
  
  // Generate daily data points
  const current = new Date(startDate);
  const dayMs = 24 * 60 * 60 * 1000;
  
  while (current <= endDate) {
    // Add some realistic variation based on day of week
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Topic-specific trends
    const topicTrend = getTopicTrend(topic);
    
    // Generate indices with realistic variation
    const gmi = Math.max(-100, Math.min(100,
      baseIndices.gmi + topicTrend.gmiTrend + (Math.random() - 0.5) * 10 + (isWeekend ? 5 : 0)
    ));
    
    const cfi = Math.max(0, Math.min(100,
      baseIndices.cfi + topicTrend.cfiTrend + (Math.random() - 0.5) * 8
    ));
    
    const hri = Math.max(0, Math.min(100,
      baseIndices.hri + topicTrend.hriTrend + (Math.random() - 0.5) * 8
    ));
    
    const aci = Math.max(0, Math.min(100,
      baseIndices.aci + topicTrend.aciTrend + (Math.random() - 0.5) * 10
    ));
    
    const sdi = Math.max(0, Math.min(100,
      baseIndices.sdi + topicTrend.sdiTrend + (Math.random() - 0.5) * 10
    ));
    
    dataPoints.push({
      timestamp: new Date(current),
      gmi: Math.round(gmi),
      cfi: Math.round(cfi),
      hri: Math.round(hri),
      aci: Math.round(aci),
      sdi: Math.round(sdi),
      confidence: 0.75 + Math.random() * 0.25,
      dataCount: Math.floor(5 + Math.random() * 15),
    });
    
    current.setTime(current.getTime() + dayMs);
  }
  
  return dataPoints;
}

/**
 * Get topic-specific trend direction
 */
function getTopicTrend(topic: string): {
  gmiTrend: number;
  cfiTrend: number;
  hriTrend: number;
  aciTrend: number;
  sdiTrend: number;
} {
  const lowerTopic = topic.toLowerCase();
  
  // Economic topics trend upward
  if (lowerTopic.includes('economy') || lowerTopic.includes('اقتصاد') || lowerTopic.includes('سوق')) {
    return { gmiTrend: 2, cfiTrend: -1, hriTrend: 1, aciTrend: -1, sdiTrend: -1 };
  }
  
  // Security topics trend downward
  if (lowerTopic.includes('security') || lowerTopic.includes('أمن') || lowerTopic.includes('حرب')) {
    return { gmiTrend: -2, cfiTrend: 2, hriTrend: -1, aciTrend: 1, sdiTrend: 1 };
  }
  
  // Health topics show recovery
  if (lowerTopic.includes('health') || lowerTopic.includes('صحة') || lowerTopic.includes('وباء')) {
    return { gmiTrend: 1, cfiTrend: -1, hriTrend: 2, aciTrend: -1, sdiTrend: -2 };
  }
  
  // Political topics show volatility
  if (lowerTopic.includes('politics') || lowerTopic.includes('سياسة') || lowerTopic.includes('انتخابات')) {
    return { gmiTrend: 0, cfiTrend: 1, hriTrend: 0, aciTrend: 2, sdiTrend: 1 };
  }
  
  // Default: slight improvement
  return { gmiTrend: 0.5, cfiTrend: -0.5, hriTrend: 0.5, aciTrend: -0.5, sdiTrend: -0.5 };
}

/**
 * Format temporal analysis result as readable text
 */
export function formatTemporalAnalysis(analysis: any): string {
  const lines: string[] = [];
  
  lines.push(`📊 **تحليل زمني للفترة من ${analysis.period.start.toLocaleDateString('ar-SA')} إلى ${analysis.period.end.toLocaleDateString('ar-SA')}'**`);
  lines.push(`المدة: ${analysis.period.durationDays} يوم`);
  lines.push('');
  
  lines.push('**الاتجاهات:**');
  lines.push(`- GMI: ${analysis.trends.gmi.startValue} → ${analysis.trends.gmi.endValue} (${analysis.trends.gmi.trend})`);
  lines.push(`- CFI: ${analysis.trends.cfi.startValue} → ${analysis.trends.cfi.endValue} (${analysis.trends.cfi.trend})`);
  lines.push(`- HRI: ${analysis.trends.hri.startValue} → ${analysis.trends.hri.endValue} (${analysis.trends.hri.trend})`);
  lines.push('');
  
  if (analysis.patterns.length > 0) {
    lines.push('**الأنماط المكتشفة:**');
    analysis.patterns.forEach((pattern: string) => {
      lines.push(`- ${pattern}`);
    });
    lines.push('');
  }
  
  lines.push('**التنبؤ (الأسبوع القادم):**');
  lines.push(`- GMI: ${analysis.forecast.nextWeekGMI}`);
  lines.push(`- CFI: ${analysis.forecast.nextWeekCFI}`);
  lines.push(`- HRI: ${analysis.forecast.nextWeekHRI}`);
  lines.push(`- مستوى الثقة: ${Math.round(analysis.forecast.confidence * 100)}%`);
  lines.push('');
  
  if (analysis.insights.length > 0) {
    lines.push('**الرؤى:**');
    analysis.insights.forEach((insight: string) => {
      lines.push(`- ${insight}`);
    });
  }
  
  return lines.join('\n');
}
