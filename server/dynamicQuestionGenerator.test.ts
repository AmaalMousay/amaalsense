import { describe, it, expect } from 'vitest';
import { DynamicQuestionGenerator } from '../client/src/services/dynamicQuestionGenerator';
// Note: This test imports from client/src/services because DynamicQuestionGenerator is a client-side utility

describe('DynamicQuestionGenerator', () => {
  describe('generateQuestions', () => {
    it('should generate questions based on high fear emotion', () => {
      const analysis = {
        intelligentResponse: 'This is a comprehensive analysis about a concerning topic.',
        emotionData: {
          dominantEmotion: 'fear',
          emotions: {
            fear: 75,
            hope: 30,
            anger: 20,
            sadness: 40,
            joy: 10,
            curiosity: 50,
          },
        },
        pipelineMetadata: {
          confidence: 85,
        },
      };

      const questions = DynamicQuestionGenerator.generateQuestions(analysis);
      
      expect(questions.length).toBeGreaterThan(0);
      expect(questions.length).toBeLessThanOrEqual(6);
      
      // Should include impact question for high fear
      const impactQuestion = questions.find(q => q.category === 'impact');
      expect(impactQuestion).toBeDefined();
      expect(impactQuestion?.text).toContain('تداعيات');
    });

    it('should generate questions based on high hope emotion', () => {
      const analysis = {
        intelligentResponse: 'This is a positive analysis with opportunities.',
        emotionData: {
          dominantEmotion: 'hope',
          emotions: {
            fear: 20,
            hope: 80,
            anger: 10,
            sadness: 5,
            joy: 70,
            curiosity: 60,
          },
        },
        pipelineMetadata: {
          confidence: 90,
        },
      };

      const questions = DynamicQuestionGenerator.generateQuestions(analysis);
      
      expect(questions.length).toBeGreaterThan(0);
      
      // Should include opportunity-focused questions
      const opportunityQuestion = questions.find(q => q.text.includes('فرص'));
      expect(opportunityQuestion).toBeDefined();
    });

    it('should generate questions based on low confidence', () => {
      const analysis = {
        intelligentResponse: 'This analysis has some uncertainty.',
        emotionData: {
          dominantEmotion: 'curiosity',
          emotions: {
            fear: 40,
            hope: 40,
            anger: 20,
            sadness: 30,
            joy: 20,
            curiosity: 70,
          },
        },
        pipelineMetadata: {
          confidence: 55,
        },
      };

      const questions = DynamicQuestionGenerator.generateQuestions(analysis);
      
      // Should include risk assessment question for low confidence
      const riskQuestion = questions.find(q => q.category === 'risks');
      expect(riskQuestion).toBeDefined();
    });

    it('should generate context-specific questions based on response content', () => {
      const analysis = {
        intelligentResponse: 'المصالحة والتوافق بين الأطراف هي المفتاح لحل هذا النزاع. يجب تعزيز الحوار والعدالة الانتقالية.',
        emotionData: {
          dominantEmotion: 'hope',
          emotions: {
            fear: 30,
            hope: 70,
            anger: 20,
            sadness: 20,
            joy: 50,
            curiosity: 60,
          },
        },
        pipelineMetadata: {
          confidence: 80,
        },
      };

      const questions = DynamicQuestionGenerator.generateQuestions(analysis);
      
      // Should include reconciliation-focused question
      const reconciliationQuestion = questions.find(q => q.text.includes('حوار'));
      expect(reconciliationQuestion).toBeDefined();
    });

    it('should sort questions by relevance', () => {
      const analysis = {
        intelligentResponse: 'A long comprehensive analysis about a complex topic with multiple dimensions and implications.',
        emotionData: {
          dominantEmotion: 'fear',
          emotions: {
            fear: 70,
            hope: 50,
            anger: 45,
            sadness: 40,
            joy: 30,
            curiosity: 65,
          },
        },
        pipelineMetadata: {
          confidence: 75,
        },
      };

      const questions = DynamicQuestionGenerator.generateQuestions(analysis);
      
      // Questions should be sorted by relevance (descending)
      for (let i = 0; i < questions.length - 1; i++) {
        expect(questions[i].relevance).toBeGreaterThanOrEqual(questions[i + 1].relevance);
      }
    });

    it('should limit questions to maximum 6', () => {
      const analysis = {
        intelligentResponse: 'A very long comprehensive analysis with many dimensions.',
        emotionData: {
          dominantEmotion: 'fear',
          emotions: {
            fear: 80,
            hope: 60,
            anger: 50,
            sadness: 50,
            joy: 40,
            curiosity: 70,
          },
        },
        pipelineMetadata: {
          confidence: 60,
        },
      };

      const questions = DynamicQuestionGenerator.generateQuestions(analysis);
      
      expect(questions.length).toBeLessThanOrEqual(6);
    });
  });

  describe('generateContextualQuestion', () => {
    it('should generate fear-based question', () => {
      const question = DynamicQuestionGenerator.generateContextualQuestion('fear', 'security crisis', 'What will happen next?');
      
      expect(question.text).toContain('إجراءات');
      expect(question.category).toBe('solutions');
      expect(question.relevance).toBe(85);
    });

    it('should generate hope-based question', () => {
      const question = DynamicQuestionGenerator.generateContextualQuestion('hope', 'economic recovery', 'What are the prospects?');
      
      expect(question.text).toContain('أمل');
      expect(question.category).toBe('recommendations');
    });

    it('should generate anger-based question', () => {
      const question = DynamicQuestionGenerator.generateContextualQuestion('anger', 'injustice', 'What should be done?');
      
      expect(question.text).toContain('بناء');
      expect(question.category).toBe('solutions');
    });
  });

  describe('generateScenarioQuestions', () => {
    it('should generate multiple scenario questions', () => {
      const scenarios = DynamicQuestionGenerator.generateScenarioQuestions('political crisis', 'unstable');
      
      expect(scenarios.length).toBe(3);
      expect(scenarios.every(q => q.category === 'scenarios')).toBe(true);
      expect(scenarios.every(q => q.text.startsWith('ماذا لو'))).toBe(true);
    });

    it('should have different scenario questions', () => {
      const scenarios = DynamicQuestionGenerator.generateScenarioQuestions('economic downturn', 'declining');
      
      const texts = scenarios.map(q => q.text);
      const uniqueTexts = new Set(texts);
      
      expect(uniqueTexts.size).toBe(3);
    });
  });

  describe('question properties', () => {
    it('should have valid category for each question', () => {
      const validCategories = ['impact', 'future', 'solutions', 'risks', 'recommendations', 'scenarios', 'clarification'];
      
      const analysis = {
        intelligentResponse: 'Test analysis',
        emotionData: {
          dominantEmotion: 'fear',
          emotions: {
            fear: 70,
            hope: 50,
            anger: 40,
            sadness: 30,
            joy: 20,
            curiosity: 60,
          },
        },
        pipelineMetadata: {
          confidence: 80,
        },
      };

      const questions = DynamicQuestionGenerator.generateQuestions(analysis);
      
      questions.forEach(q => {
        expect(validCategories).toContain(q.category);
      });
    });

    it('should have relevance between 0 and 100', () => {
      const analysis = {
        intelligentResponse: 'Test analysis',
        emotionData: {
          dominantEmotion: 'hope',
          emotions: {
            fear: 30,
            hope: 80,
            anger: 10,
            sadness: 10,
            joy: 70,
            curiosity: 60,
          },
        },
        pipelineMetadata: {
          confidence: 90,
        },
      };

      const questions = DynamicQuestionGenerator.generateQuestions(analysis);
      
      questions.forEach(q => {
        expect(q.relevance).toBeGreaterThanOrEqual(0);
        expect(q.relevance).toBeLessThanOrEqual(100);
      });
    });

    it('should have non-empty text and reasoning', () => {
      const analysis = {
        intelligentResponse: 'Test analysis',
        emotionData: {
          dominantEmotion: 'curiosity',
          emotions: {
            fear: 40,
            hope: 50,
            anger: 20,
            sadness: 30,
            joy: 40,
            curiosity: 80,
          },
        },
        pipelineMetadata: {
          confidence: 85,
        },
      };

      const questions = DynamicQuestionGenerator.generateQuestions(analysis);
      
      questions.forEach(q => {
        expect(q.text.length).toBeGreaterThan(0);
        expect(q.reasoning.length).toBeGreaterThan(0);
      });
    });
  });
});
