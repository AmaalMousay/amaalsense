/**
 * PDF Export Service for AmalSense Reports
 * Generates PDF reports for emotion analysis data
 */

export interface EmotionReportData {
  title: string;
  generatedAt: Date;
  timeRange: string;
  indices: {
    gmi: number;
    cfi: number;
    hri: number;
  };
  emotionVectors: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  country?: string;
  analysisCount?: number;
  confidence?: number;
  summary?: string;
}

export interface CountryReportData extends EmotionReportData {
  countryCode: string;
  countryName: string;
  historicalData?: Array<{
    timestamp: Date;
    gmi: number;
    cfi: number;
    hri: number;
  }>;
}

/**
 * Generate HTML content for PDF report
 */
function generateReportHTML(data: EmotionReportData): string {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getGMIStatus = (gmi: number) => {
    if (gmi >= 30) return { label: 'Positive', color: '#22c55e' };
    if (gmi >= -30) return { label: 'Neutral', color: '#eab308' };
    return { label: 'Negative', color: '#ef4444' };
  };

  const getCFIStatus = (cfi: number) => {
    if (cfi >= 70) return { label: 'Critical', color: '#ef4444' };
    if (cfi >= 50) return { label: 'Elevated', color: '#f97316' };
    if (cfi >= 30) return { label: 'Moderate', color: '#eab308' };
    return { label: 'Low', color: '#22c55e' };
  };

  const getHRIStatus = (hri: number) => {
    if (hri >= 70) return { label: 'Strong', color: '#22c55e' };
    if (hri >= 50) return { label: 'Moderate', color: '#3b82f6' };
    if (hri >= 30) return { label: 'Weak', color: '#f97316' };
    return { label: 'Critical', color: '#ef4444' };
  };

  const gmiStatus = getGMIStatus(data.indices.gmi);
  const cfiStatus = getCFIStatus(data.indices.cfi);
  const hriStatus = getHRIStatus(data.indices.hri);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${data.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
      color: #e2e8f0;
      padding: 40px;
      min-height: 100vh;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 40px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      background: linear-gradient(90deg, #a855f7, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 14px;
    }
    .title {
      font-size: 24px;
      margin: 20px 0 10px;
      color: #f1f5f9;
    }
    .meta {
      color: #64748b;
      font-size: 12px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      color: #a855f7;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .indices-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .index-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    .index-value {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .index-label {
      font-size: 12px;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    .index-status {
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
    }
    .emotions-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .emotion-item {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .emotion-name {
      font-size: 13px;
      color: #94a3b8;
    }
    .emotion-value {
      font-size: 14px;
      font-weight: 600;
    }
    .summary-box {
      background: rgba(168, 85, 247, 0.1);
      border: 1px solid rgba(168, 85, 247, 0.2);
      border-radius: 12px;
      padding: 20px;
    }
    .summary-text {
      font-size: 14px;
      line-height: 1.6;
      color: #cbd5e1;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      color: #64748b;
      font-size: 11px;
    }
    .confidence {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">✨ AmalSense</div>
      <div class="subtitle">Digital Collective Emotion Analyzer</div>
      <h1 class="title">${data.title}</h1>
      <div class="meta">
        Generated: ${formatDate(data.generatedAt)} | Time Range: ${data.timeRange}
        ${data.confidence ? `<span class="confidence">Confidence: ${data.confidence}%</span>` : ''}
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">📊 Core Indices</h2>
      <div class="indices-grid">
        <div class="index-card">
          <div class="index-label">Global Mood Index</div>
          <div class="index-value" style="color: ${gmiStatus.color}">${data.indices.gmi.toFixed(1)}</div>
          <span class="index-status" style="background: ${gmiStatus.color}20; color: ${gmiStatus.color}">${gmiStatus.label}</span>
        </div>
        <div class="index-card">
          <div class="index-label">Collective Fear Index</div>
          <div class="index-value" style="color: ${cfiStatus.color}">${data.indices.cfi.toFixed(1)}</div>
          <span class="index-status" style="background: ${cfiStatus.color}20; color: ${cfiStatus.color}">${cfiStatus.label}</span>
        </div>
        <div class="index-card">
          <div class="index-label">Hope Resilience Index</div>
          <div class="index-value" style="color: ${hriStatus.color}">${data.indices.hri.toFixed(1)}</div>
          <span class="index-status" style="background: ${hriStatus.color}20; color: ${hriStatus.color}">${hriStatus.label}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">🎭 Emotion Vectors</h2>
      <div class="emotions-grid">
        <div class="emotion-item">
          <span class="emotion-name">😊 Joy</span>
          <span class="emotion-value" style="color: #fbbf24">${(data.emotionVectors.joy * 100).toFixed(1)}%</span>
        </div>
        <div class="emotion-item">
          <span class="emotion-name">😨 Fear</span>
          <span class="emotion-value" style="color: #a855f7">${(data.emotionVectors.fear * 100).toFixed(1)}%</span>
        </div>
        <div class="emotion-item">
          <span class="emotion-name">😠 Anger</span>
          <span class="emotion-value" style="color: #ef4444">${(data.emotionVectors.anger * 100).toFixed(1)}%</span>
        </div>
        <div class="emotion-item">
          <span class="emotion-name">😢 Sadness</span>
          <span class="emotion-value" style="color: #3b82f6">${(data.emotionVectors.sadness * 100).toFixed(1)}%</span>
        </div>
        <div class="emotion-item">
          <span class="emotion-name">🌟 Hope</span>
          <span class="emotion-value" style="color: #22c55e">${(data.emotionVectors.hope * 100).toFixed(1)}%</span>
        </div>
        <div class="emotion-item">
          <span class="emotion-name">🔍 Curiosity</span>
          <span class="emotion-value" style="color: #06b6d4">${(data.emotionVectors.curiosity * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>

    ${data.summary ? `
    <div class="section">
      <h2 class="section-title">📝 Summary</h2>
      <div class="summary-box">
        <p class="summary-text">${data.summary}</p>
      </div>
    </div>
    ` : ''}

    <div class="footer">
      <p>AmalSense Engine © 2025 | Based on Digital Consciousness Field Theory (DCFT)</p>
      <p>By Amaal Radwan | Published on Zenodo (DOI: 10.5281/zenodo.14049498)</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate a summary based on indices
 */
export function generateSummary(data: EmotionReportData): string {
  const { gmi, cfi, hri } = data.indices;
  const parts: string[] = [];

  // GMI Analysis
  if (gmi >= 30) {
    parts.push("The collective mood is predominantly positive, indicating general optimism and satisfaction in public discourse.");
  } else if (gmi >= -30) {
    parts.push("The collective mood is neutral, reflecting a balanced mix of positive and negative sentiments.");
  } else {
    parts.push("The collective mood is negative, suggesting widespread concern or dissatisfaction.");
  }

  // CFI Analysis
  if (cfi >= 70) {
    parts.push("Fear levels are critically high, which may indicate a crisis situation or significant anxiety-inducing events.");
  } else if (cfi >= 50) {
    parts.push("Fear levels are elevated, suggesting increased public concern about current events.");
  } else if (cfi >= 30) {
    parts.push("Fear levels are moderate, within normal ranges for typical news cycles.");
  } else {
    parts.push("Fear levels are low, indicating a relatively calm emotional landscape.");
  }

  // HRI Analysis
  if (hri >= 70) {
    parts.push("Hope and resilience are strong, suggesting the population maintains optimism despite challenges.");
  } else if (hri >= 50) {
    parts.push("Hope and resilience are moderate, with balanced expectations for the future.");
  } else if (hri >= 30) {
    parts.push("Hope and resilience are weakening, which may require attention to prevent further decline.");
  } else {
    parts.push("Hope and resilience are critically low, indicating potential psychological stress in the population.");
  }

  return parts.join(" ");
}

/**
 * Export report data as HTML (can be converted to PDF client-side)
 */
export function exportReportHTML(data: EmotionReportData): string {
  // Add auto-generated summary if not provided
  if (!data.summary) {
    data.summary = generateSummary(data);
  }
  return generateReportHTML(data);
}

/**
 * Export country-specific report
 */
export function exportCountryReportHTML(data: CountryReportData): string {
  const reportData: EmotionReportData = {
    ...data,
    title: `${data.countryName} Emotion Analysis Report`,
    country: data.countryName,
  };
  
  if (!reportData.summary) {
    reportData.summary = generateSummary(reportData);
  }
  
  return generateReportHTML(reportData);
}
