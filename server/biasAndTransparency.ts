/**
 * Bias & Transparency System
 * 
 * Handles:
 * 1. Geographical Bias Detection & Labeling
 * 2. Digital vs Human Representation Disclaimer
 * 3. Real-time Transparency (timestamps, data windows)
 * 4. Event Dominance Detection
 * 5. Explainability (Why this score?)
 */

// ============ GEOGRAPHICAL BIAS ============

export type BiasLevel = 'global' | 'global_limited' | 'regional' | 'heavily_biased';
export type BiasRegion = 'mena' | 'western' | 'asian' | 'african' | 'latin' | 'mixed';

export interface GeographicalBias {
  level: BiasLevel;
  levelAr: string;
  primaryRegion: BiasRegion;
  primaryRegionAr: string;
  regionDistribution: Record<BiasRegion, number>; // Percentage per region
  warning?: string;
  warningAr?: string;
  confidence: number;
}

export interface SourceGeography {
  source: string;
  region: BiasRegion;
  language: string;
  country?: string;
}

const REGION_LABELS: Record<BiasRegion, { en: string; ar: string }> = {
  mena: { en: 'Middle East & North Africa', ar: 'الشرق الأوسط وشمال أفريقيا' },
  western: { en: 'Western (US/EU)', ar: 'غربي (أمريكا/أوروبا)' },
  asian: { en: 'Asian', ar: 'آسيوي' },
  african: { en: 'African', ar: 'أفريقي' },
  latin: { en: 'Latin America', ar: 'أمريكا اللاتينية' },
  mixed: { en: 'Mixed/Global', ar: 'مختلط/عالمي' },
};

const BIAS_LEVEL_LABELS: Record<BiasLevel, { en: string; ar: string }> = {
  global: { en: 'Global', ar: 'عالمي' },
  global_limited: { en: 'Global (Limited Coverage)', ar: 'عالمي (تغطية محدودة)' },
  regional: { en: 'Regional', ar: 'إقليمي' },
  heavily_biased: { en: 'Heavily Biased', ar: 'متحيز بشدة' },
};

/**
 * Detect geographical bias from source distribution
 */
export function detectGeographicalBias(sources: SourceGeography[]): GeographicalBias {
  if (sources.length === 0) {
    return {
      level: 'heavily_biased',
      levelAr: 'متحيز بشدة',
      primaryRegion: 'mixed',
      primaryRegionAr: 'غير محدد',
      regionDistribution: { mena: 0, western: 0, asian: 0, african: 0, latin: 0, mixed: 100 },
      warning: 'No source data available for bias analysis',
      warningAr: 'لا توجد بيانات مصادر لتحليل التحيز',
      confidence: 0,
    };
  }

  // Count sources per region
  const regionCounts: Record<BiasRegion, number> = {
    mena: 0, western: 0, asian: 0, african: 0, latin: 0, mixed: 0,
  };

  sources.forEach(s => {
    regionCounts[s.region]++;
  });

  // Calculate percentages
  const total = sources.length;
  const regionDistribution: Record<BiasRegion, number> = {
    mena: Math.round((regionCounts.mena / total) * 100),
    western: Math.round((regionCounts.western / total) * 100),
    asian: Math.round((regionCounts.asian / total) * 100),
    african: Math.round((regionCounts.african / total) * 100),
    latin: Math.round((regionCounts.latin / total) * 100),
    mixed: Math.round((regionCounts.mixed / total) * 100),
  };

  // Find primary region
  const sortedRegions = Object.entries(regionDistribution)
    .sort(([, a], [, b]) => b - a);
  const primaryRegion = sortedRegions[0][0] as BiasRegion;
  const primaryPercentage = sortedRegions[0][1];

  // Determine bias level
  let level: BiasLevel;
  let warning: string | undefined;
  let warningAr: string | undefined;

  if (primaryPercentage > 80) {
    level = 'heavily_biased';
    warning = `⚠️ Data is ${primaryPercentage}% from ${REGION_LABELS[primaryRegion].en}. Results may not represent global sentiment.`;
    warningAr = `⚠️ البيانات ${primaryPercentage}% من ${REGION_LABELS[primaryRegion].ar}. النتائج قد لا تمثل المشاعر العالمية.`;
  } else if (primaryPercentage > 60) {
    level = 'regional';
    warning = `Data is primarily from ${REGION_LABELS[primaryRegion].en} (${primaryPercentage}%).`;
    warningAr = `البيانات بشكل رئيسي من ${REGION_LABELS[primaryRegion].ar} (${primaryPercentage}%).`;
  } else if (primaryPercentage > 40) {
    level = 'global_limited';
  } else {
    level = 'global';
  }

  return {
    level,
    levelAr: BIAS_LEVEL_LABELS[level].ar,
    primaryRegion,
    primaryRegionAr: REGION_LABELS[primaryRegion].ar,
    regionDistribution,
    warning,
    warningAr,
    confidence: Math.min(100, sources.length * 5), // More sources = higher confidence
  };
}

/**
 * Detect region from language code
 */
export function detectRegionFromLanguage(langCode: string): BiasRegion {
  const langToRegion: Record<string, BiasRegion> = {
    ar: 'mena', // Arabic
    he: 'mena', // Hebrew
    fa: 'mena', // Persian
    tr: 'mena', // Turkish
    en: 'western', // English (default to western)
    de: 'western', // German
    fr: 'western', // French (could be African too)
    es: 'latin', // Spanish
    pt: 'latin', // Portuguese
    zh: 'asian', // Chinese
    ja: 'asian', // Japanese
    ko: 'asian', // Korean
    hi: 'asian', // Hindi
    sw: 'african', // Swahili
  };
  return langToRegion[langCode] || 'mixed';
}

// ============ DIGITAL VS HUMAN DISCLAIMER ============

export interface RepresentationDisclaimer {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  limitations: string[];
  limitationsAr: string[];
}

export function getRepresentationDisclaimer(): RepresentationDisclaimer {
  return {
    title: 'Digital Collective Emotion Analysis',
    titleAr: 'تحليل المشاعر الجماعية الرقمية',
    description: 'This analysis represents emotions expressed in digital spaces, not the entire human population.',
    descriptionAr: 'هذا التحليل يمثل المشاعر المعبر عنها في الفضاءات الرقمية، وليس كل البشر.',
    limitations: [
      'Only includes people who post online',
      'May underrepresent elderly, rural, and offline populations',
      'Vocal minorities may be overrepresented',
      'Cultural differences in online expression exist',
    ],
    limitationsAr: [
      'يشمل فقط الأشخاص الذين ينشرون على الإنترنت',
      'قد لا يمثل كبار السن والمناطق الريفية وغير المتصلين',
      'الأقليات الصوتية قد تكون ممثلة بشكل زائد',
      'توجد اختلافات ثقافية في التعبير الرقمي',
    ],
  };
}

// ============ REAL-TIME TRANSPARENCY ============

export interface DataFreshness {
  lastUpdated: Date;
  lastUpdatedAgo: string;
  lastUpdatedAgoAr: string;
  dataWindowStart: Date;
  dataWindowEnd: Date;
  dataWindowDescription: string;
  dataWindowDescriptionAr: string;
  isRealTime: boolean;
  refreshIntervalMinutes: number;
}

export function calculateDataFreshness(
  analysisTime: Date,
  dataStartTime?: Date,
  dataEndTime?: Date
): DataFreshness {
  const now = new Date();
  const lastUpdated = analysisTime;
  const diffMs = now.getTime() - lastUpdated.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);

  // Format "ago" string
  let lastUpdatedAgo: string;
  let lastUpdatedAgoAr: string;

  if (diffMinutes < 1) {
    lastUpdatedAgo = 'Just now';
    lastUpdatedAgoAr = 'الآن';
  } else if (diffMinutes < 60) {
    lastUpdatedAgo = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    lastUpdatedAgoAr = `منذ ${diffMinutes} دقيقة`;
  } else if (diffHours < 24) {
    lastUpdatedAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    lastUpdatedAgoAr = `منذ ${diffHours} ساعة`;
  } else {
    const diffDays = Math.floor(diffHours / 24);
    lastUpdatedAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    lastUpdatedAgoAr = `منذ ${diffDays} يوم`;
  }

  // Default data window: last 24 hours
  const windowStart = dataStartTime || new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const windowEnd = dataEndTime || now;
  const windowHours = Math.round((windowEnd.getTime() - windowStart.getTime()) / (60 * 60 * 1000));

  return {
    lastUpdated,
    lastUpdatedAgo,
    lastUpdatedAgoAr,
    dataWindowStart: windowStart,
    dataWindowEnd: windowEnd,
    dataWindowDescription: `Data from last ${windowHours} hours`,
    dataWindowDescriptionAr: `بيانات آخر ${windowHours} ساعة`,
    isRealTime: diffMinutes < 5,
    refreshIntervalMinutes: 15, // Default refresh interval
  };
}

// ============ EVENT DOMINANCE ============

export interface EventDominance {
  hasDominantEvent: boolean;
  dominantEventTopic?: string;
  dominancePercentage: number;
  warning?: string;
  warningAr?: string;
  gmiWithoutDominant?: number;
  cfiWithoutDominant?: number;
  hriWithoutDominant?: number;
}

export interface TopicContribution {
  topic: string;
  percentage: number;
  sourceCount: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export function detectEventDominance(
  topics: TopicContribution[],
  currentGmi: number,
  currentCfi: number,
  currentHri: number
): EventDominance {
  if (topics.length === 0) {
    return {
      hasDominantEvent: false,
      dominancePercentage: 0,
    };
  }

  // Sort by percentage
  const sorted = [...topics].sort((a, b) => b.percentage - a.percentage);
  const topTopic = sorted[0];

  if (topTopic.percentage > 50) {
    // Calculate indices without dominant event
    const remainingWeight = 100 - topTopic.percentage;
    const adjustmentFactor = topTopic.sentiment === 'negative' ? 0.3 : -0.2;

    return {
      hasDominantEvent: true,
      dominantEventTopic: topTopic.topic,
      dominancePercentage: topTopic.percentage,
      warning: `⚠️ "${topTopic.topic}" dominates ${topTopic.percentage}% of the data. Results may be skewed.`,
      warningAr: `⚠️ "${topTopic.topic}" يهيمن على ${topTopic.percentage}% من البيانات. النتائج قد تكون منحرفة.`,
      gmiWithoutDominant: Math.round(currentGmi + (currentGmi * adjustmentFactor)),
      cfiWithoutDominant: Math.round(currentCfi * (remainingWeight / 100)),
      hriWithoutDominant: Math.round(currentHri + (currentHri * adjustmentFactor * -1)),
    };
  }

  return {
    hasDominantEvent: false,
    dominancePercentage: topTopic.percentage,
  };
}

// ============ EXPLAINABILITY ============

export interface ExplainabilityData {
  topSources: {
    name: string;
    influence: number;
    sentiment: string;
  }[];
  topPhrases: {
    text: string;
    emotion: string;
    weight: number;
  }[];
  topKeywords: {
    word: string;
    frequency: number;
    sentiment: string;
  }[];
  methodology: string;
  methodologyAr: string;
}

export function generateExplainability(
  sources: { name: string; sentiment: number }[],
  phrases: { text: string; emotion: string; weight: number }[],
  keywords: { word: string; frequency: number; sentiment: string }[]
): ExplainabilityData {
  // Sort and take top items
  const topSources = sources
    .map(s => ({
      name: s.name,
      influence: Math.abs(s.sentiment),
      sentiment: s.sentiment > 0 ? 'positive' : s.sentiment < 0 ? 'negative' : 'neutral',
    }))
    .sort((a, b) => b.influence - a.influence)
    .slice(0, 5);

  const topPhrases = phrases
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 10);

  const topKeywords = keywords
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 15);

  return {
    topSources,
    topPhrases,
    topKeywords,
    methodology: `Analysis uses DCFT (Digital Consciousness Field Theory) combined with AI enhancement. 
    DCFT contributes 70% of the analysis weight, focusing on emotional resonance patterns.
    AI enhancement contributes 30%, improving accuracy for complex cases like sarcasm and cultural context.`,
    methodologyAr: `التحليل يستخدم نظرية DCFT (نظرية حقل الوعي الرقمي) مع تحسين الذكاء الاصطناعي.
    DCFT يساهم بـ 70% من وزن التحليل، مع التركيز على أنماط الرنين العاطفي.
    تحسين الذكاء الاصطناعي يساهم بـ 30%، لتحسين الدقة في الحالات المعقدة مثل السخرية والسياق الثقافي.`,
  };
}

// ============ BOT/MANIPULATION DETECTION ============

export interface ManipulationRisk {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskLevelAr: string;
  riskScore: number; // 0-100
  indicators: {
    type: string;
    typeAr: string;
    detected: boolean;
    count: number;
    severity: 'low' | 'medium' | 'high';
  }[];
  warning?: string;
  warningAr?: string;
  filteredCount: number;
}

export interface TextMetadata {
  text: string;
  accountAge?: number; // days
  postFrequency?: number; // posts per hour
  isDuplicate?: boolean;
  hasSpamPatterns?: boolean;
  source: string;
}

export function detectManipulation(texts: TextMetadata[]): ManipulationRisk {
  const indicators: ManipulationRisk['indicators'] = [];
  let filteredCount = 0;

  // 1. Check for new accounts (< 30 days)
  const newAccounts = texts.filter(t => t.accountAge !== undefined && t.accountAge < 30);
  indicators.push({
    type: 'New Accounts',
    typeAr: 'حسابات جديدة',
    detected: newAccounts.length > texts.length * 0.2,
    count: newAccounts.length,
    severity: newAccounts.length > texts.length * 0.4 ? 'high' : 'medium',
  });

  // 2. Check for duplicate texts
  const textSet = new Set<string>();
  const duplicates = texts.filter(t => {
    const normalized = t.text.toLowerCase().trim();
    if (textSet.has(normalized)) {
      return true;
    }
    textSet.add(normalized);
    return false;
  });
  indicators.push({
    type: 'Duplicate Content',
    typeAr: 'محتوى مكرر',
    detected: duplicates.length > texts.length * 0.1,
    count: duplicates.length,
    severity: duplicates.length > texts.length * 0.3 ? 'high' : 'medium',
  });
  filteredCount += duplicates.length;

  // 3. Check for high posting frequency (> 10 posts/hour)
  const highFrequency = texts.filter(t => t.postFrequency !== undefined && t.postFrequency > 10);
  indicators.push({
    type: 'High Posting Frequency',
    typeAr: 'تكرار نشر عالي',
    detected: highFrequency.length > texts.length * 0.1,
    count: highFrequency.length,
    severity: highFrequency.length > texts.length * 0.2 ? 'high' : 'medium',
  });

  // 4. Check for spam patterns
  const spamPatterns = texts.filter(t => t.hasSpamPatterns);
  indicators.push({
    type: 'Spam Patterns',
    typeAr: 'أنماط سبام',
    detected: spamPatterns.length > 0,
    count: spamPatterns.length,
    severity: spamPatterns.length > texts.length * 0.1 ? 'high' : 'low',
  });
  filteredCount += spamPatterns.length;

  // Calculate overall risk score
  const activeIndicators = indicators.filter(i => i.detected);
  let riskScore = 0;
  activeIndicators.forEach(i => {
    const severityWeight = i.severity === 'high' ? 30 : i.severity === 'medium' ? 15 : 5;
    riskScore += severityWeight;
  });
  riskScore = Math.min(100, riskScore);

  // Determine risk level
  let riskLevel: ManipulationRisk['riskLevel'];
  let riskLevelAr: string;
  let warning: string | undefined;
  let warningAr: string | undefined;

  if (riskScore >= 70) {
    riskLevel = 'critical';
    riskLevelAr = 'حرج';
    warning = '🚨 High manipulation risk detected. Results may be artificially influenced.';
    warningAr = '🚨 خطر تلاعب عالي. النتائج قد تكون متأثرة بشكل مصطنع.';
  } else if (riskScore >= 40) {
    riskLevel = 'high';
    riskLevelAr = 'مرتفع';
    warning = '⚠️ Elevated manipulation indicators detected.';
    warningAr = '⚠️ مؤشرات تلاعب مرتفعة.';
  } else if (riskScore >= 20) {
    riskLevel = 'medium';
    riskLevelAr = 'متوسط';
  } else {
    riskLevel = 'low';
    riskLevelAr = 'منخفض';
  }

  return {
    riskLevel,
    riskLevelAr,
    riskScore,
    indicators,
    warning,
    warningAr,
    filteredCount,
  };
}

// ============ COMBINED TRANSPARENCY REPORT ============

export interface TransparencyReport {
  geographicalBias: GeographicalBias;
  representationDisclaimer: RepresentationDisclaimer;
  dataFreshness: DataFreshness;
  eventDominance: EventDominance;
  manipulationRisk: ManipulationRisk;
  explainability?: ExplainabilityData;
  overallConfidence: number;
  overallConfidenceLabel: string;
  overallConfidenceLabelAr: string;
}

export function generateTransparencyReport(
  sources: SourceGeography[],
  analysisTime: Date,
  topics: TopicContribution[],
  texts: TextMetadata[],
  gmi: number,
  cfi: number,
  hri: number
): TransparencyReport {
  const geographicalBias = detectGeographicalBias(sources);
  const representationDisclaimer = getRepresentationDisclaimer();
  const dataFreshness = calculateDataFreshness(analysisTime);
  const eventDominance = detectEventDominance(topics, gmi, cfi, hri);
  const manipulationRisk = detectManipulation(texts);

  // Calculate overall confidence
  let overallConfidence = 100;
  
  // Reduce confidence based on issues
  if (geographicalBias.level === 'heavily_biased') overallConfidence -= 25;
  else if (geographicalBias.level === 'regional') overallConfidence -= 15;
  
  if (eventDominance.hasDominantEvent) overallConfidence -= 20;
  
  if (manipulationRisk.riskLevel === 'critical') overallConfidence -= 30;
  else if (manipulationRisk.riskLevel === 'high') overallConfidence -= 20;
  else if (manipulationRisk.riskLevel === 'medium') overallConfidence -= 10;

  overallConfidence = Math.max(0, overallConfidence);

  let overallConfidenceLabel: string;
  let overallConfidenceLabelAr: string;

  if (overallConfidence >= 80) {
    overallConfidenceLabel = 'High Confidence';
    overallConfidenceLabelAr = 'ثقة عالية';
  } else if (overallConfidence >= 60) {
    overallConfidenceLabel = 'Moderate Confidence';
    overallConfidenceLabelAr = 'ثقة متوسطة';
  } else if (overallConfidence >= 40) {
    overallConfidenceLabel = 'Low Confidence';
    overallConfidenceLabelAr = 'ثقة منخفضة';
  } else {
    overallConfidenceLabel = 'Very Low Confidence';
    overallConfidenceLabelAr = 'ثقة منخفضة جداً';
  }

  return {
    geographicalBias,
    representationDisclaimer,
    dataFreshness,
    eventDominance,
    manipulationRisk,
    overallConfidence,
    overallConfidenceLabel,
    overallConfidenceLabelAr,
  };
}
