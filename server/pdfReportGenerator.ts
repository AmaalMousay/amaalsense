/**
 * PDF Report Generator
 * Generates professional PDF reports from analysis data
 * Uses JSON representation that can be converted to PDF client-side or via external service
 */

import { storagePut } from './storage';

export interface ReportData {
  title: string;
  region: string;
  topic: string;
  analysisDate: Date;
  summary: {
    mood: string;
    confidence: number;
    impact: string;
  };
  metrics: {
    gmi: number;
    cfi: number;
    hri: number;
    stability: number;
  };
  keyFindings: string[];
  recommendations: Array<{
    priority: 'immediate' | 'short-term' | 'long-term';
    action: string;
    rationale: string;
    timeline: string;
  }>;
  predictions: Array<{
    timeframe: string;
    description: string;
    confidence: number;
  }>;
  risks: Array<{
    risk: string;
    probability: number;
    impact: string;
  }>;
  scenarios: Array<{
    title: string;
    probability: number;
    impact: string;
  }>;
  dataSource: string;
  generatedBy: string;
}

export interface ReportJSON {
  metadata: {
    title: string;
    generatedAt: string;
    region: string;
    topic: string;
  };
  sections: {
    executiveSummary: {
      mood: string;
      confidence: number;
      impact: string;
      keyInsights: string[];
    };
    metrics: {
      gmi: { value: number; status: string };
      cfi: { value: number; status: string };
      hri: { value: number; status: string };
      stability: { value: number; status: string };
    };
    findings: string[];
    recommendations: Array<{
      priority: string;
      action: string;
      rationale: string;
      timeline: string;
    }>;
    predictions: Array<{
      timeframe: string;
      description: string;
      confidence: number;
    }>;
    risks: Array<{
      risk: string;
      probability: number;
      impact: string;
    }>;
    scenarios: Array<{
      title: string;
      probability: number;
      impact: string;
    }>;
  };
}

export class PDFReportGenerator {
  /**
   * Generate report as JSON structure
   */
  generateReportJSON(data: ReportData): ReportJSON {
    return {
      metadata: {
        title: data.title,
        generatedAt: new Date().toISOString(),
        region: data.region,
        topic: data.topic
      },
      sections: {
        executiveSummary: {
          mood: data.summary.mood,
          confidence: data.summary.confidence,
          impact: data.summary.impact,
          keyInsights: data.keyFindings
        },
        metrics: {
          gmi: {
            value: data.metrics.gmi,
            status: data.metrics.gmi > 60 ? 'Positive' : data.metrics.gmi > 40 ? 'Neutral' : 'Negative'
          },
          cfi: {
            value: data.metrics.cfi,
            status: data.metrics.cfi > 60 ? 'High' : data.metrics.cfi > 40 ? 'Medium' : 'Low'
          },
          hri: {
            value: data.metrics.hri,
            status: data.metrics.hri > 60 ? 'Strong' : data.metrics.hri > 40 ? 'Moderate' : 'Weak'
          },
          stability: {
            value: data.metrics.stability,
            status: data.metrics.stability > 60 ? 'Stable' : data.metrics.stability > 40 ? 'Volatile' : 'Unstable'
          }
        },
        findings: data.keyFindings,
        recommendations: data.recommendations,
        predictions: data.predictions,
        risks: data.risks,
        scenarios: data.scenarios
      }
    };
  }

  /**
   * Generate report as HTML string (for PDF conversion)
   */
  generateReportHTML(data: ReportData): string {
    const json = this.generateReportJSON(data);

    return `
<!DOCTYPE html>
<html lang="en">
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
      line-height: 1.6;
      color: #1F2937;
      background: white;
    }
    .page {
      max-width: 8.5in;
      height: 11in;
      margin: 0 auto;
      padding: 1in;
      background: white;
      page-break-after: always;
    }
    .title-page {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      height: 100%;
    }
    h1 {
      font-size: 32px;
      color: #1F2937;
      margin-bottom: 20px;
      font-weight: bold;
    }
    h2 {
      font-size: 24px;
      color: #374151;
      margin: 20px 0 10px 0;
      border-bottom: 2px solid #E5E7EB;
      padding-bottom: 10px;
    }
    h3 {
      font-size: 18px;
      color: #4B5563;
      margin: 15px 0 10px 0;
    }
    .subtitle {
      font-size: 18px;
      color: #6B7280;
      margin-bottom: 30px;
    }
    .meta {
      font-size: 12px;
      color: #9CA3AF;
      margin-top: 40px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 15px 0;
    }
    .metric-card {
      border: 1px solid #E5E7EB;
      padding: 15px;
      border-radius: 6px;
      background: #F9FAFB;
    }
    .metric-label {
      font-size: 12px;
      color: #6B7280;
      font-weight: 600;
      text-transform: uppercase;
    }
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #1F2937;
      margin: 5px 0;
    }
    .metric-status {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
      background: #E5E7EB;
      color: #374151;
    }
    ul, ol {
      margin-left: 20px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    li {
      margin-bottom: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 12px;
    }
    th {
      background: #E5E7EB;
      padding: 10px;
      text-align: left;
      font-weight: 600;
      border: 1px solid #D1D5DB;
    }
    td {
      padding: 10px;
      border: 1px solid #E5E7EB;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #E5E7EB;
      font-size: 11px;
      color: #9CA3AF;
    }
    .page-break {
      page-break-after: always;
    }
  </style>
</head>
<body>
  <!-- Title Page -->
  <div class="page">
    <div class="title-page">
      <h1>${data.title}</h1>
      <p class="subtitle">${data.region} | ${data.topic}</p>
      <p class="meta">Analysis Date: ${data.analysisDate.toLocaleDateString()}</p>
      <p class="meta">Generated by: ${data.generatedBy}</p>
    </div>
  </div>

  <!-- Executive Summary -->
  <div class="page">
    <h2>Executive Summary</h2>
    <p><strong>Overall Mood:</strong> ${json.sections.executiveSummary.mood}</p>
    <p><strong>Confidence Level:</strong> ${Math.round(json.sections.executiveSummary.confidence * 100)}%</p>
    <p><strong>Expected Impact:</strong> ${json.sections.executiveSummary.impact}</p>
    
    <h3>Key Insights</h3>
    <ul>
      ${json.sections.executiveSummary.keyInsights.map(insight => `<li>${insight}</li>`).join('')}
    </ul>
  </div>

  <!-- Metrics -->
  <div class="page">
    <h2>Key Metrics</h2>
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Global Mood Index (GMI)</div>
        <div class="metric-value">${json.sections.metrics.gmi.value.toFixed(2)}</div>
        <span class="metric-status">${json.sections.metrics.gmi.status}</span>
      </div>
      <div class="metric-card">
        <div class="metric-label">Confidence Index (CFI)</div>
        <div class="metric-value">${json.sections.metrics.cfi.value.toFixed(2)}</div>
        <span class="metric-status">${json.sections.metrics.cfi.status}</span>
      </div>
      <div class="metric-card">
        <div class="metric-label">Hope & Resilience Index (HRI)</div>
        <div class="metric-value">${json.sections.metrics.hri.value.toFixed(2)}</div>
        <span class="metric-status">${json.sections.metrics.hri.status}</span>
      </div>
      <div class="metric-card">
        <div class="metric-label">Stability Index</div>
        <div class="metric-value">${json.sections.metrics.stability.value.toFixed(2)}</div>
        <span class="metric-status">${json.sections.metrics.stability.status}</span>
      </div>
    </div>
  </div>

  <!-- Findings -->
  <div class="page">
    <h2>Key Findings</h2>
    <ol>
      ${json.sections.findings.map(finding => `<li>${finding}</li>`).join('')}
    </ol>
  </div>

  <!-- Recommendations -->
  <div class="page">
    <h2>Recommendations</h2>
    ${['immediate', 'short-term', 'long-term'].map(priority => {
      const recs = json.sections.recommendations.filter(r => r.priority === priority);
      if (recs.length === 0) return '';
      return `
        <h3>${priority.charAt(0).toUpperCase() + priority.slice(1)}</h3>
        ${recs.map(rec => `
          <div style="margin-bottom: 15px;">
            <strong>${rec.action}</strong>
            <p><em>Rationale:</em> ${rec.rationale}</p>
            <p><em>Timeline:</em> ${rec.timeline}</p>
          </div>
        `).join('')}
      `;
    }).join('')}
  </div>

  <!-- Predictions -->
  <div class="page">
    <h2>Predictions</h2>
    <ul>
      ${json.sections.predictions.map(pred => `
        <li><strong>${pred.timeframe}:</strong> ${pred.description} (${Math.round(pred.confidence * 100)}% confidence)</li>
      `).join('')}
    </ul>
  </div>

  <!-- Risks -->
  <div class="page">
    <h2>Risk Assessment</h2>
    <table>
      <thead>
        <tr>
          <th>Risk</th>
          <th>Probability</th>
          <th>Impact</th>
        </tr>
      </thead>
      <tbody>
        ${json.sections.risks.map(risk => `
          <tr>
            <td>${risk.risk}</td>
            <td>${Math.round(risk.probability * 100)}%</td>
            <td>${risk.impact}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <!-- Scenarios -->
  <div class="page">
    <h2>Alternative Scenarios</h2>
    <ul>
      ${json.sections.scenarios.map(scenario => `
        <li><strong>${scenario.title}</strong> (${Math.round(scenario.probability * 100)}% probability) - ${scenario.impact}</li>
      `).join('')}
    </ul>
    
    <div class="footer">
      <p><strong>Data Source:</strong> ${data.dataSource}</p>
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Generated by:</strong> ${data.generatedBy}</p>
      <p style="margin-top: 15px; font-style: italic;">This report is confidential and intended for authorized users only.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generate report as JSON
   */
  async generateReportAsJSON(data: ReportData): Promise<ReportJSON> {
    return this.generateReportJSON(data);
  }

  /**
   * Upload report to S3
   */
  async uploadReportToS3(content: string, reportName: string, format: 'json' | 'html'): Promise<{ url: string; key: string }> {
    const key = `reports/${reportName}-${Date.now()}.${format}`;
    const result = await storagePut(key, content, format === 'json' ? 'application/json' : 'text/html');
    return result;
  }

  /**
   * Generate and upload report
   */
  async generateAndUploadReport(data: ReportData, format: 'json' | 'html' = 'html'): Promise<{ url: string; key: string }> {
    const reportName = `${data.region}-${data.topic}`;
    
    if (format === 'json') {
      const json = this.generateReportJSON(data);
      return this.uploadReportToS3(JSON.stringify(json, null, 2), reportName, 'json');
    } else {
      const html = this.generateReportHTML(data);
      return this.uploadReportToS3(html, reportName, 'html');
    }
  }
}

export const pdfReportGenerator = new PDFReportGenerator();
