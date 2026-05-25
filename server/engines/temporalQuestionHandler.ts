import { t } from "../_core/i18n";
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
  const trendKeywords = ['trend', t('auto.engines_temporalQuestionHandler.53.5f5a06e1', 'ar'), t('auto.engines_temporalQuestionHandler.52.c81718df', 'ar'), t('auto.engines_temporalQuestionHandler.51.742972d5', 'ar'), t('auto.engines_temporalQuestionHandler.50.db5b3276', 'ar'), t('auto.engines_temporalQuestionHandler.49.484aaff3', 'ar'), t('auto.engines_temporalQuestionHandler.48.52428330', 'ar'), t('auto.engines_temporalQuestionHandler.47.b0c2e876', 'ar')];
  const comparisonKeywords = ['compare', 'between', 'vs', 'versus', t('auto.engines_temporalQuestionHandler.46.cb8ef2dd', 'ar'), t('auto.engines_temporalQuestionHandler.45.9a3aec0e', 'ar'), t('auto.engines_temporalQuestionHandler.44.3ced69c2', 'ar'), t('auto.engines_temporalQuestionHandler.43.f3c3b73b', 'ar')];
  const forecastKeywords = ['forecast', 'predict', 'expect', 'next', 'future', t('auto.engines_temporalQuestionHandler.42.4251f876', 'ar'), t('auto.engines_temporalQuestionHandler.41.54f6e62f', 'ar'), t('auto.engines_temporalQuestionHandler.40.9258a415', 'ar')];
  const patternKeywords = ['pattern', 'cycle', 'recurring', t('auto.engines_temporalQuestionHandler.39.47c17787', 'ar'), t('auto.engines_temporalQuestionHandler.38.b89b3dc3', 'ar'), t('auto.engines_temporalQuestionHandler.37.502db78e', 'ar')];
  const changeKeywords = ['change', 'increase', 'decrease', 'improve', 'worsen', t('auto.engines_temporalQuestionHandler.36.742972d5', 'ar'), t('auto.engines_temporalQuestionHandler.35.ea26c1bf', 'ar'), t('auto.engines_temporalQuestionHandler.34.e990bd85', 'ar'), t('auto.engines_temporalQuestionHandler.33.ab4c7e3d', 'ar'), t('auto.engines_temporalQuestionHandler.32.b3af2cb5', 'ar')];
  
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
  if (lowerQuestion.includes('fear') || arabicQuestion.includes(t('auto.engines_temporalQuestionHandler.31.1cf83ec0', 'ar')) || arabicQuestion.includes(t('auto.engines_temporalQuestionHandler.30.a24a5460', 'ar'))) {
    metric = 'cfi';
  } else if (lowerQuestion.includes('hope') || arabicQuestion.includes(t('auto.engines_temporalQuestionHandler.29.60cd6c3d', 'ar')) || arabicQuestion.includes(t('auto.engines_temporalQuestionHandler.28.60cd6c3d', 'ar'))) {
    metric = 'hri';
  } else if (lowerQuestion.includes('mood') || lowerQuestion.includes('sentiment') || arabicQuestion.includes(t('auto.engines_temporalQuestionHandler.27.8f2b95f4', 'ar')) || arabicQuestion.includes(t('auto.engines_temporalQuestionHandler.26.fda85632', 'ar'))) {
    metric = 'gmi';
  } else if (lowerQuestion.includes('anger') || arabicQuestion.includes(t('auto.engines_temporalQuestionHandler.25.8e7bd750', 'ar')) || arabicQuestion.includes(t('auto.engines_temporalQuestionHandler.24.8e7bd750', 'ar'))) {
    metric = 'aci';
  } else if (lowerQuestion.includes('sadness') || arabicQuestion.includes(t('auto.engines_temporalQuestionHandler.23.fdbc4b1b', 'ar')) || arabicQuestion.includes(t('auto.engines_temporalQuestionHandler.22.fdbc4b1b', 'ar'))) {
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
    january: 0, jan: 0,
    february: 1, feb: 1,
    march: 2, mar: 2,
    april: 3, apr: 3,
    may: 4,
    june: 5, jun: 5,
    july: 6, jul: 6,
    august: 7, aug: 7,
    september: 8, sep: 8,
    october: 9, oct: 9,
    november: 10, nov: 10,
    december: 11, dec: 11,
  };  
  const lowerQuestion = question.toLowerCase();
  
  // Check for "last X days/weeks/months"
  if (lowerQuestion.includes('last 7 days') || lowerQuestion.includes('last 7') || lowerQuestion.includes(t('auto.engines_temporalQuestionHandler.21.e7cacc33', 'ar')) || lowerQuestion.includes(t('auto.engines_temporalQuestionHandler.20.349de9cf', 'ar'))) {
    const endDate = new Date(now);
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
    return { startDate, endDate };
  }
  
  if (lowerQuestion.includes('last month') || lowerQuestion.includes(t('auto.engines_temporalQuestionHandler.19.8e3a87a8', 'ar')) || lowerQuestion.includes(t('auto.engines_temporalQuestionHandler.18.b1472f66', 'ar')) || lowerQuestion.includes(t('auto.engines_temporalQuestionHandler.17.d82fde12', 'ar'))) {
    const endDate = new Date(now);
    const startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 1);
    return { startDate, endDate };
  }
  
  if (lowerQuestion.includes('last 3 months') || lowerQuestion.includes(t('auto.engines_temporalQuestionHandler.16.7c914cfd', 'ar')) || lowerQuestion.includes(t('auto.engines_temporalQuestionHandler.15.3d8b7a68', 'ar'))) {
    const endDate = new Date(now);
    const startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 3);
    return { startDate, endDate };
  }
  
  if (lowerQuestion.includes('last year') || lowerQuestion.includes(t('auto.engines_temporalQuestionHandler.14.5ff5ab22', 'ar')) || lowerQuestion.includes(t('auto.engines_temporalQuestionHandler.13.5bb9a4da', 'ar'))) {
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
  if (lowerTopic.includes('economy') || lowerTopic.includes(t('auto.engines_temporalQuestionHandler.12.6d38c2ea', 'ar')) || lowerTopic.includes(t('auto.engines_temporalQuestionHandler.11.16c73be6', 'ar'))) {
    return { gmiTrend: 2, cfiTrend: -1, hriTrend: 1, aciTrend: -1, sdiTrend: -1 };
  }
  
  // Security topics trend downward
  if (lowerTopic.includes('security') || lowerTopic.includes(t('auto.engines_temporalQuestionHandler.10.b5ae7ef3', 'ar')) || lowerTopic.includes(t('auto.engines_temporalQuestionHandler.9.b2155e1c', 'ar'))) {
    return { gmiTrend: -2, cfiTrend: 2, hriTrend: -1, aciTrend: 1, sdiTrend: 1 };
  }
  
  // Health topics show recovery
  if (lowerTopic.includes('health') || lowerTopic.includes(t('auto.engines_temporalQuestionHandler.8.72c707a2', 'ar')) || lowerTopic.includes(t('auto.engines_temporalQuestionHandler.7.aae445ae', 'ar'))) {
    return { gmiTrend: 1, cfiTrend: -1, hriTrend: 2, aciTrend: -1, sdiTrend: -2 };
  }
  
  // Political topics show volatility
  if (lowerTopic.includes('politics') || lowerTopic.includes(t('auto.engines_temporalQuestionHandler.6.26a57968', 'ar')) || lowerTopic.includes(t('auto.engines_temporalQuestionHandler.5.d9b242e6', 'ar'))) {
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
  
  lines.push(`📊 **    ${analysis.period.start.toLocaleDateString('ar-SA')}  ${analysis.period.end.toLocaleDateString('ar-SA')}'**`);
  lines.push(`: ${analysis.period.durationDays} `);
  lines.push('');
  
  lines.push(t('auto.engines_temporalQuestionHandler.4.5c4f6985', 'ar'));
  lines.push(`- GMI: ${analysis.trends.gmi.startValue} → ${analysis.trends.gmi.endValue} (${analysis.trends.gmi.trend})`);
  lines.push(`- CFI: ${analysis.trends.cfi.startValue} → ${analysis.trends.cfi.endValue} (${analysis.trends.cfi.trend})`);
  lines.push(`- HRI: ${analysis.trends.hri.startValue} → ${analysis.trends.hri.endValue} (${analysis.trends.hri.trend})`);
  lines.push('');
  
  if (analysis.patterns.length > 0) {
    lines.push(t('auto.engines_temporalQuestionHandler.3.54e70a78', 'ar'));
    analysis.patterns.forEach((pattern: string) => {
      lines.push(`- ${pattern}`);
    });
    lines.push('');
  }
  
  lines.push(t('auto.engines_temporalQuestionHandler.2.43fe7764', 'ar'));
  lines.push(`- GMI: ${analysis.forecast.nextWeekGMI}`);
  lines.push(`- CFI: ${analysis.forecast.nextWeekCFI}`);
  lines.push(`- HRI: ${analysis.forecast.nextWeekHRI}`);
  lines.push(`-  : ${Math.round(analysis.forecast.confidence * 100)}%`);
  lines.push('');
  
  if (analysis.insights.length > 0) {
    lines.push(t('auto.engines_temporalQuestionHandler.1.64458e22', 'ar'));
    analysis.insights.forEach((insight: string) => {
      lines.push(`- ${insight}`);
    });
  }
  
  return lines.join('\n');
}
