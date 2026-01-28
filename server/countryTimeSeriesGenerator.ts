/**
 * Country Time Series Generator - Creates realistic historical emotion data for countries
 * Simulates emotion trends over time with realistic patterns and variations
 */

import { generateCountryEmotionData, getEmotionColor, getEmotionIntensity } from './countryEmotionAnalyzer';

export interface CountryTimeSeriesData {
  countryCode: string;
  countryName: string;
  timestamp: Date;
  gmi: number;
  cfi: number;
  hri: number;
  confidence: number;
}

/**
 * Generate historical emotion data for a country over a time period
 * Creates realistic trends with gradual changes and random variations
 */
export function generateCountryHistoricalData(
  countryCode: string,
  countryName: string,
  hoursBack: number = 24,
  intervalMinutes: number = 60
): CountryTimeSeriesData[] {
  const data: CountryTimeSeriesData[] = [];
  const now = Date.now();
  const totalIntervals = Math.ceil((hoursBack * 60) / intervalMinutes);

  // Base trend for the country (starts from a random point)
  let baseGMI = (Math.random() - 0.5) * 40;
  let baseCFI = 40 + (Math.random() - 0.5) * 30;
  let baseHRI = 50 + (Math.random() - 0.5) * 30;

  // Trend direction (how the emotion evolves over time)
  const trendGMI = (Math.random() - 0.5) * 0.5; // Slow drift
  const trendCFI = (Math.random() - 0.5) * 0.3;
  const trendHRI = (Math.random() - 0.5) * 0.3;

  // Cycle patterns (daily/weekly patterns)
  const cycleAmplitudeGMI = Math.random() * 20;
  const cycleAmplitudeCFI = Math.random() * 15;
  const cycleAmplitudeHRI = Math.random() * 15;

  for (let i = totalIntervals; i >= 0; i--) {
    const timestamp = new Date(now - i * intervalMinutes * 60 * 1000);
    const timeProgress = (totalIntervals - i) / totalIntervals;

    // Apply trend
    baseGMI += trendGMI;
    baseCFI += trendCFI;
    baseHRI += trendHRI;

    // Apply cycle (sine wave for realistic patterns)
    const cyclePhase = (timeProgress * Math.PI * 2) % (Math.PI * 2);
    const cycleGMI = Math.sin(cyclePhase) * cycleAmplitudeGMI;
    const cycleCFI = Math.sin(cyclePhase + 1) * cycleAmplitudeCFI;
    const cycleHRI = Math.sin(cyclePhase + 2) * cycleAmplitudeHRI;

    // Add random noise
    const noiseGMI = (Math.random() - 0.5) * 10;
    const noiseCFI = (Math.random() - 0.5) * 8;
    const noiseHRI = (Math.random() - 0.5) * 8;

    // Calculate final values
    const gmi = Math.max(-100, Math.min(100, baseGMI + cycleGMI + noiseGMI));
    const cfi = Math.max(0, Math.min(100, baseCFI + cycleCFI + noiseCFI));
    const hri = Math.max(0, Math.min(100, baseHRI + cycleHRI + noiseHRI));

    // Calculate confidence based on stability
    const stability = 1 - Math.abs(noiseGMI / 10 + noiseCFI / 8 + noiseHRI / 8) / 3;
    const confidence = Math.round(70 + stability * 25);

    data.push({
      countryCode,
      countryName,
      timestamp,
      gmi: Math.round(gmi),
      cfi: Math.round(cfi),
      hri: Math.round(hri),
      confidence,
    });
  }

  return data;
}

/**
 * Generate historical data for multiple countries
 */
export function generateMultipleCountriesHistoricalData(
  countries: Array<{ code: string; name: string }>,
  hoursBack: number = 24,
  intervalMinutes: number = 60
): CountryTimeSeriesData[] {
  const allData: CountryTimeSeriesData[] = [];

  for (const country of countries) {
    const countryData = generateCountryHistoricalData(
      country.code,
      country.name,
      hoursBack,
      intervalMinutes
    );
    allData.push(...countryData);
  }

  return allData;
}

/**
 * Get time range label for UI
 */
export function getTimeRangeLabel(hoursBack: number): string {
  if (hoursBack === 1) return 'Last Hour';
  if (hoursBack === 6) return 'Last 6 Hours';
  if (hoursBack === 24) return 'Last 24 Hours';
  if (hoursBack === 168) return 'Last Week';
  if (hoursBack === 720) return 'Last Month';
  return `Last ${hoursBack} Hours`;
}

/**
 * Get interval minutes for time range
 */
export function getIntervalMinutes(hoursBack: number): number {
  if (hoursBack <= 6) return 15;
  if (hoursBack <= 24) return 60;
  if (hoursBack <= 168) return 240; // 4 hours
  return 1440; // 1 day
}

/**
 * Calculate emotion trend (positive/negative change)
 */
export function calculateEmotionTrend(
  data: CountryTimeSeriesData[]
): { gmiTrend: number; cfiTrend: number; hriTrend: number } {
  if (data.length < 2) {
    return { gmiTrend: 0, cfiTrend: 0, hriTrend: 0 };
  }

  const first = data[0];
  const last = data[data.length - 1];

  return {
    gmiTrend: last.gmi - first.gmi,
    cfiTrend: last.cfi - first.cfi,
    hriTrend: last.hri - first.hri,
  };
}

/**
 * Get trend direction emoji
 */
export function getTrendEmoji(trend: number): string {
  if (trend > 5) return '📈';
  if (trend < -5) return '📉';
  return '➡️';
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date, format: 'short' | 'long' = 'short'): string {
  if (format === 'short') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
