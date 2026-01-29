import { describe, expect, it } from "vitest";
import {
  calculateDigitalConsciousnessField,
  calculateResonanceIndex,
  identifyCollectivePhase,
  calculateDCFTIndices,
  getEmotionalColor,
  detectEmotionalWaves,
  generateEmotionalForecast,
  checkAlertConditions,
  type DigitalEvent,
} from "./dcftEngine";

// Helper to create test events
function createTestEvent(overrides: Partial<DigitalEvent> = {}): DigitalEvent {
  return {
    id: `test-${Math.random()}`,
    timestamp: Date.now() - Math.random() * 3600000,
    affectiveVector: {
      joy: 0.3,
      fear: -0.2,
      anger: -0.1,
      sadness: -0.15,
      hope: 0.4,
      curiosity: 0.25,
    },
    influence: 0.7,
    source: "test",
    ...overrides,
  };
}

describe("DCFT Engine - Digital Consciousness Field", () => {
  it("calculates D(t) amplitude correctly", () => {
    const events = [createTestEvent(), createTestEvent(), createTestEvent()];
    const amplitude = calculateDigitalConsciousnessField(events);
    
    expect(typeof amplitude).toBe("number");
    expect(amplitude).toBeGreaterThanOrEqual(0);
  });

  it("returns 0 for empty events", () => {
    const amplitude = calculateDigitalConsciousnessField([]);
    expect(amplitude).toBe(0);
  });

  it("higher influence events contribute more to amplitude", () => {
    const lowInfluenceEvents = [
      createTestEvent({ influence: 0.1 }),
      createTestEvent({ influence: 0.1 }),
    ];
    const highInfluenceEvents = [
      createTestEvent({ influence: 0.9 }),
      createTestEvent({ influence: 0.9 }),
    ];

    const lowAmplitude = calculateDigitalConsciousnessField(lowInfluenceEvents);
    const highAmplitude = calculateDigitalConsciousnessField(highInfluenceEvents);

    expect(highAmplitude).toBeGreaterThan(lowAmplitude);
  });
});

describe("DCFT Engine - Resonance Index", () => {
  it("calculates resonance for all emotions", () => {
    const events = [createTestEvent(), createTestEvent()];
    const resonance = calculateResonanceIndex(events);

    expect(resonance).toHaveProperty("joy");
    expect(resonance).toHaveProperty("fear");
    expect(resonance).toHaveProperty("anger");
    expect(resonance).toHaveProperty("sadness");
    expect(resonance).toHaveProperty("hope");
    expect(resonance).toHaveProperty("curiosity");
  });

  it("returns zero resonance for empty events", () => {
    const resonance = calculateResonanceIndex([]);
    
    expect(resonance.joy).toBe(0);
    expect(resonance.fear).toBe(0);
  });

  it("recent events have higher resonance contribution", () => {
    const recentEvent = createTestEvent({ 
      timestamp: Date.now(),
      affectiveVector: { joy: 0.8, fear: 0, anger: 0, sadness: 0, hope: 0, curiosity: 0 }
    });
    const oldEvent = createTestEvent({ 
      timestamp: Date.now() - 24 * 60 * 60 * 1000, // 24 hours ago
      affectiveVector: { joy: 0.8, fear: 0, anger: 0, sadness: 0, hope: 0, curiosity: 0 }
    });

    const recentResonance = calculateResonanceIndex([recentEvent]);
    const oldResonance = calculateResonanceIndex([oldEvent]);

    expect(recentResonance.joy).toBeGreaterThan(oldResonance.joy);
  });
});

describe("DCFT Engine - Collective Phase", () => {
  it("identifies dominant emotion correctly", () => {
    const hopefulEvents = [
      createTestEvent({ 
        affectiveVector: { joy: 0.1, fear: 0, anger: 0, sadness: 0, hope: 0.9, curiosity: 0 }
      }),
      createTestEvent({ 
        affectiveVector: { joy: 0.2, fear: 0, anger: 0, sadness: 0, hope: 0.8, curiosity: 0 }
      }),
    ];

    const phase = identifyCollectivePhase(hopefulEvents);
    expect(phase.dominantEmotion).toBe("hope");
  });

  it("calculates coherence between 0 and 1", () => {
    const events = [createTestEvent(), createTestEvent()];
    const phase = identifyCollectivePhase(events);

    expect(phase.coherence).toBeGreaterThanOrEqual(0);
    expect(phase.coherence).toBeLessThanOrEqual(1);
  });

  it("provides a description string", () => {
    const events = [createTestEvent()];
    const phase = identifyCollectivePhase(events);

    expect(typeof phase.description).toBe("string");
    expect(phase.description.length).toBeGreaterThan(0);
  });
});

describe("DCFT Engine - DCFT Indices", () => {
  it("calculates GMI, CFI, HRI correctly", () => {
    const events = [createTestEvent(), createTestEvent()];
    const indices = calculateDCFTIndices(events);

    expect(indices).toHaveProperty("GMI");
    expect(indices).toHaveProperty("CFI");
    expect(indices).toHaveProperty("HRI");
  });

  it("GMI is within -100 to 100 range", () => {
    const events = [createTestEvent(), createTestEvent()];
    const indices = calculateDCFTIndices(events);

    expect(indices.GMI).toBeGreaterThanOrEqual(-100);
    expect(indices.GMI).toBeLessThanOrEqual(100);
  });

  it("CFI and HRI are within 0 to 100 range", () => {
    const events = [createTestEvent(), createTestEvent()];
    const indices = calculateDCFTIndices(events);

    expect(indices.CFI).toBeGreaterThanOrEqual(0);
    expect(indices.CFI).toBeLessThanOrEqual(100);
    expect(indices.HRI).toBeGreaterThanOrEqual(0);
    expect(indices.HRI).toBeLessThanOrEqual(100);
  });
});

describe("DCFT Engine - Emotional Colors", () => {
  it("returns color based on resonance", () => {
    const resonance = { joy: 0.5, fear: 0.1, anger: 0.1, sadness: 0.1, hope: 0.6, curiosity: 0.3 };
    const color = getEmotionalColor(resonance);

    expect(color).toHaveProperty("primary");
    expect(color).toHaveProperty("secondary");
    expect(color).toHaveProperty("description");
  });

  it("returns valid hex colors", () => {
    const resonance = { joy: 0.5, fear: 0.1, anger: 0.1, sadness: 0.1, hope: 0.6, curiosity: 0.3 };
    const color = getEmotionalColor(resonance);

    expect(color.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(color.secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});

describe("DCFT Engine - Emotional Waves", () => {
  it("detects waves from events", () => {
    const events = Array.from({ length: 10 }, () => createTestEvent());
    const waves = detectEmotionalWaves(events);

    expect(waves).toHaveProperty("detected");
    expect(waves).toHaveProperty("emotion");
    expect(waves).toHaveProperty("coherence");
  });

  it("returns wave object for empty events", () => {
    const waves = detectEmotionalWaves([]);
    expect(waves).toHaveProperty("detected");
    expect(waves.detected).toBe(false);
  });
});

describe("DCFT Engine - Emotional Forecast", () => {
  it("generates forecast from historical data", () => {
    const historicalData = [
      { timestamp: Date.now() - 3600000, indices: { GMI: 10, CFI: 45, HRI: 55 } },
      { timestamp: Date.now() - 7200000, indices: { GMI: 5, CFI: 50, HRI: 50 } },
      { timestamp: Date.now() - 10800000, indices: { GMI: 0, CFI: 55, HRI: 45 } },
    ];

    const forecast = generateEmotionalForecast(historicalData, 24);

    expect(forecast).toHaveProperty("predictedGMI");
    expect(forecast).toHaveProperty("predictedCFI");
    expect(forecast).toHaveProperty("predictedHRI");
    expect(forecast).toHaveProperty("trend");
    expect(forecast).toHaveProperty("confidence");
    expect(forecast).toHaveProperty("forecast");
  });

  it("handles empty historical data", () => {
    const forecast = generateEmotionalForecast([], 24);

    expect(forecast.predictedGMI).toBe(0);
    expect(forecast.predictedCFI).toBe(50);
    expect(forecast.predictedHRI).toBe(50);
    expect(forecast.confidence).toBeGreaterThanOrEqual(0);
    expect(forecast.confidence).toBeLessThanOrEqual(1);
  });

  it("trend is one of improving/declining/stable", () => {
    const historicalData = [
      { timestamp: Date.now() - 3600000, indices: { GMI: 10, CFI: 45, HRI: 55 } },
      { timestamp: Date.now() - 7200000, indices: { GMI: 5, CFI: 50, HRI: 50 } },
    ];

    const forecast = generateEmotionalForecast(historicalData, 24);
    expect(["improving", "declining", "stable"]).toContain(forecast.trend);
  });
});

describe("DCFT Engine - Alert System", () => {
  it("detects low or no alerts for normal conditions", () => {
    const currentIndices = { GMI: 20, CFI: 40, HRI: 60 };
    const previousIndices = { GMI: 18, CFI: 42, HRI: 58 };

    const alerts = checkAlertConditions(currentIndices, previousIndices);

    expect(["normal", "low"]).toContain(alerts.alertLevel);
    expect(alerts).toHaveProperty("hasAlert");
    expect(alerts).toHaveProperty("alerts");
  });

  it("detects critical alert for high CFI", () => {
    const currentIndices = { GMI: -30, CFI: 85, HRI: 20 };
    const previousIndices = { GMI: -20, CFI: 70, HRI: 30 };

    const alerts = checkAlertConditions(currentIndices, previousIndices);

    expect(alerts.hasAlert).toBe(true);
    expect(alerts.alertLevel).toBe("critical");
    expect(alerts.alerts.length).toBeGreaterThan(0);
  });

  it("detects rapid change alerts", () => {
    const currentIndices = { GMI: 50, CFI: 30, HRI: 70 };
    const previousIndices = { GMI: 10, CFI: 60, HRI: 40 }; // Large changes

    const alerts = checkAlertConditions(currentIndices, previousIndices);

    expect(alerts.hasAlert).toBe(true);
    expect(alerts.alerts.length).toBeGreaterThan(0);
  });

  it("handles null previous indices", () => {
    const currentIndices = { GMI: 20, CFI: 40, HRI: 60 };

    const alerts = checkAlertConditions(currentIndices, null);

    expect(alerts).toHaveProperty("hasAlert");
    expect(alerts).toHaveProperty("alertLevel");
    expect(alerts).toHaveProperty("alerts");
  });
});
