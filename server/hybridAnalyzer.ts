// MOCK STUB FOR DEPRECATED ANALYZER
export const analyzeHybrid = async (text: string, type: string) => ({
  indices: { gmi: 50, cfi: 50, hri: 50 },
  dcft: { emotionalPhase: 'neutral' },
  fusion: { confidence: 0.5, aiContribution: 'mock' }
});
