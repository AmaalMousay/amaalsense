/**
 * Learning Layer - طبقة التعلم من تفاعلات المستخدمين
 */

export type IntentType = 'decision_support' | 'prediction' | 'explanation' | 'comparison' | 'scenario' | 'risk_assessment' | 'recommendation' | 'general_inquiry';

export interface UserInteraction {
  id: string;
  timestamp: number;
  question: string;
  detectedIntent: IntentType;
  correctedIntent?: IntentType;
  wasHelpful: boolean | null;
  topic: string;
  responseQuality: number;
  userId?: string;
}

interface IntentPattern {
  intent: IntentType;
  keywords: string[];
  phrases: string[];
  weight: number;
  successRate: number;
  totalUsage: number;
}

class LearningStore {
  private interactions: UserInteraction[] = [];
  private intentPatterns: Map<IntentType, IntentPattern> = new Map();
  private keywordWeights: Map<string, Map<IntentType, number>> = new Map();
  
  constructor() {
    this.initializeDefaultPatterns();
  }
  
  private initializeDefaultPatterns() {
    const defaultPatterns: IntentPattern[] = [
      { intent: 'decision_support', keywords: ['فرصة', 'خطر', 'قرار', 'أشتري', 'أبيع', 'استثمر', 'opportunity', 'risk', 'decision', 'buy', 'sell'], phrases: ['هل هذا الوقت المناسب', 'ماذا أفعل', 'هل أستثمر'], weight: 1.0, successRate: 0.8, totalUsage: 0 },
      { intent: 'prediction', keywords: ['توقع', 'مستقبل', 'غداً', 'الأسبوع', 'سيحدث', 'predict', 'future', 'tomorrow', 'next week'], phrases: ['ماذا سيحدث', 'ما التوقعات', 'كيف سيكون'], weight: 1.0, successRate: 0.75, totalUsage: 0 },
      { intent: 'explanation', keywords: ['لماذا', 'كيف', 'سبب', 'تفسير', 'شرح', 'why', 'how', 'reason', 'explain'], phrases: ['لماذا حدث', 'ما السبب', 'اشرح لي'], weight: 1.0, successRate: 0.85, totalUsage: 0 },
      { intent: 'comparison', keywords: ['مقارنة', 'أفضل', 'الفرق', 'أمس', 'سابقاً', 'compare', 'better', 'difference'], phrases: ['مقارنة بـ', 'الفرق بين', 'أفضل من'], weight: 1.0, successRate: 0.8, totalUsage: 0 },
      { intent: 'scenario', keywords: ['ماذا لو', 'سيناريو', 'افتراض', 'لو حدث', 'what if', 'scenario'], phrases: ['ماذا لو', 'في حالة', 'لو افترضنا'], weight: 1.0, successRate: 0.7, totalUsage: 0 },
      { intent: 'risk_assessment', keywords: ['مخاطر', 'خطورة', 'تحذير', 'حذر', 'risks', 'danger', 'warning'], phrases: ['ما المخاطر', 'هل هناك خطر'], weight: 1.0, successRate: 0.8, totalUsage: 0 },
      { intent: 'recommendation', keywords: ['توصية', 'نصيحة', 'اقتراح', 'أنصح', 'recommend', 'advice'], phrases: ['ما توصيتك', 'ماذا تنصح'], weight: 1.0, successRate: 0.85, totalUsage: 0 },
      { intent: 'general_inquiry', keywords: ['ما', 'هل', 'أين', 'متى', 'what', 'is', 'where', 'when'], phrases: ['ما هو', 'هل يمكن'], weight: 0.5, successRate: 0.7, totalUsage: 0 }
    ];
    
    for (const pattern of defaultPatterns) {
      this.intentPatterns.set(pattern.intent, pattern);
      for (const keyword of pattern.keywords) {
        if (!this.keywordWeights.has(keyword)) this.keywordWeights.set(keyword, new Map());
        this.keywordWeights.get(keyword)!.set(pattern.intent, pattern.weight);
      }
    }
  }
  
  addInteraction(interaction: UserInteraction) {
    this.interactions.push(interaction);
    if (interaction.wasHelpful !== null) this.updatePatternFromFeedback(interaction);
    if (interaction.correctedIntent && interaction.correctedIntent !== interaction.detectedIntent) this.learnFromCorrection(interaction);
  }
  
  private updatePatternFromFeedback(interaction: UserInteraction) {
    const pattern = this.intentPatterns.get(interaction.detectedIntent);
    if (!pattern) return;
    pattern.totalUsage++;
    if (interaction.wasHelpful) {
      pattern.successRate = (pattern.successRate * (pattern.totalUsage - 1) + 1) / pattern.totalUsage;
      pattern.weight = Math.min(2.0, pattern.weight * 1.01);
    } else {
      pattern.successRate = (pattern.successRate * (pattern.totalUsage - 1)) / pattern.totalUsage;
      pattern.weight = Math.max(0.5, pattern.weight * 0.99);
    }
  }
  
  private learnFromCorrection(interaction: UserInteraction) {
    const questionWords = this.extractKeywords(interaction.question);
    for (const word of questionWords) {
      const weights = this.keywordWeights.get(word);
      if (weights) weights.set(interaction.detectedIntent, Math.max(0, (weights.get(interaction.detectedIntent) || 0) - 0.1));
    }
    if (interaction.correctedIntent) {
      for (const word of questionWords) {
        if (!this.keywordWeights.has(word)) this.keywordWeights.set(word, new Map());
        const weights = this.keywordWeights.get(word)!;
        weights.set(interaction.correctedIntent, Math.min(2.0, (weights.get(interaction.correctedIntent) || 0) + 0.2));
      }
    }
  }
  
  private extractKeywords(question: string): string[] {
    const stopWords = ['و', 'في', 'من', 'على', 'إلى', 'هذا', 'هذه', 'the', 'a', 'an', 'is', 'are', 'to', 'of'];
    return question.toLowerCase().replace(/[؟?!.,،]/g, '').split(/\s+/).filter(word => word.length > 1 && !stopWords.includes(word));
  }
  
  classifyIntent(question: string): { intent: IntentType; confidence: number; alternatives: Array<{ intent: IntentType; score: number }> } {
    const questionLower = question.toLowerCase();
    const scores: Map<IntentType, number> = new Map();
    
    Array.from(this.intentPatterns.entries()).forEach(([intent, pattern]) => {
      let score = 0;
      for (const keyword of pattern.keywords) {
        if (questionLower.includes(keyword)) score += this.keywordWeights.get(keyword)?.get(intent) || pattern.weight;
      }
      for (const phrase of pattern.phrases) {
        if (questionLower.includes(phrase)) score += pattern.weight * 2;
      }
      scores.set(intent, score * pattern.successRate);
    });
    
    const sortedScores = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]);
    const topIntent = sortedScores[0];
    const totalScore = sortedScores.reduce((sum, [, score]) => sum + score, 0);
    const confidence = totalScore > 0 ? (topIntent[1] / totalScore) * 100 : 50;
    const alternatives = sortedScores.slice(1, 4).map(([intent, score]) => ({ intent, score: totalScore > 0 ? (score / totalScore) * 100 : 0 }));
    
    return { intent: topIntent[0], confidence: Math.min(95, Math.max(30, confidence)), alternatives };
  }
  
  getLearningStats() {
    const intentDistribution: Record<string, number> = {};
    let totalSuccessRate = 0, patternCount = 0;
    Array.from(this.intentPatterns.entries()).forEach(([intent, pattern]) => {
      intentDistribution[intent] = pattern.totalUsage;
      totalSuccessRate += pattern.successRate;
      patternCount++;
    });
    return { totalInteractions: this.interactions.length, intentDistribution, averageSuccessRate: patternCount > 0 ? totalSuccessRate / patternCount : 0, topKeywords: [] };
  }
}

const learningStore = new LearningStore();

export const LearningLayer = {
  classifyIntent: (question: string) => learningStore.classifyIntent(question),
  recordInteraction: (interaction: Omit<UserInteraction, 'id' | 'timestamp'>) => {
    const id = 'int_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    learningStore.addInteraction({ ...interaction, id, timestamp: Date.now() });
  },
  recordFeedback: (interactionId: string, wasHelpful: boolean, quality: number = 3) => {
    console.log('[LearningLayer] Feedback recorded: ' + interactionId + ', helpful: ' + wasHelpful + ', quality: ' + quality);
  },
  recordIntentCorrection: (question: string, detectedIntent: IntentType, correctedIntent: IntentType, topic: string) => {
    const id = 'corr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    learningStore.addInteraction({ id, timestamp: Date.now(), question, detectedIntent, correctedIntent, wasHelpful: false, topic, responseQuality: 2 });
  },
  getStats: () => learningStore.getLearningStats()
};

export default LearningLayer;
