/**
 * AI Learning Store - Smart Storage System
 * يخزن: السؤال + السياق + النتيجة
 * جاهز للتحول لعقل حي يتعلم
 */

// Types
export interface AnalysisRecord {
  id: string;
  timestamp: Date;
  
  // Input (السؤال)
  question: {
    topic: string;
    countryCode: string | null;
    countryName: string | null;
    userType: string;
    language: string;
    originalQuery: string;
  };
  
  // Context (السياق)
  context: {
    domain: string;
    eventType: string;
    sensitivityLevel: string;
    timeRange: string;
    sourcesUsed: string[];
    sourceCount: number;
    dataQuality: number; // 0-100
  };
  
  // Result (النتيجة)
  result: {
    gmi: number;
    cfi: number;
    hri: number;
    dominantEmotion: string;
    emotionalIntensity: number;
    valence: number;
    affectiveVector: Record<string, number>;
    confidence: number;
    insights: string[];
    drivers: string[];
  };
  
  // Engine Contributions
  engineContributions: {
    contextClassification: number;
    emotionFusion: number;
    emotionalDynamics: number;
    driverDetection: number;
    explainableInsight: number;
  };
  
  // Learning Metadata
  learningMeta: {
    wasCorrect: boolean | null; // null = not yet verified
    actualOutcome: string | null; // What actually happened
    feedbackReceived: boolean;
    correctionApplied: boolean;
    learnedAt: Date | null;
  };
}

export interface LearningFeedback {
  id: string;
  analysisId: string;
  timestamp: Date;
  feedbackType: 'accuracy' | 'outcome' | 'correction' | 'general';
  
  // User feedback
  userRating: number | null; // 1-5
  userComment: string | null;
  
  // Outcome feedback (هل تحقق التوقع؟)
  predictedOutcome: string | null;
  actualOutcome: string | null;
  outcomeMatch: boolean | null;
  
  // Correction feedback
  originalValue: string | null;
  correctedValue: string | null;
  correctionReason: string | null;
}

export interface LearningAdjustment {
  id: string;
  timestamp: Date;
  adjustmentType: 'weight' | 'threshold' | 'bias' | 'pattern';
  
  // What was adjusted
  targetEngine: string;
  targetParameter: string;
  
  // Values
  previousValue: number;
  newValue: number;
  adjustmentDelta: number;
  
  // Reason
  reason: string;
  basedOnFeedbackCount: number;
  confidenceInAdjustment: number;
}

// In-memory stores (جاهزة للترقية لقاعدة بيانات)
const analysisStore: Map<string, AnalysisRecord> = new Map();
const feedbackStore: Map<string, LearningFeedback> = new Map();
const adjustmentStore: Map<string, LearningAdjustment> = new Map();

// Current learning state
let currentLearningState = {
  totalAnalyses: 0,
  verifiedAnalyses: 0,
  correctPredictions: 0,
  incorrectPredictions: 0,
  accuracyRate: 0,
  lastLearningCycle: null as Date | null,
  adjustmentsMade: 0,
};

// ============================================
// Smart Storage Functions
// ============================================

/**
 * Store a new analysis record
 */
export function storeAnalysisRecord(
  question: AnalysisRecord['question'],
  context: AnalysisRecord['context'],
  result: AnalysisRecord['result'],
  engineContributions: AnalysisRecord['engineContributions']
): AnalysisRecord {
  const id = `AML-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const record: AnalysisRecord = {
    id,
    timestamp: new Date(),
    question,
    context,
    result,
    engineContributions,
    learningMeta: {
      wasCorrect: null,
      actualOutcome: null,
      feedbackReceived: false,
      correctionApplied: false,
      learnedAt: null,
    },
  };
  
  analysisStore.set(id, record);
  currentLearningState.totalAnalyses++;
  
  return record;
}

/**
 * Get analysis record by ID
 */
export function getAnalysisRecord(id: string): AnalysisRecord | undefined {
  return analysisStore.get(id);
}

/**
 * Get recent analyses
 */
export function getRecentAnalyses(limit: number = 100): AnalysisRecord[] {
  return Array.from(analysisStore.values())
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

/**
 * Search analyses by topic or country
 */
export function searchAnalyses(query: {
  topic?: string;
  countryCode?: string;
  domain?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}): AnalysisRecord[] {
  let results = Array.from(analysisStore.values());
  
  if (query.topic) {
    const topicLower = query.topic.toLowerCase();
    results = results.filter(r => 
      r.question.topic.toLowerCase().includes(topicLower) ||
      r.question.originalQuery.toLowerCase().includes(topicLower)
    );
  }
  
  if (query.countryCode) {
    results = results.filter(r => r.question.countryCode === query.countryCode);
  }
  
  if (query.domain) {
    results = results.filter(r => r.context.domain === query.domain);
  }
  
  if (query.startDate) {
    results = results.filter(r => r.timestamp >= query.startDate!);
  }
  
  if (query.endDate) {
    results = results.filter(r => r.timestamp <= query.endDate!);
  }
  
  return results
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, query.limit || 100);
}

// ============================================
// Feedback Functions
// ============================================

/**
 * Submit user accuracy feedback
 */
export function submitAccuracyFeedback(
  analysisId: string,
  rating: number,
  comment?: string
): LearningFeedback {
  const id = `FBK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const feedback: LearningFeedback = {
    id,
    analysisId,
    timestamp: new Date(),
    feedbackType: 'accuracy',
    userRating: rating,
    userComment: comment || null,
    predictedOutcome: null,
    actualOutcome: null,
    outcomeMatch: null,
    originalValue: null,
    correctedValue: null,
    correctionReason: null,
  };
  
  feedbackStore.set(id, feedback);
  
  // Update analysis record
  const analysis = analysisStore.get(analysisId);
  if (analysis) {
    analysis.learningMeta.feedbackReceived = true;
    if (rating >= 4) {
      analysis.learningMeta.wasCorrect = true;
      currentLearningState.correctPredictions++;
    } else if (rating <= 2) {
      analysis.learningMeta.wasCorrect = false;
      currentLearningState.incorrectPredictions++;
    }
    currentLearningState.verifiedAnalyses++;
    updateAccuracyRate();
  }
  
  return feedback;
}

/**
 * Submit outcome feedback (هل تحقق التوقع؟)
 */
export function submitOutcomeFeedback(
  analysisId: string,
  predictedOutcome: string,
  actualOutcome: string,
  comment?: string
): LearningFeedback {
  const id = `FBK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const outcomeMatch = predictedOutcome.toLowerCase() === actualOutcome.toLowerCase();
  
  const feedback: LearningFeedback = {
    id,
    analysisId,
    timestamp: new Date(),
    feedbackType: 'outcome',
    userRating: null,
    userComment: comment || null,
    predictedOutcome,
    actualOutcome,
    outcomeMatch,
    originalValue: null,
    correctedValue: null,
    correctionReason: null,
  };
  
  feedbackStore.set(id, feedback);
  
  // Update analysis record
  const analysis = analysisStore.get(analysisId);
  if (analysis) {
    analysis.learningMeta.feedbackReceived = true;
    analysis.learningMeta.actualOutcome = actualOutcome;
    analysis.learningMeta.wasCorrect = outcomeMatch;
    
    if (outcomeMatch) {
      currentLearningState.correctPredictions++;
    } else {
      currentLearningState.incorrectPredictions++;
    }
    currentLearningState.verifiedAnalyses++;
    updateAccuracyRate();
  }
  
  return feedback;
}

/**
 * Submit correction feedback
 */
export function submitCorrectionFeedback(
  analysisId: string,
  originalValue: string,
  correctedValue: string,
  reason?: string
): LearningFeedback {
  const id = `FBK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const feedback: LearningFeedback = {
    id,
    analysisId,
    timestamp: new Date(),
    feedbackType: 'correction',
    userRating: null,
    userComment: null,
    predictedOutcome: null,
    actualOutcome: null,
    outcomeMatch: null,
    originalValue,
    correctedValue,
    correctionReason: reason || null,
  };
  
  feedbackStore.set(id, feedback);
  
  // Update analysis record
  const analysis = analysisStore.get(analysisId);
  if (analysis) {
    analysis.learningMeta.feedbackReceived = true;
    analysis.learningMeta.correctionApplied = true;
    analysis.learningMeta.wasCorrect = false;
    currentLearningState.incorrectPredictions++;
    currentLearningState.verifiedAnalyses++;
    updateAccuracyRate();
  }
  
  return feedback;
}

/**
 * Get feedback for an analysis
 */
export function getFeedbackForAnalysis(analysisId: string): LearningFeedback[] {
  return Array.from(feedbackStore.values())
    .filter(f => f.analysisId === analysisId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// ============================================
// Learning Loop Functions
// ============================================

/**
 * Analyze patterns and suggest adjustments
 * "كنت غلط هنا" ويعدل أوزانه
 */
export function analyzeLearningPatterns(): {
  patterns: Array<{
    pattern: string;
    frequency: number;
    suggestedAdjustment: string;
    confidence: number;
  }>;
  recommendations: string[];
} {
  const corrections = Array.from(feedbackStore.values())
    .filter(f => f.feedbackType === 'correction');
  
  const outcomes = Array.from(feedbackStore.values())
    .filter(f => f.feedbackType === 'outcome' && f.outcomeMatch === false);
  
  const patterns: Array<{
    pattern: string;
    frequency: number;
    suggestedAdjustment: string;
    confidence: number;
  }> = [];
  
  // Pattern 1: Emotion misclassification
  const emotionCorrections = corrections.filter(c => 
    ['joy', 'fear', 'anger', 'sadness', 'hope', 'curiosity'].includes(c.originalValue || '')
  );
  
  if (emotionCorrections.length >= 3) {
    const correctionMap: Record<string, Record<string, number>> = {};
    emotionCorrections.forEach(c => {
      if (c.originalValue && c.correctedValue) {
        if (!correctionMap[c.originalValue]) {
          correctionMap[c.originalValue] = {};
        }
        correctionMap[c.originalValue][c.correctedValue] = 
          (correctionMap[c.originalValue][c.correctedValue] || 0) + 1;
      }
    });
    
    Object.entries(correctionMap).forEach(([original, corrections]) => {
      const mostCommon = Object.entries(corrections)
        .sort((a, b) => b[1] - a[1])[0];
      
      if (mostCommon && mostCommon[1] >= 2) {
        patterns.push({
          pattern: `كنت أصنف ${original} كـ ${mostCommon[0]} بشكل متكرر`,
          frequency: mostCommon[1],
          suggestedAdjustment: `زيادة وزن ${mostCommon[0]} عند اكتشاف ${original}`,
          confidence: Math.min(mostCommon[1] * 20, 90),
        });
      }
    });
  }
  
  // Pattern 2: Outcome prediction errors
  if (outcomes.length >= 3) {
    patterns.push({
      pattern: `${outcomes.length} توقعات لم تتحقق`,
      frequency: outcomes.length,
      suggestedAdjustment: 'تقليل الثقة في التوقعات المستقبلية',
      confidence: Math.min(outcomes.length * 15, 80),
    });
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (currentLearningState.accuracyRate < 70) {
    recommendations.push('دقة التحليل أقل من 70%، يُنصح بمراجعة أوزان المحركات');
  }
  
  if (patterns.length > 0) {
    recommendations.push(`تم اكتشاف ${patterns.length} أنماط خطأ متكررة`);
  }
  
  if (currentLearningState.verifiedAnalyses < 10) {
    recommendations.push('نحتاج المزيد من التغذية الراجعة للتعلم بشكل أفضل');
  }
  
  return { patterns, recommendations };
}

/**
 * Apply learning adjustment
 */
export function applyLearningAdjustment(
  targetEngine: string,
  targetParameter: string,
  previousValue: number,
  newValue: number,
  reason: string,
  feedbackCount: number
): LearningAdjustment {
  const id = `ADJ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const adjustment: LearningAdjustment = {
    id,
    timestamp: new Date(),
    adjustmentType: 'weight',
    targetEngine,
    targetParameter,
    previousValue,
    newValue,
    adjustmentDelta: newValue - previousValue,
    reason,
    basedOnFeedbackCount: feedbackCount,
    confidenceInAdjustment: Math.min(feedbackCount * 10, 90),
  };
  
  adjustmentStore.set(id, adjustment);
  currentLearningState.adjustmentsMade++;
  currentLearningState.lastLearningCycle = new Date();
  
  return adjustment;
}

/**
 * Get learning state
 */
export function getLearningState() {
  return {
    ...currentLearningState,
    totalFeedback: feedbackStore.size,
    pendingVerification: analysisStore.size - currentLearningState.verifiedAnalyses,
  };
}

/**
 * Get adjustment history
 */
export function getAdjustmentHistory(limit: number = 50): LearningAdjustment[] {
  return Array.from(adjustmentStore.values())
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

// ============================================
// Helper Functions
// ============================================

function updateAccuracyRate() {
  if (currentLearningState.verifiedAnalyses > 0) {
    currentLearningState.accuracyRate = Math.round(
      (currentLearningState.correctPredictions / currentLearningState.verifiedAnalyses) * 100
    );
  }
}

/**
 * Clear all learning data (for testing)
 */
export function clearLearningData() {
  analysisStore.clear();
  feedbackStore.clear();
  adjustmentStore.clear();
  currentLearningState = {
    totalAnalyses: 0,
    verifiedAnalyses: 0,
    correctPredictions: 0,
    incorrectPredictions: 0,
    accuracyRate: 0,
    lastLearningCycle: null,
    adjustmentsMade: 0,
  };
}

/**
 * Export learning data for persistence
 */
export function exportLearningData() {
  return {
    analyses: Array.from(analysisStore.values()),
    feedback: Array.from(feedbackStore.values()),
    adjustments: Array.from(adjustmentStore.values()),
    state: currentLearningState,
    exportedAt: new Date(),
  };
}

/**
 * Import learning data
 */
export function importLearningData(data: ReturnType<typeof exportLearningData>) {
  clearLearningData();
  
  data.analyses.forEach(a => analysisStore.set(a.id, a));
  data.feedback.forEach(f => feedbackStore.set(f.id, f));
  data.adjustments.forEach(adj => adjustmentStore.set(adj.id, adj));
  currentLearningState = data.state;
}
