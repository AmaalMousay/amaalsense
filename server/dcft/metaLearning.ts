/**
 * Meta-Learning System for DCFT
 * Based on DCFT Theory by Amaal Radwan
 * 
 * This module implements adaptive learning capabilities that allow the system
 * to improve its emotion detection accuracy over time through:
 * 1. Vocabulary weight adjustment based on feedback
 * 2. New keyword discovery from context
 * 3. Regional/cultural adaptation
 * 4. Temporal trend learning
 * 
 * The meta-learning layer sits above the three-layer DCFT architecture,
 * continuously refining the Perception Layer's vocabulary and weights.
 */

import { AffectiveVector } from './affectiveVector';

/**
 * Learned vocabulary entry with adaptive weights
 */
export interface LearnedVocabulary {
  word: string;
  emotion: keyof AffectiveVector;
  baseWeight: number;        // Original weight (0-1)
  learnedWeight: number;     // Adjusted weight after learning (0-1)
  confidence: number;        // How confident we are in this weight (0-1)
  occurrences: number;       // How many times this word appeared
  correctPredictions: number; // How many times it led to correct predictions
  lastUpdated: Date;
  source: 'base' | 'discovered' | 'user_feedback';
  regions?: string[];        // Regions where this word is particularly relevant
  contexts?: string[];       // Contexts where this word appears
}

/**
 * Feedback entry for learning
 */
export interface FeedbackEntry {
  id: string;
  text: string;
  predictedEmotion: keyof AffectiveVector;
  actualEmotion: keyof AffectiveVector;
  predictedConfidence: number;
  wasCorrect: boolean;
  timestamp: Date;
  userId?: string;
  region?: string;
}

/**
 * Discovered pattern from data
 */
export interface DiscoveredPattern {
  id: string;
  pattern: string;           // Regex or keyword pattern
  associatedEmotions: Partial<AffectiveVector>;
  confidence: number;
  occurrences: number;
  firstSeen: Date;
  lastSeen: Date;
  contexts: string[];
}

/**
 * Learning statistics
 */
export interface LearningStats {
  totalFeedback: number;
  correctPredictions: number;
  accuracy: number;
  vocabularySize: number;
  discoveredPatterns: number;
  lastLearningCycle: Date;
  improvementRate: number;   // How much accuracy improved over time
}

/**
 * Meta-Learning configuration
 */
const META_LEARNING_CONFIG = {
  // Learning rate for weight adjustments
  learningRate: 0.1,
  
  // Minimum occurrences before adjusting weight
  minOccurrencesForLearning: 5,
  
  // Confidence threshold for accepting new patterns
  patternConfidenceThreshold: 0.7,
  
  // Decay rate for old feedback (older feedback has less influence)
  feedbackDecayRate: 0.05,
  
  // Maximum vocabulary size to prevent bloat
  maxVocabularySize: 10000,
  
  // Minimum confidence to keep a learned word
  minConfidenceThreshold: 0.3,
};

/**
 * Base emotion vocabulary with initial weights
 */
const BASE_VOCABULARY: LearnedVocabulary[] = [
  // Joy
  { word: 'happy', emotion: 'joy', baseWeight: 0.8, learnedWeight: 0.8, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'celebrate', emotion: 'joy', baseWeight: 0.9, learnedWeight: 0.9, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'victory', emotion: 'joy', baseWeight: 0.85, learnedWeight: 0.85, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'success', emotion: 'joy', baseWeight: 0.75, learnedWeight: 0.75, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'فرح', emotion: 'joy', baseWeight: 0.9, learnedWeight: 0.9, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base', regions: ['AR'] },
  { word: 'سعادة', emotion: 'joy', baseWeight: 0.85, learnedWeight: 0.85, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base', regions: ['AR'] },
  
  // Fear
  { word: 'fear', emotion: 'fear', baseWeight: 0.9, learnedWeight: 0.9, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'crisis', emotion: 'fear', baseWeight: 0.85, learnedWeight: 0.85, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'danger', emotion: 'fear', baseWeight: 0.9, learnedWeight: 0.9, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'threat', emotion: 'fear', baseWeight: 0.8, learnedWeight: 0.8, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'خوف', emotion: 'fear', baseWeight: 0.9, learnedWeight: 0.9, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base', regions: ['AR'] },
  { word: 'رعب', emotion: 'fear', baseWeight: 0.95, learnedWeight: 0.95, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base', regions: ['AR'] },
  
  // Anger
  { word: 'angry', emotion: 'anger', baseWeight: 0.85, learnedWeight: 0.85, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'outrage', emotion: 'anger', baseWeight: 0.9, learnedWeight: 0.9, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'fury', emotion: 'anger', baseWeight: 0.95, learnedWeight: 0.95, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'غضب', emotion: 'anger', baseWeight: 0.9, learnedWeight: 0.9, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base', regions: ['AR'] },
  
  // Sadness
  { word: 'sad', emotion: 'sadness', baseWeight: 0.8, learnedWeight: 0.8, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'tragedy', emotion: 'sadness', baseWeight: 0.95, learnedWeight: 0.95, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'grief', emotion: 'sadness', baseWeight: 0.9, learnedWeight: 0.9, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'حزن', emotion: 'sadness', baseWeight: 0.9, learnedWeight: 0.9, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base', regions: ['AR'] },
  
  // Hope
  { word: 'hope', emotion: 'hope', baseWeight: 0.9, learnedWeight: 0.9, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'optimism', emotion: 'hope', baseWeight: 0.85, learnedWeight: 0.85, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'recovery', emotion: 'hope', baseWeight: 0.75, learnedWeight: 0.75, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'أمل', emotion: 'hope', baseWeight: 0.9, learnedWeight: 0.9, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base', regions: ['AR'] },
  
  // Curiosity
  { word: 'discover', emotion: 'curiosity', baseWeight: 0.8, learnedWeight: 0.8, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'research', emotion: 'curiosity', baseWeight: 0.7, learnedWeight: 0.7, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'mystery', emotion: 'curiosity', baseWeight: 0.75, learnedWeight: 0.75, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base' },
  { word: 'فضول', emotion: 'curiosity', baseWeight: 0.85, learnedWeight: 0.85, confidence: 1, occurrences: 0, correctPredictions: 0, lastUpdated: new Date(), source: 'base', regions: ['AR'] },
];

/**
 * Meta-Learning Engine
 * Implements adaptive learning for emotion vocabulary
 */
export class MetaLearningEngine {
  private vocabulary: Map<string, LearnedVocabulary> = new Map();
  private feedbackHistory: FeedbackEntry[] = [];
  private discoveredPatterns: DiscoveredPattern[] = [];
  private stats: LearningStats;

  constructor() {
    // Initialize with base vocabulary
    BASE_VOCABULARY.forEach(entry => {
      this.vocabulary.set(entry.word.toLowerCase(), { ...entry });
    });

    this.stats = {
      totalFeedback: 0,
      correctPredictions: 0,
      accuracy: 0,
      vocabularySize: this.vocabulary.size,
      discoveredPatterns: 0,
      lastLearningCycle: new Date(),
      improvementRate: 0,
    };
  }

  /**
   * Get learned weight for a word
   */
  getWordWeight(word: string, emotion: keyof AffectiveVector, region?: string): number {
    const entry = this.vocabulary.get(word.toLowerCase());
    
    if (!entry || entry.emotion !== emotion) {
      return 0;
    }

    // Apply regional boost if applicable
    let weight = entry.learnedWeight;
    if (region && entry.regions?.includes(region)) {
      weight *= 1.2; // 20% boost for regional relevance
    }

    return Math.min(1, weight * entry.confidence);
  }

  /**
   * Get all vocabulary entries for an emotion
   */
  getEmotionVocabulary(emotion: keyof AffectiveVector): LearnedVocabulary[] {
    return Array.from(this.vocabulary.values())
      .filter(entry => entry.emotion === emotion)
      .sort((a, b) => b.learnedWeight - a.learnedWeight);
  }

  /**
   * Process feedback and update weights
   * This is the core learning function
   */
  processFeedback(feedback: FeedbackEntry): void {
    this.feedbackHistory.push(feedback);
    this.stats.totalFeedback++;

    if (feedback.wasCorrect) {
      this.stats.correctPredictions++;
    }

    // Update accuracy
    this.stats.accuracy = this.stats.correctPredictions / this.stats.totalFeedback;

    // Extract words from the text
    const words = this.extractWords(feedback.text);

    // Update weights for each word
    words.forEach(word => {
      const entry = this.vocabulary.get(word);
      
      if (entry) {
        // Update existing entry
        entry.occurrences++;
        
        if (feedback.wasCorrect && entry.emotion === feedback.predictedEmotion) {
          // Correct prediction - increase weight
          entry.correctPredictions++;
          this.adjustWeight(entry, true);
        } else if (!feedback.wasCorrect && entry.emotion === feedback.predictedEmotion) {
          // Incorrect prediction - decrease weight
          this.adjustWeight(entry, false);
        }
        
        entry.lastUpdated = new Date();
      } else {
        // Potentially discover new word
        this.considerNewWord(word, feedback);
      }
    });

    // Trigger learning cycle if enough feedback accumulated
    if (this.feedbackHistory.length % 100 === 0) {
      this.runLearningCycle();
    }
  }

  /**
   * Adjust weight based on feedback
   * Uses gradient descent-like approach
   */
  private adjustWeight(entry: LearnedVocabulary, wasCorrect: boolean): void {
    const { learningRate, minOccurrencesForLearning } = META_LEARNING_CONFIG;

    // Only adjust if we have enough data
    if (entry.occurrences < minOccurrencesForLearning) {
      return;
    }

    // Calculate accuracy for this word
    const wordAccuracy = entry.correctPredictions / entry.occurrences;

    if (wasCorrect) {
      // Increase weight slightly
      entry.learnedWeight = Math.min(1, entry.learnedWeight + learningRate * (1 - entry.learnedWeight));
      entry.confidence = Math.min(1, entry.confidence + learningRate * 0.5);
    } else {
      // Decrease weight
      entry.learnedWeight = Math.max(0.1, entry.learnedWeight - learningRate * entry.learnedWeight);
      entry.confidence = Math.max(0.3, entry.confidence - learningRate * 0.3);
    }

    // Adjust confidence based on overall accuracy
    entry.confidence = (entry.confidence + wordAccuracy) / 2;
  }

  /**
   * Consider adding a new word to vocabulary
   */
  private considerNewWord(word: string, feedback: FeedbackEntry): void {
    // Skip very short words
    if (word.length < 3) return;

    // Skip common stop words
    const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being'];
    if (stopWords.includes(word)) return;

    // If the prediction was correct, this word might be associated with the emotion
    if (feedback.wasCorrect) {
      const existingPattern = this.discoveredPatterns.find(p => p.pattern === word);
      
      if (existingPattern) {
        existingPattern.occurrences++;
        existingPattern.lastSeen = new Date();
        existingPattern.confidence = Math.min(1, existingPattern.confidence + 0.1);
        
        // If pattern is confident enough, add to vocabulary
        if (existingPattern.confidence >= META_LEARNING_CONFIG.patternConfidenceThreshold &&
            existingPattern.occurrences >= META_LEARNING_CONFIG.minOccurrencesForLearning) {
          this.addToVocabulary(word, feedback.actualEmotion, existingPattern.confidence);
        }
      } else {
        // Create new pattern entry
        this.discoveredPatterns.push({
          id: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          pattern: word,
          associatedEmotions: { [feedback.actualEmotion]: 1 },
          confidence: 0.3,
          occurrences: 1,
          firstSeen: new Date(),
          lastSeen: new Date(),
          contexts: [feedback.text.substring(0, 100)],
        });
        this.stats.discoveredPatterns = this.discoveredPatterns.length;
      }
    }
  }

  /**
   * Add a discovered word to the vocabulary
   */
  private addToVocabulary(word: string, emotion: keyof AffectiveVector, confidence: number): void {
    if (this.vocabulary.size >= META_LEARNING_CONFIG.maxVocabularySize) {
      // Remove lowest confidence entries
      this.pruneVocabulary();
    }

    const newEntry: LearnedVocabulary = {
      word,
      emotion,
      baseWeight: 0.5,
      learnedWeight: 0.5,
      confidence,
      occurrences: 1,
      correctPredictions: 1,
      lastUpdated: new Date(),
      source: 'discovered',
    };

    this.vocabulary.set(word.toLowerCase(), newEntry);
    this.stats.vocabularySize = this.vocabulary.size;
  }

  /**
   * Remove low-confidence entries to maintain vocabulary size
   */
  private pruneVocabulary(): void {
    const entries = Array.from(this.vocabulary.entries())
      .filter(([_, entry]) => entry.source !== 'base') // Never remove base vocabulary
      .sort((a, b) => a[1].confidence - b[1].confidence);

    // Remove bottom 10%
    const removeCount = Math.floor(entries.length * 0.1);
    entries.slice(0, removeCount).forEach(([word, _]) => {
      this.vocabulary.delete(word);
    });

    this.stats.vocabularySize = this.vocabulary.size;
  }

  /**
   * Run a full learning cycle
   * Analyzes all feedback and optimizes weights
   */
  runLearningCycle(): void {
    const previousAccuracy = this.stats.accuracy;

    // Apply temporal decay to old feedback
    const now = Date.now();
    this.feedbackHistory = this.feedbackHistory.filter(f => {
      const ageHours = (now - f.timestamp.getTime()) / (1000 * 60 * 60);
      return ageHours < 720; // Keep last 30 days
    });

    // Recalculate statistics
    this.stats.totalFeedback = this.feedbackHistory.length;
    this.stats.correctPredictions = this.feedbackHistory.filter(f => f.wasCorrect).length;
    this.stats.accuracy = this.stats.totalFeedback > 0 
      ? this.stats.correctPredictions / this.stats.totalFeedback 
      : 0;

    // Calculate improvement rate
    this.stats.improvementRate = this.stats.accuracy - previousAccuracy;
    this.stats.lastLearningCycle = new Date();

    // Prune low-confidence discovered patterns
    this.discoveredPatterns = this.discoveredPatterns.filter(
      p => p.confidence >= META_LEARNING_CONFIG.minConfidenceThreshold
    );
    this.stats.discoveredPatterns = this.discoveredPatterns.length;
  }

  /**
   * Extract words from text
   */
  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF]/g, ' ') // Keep Arabic characters
      .split(/\s+/)
      .filter(word => word.length >= 2);
  }

  /**
   * Get learning statistics
   */
  getStats(): LearningStats {
    return { ...this.stats };
  }

  /**
   * Get vocabulary size by source
   */
  getVocabularyBreakdown(): { base: number; discovered: number; userFeedback: number } {
    const entries = Array.from(this.vocabulary.values());
    return {
      base: entries.filter(e => e.source === 'base').length,
      discovered: entries.filter(e => e.source === 'discovered').length,
      userFeedback: entries.filter(e => e.source === 'user_feedback').length,
    };
  }

  /**
   * Export learned vocabulary for persistence
   */
  exportVocabulary(): LearnedVocabulary[] {
    return Array.from(this.vocabulary.values());
  }

  /**
   * Import vocabulary from persistence
   */
  importVocabulary(entries: LearnedVocabulary[]): void {
    entries.forEach(entry => {
      this.vocabulary.set(entry.word.toLowerCase(), entry);
    });
    this.stats.vocabularySize = this.vocabulary.size;
  }

  /**
   * Analyze text using learned vocabulary
   * Returns emotion scores based on learned weights
   */
  analyzeWithLearnedVocabulary(text: string, region?: string): AffectiveVector {
    const words = this.extractWords(text);
    const scores: AffectiveVector = {
      joy: 0,
      fear: 0,
      anger: 0,
      sadness: 0,
      hope: 0,
      curiosity: 0,
    };

    const emotions: (keyof AffectiveVector)[] = ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity'];
    
    words.forEach(word => {
      emotions.forEach(emotion => {
        const weight = this.getWordWeight(word, emotion, region);
        if (weight > 0) {
          scores[emotion] += weight;
        }
      });
    });

    // Normalize scores to -1 to +1 range
    const maxScore = Math.max(...Object.values(scores), 1);
    emotions.forEach(emotion => {
      scores[emotion] = (scores[emotion] / maxScore) * 2 - 1;
    });

    return scores;
  }

  /**
   * Add user-provided vocabulary
   */
  addUserVocabulary(word: string, emotion: keyof AffectiveVector, weight: number = 0.7): void {
    const entry: LearnedVocabulary = {
      word,
      emotion,
      baseWeight: weight,
      learnedWeight: weight,
      confidence: 0.8, // User-provided has high initial confidence
      occurrences: 0,
      correctPredictions: 0,
      lastUpdated: new Date(),
      source: 'user_feedback',
    };

    this.vocabulary.set(word.toLowerCase(), entry);
    this.stats.vocabularySize = this.vocabulary.size;
  }
}

/**
 * Create singleton instance
 */
export const metaLearningEngine = new MetaLearningEngine();
