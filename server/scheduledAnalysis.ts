/**
 * Scheduled Analysis Service
 * Automatically analyzes news and social media data at regular intervals
 */

import { saveAnalysisSession, AnalysisResult, SourceResult } from "./analyticsStorage";
import { getNewsWithFallback, fetchGlobalNews, generateMockNews } from "./newsService";
import { fetchAllSocialMedia, SocialPost } from "./socialMediaService";
import { analyzeTextsWithAI, SentimentAnalysisResult } from "./aiSentimentAnalyzer";
import { executeNetworkEngine, getGlobalMood } from "./networkEngine";

// Track if scheduler is running
let isSchedulerRunning = false;
let schedulerInterval: NodeJS.Timeout | null = null;

/**
 * Run a single analysis cycle
 */
export async function runAnalysisCycle(): Promise<{
  success: boolean;
  sessionsCreated: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let sessionsCreated = 0;

  console.log("[Scheduler] Starting analysis cycle (using unified network engine)...");

  try {
    // 1. Analyze global mood via unified engine
    const globalResult = await analyzeGlobalMoodViaEngine();
    if (globalResult.success) {
      sessionsCreated++;
    } else if (globalResult.error) {
      errors.push(`Global mood: ${globalResult.error}`);
    }

    // 2. Analyze top 5 countries via unified engine
    const topCountries = ["US", "GB", "DE", "FR", "JP"];
    for (const countryCode of topCountries) {
      const countryResult = await analyzeCountryViaEngine(countryCode);
      if (countryResult.success) {
        sessionsCreated++;
      } else if (countryResult.error) {
        errors.push(`${countryCode}: ${countryResult.error}`);
      }
      // Small delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 3. Analyze social media trends
    const socialResult = await analyzeSocialMedia();
    if (socialResult.success) {
      sessionsCreated++;
    } else if (socialResult.error) {
      errors.push(`Social media: ${socialResult.error}`);
    }

    console.log(`[Scheduler] Cycle complete. Sessions created: ${sessionsCreated}, Errors: ${errors.length}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    errors.push(`Cycle error: ${errorMsg}`);
    console.error("[Scheduler] Cycle failed:", error);
  }

  return {
    success: errors.length === 0,
    sessionsCreated,
    errors,
  };
}

/**
 * Analyze global news
 */
async function analyzeGlobalNews(): Promise<{ success: boolean; error?: string }> {
  try {
    let articles = await fetchGlobalNews(20);
    let isReal = articles.length > 0;

    if (articles.length === 0) {
      articles = generateMockNews("US", 20);
      isReal = false;
    }

    const headlines = articles.map((a) => a.title);
    const analysis = await analyzeTextsWithAI(headlines);

    const sources: SourceResult[] = articles.map((article, i) => {
      const sentimentValue = analysis.results[i]?.sentiment;
      const sentimentScore = sentimentValue === 'positive' ? 1 : sentimentValue === 'negative' ? -1 : 0;
      return {
        platform: "news" as const,
        content: article.title,
        sourceUrl: article.url,
        author: article.source,
        sentimentScore,
        emotions: analysis.results[i]?.emotions || {
          joy: 0,
          fear: 0,
          anger: 0,
          sadness: 0,
          hope: 0,
          curiosity: 0,
        },
        dominantEmotion: analysis.results[i]?.dominantEmotion || "neutral",
        confidence: analysis.results[i]?.confidence || 0,
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : undefined,
      };
    });

    const result: AnalysisResult = {
      gmi: analysis.aggregated.gmi,
      cfi: analysis.aggregated.cfi,
      hri: analysis.aggregated.hri,
      sentimentScore: 0,
      dominantEmotion: analysis.aggregated.dominantEmotion,
      confidence: analysis.aggregated.confidence,
      sources,
    };

    await saveAnalysisSession(result, {
      sessionType: "scheduled",
      query: "global news",
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Analyze news for a specific country
 */
async function analyzeCountryNews(countryCode: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { articles, isReal } = await getNewsWithFallback(countryCode, 15);

    if (articles.length === 0) {
      return { success: false, error: "No articles found" };
    }

    const headlines = articles.map((a) => a.title);
    const analysis = await analyzeTextsWithAI(headlines);

    const sources: SourceResult[] = articles.map((article, i) => {
      const sentimentValue = analysis.results[i]?.sentiment;
      const sentimentScore = sentimentValue === 'positive' ? 1 : sentimentValue === 'negative' ? -1 : 0;
      return {
        platform: "news" as const,
        content: article.title,
        sourceUrl: article.url,
        author: article.source,
        sentimentScore,
        emotions: analysis.results[i]?.emotions || {
          joy: 0,
          fear: 0,
          anger: 0,
          sadness: 0,
          hope: 0,
          curiosity: 0,
        },
        dominantEmotion: analysis.results[i]?.dominantEmotion || "neutral",
        confidence: analysis.results[i]?.confidence || 0,
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : undefined,
      };
    });

    const result: AnalysisResult = {
      gmi: analysis.aggregated.gmi,
      cfi: analysis.aggregated.cfi,
      hri: analysis.aggregated.hri,
      sentimentScore: 0,
      dominantEmotion: analysis.aggregated.dominantEmotion,
      confidence: analysis.aggregated.confidence,
      sources,
    };

    await saveAnalysisSession(result, {
      sessionType: "scheduled",
      query: `${countryCode} news`,
      countryCode,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Analyze social media trends
 */
async function analyzeSocialMedia(): Promise<{ success: boolean; error?: string }> {
  try {
    const socialData = await fetchAllSocialMedia({ query: "trending", limit: 30 });

    if (socialData.posts.length === 0) {
      return { success: false, error: "No social media posts found" };
    }

    const texts = socialData.posts.map((p) => p.text).slice(0, 20);
    const analysis = await analyzeTextsWithAI(texts);

    const sources: SourceResult[] = socialData.posts.slice(0, 20).map((post, i) => {
      const sentimentValue = analysis.results[i]?.sentiment;
      const sentimentScore = sentimentValue === 'positive' ? 1 : sentimentValue === 'negative' ? -1 : 0;
      return {
        platform: post.platform,
        content: post.text,
        sourceUrl: post.url,
        author: post.author,
        sentimentScore,
        emotions: analysis.results[i]?.emotions || {
          joy: 0,
          fear: 0,
          anger: 0,
          sadness: 0,
          hope: 0,
          curiosity: 0,
        },
        dominantEmotion: analysis.results[i]?.dominantEmotion || "neutral",
        confidence: analysis.results[i]?.confidence || 0,
        publishedAt: post.publishedAt,
      };
    });

    const result: AnalysisResult = {
      gmi: analysis.aggregated.gmi,
      cfi: analysis.aggregated.cfi,
      hri: analysis.aggregated.hri,
      sentimentScore: 0,
      dominantEmotion: analysis.aggregated.dominantEmotion,
      confidence: analysis.aggregated.confidence,
      sources,
    };

    await saveAnalysisSession(result, {
      sessionType: "scheduled",
      query: "social media trends",
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Analyze global mood via unified network engine
 */
async function analyzeGlobalMoodViaEngine(): Promise<{ success: boolean; error?: string }> {
  try {
    const mood = await getGlobalMood();
    const result: AnalysisResult = {
      gmi: mood.gmi,
      cfi: mood.cfi,
      hri: mood.hri,
      sentimentScore: mood.gmi / 100,
      dominantEmotion: mood.dominantEmotion,
      confidence: mood.confidence,
      sources: [],
    };
    await saveAnalysisSession(result, {
      sessionType: 'scheduled',
      query: 'global mood (unified engine)',
    });
    return { success: true };
  } catch (error) {
    console.error('[Scheduler] Engine global mood failed, falling back:', error);
    return analyzeGlobalNews();
  }
}

/**
 * Analyze country via unified network engine
 */
async function analyzeCountryViaEngine(countryCode: string): Promise<{ success: boolean; error?: string }> {
  try {
    const ctx = await executeNetworkEngine('scheduler', `Analyze current emotional state of ${countryCode}`, 'en');
    const result: AnalysisResult = {
      gmi: ctx.dcft?.indices?.gmi ?? 0,
      cfi: ctx.dcft?.indices?.cfi ?? 50,
      hri: ctx.dcft?.indices?.hri ?? 50,
      sentimentScore: 0,
      dominantEmotion: ctx.collection?.eventVector?.dominantEmotion || 'neutral',
      confidence: ctx.analysis?.confidence?.overall || 0,
      sources: [],
    };
    await saveAnalysisSession(result, {
      sessionType: 'scheduled',
      query: `${countryCode} analysis (unified engine)`,
      countryCode,
    });
    return { success: true };
  } catch (error) {
    console.error(`[Scheduler] Engine analysis failed for ${countryCode}, falling back:`, error);
    return analyzeCountryNews(countryCode);
  }
}

/**
 * Start the scheduler
 * @param intervalMinutes - Interval in minutes between analysis cycles (default: 60)
 */
export function startScheduler(intervalMinutes: number = 60): void {
  if (isSchedulerRunning) {
    console.log("[Scheduler] Already running");
    return;
  }

  const intervalMs = intervalMinutes * 60 * 1000;

  console.log(`[Scheduler] Starting with ${intervalMinutes} minute interval`);
  isSchedulerRunning = true;

  // Run immediately on start
  runAnalysisCycle().catch(console.error);

  // Then run at intervals
  schedulerInterval = setInterval(() => {
    runAnalysisCycle().catch(console.error);
  }, intervalMs);
}

/**
 * Stop the scheduler
 */
export function stopScheduler(): void {
  if (!isSchedulerRunning) {
    console.log("[Scheduler] Not running");
    return;
  }

  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }

  isSchedulerRunning = false;
  console.log("[Scheduler] Stopped");
}

/**
 * Get scheduler status
 */
export function getSchedulerStatus(): {
  running: boolean;
  intervalMinutes: number | null;
} {
  return {
    running: isSchedulerRunning,
    intervalMinutes: isSchedulerRunning ? 60 : null,
  };
}
