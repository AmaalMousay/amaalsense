/**
 * UI & LEARNING LOOP INTEGRATION TESTS
 * 
 * اختبارات التكامل بين الواجهة الأمامية ونظام التعلم
 */

import { describe, it, expect } from "vitest";
import { handleUIRequest, handleClarificationRequest, handleFollowUpQuestion, handleRatingRequest } from "./uiIntegration";
import { processFeedback, getUserLearningData, getCommonErrors, getImprovementRecommendations } from "./learningLoop";

describe("UI and Learning Loop Integration", () => {
  describe("Chat Integration", () => {
    it("should handle chat requests successfully", async () => {
      const response = await handleUIRequest({
        question: "ما رأي الناس في هذا الموضوع؟",
        language: "ar",
        pageType: "chat"
      });

      expect(response.success).toBe(true);
      expect(response.response).toBeDefined();
      expect(response.confidence).toBeDefined();
      expect(response.metadata.requestId).toBeDefined();
    });

    it("should handle English questions", async () => {
      const response = await handleUIRequest({
        question: "What is the public opinion?",
        language: "en",
        pageType: "chat"
      });

      expect(response.success).toBe(true);
    });
  });

  describe("SmartAnalysis Integration", () => {
    it("should provide quality metrics", async () => {
      const response = await handleUIRequest({
        question: "ما رأي الناس في هذا الموضوع؟",
        pageType: "smartAnalysis"
      });

      expect(response.success).toBe(true);
      expect(response.quality.score).toBeGreaterThan(0);
      expect(response.quality.metrics.relevance).toBeGreaterThanOrEqual(0);
      expect(response.quality.metrics.accuracy).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Clarification Flow", () => {
    it("should handle clarifications", async () => {
      const response = await handleClarificationRequest(
        "ما رأي الناس في هذا الموضوع؟",
        "أقصد الموضوع الاقتصادي",
        "test-user",
        "ar"
      );

      expect(response.success).toBe(true);
      expect(response.response).toBeDefined();
    });
  });

  describe("Follow-up Questions", () => {
    it("should handle follow-ups", async () => {
      const response = await handleFollowUpQuestion(
        "ما رأي الناس في هذا الموضوع؟",
        "ما هي الأسباب؟",
        "test-user",
        "ar"
      );

      expect(response.success).toBe(true);
    });
  });

  describe("Rating and Learning", () => {
    it("should accept ratings", async () => {
      const result = await handleRatingRequest(
        "req_test_001",
        5,
        "ممتاز",
        "test-user"
      );

      expect(result.success).toBe(true);
    });

    it("should process feedback for learning", async () => {
      const mockContext = {
        requestId: "req_test_002",
        languageEnforced: {
          language: "ar",
          finalResponse: "إجابة اختبار"
        },
        qualityAssessment: {
          score: 85,
          metrics: {
            relevance: 90,
            accuracy: 85,
            completeness: 80,
            clarity: 85
          }
        }
      };

      const feedback = {
        requestId: "req_test_002",
        userId: "user_test_001",
        rating: 5,
        comment: "رائع",
        correctness: "correct" as const,
        relevance: "highly_relevant" as const,
        timestamp: new Date()
      };

      const learningData = await processFeedback(feedback, mockContext);
      expect(learningData).toBeDefined();
      expect(learningData.feedbackId).toBeDefined();
    });
  });

  describe("Learning Analytics", () => {
    it("should retrieve learning data", () => {
      const data = getUserLearningData("test-user");
      expect(Array.isArray(data)).toBe(true);
    });

    it("should identify common errors", () => {
      const errors = getCommonErrors();
      expect(Array.isArray(errors)).toBe(true);
    });

    it("should provide recommendations", () => {
      const recommendations = getImprovementRecommendations();
      expect(Array.isArray(recommendations)).toBe(true);
    });
  });

  describe("End-to-End Flow", () => {
    it("should complete full user journey", async () => {
      // 1. User asks question
      const response = await handleUIRequest({
        question: "ما رأي الناس في هذا الموضوع؟",
        pageType: "smartAnalysis",
        userId: "user_e2e_001"
      });

      expect(response.success).toBe(true);
      const requestId = response.metadata.requestId;

      // 2. User rates response
      const ratingResult = await handleRatingRequest(
        requestId,
        5,
        "ممتاز جداً",
        "user_e2e_001"
      );

      expect(ratingResult.success).toBe(true);

      // 3. System learns from feedback
      const mockContext = {
        requestId,
        languageEnforced: {
          language: "ar",
          finalResponse: response.response
        },
        qualityAssessment: {
          score: response.quality.score,
          metrics: response.quality.metrics
        }
      };

      const feedback = {
        requestId,
        userId: "user_e2e_001",
        rating: 5,
        comment: "ممتاز جداً",
        correctness: "correct" as const,
        relevance: "highly_relevant" as const,
        timestamp: new Date()
      };

      const learningData = await processFeedback(feedback, mockContext);
      expect(learningData).toBeDefined();
    });
  });

  describe("Performance", () => {
    it("should handle concurrent requests", async () => {
      const requests = Array(3).fill(null).map(() =>
        handleUIRequest({
          question: "ما رأي الناس في هذا الموضوع؟",
          pageType: "chat"
        })
      );

      const results = await Promise.all(requests);
      expect(results).toHaveLength(3);
      results.forEach(r => expect(r.success).toBe(true));
    });

    it("should track processing time", async () => {
      const response = await handleUIRequest({
        question: "ما رأي الناس في هذا الموضوع؟",
        pageType: "smartAnalysis"
      });

      expect(response.metadata.processingTime).toBeGreaterThan(0);
      expect(response.metadata.processingTime).toBeLessThan(30000);
    });
  });
});
