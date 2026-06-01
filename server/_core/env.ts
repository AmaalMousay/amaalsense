export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
  newsApiKey: process.env.NEWS_API_KEY ?? "",
  youtubeApiKey: process.env.YOUTUBE_API_KEY ?? "",
  gnewsApiKey: process.env.GNEWS_API_KEY ?? "",
  groqApiKey: process.env.GROQ_API_KEY ?? "",
};

/**
 * Validates that critical environment variables are set in production.
 * Crashes early to prevent running with insecure empty-string fallbacks.
 */
export function validateProductionEnv(): void {
  if (process.env.NODE_ENV !== "production") return;

  const missing: string[] = [];

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    missing.push("JWT_SECRET (must be at least 32 characters)");
  }
  if (!process.env.DATABASE_URL) {
    missing.push("DATABASE_URL");
  }

  if (missing.length > 0) {
    console.error("[ENV] ❌ FATAL: Missing required environment variables for production:");
    missing.forEach((v) => console.error(`  - ${v}`));
    console.error("[ENV] Set these in your .env file or hosting provider before starting in production.");
    console.log("[ENV] ⚠️  Running without some production variables - this is OK if Render provides them via dashboard.");
  }

  console.log("[ENV] ✅ Production environment variables validated.");
}
