/**
 * Dynamic Template Builder Tests
 */

import { describe, it, expect } from 'vitest';
import {
  detectUserLevel,
  determineConversationDepth,
  determineEmotionalState,
  buildTemplateStyle,
  generateDynamicIntro,
  generateDynamicClosing,
  buildTemplateContext
} from './dynamicTemplate';

describe('Dynamic Template Builder', () => {
  describe('detectUserLevel', () => {
    it('should detect beginner for first-time user', () => {
      const level = detectUserLevel(1, ['ما هو الوضع الاقتصادي؟'], []);
      expect(level).toBe('beginner');
    });

    it('should detect intermediate for returning user', () => {
      const level = detectUserLevel(3, ['ما هو الوضع؟', 'وماذا عن السياسة؟'], ['اقتصاد']);
      expect(level).toBe('intermediate');
    });

    it('should detect advanced for user using technical terms', () => {
      const level = detectUserLevel(5, [
        'ما هو GMI الحالي؟',
        'كيف يؤثر CFI على التحليل؟',
        'أريد تحليل السيناريو'
      ], ['اقتصاد', 'سياسة']);
      expect(level).toBe('advanced');
    });
  });

  describe('determineConversationDepth', () => {
    it('should return first_turn for new conversation', () => {
      const depth = determineConversationDepth(1, [], 'اقتصاد');
      expect(depth).toBe('first_turn');
    });

    it('should return follow_up for continuing conversation', () => {
      const depth = determineConversationDepth(3, ['اقتصاد', 'سياسة'], 'أمن');
      expect(depth).toBe('follow_up');
    });

    it('should return deep_conversation for extended same-topic discussion', () => {
      const depth = determineConversationDepth(6, ['اقتصاد ليبيا', 'الاقتصاد'], 'اقتصاد');
      expect(depth).toBe('deep_conversation');
    });
  });

  describe('determineEmotionalState', () => {
    it('should return calm for low fear', () => {
      const state = determineEmotionalState(30, 10);
      expect(state).toBe('calm');
    });

    it('should return anxious for high fear', () => {
      const state = determineEmotionalState(75, -10);
      expect(state).toBe('anxious');
    });

    it('should return urgent when urgent words detected', () => {
      const state = determineEmotionalState(50, 0, 'أحتاج تحليل عاجل الآن');
      expect(state).toBe('urgent');
    });

    it('should return curious for neutral conditions', () => {
      const state = determineEmotionalState(50, 10);
      expect(state).toBe('curious');
    });
  });

  describe('buildTemplateStyle', () => {
    it('should build detailed style for beginner', () => {
      const context = buildTemplateContext(1, [], 'اقتصاد', [], 50, 0);
      const style = buildTemplateStyle(context);
      
      expect(style.detailLevel).toBe('comprehensive');
      expect(style.includeExplanation).toBe(true);
      expect(style.useTechnicalTerms).toBe(false);
    });

    it('should build technical style for advanced user', () => {
      const context = buildTemplateContext(
        10, 
        ['اقتصاد', 'سياسة'], 
        'GMI', 
        ['ما هو GMI؟', 'CFI analysis', 'سيناريو'], 
        50, 
        0
      );
      const style = buildTemplateStyle(context);
      
      // Advanced user gets technical terms, but follow_up depth sets medium length
      expect(style.useTechnicalTerms).toBe(true);
      expect(style.detailLevel).toBe('minimal');
    });

    it('should build reassuring style for anxious state', () => {
      const context = buildTemplateContext(2, [], 'أزمة', ['قلق على الوضع'], 75, -20);
      const style = buildTemplateStyle(context);
      
      expect(style.tone).toBe('reassuring');
    });

    it('should build direct style for urgent state', () => {
      const context = buildTemplateContext(1, [], 'أزمة', [], 50, 0, 'عاجل!');
      const style = buildTemplateStyle(context);
      
      expect(style.tone).toBe('direct');
      expect(style.responseLength).toBe('short');
    });
  });

  describe('generateDynamicIntro', () => {
    it('should return empty for first turn', () => {
      const context = buildTemplateContext(1, [], 'اقتصاد', [], 50, 0);
      const intro = generateDynamicIntro(context, 'اقتصاد');
      
      expect(intro).toBe('');
    });

    it('should return continuation intro for follow-up', () => {
      const context = buildTemplateContext(3, ['اقتصاد'], 'اقتصاد', [], 50, 0);
      const intro = generateDynamicIntro(context, 'اقتصاد');
      
      expect(intro).toContain('استكمالاً');
    });

    it('should return understanding intro for anxious deep conversation', () => {
      const context = buildTemplateContext(6, ['أزمة', 'أزمة'], 'أزمة', [], 75, -20);
      const intro = generateDynamicIntro(context, 'أزمة');
      
      expect(intro).toContain('أفهم');
    });
  });

  describe('generateDynamicClosing', () => {
    it('should ask about clarification for anxious user', () => {
      const context = buildTemplateContext(2, [], 'أزمة', [], 75, -20);
      const style = buildTemplateStyle(context);
      const closing = generateDynamicClosing(context, style);
      
      expect(closing).toContain('توضيح');
    });

    it('should ask about deeper analysis for advanced user', () => {
      const context = buildTemplateContext(
        10, 
        ['اقتصاد'], 
        'GMI', 
        ['GMI', 'CFI', 'تحليل'], 
        50, 
        0
      );
      const style = buildTemplateStyle(context);
      const closing = generateDynamicClosing(context, style);
      
      expect(closing).toContain('تحليل');
    });
  });
});
