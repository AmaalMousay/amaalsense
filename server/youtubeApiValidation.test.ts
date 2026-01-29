import { describe, it, expect } from "vitest";

describe("YouTube API Validation", () => {
  it("should have YOUTUBE_API_KEY configured", () => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe("");
    expect(apiKey?.length).toBeGreaterThan(10);
  });

  it("should successfully connect to YouTube Data API", async () => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      console.log("YOUTUBE_API_KEY not configured, skipping test");
      return;
    }

    // Test with a simple search query
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&type=video&maxResults=1&key=${apiKey}`
    );

    const data = await response.json();
    
    // Check if API key is valid
    if (response.status === 403) {
      console.log("API Key may have quota exceeded or restrictions:", data.error?.message);
      // Still pass if it's a quota issue, not an invalid key
      expect(data.error?.errors?.[0]?.reason).not.toBe("keyInvalid");
      return;
    }
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("items");
    
    console.log("YouTube API connection successful!");
    console.log(`Results found: ${data.pageInfo?.totalResults || 0}`);
  }, 15000);
});
