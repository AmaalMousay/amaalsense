/**
 * Data Export Service
 * Export analytics data as CSV or Excel format
 */

import { getHistoricalTrends, getDailyTrendData } from "./analyticsStorage";

export interface ExportOptions {
  format: "csv" | "json";
  startDate?: Date;
  endDate?: Date;
  countryCode?: string;
  includeDetails?: boolean;
}

export interface ExportResult {
  data: string;
  filename: string;
  mimeType: string;
  rowCount: number;
}

/**
 * Export daily aggregates as CSV
 */
export async function exportDailyAggregates(options: ExportOptions): Promise<ExportResult> {
  // Calculate days from date range or default to 30
  let days = 30;
  if (options.startDate && options.endDate) {
    days = Math.ceil((options.endDate.getTime() - options.startDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  const aggregates = await getDailyTrendData(days, options.countryCode);

  const rows = aggregates.map((agg) => ({
    date: agg.date,
    country: options.countryCode || "Global",
    gmi: agg.gmi.toFixed(2),
    cfi: agg.cfi.toFixed(2),
    hri: agg.hri.toFixed(2),
    sentiment: agg.sentiment.toFixed(2),
    session_count: agg.count,
  }));

  if (options.format === "json") {
    return {
      data: JSON.stringify(rows, null, 2),
      filename: `amalsense_daily_${formatDateForFilename(new Date())}.json`,
      mimeType: "application/json",
      rowCount: rows.length,
    };
  }

  // CSV format
  const headers = [
    "Date",
    "Country",
    "GMI",
    "CFI",
    "HRI",
    "Sessions",
  ];

  const csvRows = rows.map((row: typeof rows[0]) =>
    [
      row.date,
      row.country,
      row.gmi,
      row.cfi,
      row.hri,
      row.session_count,
    ].join(",")
  );

  const csv = [headers.join(","), ...csvRows].join("\n");

  return {
    data: csv,
    filename: `amalsense_daily_${formatDateForFilename(new Date())}.csv`,
    mimeType: "text/csv",
    rowCount: rows.length,
  };
}

/**
 * Export historical trends as CSV
 */
export async function exportHistoricalTrends(options: ExportOptions): Promise<ExportResult> {
  const trends = await getHistoricalTrends({
    startDate: options.startDate,
    endDate: options.endDate,
    countryCode: options.countryCode,
    limit: 1000,
  });

  const rows = trends.sessions.map((session) => ({
    id: session.id,
    timestamp: session.createdAt.toISOString(),
    type: session.sessionType,
    query: session.query || "",
    country: session.countryCode || "Global",
    gmi: session.gmi.toFixed(2),
    cfi: session.cfi.toFixed(2),
    hri: session.hri.toFixed(2),
    sentiment: session.sentimentScore.toFixed(2),
    dominant_emotion: session.dominantEmotion,
    confidence: session.confidence.toFixed(2),
    source_count: session.sourcesCount,
  }));

  if (options.format === "json") {
    return {
      data: JSON.stringify(rows, null, 2),
      filename: `amalsense_sessions_${formatDateForFilename(new Date())}.json`,
      mimeType: "application/json",
      rowCount: rows.length,
    };
  }

  // CSV format
  const headers = [
    "ID",
    "Timestamp",
    "Type",
    "Query",
    "Country",
    "GMI",
    "CFI",
    "HRI",
    "Sentiment",
    "Dominant Emotion",
    "Confidence",
    "Sources",
  ];

  const csvRows = rows.map((row: typeof rows[0]) =>
    [
      row.id,
      row.timestamp,
      row.type,
      `"${row.query.replace(/"/g, '""')}"`,
      row.country,
      row.gmi,
      row.cfi,
      row.hri,
      row.sentiment,
      row.dominant_emotion,
      row.confidence,
      row.source_count,
    ].join(",")
  );

  const csv = [headers.join(","), ...csvRows].join("\n");

  return {
    data: csv,
    filename: `amalsense_sessions_${formatDateForFilename(new Date())}.csv`,
    mimeType: "text/csv",
    rowCount: rows.length,
  };
}

/**
 * Export emotion distribution summary
 */
export async function exportEmotionSummary(options: ExportOptions): Promise<ExportResult> {
  const trends = await getHistoricalTrends({
    startDate: options.startDate,
    endDate: options.endDate,
    countryCode: options.countryCode,
    limit: 1000,
  });

  // Calculate emotion distribution
  const emotionCounts: Record<string, number> = {};
  trends.sessions.forEach((session) => {
    const emotion = session.dominantEmotion || 'unknown';
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
  });

  const total = trends.sessions.length;
  const rows = Object.entries(emotionCounts).map(([emotion, count]) => ({
    emotion,
    count,
    percentage: ((count / total) * 100).toFixed(2),
  }));

  // Sort by count descending
  rows.sort((a, b) => b.count - a.count);

  if (options.format === "json") {
    return {
      data: JSON.stringify(
        {
          summary: {
            totalSessions: total,
            dateRange: {
              start: options.startDate?.toISOString() || "all",
              end: options.endDate?.toISOString() || "all",
            },
            country: options.countryCode || "Global",
          },
          emotions: rows,
        },
        null,
        2
      ),
      filename: `amalsense_emotions_${formatDateForFilename(new Date())}.json`,
      mimeType: "application/json",
      rowCount: rows.length,
    };
  }

  // CSV format
  const headers = ["Emotion", "Count", "Percentage"];
  const csvRows = rows.map((row: typeof rows[0]) => [row.emotion, row.count, `${row.percentage}%`].join(","));
  const csv = [headers.join(","), ...csvRows].join("\n");

  return {
    data: csv,
    filename: `amalsense_emotions_${formatDateForFilename(new Date())}.csv`,
    mimeType: "text/csv",
    rowCount: rows.length,
  };
}

/**
 * Format date for filename
 */
function formatDateForFilename(date: Date): string {
  return date.toISOString().split("T")[0].replace(/-/g, "");
}
