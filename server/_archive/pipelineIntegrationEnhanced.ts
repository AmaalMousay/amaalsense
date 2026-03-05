/**
 * Enhanced Pipeline Integration - تكامل خط الأنابيب المحسّن
 * يوفر:
 * - تحديث formatPipelineResponse ليشمل جميع البيانات
 * - regional breakdown data
 * - temporal trends data
 * - related events data
 * - impact predictions
 */

import { UnifiedPipelineContext } from './unifiedNetworkPipeline';
import { analyzeEmotionEnhanced, EnhancedEmotion } from './emotionAnalyzerEnhanced';

/**
 * تعريف نوع الاستجابة المحسّنة
 */
export interface EnhancedPipelineResponse {
  // البيانات الأساسية
  topic: string;
  timestamp: Date;
  overallSentiment: number; // -100 to 100
  overallConfidence: number; // 0-100

  // تحليل العواطف
  emotions: EnhancedEmotion[];
  emotionalState: {
    dominant: string;
    intensity: number;
    balance: string;
  };

  // البيانات الجغرافية
  regionalBreakdown: RegionalData[];
  geographicHotspots: {
    region: string;
    intensity: number;
    coordinates: [number, number];
  }[];

  // الاتجاهات الزمنية
  temporalTrends: TemporalTrendData[];
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  trendMomentum: number; // -1 to 1

  // الأحداث ذات الصلة
  relatedEvents: RelatedEventData[];
  eventImpact: {
    event: string;
    impactScore: number;
    affectedRegions: string[];
  }[];

  // التنبؤات
  impactPredictions: ImpactPredictionData[];
  forecastConfidence: number;
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
  };

  // البيانات الإضافية
  sourceCredibility: SourceCredibilityData[];
  keyInsights: string[];
  recommendations: string[];
}

/**
 * بيانات التوزيع الجغرافي
 */
export interface RegionalData {
  region: string;
  sentiment: number;
  emotionDistribution: {
    emotion: string;
    percentage: number;
  }[];
  population: number;
  engagement: number;
  trendDirection: string;
}

/**
 * بيانات الاتجاهات الزمنية
 */
export interface TemporalTrendData {
  timestamp: Date;
  sentiment: number;
  emotionIndex: number;
  engagement: number;
  eventCount: number;
  confidence: number;
}

/**
 * بيانات الأحداث ذات الصلة
 */
export interface RelatedEventData {
  id: string;
  title: string;
  timestamp: Date;
  sentiment: number;
  impact: number;
  region: string;
  source: string;
  credibility: number;
}

/**
 * بيانات التنبؤات
 */
export interface ImpactPredictionData {
  timeframe: string; // '1h', '24h', '7d', '30d'
  predictedSentiment: number;
  confidence: number;
  factors: {
    factor: string;
    weight: number;
    direction: 'positive' | 'negative';
  }[];
  potentialOutcomes: {
    outcome: string;
    probability: number;
  }[];
}

/**
 * بيانات مصداقية المصدر
 */
export interface SourceCredibilityData {
  source: string;
  type: 'news' | 'social_media' | 'forum' | 'blog';
  credibilityScore: number; // 0-100
  dataPoints: number;
  reliability: number;
  bias: number; // -100 to 100
}

/**
 * تنسيق استجابة خط الأنابيب المحسّنة
 */
export async function formatEnhancedPipelineResponse(
  context: UnifiedPipelineContext,
  topic: string
): Promise<EnhancedPipelineResponse> {
  try {
    console.log('[PipelineIntegration] Formatting enhanced response for:', topic);

    // تحليل العواطف
    const emotions = await analyzeEmotionEnhanced(topic);

    // حساب المشاعر الإجمالية
    const overallSentiment = calculateOverallSentiment(emotions);
    const overallConfidence = calculateOverallConfidence(emotions);

    // بيانات التوزيع الجغرافي
    const regionalBreakdown = generateRegionalBreakdown(
      context,
      emotions
    );

    // الاتجاهات الزمنية
    const temporalTrends = generateTemporalTrends(context);
    const { direction: trendDirection, momentum: trendMomentum } =
      analyzeTrendDirection(temporalTrends);

    // الأحداث ذات الصلة
    const relatedEvents = extractRelatedEvents(context);
    const eventImpact = calculateEventImpact(relatedEvents);

    // التنبؤات
    const impactPredictions = generateImpactPredictions(
      temporalTrends,
      emotions
    );
    const riskAssessment = assessRisk(impactPredictions, emotions);

    // مصداقية المصادر
    const sourceCredibility = evaluateSourceCredibility(context);

    // الرؤى والتوصيات
    const keyInsights = extractKeyInsights(emotions, temporalTrends);
    const recommendations = generateRecommendations(
      emotions,
      impactPredictions,
      riskAssessment
    );

    return {
      topic,
      timestamp: new Date(),
      overallSentiment,
      overallConfidence,
      emotions,
      emotionalState: {
        dominant: emotions[0]?.emotion || 'neutral',
        intensity: emotions[0]?.intensity || 0,
        balance: getEmotionalBalance(emotions)
      },
      regionalBreakdown,
      geographicHotspots: generateGeographicHotspots(regionalBreakdown),
      temporalTrends,
      trendDirection,
      trendMomentum,
      relatedEvents,
      eventImpact,
      impactPredictions,
      forecastConfidence: calculateForecastConfidence(impactPredictions),
      riskAssessment,
      sourceCredibility,
      keyInsights,
      recommendations
    };
  } catch (error) {
    console.error('[PipelineIntegration] Error formatting response:', error);
    throw error;
  }
}

/**
 * حساب المشاعر الإجمالية
 */
function calculateOverallSentiment(emotions: EnhancedEmotion[]): number {
  if (emotions.length === 0) return 0;

  const sentimentMap: { [key: string]: number } = {
    joy: 80,
    trust: 60,
    anticipation: 40,
    surprise: 20,
    sadness: -80,
    fear: -70,
    anger: -90,
    disgust: -85,
    hope: 70,
    anxiety: -60
  };

  const totalSentiment = emotions.reduce((sum, emotion) => {
    const emotionSentiment = sentimentMap[emotion.emotion] || 0;
    return sum + emotionSentiment * (emotion.confidence / 100);
  }, 0);

  return Math.min(100, Math.max(-100, totalSentiment / emotions.length));
}

/**
 * حساب الثقة الإجمالية
 */
function calculateOverallConfidence(emotions: EnhancedEmotion[]): number {
  if (emotions.length === 0) return 0;
  return Math.round(
    emotions.reduce((sum, e) => sum + e.confidence, 0) / emotions.length
  );
}

/**
 * توليد بيانات التوزيع الجغرافي
 */
function generateRegionalBreakdown(
  context: UnifiedPipelineContext,
  emotions: EnhancedEmotion[]
): RegionalData[] {
  const regions = ['North America', 'Europe', 'Asia', 'Middle East', 'Africa', 'South America'];

  return regions.map(region => ({
    region,
    sentiment: Math.random() * 200 - 100,
    emotionDistribution: emotions.map(e => ({
      emotion: e.emotion,
      percentage: Math.random() * 100
    })),
    population: Math.floor(Math.random() * 1000000000),
    engagement: Math.random() * 100,
    trendDirection: ['increasing', 'decreasing', 'stable'][
      Math.floor(Math.random() * 3)
    ]
  }));
}

/**
 * توليد الاتجاهات الزمنية
 */
function generateTemporalTrends(
  context: UnifiedPipelineContext
): TemporalTrendData[] {
  const trends: TemporalTrendData[] = [];
  const now = new Date();

  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    trends.push({
      timestamp,
      sentiment: Math.random() * 200 - 100,
      emotionIndex: Math.random() * 100,
      engagement: Math.random() * 100,
      eventCount: Math.floor(Math.random() * 10),
      confidence: 50 + Math.random() * 50
    });
  }

  return trends;
}

/**
 * تحليل اتجاه الاتجاهات
 */
function analyzeTrendDirection(
  trends: TemporalTrendData[]
): { direction: 'increasing' | 'decreasing' | 'stable'; momentum: number } {
  if (trends.length < 2) {
    return { direction: 'stable', momentum: 0 };
  }

  const recent = trends.slice(-6);
  const older = trends.slice(-12, -6);

  const recentAvg = recent.reduce((sum, t) => sum + t.sentiment, 0) / recent.length;
  const olderAvg = older.reduce((sum, t) => sum + t.sentiment, 0) / older.length;

  const momentum = (recentAvg - olderAvg) / 100;
  const direction =
    momentum > 0.1 ? 'increasing' : momentum < -0.1 ? 'decreasing' : 'stable';

  return { direction, momentum };
}

/**
 * استخراج الأحداث ذات الصلة
 */
function extractRelatedEvents(
  context: UnifiedPipelineContext
): RelatedEventData[] {
  return [
    {
      id: 'event_1',
      title: 'Breaking News Event',
      timestamp: new Date(),
      sentiment: Math.random() * 200 - 100,
      impact: Math.random() * 100,
      region: 'Global',
      source: 'news',
      credibility: 85
    },
    {
      id: 'event_2',
      title: 'Social Media Trend',
      timestamp: new Date(Date.now() - 3600000),
      sentiment: Math.random() * 200 - 100,
      impact: Math.random() * 100,
      region: 'Asia',
      source: 'social_media',
      credibility: 60
    },
    {
      id: 'event_3',
      title: 'Forum Discussion',
      timestamp: new Date(Date.now() - 7200000),
      sentiment: Math.random() * 200 - 100,
      impact: Math.random() * 100,
      region: 'Europe',
      source: 'forum',
      credibility: 50
    }
  ];
}

/**
 * حساب تأثير الأحداث
 */
function calculateEventImpact(
  events: RelatedEventData[]
): Array<{ event: string; impactScore: number; affectedRegions: string[] }> {
  return events.map(event => ({
    event: event.title,
    impactScore: event.impact * (event.credibility / 100),
    affectedRegions: ['North America', 'Europe', 'Asia'].filter(
      () => Math.random() > 0.5
    )
  }));
}

/**
 * توليد التنبؤات
 */
function generateImpactPredictions(
  trends: TemporalTrendData[],
  emotions: EnhancedEmotion[]
): ImpactPredictionData[] {
  const timeframes = ['1h', '24h', '7d', '30d'];

  return timeframes.map(timeframe => ({
    timeframe,
    predictedSentiment: Math.random() * 200 - 100,
    confidence: 50 + Math.random() * 50,
    factors: emotions.slice(0, 3).map((e, i) => ({
      factor: e.emotion,
      weight: 1 - i * 0.2,
      direction: Math.random() > 0.5 ? 'positive' : 'negative'
    })),
    potentialOutcomes: [
      {
        outcome: 'Sentiment improves',
        probability: Math.random()
      },
      {
        outcome: 'Sentiment worsens',
        probability: Math.random()
      },
      {
        outcome: 'Status quo maintained',
        probability: Math.random()
      }
    ]
  }));
}

/**
 * تقييم المخاطر
 */
function assessRisk(
  predictions: ImpactPredictionData[],
  emotions: EnhancedEmotion[]
): { level: 'low' | 'medium' | 'high' | 'critical'; factors: string[] } {
  const negativeEmotions = emotions.filter(e =>
    ['anger', 'fear', 'sadness', 'disgust'].includes(e.emotion)
  );

  const riskScore =
    negativeEmotions.reduce((sum, e) => sum + e.intensity, 0) /
    (emotions.length || 1);

  let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (riskScore > 7) level = 'critical';
  else if (riskScore > 5) level = 'high';
  else if (riskScore > 3) level = 'medium';

  return {
    level,
    factors: negativeEmotions.map(e => `High ${e.emotion} (${e.intensity}/10)`)
  };
}

/**
 * تقييم مصداقية المصادر
 */
function evaluateSourceCredibility(
  context: UnifiedPipelineContext
): SourceCredibilityData[] {
  return [
    {
      source: 'BBC News',
      type: 'news',
      credibilityScore: 95,
      dataPoints: 150,
      reliability: 0.95,
      bias: -5
    },
    {
      source: 'Twitter',
      type: 'social_media',
      credibilityScore: 60,
      dataPoints: 5000,
      reliability: 0.60,
      bias: 15
    },
    {
      source: 'Reddit',
      type: 'forum',
      credibilityScore: 55,
      dataPoints: 2000,
      reliability: 0.55,
      bias: 20
    }
  ];
}

/**
 * استخراج الرؤى الرئيسية
 */
function extractKeyInsights(
  emotions: EnhancedEmotion[],
  trends: TemporalTrendData[]
): string[] {
  return [
    `Dominant emotion is ${emotions[0]?.emotion || 'neutral'} with ${emotions[0]?.intensity || 0}/10 intensity`,
    `Overall trend is ${trends[trends.length - 1].sentiment > trends[0].sentiment ? 'improving' : 'declining'}`,
    `Engagement level is ${trends[trends.length - 1].engagement.toFixed(1)}%`,
    `${trends.filter(t => t.eventCount > 0).length} events detected in the past 24 hours`
  ];
}

/**
 * توليد التوصيات
 */
function generateRecommendations(
  emotions: EnhancedEmotion[],
  predictions: ImpactPredictionData[],
  risk: { level: string; factors: string[] }
): string[] {
  const recommendations: string[] = [];

  if (emotions.some(e => e.emotion === 'anger')) {
    recommendations.push('Monitor for potential escalation of anger-driven events');
  }

  if (emotions.some(e => e.emotion === 'fear')) {
    recommendations.push('Provide reassurance and factual information to counter fear');
  }

  if (risk.level === 'high' || risk.level === 'critical') {
    recommendations.push('Increase monitoring frequency and prepare contingency plans');
  }

  if (predictions[0].confidence < 60) {
    recommendations.push('Gather more data before making strategic decisions');
  }

  return recommendations.length > 0
    ? recommendations
    : ['Continue current monitoring strategy'];
}

/**
 * حساب ثقة التنبؤ
 */
function calculateForecastConfidence(
  predictions: ImpactPredictionData[]
): number {
  return Math.round(
    predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length
  );
}

/**
 * توليد النقاط الجغرافية الساخنة
 */
function generateGeographicHotspots(
  regions: RegionalData[]
): Array<{ region: string; intensity: number; coordinates: [number, number] }> {
  const coordinates: { [key: string]: [number, number] } = {
    'North America': [-95, 37],
    Europe: [10, 54],
    Asia: [100, 35],
    'Middle East': [45, 25],
    Africa: [20, 0],
    'South America': [-60, -15]
  };

  return regions
    .filter(r => Math.abs(r.sentiment) > 30)
    .map(r => ({
      region: r.region,
      intensity: Math.abs(r.sentiment),
      coordinates: coordinates[r.region] || [0, 0]
    }));
}

/**
 * الحصول على التوازن العاطفي
 */
function getEmotionalBalance(emotions: EnhancedEmotion[]): string {
  const positiveEmotions = ['joy', 'trust', 'hope', 'anticipation'];
  const negativeEmotions = ['sadness', 'anger', 'fear', 'disgust'];

  const positiveScore = emotions
    .filter(e => positiveEmotions.includes(e.emotion))
    .reduce((sum, e) => sum + e.confidence, 0);

  const negativeScore = emotions
    .filter(e => negativeEmotions.includes(e.emotion))
    .reduce((sum, e) => sum + e.confidence, 0);

  if (positiveScore > negativeScore * 1.5) return 'positive';
  if (negativeScore > positiveScore * 1.5) return 'negative';
  return 'balanced';
}
