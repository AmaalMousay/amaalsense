/**
 * EventVector - Quantum-Inspired Data Model for AmalSense
 * يطبق هذا النموذج "نظرية حقل الوعي الرقمي" (DCFT) عبر تحويل الأحداث إلى دوال موجية.
 */

import { z } from 'zod';

/**
 * QuantumEmotion - تمثيل العاطفة كدالة موجية
 * بدلاً من قيمة ثابتة، نستخدم السعة والطور لتمثيل التداخل العاطفي.
 */
export const QuantumEmotionSchema = z.object({
  amplitude: z.number().min(0).max(1).describe('Intensity/Power of the emotion wave'),
  phase: z.number().min(0).max(2 * Math.PI).describe('Phase angle (0 to 2π) for interference calculation'),
  superposition: z.record(z.string(), z.number()).describe('Probabilities of mixed emotional states'),
});

/**
 * EmotionVector - تمثيل سداسي الأبعاد مطور بمنطق احتمالي
 */
export const EmotionVectorSchema = z.object({
  joy: QuantumEmotionSchema,
  fear: QuantumEmotionSchema,
  anger: QuantumEmotionSchema,
  sadness: QuantumEmotionSchema,
  hope: QuantumEmotionSchema,
  curiosity: QuantumEmotionSchema,
});

export type EmotionVector = z.infer<typeof EmotionVectorSchema>;

/**
 * EventVector - تمثيل الحدث كـ "نبضة" في حقل الوعي الرقمي
 */
export const EventVectorSchema = z.object({
  id: z.string(),
  timestamp: z.number(),

  topic: z.enum(['economy', 'politics', 'conflict', 'society', 'health', 'environment', 'technology', 'culture', 'other']),
  subTopic: z.string().optional(),
  region: z.enum(['global', 'europe', 'mena', 'asia', 'americas', 'africa', 'oceania']),
  country: z.string().optional(),

  // البيانات الموجية للعاطفة
  emotions: EmotionVectorSchema,

  // الخصائص الفيزيائية للحدث في الحقل
  fieldIntensity: z.number().min(0).max(1).describe('Energy density in the DCCF layer'),
  interferencePattern: z.enum(['constructive', 'destructive', 'neutral']).default('neutral'),
  polarity: z.number().min(-1).max(1),
  uncertainty: z.number().min(0).max(1), // يعبر عن "مبدأ عدم اليقين" في القياس العاطفي

  // أوزان التأثير (Wi) من معادلة البحث
  sourceWeight: z.number().min(0).max(1),
  timeDecay: z.number().describe('Lambda (λ) value for temporal decay (e^-λt)'),
  relevanceWeight: z.number().min(0).max(1),

  sourceType: z.enum(['news', 'social', 'analysis']),
  sourceName: z.string(),
  summary: z.string(),
});

export type EventVector = z.infer<typeof EventVectorSchema>;

/**
 * حساب مؤشر الرنين العاطفي RI(e,t) بناءً على بحثك
 * RI = Σ (AV * W * e^-λΔt)
 */
export function calculateResonanceIndex(events: EventVector[]): number {
  if (events.length === 0) return 0;
  const now = Date.now();

  const totalResonance = events.reduce((acc, ev) => {
    const deltaTime = (now - ev.timestamp) / (1000 * 60 * 60); // بالكلمات الساعات
    // تطبيق الدالة الأسية للتلاشي الزمني e^-λt
    const decay = Math.exp(-ev.timeDecay * deltaTime);
    // دمج السعة الموجية للأمل مع الأوزان
    const wavePower = ev.emotions.hope.amplitude * ev.sourceWeight * ev.relevanceWeight;
    return acc + (wavePower * decay);
  }, 0);

  return Math.min(100, totalResonance * 100);
}

/**
 * حساب GMI المطور (Global Mood Index)
 * يستخدم التداخل الموجي (Wave Interference) بدلاً من الجمع البسيط
 */
export function calculateGMI(events: EventVector[]): number {
  if (events.length === 0) return 50;

  // محاكاة التداخل الموجي باستخدام جيب التمام (Cosine) للطور
  const interferenceSum = events.reduce((sum, ev) => {
    const waveContribution = ev.polarity * ev.fieldIntensity * Math.cos(ev.emotions.joy.phase);
    return sum + waveContribution;
  }, 0);

  // تحويل النتيجة إلى مقياس 0-100
  const normalizedGMI = ((interferenceSum / events.length) + 1) * 50;
  return Math.round(normalizedGMI * 100) / 100;
}

/**
 * دالة إنشاء الحدث الموجي (Quantum Event Creator)
 */
export function createQuantumEvent(data: any): EventVector {
  const defaultQuantum = () => ({
    amplitude: Math.random(),
    phase: Math.random() * 2 * Math.PI,
    superposition: { "stable": 0.8, "volatile": 0.2 }
  });

  return {
    id: `q_evt_${Date.now()}`,
    timestamp: Date.now(),
    topic: data.topic,
    region: data.region,
    emotions: {
      joy: data.emotions?.joy || defaultQuantum(),
      fear: data.emotions?.fear || defaultQuantum(),
      anger: data.emotions?.anger || defaultQuantum(),
      sadness: data.emotions?.sadness || defaultQuantum(),
      hope: data.emotions?.hope || defaultQuantum(),
      curiosity: data.emotions?.curiosity || defaultQuantum(),
    },
    fieldIntensity: data.intensity || 0.5,
    interferencePattern: 'neutral',
    polarity: data.polarity || 0,
    uncertainty: data.uncertainty || 0.5,
    sourceWeight: data.sourceWeight || 0.8,
    timeDecay: 0.1, // قيمة λ الافتراضية
    relevanceWeight: data.relevanceWeight || 0.8,
    sourceType: data.sourceType || 'news',
    sourceName: data.sourceName || 'Unknown',
    summary: data.summary || '',
  };
}