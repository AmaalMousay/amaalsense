/**
 * PDF Export Service for Amaalsense Reports
 * Generates PDF reports for emotion analysis results
 */

interface ReportData {
  title: string;
  topic?: string;
  country?: string;
  countryName?: string;
  timeRange?: string;
  generatedAt: Date;
  summary: {
    gmi: number;
    cfi: number;
    hri: number;
    totalDataPoints: number;
    sources: string[];
  };
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  dcftAnalysis?: {
    perceptionLayer: number;
    cognitiveLayer: number;
    awarenessLayer: number;
    resonanceIndex: number;
  };
  regions?: Array<{
    name: string;
    sentiment: number;
    change: number;
  }>;
}

/**
 * Generate HTML content for PDF export
 */
export function generateReportHTML(data: ReportData): string {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getSentimentColor = (value: number) => {
    if (value >= 60) return '#22c55e'; // green
    if (value >= 40) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  const html = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: #ffffff;
      min-height: 100vh;
      padding: 40px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 40px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid rgba(139, 92, 246, 0.3);
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      background: linear-gradient(135deg, #8b5cf6, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    .subtitle {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
    }
    .report-title {
      font-size: 24px;
      margin: 20px 0;
      color: #ffffff;
    }
    .meta-info {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
      margin-top: 15px;
    }
    .meta-item {
      background: rgba(139, 92, 246, 0.2);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
    }
    .section {
      margin: 30px 0;
    }
    .section-title {
      font-size: 18px;
      color: #8b5cf6;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-title::before {
      content: '';
      width: 4px;
      height: 20px;
      background: linear-gradient(135deg, #8b5cf6, #06b6d4);
      border-radius: 2px;
    }
    .indicators-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .indicator-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 15px;
      padding: 20px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .indicator-value {
      font-size: 36px;
      font-weight: bold;
      margin: 10px 0;
    }
    .indicator-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .indicator-desc {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 5px;
    }
    .sentiment-bar {
      display: flex;
      height: 30px;
      border-radius: 15px;
      overflow: hidden;
      margin: 15px 0;
    }
    .sentiment-positive {
      background: linear-gradient(90deg, #22c55e, #16a34a);
    }
    .sentiment-negative {
      background: linear-gradient(90deg, #ef4444, #dc2626);
    }
    .sentiment-neutral {
      background: linear-gradient(90deg, #6b7280, #4b5563);
    }
    .sentiment-legend {
      display: flex;
      justify-content: space-around;
      margin-top: 10px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }
    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .dcft-section {
      background: rgba(139, 92, 246, 0.1);
      border-radius: 15px;
      padding: 20px;
      margin-top: 20px;
    }
    .dcft-layers {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-top: 15px;
    }
    .dcft-layer {
      background: rgba(255, 255, 255, 0.05);
      padding: 15px;
      border-radius: 10px;
    }
    .dcft-layer-name {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 5px;
    }
    .dcft-layer-value {
      font-size: 24px;
      font-weight: bold;
      color: #8b5cf6;
    }
    .regions-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    .regions-table th,
    .regions-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .regions-table th {
      color: rgba(255, 255, 255, 0.7);
      font-size: 12px;
      text-transform: uppercase;
    }
    .change-positive {
      color: #22c55e;
    }
    .change-negative {
      color: #ef4444;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
    }
    .sources {
      display: flex;
      justify-content: center;
      gap: 15px;
      flex-wrap: wrap;
      margin-top: 10px;
    }
    .source-badge {
      background: rgba(255, 255, 255, 0.1);
      padding: 5px 12px;
      border-radius: 15px;
      font-size: 11px;
    }
    @media print {
      body {
        background: #1a1a2e;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🧠 Amaalsense</div>
      <div class="subtitle">Digital Collective Emotion Analyzer</div>
      <h1 class="report-title">${data.title}</h1>
      <div class="meta-info">
        ${data.topic ? `<span class="meta-item">📌 Topic: ${data.topic}</span>` : ''}
        ${data.countryName ? `<span class="meta-item">🌍 Country: ${data.countryName}</span>` : ''}
        ${data.timeRange ? `<span class="meta-item">📅 Period: ${data.timeRange}</span>` : ''}
        <span class="meta-item">🕐 Generated: ${formatDate(data.generatedAt)}</span>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Key Indicators</h2>
      <div class="indicators-grid">
        <div class="indicator-card">
          <div class="indicator-label">GMI</div>
          <div class="indicator-value" style="color: ${getSentimentColor(data.summary.gmi)}">${data.summary.gmi.toFixed(1)}</div>
          <div class="indicator-desc">Global Mood Index</div>
        </div>
        <div class="indicator-card">
          <div class="indicator-label">CFI</div>
          <div class="indicator-value" style="color: ${getSentimentColor(100 - data.summary.cfi)}">${data.summary.cfi.toFixed(1)}</div>
          <div class="indicator-desc">Collective Fear Index</div>
        </div>
        <div class="indicator-card">
          <div class="indicator-label">HRI</div>
          <div class="indicator-value" style="color: ${getSentimentColor(data.summary.hri)}">${data.summary.hri.toFixed(1)}</div>
          <div class="indicator-desc">Hope & Resilience Index</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Sentiment Distribution</h2>
      <div class="sentiment-bar">
        <div class="sentiment-positive" style="width: ${data.sentiment.positive}%"></div>
        <div class="sentiment-neutral" style="width: ${data.sentiment.neutral}%"></div>
        <div class="sentiment-negative" style="width: ${data.sentiment.negative}%"></div>
      </div>
      <div class="sentiment-legend">
        <div class="legend-item">
          <div class="legend-dot" style="background: #22c55e"></div>
          <span>Positive ${data.sentiment.positive}%</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background: #6b7280"></div>
          <span>Neutral ${data.sentiment.neutral}%</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background: #ef4444"></div>
          <span>Negative ${data.sentiment.negative}%</span>
        </div>
      </div>
    </div>

    ${data.dcftAnalysis ? `
    <div class="section">
      <h2 class="section-title">DCFT Analysis</h2>
      <div class="dcft-section">
        <p style="font-size: 13px; color: rgba(255,255,255,0.7); margin-bottom: 15px;">
          Digital Collective Field Theory analysis based on the three-layer emotional processing model.
        </p>
        <div class="dcft-layers">
          <div class="dcft-layer">
            <div class="dcft-layer-name">Perception Layer</div>
            <div class="dcft-layer-value">${data.dcftAnalysis.perceptionLayer.toFixed(1)}%</div>
          </div>
          <div class="dcft-layer">
            <div class="dcft-layer-name">Cognitive Layer</div>
            <div class="dcft-layer-value">${data.dcftAnalysis.cognitiveLayer.toFixed(1)}%</div>
          </div>
          <div class="dcft-layer">
            <div class="dcft-layer-name">Awareness Layer</div>
            <div class="dcft-layer-value">${data.dcftAnalysis.awarenessLayer.toFixed(1)}%</div>
          </div>
          <div class="dcft-layer">
            <div class="dcft-layer-name">Resonance Index</div>
            <div class="dcft-layer-value">${data.dcftAnalysis.resonanceIndex.toFixed(1)}</div>
          </div>
        </div>
      </div>
    </div>
    ` : ''}

    ${data.regions && data.regions.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Regional Analysis</h2>
      <table class="regions-table">
        <thead>
          <tr>
            <th>Region</th>
            <th>Sentiment</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          ${data.regions.map(region => `
            <tr>
              <td>${region.name}</td>
              <td style="color: ${getSentimentColor(region.sentiment)}">${region.sentiment.toFixed(1)}%</td>
              <td class="${region.change >= 0 ? 'change-positive' : 'change-negative'}">
                ${region.change >= 0 ? '+' : ''}${region.change.toFixed(1)}%
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    <div class="footer">
      <p>Report generated by Amaalsense - Digital Collective Emotion Analyzer</p>
      <p style="margin-top: 5px;">Based on ${data.summary.totalDataPoints} data points</p>
      <div class="sources">
        ${data.summary.sources.map(source => `<span class="source-badge">${source}</span>`).join('')}
      </div>
      <p style="margin-top: 15px; font-size: 10px;">
        © ${new Date().getFullYear()} Amaalsense. Powered by DCFT (Digital Collective Field Theory)
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

/**
 * Generate report data from analysis results
 */
export function createReportData(
  analysisResult: any,
  options: {
    topic?: string;
    country?: string;
    countryName?: string;
    timeRange?: string;
  } = {}
): ReportData {
  return {
    title: options.topic 
      ? `Emotion Analysis Report: ${options.topic}` 
      : 'Global Emotion Analysis Report',
    topic: options.topic,
    country: options.country,
    countryName: options.countryName,
    timeRange: options.timeRange === 'day' ? 'Last 24 Hours' 
      : options.timeRange === 'week' ? 'Last Week' 
      : options.timeRange === 'month' ? 'Last Month' 
      : 'All Time',
    generatedAt: new Date(),
    summary: {
      gmi: analysisResult.gmi || analysisResult.summary?.gmi || 50,
      cfi: analysisResult.cfi || analysisResult.summary?.cfi || 50,
      hri: analysisResult.hri || analysisResult.summary?.hri || 50,
      totalDataPoints: analysisResult.totalDataPoints || analysisResult.dataPoints?.length || 0,
      sources: analysisResult.sources || ['News API', 'Reddit', 'Mastodon', 'Bluesky', 'Telegram', 'YouTube']
    },
    sentiment: {
      positive: analysisResult.sentiment?.positive || analysisResult.supporters || 45,
      negative: analysisResult.sentiment?.negative || analysisResult.opponents || 35,
      neutral: analysisResult.sentiment?.neutral || analysisResult.neutral || 20
    },
    dcftAnalysis: analysisResult.dcft ? {
      perceptionLayer: analysisResult.dcft.perceptionLayer || 50,
      cognitiveLayer: analysisResult.dcft.cognitiveLayer || 50,
      awarenessLayer: analysisResult.dcft.awarenessLayer || 50,
      resonanceIndex: analysisResult.dcft.resonanceIndex || 0.5
    } : undefined,
    regions: analysisResult.regions || analysisResult.cities?.map((city: any) => ({
      name: city.name,
      sentiment: city.sentiment || 50,
      change: city.change || 0
    }))
  };
}


// =============================================================================
// LEGACY EMOTION PDF EXPORT HELPERS (merged from engines/pdfExport.ts)
// =============================================================================

/**
 * PDF Export Service for Amaalsense Reports
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
function generateLegacyEmotionReportHTML(data: EmotionReportData): string {
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
      <div class="logo">✨ Amaalsense</div>
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
      <p>Amaalsense Engine © 2025 | Based on Digital Consciousness Field Theory (DCFT)</p>
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
  return generateLegacyEmotionReportHTML(data);
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
  
  return generateLegacyEmotionReportHTML(reportData);
}
