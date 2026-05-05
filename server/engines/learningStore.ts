/**
 * AI Learning Store - The Accumulative Knowledge Core (ASI Edition)
 * Optimized for: Knowledge consolidation, Vector resonance, and Semantic Similarity.
 */

import { calculateAggregatedMetrics } from '../eventVectorModel';

// 1. تعريف الواجهات (Interfaces) لضمان استقرار النظام
export interface AnalysisRecord {
  id: string;
  timestamp: Date;
  question: { topic: string;[key: string]: any };
  context: any;
  result: {
    emotionalIntensity: number;
    valence: number;
    affectiveVector: Record<string, number>;
    [key: string]: any
  };
  engineContributions: any;
  learningMeta: any;
}

export interface LearningFeedback { [key: string]: any }
export interface LearningAdjustment { [key: string]: any }

// هيكل الذاكرة التراكمية العميقة
interface CumulativeKnowledge {
  topic: string;
  totalIntensity: number;
  averagePolarity: number;
  vectorSum: Record<string, number>;
  lastUpdated: Date;
  observationsCount: number;
  history: Array<{ intensity: number; valence: number; timestamp: Date }>; // مضاف للبحث عن التشابه
}

// المخازن (In-Memory Stores)
const analysisStore: Map<string, AnalysisRecord> = new Map();
const feedbackStore: Map<string, LearningFeedback> = new Map();
const adjustmentStore: Map<string, LearningAdjustment> = new Map();
const globalKnowledgeBase: Map<string, CumulativeKnowledge> = new Map();

/**
 * 2. دالة البحث عن التشابه (Similarity Logic)
 * مدمجة من ملف Compression المفقود للربط بين الأحداث المتشابهة
 */
function findSimilarResonance(current: { intensity: number; valence: number }, history: CumulativeKnowledge['history']) {
  return history.filter(past => {
    const intensityDiff = Math.abs(current.intensity - past.intensity);
    const valenceDiff = Math.abs(current.valence - past.valence);
    // إذا كان الفرق أقل من 0.1، نعتبره "رنيناً متكرراً"
    return intensityDiff < 0.1 && valenceDiff < 0.1;
  });
}

/**
 * 3. وظيفة التراكم المعرفي الذاتي (ASI Consolidation)
 * تدمج المتجه الجديد في الذاكرة العميقة مع التحقق من الرنين
 */
function integrateIntoCumulativeMemory(topic: string, result: AnalysisRecord['result']) {
  const existing = globalKnowledgeBase.get(topic) || {
    topic,
    totalIntensity: 0,
    averagePolarity: 0,
    vectorSum: { joy: 0, fear: 0, anger: 0, hope: 0 },
    lastUpdated: new Date(),
    observationsCount: 0,
    history: []
  };

  // التحقق من الرنين (هل هذا الحدث يشبه أحداثاً سابقة لهذا الموضوع؟)
  const resonances = findSimilarResonance(
    { intensity: result.emotionalIntensity, valence: result.valence },
    existing.history
  );

  if (resonances.length > 0) {
    console.log(`[LearningStore] 🧠 Semantic Resonance detected for ${topic}. Similarity count: ${resonances.length}`);
  }

  // دمج المتجهات وتحديث المتوسطات
  existing.observationsCount++;
  existing.totalIntensity = (existing.totalIntensity + result.emotionalIntensity) / 2;
  existing.averagePolarity = (existing.averagePolarity + result.valence) / 2;

  // دمج المتجه العاطفي
  Object.keys(result.affectiveVector || {}).forEach(emotion => {
    existing.vectorSum[emotion] = (existing.vectorSum[emotion] || 0) + result.affectiveVector[emotion];
  });

  // إضافة الحدث الحالي لتاريخ الموضوع للبحث المستقبلي
  existing.history.push({
    intensity: result.emotionalIntensity,
    valence: result.valence,
    timestamp: new Date()
  });

  // الاحتفاظ بآخر 100 سجل لكل موضوع لتوفير الذاكرة
  if (existing.history.length > 100) existing.history.shift();

  existing.lastUpdated = new Date();
  globalKnowledgeBase.set(topic, existing);

  console.log(`[LearningStore] Knowledge base updated for [${topic}]. Observations: ${existing.observationsCount}`);
}

/**
 * 4. المطور: تخزين السجل مع تفعيل "التعلم اللحظي"
 */
export function storeAnalysisRecord(
  question: AnalysisRecord['question'],
  context: AnalysisRecord['context'],
  result: AnalysisRecord['result'],
  engineContributions: AnalysisRecord['engineContributions']
): AnalysisRecord {
  const id = `AML-${Date.now()}`;

  const record: AnalysisRecord = {
    id,
    timestamp: new Date(),
    question,
    context,
    result,
    engineContributions,
    learningMeta: {
      wasCorrect: null,
      actualOutcome: null,
      feedbackReceived: false,
      learnedAt: new Date()
    },
  };

  analysisStore.set(id, record);

  // إطلاق التراكم والتعلم فوراً
  integrateIntoCumulativeMemory(question.topic || 'general', result);

  return record;
}

/**
 * 5. استخراج "البصيرة التراكمية" (Deep Memory Recall)
 * يستخدمها الـ Knowledge Engine والـ Pipeline للإجابة بوعي تاريخي
 */
export function getCumulativeInsight(topic: string) {
  const knowledge = globalKnowledgeBase.get(topic);
  if (!knowledge) return "My cognitive field has no prior memory of this specific vector.";

  return {
    observationsCount: knowledge.observationsCount,
    totalIntensity: knowledge.totalIntensity,
    averagePolarity: knowledge.averagePolarity,
    lastUpdate: knowledge.lastUpdated,
    summary: `Based on my accumulation of ${knowledge.observationsCount} field observations, the resonance of ${topic} remains at an intensity of ${knowledge.totalIntensity.toFixed(2)}.`
  };
}

// 6. دوال التغذية الراجعة (Feedback System) - محفوظة لضمان العمل
export function storeFeedback(id: string, feedback: LearningFeedback) {
  feedbackStore.set(id, feedback);
}

export function applyLearningAdjustment(topic: string, adjustment: LearningAdjustment) {
  adjustmentStore.set(topic, adjustment);
}

export function getStoreStats() {
  return {
    totalRecords: analysisStore.size,
    learnedTopics: globalKnowledgeBase.size,
    lastLearningPulse: new Date()
  };
}