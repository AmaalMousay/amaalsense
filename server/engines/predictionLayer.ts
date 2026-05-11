/**
 * Prediction Layer - Layer 25
 * 
 * تحليل البيانات التاريخية والتنبؤ بالمشاعر والمؤشرات في المستقبل
 * 
 * الصيغ المستخدمة:
 * 1. Linear Regression: y(t+1) = α + β × t + ε
 * 2. Moving Average: MA(n) = (y(t) + y(t-1) + ... + y(t-n+1)) / n
 * 3. Exponential Smoothing: F(t+1) = α × y(t) + (1-α) × F(t)
 * 4. ARIMA: ARIMA(p,d,q)
 */

import { z } from 'zod';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface HistoricalDataPoint {
  date: Date;
  gmi: number;
  cfi: number;
  hri: number;
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  topic: string;
  region: string;
}

export interface PredictionResult {
  date: Date;
  predicted: number;
  actual?: number;
  confidence: number;
  lower: number;
  upper: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ForecastResult {
  metric: string;
  predictions: PredictionResult[];
  accuracy: {
    mae: number;
    rmse: number;
    mape: number;
  };
  model: 'linear' | 'moving_average' | 'exponential' | 'arima';
  confidence: number;
}

export interface ScenarioAnalysis {
  optimistic: PredictionResult[];
  realistic: PredictionResult[];
  pessimistic: PredictionResult[];
}

// ============================================================================
// Linear Regression Model
// ============================================================================

class LinearRegressionModel {
  private alpha: number = 0;
  private beta: number = 0;

  /**
   * تدريب نموذج الانحدار الخطي
   * y(t+1) = α + β × t + ε
   */
  train(data: number[]): void {
    const n = data.length;
    const t = Array.from({ length: n }, (_, i) => i);
    
    const meanT = t.reduce((a, b) => a + b, 0) / n;
    const meanY = data.reduce((a, b) => a + b, 0) / n;
    
    const numerator = t.reduce((sum, ti, i) => sum + (ti - meanT) * (data[i] - meanY), 0);
    const denominator = t.reduce((sum, ti) => sum + Math.pow(ti - meanT, 2), 0);
    
    this.beta = denominator !== 0 ? numerator / denominator : 0;
    this.alpha = meanY - this.beta * meanT;
  }

  /**
   * التنبؤ بالقيمة التالية
   */
  predict(steps: number = 1): number[] {
    const predictions: number[] = [];
    const startT = 0;
    
    for (let i = 0; i < steps; i++) {
      const t = startT + i;
      predictions.push(this.alpha + this.beta * t);
    }
    
    return predictions;
  }

  /**
   * حساب الخطأ
   */
  calculateError(actual: number[], predicted: number[]): { mae: number; rmse: number; mape: number } {
    const errors = actual.map((a, i) => Math.abs(a - predicted[i]));
    const mae = errors.reduce((a, b) => a + b, 0) / errors.length;
    
    const squaredErrors = actual.map((a, i) => Math.pow(a - predicted[i], 2));
    const rmse = Math.sqrt(squaredErrors.reduce((a, b) => a + b, 0) / squaredErrors.length);
    
    const percentErrors = actual.map((a, i) => Math.abs((a - predicted[i]) / a) * 100);
    const mape = percentErrors.reduce((a, b) => a + b, 0) / percentErrors.length;
    
    return { mae, rmse, mape };
  }
}

// ============================================================================
// Moving Average Model
// ============================================================================

class MovingAverageModel {
  private window: number = 7;

  constructor(window: number = 7) {
    this.window = Math.max(1, Math.min(window, 30));
  }

  /**
   * حساب المتوسط المتحرك
   * MA(n) = (y(t) + y(t-1) + ... + y(t-n+1)) / n
   */
  calculate(data: number[]): number[] {
    const result: number[] = [];
    
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - this.window + 1);
      const window = data.slice(start, i + 1);
      const average = window.reduce((a, b) => a + b, 0) / window.length;
      result.push(average);
    }
    
    return result;
  }

  /**
   * التنبؤ بالقيم المستقبلية
   */
  predict(data: number[], steps: number = 1): number[] {
    const ma = this.calculate(data);
    const lastMA = ma[ma.length - 1];
    
    return Array(steps).fill(lastMA);
  }
}

// ============================================================================
// Exponential Smoothing Model
// ============================================================================

class ExponentialSmoothingModel {
  private alpha: number = 0.3;

  constructor(alpha: number = 0.3) {
    this.alpha = Math.max(0.1, Math.min(alpha, 0.9));
  }

  /**
   * التسوية الأسية
   * F(t+1) = α × y(t) + (1-α) × F(t)
   */
  smooth(data: number[]): number[] {
    const result: number[] = [data[0]];
    
    for (let i = 1; i < data.length; i++) {
      const smoothed = this.alpha * data[i] + (1 - this.alpha) * result[i - 1];
      result.push(smoothed);
    }
    
    return result;
  }

  /**
   * التنبؤ بالقيم المستقبلية
   */
  predict(data: number[], steps: number = 1): number[] {
    const smoothed = this.smooth(data);
    const lastSmoothed = smoothed[smoothed.length - 1];
    
    return Array(steps).fill(lastSmoothed);
  }
}

// ============================================================================
// ARIMA Model (Simplified)
// ============================================================================

class ARIMAModel {
  private p: number = 1;
  private d: number = 1;
  private q: number = 1;

  constructor(p: number = 1, d: number = 1, q: number = 1) {
    this.p = p;
    this.d = d;
    this.q = q;
  }

  /**
   * الفرق (Differencing)
   */
  private difference(data: number[], order: number = 1): number[] {
    let result = [...data];
    
    for (let i = 0; i < order; i++) {
      result = result.slice(1).map((val, idx) => val - result[idx]);
    }
    
    return result;
  }

  /**
   * التنبؤ بالقيم المستقبلية
   */
  predict(data: number[], steps: number = 1): number[] {
    const differenced = this.difference(data, this.d);
    const ma = new MovingAverageModel(this.q);
    const predictions = ma.predict(differenced, steps);
    
    // إعادة البناء (Reverse differencing)
    let result = [...predictions];
    for (let i = 0; i < this.d; i++) {
      result = result.map((val, idx) => val + (data[data.length - 1 - i] || 0));
    }
    
    return result;
  }
}

// ============================================================================
// Main Prediction Engine
// ============================================================================

export class PredictionEngine {
  private historicalData: HistoricalDataPoint[] = [];
  private linearModel: LinearRegressionModel = new LinearRegressionModel();
  private maModel: MovingAverageModel = new MovingAverageModel(7);
  private esModel: ExponentialSmoothingModel = new ExponentialSmoothingModel(0.3);
  private arimaModel: ARIMAModel = new ARIMAModel(1, 1, 1);

  /**
   * إضافة بيانات تاريخية
   */
  addHistoricalData(data: HistoricalDataPoint[]): void {
    this.historicalData = [...this.historicalData, ...data].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    
    // الاحتفاظ بـ 90 يوم فقط
    if (this.historicalData.length > 90) {
      this.historicalData = this.historicalData.slice(-90);
    }
  }

  /**
   * التنبؤ بـ GMI (Global Mood Index)
   */
  forecastGMI(days: number = 7): ForecastResult {
    const gmiData = this.historicalData.map(d => d.gmi);
    
    if (gmiData.length < 7) {
      throw new Error('Not enough historical data for prediction');
    }
    
    // تدريب النموذج
    this.linearModel.train(gmiData);
    
    // التنبؤ
    const predictions = this.linearModel.predict(days);
    const maValues = this.maModel.predict(gmiData, days);
    
    // حساب الثقة
    const trainingPredictions = this.linearModel.predict(gmiData.length);
    const error = this.linearModel.calculateError(gmiData, trainingPredictions);
    const confidence = Math.max(0, 100 - error.mape);
    
    // تحويل إلى نتائج
    const results: PredictionResult[] = predictions.map((pred, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      
      const margin = Math.abs(pred) * 0.1; // 10% margin
      
      return {
        date,
        predicted: pred,
        confidence: Math.min(100, Math.max(0, confidence)),
        lower: pred - margin,
        upper: pred + margin,
        trend: i === 0 ? 'stable' : predictions[i] > predictions[i - 1] ? 'up' : 'down',
      };
    });
    
    return {
      metric: 'GMI',
      predictions: results,
      accuracy: error,
      model: 'linear',
      confidence: Math.min(100, Math.max(0, confidence)),
    };
  }

  /**
   * التنبؤ بـ CFI (Collective Fear Index)
   */
  forecastCFI(days: number = 7): ForecastResult {
    const cfiData = this.historicalData.map(d => d.cfi);
    
    if (cfiData.length < 7) {
      throw new Error('Not enough historical data for prediction');
    }
    
    // استخدام Exponential Smoothing للخوف (أكثر استجابة)
    const predictions = this.esModel.predict(cfiData, days);
    
    // حساب الثقة
    const smoothed = this.esModel.smooth(cfiData);
    const error = this.linearModel.calculateError(cfiData, smoothed);
    const confidence = Math.max(0, 100 - error.mape);
    
    // تحويل إلى نتائج
    const results: PredictionResult[] = predictions.map((pred, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      
      const margin = Math.abs(pred) * 0.15; // 15% margin (أكثر عدم يقين)
      
      return {
        date,
        predicted: pred,
        confidence: Math.min(100, Math.max(0, confidence)),
        lower: Math.max(0, pred - margin),
        upper: pred + margin,
        trend: i === 0 ? 'stable' : predictions[i] > predictions[i - 1] ? 'up' : 'down',
      };
    });
    
    return {
      metric: 'CFI',
      predictions: results,
      accuracy: error,
      model: 'exponential',
      confidence: Math.min(100, Math.max(0, confidence)),
    };
  }

  /**
   * التنبؤ بـ HRI (Hope & Resilience Index)
   */
  forecastHRI(days: number = 7): ForecastResult {
    const hriData = this.historicalData.map(d => d.hri);
    
    if (hriData.length < 7) {
      throw new Error('Not enough historical data for prediction');
    }
    
    // استخدام Moving Average للأمل (أكثر استقراراً)
    const predictions = this.maModel.predict(hriData, days);
    
    // حساب الثقة
    const ma = this.maModel.calculate(hriData);
    const error = this.linearModel.calculateError(hriData, ma);
    const confidence = Math.max(0, 100 - error.mape);
    
    // تحويل إلى نتائج
    const results: PredictionResult[] = predictions.map((pred, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      
      const margin = Math.abs(pred) * 0.08; // 8% margin (أقل عدم يقين)
      
      return {
        date,
        predicted: pred,
        confidence: Math.min(100, Math.max(0, confidence)),
        lower: Math.max(0, pred - margin),
        upper: pred + margin,
        trend: i === 0 ? 'stable' : predictions[i] > predictions[i - 1] ? 'up' : 'down',
      };
    });
    
    return {
      metric: 'HRI',
      predictions: results,
      accuracy: error,
      model: 'moving_average',
      confidence: Math.min(100, Math.max(0, confidence)),
    };
  }

  /**
   * تحليل السيناريوهات (متفائل، واقعي، متشائم)
   */
  analyzeScenarios(metric: 'GMI' | 'CFI' | 'HRI', days: number = 7): ScenarioAnalysis {
    let forecast: ForecastResult;
    
    if (metric === 'GMI') {
      forecast = this.forecastGMI(days);
    } else if (metric === 'CFI') {
      forecast = this.forecastCFI(days);
    } else {
      forecast = this.forecastHRI(days);
    }
    
    return {
      optimistic: forecast.predictions.map(p => ({
        ...p,
        predicted: p.upper,
      })),
      realistic: forecast.predictions,
      pessimistic: forecast.predictions.map(p => ({
        ...p,
        predicted: p.lower,
      })),
    };
  }

  /**
   * التنبؤ بالموضوعات الناشئة
   */
  forecastEmergingTopics(days: number = 7): { topic: string; probability: number; trend: 'emerging' | 'declining' | 'stable' }[] {
    const topicCounts: Record<string, number[]> = {};
    
    // جمع البيانات حسب الموضوع
    for (const data of this.historicalData) {
      if (!topicCounts[data.topic]) {
        topicCounts[data.topic] = [];
      }
      topicCounts[data.topic].push(1);
    }
    
    // التنبؤ لكل موضوع
    const predictions: { topic: string; probability: number; trend: 'emerging' | 'declining' | 'stable' }[] = [];
    
    for (const [topic, counts] of Object.entries(topicCounts)) {
      if (counts.length < 3) continue;
      
      const ma = new MovingAverageModel(3);
      const predicted = ma.predict(counts, 1)[0];
      const current = counts[counts.length - 1];
      
      let trend: 'emerging' | 'declining' | 'stable' = 'stable';
      if (predicted > current * 1.2) trend = 'emerging';
      if (predicted < current * 0.8) trend = 'declining';
      
      predictions.push({
        topic,
        probability: Math.min(100, (predicted / current) * 100),
        trend,
      });
    }
    
    return predictions.sort((a, b) => b.probability - a.probability);
  }

  /**
   * الحصول على البيانات التاريخية
   */
  getHistoricalData(): HistoricalDataPoint[] {
    return this.historicalData;
  }

  /**
   * مسح البيانات
   */
  clearData(): void {
    this.historicalData = [];
  }
}

// ============================================================================
// Export
// ============================================================================

export const predictionEngine = new PredictionEngine();
