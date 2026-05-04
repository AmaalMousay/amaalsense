// @ts-nocheck
/**
 * Enhanced EventVector - Quantum-Inspired Engine V2
 * يحول الأخبار إلى متجهات موجية احتمالية (Waveform Vectors)
 * يطبق منطق التراكب والتداخل (Superposition & Interference)
 */

import { CompressedNews } from './newsCompressionLayer';

export interface QuantumEventVector {
  id: string;
  createdAt: number;
  sourceId: string;
  sourceType: 'news' | 'social' | 'analysis';
  sourceName: string;

  // Temporal & Quantum Decay
  eventTimestamp: number;
  lambda: number; // ثابت التلاشي الأسي من بحثك

  // Semantic & Geo
  region: string;
  country: string;
  topic: string;
  mainIdea: string;

  // Waveform Emotions (Amplitudes & Phases)
  emotions: {
    joy: { a: number; p: number };
    fear: { a: number; p: number };
    anger: { a: number; p: number };
    sadness: { a: number; p: number };
    hope: { a: number; p: number };
    curiosity: { a: number; p: number };
  };

  intensity: number;
  polarity: number;

  // Complex Vector (Amplitudes for interference)
  quantumVector: number[];
  phases: number[]; // الأطوار الخاصة بكل بعد

  summary: string;
  cause: string;
  confidence: number;
}

/**
 * تحويل الخبر المضغوط إلى نبضة موجية عاطفية
 */
export function createQuantumEventFromCompressed(
  compressed: CompressedNews,
  sourceId: string,
  sourceName: string = 'news'
): QuantumEventVector {

  // دالة لتوليد الطور (Phase) بناءً على نوع العاطفة والتوقيت
  const generatePhase = (emotion: string) => {
    const base = (Date.now() % 1000) / 1000 * Math.PI * 2;
    return (emotion === 'hope' || emotion === 'joy') ? base : base + Math.PI; // مشاعر إيجابية وسلبية بأطوار متعاكسة
  };

  const emotions = {
    joy: { a: 0.1, p: generatePhase('joy') },
    fear: { a: 0.1, p: generatePhase('fear') },
    anger: { a: 0.1, p: generatePhase('anger') },
    sadness: { a: 0.1, p: generatePhase('sadness') },
    hope: { a: 0.1, p: generatePhase('hope') },
    curiosity: { a: 0.1, p: generatePhase('curiosity') },
  };

  // رفع السعة (Amplitude) للعاطفة المهيمنة في الخبر
  if (compressed.emotion in emotions) {
    emotions[compressed.emotion].a = Math.min(1, compressed.intensity + 0.2);
  }

  // بناء المتجه الكمي (الأطوال الموجية)
  const quantumVector = Object.values(emotions).map(e => e.a);
  const phases = Object.values(emotions).map(e => e.p);

  return {
    id: `q_ev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    sourceId,
    sourceType: 'news',
    sourceName,
    eventTimestamp: Date.now(),
    lambda: 0.1, // القيمة λ من معادلة RI في بحثك
    region: compressed.region,
    country: 'Global',
    topic: compressed.topic,
    mainIdea: compressed.mainIdea,
    emotions,
    intensity: compressed.intensity,
    polarity: (emotions.joy.a + emotions.hope.a) - (emotions.fear.a + emotions.anger.a),
    quantumVector,
    phases,
    summary: compressed.mainIdea,
    cause: compressed.cause,
    confidence: compressed.confidence,
  };
}

/**
 * حساب التداخل الموجي (Quantum Interference Similarity)
 * يحدد ما إذا كان الخبر الجديد يقوي الوعي الحالي (Constructive) أم يضعفه.
 */
export function calculateQuantumInterference(vec1: QuantumEventVector, vec2: QuantumEventVector): number {
  let interferenceScore = 0;

  for (let i = 0; i < vec1.quantumVector.length; i++) {
    const a1 = vec1.quantumVector[i];
    const a2 = vec2.quantumVector[i];
    const p1 = vec1.phases[i];
    const p2 = vec2.phases[i];

    // معادلة التداخل: A^2 = a1^2 + a2^2 + 2*a1*a2*cos(p1 - p2)
    const interference = Math.sqrt(Math.pow(a1, 2) + Math.pow(a2, 2) + 2 * a1 * a2 * Math.cos(p1 - p2));
    interferenceScore += interference;
  }

  return interferenceScore / vec1.quantumVector.length;
}

/**
 * التراكم السوبر (Super-Aggregation)
 * يدمج الأحداث لتكوين "خبرة تراكمية" لا تفقد التفاصيل القديمة
 */
export function superAggregate(vectors: QuantumEventVector[]): QuantumEventVector {
  if (vectors.length === 0) throw new Error('No vectors to aggregate');

  // حساب الرنين الإجمالي باستخدام معادلة RI من بحثك
  // RI = Σ (Ai * Wi * e^-λt)
  const now = Date.now();
  const aggregatedAmplitudes = new Array(6).fill(0);

  for (const v of vectors) {
    const dt = (now - v.eventTimestamp) / (1000 * 3600); // Δt بالساعات
    const decay = Math.exp(-v.lambda * dt);

    for (let i = 0; i < 6; i++) {
      aggregatedAmplitudes[i] += v.quantumVector[i] * decay;
    }
  }

  // إنشاء المتجه "الخبير" التراكمي
  const result = { ...vectors[0] };
  result.id = `super_agg_${now}`;
  result.quantumVector = aggregatedAmplitudes.map(a => Math.min(1, a / vectors.length));
  result.mainIdea = `وعي تراكمي ناتج عن ${vectors.length} حدث`;

  return result;
}