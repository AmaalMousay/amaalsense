/**
 * Scheduled Predictions Service
 * Automatically generates predictions at regular intervals and notifies on critical tipping points
 */

import { getCountryHistoricalIndices, getAllCountriesHistoricalIndices, getDb } from "./db";
import { predictions, predictionSnapshots } from "../drizzle/schema";
import {
  analyzeTrend,
  detectTippingPoints,
  calculateRiskScore,
  generatePredictions,
  generateAIInterpretation,
  type EmotionalDataPoint,
  type TippingPoint,
  type RiskScore,
} from "./predictionEngine";
import { notifyOwner } from "./_core/notification";

// Scheduler state
let isPredictionSchedulerRunning = false;
let predictionSchedulerInterval: NodeJS.Timeout | null = null;
let lastRunTimestamp: number | null = null;
let lastRunResults: PredictionCycleResult | null = null;

// Countries to monitor
const MONITORED_COUNTRIES = [
  { code: "US", name: "United States", nameAr: "الولايات المتحدة" },
  { code: "GB", name: "United Kingdom", nameAr: "المملكة المتحدة" },
  { code: "DE", name: "Germany", nameAr: "ألمانيا" },
  { code: "FR", name: "France", nameAr: "فرنسا" },
  { code: "JP", name: "Japan", nameAr: "اليابان" },
  { code: "SA", name: "Saudi Arabia", nameAr: "السعودية" },
  { code: "AE", name: "UAE", nameAr: "الإمارات" },
  { code: "EG", name: "Egypt", nameAr: "مصر" },
  { code: "LY", name: "Libya", nameAr: "ليبيا" },
  { code: "CN", name: "China", nameAr: "الصين" },
  { code: "RU", name: "Russia", nameAr: "روسيا" },
  { code: "BR", name: "Brazil", nameAr: "البرازيل" },
  { code: "IN", name: "India", nameAr: "الهند" },
  { code: "AU", name: "Australia", nameAr: "أستراليا" },
  { code: "TR", name: "Turkey", nameAr: "تركيا" },
];

// Alert thresholds
const RISK_ALERT_THRESHOLD = 70; // Alert when risk score >= 70
const TIPPING_POINT_SEVERITY_ALERT = "high"; // Alert on high or critical tipping points

export interface PredictionCycleResult {
  success: boolean;
  timestamp: number;
  countriesProcessed: number;
  predictionsGenerated: number;
  snapshotsSaved: number;
  alertsSent: number;
  criticalCountries: string[];
  errors: string[];
}

/**
 * Run a single prediction cycle for all monitored countries
 */
export async function runPredictionCycle(): Promise<PredictionCycleResult> {
  const result: PredictionCycleResult = {
    success: true,
    timestamp: Date.now(),
    countriesProcessed: 0,
    predictionsGenerated: 0,
    snapshotsSaved: 0,
    alertsSent: 0,
    criticalCountries: [],
    errors: [],
  };

  console.log("[PredictionScheduler] Starting prediction cycle...");

  for (const country of MONITORED_COUNTRIES) {
    try {
      await processCountryPrediction(country, result);
      result.countriesProcessed++;
      // Small delay to avoid overwhelming APIs
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      result.errors.push(`${country.code}: ${msg}`);
      console.error(`[PredictionScheduler] Error processing ${country.code}:`, msg);
    }
  }

  // Send summary notification if there are critical countries
  if (result.criticalCountries.length > 0) {
    await sendCriticalSummaryNotification(result);
  }

  lastRunTimestamp = Date.now();
  lastRunResults = result;
  result.success = result.errors.length === 0;

  console.log(
    `[PredictionScheduler] Cycle complete. Countries: ${result.countriesProcessed}, ` +
    `Predictions: ${result.predictionsGenerated}, Alerts: ${result.alertsSent}, ` +
    `Errors: ${result.errors.length}`
  );

  return result;
}

/**
 * Process predictions for a single country
 */
async function processCountryPrediction(
  country: { code: string; name: string; nameAr: string },
  result: PredictionCycleResult
): Promise<void> {
  // Get historical data (48 hours for better trend analysis)
  const historicalData = await getCountryHistoricalIndices(country.code, 48);

  if (historicalData.length < 3) {
    // Not enough data, skip
    return;
  }

  // Convert to EmotionalDataPoint format
  const dataPoints: EmotionalDataPoint[] = historicalData.map((d) => ({
    timestamp: new Date(d.analyzedAt).getTime(),
    gmi: d.gmi,
    cfi: d.cfi,
    hri: d.hri,
  }));

  // Analyze trends
  const gmiTrend = analyzeTrend(dataPoints.map((d) => d.gmi));
  const cfiTrend = analyzeTrend(dataPoints.map((d) => d.cfi));
  const hriTrend = analyzeTrend(dataPoints.map((d) => d.hri));
  const trends = { gmi: gmiTrend, cfi: cfiTrend, hri: hriTrend };

  // Detect tipping points
  const tippingPoints = detectTippingPoints(dataPoints, trends);

  // Calculate risk score
  const riskScore = calculateRiskScore(dataPoints, trends);

  // Generate predictions
  const preds = generatePredictions(dataPoints, trends, riskScore);

  // Save snapshot to database
  await saveSnapshot(country, dataPoints, riskScore);
  result.snapshotsSaved++;

  // Save predictions to database
  const db = await getDb();
  if (db && preds.length > 0) {
    for (const pred of preds) {
      try {
        // Calculate predicted time based on timeframe
        const timeframeMs: Record<string, number> = { '6h': 6*3600000, '24h': 24*3600000, '48h': 48*3600000, '7d': 7*24*3600000 };
        const predictedForDate = new Date(Date.now() + (timeframeMs[pred.timeframe] || 24*3600000));
        
        await db.insert(predictions).values({
          countryCode: country.code,
          countryName: country.name,
          timeframe: pred.timeframe,
          predictedGmi: pred.predictedGMI,
          predictedCfi: pred.predictedCFI,
          predictedHri: pred.predictedHRI,
          predictedEmotion: pred.predictedDominantEmotion,
          confidence: pred.confidence,
          scenarioName: pred.scenarioName,
          riskScore: riskScore.overall,
          riskLevel: riskScore.level,
          predictionData: JSON.stringify({
            trends: { gmi: gmiTrend.direction, cfi: cfiTrend.direction, hri: hriTrend.direction },
            tippingPoints: tippingPoints.length,
            dataPointsUsed: dataPoints.length,
          }),
          predictedFor: predictedForDate,
        });
        result.predictionsGenerated++;
      } catch (e) {
        // Ignore duplicate insert errors
      }
    }
  }

  // Check for critical alerts
  const isCritical = riskScore.overall >= RISK_ALERT_THRESHOLD;
  const hasCriticalTippingPoint = tippingPoints.some(
    (tp) => tp.severity === "critical" || tp.severity === TIPPING_POINT_SEVERITY_ALERT
  );

  if (isCritical || hasCriticalTippingPoint) {
    result.criticalCountries.push(country.code);
    await sendCountryAlert(country, riskScore, tippingPoints, preds);
    result.alertsSent++;
  }
}

/**
 * Save a prediction snapshot
 */
async function saveSnapshot(
  country: { code: string; name: string },
  dataPoints: EmotionalDataPoint[],
  riskScore: RiskScore
): Promise<void> {
  const db = await getDb();
  if (!db || dataPoints.length === 0) return;

  const latest = dataPoints[dataPoints.length - 1];
  try {
    await db.insert(predictionSnapshots).values({
      countryCode: country.code,
      gmi: latest.gmi,
      cfi: latest.cfi,
      hri: latest.hri,
      riskScore: riskScore.overall,
      trendDirection: riskScore.level,
    });
  } catch (e) {
    // Ignore errors
  }
}

/**
 * Send alert notification for a critical country
 */
async function sendCountryAlert(
  country: { code: string; name: string; nameAr: string },
  riskScore: RiskScore,
  tippingPoints: TippingPoint[],
  preds: any[]
): Promise<void> {
  const criticalTPs = tippingPoints.filter(
    (tp) => tp.severity === "critical" || tp.severity === "high"
  );

  const title = `⚠️ تنبيه حرج: ${country.nameAr} (${country.code}) - مستوى خطورة ${riskScore.overall}/100`;

  const tpList = criticalTPs
    .map((tp) => `  - ${tp.description} (${tp.severity}, احتمالية: ${Math.round(tp.probability * 100)}%)`)
    .join("\n");

  const factorsAr = riskScore.factorsAr?.join("، ") || riskScore.factors.join(", ");

  const nextPred = preds[0];
  const predInfo = nextPred
    ? `\n📊 التنبؤ القادم (${nextPred.timeframe}): GMI=${Math.round(nextPred.predictedGMI)}, CFI=${Math.round(nextPred.predictedCFI)}, HRI=${Math.round(nextPred.predictedHRI)}`
    : "";

  const content = `🏴 الدولة: ${country.nameAr} (${country.name})
🔴 مستوى الخطورة: ${riskScore.level} (${riskScore.overall}/100)

📋 عوامل الخطر:
${factorsAr}

🔥 نقاط التحول الحرجة:
${tpList || "  لا توجد نقاط تحول حرجة"}
${predInfo}

⏰ الوقت: ${new Date().toISOString()}

💡 يُنصح بمراجعة لوحة التنبؤات للمزيد من التفاصيل.`;

  try {
    await notifyOwner({ title, content });
    console.log(`[PredictionScheduler] Alert sent for ${country.code}`);
  } catch (error) {
    console.error(`[PredictionScheduler] Failed to send alert for ${country.code}:`, error);
  }
}

/**
 * Send summary notification for all critical countries
 */
async function sendCriticalSummaryNotification(result: PredictionCycleResult): Promise<void> {
  if (result.criticalCountries.length === 0) return;

  const title = `📊 ملخص التنبؤات: ${result.criticalCountries.length} دول في حالة حرجة`;

  const content = `🔄 دورة التنبؤات الدورية اكتملت

📈 الإحصائيات:
  - الدول المراقبة: ${result.countriesProcessed}/${MONITORED_COUNTRIES.length}
  - التنبؤات المولدة: ${result.predictionsGenerated}
  - اللقطات المحفوظة: ${result.snapshotsSaved}

🚨 الدول الحرجة: ${result.criticalCountries.join(", ")}

${result.errors.length > 0 ? `❌ أخطاء: ${result.errors.length}\n${result.errors.slice(0, 3).join("\n")}` : "✅ لا أخطاء"}

⏰ الوقت: ${new Date().toISOString()}`;

  try {
    await notifyOwner({ title, content });
  } catch (error) {
    console.error("[PredictionScheduler] Failed to send summary notification:", error);
  }
}

/**
 * Start the prediction scheduler
 * @param intervalMinutes - Interval between prediction cycles (default: 120 = 2 hours)
 */
export function startPredictionScheduler(intervalMinutes: number = 120): void {
  if (isPredictionSchedulerRunning) {
    console.log("[PredictionScheduler] Already running");
    return;
  }

  const intervalMs = intervalMinutes * 60 * 1000;

  console.log(`[PredictionScheduler] Starting with ${intervalMinutes} minute interval`);
  isPredictionSchedulerRunning = true;

  // Run first cycle after 30 seconds (to let the server fully initialize)
  setTimeout(() => {
    runPredictionCycle().catch(console.error);
  }, 30000);

  // Then run at intervals
  predictionSchedulerInterval = setInterval(() => {
    runPredictionCycle().catch(console.error);
  }, intervalMs);
}

/**
 * Stop the prediction scheduler
 */
export function stopPredictionScheduler(): void {
  if (!isPredictionSchedulerRunning) {
    console.log("[PredictionScheduler] Not running");
    return;
  }

  if (predictionSchedulerInterval) {
    clearInterval(predictionSchedulerInterval);
    predictionSchedulerInterval = null;
  }

  isPredictionSchedulerRunning = false;
  console.log("[PredictionScheduler] Stopped");
}

/**
 * Get prediction scheduler status
 */
export function getPredictionSchedulerStatus(): {
  running: boolean;
  intervalMinutes: number;
  lastRunTimestamp: number | null;
  lastRunResults: PredictionCycleResult | null;
  monitoredCountries: number;
  alertThreshold: number;
} {
  return {
    running: isPredictionSchedulerRunning,
    intervalMinutes: 120,
    lastRunTimestamp,
    lastRunResults,
    monitoredCountries: MONITORED_COUNTRIES.length,
    alertThreshold: RISK_ALERT_THRESHOLD,
  };
}
