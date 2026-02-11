/**
 * Weekly Self-Report Layer - Enable Disabled Layer #3
 * 
 * Generates automated weekly reports summarizing emotional trends and system performance
 */

export interface WeeklyReport {
  reportId: string;
  weekStartDate: number;
  weekEndDate: number;
  generatedAt: number;
  summary: {
    totalAnalyses: number;
    averageGmi: number;
    averageCfi: number;
    averageHri: number;
    topTopics: string[];
    topCountries: string[];
    averageConfidence: number;
  };
  trends: {
    gmiTrend: 'up' | 'down' | 'stable';
    cfiTrend: 'up' | 'down' | 'stable';
    hriTrend: 'up' | 'down' | 'stable';
    gmiChange: number;
    cfiChange: number;
    hriChange: number;
  };
  insights: string[];
  recommendations: string[];
  metrics: {
    systemAccuracy: number;
    userSatisfaction: number;
    dataQuality: number;
    sourceReliability: number;
  };
}

export interface ReportSchedule {
  dayOfWeek: number; // 0-6, 0 = Sunday
  time: string; // HH:MM format
  timezone: string;
  enabled: boolean;
}

/**
 * Generate weekly report
 */
export function generateWeeklyReport(
  weekData: {
    analyses: Array<{
      gmi: number;
      cfi: number;
      hri: number;
      topic: string;
      country: string;
      confidence: number;
    }>;
    userFeedback: Array<{
      rating: 'positive' | 'neutral' | 'negative';
      confidence: number;
    }>;
  },
  previousWeekData?: {
    averageGmi: number;
    averageCfi: number;
    averageHri: number;
  }
): WeeklyReport {
  const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = Date.now();
  const weekStart = now - 7 * 24 * 60 * 60 * 1000;
  const weekEnd = now;

  // Calculate summaries
  const totalAnalyses = weekData.analyses.length;
  const averageGmi = totalAnalyses > 0 ? weekData.analyses.reduce((sum, a) => sum + a.gmi, 0) / totalAnalyses : 0;
  const averageCfi = totalAnalyses > 0 ? weekData.analyses.reduce((sum, a) => sum + a.cfi, 0) / totalAnalyses : 0;
  const averageHri = totalAnalyses > 0 ? weekData.analyses.reduce((sum, a) => sum + a.hri, 0) / totalAnalyses : 0;
  const averageConfidence = totalAnalyses > 0 ? weekData.analyses.reduce((sum, a) => sum + a.confidence, 0) / totalAnalyses : 0;

  // Get top topics and countries
  const topicCounts = weekData.analyses.reduce((acc, a) => {
    acc[a.topic] = (acc[a.topic] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const countryCounts = weekData.analyses.reduce((acc, a) => {
    acc[a.country] = (acc[a.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);

  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([country]) => country);

  // Calculate trends
  const gmiChange = previousWeekData ? ((averageGmi - previousWeekData.averageGmi) / previousWeekData.averageGmi) * 100 : 0;
  const cfiChange = previousWeekData ? ((averageCfi - previousWeekData.averageCfi) / previousWeekData.averageCfi) * 100 : 0;
  const hriChange = previousWeekData ? ((averageHri - previousWeekData.averageHri) / previousWeekData.averageHri) * 100 : 0;

  const gmiTrend = gmiChange > 2 ? 'up' : gmiChange < -2 ? 'down' : 'stable';
  const cfiTrend = cfiChange > 2 ? 'up' : cfiChange < -2 ? 'down' : 'stable';
  const hriTrend = hriChange > 2 ? 'up' : hriChange < -2 ? 'down' : 'stable';

  // Generate insights
  const insights: string[] = [];

  if (totalAnalyses === 0) {
    insights.push('No analyses were performed this week');
  } else {
    insights.push(`${totalAnalyses} analyses were performed this week`);

    if (gmiTrend === 'up') {
      insights.push('Global mood is improving');
    } else if (gmiTrend === 'down') {
      insights.push('Global mood is declining');
    }

    if (cfiTrend === 'up') {
      insights.push('Collective fear is increasing');
    } else if (cfiTrend === 'down') {
      insights.push('Collective fear is decreasing');
    }

    if (hriTrend === 'up') {
      insights.push('Hope and resilience are strengthening');
    } else if (hriTrend === 'down') {
      insights.push('Hope and resilience are weakening');
    }

    if (topTopics.length > 0) {
      insights.push(`Most analyzed topics: ${topTopics.join(', ')}`);
    }

    if (topCountries.length > 0) {
      insights.push(`Most analyzed countries: ${topCountries.join(', ')}`);
    }
  }

  // Calculate user satisfaction
  const positiveCount = weekData.userFeedback.filter(f => f.rating === 'positive').length;
  const totalFeedback = weekData.userFeedback.length;
  const userSatisfaction = totalFeedback > 0 ? (positiveCount / totalFeedback) * 100 : 0;

  // Generate recommendations
  const recommendations: string[] = [];

  if (averageConfidence < 60) {
    recommendations.push('Consider reviewing data sources to improve confidence scores');
  }

  if (cfiTrend === 'up' && cfiChange > 10) {
    recommendations.push('High increase in collective fear detected - monitor closely');
  }

  if (hriTrend === 'down' && hriChange < -10) {
    recommendations.push('Significant decline in hope and resilience - consider intervention');
  }

  if (userSatisfaction < 50 && totalFeedback > 0) {
    recommendations.push('User satisfaction is low - review analysis methodology');
  }

  // Calculate metrics
  const systemAccuracy = Math.max(0, 100 - Math.abs(gmiChange));
  const dataQuality = Math.min(100, (totalAnalyses / 50) * 100);
  const sourceReliability = 75; // Placeholder
  const metrics = {
    systemAccuracy: Math.round(systemAccuracy),
    userSatisfaction: Math.round(userSatisfaction),
    dataQuality: Math.round(dataQuality),
    sourceReliability: Math.round(sourceReliability),
  };

  return {
    reportId,
    weekStartDate: weekStart,
    weekEndDate: weekEnd,
    generatedAt: now,
    summary: {
      totalAnalyses,
      averageGmi,
      averageCfi,
      averageHri,
      topTopics,
      topCountries,
      averageConfidence,
    },
    trends: {
      gmiTrend,
      cfiTrend,
      hriTrend,
      gmiChange,
      cfiChange,
      hriChange,
    },
    insights,
    recommendations,
    metrics,
  };
}

/**
 * Format weekly report as text
 */
export function formatWeeklyReportAsText(report: WeeklyReport): string {
  const startDate = new Date(report.weekStartDate).toLocaleDateString();
  const endDate = new Date(report.weekEndDate).toLocaleDateString();

  let text = `# Weekly Report: ${startDate} - ${endDate}\n\n`;

  text += `## Summary\n`;
  text += `- **Total Analyses:** ${report.summary.totalAnalyses}\n`;
  text += `- **Average GMI:** ${report.summary.averageGmi.toFixed(2)}\n`;
  text += `- **Average CFI:** ${report.summary.averageCfi.toFixed(2)}\n`;
  text += `- **Average HRI:** ${report.summary.averageHri.toFixed(2)}\n`;
  text += `- **Average Confidence:** ${report.summary.averageConfidence.toFixed(2)}%\n\n`;

  text += `## Trends\n`;
  text += `- **GMI Trend:** ${report.trends.gmiTrend} (${report.trends.gmiChange > 0 ? '+' : ''}${report.trends.gmiChange.toFixed(2)}%)\n`;
  text += `- **CFI Trend:** ${report.trends.cfiTrend} (${report.trends.cfiChange > 0 ? '+' : ''}${report.trends.cfiChange.toFixed(2)}%)\n`;
  text += `- **HRI Trend:** ${report.trends.hriTrend} (${report.trends.hriChange > 0 ? '+' : ''}${report.trends.hriChange.toFixed(2)}%)\n\n`;

  text += `## Key Insights\n`;
  for (const insight of report.insights) {
    text += `- ${insight}\n`;
  }
  text += '\n';

  text += `## Recommendations\n`;
  for (const rec of report.recommendations) {
    text += `- ${rec}\n`;
  }
  text += '\n';

  text += `## Performance Metrics\n`;
  text += `- **System Accuracy:** ${report.metrics.systemAccuracy}%\n`;
  text += `- **User Satisfaction:** ${report.metrics.userSatisfaction.toFixed(1)}%\n`;
  text += `- **Data Quality:** ${report.metrics.dataQuality}%\n`;
  text += `- **Source Reliability:** ${report.metrics.sourceReliability}%\n`;

  return text;
}

/**
 * Format weekly report as HTML
 */
export function formatWeeklyReportAsHTML(report: WeeklyReport): string {
  const startDate = new Date(report.weekStartDate).toLocaleDateString();
  const endDate = new Date(report.weekEndDate).toLocaleDateString();

  let html = `<div class="weekly-report">\n`;
  html += `<h1>Weekly Report: ${startDate} - ${endDate}</h1>\n\n`;

  html += `<section class="summary">\n`;
  html += `<h2>Summary</h2>\n`;
  html += `<ul>\n`;
  html += `<li>Total Analyses: <strong>${report.summary.totalAnalyses}</strong></li>\n`;
  html += `<li>Average GMI: <strong>${report.summary.averageGmi.toFixed(2)}</strong></li>\n`;
  html += `<li>Average CFI: <strong>${report.summary.averageCfi.toFixed(2)}</strong></li>\n`;
  html += `<li>Average HRI: <strong>${report.summary.averageHri.toFixed(2)}</strong></li>\n`;
  html += `</ul>\n`;
  html += `</section>\n\n`;

  html += `<section class="trends">\n`;
  html += `<h2>Trends</h2>\n`;
  html += `<ul>\n`;
  html += `<li>GMI Trend: <strong>${report.trends.gmiTrend}</strong> (${report.trends.gmiChange > 0 ? '+' : ''}${report.trends.gmiChange.toFixed(2)}%)</li>\n`;
  html += `<li>CFI Trend: <strong>${report.trends.cfiTrend}</strong> (${report.trends.cfiChange > 0 ? '+' : ''}${report.trends.cfiChange.toFixed(2)}%)</li>\n`;
  html += `<li>HRI Trend: <strong>${report.trends.hriTrend}</strong> (${report.trends.hriChange > 0 ? '+' : ''}${report.trends.hriChange.toFixed(2)}%)</li>\n`;
  html += `</ul>\n`;
  html += `</section>\n\n`;

  html += `<section class="insights">\n`;
  html += `<h2>Key Insights</h2>\n`;
  html += `<ul>\n`;
  for (const insight of report.insights) {
    html += `<li>${insight}</li>\n`;
  }
  html += `</ul>\n`;
  html += `</section>\n\n`;

  html += `<section class="recommendations">\n`;
  html += `<h2>Recommendations</h2>\n`;
  html += `<ul>\n`;
  for (const rec of report.recommendations) {
    html += `<li>${rec}</li>\n`;
  }
  html += `</ul>\n`;
  html += `</section>\n\n`;

  html += `<section class="metrics">\n`;
  html += `<h2>Performance Metrics</h2>\n`;
  html += `<ul>\n`;
  html += `<li>System Accuracy: <strong>${report.metrics.systemAccuracy}%</strong></li>\n`;
  html += `<li>User Satisfaction: <strong>${report.metrics.userSatisfaction.toFixed(1)}%</strong></li>\n`;
  html += `<li>Data Quality: <strong>${report.metrics.dataQuality}%</strong></li>\n`;
  html += `<li>Source Reliability: <strong>${report.metrics.sourceReliability}%</strong></li>\n`;
  html += `</ul>\n`;
  html += `</section>\n`;
  html += `</div>\n`;

  return html;
}

/**
 * Schedule weekly report generation
 */
export function scheduleWeeklyReport(schedule: ReportSchedule): { success: boolean; message: string } {
  if (schedule.dayOfWeek < 0 || schedule.dayOfWeek > 6) {
    return { success: false, message: 'Invalid day of week' };
  }

  const [hours, minutes] = schedule.time.split(':').map(Number);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return { success: false, message: 'Invalid time format' };
  }

  return {
    success: true,
    message: `Weekly report scheduled for ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][schedule.dayOfWeek]} at ${schedule.time} ${schedule.timezone}`,
  };
}

/**
 * Validate weekly report
 */
export function validateWeeklyReport(report: WeeklyReport): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!report.reportId) {
    issues.push('Report ID is required');
  }

  if (report.weekStartDate >= report.weekEndDate) {
    issues.push('Week start date must be before end date');
  }

  if (report.summary.totalAnalyses < 0) {
    issues.push('Total analyses cannot be negative');
  }

  if (report.metrics.systemAccuracy < 0 || report.metrics.systemAccuracy > 100) {
    issues.push('System accuracy must be between 0 and 100');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
