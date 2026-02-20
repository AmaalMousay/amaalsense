/**
 * COMPREHENSIVE FEATURE TEST
 * 
 * اختبار شامل للتحقق من أن جميع الميزات تعمل بشكل فعلي
 */

import { describe, it, expect } from "vitest";
import { executeUnifiedNetworkPipeline } from "./unifiedNetworkPipeline";
import { executePipelineWithStorage, formatPipelineResponse } from "./pipelineIntegration";
import { storeFeedback, analyzeError, calculateLearningMetrics, processFeedback } from "./learningLoop";
import { getCommonErrors, getImprovementRecommendations } from "./learningLoop";

describe("Comprehensive Feature Testing", () => {
  describe("Unified Pipeline Integration", () => {
    it("should execute unified pipeline successfully", async () => {
      const result = await executeUnifiedNetworkPipeline(
        "test-user",
        "ما هي المشاعر الجماعية الآن؟",
        "ar"
      );

      expect(result).toBeDefined();
      expect(result.status).toBe("completed");
      expect(result.requestId).toBeDefined();
      expect(result.layer1).toBeDefined();
      expect(result.confidence).toBeDefined();
      expect(result.languageEnforced).toBeDefined();
      expect(result.analytics.layersExecuted.length).toBeGreaterThan(0);
    });

    it("should format pipeline response correctly", async () => {
      const context = await executeUnifiedNetworkPipeline(
        "test-user",
        "ما هي المشاعر الجماعية الآن؟",
        "ar"
      );

      const formatted = formatPipelineResponse(context);
      expect(formatted).toBeDefined();
      expect(formatted.response).toBeDefined();
      expect(formatted.confidence).toBeDefined();
      expect(formatted.quality).toBeDefined();
      expect(formatted.emotionalIntelligence).toBeDefined();
    });

    it("should execute pipeline with storage", async () => {
      const result = await executePipelineWithStorage(
        "test-user",
        "ما هي المشاعر الجماعية الآن؟",
        "ar"
      );

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.context).toBeDefined();
      expect(result.responseId).toBeDefined();
    });
  });

  describe("Learning Loop System", () => {
    it("should process feedback successfully", async () => {
      const feedback = {
        questionId: "q1",
        userId: 1,
        originalAnswer: "Test answer",
        userFeedback: "Good response",
        isCorrect: true,
        confidence: 0.9,
        timestamp: new Date(),
      };

      const result = await processFeedback(feedback);
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.feedbackId).toBeDefined();
    });

    it("should calculate learning metrics", async () => {
      const metrics = await calculateLearningMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.totalQuestions).toBeGreaterThan(0);
      expect(metrics.accuracy).toBeGreaterThanOrEqual(0);
      expect(metrics.topicAccuracy).toBeDefined();
    });

    it("should identify common errors", () => {
      const errors = getCommonErrors();
      expect(Array.isArray(errors)).toBe(true);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toHaveProperty("errorType");
      expect(errors[0]).toHaveProperty("frequency");
      expect(errors[0]).toHaveProperty("impact");
    });

    it("should provide improvement recommendations", () => {
      const recommendations = getImprovementRecommendations();
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0]).toHaveProperty("recommendation");
      expect(recommendations[0]).toHaveProperty("priority");
      expect(recommendations[0]).toHaveProperty("estimatedImpact");
    });
  });

  describe("Language Support", () => {
    it("should handle Arabic language", async () => {
      const result = await executeUnifiedNetworkPipeline(
        "test-user",
        "ما هي المشاعر الجماعية الآن؟",
        "ar"
      );

      expect(result.languageEnforced.language).toBe("ar");
      expect(result.languageEnforced.finalResponse).toBeDefined();
    });

    it("should handle English language", async () => {
      const result = await executeUnifiedNetworkPipeline(
        "test-user",
        "What are the collective emotions now?",
        "en"
      );

      expect(result.languageEnforced.language).toBe("en");
      expect(result.languageEnforced.finalResponse).toBeDefined();
    });
  });

  describe("Quality Assessment", () => {
    it("should assess response quality", async () => {
      const result = await executeUnifiedNetworkPipeline(
        "test-user",
        "ما هي المشاعر الجماعية الآن؟",
        "ar"
      );

      expect(result.qualityAssessment).toBeDefined();
      expect(result.qualityAssessment.score).toBeGreaterThan(0);
      expect(result.qualityAssessment.metrics).toBeDefined();
      expect(result.qualityAssessment.metrics.relevance).toBeGreaterThanOrEqual(0);
      expect(result.qualityAssessment.metrics.accuracy).toBeGreaterThanOrEqual(0);
      expect(result.qualityAssessment.metrics.completeness).toBeGreaterThanOrEqual(0);
      expect(result.qualityAssessment.metrics.clarity).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Confidence Scoring", () => {
    it("should calculate confidence scores", async () => {
      const result = await executeUnifiedNetworkPipeline(
        "test-user",
        "ما هي المشاعر الجماعية الآن؟",
        "ar"
      );

      expect(result.confidence).toBeDefined();
      expect(result.confidence.overall).toBeGreaterThanOrEqual(0);
      expect(result.confidence.overall).toBeLessThanOrEqual(100);
      expect(result.confidence.level).toBeDefined();
      expect(result.confidence.factors).toBeDefined();
    });
  });

  describe("Caching System", () => {
    it("should implement caching", async () => {
      const result = await executeUnifiedNetworkPipeline(
        "test-user",
        "ما هي المشاعر الجماعية الآن؟",
        "ar"
      );

      expect(result.caching).toBeDefined();
      expect(result.caching.cached).toBeDefined();
      expect(result.caching.cacheKey).toBeDefined();
      expect(result.caching.cacheHit).toBeDefined();
    });
  });

  describe("Analytics & Monitoring", () => {
    it("should track processing time", async () => {
      const result = await executeUnifiedNetworkPipeline(
        "test-user",
        "ما هي المشاعر الجماعية الآن؟",
        "ar"
      );

      expect(result.analytics).toBeDefined();
      expect(result.analytics.processingTime).toBeGreaterThan(0);
      expect(result.analytics.layersExecuted).toBeDefined();
      expect(result.analytics.layersExecuted.length).toBeGreaterThan(0);
    });

    it("should track errors", async () => {
      const result = await executeUnifiedNetworkPipeline(
        "test-user",
        "ما هي المشاعر الجماعية الآن؟",
        "ar"
      );

      expect(result.analytics).toBeDefined();
      expect(Array.isArray(result.analytics.errors)).toBe(true);
    });
  });

  describe("End-to-End Integration", () => {
    it("should complete full user journey", async () => {
      // Step 1: Execute analysis
      const analysisResult = await executePipelineWithStorage(
        "test-user",
        "ما هي المشاعر الجماعية الآن؟",
        "ar"
      );

      expect(analysisResult.success).toBe(true);

      // Step 2: Process feedback
      const feedback = {
        questionId: analysisResult.responseId,
        userId: 1,
        originalAnswer: analysisResult.context.languageEnforced.finalResponse,
        userFeedback: "Good response",
        isCorrect: true,
        confidence: 0.9,
        timestamp: new Date(),
      };

      const feedbackResult = await processFeedback(feedback);
      expect(feedbackResult.success).toBe(true);

      // Step 3: Get learning metrics
      const metrics = await calculateLearningMetrics();
      expect(metrics.totalQuestions).toBeGreaterThan(0);

      // Step 4: Get recommendations
      const recommendations = getImprovementRecommendations();
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });
});
