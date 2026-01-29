import { describe, expect, it } from "vitest";
import {
  getTierInfo,
  getAllTiers,
  checkUsageLimit,
  hasFeature,
  getCountriesLimit,
  getHistoricalLimit,
  SUBSCRIPTION_TIERS,
} from "./subscriptionLimits";

describe("Subscription Limits", () => {
  describe("getTierInfo", () => {
    it("should return free tier info", () => {
      const tier = getTierInfo("free");
      expect(tier.name).toBe("Free");
      expect(tier.price).toBe(0);
      expect(tier.limits.dailyAnalyses).toBe(50);
    });

    it("should return pro tier info", () => {
      const tier = getTierInfo("pro");
      expect(tier.name).toBe("Professional");
      expect(tier.price).toBe(49);
      expect(tier.limits.dailyAnalyses).toBe(500);
    });

    it("should return enterprise tier info", () => {
      const tier = getTierInfo("enterprise");
      expect(tier.name).toBe("Enterprise");
      expect(tier.price).toBe(299);
      expect(tier.limits.dailyAnalyses).toBe(-1); // unlimited
    });

    it("should return government tier info", () => {
      const tier = getTierInfo("government");
      expect(tier.name).toBe("Government & NGO");
      expect(tier.limits.dailyAnalyses).toBe(-1); // unlimited
    });
  });

  describe("getAllTiers", () => {
    it("should return all 4 subscription tiers", () => {
      const tiers = getAllTiers();
      expect(tiers).toHaveLength(4);
    });

    it("should have increasing features as tier increases", () => {
      const free = getTierInfo("free");
      const pro = getTierInfo("pro");
      
      expect(pro.limits.dailyAnalyses).toBeGreaterThan(free.limits.dailyAnalyses);
      expect(pro.limits.countriesAccess).toBeGreaterThan(free.limits.countriesAccess);
      expect(pro.limits.historicalDays).toBeGreaterThan(free.limits.historicalDays);
    });
  });

  describe("checkUsageLimit", () => {
    it("should allow usage within free tier limits", () => {
      const result = checkUsageLimit("free", "analysis", 30);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(20);
    });

    it("should deny usage exceeding free tier limits", () => {
      const result = checkUsageLimit("free", "analysis", 60);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("should always allow unlimited tiers", () => {
      const result = checkUsageLimit("enterprise", "analysis", 10000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(-1); // unlimited
    });

    it("should check API call limits correctly", () => {
      const freeResult = checkUsageLimit("free", "api_call", 0);
      expect(freeResult.allowed).toBe(false); // free tier has 0 API calls
      
      const proResult = checkUsageLimit("pro", "api_call", 500);
      expect(proResult.allowed).toBe(true);
      expect(proResult.remaining).toBe(500);
    });
  });

  describe("hasFeature", () => {
    it("should return false for free tier advanced features", () => {
      expect(hasFeature("free", "socialMediaAnalysis")).toBe(false);
      expect(hasFeature("free", "emotionalWeather")).toBe(false);
      expect(hasFeature("free", "apiAccess")).toBe(false);
    });

    it("should return true for pro tier features", () => {
      expect(hasFeature("pro", "socialMediaAnalysis")).toBe(true);
      expect(hasFeature("pro", "emotionalWeather")).toBe(true);
      expect(hasFeature("pro", "apiAccess")).toBe(true);
    });

    it("should return true for enterprise tier all features", () => {
      expect(hasFeature("enterprise", "earlyWarningSystem")).toBe(true);
      expect(hasFeature("enterprise", "customReports")).toBe(true);
      expect(hasFeature("enterprise", "whiteLabel")).toBe(true);
      expect(hasFeature("enterprise", "dedicatedSupport")).toBe(true);
    });
  });

  describe("getCountriesLimit", () => {
    it("should return correct countries limit for each tier", () => {
      expect(getCountriesLimit("free")).toBe(5);
      expect(getCountriesLimit("pro")).toBe(25);
      expect(getCountriesLimit("enterprise")).toBe(-1); // unlimited
      expect(getCountriesLimit("government")).toBe(-1); // unlimited
    });
  });

  describe("getHistoricalLimit", () => {
    it("should return correct historical days limit for each tier", () => {
      expect(getHistoricalLimit("free")).toBe(1);
      expect(getHistoricalLimit("pro")).toBe(30);
      expect(getHistoricalLimit("enterprise")).toBe(365);
      expect(getHistoricalLimit("government")).toBe(-1); // unlimited
    });
  });

  describe("SUBSCRIPTION_TIERS", () => {
    it("should have all required properties for each tier", () => {
      Object.values(SUBSCRIPTION_TIERS).forEach(tier => {
        expect(tier).toHaveProperty("name");
        expect(tier).toHaveProperty("nameAr");
        expect(tier).toHaveProperty("price");
        expect(tier).toHaveProperty("priceLabel");
        expect(tier).toHaveProperty("description");
        expect(tier).toHaveProperty("limits");
        expect(tier.limits).toHaveProperty("dailyAnalyses");
        expect(tier.limits).toHaveProperty("dailyApiCalls");
        expect(tier.limits).toHaveProperty("countriesAccess");
        expect(tier.limits).toHaveProperty("historicalDays");
        expect(tier.limits).toHaveProperty("features");
      });
    });

    it("should have features object for each tier", () => {
      Object.values(SUBSCRIPTION_TIERS).forEach(tier => {
        expect(typeof tier.limits.features).toBe("object");
        expect(tier.limits.features).toHaveProperty("socialMediaAnalysis");
        expect(tier.limits.features).toHaveProperty("emotionalWeather");
        expect(tier.limits.features).toHaveProperty("exportPdf");
        expect(tier.limits.features).toHaveProperty("apiAccess");
      });
    });
  });
});
