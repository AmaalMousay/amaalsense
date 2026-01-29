import { describe, it, expect } from "vitest";

describe("NewsAPI Validation", () => {
  it("should have NEWS_API_KEY configured", () => {
    const apiKey = process.env.NEWS_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe("");
    expect(apiKey?.length).toBeGreaterThan(10);
  });

  it("should successfully fetch news from NewsAPI", async () => {
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      console.log("NEWS_API_KEY not configured, skipping test");
      return;
    }

    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=1&apiKey=${apiKey}`
    );

    const data = await response.json();
    
    // Check if API key is valid
    expect(response.status).not.toBe(401); // Unauthorized means invalid key
    expect(data.status).toBe("ok");
    
    console.log("NewsAPI connection successful!");
    console.log(`Total results available: ${data.totalResults}`);
  });
});
