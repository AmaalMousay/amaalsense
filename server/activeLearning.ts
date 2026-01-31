/**
 * Active Learning Engine
 * 
 * This module implements an active learning system that:
 * 1. Stores successful analysis patterns
 * 2. Learns from user feedback
 * 3. Improves future analyses based on learned patterns
 */

import { getDb } from "./db";
import { learningPatterns, keywordLearning } from "../drizzle/schema";
import { eq, desc, and, gte } from "drizzle-orm";

// Types
export interface LearningPatternInput {
  originalText: string;
  language: string;
  dialect?: string;
  eventType: string;
  region: string;
  contextConfidence: number;
  finalJoy: number;
  finalFear: number;
  finalAnger: number;
  finalSadness: number;
  finalHope: number;
  finalCuriosity: number;
}

export interface KeywordLearningInput {
  keyword: string;
  language: string;
  eventType: string;
  emotionalWeight: number;
  primaryEmotion: string;
  confidence?: number;
  source?: string;
}

export interface LearnedAdjustment {
  joyAdjustment: number;
  fearAdjustment: number;
  angerAdjustment: number;
  sadnessAdjustment: number;
  hopeAdjustment: number;
  curiosityAdjustment: number;
  confidence: number;
  matchedPatterns: number;
}

/**
 * Store a new learning pattern from a successful analysis
 */
export async function storeLearningPattern(input: LearningPatternInput): Promise<number> {
  const db = await getDb();
  if (!db) {
    console.warn("[ActiveLearning] Database not available");
    return 0;
  }
  
  try {
    const result = await db.insert(learningPatterns).values({
      originalText: input.originalText,
      language: input.language,
      dialect: input.dialect || null,
      eventType: input.eventType,
      region: input.region,
      contextConfidence: input.contextConfidence,
      finalJoy: input.finalJoy,
      finalFear: input.finalFear,
      finalAnger: input.finalAnger,
      finalSadness: input.finalSadness,
      finalHope: input.finalHope,
      finalCuriosity: input.finalCuriosity,
      usageCount: 0,
      isVerified: 0,
    });
    
    console.log(`[ActiveLearning] Stored new pattern for: ${input.eventType} (${input.language})`);
    return (result as any).insertId || 0;
  } catch (error) {
    console.error("[ActiveLearning] Error storing pattern:", error);
    return 0;
  }
}

/**
 * Store or update a learned keyword
 */
export async function storeKeyword(input: KeywordLearningInput): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[ActiveLearning] Database not available");
    return;
  }
  
  try {
    // Check if keyword already exists
    const existing = await db.select()
      .from(keywordLearning)
      .where(and(
        eq(keywordLearning.keyword, input.keyword),
        eq(keywordLearning.language, input.language)
      ))
      .limit(1);
    
    if (existing.length > 0) {
      // Update occurrence count and confidence
      await db.update(keywordLearning)
        .set({
          occurrenceCount: existing[0].occurrenceCount + 1,
          confidence: Math.min(100, existing[0].confidence + 5),
        })
        .where(eq(keywordLearning.id, existing[0].id));
      
      console.log(`[ActiveLearning] Updated keyword: ${input.keyword} (count: ${existing[0].occurrenceCount + 1})`);
    } else {
      // Insert new keyword
      await db.insert(keywordLearning).values({
        keyword: input.keyword,
        language: input.language,
        eventType: input.eventType,
        emotionalWeight: input.emotionalWeight,
        primaryEmotion: input.primaryEmotion,
        confidence: input.confidence || 50,
        source: input.source || "learned",
        occurrenceCount: 1,
      });
      
      console.log(`[ActiveLearning] Stored new keyword: ${input.keyword}`);
    }
  } catch (error) {
    console.error("[ActiveLearning] Error storing keyword:", error);
  }
}

/**
 * Get learned adjustments for a given text based on similar patterns
 */
export async function getLearnedAdjustments(
  text: string,
  eventType: string,
  language: string
): Promise<LearnedAdjustment | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }
  
  try {
    // Find similar patterns
    const patterns = await db.select()
      .from(learningPatterns)
      .where(and(
        eq(learningPatterns.eventType, eventType),
        eq(learningPatterns.language, language),
        gte(learningPatterns.contextConfidence, 60)
      ))
      .orderBy(desc(learningPatterns.usageCount))
      .limit(10);
    
    if (patterns.length === 0) {
      return null;
    }
    
    // Calculate average adjustments from patterns
    let totalJoy = 0, totalFear = 0, totalAnger = 0;
    let totalSadness = 0, totalHope = 0, totalCuriosity = 0;
    let totalWeight = 0;
    
    for (const pattern of patterns) {
      const weight = pattern.contextConfidence / 100;
      totalJoy += pattern.finalJoy * weight;
      totalFear += pattern.finalFear * weight;
      totalAnger += pattern.finalAnger * weight;
      totalSadness += pattern.finalSadness * weight;
      totalHope += pattern.finalHope * weight;
      totalCuriosity += pattern.finalCuriosity * weight;
      totalWeight += weight;
    }
    
    if (totalWeight === 0) {
      return null;
    }
    
    // Normalize
    const avgJoy = Math.round(totalJoy / totalWeight);
    const avgFear = Math.round(totalFear / totalWeight);
    const avgAnger = Math.round(totalAnger / totalWeight);
    const avgSadness = Math.round(totalSadness / totalWeight);
    const avgHope = Math.round(totalHope / totalWeight);
    const avgCuriosity = Math.round(totalCuriosity / totalWeight);
    
    // Calculate adjustment factors (how much to adjust from baseline)
    const adjustment: LearnedAdjustment = {
      joyAdjustment: avgJoy - 50,
      fearAdjustment: avgFear - 50,
      angerAdjustment: avgAnger - 50,
      sadnessAdjustment: avgSadness - 50,
      hopeAdjustment: avgHope - 50,
      curiosityAdjustment: avgCuriosity - 50,
      confidence: Math.round(totalWeight / patterns.length * 100),
      matchedPatterns: patterns.length,
    };
    
    console.log(`[ActiveLearning] Found ${patterns.length} matching patterns for ${eventType}`);
    
    return adjustment;
  } catch (error) {
    console.error("[ActiveLearning] Error getting adjustments:", error);
    return null;
  }
}

/**
 * Record user feedback for a pattern
 */
export async function recordFeedback(
  patternId: number,
  feedback: "accurate" | "inaccurate" | "partially_accurate"
): Promise<void> {
  const db = await getDb();
  if (!db) {
    return;
  }
  
  try {
    await db.update(learningPatterns)
      .set({
        userFeedback: feedback,
        feedbackAt: new Date(),
        isVerified: feedback === "accurate" ? 1 : 0,
      })
      .where(eq(learningPatterns.id, patternId));
    
    console.log(`[ActiveLearning] Recorded feedback: ${feedback} for pattern ${patternId}`);
  } catch (error) {
    console.error("[ActiveLearning] Error recording feedback:", error);
  }
}

/**
 * Get learned keywords for a specific language and event type
 */
export async function getLearnedKeywords(
  language: string,
  eventType?: string
): Promise<Array<{ keyword: string; emotionalWeight: number; primaryEmotion: string }>> {
  const db = await getDb();
  if (!db) {
    return [];
  }
  
  try {
    const conditions = [eq(keywordLearning.language, language)];
    if (eventType) {
      conditions.push(eq(keywordLearning.eventType, eventType));
    }
    
    const keywords = await db.select({
      keyword: keywordLearning.keyword,
      emotionalWeight: keywordLearning.emotionalWeight,
      primaryEmotion: keywordLearning.primaryEmotion,
    })
      .from(keywordLearning)
      .where(and(...conditions))
      .orderBy(desc(keywordLearning.confidence))
      .limit(100);
    
    return keywords;
  } catch (error) {
    console.error("[ActiveLearning] Error getting keywords:", error);
    return [];
  }
}

/**
 * Extract and learn keywords from analyzed text
 */
export async function learnKeywordsFromText(
  text: string,
  language: string,
  eventType: string,
  dominantEmotion: string,
  emotionalWeight: number
): Promise<void> {
  // Simple keyword extraction (words longer than 3 characters)
  const words = text.split(/[\s\.,،؛:!؟\?]+/).filter(w => w.length > 3);
  
  // Store unique words as potential keywords
  const uniqueWords = Array.from(new Set(words));
  
  for (const word of uniqueWords.slice(0, 5)) { // Limit to 5 keywords per text
    await storeKeyword({
      keyword: word,
      language,
      eventType,
      emotionalWeight,
      primaryEmotion: dominantEmotion,
      confidence: 30, // Start with low confidence
      source: "learned",
    });
  }
}

/**
 * Apply learned adjustments to emotion scores
 */
export function applyLearnedAdjustments(
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  },
  adjustment: LearnedAdjustment,
  weight: number = 0.3 // How much to weight learned adjustments (0-1)
): typeof emotions {
  const clamp = (val: number) => Math.max(0, Math.min(100, Math.round(val)));
  
  return {
    joy: clamp(emotions.joy + adjustment.joyAdjustment * weight),
    fear: clamp(emotions.fear + adjustment.fearAdjustment * weight),
    anger: clamp(emotions.anger + adjustment.angerAdjustment * weight),
    sadness: clamp(emotions.sadness + adjustment.sadnessAdjustment * weight),
    hope: clamp(emotions.hope + adjustment.hopeAdjustment * weight),
    curiosity: clamp(emotions.curiosity + adjustment.curiosityAdjustment * weight),
  };
}

// Initialize with some base keywords
export async function initializeBaseKeywords(): Promise<void> {
  const baseKeywords: KeywordLearningInput[] = [
    // Arabic death keywords
    { keyword: "موت", language: "arabic", eventType: "death", emotionalWeight: -90, primaryEmotion: "sadness", confidence: 95, source: "manual" },
    { keyword: "وفاة", language: "arabic", eventType: "death", emotionalWeight: -85, primaryEmotion: "sadness", confidence: 95, source: "manual" },
    { keyword: "استشهاد", language: "arabic", eventType: "death", emotionalWeight: -80, primaryEmotion: "sadness", confidence: 95, source: "manual" },
    { keyword: "رحيل", language: "arabic", eventType: "death", emotionalWeight: -75, primaryEmotion: "sadness", confidence: 90, source: "manual" },
    
    // Arabic celebration keywords
    { keyword: "فوز", language: "arabic", eventType: "celebration", emotionalWeight: 85, primaryEmotion: "joy", confidence: 90, source: "manual" },
    { keyword: "احتفال", language: "arabic", eventType: "celebration", emotionalWeight: 80, primaryEmotion: "joy", confidence: 90, source: "manual" },
    { keyword: "بطولة", language: "arabic", eventType: "celebration", emotionalWeight: 75, primaryEmotion: "joy", confidence: 85, source: "manual" },
    
    // English death keywords
    { keyword: "death", language: "english", eventType: "death", emotionalWeight: -90, primaryEmotion: "sadness", confidence: 95, source: "manual" },
    { keyword: "died", language: "english", eventType: "death", emotionalWeight: -85, primaryEmotion: "sadness", confidence: 95, source: "manual" },
    { keyword: "tragedy", language: "english", eventType: "death", emotionalWeight: -80, primaryEmotion: "sadness", confidence: 90, source: "manual" },
    
    // English celebration keywords
    { keyword: "victory", language: "english", eventType: "celebration", emotionalWeight: 85, primaryEmotion: "joy", confidence: 90, source: "manual" },
    { keyword: "celebration", language: "english", eventType: "celebration", emotionalWeight: 80, primaryEmotion: "joy", confidence: 90, source: "manual" },
    { keyword: "champion", language: "english", eventType: "celebration", emotionalWeight: 85, primaryEmotion: "joy", confidence: 85, source: "manual" },
  ];
  
  for (const kw of baseKeywords) {
    await storeKeyword(kw);
  }
  
  console.log("[ActiveLearning] Initialized base keywords");
}
