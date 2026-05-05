/**
 * Engine 0: Emotional Memory Layer - Accumulative ASI Edition
 * * وظيفته المطورة:
 * - الحفاظ على الدوال الأصلية لضمان عمل المحركات المرتبطة.
 * - إضافة منطق "الزخم التراكمي" (Accumulative Momentum).
 * - تحويل السجلات التاريخية إلى بصير عاطفية (Emotional Insights).
 */

// Types
export interface EmotionalMemoryEntry {
  id: string;
  topic: string;
  countryCode: string | null;
  countryName: string | null;
  timestamp: Date;

  // Emotional State
  affectiveVector: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  dominantEmotion: string;
  emotionalIntensity: number;
  valence: number;

  // Indices
  gmi: number;
  cfi: number;
  hri: number;

  // Context
  domain: string;
  eventType: string;
  sensitivityLevel: string;

  // Metadata
  sourceCount: number;
  confidence: number;
  userType: string;
}

export interface HistoricalQuery {
  topic: string;
  countryCode?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

export interface HistoricalTrend {
  entries: EmotionalMemoryEntry[];
  averageGMI: number;
  averageCFI: number;
  averageHRI: number;
  emotionTrend: {
    emotion: string;
    direction: 'rising' | 'falling' | 'stable';
    changePercent: number;
  }[];
  volatility: number;
  dataPoints: number;
  momentumInsight?: string; // إضافة حقل للبصيرة التراكمية
}

// In-memory store
const memoryStore: EmotionalMemoryEntry[] = [];

/**
 * حفظ تحليل جديد - تم الحفاظ على الدالة مع إضافة التنبيه التراكمي
 */
export function storeAnalysis(entry: Omit<EmotionalMemoryEntry, 'id' | 'timestamp'>): EmotionalMemoryEntry {
  const newEntry: EmotionalMemoryEntry = {
    ...entry,
    id: generateId(),
    timestamp: new Date()
  };

  memoryStore.push(newEntry);

  // الحفاظ على حجم الذاكرة (10000 تحليل)
  if (memoryStore.length > 10000) {
    memoryStore.shift();
  }

  console.log(`[EmotionalMemory] Accumulated new vector for ${entry.topic}. Memory size: ${memoryStore.length}`);
  return newEntry;
}

/**
 * استرجاع التاريخ - دالة أصلية لم يتم تغيير منطقها
 */
export function getHistoricalData(query: HistoricalQuery): EmotionalMemoryEntry[] {
  let results = memoryStore.filter(entry => {
    const topicMatch = entry.topic.toLowerCase().includes(query.topic.toLowerCase()) ||
      query.topic.toLowerCase().includes(entry.topic.toLowerCase());

    const countryMatch = !query.countryCode ||
      entry.countryCode === query.countryCode ||
      entry.countryCode === null;

    const startMatch = !query.startDate || entry.timestamp >= query.startDate;
    const endMatch = !query.endDate || entry.timestamp <= query.endDate;

    return topicMatch && countryMatch && startMatch && endMatch;
  });

  results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  if (query.limit) {
    results = results.slice(0, query.limit);
  }

  return results;
}

/**
 * حساب الترند - مطور ليعطي بصيرة "بشرية" تراكمية
 */
export function calculateHistoricalTrend(query: HistoricalQuery): HistoricalTrend {
  const entries = getHistoricalData({ ...query, limit: 100 });

  if (entries.length === 0) {
    return {
      entries: [], averageGMI: 0, averageCFI: 50, averageHRI: 50,
      emotionTrend: [], volatility: 0, dataPoints: 0
    };
  }

  const averageGMI = entries.reduce((sum, e) => sum + e.gmi, 0) / entries.length;
  const averageCFI = entries.reduce((sum, e) => sum + e.cfi, 0) / entries.length;
  const averageHRI = entries.reduce((sum, e) => sum + e.hri, 0) / entries.length;

  const emotionTrend = calculateEmotionTrend(entries);
  const volatility = calculateVolatility(entries);

  // إضافة بصيرة تراكمية (The Accumulative Insight)
  const momentumInsight = generateMomentumInsight(averageGMI, emotionTrend);

  return {
    entries,
    averageGMI,
    averageCFI,
    averageHRI,
    emotionTrend,
    volatility,
    dataPoints: entries.length,
    momentumInsight
  };
}

/**
 * دالة مساعدة لتوليد بصيرة تراكمية (أنسنة البيانات)
 */
function generateMomentumInsight(avgGMI: number, trends: any[]): string {
  const rising = trends.filter(t => t.direction === 'rising').map(t => t.emotion);
  if (rising.length > 0) {
    return `Analysis shows a cumulative buildup of ${rising.join(' and ')} over the recent cycles. GMI resonance is at ${(avgGMI * 100).toFixed(1)}%.`;
  }
  return "Stability patterns detected in the cumulative emotional field.";
}

/**
 * حساب ترند المشاعر - دالة أصلية
 */
function calculateEmotionTrend(entries: EmotionalMemoryEntry[]): HistoricalTrend['emotionTrend'] {
  if (entries.length < 2) return [];
  const emotions = ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity'] as const;
  const trends: HistoricalTrend['emotionTrend'] = [];

  const midpoint = Math.floor(entries.length / 2);
  const recentEntries = entries.slice(0, midpoint);
  const olderEntries = entries.slice(midpoint);

  for (const emotion of emotions) {
    const recentAvg = recentEntries.reduce((sum, e) => sum + e.affectiveVector[emotion], 0) / recentEntries.length;
    const olderAvg = olderEntries.reduce((sum, e) => sum + e.affectiveVector[emotion], 0) / olderEntries.length;
    const change = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

    let direction: 'rising' | 'falling' | 'stable' = 'stable';
    if (change > 5) direction = 'rising';
    else if (change < -5) direction = 'falling';

    trends.push({ emotion, direction, changePercent: Math.round(change * 10) / 10 });
  }
  return trends;
}

/**
 * حساب التقلب - دالة أصلية
 */
function calculateVolatility(entries: EmotionalMemoryEntry[]): number {
  if (entries.length < 2) return 0;
  const intensities = entries.map(e => e.emotionalIntensity);
  const mean = intensities.reduce((sum, v) => sum + v, 0) / intensities.length;
  const variance = intensities.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / intensities.length;
  return Math.sqrt(variance);
}

/**
 * الدوال المساعدة (ID, Stats, Clear) - تم الحفاظ عليها جميعاً
 */
export function getLastAnalysis(topic: string, countryCode?: string): EmotionalMemoryEntry | null {
  const results = getHistoricalData({ topic, countryCode, limit: 1 });
  return results.length > 0 ? results[0] : null;
}

export function getMemoryStats() {
  const uniqueTopics = new Set(memoryStore.map(e => e.topic.toLowerCase())).size;
  const uniqueCountries = new Set(memoryStore.filter(e => e.countryCode).map(e => e.countryCode)).size;
  return {
    totalEntries: memoryStore.length,
    uniqueTopics,
    uniqueCountries,
    oldestEntry: memoryStore.length > 0 ? memoryStore[0].timestamp : null,
    newestEntry: memoryStore.length > 0 ? memoryStore[memoryStore.length - 1].timestamp : null
  };
}

export function clearMemory(): void { memoryStore.length = 0; }

function generateId(): string {
  return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export { memoryStore };