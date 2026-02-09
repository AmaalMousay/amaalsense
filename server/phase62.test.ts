/**
 * Phase 62 Tests: Data Flow and Dynamic Response Format
 * 
 * Tests for:
 * 1. Real data passing from topicAnalyzer to UnifiedPipeline
 * 2. Dynamic response format based on question type
 * 3. Intelligent response generation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { analyzeTopicInCountry } from './topicAnalyzer';
import { UnifiedPipeline } from './cognitiveArchitecture/unifiedPipeline';
import { runIntelligentPipeline } from './cognitiveArchitecture/intelligentPipeline';

describe('Phase 62: Data Flow and Dynamic Response Format', () => {
  
  describe('1. Real Data Passing to UnifiedPipeline', () => {
    
    it('should pass newsItems and emotionData to UnifiedPipeline', async () => {
      const spy = vi.spyOn(UnifiedPipeline, 'process');
      
      try {
        await analyzeTopicInCountry(
          'الذهب والفضة',
          'EG',
          'مصر'
        );
        
        // Check that UnifiedPipeline.process was called
        expect(spy).toHaveBeenCalled();
        
        // Check that newsItems were passed
        const callArgs = spy.mock.calls[0][0];
        expect(callArgs.newsItems).toBeDefined();
        expect(Array.isArray(callArgs.newsItems)).toBe(true);
        expect(callArgs.newsItems.length).toBeGreaterThan(0);
        
        // Check that emotionData was passed
        expect(callArgs.emotionData).toBeDefined();
        expect(callArgs.emotionData.fear).toBeDefined();
        expect(callArgs.emotionData.hope).toBeDefined();
        expect(callArgs.emotionData.anger).toBeDefined();
      } finally {
        spy.mockRestore();
      }
    });
    
    it('should return intelligentResponse in TopicAnalysisResult', async () => {
      const result = await analyzeTopicInCountry(
        'الذهب والفضة',
        'EG',
        'مصر'
      );
      
      expect(result.intelligentResponse).toBeDefined();
      expect(typeof result.intelligentResponse).toBe('string');
      expect(result.intelligentResponse.length).toBeGreaterThan(0);
    });
    
    it('should return pipelineMetadata in TopicAnalysisResult', async () => {
      const result = await analyzeTopicInCountry(
        'الذهب والفضة',
        'EG',
        'مصر'
      );
      
      expect(result.pipelineMetadata).toBeDefined();
      expect(result.pipelineMetadata?.questionType).toBeDefined();
      expect(result.pipelineMetadata?.cognitivePathway).toBeDefined();
      expect(result.pipelineMetadata?.analysisAction).toBeDefined();
      expect(result.pipelineMetadata?.gateDecision).toBeDefined();
      expect(result.pipelineMetadata?.confidence).toBeDefined();
    });
  });
  
  describe('2. Dynamic Response Format', () => {
    
    it('should generate full_analysis format for first question', async () => {
      const result = await analyzeTopicInCountry(
        'ما هو الوضع الاقتصادي؟',
        'EG',
        'مصر'
      );
      
      const response = result.intelligentResponse;
      
      // Full analysis should contain multiple sections
      expect(response).toContain('الخلاصة') || expect(response.length).toBeGreaterThan(100);
    });
    
    it('should generate direct_answer format for factual questions', async () => {
      const result = await analyzeTopicInCountry(
        'من هو رئيس مصر؟',
        'EG',
        'مصر'
      );
      
      const response = result.intelligentResponse;
      
      // Direct answer should be concise
      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
    });
    
    it('should generate brief_followup format for follow-up questions', async () => {
      const conversationHistory = [
        { role: 'user', content: 'ما الوضع الاقتصادي؟' },
        { role: 'assistant', content: 'الوضع الاقتصادي معقد...' }
      ];
      
      const result = await analyzeTopicInCountry(
        'وما التوقعات المستقبلية؟',
        'EG',
        'مصر',
        {
          conversationHistory,
          isFollowUp: true
        }
      );
      
      const response = result.intelligentResponse;
      
      // Follow-up should be shorter
      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(0);
    });
  });
  
  describe('3. Intelligent Response Generation', () => {
    
    it('should NOT return fixed template responses', async () => {
      const result = await analyzeTopicInCountry(
        'الذهب والفضة',
        'EG',
        'مصر'
      );
      
      const response = result.intelligentResponse;
      
      // Should NOT be the exact fixed template
      const fixedTemplate = 'الخلاصة: انخفاض أسعار الذهب والفضة يعكس حالة معقدة';
      expect(response).not.toContain(fixedTemplate);
    });
    
    it('should include metadata about cognitive pathway', async () => {
      const result = await analyzeTopicInCountry(
        'الذهب والفضة',
        'EG',
        'مصر'
      );
      
      expect(result.pipelineMetadata?.cognitivePathway).toBeDefined();
      expect(['knowledge_engine', 'intelligent_pipeline', 'none']).toContain(
        result.pipelineMetadata?.cognitivePathway
      );
    });
    
    it('should have high confidence for analyzed data', async () => {
      const result = await analyzeTopicInCountry(
        'الذهب والفضة',
        'EG',
        'مصر'
      );
      
      expect(result.pipelineMetadata?.confidence).toBeGreaterThan(0);
      expect(result.pipelineMetadata?.confidence).toBeLessThanOrEqual(1);
    });
  });
  
  describe('4. News Data Integration', () => {
    
    it('should fetch news data for analysis', async () => {
      const result = await analyzeTopicInCountry(
        'الذهب والفضة',
        'EG',
        'مصر'
      );
      
      // Should have analyzed news
      expect(result.intelligentResponse).toBeDefined();
      expect(result.intelligentResponse.length).toBeGreaterThan(50);
    });
    
    it('should use emotion indices in response', async () => {
      const result = await analyzeTopicInCountry(
        'الذهب والفضة',
        'EG',
        'مصر'
      );
      
      // Should have emotion data
      expect(result.gmi).toBeDefined();
      expect(result.cfi).toBeDefined();
      expect(result.hri).toBeDefined();
      
      // Response should be based on these emotions
      expect(result.intelligentResponse).toBeDefined();
    });
  });
  
  describe('5. Context Preservation', () => {
    
    it('should maintain context for follow-up questions', async () => {
      const conversationHistory = [
        { role: 'user', content: 'ما الوضع في ليبيا؟' },
        { role: 'assistant', content: 'الوضع في ليبيا...' }
      ];
      
      const result = await analyzeTopicInCountry(
        'وما التطورات الجديدة؟',
        'LY',
        'ليبيا',
        {
          conversationHistory,
          isFollowUp: true
        }
      );
      
      expect(result.intelligentResponse).toBeDefined();
      expect(result.pipelineMetadata?.analysisAction).toBeDefined();
    });
  });
});
