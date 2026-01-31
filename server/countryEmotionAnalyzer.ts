/**
 * Country Emotion Analyzer - Simulates emotion analysis by country
 * Generates realistic emotional patterns based on geographic and geopolitical factors
 */

export interface CountryEmotionData {
  countryCode: string;
  countryName: string;
  gmi: number;
  cfi: number;
  hri: number;
  confidence: number;
}

// List of major countries with their codes
export const COUNTRIES = [
  { code: 'LY', name: 'Libya' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'EG', name: 'Egypt' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'KR', name: 'South Korea' },
  { code: 'MX', name: 'Mexico' },
  { code: 'RU', name: 'Russia' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SG', name: 'Singapore' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'MY', name: 'Malaysia' },
];

/**
 * Generate emotion data for a specific country
 * Uses country-specific patterns and global trends
 */
export function generateCountryEmotionData(
  countryCode: string,
  countryName: string,
  globalGMI: number = 0,
  globalCFI: number = 50,
  globalHRI: number = 50
): CountryEmotionData {
  // Country-specific variation factors (simulate different regional sentiments)
  const countryVariationMap: Record<string, { gmiShift: number; cfiShift: number; hriShift: number }> = {
    'SA': { gmiShift: 10, cfiShift: -5, hriShift: 5 },
    'AE': { gmiShift: 15, cfiShift: -10, hriShift: 10 },
    'EG': { gmiShift: -5, cfiShift: 10, hriShift: -5 },
    'US': { gmiShift: 5, cfiShift: 5, hriShift: 5 },
    'GB': { gmiShift: 0, cfiShift: 0, hriShift: 0 },
    'DE': { gmiShift: 5, cfiShift: -5, hriShift: 5 },
    'FR': { gmiShift: -5, cfiShift: 5, hriShift: 0 },
    'JP': { gmiShift: 0, cfiShift: 10, hriShift: 5 },
    'CN': { gmiShift: 10, cfiShift: 0, hriShift: 10 },
    'IN': { gmiShift: 5, cfiShift: 5, hriShift: 10 },
    'BR': { gmiShift: -10, cfiShift: 15, hriShift: -5 },
    'CA': { gmiShift: 10, cfiShift: -5, hriShift: 10 },
    'AU': { gmiShift: 10, cfiShift: -5, hriShift: 10 },
    'KR': { gmiShift: 5, cfiShift: 10, hriShift: 5 },
    'MX': { gmiShift: -5, cfiShift: 10, hriShift: 0 },
    'RU': { gmiShift: -10, cfiShift: 15, hriShift: -10 },
    'IT': { gmiShift: -5, cfiShift: 5, hriShift: 0 },
    'ES': { gmiShift: 0, cfiShift: 5, hriShift: 5 },
    'NL': { gmiShift: 10, cfiShift: -5, hriShift: 10 },
    'SE': { gmiShift: 15, cfiShift: -10, hriShift: 15 },
    'CH': { gmiShift: 15, cfiShift: -10, hriShift: 15 },
    'SG': { gmiShift: 15, cfiShift: -5, hriShift: 15 },
    'ID': { gmiShift: 5, cfiShift: 10, hriShift: 5 },
    'TH': { gmiShift: 0, cfiShift: 10, hriShift: 5 },
    'MY': { gmiShift: 10, cfiShift: 0, hriShift: 10 },
  };

  const variation = countryVariationMap[countryCode] || { gmiShift: 0, cfiShift: 0, hriShift: 0 };

  // Add randomness for realistic variation
  const randomGMI = (Math.random() - 0.5) * 20;
  const randomCFI = (Math.random() - 0.5) * 15;
  const randomHRI = (Math.random() - 0.5) * 15;

  // Calculate final indices
  const gmi = Math.max(-100, Math.min(100, globalGMI + variation.gmiShift + randomGMI));
  const cfi = Math.max(0, Math.min(100, globalCFI + variation.cfiShift + randomCFI));
  const hri = Math.max(0, Math.min(100, globalHRI + variation.hriShift + randomHRI));

  // Calculate confidence based on data consistency (0-1 range)
  const confidence = (70 + Math.random() * 25) / 100;

  return {
    countryCode,
    countryName,
    gmi: Math.round(gmi),
    cfi: Math.round(cfi),
    hri: Math.round(hri),
    confidence,
  };
}

/**
 * Generate emotion data for all major countries
 */
export function generateAllCountriesEmotionData(
  globalGMI: number = 0,
  globalCFI: number = 50,
  globalHRI: number = 50
): CountryEmotionData[] {
  return COUNTRIES.map((country) =>
    generateCountryEmotionData(country.code, country.name, globalGMI, globalCFI, globalHRI)
  );
}

/**
 * Get color code for emotion intensity (for map visualization)
 * Returns a color based on the dominant emotion and intensity
 */
export function getEmotionColor(gmi: number, cfi: number, hri: number): string {
  // Determine dominant emotion
  const positiveScore = (gmi + 100) / 2; // Normalize GMI to 0-100
  const fearScore = cfi;
  const hopeScore = hri;

  // If fear is high, use red tones
  if (fearScore > 60) {
    const intensity = Math.round((fearScore / 100) * 255);
    return `rgb(${intensity}, 50, 50)`;
  }

  // If hope is high, use green tones
  if (hopeScore > 60) {
    const intensity = Math.round((hopeScore / 100) * 255);
    return `rgb(50, ${intensity}, 100)`;
  }

  // If GMI is positive, use blue-green
  if (gmi > 20) {
    const intensity = Math.round(((gmi + 100) / 200) * 255);
    return `rgb(100, ${intensity}, 200)`;
  }

  // If GMI is negative, use orange-red
  if (gmi < -20) {
    const intensity = Math.round(((-gmi + 100) / 200) * 255);
    return `rgb(${intensity}, 150, 50)`;
  }

  // Neutral - yellow-orange
  return 'rgb(200, 150, 100)';
}

/**
 * Get emotion intensity level (for map visualization opacity/size)
 * Returns a value between 0.3 and 1.0
 */
export function getEmotionIntensity(gmi: number, cfi: number, hri: number): number {
  const avgIntensity = (Math.abs(gmi) + cfi + hri) / 3;
  return Math.max(0.3, Math.min(1.0, avgIntensity / 100));
}

/**
 * Get emotion description for a country based on indices
 */
export function getEmotionDescription(gmi: number, cfi: number, hri: number): string {
  const sentiments: string[] = [];

  if (gmi > 30) sentiments.push('optimistic');
  else if (gmi < -30) sentiments.push('pessimistic');
  else sentiments.push('neutral');

  if (cfi > 60) sentiments.push('fearful');
  else if (cfi < 30) sentiments.push('confident');

  if (hri > 60) sentiments.push('hopeful');
  else if (hri < 30) sentiments.push('discouraged');

  return sentiments.join(', ');
}
