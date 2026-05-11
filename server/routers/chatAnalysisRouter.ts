import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const chatAnalysisRouter = router({
  analyzeMessage: publicProcedure
    .input(z.object({
      conversationId: z.number(),
      message: z.string().min(1).max(2000),
      countryCode: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { analyzeTextWithAI } = await import('./aiSentimentAnalyzer');
      const { dcftEngine } = await import('./dcft');
      
      const aiResult = await analyzeTextWithAI(input.message);
      const dcftResult = await dcftEngine.analyzeTexts([input.message], 'chat');
      
      return {
        topic: 'General Analysis',
        topicRelevance: 85,
        analysis: aiResult.text || 'Analysis complete',
        emotions: aiResult.emotions || {},
        dominantEmotion: aiResult.dominantEmotion || 'neutral',
        confidence: Math.round(aiResult.confidence || 50),
        indices: {
          GMI: Math.round(dcftResult.indices?.gmi || 50),
          CFI: Math.round(dcftResult.indices?.cfi || 50),
          HRI: Math.round(dcftResult.indices?.hri || 50),
        },
        followUpQuestions: [
          'What are the specific recommendations?',
          'What are the key risks?',
          'Can you predict the trend?',
          'What are alternative scenarios?',
        ],
      };
    }),
});
