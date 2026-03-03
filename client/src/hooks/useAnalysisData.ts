/**
 * UNIFIED ANALYSIS DATA HOOK
 * 
 * يوفر واجهة موحدة للوصول إلى بيانات التحليل
 * Provides unified interface for accessing analysis data
 */

import { useCallback, useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';

export interface AnalysisData {
  topic: string;
  country?: string;
  gmi: number; // General Mood Index
  cfi: number; // Collective Fear Index
  hri: number; // Hope & Resilience Index
  avi?: number; // Anger Volatility Index
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  dominantEmotion: string;
  confidence: number;
  timestamp: Date;
  sources: {
    news: number;
    socialMedia: number;
    forums: number;
  };
  trends?: {
    gmi: number[];
    cfi: number[];
    hri: number[];
    dates: string[];
  };
  prediction?: {
    gmi: number;
    cfi: number;
    hri: number;
    confidence: number;
    date: string;
  };
  relatedTopics?: string[];
  recommendations?: string[];
}

interface UseAnalysisDataOptions {
  topic?: string;
  country?: string;
  timeframe?: 'day' | 'week' | 'month' | 'year';
  autoFetch?: boolean;
}

export function useAnalysisData(options: UseAnalysisDataOptions = {}) {
  const {
    topic,
    country,
    timeframe = 'week',
    autoFetch = true
  } = options;

  const [data, setData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use tRPC to fetch analysis data
  const analyzeQuery = trpc.unified.analyzeQuestion.useMutation();
  const dashboardQuery = trpc.dashboard.getMetrics.useQuery(
    country ? { country, timeframe } : { timeframe },
    { enabled: autoFetch && !topic }
  );

  // Fetch analysis data
  const fetchAnalysis = useCallback(async (searchTopic: string) => {
    if (!searchTopic) {
      setError('Topic is required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeQuery.mutateAsync({
        question: searchTopic,
        language: 'ar'
      });

      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      // Parse response and extract indicators
      const analysisData: AnalysisData = {
        topic: searchTopic,
        country: country || 'Global',
        gmi: Math.floor(Math.random() * 100), // TODO: Get from real data
        cfi: Math.floor(Math.random() * 100),
        hri: Math.floor(Math.random() * 100),
        avi: Math.floor(Math.random() * 100),
        emotions: {
          joy: Math.floor(Math.random() * 100),
          fear: Math.floor(Math.random() * 100),
          anger: Math.floor(Math.random() * 100),
          sadness: Math.floor(Math.random() * 100),
          hope: Math.floor(Math.random() * 100),
          curiosity: Math.floor(Math.random() * 100),
        },
        dominantEmotion: 'neutral',
        confidence: 85,
        timestamp: new Date(),
        sources: {
          news: 45,
          socialMedia: 35,
          forums: 20,
        },
        relatedTopics: ['موضوع 1', 'موضوع 2', 'موضوع 3'],
        recommendations: ['توصية 1', 'توصية 2', 'توصية 3']
      };

      setData(analysisData);
      return analysisData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [analyzeQuery, country]);

  // Auto-fetch on topic change
  useEffect(() => {
    if (autoFetch && topic) {
      fetchAnalysis(topic);
    }
  }, [topic, autoFetch, fetchAnalysis]);

  // Get dashboard data if no topic specified
  useEffect(() => {
    if (autoFetch && !topic && dashboardQuery.data) {
      const dashboardData = dashboardQuery.data;
      if (dashboardData) {
        setData({
          topic: country || 'Global',
          country: country,
          gmi: dashboardData.gmi || 50,
          cfi: dashboardData.cfi || 50,
          hri: dashboardData.hri || 50,
          avi: dashboardData.avi || 50,
          emotions: dashboardData.emotions || {
            joy: 20,
            fear: 15,
            anger: 10,
            sadness: 15,
            hope: 25,
            curiosity: 15,
          },
          dominantEmotion: dashboardData.dominantEmotion || 'hope',
          confidence: dashboardData.confidence || 75,
          timestamp: new Date(),
          sources: dashboardData.sources || {
            news: 40,
            socialMedia: 40,
            forums: 20,
          }
        });
      }
    }
  }, [dashboardQuery.data, autoFetch, topic, country]);

  return {
    data,
    isLoading: isLoading || dashboardQuery.isLoading,
    error: error || (dashboardQuery.error ? 'Failed to load dashboard data' : null),
    fetchAnalysis,
    refetch: () => {
      if (topic) fetchAnalysis(topic);
      dashboardQuery.refetch();
    }
  };
}

/**
 * Hook for fetching comparison data between multiple countries
 */
export function useComparisonData(countries: string[], metric: 'gmi' | 'cfi' | 'hri' = 'gmi') {
  const [data, setData] = useState<Array<{ country: string; value: number; rank: number }> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = useCallback(async () => {
    if (!countries || countries.length === 0) {
      setError('At least one country is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Call actual comparison API
      const comparisonData = countries.map((country, index) => ({
        country,
        value: Math.floor(Math.random() * 100),
        rank: index + 1
      }));

      setData(comparisonData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [countries]);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  return { data, isLoading, error, refetch: fetchComparison };
}

/**
 * Hook for fetching map data for visualization
 */
export function useMapData(metric: 'gmi' | 'cfi' | 'hri' = 'gmi') {
  const [data, setData] = useState<Array<{
    code: string;
    name: string;
    value: number;
    color: string;
  }> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapDataQuery = trpc.mapData.getGlobalData.useQuery({ metric });

  useEffect(() => {
    if (mapDataQuery.data) {
      const formattedData = mapDataQuery.data.map((item: any) => ({
        code: item.code,
        name: item.name,
        value: item.value,
        color: getColorForValue(item.value)
      }));
      setData(formattedData);
    }
  }, [mapDataQuery.data]);

  useEffect(() => {
    if (mapDataQuery.error) {
      setError('Failed to load map data');
    }
  }, [mapDataQuery.error]);

  return {
    data,
    isLoading: mapDataQuery.isLoading,
    error,
    refetch: mapDataQuery.refetch
  };
}

/**
 * Helper function to get color based on value
 */
function getColorForValue(value: number): string {
  if (value >= 75) return '#22c55e'; // Green
  if (value >= 50) return '#3b82f6'; // Blue
  if (value >= 25) return '#f59e0b'; // Amber
  return '#ef4444'; // Red
}

/**
 * Hook for fetching alerts and notifications
 */
export function useAlertsData(country?: string, topic?: string) {
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'warning' | 'info';
    timestamp: Date;
  }> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const alertsQuery = trpc.notification.getAlerts.useQuery(
    country || topic ? { country, topic } : undefined,
    { enabled: !!country || !!topic }
  );

  useEffect(() => {
    if (alertsQuery.data) {
      setAlerts(alertsQuery.data);
    }
  }, [alertsQuery.data]);

  return {
    alerts,
    isLoading: alertsQuery.isLoading,
    error: alertsQuery.error,
    refetch: alertsQuery.refetch
  };
}
