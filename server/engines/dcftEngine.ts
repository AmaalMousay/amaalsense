/**
 * Dynamic Cognitive Field Theory (DCFT) Engine
 * Upgraded with Time-Series Dynamic Weights and Moving Averages
 */

export interface DCFTMetrics {
  gmi: number; // Global Mood Index
  cfi: number; // Collective Friction Index
  hri: number; // Hope & Resilience Index
  timestamp: string;
}

export class DCFTEngine {
  private history: DCFTMetrics[] = [];

  /**
   * Calculates metrics using dynamic weights based on temporal decay
   * and historical volatility.
   */
  calculateMetrics(sentimentScore: number, intensity: number, historicalContext: number): DCFTMetrics {
    // Dynamic Weighting Logic
    const volatility = this.calculateVolatility();
    const alpha = 0.7 + (volatility * 0.2); // Adjust sensitivity based on market/social volatility
    
    // GMI: Baseline emotional amplitude (Dynamic Weighted Average)
    const gmi = (sentimentScore * alpha) + (historicalContext * (1 - alpha));
    
    // CFI: Measures vector divergence (Potential for unrest)
    // Higher friction if intensity is high but sentiment is low
    const cfi = Math.max(0, Math.min(100, (intensity * 1.5) - (sentimentScore * 0.5)));
    
    // HRI: Field Recovery capacity
    const hri = Math.min(100, (sentimentScore * 0.8) + (historicalContext * 0.4));

    const metrics: DCFTMetrics = {
      gmi,
      cfi,
      hri,
      timestamp: new Date().toISOString()
    };

    this.history.push(metrics);
    if (this.history.length > 100) this.history.shift(); // Keep window of 100

    return metrics;
  }

  private calculateVolatility(): number {
    if (this.history.length < 2) return 0.5;
    const lastGmis = this.history.slice(-10).map(m => m.gmi);
    const mean = lastGmis.reduce((a, b) => a + b, 0) / lastGmis.length;
    const variance = lastGmis.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / lastGmis.length;
    return Math.sqrt(variance) / 100; // Normalized volatility
  }
}
