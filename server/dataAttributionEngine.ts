/**
 * Data Attribution Engine - Fix Bug #6: Missing Data Sources and Attribution
 * 
 * Tracks and attributes all data sources used in analysis
 * Provides transparency and credibility through proper source citation
 */

export interface DataSource {
  id: string;
  name: string; // e.g., 'NewsAPI', 'Reddit', 'Twitter'
  type: 'news' | 'social_media' | 'forum' | 'academic' | 'government' | 'simulation';
  credibilityScore: number; // 0-100
  url?: string;
  lastUpdated: number; // timestamp
  dataPoints: number; // Number of data points from this source
}

export interface Citation {
  sourceId: string;
  sourceName: string;
  headline?: string;
  url?: string;
  timestamp: number;
  relevanceScore: number; // 0-100, how relevant to the analysis
  sentiment?: string;
  author?: string;
}

export interface AttributedAnalysis {
  analysisId: string;
  timestamp: number;
  sources: DataSource[];
  citations: Citation[];
  sourceBreakdown: Record<string, number>; // Source type -> percentage
  credibilityAssessment: string; // 'high', 'medium', 'low'
  transparencyScore: number; // 0-100
  attributionMetadata: {
    totalSources: number;
    totalCitations: number;
    averageCredibility: number;
    sourceTypes: string[];
    dataFreshness: string; // 'very_fresh', 'fresh', 'recent', 'old'
  };
}

/**
 * Source credibility scores
 */
const SOURCE_CREDIBILITY: Record<string, number> = {
  // News sources
  'bbc': 95,
  'reuters': 94,
  'associated_press': 93,
  'financial_times': 92,
  'the_guardian': 90,
  'newsapi': 75,
  'gnews': 72,

  // Academic/Research
  'arxiv': 92,
  'scholar_google': 91,
  'researchgate': 85,

  // Government
  'government_official': 90,
  'un_official': 88,
  'world_bank': 87,

  // Social Media
  'reddit': 50,
  'twitter': 45,
  'mastodon': 55,
  'bluesky': 52,

  // Forums/Communities
  'forum': 40,
  'blog': 35,
  'youtube': 60,
  'telegram': 30,

  // Simulation/Generated
  'simulation': 20,
  'generated': 15,
};

/**
 * Create a data source
 */
export function createDataSource(
  name: string,
  type: 'news' | 'social_media' | 'forum' | 'academic' | 'government' | 'simulation',
  url?: string,
  dataPoints: number = 0
): DataSource {
  const credibilityScore = SOURCE_CREDIBILITY[name.toLowerCase()] || 50;

  return {
    id: `source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    credibilityScore,
    url,
    lastUpdated: Date.now(),
    dataPoints,
  };
}

/**
 * Create a citation
 */
export function createCitation(
  sourceId: string,
  sourceName: string,
  relevanceScore: number,
  headline?: string,
  url?: string,
  sentiment?: string,
  author?: string
): Citation {
  return {
    sourceId,
    sourceName,
    headline,
    url,
    timestamp: Date.now(),
    relevanceScore: Math.min(100, Math.max(0, relevanceScore)),
    sentiment,
    author,
  };
}

/**
 * Calculate source breakdown
 */
export function calculateSourceBreakdown(sources: DataSource[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  const totalDataPoints = sources.reduce((sum, s) => sum + s.dataPoints, 0);

  for (const source of sources) {
    const percentage = totalDataPoints > 0 ? (source.dataPoints / totalDataPoints) * 100 : 0;
    breakdown[source.type] = (breakdown[source.type] || 0) + percentage;
  }

  return breakdown;
}

/**
 * Assess data freshness
 */
export function assessDataFreshness(sources: DataSource[]): string {
  if (sources.length === 0) return 'unknown';

  const now = Date.now();
  const maxAge = Math.max(...sources.map(s => now - s.lastUpdated));
  const hoursOld = maxAge / (1000 * 60 * 60);

  if (hoursOld < 1) return 'very_fresh';
  if (hoursOld < 6) return 'fresh';
  if (hoursOld < 24) return 'recent';
  return 'old';
}

/**
 * Calculate average credibility
 */
export function calculateAverageCredibility(sources: DataSource[]): number {
  if (sources.length === 0) return 0;

  const totalCredibility = sources.reduce((sum, s) => sum + s.credibilityScore, 0);
  return totalCredibility / sources.length;
}

/**
 * Assess credibility level
 */
export function assessCredibilityLevel(averageCredibility: number): 'high' | 'medium' | 'low' {
  if (averageCredibility >= 75) return 'high';
  if (averageCredibility >= 50) return 'medium';
  return 'low';
}

/**
 * Create attributed analysis
 */
export function createAttributedAnalysis(
  analysisId: string,
  sources: DataSource[],
  citations: Citation[]
): AttributedAnalysis {
  const sourceBreakdown = calculateSourceBreakdown(sources);
  const averageCredibility = calculateAverageCredibility(sources);
  const credibilityAssessment = assessCredibilityLevel(averageCredibility);
  const dataFreshness = assessDataFreshness(sources);

  // Calculate transparency score
  let transparencyScore = 50; // Base score
  transparencyScore += Math.min(50, sources.length * 5); // More sources = more transparent
  transparencyScore += (averageCredibility / 100) * 30; // Higher credibility = more transparent
  transparencyScore += citations.length > 0 ? 20 : 0; // Citations boost transparency

  const sourceTypes = Array.from(new Set(sources.map(s => s.type)));

  return {
    analysisId,
    timestamp: Date.now(),
    sources,
    citations,
    sourceBreakdown,
    credibilityAssessment,
    transparencyScore: Math.round(transparencyScore),
    attributionMetadata: {
      totalSources: sources.length,
      totalCitations: citations.length,
      averageCredibility: Math.round(averageCredibility),
      sourceTypes,
      dataFreshness,
    },
  };
}

/**
 * Generate attribution report
 */
export function generateAttributionReport(attribution: AttributedAnalysis): string {
  let report = `# Data Attribution Report\n\n`;

  report += `**Analysis ID:** ${attribution.analysisId}\n`;
  report += `**Generated:** ${new Date(attribution.timestamp).toISOString()}\n`;
  report += `**Transparency Score:** ${attribution.transparencyScore}%\n`;
  report += `**Credibility Assessment:** ${attribution.credibilityAssessment.toUpperCase()}\n\n`;

  report += `## Source Summary\n`;
  report += `- **Total Sources:** ${attribution.attributionMetadata.totalSources}\n`;
  report += `- **Total Citations:** ${attribution.attributionMetadata.totalCitations}\n`;
  report += `- **Average Credibility:** ${attribution.attributionMetadata.averageCredibility}%\n`;
  report += `- **Data Freshness:** ${attribution.attributionMetadata.dataFreshness}\n`;
  report += `- **Source Types:** ${attribution.attributionMetadata.sourceTypes.join(', ')}\n\n`;

  report += `## Source Breakdown\n`;
  for (const [type, percentage] of Object.entries(attribution.sourceBreakdown)) {
    report += `- **${type}:** ${percentage.toFixed(1)}%\n`;
  }

  report += `\n## Detailed Sources\n`;
  for (const source of attribution.sources) {
    report += `\n### ${source.name}\n`;
    report += `- **Type:** ${source.type}\n`;
    report += `- **Credibility:** ${source.credibilityScore}%\n`;
    report += `- **Data Points:** ${source.dataPoints}\n`;
    if (source.url) {
      report += `- **URL:** ${source.url}\n`;
    }
    report += `- **Last Updated:** ${new Date(source.lastUpdated).toISOString()}\n`;
  }

  if (attribution.citations.length > 0) {
    report += `\n## Top Citations\n`;
    const topCitations = attribution.citations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);

    for (const citation of topCitations) {
      report += `\n- **${citation.sourceName}** (${citation.relevanceScore}% relevant)\n`;
      if (citation.headline) {
        report += `  - Headline: ${citation.headline}\n`;
      }
      if (citation.author) {
        report += `  - Author: ${citation.author}\n`;
      }
      if (citation.url) {
        report += `  - URL: ${citation.url}\n`;
      }
    }
  }

  return report;
}

/**
 * Generate citation list (APA format)
 */
export function generateCitationList(attribution: AttributedAnalysis): string[] {
  const citations: string[] = [];

  for (const source of attribution.sources) {
    let citation = `${source.name}`;
    if (source.url) {
      citation += ` (${source.url})`;
    }
    citation += `. Retrieved ${new Date(source.lastUpdated).toISOString().split('T')[0]}.`;
    citations.push(citation);
  }

  return citations;
}

/**
 * Validate attribution
 */
export function validateAttribution(attribution: AttributedAnalysis): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!attribution.analysisId) {
    issues.push('Analysis ID is required');
  }

  if (attribution.sources.length === 0) {
    issues.push('At least one source is required');
  }

  if (attribution.attributionMetadata.averageCredibility < 30) {
    issues.push('Average credibility is very low - consider using more reliable sources');
  }

  if (attribution.attributionMetadata.dataFreshness === 'old') {
    issues.push('Data is old - consider updating sources');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Compare credibility across sources
 */
export function compareSourceCredibility(sources: DataSource[]): {
  mostCredible: DataSource;
  leastCredible: DataSource;
  credibilityRange: number;
} {
  if (sources.length === 0) {
    throw new Error('No sources to compare');
  }

  const sorted = [...sources].sort((a, b) => b.credibilityScore - a.credibilityScore);

  return {
    mostCredible: sorted[0],
    leastCredible: sorted[sorted.length - 1],
    credibilityRange: sorted[0].credibilityScore - sorted[sorted.length - 1].credibilityScore,
  };
}

/**
 * Get source recommendations
 */
export function getSourceRecommendations(attribution: AttributedAnalysis): string[] {
  const recommendations: string[] = [];

  if (attribution.attributionMetadata.totalSources < 3) {
    recommendations.push('Consider adding more sources for better coverage');
  }

  if (attribution.attributionMetadata.averageCredibility < 60) {
    recommendations.push('Consider using more credible sources');
  }

  if (attribution.attributionMetadata.dataFreshness === 'old') {
    recommendations.push('Update sources to include more recent data');
  }

  const breakdown = attribution.sourceBreakdown;
  if (breakdown['news'] === undefined || breakdown['news'] < 30) {
    recommendations.push('Consider including more news sources');
  }

  if (attribution.sources.some(s => s.type === 'simulation')) {
    recommendations.push('Note: Some data is simulated - use with caution');
  }

  return recommendations;
}

/**
 * Export attribution as JSON
 */
export function exportAttributionAsJSON(attribution: AttributedAnalysis): string {
  return JSON.stringify(attribution, null, 2);
}

/**
 * Export attribution as CSV
 */
export function exportAttributionAsCSV(attribution: AttributedAnalysis): string {
  let csv = 'Source,Type,Credibility,DataPoints,LastUpdated,URL\n';

  for (const source of attribution.sources) {
    csv += `"${source.name}","${source.type}",${source.credibilityScore},${source.dataPoints},"${new Date(source.lastUpdated).toISOString()}","${source.url || ''}"\n`;
  }

  return csv;
}
