// MOCK STUB FOR DEPRECATED ANALYZER
export const analyzeText = (text: any): any => ({ dominantEmotion: 'neutral', gmi: 50, cfi: 50, hri: 50 });
export const analyzeEmotions = (text: any): any => ({ joy: 0.2, fear: 0.2, hope: 0.2, anger: 0.2, sadness: 0.2 });
export const analyzeHeadline = (text: any): any => ({ emotions: { joy: 0, fear: 0, hope: 0, anger: 0, sadness: 0, curiosity: 0 } });
