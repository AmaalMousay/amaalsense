import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  detectAmbiguity,
  generateClarificationDialog,
  ClarificationRequest
} from "./questionClarificationLayer";
import {
  calculateQuestionSimilarity,
  findSimilarQuestions,
  generateQuestionCacheKey,
  shouldUseCachedResponse
} from "./questionSimilarityMatcher";
import {
  calculateConfidenceScore,
  calculateDataQuality,
  calculateModelCertainty,
  calculateSourceReliability,
  calculateContextClarity,
  generateConfidenceVisualization,
  isConfidenceSufficient,
  getConfidenceRecommendation
} from "./confidenceScorer";

describe("High Priority Features", () => {
  describe("Phase 90: Question Clarification Layer", () => {
    it("should detect vague questions in Arabic", async () => {
      const result = await detectAmbiguity("ما رأي الناس؟", "ar");
      expect(result.isAmbiguous).toBe(true);
      expect(result.ambiguityType).toBe("vague");
      expect(result.clarificationQuestions.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThanOrEqual(85);
    });

    it("should detect vague questions in English", async () => {
      const result = await detectAmbiguity("What do people think?", "en");
      expect(result.isAmbiguous).toBe(true);
      expect(result.ambiguityType).toBe("vague");
    });

    it("should detect incomplete questions", async () => {
      const result = await detectAmbiguity("ما؟", "ar");
      expect(result.isAmbiguous).toBe(true);
      expect(result.ambiguityType).toBe("incomplete");
    });

    it("should recognize clear questions", async () => {
      const result = await detectAmbiguity("ما رأي الناس في الاقتصاد المصري؟", "ar");
      expect(result.isAmbiguous).toBe(false);
      expect(result.ambiguityType).toBe("clear");
    });

    it("should generate clarification dialog", async () => {
      const clarification: ClarificationRequest = {
        isAmbiguous: true,
        ambiguityType: "vague",
        clarificationQuestions: ["هل تقصد موضوع معين؟"],
        suggestedInterpretations: ["رأي الناس حول السياسة"],
        confidence: 90
      };

      const dialog = await generateClarificationDialog("ما رأي الناس؟", clarification, "ar");
      expect(dialog).toContain("السؤال الذي طرحته عام جداً");
      expect(dialog).toContain("هل تقصد موضوع معين؟");
    });
  });

  describe("Phase 91: Similarity Matching for Questions", () => {
    it("should detect identical questions", () => {
      const result = calculateQuestionSimilarity(
        "ما رأي الناس في الاقتصاد؟",
        "ما رأي الناس في الاقتصاد؟"
      );
      expect(result.isSimilar).toBe(true);
      expect(result.similarityScore).toBe(100);
    });

    it("should detect similar questions with different wording", () => {
      const result = calculateQuestionSimilarity(
        "ما رأي الناس في الاقتصاد؟",
        "ما هو رأي الجمهور حول الاقتصاد؟"
      );
      expect(result.isSimilar).toBe(true);
      expect(result.similarityScore).toBeGreaterThanOrEqual(75);
    });

    it("should detect dissimilar questions", () => {
      const result = calculateQuestionSimilarity(
        "ما رأي الناس في الاقتصاد؟",
        "كيف أطبخ البيتزا؟"
      );
      expect(result.isSimilar).toBe(false);
      expect(result.similarityScore).toBeLessThan(75);
    });

    it("should find similar questions from a list", () => {
      const questions = [
        "ما رأي الناس في الاقتصاد؟",
        "ما هو رأي الجمهور حول الاقتصاد؟",
        "كيف يشعر الناس حول الاقتصاد؟",
        "كيف أطبخ البيتزا؟"
      ];

      const results = findSimilarQuestions(
        "ما رأي الناس في الاقتصاد؟",
        questions,
        75,
        "ar"
      );

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].similarity).toBeGreaterThanOrEqual(75);
    });

    it("should generate cache key for question", () => {
      const key1 = generateQuestionCacheKey("ما رأي الناس في الاقتصاد؟");
      const key2 = generateQuestionCacheKey("ما رأي الناس في الاقتصاد؟");
      
      expect(key1).toBe(key2);
      expect(key1).toMatch(/^q_[0-9a-f]+$/);
    });

    it("should determine if cached response should be used", () => {
      const shouldUse = shouldUseCachedResponse(
        "ما رأي الناس في الاقتصاد؟",
        "ما هو رأي الجمهور حول الاقتصاد؟",
        80
      );

      expect(typeof shouldUse).toBe("boolean");
    });
  });

  describe("Phase 92: Confidence Indicators", () => {
    it("should calculate overall confidence score", () => {
      const score = calculateConfidenceScore(80, 85, 75, 90, "ar");
      
      expect(score.overall).toBeGreaterThanOrEqual(0);
      expect(score.overall).toBeLessThanOrEqual(100);
      expect(score.level).toMatch(/very_high|high|medium|low|very_low/);
      expect(score.icon).toMatch(/🟢|🟡|🟠|🔴|⚫/);
    });

    it("should return very high confidence for high scores", () => {
      const score = calculateConfidenceScore(95, 95, 95, 95, "ar");
      expect(score.level).toBe("very_high");
      expect(score.icon).toBe("🟢");
    });

    it("should return low confidence for low scores", () => {
      const score = calculateConfidenceScore(20, 20, 20, 20, "ar");
      expect(score.level).toBe("very_low");
      expect(score.icon).toBe("⚫");
    });

    it("should calculate data quality", () => {
      const quality = calculateDataQuality(5, 12, 80);
      expect(quality).toBeGreaterThanOrEqual(0);
      expect(quality).toBeLessThanOrEqual(100);
    });

    it("should calculate model certainty", () => {
      const certainty = calculateModelCertainty(85, 90, 0.1);
      expect(certainty).toBeGreaterThanOrEqual(0);
      expect(certainty).toBeLessThanOrEqual(100);
    });

    it("should calculate source reliability", () => {
      const reliability = calculateSourceReliability([
        { type: "academic", accuracy: 95, factChecked: true },
        { type: "news", accuracy: 80, factChecked: true },
        { type: "social_media", accuracy: 60, factChecked: false }
      ]);
      
      expect(reliability).toBeGreaterThanOrEqual(0);
      expect(reliability).toBeLessThanOrEqual(100);
    });

    it("should calculate context clarity", () => {
      const clarity = calculateContextClarity(85, 90, 80);
      expect(clarity).toBeGreaterThanOrEqual(0);
      expect(clarity).toBeLessThanOrEqual(100);
    });

    it("should generate confidence visualization", () => {
      const score = calculateConfidenceScore(80, 85, 75, 90, "ar");
      const viz = generateConfidenceVisualization(score);
      
      expect(viz).toContain("█");
      expect(viz).toContain("Confidence");
    });

    it("should check if confidence is sufficient", () => {
      const score = calculateConfidenceScore(85, 90, 80, 85, "ar");
      const sufficient = isConfidenceSufficient(score, "high");
      
      expect(typeof sufficient).toBe("boolean");
    });

    it("should get confidence recommendation in Arabic", () => {
      const score = calculateConfidenceScore(90, 95, 90, 95, "ar");
      const recommendation = getConfidenceRecommendation(score, "ar");
      
      expect(recommendation).toContain("✅");
      expect(recommendation).toContain("الاعتماد");
    });

    it("should get confidence recommendation in English", () => {
      const score = calculateConfidenceScore(50, 50, 50, 50, "en");
      const recommendation = getConfidenceRecommendation(score, "en");
      
      expect(recommendation).toContain("⚠️");
      expect(recommendation).toContain("verify");
    });
  });

  describe("Integration Tests", () => {
    it("should work together: clarification -> similarity -> confidence", async () => {
      // Step 1: Check for ambiguity
      const clarification = await detectAmbiguity("ما رأي الناس؟", "ar");
      expect(clarification.isAmbiguous).toBe(true);

      // Step 2: If ambiguous, check for similar questions
      if (clarification.isAmbiguous) {
        const similarQuestions = [
          "ما رأي الناس في الاقتصاد؟",
          "ما هو رأي الجمهور حول السياسة؟"
        ];

        const similar = findSimilarQuestions(
          "ما رأي الناس؟",
          similarQuestions,
          70,
          "ar"
        );

        // If similar questions found, use cached response with confidence
        if (similar.length > 0) {
          const score = calculateConfidenceScore(85, 90, 80, 75, "ar");
          expect(score.overall).toBeGreaterThan(75);
        }
      }
    });

    it("should handle multi-language scenarios", async () => {
      // Arabic question
      const arResult = await detectAmbiguity("ما رأي الناس؟", "ar");
      expect(arResult.isAmbiguous).toBe(true);

      // English question
      const enResult = await detectAmbiguity("What do people think?", "en");
      expect(enResult.isAmbiguous).toBe(true);

      // Both should be detected as ambiguous
      expect(arResult.isAmbiguous).toBe(enResult.isAmbiguous);
    });
  });
});
