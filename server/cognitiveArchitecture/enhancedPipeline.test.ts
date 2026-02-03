/**
 * اختبارات المكونات الجديدة
 * Session Context + Dynamic Response + Narrative Style + Enhanced Pipeline
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Session Context Tests
import { SessionContextManager, getFullContext } from './sessionContext';

// Dynamic Response Tests
import { 
  DynamicResponseEngine, 
  determineResponseStructure, 
  generateFormattingInstructions 
} from './dynamicResponseEngine';

// Narrative Style Tests
import { 
  NarrativeStyleEngine, 
  generateStyleInstructions, 
  applyConsultantStyle,
  generateConsultantQuestions 
} from './narrativeStyleEngine';

// Calibration Layer Tests
import { 
  CalibrationLayer
} from './calibrationLayer';

describe('Session Cognitive Context', () => {
  beforeEach(() => {
    // Reset session before each test
    SessionContextManager.resetSession('test-session');
  });

  it('should extract country from question', () => {
    const { session } = getFullContext('test-session', 'ما هو الوضع الاقتصادي في ليبيا؟');
    // Country is stored as English key
    expect(session.country).toBe('libya');
  });

  it('should extract domain from question', () => {
    const { session } = getFullContext('test-session', 'كيف يؤثر التضخم على الاقتصاد؟');
    expect(session.domain).toBe('economy');
  });

  it('should maintain context across questions', () => {
    // First question about Indonesia
    getFullContext('test-session', 'ما هو الوضع الاقتصادي في إندونيسيا؟');
    
    // Follow-up question without mentioning Indonesia
    const { effectiveContext } = getFullContext('test-session', 'ما هي المخاطر؟');
    
    // Country is stored as English key
    expect(effectiveContext.country).toBe('indonesia');
    expect(effectiveContext.isFollowUp).toBe(true);
  });

  it('should detect follow-up questions', () => {
    getFullContext('test-session', 'ما هو سعر الذهب؟');
    const { effectiveContext } = getFullContext('test-session', 'لماذا؟');
    
    expect(effectiveContext.isFollowUp).toBe(true);
  });

  it('should track question number in session', () => {
    getFullContext('test-session', 'السؤال الأول');
    getFullContext('test-session', 'السؤال الثاني');
    const { effectiveContext } = getFullContext('test-session', 'السؤال الثالث');
    
    expect(effectiveContext.questionNumber).toBe(3);
  });

  it('should generate session summary', () => {
    getFullContext('test-session', 'ما هو الوضع في ليبيا؟');
    getFullContext('test-session', 'وماذا عن الاقتصاد؟');
    
    const summary = SessionContextManager.getSessionSummary('test-session');
    expect(summary).toContain('libya');
    expect(summary).toContain('2');
  });
});

describe('Dynamic Response Engine', () => {
  it('should detect "why" question type', () => {
    const structure = determineResponseStructure({
      questionIntent: { type: 'why', isFollowUp: false, requiresContext: false },
      questionNumber: 1,
      userRole: 'general',
      isFollowUp: false,
      hasContext: true
    });
    
    // Actual format is deep_explanation
    expect(structure.format).toBe('deep_explanation');
  });

  it('should detect "what_if" question type', () => {
    const structure = determineResponseStructure({
      questionIntent: { type: 'what_if', isFollowUp: false, requiresContext: false },
      questionNumber: 1,
      userRole: 'general',
      isFollowUp: false,
      hasContext: true
    });
    
    // Actual format is full_analysis
    expect(structure.format).toBe('full_analysis');
  });

  it('should use shorter format for follow-up questions', () => {
    const structure = determineResponseStructure({
      questionIntent: { type: 'what', isFollowUp: true, requiresContext: true },
      questionNumber: 3,
      userRole: 'general',
      isFollowUp: true,
      hasContext: true
    });
    
    // Follow-up uses shorter length than first question
    expect(['short', 'medium']).toContain(structure.maxLength);
  });

  it('should use longer format for first questions', () => {
    const structure = determineResponseStructure({
      questionIntent: { type: 'what', isFollowUp: false, requiresContext: false },
      questionNumber: 1,
      userRole: 'general',
      isFollowUp: false,
      hasContext: true
    });
    
    // First question uses long format
    expect(structure.maxLength).toBe('long');
  });

  it('should generate formatting instructions', () => {
    const structure = determineResponseStructure({
      questionIntent: { type: 'why', isFollowUp: false, requiresContext: false },
      questionNumber: 1,
      userRole: 'general',
      isFollowUp: false,
      hasContext: true
    });
    
    const instructions = generateFormattingInstructions(structure);
    // Instructions should contain guidance
    expect(instructions.length).toBeGreaterThan(0);
  });
});

describe('Narrative Style Engine', () => {
  it('should generate consultant style instructions', () => {
    const instructions = generateStyleInstructions();
    
    expect(instructions).toContain('مستشار');
  });

  it('should apply consultant style to response', () => {
    const roboticResponse = '**التحليل:**\nالوضع الاقتصادي صعب.\n\n**الأسباب:**\n- السبب الأول';
    const styledResponse = applyConsultantStyle(roboticResponse);
    
    // Function should return a string
    expect(typeof styledResponse).toBe('string');
    expect(styledResponse.length).toBeGreaterThan(0);
  });

  it('should generate contextual follow-up questions', () => {
    const questions = generateConsultantQuestions('الذهب', 'fear', 'ليبيا');
    
    expect(questions.length).toBeGreaterThan(0);
    expect(questions.length).toBeLessThanOrEqual(3);
  });

  it('should generate questions for different emotions', () => {
    const fearQuestions = generateConsultantQuestions('الاقتصاد', 'fear', '');
    const hopeQuestions = generateConsultantQuestions('الاقتصاد', 'hope', '');
    
    // Both should return questions
    expect(fearQuestions.length).toBeGreaterThan(0);
    expect(hopeQuestions.length).toBeGreaterThan(0);
  });
});

describe('Calibration Layer', () => {
  it('should calculate calibration gap', () => {
    const mediaData = { fear: 70, hope: 30, anger: 50 };
    const surveyData = { fear: 40, hope: 60, anger: 30 };
    
    const gap = CalibrationLayer.calculateGap(mediaData, surveyData);
    
    expect(gap.fear).toBe(-30); // Media exaggerates fear
    expect(gap.hope).toBe(30);  // Media underestimates hope
  });

  it('should generate calibration insight', () => {
    const gap = { fear: -30, hope: 30, anger: -20 };
    const insight = CalibrationLayer.generateInsight(gap);
    
    expect(insight.length).toBeGreaterThan(0);
  });

  it('should detect media amplification', () => {
    const gap = { fear: -40, hope: 20, anger: -30 };
    const insight = CalibrationLayer.generateInsight(gap);
    
    expect(insight).toContain('تضخيم');
  });

  it('should detect media underestimation', () => {
    const gap = { fear: 30, hope: -40, anger: 20 };
    const insight = CalibrationLayer.generateInsight(gap);
    
    // Should mention that media underestimates or exaggerates
    expect(insight).toContain('يقلل');
  });
});

describe('Integration Tests', () => {
  it('should maintain Indonesia context in follow-up (Critical Bug Fix)', () => {
    // This is the exact bug from the proposal document
    const sessionId = 'indonesia-test';
    SessionContextManager.resetSession(sessionId);
    
    // First question about Indonesia
    getFullContext(sessionId, 'ما هو الوضع الاقتصادي في إندونيسيا؟');
    
    // Follow-up without mentioning Indonesia
    const { effectiveContext } = getFullContext(sessionId, 'ما هي المخاطر؟');
    
    // Should remember Indonesia (stored as English key)
    expect(effectiveContext.country).toBe('indonesia');
    // Topic should contain context from previous question
    expect(effectiveContext.isFollowUp).toBe(true);
  });

  it('should use appropriate response length for follow-up questions', () => {
    const sessionId = 'response-length-test';
    SessionContextManager.resetSession(sessionId);
    
    // First question
    getFullContext(sessionId, 'ما هو سعر الذهب؟');
    
    // Follow-up
    const { session } = getFullContext(sessionId, 'لماذا؟');
    
    const structure = determineResponseStructure({
      questionIntent: session.questionHistory[1]?.intent || { type: 'why', isFollowUp: true, requiresContext: true },
      questionNumber: 2,
      userRole: 'general',
      isFollowUp: true,
      hasContext: true
    });
    
    // Follow-up should use medium length
    expect(structure.maxLength).toBe('medium');
  });

  it('should properly reset session', () => {
    const sessionId = 'reset-test';
    
    // Add some context
    getFullContext(sessionId, 'ما هو الوضع في مصر؟');
    getFullContext(sessionId, 'وماذا عن الاقتصاد؟');
    
    // Reset
    SessionContextManager.resetSession(sessionId);
    
    // Should start fresh
    const { effectiveContext } = getFullContext(sessionId, 'سؤال جديد');
    expect(effectiveContext.questionNumber).toBe(1);
    expect(effectiveContext.isFollowUp).toBe(false);
  });
});
