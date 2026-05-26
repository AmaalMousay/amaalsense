import { perceptionLayer } from './perceptionLayer';
import type { RawDigitalInput } from './perceptionLayer';
import { cognitiveLayer } from './cognitiveLayer';
import { awarenessLayer } from './awarenessLayer';
import type { GlobalIndices } from './awarenessLayer';

export type { RawDigitalInput };

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
    // 1.       Date
    const processedInputs = inputs.map(input => {
      const inputTime = input.timestamp instanceof Date ? input.timestamp.getTime() : new Date(input.timestamp).getTime();
      return {
        ...input,
        weight: Math.exp(-this.DECAY_FACTOR * ((Date.now() - inputTime) / 3600000))
      };
    });

    // 2. Perception: raw digital inputs -> emotion events
    const perceptionOutputs = await perceptionLayer.processBatch(processedInputs);
    const events = perceptionOutputs.map(output => output.event);

    // 3. Volatility is still tracked from previous awareness states
    const volatility = this.calculateVolatility();

    // 4. Cognitive field: emotion events -> DCF state
    const dcfState = cognitiveLayer.processToDCFState(events);

    // 5. Awareness: DCF state -> global indices and alert state
    const awareness = awarenessLayer.generateOutput(dcfState);

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
    // Compatibility helper for older callers that pass polarity/intensity directly.
    const normalizedPolarity = Math.max(-100, Math.min(100, polarity > 1 ? polarity - baseline : polarity * 100));
    const normalizedIntensity = Math.max(0, Math.min(100, intensity > 1 ? intensity : intensity * 100));
    return {
      gmi: Math.round(normalizedPolarity),
      cfi: Math.round(Math.max(0, normalizedIntensity * (normalizedPolarity < 0 ? 0.85 : 0.35))),
      hri: Math.round(Math.max(0, Math.min(100, ((normalizedPolarity + 100) / 2) * 0.6 + (100 - normalizedIntensity) * 0.4)))
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
    const input: RawDigitalInput = {
      id: `text_${Date.now()}`,
      content: text,
      source,
      timestamp: new Date(),
    };
    return this.analyze([input]);
  }

  reset(): void {
    this.history = [];
  }
}

export const dcftEngine = new DCFTEngine();