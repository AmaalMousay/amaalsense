/**
 * Unified Consciousness Router
 * 
 * tRPC router للمحرك الموحد
 * يوفر endpoint واحد موحد لكل الاستخدامات
 */

import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  unifiedAnalyze, 
  formatUnifiedResult, 
  isResultReady, 
  getErrorMessage,
  UnifiedAnalysisResult 
} from "./unifiedConsciousnessEngine";

export const unifiedConsciousnessRouter = router({
  /**
   * Unified Analyze
   * 
   * محرك موحد واحد يفهم السؤال ويختار الطريقة الأفضل
   * 
   * المميزات:
   * 1. طبقة فهم السؤال - تحدد ما إذا كان يحتاج تحليل
   * 2. إجابات مباشرة - بدون تحليل غير ضروري
   * 3. تحليل موحد - DCFT + Graph + Groq
   * 4. أداء محسّن - فقط ما هو ضروري
   */
  analyze: publicProcedure
    .input(z.object({
      question: z.string().min(1).max(5000),
      topic: z.string().optional(),
      country: z.string().optional(),
      previousMessages: z.array(z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // تشغيل المحرك الموحد
        const result = await unifiedAnalyze(input.question, {
          topic: input.topic,
          country: input.country,
          previousMessages: input.previousMessages,
        });
        
        // التحقق من النتيجة
        if (!isResultReady(result)) {
          const errorMsg = getErrorMessage(result, result.metadata.language);
          return {
            success: false,
            error: errorMsg || 'Unable to process question',
            questionUnderstanding: result.questionUnderstanding,
            performance: result.performance,
          };
        }
        
        // تنسيق النتيجة للعرض
        const formatted = formatUnifiedResult(result);
        
        return {
          success: true,
          answer: formatted.answer,
          details: formatted.details,
          performance: formatted.performance,
          
          // البيانات الكاملة (للتطوير والتصحيح)
          fullResult: {
            questionUnderstanding: result.questionUnderstanding,
            analysis: result.analysis,
            metadata: result.metadata,
          },
        };
      } catch (error) {
        console.error('[UnifiedConsciousnessRouter] Error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    }),

  /**
   * Health Check
   * 
   * التحقق من صحة المحرك الموحد
   */
  health: publicProcedure.query(async () => {
    return {
      status: 'healthy',
      engine: 'unified_consciousness',
      components: {
        questionUnderstanding: 'active',
        hybridDCFT: 'active',
        graphPipeline: 'active',
        groq: 'active',
      },
      timestamp: new Date().toISOString(),
    };
  }),

  /**
   * Batch Analyze
   * 
   * تحليل دفعة من الأسئلة
   */
  batchAnalyze: publicProcedure
    .input(z.object({
      questions: z.array(z.string().min(1).max(5000)).min(1).max(10),
      topic: z.string().optional(),
      country: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const results = await Promise.all(
          input.questions.map(async (question) => {
            const result = await unifiedAnalyze(question, {
              topic: input.topic,
              country: input.country,
            });
            
            if (isResultReady(result)) {
              const formatted = formatUnifiedResult(result);
              return {
                question: question.substring(0, 100),
                success: true,
                answer: formatted.answer,
                details: formatted.details,
              };
            } else {
              return {
                question: question.substring(0, 100),
                success: false,
                error: getErrorMessage(result, result.metadata.language),
              };
            }
          })
        );
        
        const successCount = results.filter(r => r.success).length;
        
        return {
          success: true,
          totalQuestions: input.questions.length,
          successCount,
          failureCount: input.questions.length - successCount,
          results,
        };
      } catch (error) {
        console.error('[UnifiedConsciousnessRouter] Batch Error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    }),

  /**
   * Analyze with Streaming (للمستقبل)
   * 
   * تحليل مع streaming للإجابات الطويلة
   */
  analyzeStreaming: publicProcedure
    .input(z.object({
      question: z.string().min(1).max(5000),
      topic: z.string().optional(),
      country: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await unifiedAnalyze(input.question, {
          topic: input.topic,
          country: input.country,
        });
        
        if (!isResultReady(result)) {
          const errorMsg = getErrorMessage(result, result.metadata.language);
          return {
            success: false,
            error: errorMsg || 'Unable to process question',
          };
        }
        
        const formatted = formatUnifiedResult(result);
        
        return {
          success: true,
          answer: formatted.answer,
          details: formatted.details,
          performance: formatted.performance,
          streamReady: true, // للمستقبل
        };
      } catch (error) {
        console.error('[UnifiedConsciousnessRouter] Streaming Error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    }),

  /**
   * Get Question Understanding Only
   * 
   * الحصول على فهم السؤال فقط (بدون تحليل)
   * مفيد للتطوير والاختبار
   */
  understandQuestion: publicProcedure
    .input(z.object({
      question: z.string().min(1).max(5000),
    }))
    .query(async ({ input }) => {
      try {
        const { understandQuestion } = await import('./questionUnderstandingLayer');
        const understanding = await understandQuestion(input.question);
        
        return {
          success: true,
          understanding,
        };
      } catch (error) {
        console.error('[UnifiedConsciousnessRouter] Understanding Error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    }),

  /**
   * Get Analysis Only
   * 
   * الحصول على التحليل فقط (بدون فهم السؤال)
   * مفيد عندما تعرف أن السؤال يحتاج تحليل
   */
  analyzeOnly: publicProcedure
    .input(z.object({
      question: z.string().min(1).max(5000),
      topic: z.string().optional(),
      country: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { analyzeHybrid } = await import('./hybridAnalyzer');
        const { graphPipeline, reasoningEngine } = await import('./graphPipeline');
        
        // تشغيل DCFT
        const hybridResult = await analyzeHybrid(input.question, 'user', {
          topic: input.topic,
          country: input.country,
        });
        
        // تشغيل Graph Pipeline
        const eventVector = await graphPipeline(input.question);
        
        // تشغيل Groq
        const reasoning = await reasoningEngine(eventVector, input.question);
        
        return {
          success: true,
          analysis: {
            emotions: hybridResult.emotions,
            indices: hybridResult.indices,
            eventVector,
            reasoning,
          },
        };
      } catch (error) {
        console.error('[UnifiedConsciousnessRouter] Analysis Only Error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    }),
});
