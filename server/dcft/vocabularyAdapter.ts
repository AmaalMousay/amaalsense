/**
 * Vocabulary Adapter for DCFT Meta-Learning
 * Based on DCFT Theory by Amaal Radwan
 * 
 * This module handles dynamic vocabulary adaptation including:
 * 1. Regional/cultural vocabulary variations
 * 2. Contextual word meaning shifts
 * 3. Emerging slang and new expressions
 * 4. Cross-language emotion mapping
 */

import { AffectiveVector } from './affectiveVector';
import { metaLearningEngine, LearnedVocabulary } from './metaLearning';

/**
 * Regional vocabulary configuration
 */
export interface RegionalConfig {
  code: string;           // ISO country/region code
  name: string;
  language: string;
  dialectVariations: Map<string, string[]>;  // Standard word -> dialect variations
  culturalModifiers: Map<string, number>;    // Words with different cultural weight
}

/**
 * Context-aware vocabulary entry
 */
export interface ContextualVocabulary {
  word: string;
  contexts: {
    context: string;      // e.g., 'politics', 'sports', 'finance'
    emotion: keyof AffectiveVector;
    weight: number;
  }[];
}

/**
 * Emerging expression tracker
 */
export interface EmergingExpression {
  expression: string;
  firstSeen: Date;
  occurrences: number;
  associatedEmotions: Partial<AffectiveVector>;
  confidence: number;
  isSlang: boolean;
  regions: string[];
}

/**
 * Regional configurations
 */
const REGIONAL_CONFIGS: RegionalConfig[] = [
  {
    code: 'AR',
    name: 'Arabic',
    language: 'ar',
    dialectVariations: new Map([
      ['سعيد', ['فرحان', 'مبسوط', 'مرتاح']],
      ['حزين', ['زعلان', 'متضايق', 'مكتئب']],
      ['غاضب', ['معصب', 'زعلان', 'ثائر']],
      ['خائف', ['مرعوب', 'قلقان', 'متوتر']],
    ]),
    culturalModifiers: new Map([
      ['الحمد لله', 1.2],  // Positive cultural expression
      ['إن شاء الله', 1.1], // Hopeful expression
      ['ما شاء الله', 1.15], // Positive expression
    ]),
  },
  {
    code: 'EN',
    name: 'English',
    language: 'en',
    dialectVariations: new Map([
      ['happy', ['glad', 'joyful', 'pleased', 'delighted']],
      ['sad', ['unhappy', 'down', 'blue', 'depressed']],
      ['angry', ['mad', 'furious', 'upset', 'pissed']],
    ]),
    culturalModifiers: new Map(),
  },
];

/**
 * Context-specific vocabulary mappings
 */
const CONTEXTUAL_VOCABULARY: ContextualVocabulary[] = [
  {
    word: 'crash',
    contexts: [
      { context: 'finance', emotion: 'fear', weight: 0.9 },
      { context: 'technology', emotion: 'anger', weight: 0.6 },
      { context: 'sports', emotion: 'sadness', weight: 0.5 },
    ],
  },
  {
    word: 'surge',
    contexts: [
      { context: 'finance', emotion: 'joy', weight: 0.7 },
      { context: 'health', emotion: 'fear', weight: 0.8 },
      { context: 'sports', emotion: 'hope', weight: 0.6 },
    ],
  },
  {
    word: 'break',
    contexts: [
      { context: 'news', emotion: 'curiosity', weight: 0.7 },
      { context: 'relationships', emotion: 'sadness', weight: 0.8 },
      { context: 'sports', emotion: 'joy', weight: 0.6 },
    ],
  },
  {
    word: 'fire',
    contexts: [
      { context: 'disaster', emotion: 'fear', weight: 0.9 },
      { context: 'employment', emotion: 'fear', weight: 0.85 },
      { context: 'sports', emotion: 'joy', weight: 0.7 },
      { context: 'music', emotion: 'joy', weight: 0.75 },
    ],
  },
];

/**
 * Vocabulary Adapter class
 */
export class VocabularyAdapter {
  private emergingExpressions: EmergingExpression[] = [];
  private contextDetectionPatterns: Map<string, string[]> = new Map();

  constructor() {
    // Initialize context detection patterns
    this.contextDetectionPatterns.set('finance', [
      'stock', 'market', 'price', 'investor', 'trading', 'economy', 'bank', 'dollar',
      'سوق', 'بورصة', 'استثمار', 'اقتصاد'
    ]);
    this.contextDetectionPatterns.set('politics', [
      'government', 'election', 'president', 'minister', 'parliament', 'vote', 'policy',
      'حكومة', 'انتخابات', 'رئيس', 'وزير', 'برلمان'
    ]);
    this.contextDetectionPatterns.set('health', [
      'hospital', 'doctor', 'patient', 'disease', 'vaccine', 'treatment', 'medical',
      'مستشفى', 'طبيب', 'مريض', 'مرض', 'لقاح', 'علاج'
    ]);
    this.contextDetectionPatterns.set('sports', [
      'game', 'team', 'player', 'score', 'championship', 'match', 'win', 'lose',
      'مباراة', 'فريق', 'لاعب', 'بطولة', 'فوز'
    ]);
    this.contextDetectionPatterns.set('technology', [
      'software', 'app', 'computer', 'internet', 'digital', 'ai', 'data', 'tech',
      'برنامج', 'تطبيق', 'حاسوب', 'إنترنت', 'رقمي'
    ]);
  }

  /**
   * Detect context from text
   */
  detectContext(text: string): string[] {
    const lowerText = text.toLowerCase();
    const detectedContexts: string[] = [];

    this.contextDetectionPatterns.forEach((patterns, context) => {
      const matchCount = patterns.filter(p => lowerText.includes(p)).length;
      if (matchCount >= 2) {
        detectedContexts.push(context);
      }
    });

    return detectedContexts.length > 0 ? detectedContexts : ['general'];
  }

  /**
   * Get context-adjusted weight for a word
   */
  getContextualWeight(
    word: string, 
    emotion: keyof AffectiveVector, 
    contexts: string[]
  ): number {
    const contextEntry = CONTEXTUAL_VOCABULARY.find(
      cv => cv.word.toLowerCase() === word.toLowerCase()
    );

    if (!contextEntry) {
      return metaLearningEngine.getWordWeight(word, emotion);
    }

    // Find best matching context
    for (const context of contexts) {
      const contextMatch = contextEntry.contexts.find(c => c.context === context);
      if (contextMatch && contextMatch.emotion === emotion) {
        return contextMatch.weight;
      }
    }

    // Return default weight if no context match
    return metaLearningEngine.getWordWeight(word, emotion);
  }

  /**
   * Get regional vocabulary variations
   */
  getRegionalVariations(word: string, regionCode: string): string[] {
    const config = REGIONAL_CONFIGS.find(r => r.code === regionCode);
    if (!config) return [word];

    const variations = config.dialectVariations.get(word);
    return variations ? [word, ...variations] : [word];
  }

  /**
   * Apply cultural modifiers to weight
   */
  applyCulturalModifier(word: string, weight: number, regionCode: string): number {
    const config = REGIONAL_CONFIGS.find(r => r.code === regionCode);
    if (!config) return weight;

    const modifier = config.culturalModifiers.get(word);
    return modifier ? weight * modifier : weight;
  }

  /**
   * Track emerging expression
   */
  trackEmergingExpression(
    expression: string, 
    emotions: Partial<AffectiveVector>,
    region?: string
  ): void {
    const existing = this.emergingExpressions.find(
      e => e.expression.toLowerCase() === expression.toLowerCase()
    );

    if (existing) {
      existing.occurrences++;
      existing.confidence = Math.min(1, existing.confidence + 0.05);
      
      // Update associated emotions
      Object.entries(emotions).forEach(([emotion, value]) => {
        const current = existing.associatedEmotions[emotion as keyof AffectiveVector] || 0;
        existing.associatedEmotions[emotion as keyof AffectiveVector] = (current + (value || 0)) / 2;
      });

      if (region && !existing.regions.includes(region)) {
        existing.regions.push(region);
      }
    } else {
      this.emergingExpressions.push({
        expression,
        firstSeen: new Date(),
        occurrences: 1,
        associatedEmotions: emotions,
        confidence: 0.3,
        isSlang: this.detectSlang(expression),
        regions: region ? [region] : [],
      });
    }

    // Promote high-confidence expressions to vocabulary
    this.promoteEmergingExpressions();
  }

  /**
   * Detect if expression is slang
   */
  private detectSlang(expression: string): boolean {
    // Simple heuristics for slang detection
    const slangIndicators = [
      /^[A-Z]{2,}$/, // All caps abbreviations
      /\d+/, // Contains numbers (like l33t speak)
      /(.)\1{2,}/, // Repeated characters
    ];

    return slangIndicators.some(pattern => pattern.test(expression));
  }

  /**
   * Promote confident emerging expressions to vocabulary
   */
  private promoteEmergingExpressions(): void {
    const threshold = 0.7;
    const minOccurrences = 10;

    this.emergingExpressions
      .filter(e => e.confidence >= threshold && e.occurrences >= minOccurrences)
      .forEach(expression => {
        // Find dominant emotion
        const emotions = Object.entries(expression.associatedEmotions);
        if (emotions.length === 0) return;

        const [dominantEmotion, weight] = emotions.reduce((max, current) => 
          (current[1] || 0) > (max[1] || 0) ? current : max
        );

        // Add to meta-learning vocabulary
        metaLearningEngine.addUserVocabulary(
          expression.expression,
          dominantEmotion as keyof AffectiveVector,
          weight || 0.5
        );

        // Remove from emerging list
        this.emergingExpressions = this.emergingExpressions.filter(
          e => e.expression !== expression.expression
        );
      });
  }

  /**
   * Analyze text with full adaptation
   */
  analyzeWithAdaptation(
    text: string, 
    region?: string
  ): {
    emotions: AffectiveVector;
    contexts: string[];
    adaptations: string[];
  } {
    const contexts = this.detectContext(text);
    const adaptations: string[] = [];
    
    // Get base analysis from meta-learning
    const baseEmotions = metaLearningEngine.analyzeWithLearnedVocabulary(text, region);
    
    // Apply contextual adjustments
    const words = text.toLowerCase().split(/\s+/);
    const emotions: AffectiveVector = { ...baseEmotions };
    
    words.forEach(word => {
      // Check for contextual vocabulary
      const contextEntry = CONTEXTUAL_VOCABULARY.find(
        cv => cv.word.toLowerCase() === word
      );
      
      if (contextEntry) {
        contexts.forEach(context => {
          const contextMatch = contextEntry.contexts.find(c => c.context === context);
          if (contextMatch) {
            emotions[contextMatch.emotion] += contextMatch.weight * 0.3;
            adaptations.push(`Context: "${word}" in ${context} → ${contextMatch.emotion}`);
          }
        });
      }

      // Check for regional variations
      if (region) {
        const variations = this.getRegionalVariations(word, region);
        if (variations.length > 1) {
          adaptations.push(`Regional: "${word}" has ${variations.length - 1} dialect variations`);
        }
      }
    });

    // Normalize emotions
    const maxVal = Math.max(...Object.values(emotions).map(Math.abs), 1);
    (Object.keys(emotions) as (keyof AffectiveVector)[]).forEach(emotion => {
      emotions[emotion] = Math.max(-1, Math.min(1, emotions[emotion] / maxVal));
    });

    return { emotions, contexts, adaptations };
  }

  /**
   * Get emerging expressions statistics
   */
  getEmergingStats(): {
    total: number;
    highConfidence: number;
    slangCount: number;
    byRegion: Record<string, number>;
  } {
    const byRegion: Record<string, number> = {};
    
    this.emergingExpressions.forEach(e => {
      e.regions.forEach(r => {
        byRegion[r] = (byRegion[r] || 0) + 1;
      });
    });

    return {
      total: this.emergingExpressions.length,
      highConfidence: this.emergingExpressions.filter(e => e.confidence >= 0.7).length,
      slangCount: this.emergingExpressions.filter(e => e.isSlang).length,
      byRegion,
    };
  }

  /**
   * Export emerging expressions for analysis
   */
  exportEmergingExpressions(): EmergingExpression[] {
    return [...this.emergingExpressions];
  }
}

/**
 * Create singleton instance
 */
export const vocabularyAdapter = new VocabularyAdapter();
