/**
 * Perception Layer (Layer 1) - Input Processing
 * Based on DCFT Theory by Amaal Radwan
 * 
 * This layer continuously gathers emotional data from open digital channels:
 * - Social networks, forums, video platforms, and news feeds
 * - Converts text/signal into emotional vectors using linguistic and tonal analysis
 */

import { AffectiveVector, EmotionEvent, normalizeToAV } from './affectiveVector';
import { calculateInfluenceWeight, calculateCredibility } from './influenceWeight';

/**
 * Raw input data from various sources
 */
export interface RawDigitalInput {
  id: string;
  content: string;
  source: string;
  sourceUrl?: string;
  author?: string;
  timestamp: Date;
  reach?: number;
  engagement?: number;
  isVerified?: boolean;
  countryCode?: string;
  language?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Processed perception output
 */
export interface PerceptionOutput {
  event: EmotionEvent;
  rawInput: RawDigitalInput;
  processingTime: number;
}

/**
 * Perception Layer class
 * Handles all input processing and initial emotion detection
 */
export class PerceptionLayer {
  private emotionKeywords: Record<string, Record<string, number>>;

  constructor() {
    this.emotionKeywords = this.initializeEmotionKeywords();
  }

  /**
   * Process raw digital input into an EmotionEvent
   */
  async processInput(input: RawDigitalInput): Promise<PerceptionOutput> {
    const startTime = Date.now();

    // Extract emotions from content
    const rawEmotions = this.extractEmotions(input.content, input.language);
    
    // Normalize to Affective Vector (-1 to +1 scale)
    const affectiveVector = normalizeToAV(rawEmotions);
    
    // Calculate influence weight
    const credibility = calculateCredibility(
      input.isVerified || false,
      0.7, // Default historical accuracy
      input.reach || 0,
      365 // Default account age
    );
    
    const weight = calculateInfluenceWeight(
      input.source,
      input.reach || 100,
      input.engagement || 10,
      credibility
    );

    // Create EmotionEvent
    const event: EmotionEvent = {
      id: input.id,
      content: input.content,
      source: input.source,
      timestamp: input.timestamp,
      reach: input.reach || 100,
      engagement: input.engagement || 10,
      affectiveVector,
      confidence: this.calculateConfidence(input),
    };

    return {
      event,
      rawInput: input,
      processingTime: Date.now() - startTime,
    };
  }

  /**
   * Process multiple inputs in batch
   */
  async processBatch(inputs: RawDigitalInput[]): Promise<PerceptionOutput[]> {
    return Promise.all(inputs.map(input => this.processInput(input)));
  }

  /**
   * Extract emotion scores from text content
   * Returns emotions on 0-100 scale
   */
  private extractEmotions(content: string, language?: string): {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  } {
    const text = content.toLowerCase();
    const words = text.split(/\s+/);
    
    // Initialize emotion scores
    const scores = {
      joy: 50,      // Neutral baseline
      fear: 50,
      anger: 50,
      sadness: 50,
      hope: 50,
      curiosity: 50,
    };

    // Analyze each word
    for (const word of words) {
      for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
        if (keywords[word]) {
          scores[emotion as keyof typeof scores] += keywords[word];
        }
      }
    }

    // Analyze patterns and intensifiers
    this.analyzePatterns(text, scores);
    
    // Clamp values to 0-100
    for (const key of Object.keys(scores) as (keyof typeof scores)[]) {
      scores[key] = Math.max(0, Math.min(100, scores[key]));
    }

    return scores;
  }

  /**
   * Analyze text patterns for emotional indicators
   */
  private analyzePatterns(text: string, scores: Record<string, number>): void {
    // Exclamation marks indicate intensity
    const exclamations = (text.match(/!/g) || []).length;
    if (exclamations > 0) {
      // Amplify dominant emotion
      const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
      scores[dominant] += exclamations * 3;
    }

    // Question marks indicate curiosity
    const questions = (text.match(/\?/g) || []).length;
    if (questions > 0) {
      scores.curiosity += questions * 5;
    }

    // ALL CAPS indicates strong emotion
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (capsRatio > 0.3) {
      scores.anger += 10;
    }

    // Negative patterns
    if (text.includes('not ') || text.includes("n't") || text.includes('never')) {
      // Invert positive emotions slightly
      scores.joy -= 10;
      scores.hope -= 5;
    }

    // Crisis keywords
    const crisisWords = ['crisis', 'emergency', 'urgent', 'breaking', 'alert'];
    for (const word of crisisWords) {
      if (text.includes(word)) {
        scores.fear += 15;
        scores.curiosity += 10;
      }
    }
  }

  /**
   * Calculate confidence score for the analysis
   */
  private calculateConfidence(input: RawDigitalInput): number {
    let confidence = 0.7; // Base confidence

    // Longer content = more reliable analysis
    const wordCount = input.content.split(/\s+/).length;
    if (wordCount > 50) confidence += 0.1;
    if (wordCount > 100) confidence += 0.05;
    if (wordCount < 10) confidence -= 0.2;

    // Verified sources are more reliable
    if (input.isVerified) confidence += 0.1;

    // News sources are more reliable
    if (input.source === 'news') confidence += 0.1;

    return Math.max(0.3, Math.min(1, confidence));
  }

  /**
   * Initialize emotion keyword dictionaries
   */
  private initializeEmotionKeywords(): Record<string, Record<string, number>> {
    return {
      joy: {
        happy: 15, joy: 20, excited: 15, wonderful: 15, amazing: 15,
        great: 10, good: 8, love: 15, celebrate: 15, success: 12,
        win: 12, victory: 15, triumph: 15, delight: 15, pleasure: 12,
        cheerful: 12, elated: 18, thrilled: 15, ecstatic: 20,
        // Arabic keywords
        سعيد: 15, فرح: 20, سعادة: 18, مبتهج: 15, رائع: 15,
      },
      fear: {
        fear: 20, afraid: 18, scared: 18, terror: 25, panic: 22,
        worry: 15, anxious: 15, nervous: 12, threat: 18, danger: 20,
        risk: 12, warning: 15, alarm: 18, dread: 20, horror: 22,
        // Arabic keywords
        خوف: 20, خائف: 18, قلق: 15, رعب: 25, تهديد: 18,
      },
      anger: {
        angry: 18, furious: 22, rage: 25, hate: 20, outrage: 22,
        frustrated: 15, annoyed: 12, mad: 15, hostile: 18, violent: 20,
        attack: 15, fight: 12, protest: 15, revolt: 18, rebellion: 18,
        // Arabic keywords
        غضب: 20, غاضب: 18, ثورة: 18, احتجاج: 15, عنف: 20,
      },
      sadness: {
        sad: 18, depressed: 22, grief: 25, sorrow: 20, mourning: 22,
        tragic: 20, loss: 18, death: 20, crying: 15, tears: 15,
        heartbroken: 22, devastated: 25, miserable: 20, hopeless: 22,
        // Arabic keywords
        حزن: 20, حزين: 18, أسى: 22, فقدان: 18, موت: 20,
      },
      hope: {
        hope: 20, optimistic: 18, future: 12, dream: 15, aspire: 15,
        believe: 12, faith: 15, trust: 12, progress: 15, improve: 12,
        recover: 15, rebuild: 15, resilient: 18, overcome: 15,
        // Arabic keywords
        أمل: 20, تفاؤل: 18, مستقبل: 12, حلم: 15, إيمان: 15,
      },
      curiosity: {
        curious: 18, wonder: 15, question: 12, explore: 15, discover: 15,
        investigate: 15, research: 12, learn: 10, understand: 10,
        mystery: 15, puzzle: 12, interesting: 12, fascinating: 15,
        // Arabic keywords
        فضول: 18, استكشاف: 15, اكتشاف: 15, بحث: 12, تساؤل: 12,
      },
    };
  }
}

/**
 * Create a singleton instance
 */
export const perceptionLayer = new PerceptionLayer();


// =============================================================================
// RESPONSE PERCEPTION HELPERS (merged from cognitiveArchitecture/perceptionLayer)
// =============================================================================

/**
 * Perception Layer - طبقة الإدراك
 * 
 * تضيف طبقة إدراك عميقة للفهم الحقيقي للسياق والعاطفة
 * بدلاً من استخدام قوالب ثابتة
 */

export interface PerceptionContext {
  topic: string;
  primaryEmotion: string;
  secondaryEmotions: string[];
  urgency: 'critical' | 'high' | 'medium' | 'low';
  affectedGroups: string[];
  rootCause: string;
  collectiveConsciousness: string;
  awarenessLevel: 'surface' | 'moderate' | 'deep';
}

export interface ResponseDirective {
  focus: 'solution' | 'explanation' | 'warning' | 'hope' | 'action';
  depth: 'brief' | 'moderate' | 'deep';
  tone: 'urgent' | 'analytical' | 'empathetic' | 'advisory';
  shouldAvoidTemplate: boolean;
  contextValidation: string[];
}

/**
 * تحليل السياق الحقيقي للسؤال
 * بدلاً من تطبيق قالب ثابت
 */
export function analyzePerception(
  question: string,
  previousContext: string,
  analysisData: any
): PerceptionContext {
  // استخراج الموضوع الأساسي
  const topic = extractTopic(question, previousContext);
  
  // تحديد العاطفة الأساسية من البيانات
  const emotions = analysisData.emotions || {};
  const primaryEmotion = Object.entries(emotions).sort((a, b) => (b as any)[1] - (a as any)[1])[0]?.[0] || 'neutral';
  const secondaryEmotions = Object.entries(emotions)
    .sort((a, b) => (b as any)[1] - (a as any)[1])
    .slice(1, 3)
    .map(e => e[0]);
  
  // تحديد الاستعجالية
  const urgency = determineUrgency(primaryEmotion, analysisData);
  
  // تحديد المجموعات المتأثرة
  const affectedGroups = identifyAffectedGroups(analysisData);
  
  // تحديد السبب الجذري
  const rootCause = identifyRootCause(question, analysisData);
  
  // فهم الوعي الجمعي
  const collectiveConsciousness = analyzeCollectiveConsciousness(analysisData);
  
  // مستوى الوعي
  const awarenessLevel = determineAwarenessLevel(analysisData);
  
  return {
    topic,
    primaryEmotion,
    secondaryEmotions,
    urgency,
    affectedGroups,
    rootCause,
    collectiveConsciousness,
    awarenessLevel,
  };
}

/**
 * تحديد التوجيه المناسب للرد
 * بدلاً من استخدام قالب ثابت
 */
export function determineResponseDirective(
  perception: PerceptionContext,
  question: string,
  isFollowUp: boolean
): ResponseDirective {
  // تحليل نوع السؤال
  const questionType = classifyQuestion(question);
  
  // تحديد التركيز
  let focus: 'solution' | 'explanation' | 'warning' | 'hope' | 'action' = 'explanation';
  
  if (questionType === 'how' || questionType === 'solution') {
    focus = 'solution';
  } else if (questionType === 'what-if') {
    focus = 'warning';
  } else if (questionType === 'impact') {
    focus = 'action';
  } else if (perception.urgency === 'critical') {
    focus = 'warning';
  }
  
  // تحديد العمق
  let depth: 'brief' | 'moderate' | 'deep' = 'moderate';
  if (isFollowUp) {
    depth = 'brief';
  } else if (perception.awarenessLevel === 'surface') {
    depth = 'deep';
  }
  
  // تحديد النبرة
  let tone: 'urgent' | 'analytical' | 'empathetic' | 'advisory' = 'analytical';
  if (perception.urgency === 'critical') {
    tone = 'urgent';
  } else if (perception.primaryEmotion === 'fear' || perception.primaryEmotion === 'sadness') {
    tone = 'empathetic';
  } else if (focus === 'solution') {
    tone = 'advisory';
  }
  
  // التحقق من السياق
  const contextValidation = validateContext(perception, question);
  
  return {
    focus,
    depth,
    tone,
    shouldAvoidTemplate: true, // دائماً تجنب القالب الثابت
    contextValidation,
  };
}

/**
 * استخراج الموضوع الأساسي
 */
function extractTopic(question: string, previousContext: string): string {
  // إذا كان هناك سياق سابق، استخدمه
  if (previousContext) {
    const topicMatch = previousContext.match(/موضوع:\s*([^\n]+)/);
    if (topicMatch) return topicMatch[1];
  }
  
  // استخراج من السؤال
  const words = question.split(' ');
  return words.slice(0, 5).join(' ');
}

/**
 * تحديد استعجالية الموقف
 */
function determineUrgency(emotion: string, data: any): 'critical' | 'high' | 'medium' | 'low' {
  if (emotion === 'fear' || emotion === 'anger') {
    return data.gmi < -50 ? 'critical' : 'high';
  }
  if (emotion === 'sadness') {
    return 'medium';
  }
  return 'low';
}

/**
 * تحديد المجموعات المتأثرة
 */
function identifyAffectedGroups(data: any): string[] {
  const groups: string[] = [];
  
  if (data.demographics) {
    data.demographics.forEach((demo: any) => {
      if (demo.opposition > 60) {
        groups.push(`${demo.label} (${demo.opposition}% معارضة)`);
      }
    });
  }
  
  return groups;
}

/**
 * تحديد السبب الجذري
 */
function identifyRootCause(question: string, data: any): string {
  // تحليل السؤال والبيانات لتحديد السبب الحقيقي
  if (question.toLowerCase().includes('غضب') || question.toLowerCase().includes('غضب')) {
    return 'تدهور الظروف المعيشية والشعور بالظلم';
  }
  
  if (question.toLowerCase().includes('خوف')) {
    return 'عدم اليقين والتهديدات الوجودية';
  }
  
  return 'عوامل متعددة معقدة';
}

/**
 * تحليل الوعي الجمعي
 */
function analyzeCollectiveConsciousness(data: any): string {
  const gmi = data.gmi || 0;
  const cfi = data.cfi || 50;
  const hri = data.hri || 50;
  
  if (gmi < -50) {
    return 'وعي جمعي متشائم يسيطر عليه الخوف والغضب';
  }
  
  if (gmi > 50) {
    return 'وعي جمعي متفائل يسيطر عليه الأمل والرغبة في التغيير';
  }
  
  return 'وعي جمعي متوازن بين التفاؤل والتشاؤم';
}

/**
 * تحديد مستوى الوعي
 */
function determineAwarenessLevel(data: any): 'surface' | 'moderate' | 'deep' {
  const confidence = data.confidence || 0;
  
  if (confidence > 80) {
    return 'deep';
  }
  
  if (confidence > 60) {
    return 'moderate';
  }
  
  return 'surface';
}

/**
 * تصنيف نوع السؤال
 */
function classifyQuestion(question: string): string {
  if (question.toLowerCase().includes('كيف')) {
    return 'how';
  }
  
  if (question.toLowerCase().includes('ماذا لو') || question.toLowerCase().includes('ماذا لو')) {
    return 'what-if';
  }
  
  if (question.toLowerCase().includes('تأثير') || question.toLowerCase().includes('تأثير')) {
    return 'impact';
  }
  
  if (question.toLowerCase().includes('حل') || question.toLowerCase().includes('حل')) {
    return 'solution';
  }
  
  return 'general';
}

/**
 * التحقق من صحة السياق
 */
function validateContext(perception: PerceptionContext, question: string): string[] {
  const validations: string[] = [];
  
  // التأكد من أن الموضوع لم يتغير
  if (!question.toLowerCase().includes(perception.topic.toLowerCase())) {
    validations.push(`تحذير: قد يكون الموضوع قد تغير من "${perception.topic}"`);
  }
  
  // التأكد من أن العاطفة الأساسية واضحة
  if (perception.primaryEmotion === 'neutral') {
    validations.push('تحذير: العاطفة الأساسية غير واضحة');
  }
  
  return validations;
}
