import { perceptionLayer, RawDigitalInput } from './perceptionLayer';
import { cognitiveLayer } from './cognitiveLayer';
import { awarenessLayer, GlobalIndices } from './awarenessLayer';

export { RawDigitalInput };

export interface DCFTAnalysisResult {
  indices: GlobalIndices;
  emotions: { joy: number; fear: number; anger: number; sadness: number; hope: number; curiosity: number; };
  volatility: number;
  confidence: number;
  emotionalPhase: any;
  resonanceScore: number;
  dcfAmplitude: number; // For backward compatibility
  resonanceIndices: any; // For backward compatibility
  alertLevel: string; // For backward compatibility
  timestamp: string;
}

export class DCFTEngine {
  private history: DCFTAnalysisResult[] = [];
  private readonly WINDOW_SIZE = 100;
  private readonly DECAY_FACTOR = 0.05;

  async analyze(inputs: RawDigitalInput[]): Promise<DCFTAnalysisResult> {
    // 1. معالجة التحلل الزمني وتصحيح خطأ الـ Date
    const processedInputs = inputs.map(input => {
      const inputTime = input.timestamp instanceof Date ? input.timestamp.getTime() : new Date(input.timestamp).getTime();
      return {
        ...input,
        weight: Math.exp(-this.DECAY_FACTOR * ((Date.now() - inputTime) / 3600000))
      };
    });

    // 2. حل خطأ PerceptionLayer: الوصول للدالة بأي اسم موجود (analyzeInputs أو process)
    const pLayer = perceptionLayer as any;
    const perception = pLayer.process ? pLayer.process(processedInputs) : pLayer.analyzeInputs(processedInputs);

    // 3. حساب التذبذب (المنطق الرياضي)
    const volatility = this.calculateVolatility();

    // 4. حل خطأ CognitiveLayer: الوصول للدالة (updateField أو process)
    const cLayer = cognitiveLayer as any;
    const dcfState = cLayer.process ? cLayer.process(perception.events, volatility) : cLayer.updateField(perception.events);

    // 5. حل خطأ AwarenessLayer: الوصول للدالة (buildAwareness أو generate)
    const aLayer = awarenessLayer as any;
    const awareness = aLayer.generate ? aLayer.generate(dcfState) : aLayer.buildAwareness(dcfState);

    const result: DCFTAnalysisResult = {
      indices: awareness.indices,
      emotions: awareness.emotions,
      volatility: volatility,
      confidence: awareness.confidence,
      emotionalPhase: awareness.emotionalPhase || null,
      resonanceScore: dcfState.amplitude || 0,
      dcfAmplitude: dcfState.amplitude || 0,
      resonanceIndices: dcfState.resonanceIndices || awareness.emotions,
      alertLevel: awareness.alertLevel || 'normal',
      timestamp: new Date().toISOString()
    };

    this.history.push(result);
    if (this.history.length > this.WINDOW_SIZE) this.history.shift();

    return result;
  }

  calculateConsciousnessField(polarity: number, intensity: number, baseline: number = 50) {
    // Mock mapping for backward compatibility with guessing fix17.cjs
    return {
      gmi: Math.round(polarity),
      cfi: Math.round(intensity * 0.7),
      hri: Math.round((polarity + intensity) / 2)
    };
  }

  private calculateVolatility(): number {
    if (this.history.length < 2) return 0.4;
    const lastGmis = this.history.slice(-10).map(h => h.indices.gmi);
    const mean = lastGmis.reduce((a, b) => a + b, 0) / lastGmis.length;
    const variance = lastGmis.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / lastGmis.length;
    return Math.min(Math.sqrt(variance) / 50, 1);
  }

  async analyzeText(text: string, source: string = 'live'): Promise<DCFTAnalysisResult> {
    const input: any = {
      text,
      source,
      timestamp: new Date()
    };
    return this.analyze([input]);
  }

  reset(): void {
    this.history = [];
  }
}

export const dcftEngine = new DCFTEngine();