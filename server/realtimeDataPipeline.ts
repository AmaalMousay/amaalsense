/**
 * Real-Time Data Pipeline - AmalSense Wave Integration
 * المحرك المطور: يجلب البيانات، يحولها لمتجهات، ويخزنها في الذاكرة التراكمية.
 */

// 1. الاستيرادات الضرورية (تأكدي من صحة المسارات في مشروعك)
import { EventVector, createQuantumEvent } from './eventVectorModel';
import { storeAnalysisRecord } from './engines/learningStore';

// --- 2. المبدل الذكي: تحويل أكواد GDELT إلى مواضيع AmalSense ---
function mapGDELTToTopic(code: string): 'politics' | 'conflict' | 'economy' | 'society' {
  const c = code.substring(0, 2);
  if (['01', '02', '10', '11'].includes(c)) return 'politics';
  if (['03', '04', '05', '18', '19'].includes(c)) return 'conflict';
  if (['06', '07', '08'].includes(c)) return 'economy';
  return 'society';
}

// --- 3. المحول الموجي: تحويل نبرة الخبر إلى طور وسعة موجية ---
function convertToQuantumEmotions(tone: number, intensity: number) {
  const phase = ((tone + 100) / 200) * 2 * Math.PI;
  const amplitude = Math.max(0.1, Math.min(1, intensity));

  return {
    amplitude,
    phase,
    superposition: { stable: 1 - amplitude, volatile: amplitude }
  };
}

/**
 * 4. وكيل GDELT: جلب أحداث العالم وتحويلها لموجات
 */
export async function fetchGDELTEvents(): Promise<EventVector[]> {
  try {
    const url = `https://api.gdeltproject.org/api/v2/search/tv?query=*&mode=TimelineVolumeChange&format=json`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.data) return [];

    return data.data.slice(0, 20).map((event: any) => {
      const qState = convertToQuantumEmotions(event.AvgTone || 0, (event.NumMentions || 1) / 100);

      return createQuantumEvent({
        topic: mapGDELTToTopic(event.EventCode || '01'),
        region: 'global',
        intensity: qState.amplitude,
        polarity: (event.AvgTone || 0) / 100,
        summary: `Global News: ${event.EventRootCode || 'Event'} detected in the field.`,
        emotions: {
          fear: event.AvgTone < -10 ? qState : undefined,
          hope: event.AvgTone >= 0 ? qState : undefined,
          joy: event.AvgTone > 20 ? qState : undefined,
          curiosity: { amplitude: 0.5, phase: Math.PI / 2, superposition: { stable: 0.5, volatile: 0.5 } }
        }
      });
    });
  } catch (error) {
    console.error('[DataPipeline] GDELT Fetch Error:', error);
    return [];
  }
}

/**
 * 5. وكيل البنك الدولي: جلب المؤشرات الاقتصادية
 */
export async function fetchWorldBankIndicators(country: string = 'LY'): Promise<EventVector[]> {
  try {
    const url = `https://api.worldbank.org/v2/country/${country}/indicator/NY.GDP.MKTP.CD?format=json`;
    const response = await fetch(url);
    const data = await response.json();
    const indicators = data[1];

    if (!Array.isArray(indicators)) return [];

    return indicators.slice(0, 5).map((item: any) => createQuantumEvent({
      topic: 'economy',
      region: 'mena',
      country,
      intensity: 0.7,
      polarity: 0.2,
      summary: `Economic Insight: GDP Data for ${country} - Value: ${item.value}`,
      emotions: {
        curiosity: { amplitude: 0.6, phase: Math.PI / 4, superposition: { stable: 0.7, volatile: 0.3 } }
      }
    }));
  } catch (error) {
    return [];
  }
}

/**
 * 6. المحرك الرئيسي: المزامنة، التراكم، والتعلم
 */
export async function fetchRealTimeData(): Promise<EventVector[]> {
  console.log('[DataPipeline] 🧠 Autonomous agents starting field research...');

  const [gdelt, bank] = await Promise.all([
    fetchGDELTEvents(),
    fetchWorldBankIndicators()
  ]);

  const allEvents = [...gdelt, ...bank];

  // --- عملية التخزين التراكمي (Accumulative Storage) ---
  allEvents.forEach(event => {
    storeAnalysisRecord(
      {
        topic: event.topic,
        countryCode: (event as any).country || 'Global',
        countryName: event.region,
        userType: 'autonomous_scout',
        language: 'en',
        originalQuery: event.summary
      },
      {
        domain: event.topic,
        eventType: 'field_observation',
        sensitivityLevel: 'normal',
        timeRange: 'current',
        sourcesUsed: ['GDELT', 'WorldBank'],
        sourceCount: 1,
        dataQuality: 90
      },
      {
        emotionalIntensity: (event as any).intensity || 0.5,
        valence: event.polarity,
        affectiveVector: (event as any).vectorState || {},
        confidence: 0.85,
        insights: [event.summary],
        drivers: ['Automated knowledge acquisition']
      },
      {
        contextClassification: 1,
        emotionFusion: 1,
        emotionalDynamics: 1,
        driverDetection: 1,
        explainableInsight: 1
      }
    );
  });

  console.log(`[DataPipeline] ✅ Successfully integrated ${allEvents.length} insights into Cumulative Memory.`);
  return allEvents;
}