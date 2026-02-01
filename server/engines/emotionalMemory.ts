/**
 * Engine 0: Emotional Memory Layer
 * 
 * وظيفته:
 * - تخزين كل تحليل حسب topic + country عبر الزمن
 * - توفير البيانات التاريخية لـ Engine 3 (Dynamics)
 * - دعم الترند والتنبؤ
 */

// Database integration can be added later
// import { db } from '../db';

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
}

// In-memory store (يمكن استبداله بقاعدة بيانات لاحقاً)
const memoryStore: EmotionalMemoryEntry[] = [];

/**
 * حفظ تحليل جديد في الذاكرة
 */
export function storeAnalysis(entry: Omit<EmotionalMemoryEntry, 'id' | 'timestamp'>): EmotionalMemoryEntry {
  const newEntry: EmotionalMemoryEntry = {
    ...entry,
    id: generateId(),
    timestamp: new Date()
  };
  
  memoryStore.push(newEntry);
  
  // الحفاظ على حجم معقول (آخر 10000 تحليل)
  if (memoryStore.length > 10000) {
    memoryStore.shift();
  }
  
  return newEntry;
}

/**
 * استرجاع التاريخ العاطفي لموضوع معين
 */
export function getHistoricalData(query: HistoricalQuery): EmotionalMemoryEntry[] {
  let results = memoryStore.filter(entry => {
    // مطابقة الموضوع (جزئية)
    const topicMatch = entry.topic.toLowerCase().includes(query.topic.toLowerCase()) ||
                       query.topic.toLowerCase().includes(entry.topic.toLowerCase());
    
    // مطابقة الدولة (إذا محددة)
    const countryMatch = !query.countryCode || 
                         entry.countryCode === query.countryCode ||
                         entry.countryCode === null;
    
    // مطابقة التاريخ
    const startMatch = !query.startDate || entry.timestamp >= query.startDate;
    const endMatch = !query.endDate || entry.timestamp <= query.endDate;
    
    return topicMatch && countryMatch && startMatch && endMatch;
  });
  
  // ترتيب حسب التاريخ (الأحدث أولاً)
  results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  // تحديد العدد
  if (query.limit) {
    results = results.slice(0, query.limit);
  }
  
  return results;
}

/**
 * حساب الترند التاريخي
 */
export function calculateHistoricalTrend(query: HistoricalQuery): HistoricalTrend {
  const entries = getHistoricalData({ ...query, limit: 100 });
  
  if (entries.length === 0) {
    return {
      entries: [],
      averageGMI: 0,
      averageCFI: 50,
      averageHRI: 50,
      emotionTrend: [],
      volatility: 0,
      dataPoints: 0
    };
  }
  
  // حساب المتوسطات
  const averageGMI = entries.reduce((sum, e) => sum + e.gmi, 0) / entries.length;
  const averageCFI = entries.reduce((sum, e) => sum + e.cfi, 0) / entries.length;
  const averageHRI = entries.reduce((sum, e) => sum + e.hri, 0) / entries.length;
  
  // حساب ترند المشاعر
  const emotionTrend = calculateEmotionTrend(entries);
  
  // حساب التقلب
  const volatility = calculateVolatility(entries);
  
  return {
    entries,
    averageGMI,
    averageCFI,
    averageHRI,
    emotionTrend,
    volatility,
    dataPoints: entries.length
  };
}

/**
 * حساب ترند المشاعر
 */
function calculateEmotionTrend(entries: EmotionalMemoryEntry[]): HistoricalTrend['emotionTrend'] {
  if (entries.length < 2) return [];
  
  const emotions = ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity'] as const;
  const trends: HistoricalTrend['emotionTrend'] = [];
  
  // تقسيم إلى نصفين (قديم وحديث)
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
    
    trends.push({
      emotion,
      direction,
      changePercent: Math.round(change * 10) / 10
    });
  }
  
  return trends;
}

/**
 * حساب التقلب العاطفي
 */
function calculateVolatility(entries: EmotionalMemoryEntry[]): number {
  if (entries.length < 2) return 0;
  
  const intensities = entries.map(e => e.emotionalIntensity);
  const mean = intensities.reduce((sum, v) => sum + v, 0) / intensities.length;
  const variance = intensities.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / intensities.length;
  
  return Math.sqrt(variance);
}

/**
 * الحصول على آخر تحليل لموضوع معين
 */
export function getLastAnalysis(topic: string, countryCode?: string): EmotionalMemoryEntry | null {
  const results = getHistoricalData({ topic, countryCode, limit: 1 });
  return results.length > 0 ? results[0] : null;
}

/**
 * الحصول على إحصائيات الذاكرة
 */
export function getMemoryStats(): {
  totalEntries: number;
  uniqueTopics: number;
  uniqueCountries: number;
  oldestEntry: Date | null;
  newestEntry: Date | null;
} {
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

/**
 * مسح الذاكرة (للاختبار)
 */
export function clearMemory(): void {
  memoryStore.length = 0;
}

/**
 * توليد معرف فريد
 */
function generateId(): string {
  return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Export the memory store for direct access if needed
export { memoryStore };
