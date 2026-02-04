import { describe, it, expect } from 'vitest';
import {
  analyzePerception,
  determineResponseDirective,
  type PerceptionContext,
} from './perceptionLayer';

describe('Perception Layer', () => {
  describe('analyzePerception', () => {
    it('should extract topic from question', () => {
      const perception = analyzePerception(
        'ما الوضع في ليبيا',
        '',
        { emotions: { fear: 50, hope: 30 }, gmi: -20 }
      );
      
      expect(perception.topic).toBeDefined();
      expect(perception.topic.toLowerCase()).toContain('ليبيا');
    });
    
    it('should identify primary emotion', () => {
      const perception = analyzePerception(
        'ما الوضع',
        '',
        { emotions: { fear: 80, hope: 20, anger: 10 }, gmi: -50 }
      );
      
      expect(perception.primaryEmotion).toBe('fear');
    });
    
    it('should identify secondary emotions', () => {
      const perception = analyzePerception(
        'ما الوضع',
        '',
        { emotions: { fear: 80, hope: 60, anger: 40 }, gmi: 0 }
      );
      
      expect(perception.secondaryEmotions).toContain('hope');
      expect(perception.secondaryEmotions).toContain('anger');
    });
    
    it('should determine urgency based on emotion', () => {
      const criticalPerception = analyzePerception(
        'ما الوضع',
        '',
        { emotions: { fear: 90 }, gmi: -80 }
      );
      
      expect(criticalPerception.urgency).toBe('critical');
    });
    
    it('should determine awareness level based on confidence', () => {
      const deepPerception = analyzePerception(
        'ما الوضع',
        '',
        { emotions: { fear: 50 }, gmi: 0, confidence: 90 }
      );
      
      expect(deepPerception.awarenessLevel).toBe('deep');
    });
  });
  
  describe('determineResponseDirective', () => {
    const mockPerception: PerceptionContext = {
      topic: 'الوضع في ليبيا',
      primaryEmotion: 'fear',
      secondaryEmotions: ['anger'],
      urgency: 'critical',
      affectedGroups: ['الشباب', 'الأسر'],
      rootCause: 'تدهور الظروف المعيشية',
      collectiveConsciousness: 'وعي جمعي متشائم',
      awarenessLevel: 'deep',
    };
    
    it('should focus on solution for "how" questions', () => {
      const directive = determineResponseDirective(
        mockPerception,
        'كيف يمكن حل هذه المشكلة',
        false
      );
      
      expect(directive.focus).toBe('solution');
    });
    
    it('should focus on warning for critical urgency', () => {
      const directive = determineResponseDirective(
        mockPerception,
        'ما الوضع',
        false
      );
      
      expect(directive.focus).toBe('warning');
    });
    
    it('should use brief depth for follow-up questions', () => {
      const directive = determineResponseDirective(
        mockPerception,
        'وما التوقعات',
        true
      );
      
      expect(directive.depth).toBe('brief');
    });
    
    it('should use urgent tone for critical urgency', () => {
      const directive = determineResponseDirective(
        mockPerception,
        'ما الوضع',
        false
      );
      
      // Critical urgency takes priority over emotion
      expect(directive.tone).toBe('urgent');
    });
    
    it('should avoid templates', () => {
      const directive = determineResponseDirective(
        mockPerception,
        'ما الوضع',
        false
      );
      
      expect(directive.shouldAvoidTemplate).toBe(true);
    });
    
    it('should validate context for topic changes', () => {
      const directive = determineResponseDirective(
        mockPerception,
        'ما الوضع في مصر',
        false
      );
      
      expect(directive.contextValidation.length).toBeGreaterThan(0);
    });
  });
});
