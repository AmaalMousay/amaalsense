/**
 * Awareness Layer (Layer 3) - Output Generation
 * Based on DCFT Theory by Amaal Radwan
 * 
 * This layer transforms emotional currents into visual, numerical, and auditory representations.
 * Generates dynamic indices: GMI, CFI, HRI
 * 
 * These indices are continuously updated, creating what can be described as
 * the "heartbeat of the digital world"
 */

import { DCFState, EmotionalPhase } from './cognitiveLayer';
import { AffectiveVector, avToDisplayScale } from './affectiveVector';

/**
 * Global indices output
 */
export interface GlobalIndices {
  gmi: number;  // Global Mood Index: -100 to +100
  cfi: number;  // Collective Fear Index: 0 to 100
  hri: number;  // Hope Resonance Index: 0 to 100
}

/**
 * Complete awareness output
 */
export interface AwarenessOutput {
  indices: GlobalIndices;
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  dominantEmotion: string;
  emotionalPhase: EmotionalPhase | null;
  colorCode: string;
  alertLevel: AlertLevel;
  confidence: number;
  timestamp: Date;
  summary: string;
}

/**
 * Alert levels for early warning system
 */
export type AlertLevel = 'normal' | 'elevated' | 'high' | 'critical';

/**
 * Color mapping based on DCFT theory
 * Blue = calm/reflection
 * Red = anger/activism
 * Yellow = optimism/creativity
 * Green = balance/collective harmony
 */
const EMOTION_COLORS = {
  joy: '#E9C46A',      // Yellow - optimism
  fear: '#F4A261',     // Orange - anxiety
  anger: '#E63946',    // Red - activism
  sadness: '#8D5CF6',  // Purple - grief
  hope: '#2A9D8F',     // Green - harmony
  curiosity: '#E9C46A', // Yellow - creativity
  calm: '#457B9D',     // Blue - reflection
  neutral: '#6C757D',  // Gray - neutral
};

/**
 * Awareness Layer class
 * Generates final output indices and visualizations
 */
export class AwarenessLayer {
  /**
   * Calculate Global Mood Index (GMI)
   * Measures general optimism or pessimism across the planet
   * Range: -100 to +100
   * 
   * Formula: GMI = (positive_emotions - negative_emotions) × amplitude_factor
   */
  calculateGMI(dcfState: DCFState): number {
    const { resonanceIndices, amplitude } = dcfState;
    
    // Positive emotions contribute positively
    const positive = resonanceIndices.joy + resonanceIndices.hope + resonanceIndices.curiosity;
    
    // Negative emotions contribute negatively
    const negative = resonanceIndices.fear + resonanceIndices.anger + resonanceIndices.sadness;
    
    // Raw GMI (-3 to +3 range from resonance indices)
    const rawGMI = positive - negative;
    
    // Scale to -100 to +100 with amplitude influence
    const amplitudeFactor = Math.min(2, 1 + Math.log10(Math.max(1, amplitude)) / 3);
    const gmi = (rawGMI / 3) * 100 * amplitudeFactor;
    
    return Math.round(Math.max(-100, Math.min(100, gmi)));
  }

  /**
   * Calculate Collective Fear Index (CFI)
   * Measures probability of market downturn or crisis
   * Range: 0 to 100
   * 
   * Formula: CFI = (fear + anger/2 + sadness/3) × stress_multiplier
   */
  calculateCFI(dcfState: DCFState): number {
    const { resonanceIndices } = dcfState;
    
    // Fear is primary, anger and sadness contribute
    const fearComponent = (resonanceIndices.fear + 1) / 2; // Normalize to 0-1
    const angerComponent = (resonanceIndices.anger + 1) / 4; // Half weight
    const sadnessComponent = (resonanceIndices.sadness + 1) / 6; // Third weight
    
    // Hope reduces fear
    const hopeReduction = (resonanceIndices.hope + 1) / 4;
    
    // Calculate raw CFI
    const rawCFI = fearComponent + angerComponent + sadnessComponent - hopeReduction;
    
    // Scale to 0-100
    const cfi = rawCFI * 100;
    
    return Math.round(Math.max(0, Math.min(100, cfi)));
  }

  /**
   * Calculate Hope Resonance Index (HRI)
   * Measures potential for innovation, recovery, and consumer confidence
   * Range: 0 to 100
   * 
   * Formula: HRI = (hope + joy/2 + curiosity/2) × resilience_factor
   */
  calculateHRI(dcfState: DCFState): number {
    const { resonanceIndices } = dcfState;
    
    // Hope is primary, joy and curiosity contribute
    const hopeComponent = (resonanceIndices.hope + 1) / 2; // Normalize to 0-1
    const joyComponent = (resonanceIndices.joy + 1) / 4; // Half weight
    const curiosityComponent = (resonanceIndices.curiosity + 1) / 4; // Half weight
    
    // Fear and sadness reduce hope
    const fearReduction = (resonanceIndices.fear + 1) / 6;
    const sadnessReduction = (resonanceIndices.sadness + 1) / 6;
    
    // Calculate raw HRI
    const rawHRI = hopeComponent + joyComponent + curiosityComponent - fearReduction - sadnessReduction;
    
    // Scale to 0-100
    const hri = rawHRI * 100;
    
    return Math.round(Math.max(0, Math.min(100, hri)));
  }

  /**
   * Calculate all global indices
   */
  calculateIndices(dcfState: DCFState): GlobalIndices {
    return {
      gmi: this.calculateGMI(dcfState),
      cfi: this.calculateCFI(dcfState),
      hri: this.calculateHRI(dcfState),
    };
  }

  /**
   * Determine color code based on emotional state
   */
  determineColorCode(dcfState: DCFState): string {
    const { dominantEmotion, emotionalPhase } = dcfState;
    
    // If in a specific phase, use phase-appropriate color
    if (emotionalPhase) {
      switch (emotionalPhase.type) {
        case 'crisis': return EMOTION_COLORS.anger;
        case 'euphoria': return EMOTION_COLORS.joy;
        case 'mourning': return EMOTION_COLORS.sadness;
        case 'tension': return EMOTION_COLORS.fear;
        case 'anticipation': return EMOTION_COLORS.curiosity;
        case 'calm': return EMOTION_COLORS.calm;
      }
    }
    
    // Otherwise use dominant emotion color
    return EMOTION_COLORS[dominantEmotion as keyof typeof EMOTION_COLORS] || EMOTION_COLORS.neutral;
  }

  /**
   * Determine alert level for early warning system
   */
  determineAlertLevel(indices: GlobalIndices, emotionalPhase: EmotionalPhase | null): AlertLevel {
    // Critical: Crisis phase or extreme indices
    if (emotionalPhase?.type === 'crisis' || indices.cfi > 80 || indices.gmi < -70) {
      return 'critical';
    }
    
    // High: Tension phase or concerning indices
    if (emotionalPhase?.type === 'tension' || indices.cfi > 60 || indices.gmi < -50) {
      return 'high';
    }
    
    // Elevated: Moderate negative indicators
    if (indices.cfi > 40 || indices.gmi < -30 || emotionalPhase?.type === 'mourning') {
      return 'elevated';
    }
    
    // Normal: Stable conditions
    return 'normal';
  }

  /**
   * Generate human-readable summary
   */
  generateSummary(indices: GlobalIndices, emotionalPhase: EmotionalPhase | null, dominantEmotion: string): string {
    const parts: string[] = [];
    
    // GMI interpretation
    if (indices.gmi > 50) {
      parts.push('Strong positive collective mood');
    } else if (indices.gmi > 20) {
      parts.push('Moderately positive collective mood');
    } else if (indices.gmi > -20) {
      parts.push('Neutral collective mood');
    } else if (indices.gmi > -50) {
      parts.push('Moderately negative collective mood');
    } else {
      parts.push('Strong negative collective mood');
    }
    
    // CFI interpretation
    if (indices.cfi > 70) {
      parts.push('with high collective anxiety');
    } else if (indices.cfi > 40) {
      parts.push('with elevated concern levels');
    }
    
    // HRI interpretation
    if (indices.hri > 70) {
      parts.push('and strong hope/resilience');
    } else if (indices.hri < 30) {
      parts.push('and low resilience indicators');
    }
    
    // Phase description
    if (emotionalPhase) {
      parts.push(`- ${emotionalPhase.description}`);
    }
    
    return parts.join(' ');
  }

  /**
   * Generate complete awareness output from DCF state
   */
  generateOutput(dcfState: DCFState): AwarenessOutput {
    const indices = this.calculateIndices(dcfState);
    const emotions = avToDisplayScale(dcfState.aggregatedAV);
    const colorCode = this.determineColorCode(dcfState);
    const alertLevel = this.determineAlertLevel(indices, dcfState.emotionalPhase);
    const summary = this.generateSummary(indices, dcfState.emotionalPhase, dcfState.dominantEmotion);
    
    return {
      indices,
      emotions,
      dominantEmotion: dcfState.dominantEmotion,
      emotionalPhase: dcfState.emotionalPhase,
      colorCode,
      alertLevel,
      confidence: dcfState.confidence,
      timestamp: dcfState.timestamp,
      summary,
    };
  }

  /**
   * Generate alert notification if needed
   */
  generateAlert(output: AwarenessOutput): {
    shouldAlert: boolean;
    title: string;
    message: string;
    severity: AlertLevel;
  } | null {
    if (output.alertLevel === 'normal') {
      return null;
    }
    
    const severityMessages = {
      elevated: {
        title: 'Elevated Emotional Activity',
        message: `Collective mood shows elevated activity. GMI: ${output.indices.gmi}, CFI: ${output.indices.cfi}`,
      },
      high: {
        title: 'High Alert: Emotional Tension',
        message: `Significant emotional tension detected. GMI: ${output.indices.gmi}, CFI: ${output.indices.cfi}. ${output.summary}`,
      },
      critical: {
        title: 'CRITICAL: Collective Crisis State',
        message: `Critical emotional state detected! GMI: ${output.indices.gmi}, CFI: ${output.indices.cfi}. Immediate attention recommended. ${output.summary}`,
      },
    };
    
    const alertInfo = severityMessages[output.alertLevel as keyof typeof severityMessages];
    if (!alertInfo) return null;
    
    return {
      shouldAlert: true,
      title: alertInfo.title,
      message: alertInfo.message,
      severity: output.alertLevel,
    };
  }
}

/**
 * Create singleton instance
 */
export const awarenessLayer = new AwarenessLayer();
