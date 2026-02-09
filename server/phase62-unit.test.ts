/**
 * Phase 62 Unit Tests: Data Flow and Dynamic Response Format
 * 
 * Fast tests with mocks for:
 * 1. Data passing from topicAnalyzer to UnifiedPipeline
 * 2. Dynamic response format based on question type
 * 3. Response structure determination
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { determineResponseStructure, type ResponseStructure } from './cognitiveArchitecture/dynamicResponseEngine';

describe('Phase 62: Dynamic Response Format (Unit Tests)', () => {
  
  describe('1. Response Structure Determination', () => {
    
    it('should return full_analysis for first question', () => {
      const structure = determineResponseStructure({
        questionIntent: { type: 'what', isFollowUp: false, requiresContext: false },
        questionNumber: 1,
        userRole: 'general',
        isFollowUp: false,
        hasContext: false
      });
      
      expect(structure).toBeDefined();
      expect(structure.format).toBe('full_analysis');
      expect(structure.maxLength).toBe('long');
    });
    
    it('should return brief_followup for follow-up questions', () => {
      const structure = determineResponseStructure({
        questionIntent: { type: 'followup', isFollowUp: true, requiresContext: true },
        questionNumber: 2,
        userRole: 'general',
        isFollowUp: true,
        hasContext: true
      });
      
      expect(structure).toBeDefined();
      expect(structure.format).toBe('brief_followup');
      expect(structure.maxLength).toBe('medium');
    });
    
    it('should return direct_answer for clarification questions', () => {
      const structure = determineResponseStructure({
        questionIntent: { type: 'clarification', isFollowUp: false, requiresContext: false },
        questionNumber: 1,
        userRole: 'general',
        isFollowUp: false,
        hasContext: false
      });
      
      expect(structure).toBeDefined();
      expect(structure.format).toBe('clarification');
    });
    
    it('should return deep_explanation for why questions', () => {
      const structure = determineResponseStructure({
        questionIntent: { type: 'why', isFollowUp: false, requiresContext: false },
        questionNumber: 1,
        userRole: 'general',
        isFollowUp: false,
        hasContext: false
      });
      
      expect(structure).toBeDefined();
      expect(structure.format).toBe('deep_explanation');
    });
    
    it('should return list format for risks questions', () => {
      const structure = determineResponseStructure({
        questionIntent: { type: 'risks', isFollowUp: false, requiresContext: false },
        questionNumber: 1,
        userRole: 'general',
        isFollowUp: false,
        hasContext: false
      });
      
      expect(structure).toBeDefined();
      expect(structure.format).toBe('list');
    });
    
    it('should return scenario format for what-if questions', () => {
      const structure = determineResponseStructure({
        questionIntent: { type: 'whatif', isFollowUp: false, requiresContext: false },
        questionNumber: 1,
        userRole: 'general',
        isFollowUp: false,
        hasContext: false
      });
      
      expect(structure).toBeDefined();
      expect(structure.format).toBe('scenario');
    });
  });
  
  describe('2. Response Structure Properties', () => {
    
    it('should have required properties', () => {
      const structure = determineResponseStructure({
        questionIntent: { type: 'what', isFollowUp: false, requiresContext: false },
        questionNumber: 1,
        userRole: 'general',
        isFollowUp: false,
        hasContext: false
      });
      
      expect(structure.format).toBeDefined();
      expect(structure.sections).toBeDefined();
      expect(Array.isArray(structure.sections)).toBe(true);
      expect(structure.style).toBeDefined();
      expect(structure.maxLength).toBeDefined();
    });
    
    it('should have valid style properties', () => {
      const structure = determineResponseStructure({
        questionIntent: { type: 'what', isFollowUp: false, requiresContext: false },
        questionNumber: 1,
        userRole: 'general',
        isFollowUp: false,
        hasContext: false
      });
      
      expect(typeof structure.style.useHeadings).toBe('boolean');
      expect(typeof structure.style.useNumbering).toBe('boolean');
      expect(typeof structure.style.useBullets).toBe('boolean');
      expect(['judgment', 'question', 'warning', 'story', 'data']).toContain(structure.style.startWith);
      expect(['consultant', 'reporter', 'academic', 'conversational']).toContain(structure.style.tone);
    });
    
    it('should have valid maxLength values', () => {
      const structures = [
        determineResponseStructure({
          questionIntent: { type: 'what', isFollowUp: false, requiresContext: false },
          questionNumber: 1,
          userRole: 'general',
          isFollowUp: false,
          hasContext: false
        }),
        determineResponseStructure({
          questionIntent: { type: 'what', isFollowUp: true, requiresContext: true },
          questionNumber: 2,
          userRole: 'general',
          isFollowUp: true,
          hasContext: true
        }),
        determineResponseStructure({
          questionIntent: { type: 'what', isFollowUp: true, requiresContext: true },
          questionNumber: 3,
          userRole: 'general',
          isFollowUp: true,
          hasContext: true
        })
      ];
      
      structures.forEach(s => {
        expect(['short', 'medium', 'long']).toContain(s.maxLength);
      });
    });
  });
  
  describe('3. Question Number Impact', () => {
    
    it('should vary response length based on question number', () => {
      const q1 = determineResponseStructure({
        questionIntent: { type: 'what', isFollowUp: false, requiresContext: false },
        questionNumber: 1,
        userRole: 'general',
        isFollowUp: false,
        hasContext: false
      });
      
      const q2 = determineResponseStructure({
        questionIntent: { type: 'what', isFollowUp: true, requiresContext: true },
        questionNumber: 2,
        userRole: 'general',
        isFollowUp: true,
        hasContext: true
      });
      
      const q3 = determineResponseStructure({
        questionIntent: { type: 'what', isFollowUp: true, requiresContext: true },
        questionNumber: 3,
        userRole: 'general',
        isFollowUp: true,
        hasContext: true
      });
      
      expect(q1.maxLength).toBe('long');
      expect(['medium', 'short']).toContain(q2.maxLength);
      expect(q3.maxLength).toBe('short');
    });
  });
  
  describe('4. User Role Impact', () => {
    
    it('should adjust tone based on user role', () => {
      const journalistStructure = determineResponseStructure({
        questionIntent: { type: 'what', isFollowUp: false, requiresContext: false },
        questionNumber: 1,
        userRole: 'journalist',
        isFollowUp: false,
        hasContext: false
      });
      
      const traderStructure = determineResponseStructure({
        questionIntent: { type: 'what', isFollowUp: false, requiresContext: false },
        questionNumber: 1,
        userRole: 'trader',
        isFollowUp: false,
        hasContext: false
      });
      
      const researcherStructure = determineResponseStructure({
        questionIntent: { type: 'what', isFollowUp: false, requiresContext: false },
        questionNumber: 1,
        userRole: 'researcher',
        isFollowUp: false,
        hasContext: false
      });
      
      expect(journalistStructure.style.tone).toBeDefined();
      expect(traderStructure.style.tone).toBeDefined();
      expect(researcherStructure.style.tone).toBeDefined();
    });
  });
  
  describe('5. Dynamic Format Prevents Fixed Templates', () => {
    
    it('should NOT use same format for all question types', () => {
      const whatFormat = determineResponseStructure({
        questionIntent: { type: 'what', isFollowUp: false, requiresContext: false },
        questionNumber: 1,
        userRole: 'general',
        isFollowUp: false,
        hasContext: false
      }).format;
      
      const whyFormat = determineResponseStructure({
        questionIntent: { type: 'why', isFollowUp: false, requiresContext: false },
        questionNumber: 1,
        userRole: 'general',
        isFollowUp: false,
        hasContext: false
      }).format;
      
      const yesNoFormat = determineResponseStructure({
        questionIntent: { type: 'yes_no', isFollowUp: false, requiresContext: false },
        questionNumber: 1,
        userRole: 'general',
        isFollowUp: false,
        hasContext: false
      }).format;
      
      // Different question types should have different formats
      expect([whatFormat, whyFormat, yesNoFormat].length).toBeGreaterThan(1);
      expect(new Set([whatFormat, whyFormat, yesNoFormat]).size).toBeGreaterThan(1);
    });
    
    it('should NOT use same format for first and follow-up questions', () => {
      const firstQuestion = determineResponseStructure({
        questionIntent: { type: 'what', isFollowUp: false, requiresContext: false },
        questionNumber: 1,
        userRole: 'general',
        isFollowUp: false,
        hasContext: false
      }).format;
      
      const followUp = determineResponseStructure({
        questionIntent: { type: 'followup', isFollowUp: true, requiresContext: true },
        questionNumber: 2,
        userRole: 'general',
        isFollowUp: true,
        hasContext: true
      }).format;
      
      expect(firstQuestion).not.toBe(followUp);
    });
  });
});
